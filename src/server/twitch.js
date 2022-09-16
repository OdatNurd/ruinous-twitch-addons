import { config } from './config.js';
import { logger } from './logger.js';
import { db, encrypt, decrypt } from './lib/db.js';

import { RefreshingAuthProvider } from '@twurple/auth';
import { ChatClient } from '@twurple/chat';


// =============================================================================


/* Cache the userId of the bot user, since it's used in a variety of places. */
const botUserId = config.get('twitch.botUserId');

/* This stores the ChatClient instance that allows us to talk to Twitch chat.
 *
 * When it's undefined, there is no chat user set up yet and no chat messages
 * can be sent or received. */
let chatClient = undefined;

/* Get our subsystem logger. */
const log = logger('twitch');


// =============================================================================


/* This is intended to be called only at startup, and cleans up the database
 * information in case the configured userId that represents the bot account
 * has changed.
 *
 * Our Database stores Twitch user information, and for the user that represents
 * the bot, it is also flagged as being the bot account. Similarly we store the
 * Twitch user access token for the bot account.
 *
 * If the bot account is logged in, and then the configuration changes, we don't
 * want to keep that old bot token around, and we don't want the user to be
 * flagged as a bot if they're not. */
async function pruneOutdatedBotInformation(db) {
  // Find all TwitchToken records in the database for whom the userId of the
  // token is not the current bot account; those need to be removed from the
  // table because that user is no longer the bot account.
  await db.twitchToken.deleteMany({
    where: {
      NOT: {
        userId: botUserId
      }
    }
  });

  // Find all TwitchUser records in the database for whom the userId of the
  // token is not the current bot account; those need to have their bot flag
  // disabled since they're not the bot.
  await db.twitchUser.updateMany({
    where: {
      NOT: {
        userId: botUserId
      }
    },
    data: {
      isBot: false
    }
  });
}


// =============================================================================


/* Find the record in the TwitchToken table that represents the current bot user
 * and, if there is one, decrypt it and return it back.
 *
 * If the record can't be found, then this returns null. */
async function getBotToken(db) {
  // Try to find the token associated with the currently configured bot account;
  // there might not be one.
  const dbToken = await db.twitchToken.findFirst({
    where: {
      userId: botUserId
    }
  });

  // If we got some token information, then decrypt it.
  if (dbToken !== null) {
    dbToken.accessToken = decrypt(dbToken.accessToken);
    dbToken.refreshToken = decrypt(dbToken.refreshToken);
  }

  return dbToken;
}


// =============================================================================


/* Given a (potential) User token that represents the user that is the bot,
 * this will configure the back end connection to Twitch in order to be able
 * to participate in the chats of users.
 *
 * This will silently do nothing if the bot token passed in is null, or when
 * the back end chat system is already enabled and connected. */
export async function configureTwitchChat(botUserToken) {
  // If we're already configured to talk to the chat, OR we were not given a
  // token that can be used to do that, leave now without doing anything.
  if (chatClient !== undefined || botUserToken === null) {
    log.warn('no Twitch credentials available for the bot; cannot start chat');
    return
  }

  // Determine if we should log incoming chat or not.
  const logChat = config.get('twitch.logChat');
  log.info(`chat logging is ${logChat ? 'enabled' : 'disabled'}`)

  // Using the token information we were given, set up an authorization provider
  // that knows how to refresh itself when the token expires.
  const botUserAuth = new RefreshingAuthProvider(
    {
      clientId: config.get('twitch.clientId'),
      clientSecret: config.get('twitch.clientSecret'),
      onRefresh: async newData => {
        log.debug(`refreshing bot token`);
        await db.twitchToken.update({
          where: { userId: botUserId },
          data: {
            accessToken: encrypt(newData.accessToken),
            refreshToken: encrypt(newData.refreshToken),
            scopes: newData.scopes || [],
            obtainmentTimestamp: newData.obtainmentTimestamp,
            expiresIn: newData.expiresIn
          }
        });
      }
    },
    botUserToken
  );

  // Create a new chat client using the provided authorization.
  chatClient = new ChatClient({
    authProvider: botUserAuth,
    channels: ['#odatnurd'],
    botLevel: "known",   // "none", "known" or "verified"

    // When this is true, the code assumes that the bot account is a mod and
    // uses a different rate limiter. If the bot is not ACTUALLY a mod and you
    // do this, you may end up getting it throttled, which is Not Good (tm).
    isAlwaysMod: false,
  });

  // When a chat message is received, display it.
  chatClient.onMessage((channel, user, message, rawMsg) => {
    if (logChat) {
      log.info(`${channel}:<${user}> ${message}`);
    }
  });

  // Display a notification when the chat connects,.
  chatClient.onConnect(() => {
    log.info('chat connection established');
  });

  // Display a notification when the chat disconnects.
  chatClient.onDisconnect((_manually, _reason) => {
    log.info('chat has been disconnected');
  });

  // Handle a situation in which authentication of the bot failed; this would
  // happen if the bot user redacts our ability to talk to chat from within
  // Twitch without disconnecting in the app, for example.
  chatClient.onAuthenticationFailure(message => {
    log.error(`chat authentication failed: ${message}`);
  });

  // As a part of the connection mechanism, we also need to tell the server
  // what name we're known by. Once that happens, this event triggers.
  chatClient.onRegister(() => {
    log.info(`registered with chat as ${chatClient.currentNick}`);
  });

  // Handle cases where sending messages fails due to being rate limited or
  // other reasons.
  chatClient.onMessageFailed((channel, reason) => log.error(`${channel}: message send failed: ${reason}`));
  chatClient.onMessageRatelimit((channel, message) => log.error(`${channel}: rate limit hit; did not send: ${message}`));

  // We're done, so indicate that we're connecting to twitch.
  log.info('connecting to chat and joining channel(s)');
  await chatClient.connect();
}


// =============================================================================


/* Set up all of our integrations with Twitch, which includes throwing away old
 * bot information that might exist from a previous run, and then configuring
 * the Twitch chat to connect to the appropriate places. */
export async function setupTwitchIntegrations() {
  // Update the database to prune away any outdated Bot information; if the
  // account to use for the bot has changed since the last run, this will make
  // sure that they're not flagged as a bot and that any stord token we might
  // have had is discarded.
  await pruneOutdatedBotInformation(db);

  // Using some sort of token, set up; only if there is one though.
  await configureTwitchChat(await getBotToken(db));
}


// =============================================================================
