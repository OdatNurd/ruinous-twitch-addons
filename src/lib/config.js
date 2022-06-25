import 'dotenv/config';

import convict from 'convict';


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


/* This sets the configuration schema to be used for the overlay. */
export const config = convict({
  env: {
    doc: "The environment that we're running in",
    format: ['development', 'staging', 'production'],
    env: 'NODE_ENV',
    default: 'development'
  },

  // For connecting to the PostgreSQL database
  db: {
    url: {
      doc: 'The URL to connect to the PostgreSWL database with',
      format: required,
      env: 'DATABASE_URL',
      sensitive: true,
      default: null,
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


// =============================================================================


/* Validate that the configuration is correct; this will throw an error if
 * any required values are missing. */
config.validate();
