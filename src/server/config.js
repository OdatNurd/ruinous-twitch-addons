import 'dotenv/config';

import convict from 'convict';

import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

/* __dirname is not available in this module type, but we can create our own
 * value with the same name based on the URL of the current file. */
const __dirname = dirname(fileURLToPath(import.meta.url));


// =============================================================================


/* This simple handler verifies that the value provided is non-null and throws
 * if it is. This is used to enforce configuration options that must exist in
 * combination with having their default values be null. */
const required = value => {
  if (value === null) {
    throw new Error('A configuration value for this key must be provided');
  }
};


// =============================================================================


/* This handler is an extension of the above and further verifies that the
 * value is exactly 32 characters long; this is required for the encryption
 * secret. */
const required_len_32 = value => {
  required(value);
  if (value.length !== 32) {
    throw new Error(`This value must be exactly 32 characters long (it is ${value.length}) currently`);
  }
}


// =============================================================================


/* This sets the configuration schema to be used for the overlay. */
export const config = convict({
  // When we start up the configuration system, this value is populated with the
  // current base directory of the project, so that it can be accessed
  // throughout the system by anything that has access to the config.
  baseDir: {
    doc: 'The directory that represents the root of the project; set at runtime',
    format: '*',
    default: ''
  },

  env: {
    doc: "The environment that we're running in",
    format: ['development', 'staging', 'production'],
    env: 'NODE_ENV',
    default: 'development'
  },

  port: {
    doc: 'The port that the server should listen on',
    format: 'port',
    env: 'PORT',
    default: 3000
  },

  overlayBase: {
    doc: 'When generating overlay URLs for users, this sets what the base URL is',
    format: required,
    env: 'OVERLAY_URL_BASE',
    default: null
  },

  overlayRedirect: {
    doc: 'When generating overlay URLs for users, this sets where the static overlay files live',
    format: required,
    env: 'OVERLAY_REDIRECT_BASE',
    default: null
  },

  // For connecting to the PostgreSQL database
  db: {
    url: {
      doc: 'The URL to connect to the PostgreSWL database with',
      format: required,
      env: 'DATABASE_URL',
      sensitive: true,
      default: null,
    },
    cryptKey: {
      doc: 'The encryption key used to encrypt sensitive data in the database',
      format: required_len_32,
      env: 'DATABASE_CRYPTO_SECRET',
      sensitive: true,
      default: null
    }
  },

  // These options specify the Twitch application in use and where Twitch is
  // expected to call back to us with the authorization code during our Auth
  // flow.
  twitch: {
    clientId: {
      doc: 'The Client ID of the application underpinning the application',
      format: required,
      env: 'TWITCH_CLIENT_ID',
      default: null
    },
    clientSecret: {
      doc: 'The Twitch Client Secret for the application underpinning the application',
      format: required,
      default: null,
      env: 'TWITCH_CLIENT_SECRET',
      sensitive: true
    },
    callbackURL: {
      doc: 'The configured OAuth callback URL used during user authentication',
      format: required,
      default: null,
      env: 'TWITCH_AUTH_CALLBACK_URL'
    },
    botUserId: {
      doc: 'The Twitch userId of the user that represents the bot',
      format: required,
      default: null,
      env: 'TWITCH_BOT_USERID'
    }
  },

  // These options are used to securely sign and verifify the signatures of our
  // JWT's; the private key is used to sign the token and the public key is
  // used to verify it.
  jwt: {
    private: {
      doc: 'The token signing secret private key; this is a full RSA private key',
      format: required,
      default: null,
      env: 'TOKEN_CRYPTO_PRIVATE',
      sensitive: true
    },

    public: {
      doc: 'The token signing secret public key; this is a full RSA public key',
      format: required,
      default: null,
      env: 'TOKEN_CRYPTO_PUBLIC',
      sensitive: true
    }
  }
});


/* Insert into the configuration object an item which will indicate what the
 * root of the project folder structure is, in case we need to access local
 * files. */
config.set('baseDir', resolve(__dirname, '..'));
console.log(`baseDir is ${config.get('baseDir')}`);


// =============================================================================


/* Validate that the configuration is correct; this will throw an error if
 * any required values are missing. */
config.validate();
