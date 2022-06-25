import { config} from '$lib/config';

import { StaticAuthProvider, exchangeCode } from '@twurple/auth';
import { ApiClient } from '@twurple/api';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';

const bot_token_scopes = ['user:read:email'];

const authParams = {
  client_id: config.get('twitch.clientId'),
  redirect_uri: config.get('twitch.callbackURL'),
  response_type: 'code',
  scope: bot_token_scopes.join(' ')
};


// =============================================================================


export async function get({url}) {
  // We get a code if the user authorized and an error if they did not; if those
  // are missing, then we're getting sent here so that someone can log in;
  // redirect to the twitch authorization page.
  const params = url.searchParams;
  if (params.has('code') === false && params.has('error') == false) {
    // If the request we get has a force paramter in it, then we want to include
    // a field in our Twitch authorization request that tells Twitch to force
    // the user to verify that they want to grant permission.
    //
    // Without this, if the user has previously authorized this application,
    // Twitch will directly authorize and return without prompting the user
    // first.
    const loginParams = new URLSearchParams(authParams);
    if (params.has('force')) {
      loginParams.set('force_verify', true)
    }

    return {
      status: 302,
      headers: {
        location: `https://id.twitch.tv/oauth2/authorize?${loginParams}`
      }
    }
  }

  // The headers that we will inject into our returned response, if any.
  const headers = {
    location: '/'
  };

  // If there's not a code, then there must be an error; either the user decided
  // to bail or something untoward happened; either way back to the root page.
  const code = params.get('code')
  if (code !== null) {
    try {
      // Exchange the code we were given with Twitch to get an access code. This
      // makes a request to the Twitch back end.
      const twitchToken = await exchangeCode(
        config.get('twitch.clientId'),
        config.get('twitch.clientSecret'),
        code,
        config.get('twitch.callbackURL'));

      // Create an authorization provider out of the token
      const authProvider = new StaticAuthProvider(config.get('twitch.clientId'), twitchToken.accessToken);

      // Create an API client using the authorization provider, then get
      // information about the user that just authenticated.
      const api = new ApiClient({ authProvider });
      const userInfo = await api.users.getMe();

      console.log(`Logged in ${userInfo.name}/${userInfo.displayName}/${userInfo.id}`);

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
        { algorithm: 'RS256', expiresIn: twitchToken.expiresIn }
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
        expires: new Date(Date.now() + (twitchToken.expiresIn * 1000)),
        secure: true,

        // We need to use lax because if we make it 'strict', it's so strict
        // that the stupid cookie never actualy gets given to us. Handy! Why? I
        // don't know and I'm kind of beyond caring at the moment.
        sameSite: 'lax'
      });
    } catch (err) {
      console.error(`Unable to authorize with twitch: ${err.message}`);
    }
  }

  // If we get here, there was either no code, or there was and the user logged
  // in, or there was but there was a token error; in all cases, go back to the
  // root of the site.
  return {
    status: 302,
    headers
  }
}


// =============================================================================
