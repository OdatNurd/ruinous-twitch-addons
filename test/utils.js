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
  await Promise.all([context.addonId, context.overlayAddonId].map(async (item) => {
    await api(`/api/v1/user/addons/${item}`, {
      method: 'DELETE',
      headers: {
        "Cookie": context.authToken
      }
    });
  }));

  // In order to test overlays we need to have an addon installed that has one;
  // Install the overlay test addon now and capture the overlayId. Has to be
  // done here so taht the ID is ready when the test runs.
  const { res, json: testAddon } = await apiJSON(`/api/v1/user/addons/${context.overlayAddonId}`, {
    method: 'POST',
    headers: {
      "Cookie": context.authToken
    }
  });
  context.overlayId = testAddon.overlayId;
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
 * include the entire URL fragment, e.g. `/api/v1/user`).
 *
 * If options are provided, they are used in the query.
 *
 * The return value is the response object from the fetch call; this can be
 * introspected and the body can be handled as desired if needed. */
export async function api(endpoint, options) {
  const URL = `http://localhost:${process.env.PORT}${endpoint}`;
  options = options ?? {}

  return await fetch(URL, options);
}


// =============================================================================


/* This is a friendly wrapper around api which assumes that the result that is
 * coming back will always contain valid JSON, and does the work of fetching
 * that data for you directly.
 *
 * The return value is an object that contains ther response object and the
 * JSON. */
export async function apiJSON(endpoint, options) {
  const res = await api(endpoint, options);
  const json = await res.json();

  return { res, json }
}


// =============================================================================


/* Given a full and complete URL, verify if it matches the endpoint provided. */
export function endpointMatch(inputURL, endpoint) {
  return inputURL === `http://localhost:${process.env.PORT}${endpoint}`;
}

// =============================================================================

