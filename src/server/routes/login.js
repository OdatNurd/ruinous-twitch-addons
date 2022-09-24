import { config } from '#core/config';
import { logger } from '#core/logger';

import { db, dbErrResponse, encrypt } from '#lib/db';
import { configureTwitchChat } from '#core/twitch';

import { StaticAuthProvider, exchangeCode } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';


// =============================================================================


/* When users log in, this specifies the access scopes that they will be asked
 * to grant. This is as limited as possible in scope and contains only the
 * essential scopes. */
const bot_token_scopes = ['chat:read', 'chat:edit'];

/* When authorizing with twitch, this object makes up the basis by which we
 * construct the GET request paramters that tells Twitch how to proceed with
 * the login. */
const authParams = {
  client_id: config.get('twitch.clientId'),
  redirect_uri: config.get('twitch.callbackURL'),
  response_type: 'code',
  scope: bot_token_scopes.join(' ')
};

/* Get our subsystem logger; this subsystem is shared with the auth code but
 * separation of concerns makes it make more sense to have both sets of code
 * separate. */
const log = logger('auth');


// =============================================================================


/* Handle a GET request on behalf of the /login route.
 *
 * This serves two jobs:
 *   - If this page loads and it doesn't have one of the keys that Twitch uses
 *     to tell us about a completed authorization attempt, then this will start
 *     the login process by redirecting the page to Twitch.
 *
 *   - If this page loads with a Twitch auth result in the query parmaters,
 *     then this completes the login by updating the database as appropriate,
 *     creating a JWT and passing it back as a cookie via a redirect to the root
 *     of the site. */
export async function doTwitchLogin(db, req, res) {
  try {
    // We get a code if the user authorized and an error if they did not; if those
    // are missing, then we're getting sent here so that someone can log in;
    // redirect to the twitch authorization page.
    const params = req.query;
    if (params.code === undefined && params.error == undefined) {
      // Pull from the incoming route what the redirected result should be on
      // success; this is any extra path after the main /login base route, and
      // defaults to the root of the site if not provided.
      //
      // In order to construct a URL we need to add in the protocol and such;
      // the hostname doesn't matter since we're just getting it to parse the
      // path.
      const url = new URL(`https://localhost${req.url}`);
      let returnRoute = url.pathname.substr('/login'.length);
      returnRoute = (returnRoute === '') ? '/' : returnRoute

      // If the request we get has a force paramter in it, then we want to include
      // a field in our Twitch authorization request that tells Twitch to force
      // the user to verify that they want to grant permission.
      //
      // Without this, if the user has previously authorized this application,
      // Twitch will directly authorize and return without prompting the user
      // first.
      const loginParams = new URLSearchParams(authParams);
      if (params.force !== undefined) {
        loginParams.set('force_verify', true)
      }

      // Use the state paramter to indicate what route to return on; this will
      // come back to us unmolested.
      loginParams.set('state', returnRoute);

      return res.status(302).set({
        location: `https://id.twitch.tv/oauth2/authorize?${loginParams}`
      }).send();
    }

    // The headers that we will inject into our returned response, if any.
    // This defaults to the root unless the operation was a success, in which
    // case we use the state that came back in the response.
    const headers = {
      location: '/'
    };

    // If there's not a code, then there must be an error; either the user decided
    // to bail or something untoward happened; either way back to the root page.
    const code = params.code;
    const state = params.state;
    if (code !== undefined) {
      try {
        // Exchange the code we were given with Twitch to get an access code. This
        // makes a request to the Twitch back end.
        const rawToken = await exchangeCode(
          config.get('twitch.clientId'),
          config.get('twitch.clientSecret'),
          code,
          config.get('twitch.callbackURL'));

        // Create an authorization provider out of the token
        const authProvider = new StaticAuthProvider(config.get('twitch.clientId'), rawToken.accessToken);

        // Create an API client using the authorization provider, then get
        // information about the user that just authenticated.
        const api = new ApiClient({ authProvider });
        const userInfo = await api.users.getMe();

        // Determine if this account is the bot account or not, and set up an
        // object to track the data that we'll be saving.
        let isBot = (userInfo.id === config.get('twitch.botUserId'));
        const userRecord = {
          isBot,
          username: userInfo.name,
          displayName: userInfo.displayName,
          profilePic: userInfo.profilePictureUrl
        }

        // Create a new record for this user OR update an existing record with
        // new information (for example the user could have altered their displayName
        // since the last time they logged in)
        await db.twitchUser.upsert({
          where: {
            userId: userInfo.id,
          },
          update: userRecord,
          create: {
            userId: userInfo.id,
            ...userRecord
          }
        });

        log.debug(`logged in ${userInfo.name}/${userInfo.displayName}/${userInfo.id}`);

        // If this user is the Twitch user, then we also need to make sure that
        // we persist the token into the database (or update it if it's already
        // there), and then make sure that the Twitch backend code is updated;
        // for our purposes here that entails making sure that if we're not already
        // connected to Twitch, we do so now.
        if (isBot === true) {
          const tokenRecord = {
            accessToken: encrypt(rawToken.accessToken),
            refreshToken: encrypt(rawToken.refreshToken),
            scopes: rawToken.scopes || [],
            obtainmentTimestamp: rawToken.obtainmentTimestamp,
            expiresIn: rawToken.expiresIn
          }

          // Store the bot token into the database; here we need to make sure that
          // the access and refresh tokens are encrypted for safety.
          await db.twitchToken.upsert({
            where: {
              userId: userInfo.id,
            },
            update: tokenRecord,
            create: {
              userId: userInfo.id,
              ...tokenRecord
            }
          });

          // If the Twitch backend API hasn't already been started, do that now.
          await configureTwitchChat(rawToken)
        }

        // Create a token that contains information about the user; this sets the
        // token to expire in the same mount of time as the access token expires,
        // so that the both die together.
        const jwtToken = jwt.sign(
          {
            username: userInfo.name,
            userId: userInfo.id,
            displayName: userInfo.displayName,
            profilePic: userInfo.profilePictureUrl,
          },
          config.get('jwt.private'),
          { algorithm: 'RS256', expiresIn: rawToken.expiresIn }
        );

        // The idea here is that the cookie will be secure in that it will only be
        // served over an https connection, only in requests and not be available
        // to client side code at all, and that it will only be sent to us.
        //
        // Currently I think this is what we want; the sameSite should be correct
        // in production mode, and conventional wisdom would seem to indicate that
        // sameSite strict with localhost is bad mojo.
        headers["Set-Cookie"] = cookie.serialize('authToken', jwtToken, {
          httpOnly: true,
          expires: new Date(Date.now() + (rawToken.expiresIn * 1000)),
          secure: true,

          // We need to use lax because if we make it 'strict', it's so strict
          // that the stupid cookie never actualy gets given to us. Handy! Why? I
          // don't know and I'm kind of beyond caring at the moment.
          sameSite: 'lax'
        });

        // All is well; send the browser to the location that we got back
        headers.location = state;
      } catch (err) {
        log.error(`unable to authorize with twitch: ${err.message}`);
      }
    }

    // If we get here, there was either no code, or there was and the user logged
    // in, or there was but there was a token error; in all cases, go back to the
    // root of the site.
    return res.status(302).set(headers).send();
  }
  catch (error) {
    dbErrResponse(error, res);
  }
}


// =============================================================================
