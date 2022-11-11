import { apiJSON } from '#test/utils';
import { validUser } from '#test/validators';

import objEqual from 'fast-deep-equal';


// =============================================================================


/* Simple internal helper; all requests in this module require JSON, and some
 * may require a token. This wraps up the logic so the tests are clearer. */
async function request(endpoint, token) {
  const options = {}
  if (token !== undefined) {
    options.headers = {
      'Cookie': token
    }
  }

  return apiJSON(endpoint, options);
}


// =============================================================================


/* Test:
 *    /api/v1/user
 *
 * This endpoint fetches information about the current user; the result is an
 * empty object if there is no authorization or the authorization is invalid,
 * and a user object if there is a valid user. */
export async function test({Assert, Section}, context) {
  // When there is no token, there should be no user; object should be empty
  Section `User Info: No Current User`;
  const { res: res1, json: emptyUser } = await request('/api/v1/user');

  Assert(res1)('status').eq(200);
  Assert(emptyUser)
    (Object.keys)('length').eq(0);

  // ---------------------------------

  // An invalid/corrupted token should behave as if there is no token at all.
  Section `User Info: Invalid Token`;
  const { res: res2, json: invalidUser } = await request('/api/v1/user', context.brokenToken);

  Assert(res2)('status').eq(200);
  Assert(invalidUser)
    (Object.keys)('length').eq(0);

  // ---------------------------------

  // When presented with a token for a user, we should get that user back
  Section `User Info: Valid Token`;
  const { res: res3, json: user } = await request('/api/v1/user', context.authToken);

  Assert(res3)('status').eq(200);
  Assert(user)
    (obj => objEqual(context.userInfo, obj)).eq(true);

  // ---------------------------------

  Section `User Info: Schema validation`;
  Assert(user)(validUser).eq(true);
}


// =============================================================================
