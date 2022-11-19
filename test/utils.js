import cookie from 'cookie';
import jwt from 'jsonwebtoken';

import fetch from "node-fetch";


// =============================================================================


/* The time in seconds until the token that we generate here expires. */
const TOKEN_TTL = 86400;


// =============================================================================


/* This will use the information in the provided context to ensure that the
 * database is set up and ready for tests to run.
 *
 * This includes clearing away any data that may have been left by a previous
 * test run, and adding in any data that needs to be there when the tests
 * start. */
export async function initializeDatabase(context) {
  // Some of our tests install addons; we need to make sure that those
  // installations are not present when we start.
  await Promise.all([context.addonId, context.overlayAddonId, context.schemaAddonId].map(async (item) => {
    await requestWithAuth(`/api/v1/user/addons/${item}`, context.authToken, {
      method: 'DELETE',
    }, false);
  }));

  // In order to test overlays we need to have an addon installed that has one;
  // Install the overlay test addon now and capture the overlayId. Has to be
  // done here so taht the ID is ready when the test runs.
  const [ res, testAddon ] = await requestWithAuth(`/api/v1/user/addons/${context.overlayAddonId}`, context.authToken, {
    method: 'POST',
  });
  context.overlayId = testAddon.overlayId;

  // In order to test the schema handling code, we need to make sure that the
  // addon with the full suite of configuration types is installed.
  await requestWithAuth(`/api/v1/user/addons/${context.schemaAddonId}`, context.authToken, {
    method: 'POST',
  });
}


// =============================================================================


/* This will generate a token for the provided user, set to expire in a set
 * period of time, and then return back a fully encoded cookie that wraps the
 * token, with the cookie also set to expire at the same time as the token.
 *
 * This mimics what is done in the mainline code, but this is a slightly more
 * simplified version since the other version uses the time to live from a
 * Twitch token. In theory this could be generalized and pulled from the main
 * code instead, but I am a bad person, so here we are. */
export function generateTestCookie(userInfo) {
  const jwtToken = jwt.sign(userInfo,
    process.env.TOKEN_CRYPTO_PRIVATE,
    { algorithm: 'RS256', expiresIn: TOKEN_TTL }
  );

  return cookie.serialize('authToken', jwtToken, {
    httpOnly: true,
    expires: new Date(Date.now() + (TOKEN_TTL * 1000)),
    secure: true,
    sameSite: 'lax'
  });
}


// =============================================================================


/* This will execute an API call to the provided API endpoint (which should
 * include just the entire URL fragment, e.g. `/api/v1/user`).
 *
 * If options are provided, they are used in the query; any fetch option can be
 * used here, but for convenience the method is set to GET by default if not
 * provided.
 *
 * This function returns an array of two values; the first is the response
 * object that is the result of the fetch, and the second is the body of the
 * response as decoded JSON; this element will be undefined if getJSON is not
 * true. */
export async function request(endpoint, options={}, getJSON=true) {
  const URL = `http://localhost:${process.env.PORT}${endpoint}`;

  options = {
    method: "GET",
    ...options
  }

  const res = await fetch(URL, options);
  return [res, (getJSON === true) ? await res.json() : undefined ];
}


// =============================================================================


/* This is a wrapper helper around request() that functions identically except
 * that it uses the provided authToken to set an appropriate header in the
 * options object so you don't have to do that yourself. */
export async function requestWithAuth(endpoint, authToken, options={}, getJSON=true) {
  // Make sure there are options, and include the auth token in the headers,
  // also keeping other headers present.
  options.headers = {
    "Cookie": authToken,
    ...(options.headers ?? {})
  }

  return request(endpoint, options, getJSON)
}


// =============================================================================


/* Given a full and complete URL, verify if it matches the endpoint provided. */
export function endpointMatch(inputURL, endpoint) {
  return inputURL === `http://localhost:${process.env.PORT}${endpoint}`;
}


// =============================================================================

