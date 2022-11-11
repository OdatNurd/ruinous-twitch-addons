import { apiJSON } from '#test/utils';

import { validAddon } from '#test/validators';


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
 *    /api/v1/addons/:addonId
 *
 * This endpoint fetches information about a specific addon. It behaves the
 * same as the endpoint without the addonId except that it returns only the
 * information for a specific addon rather than all of them. */
 export async function test({Assert, Section}, context) {
  // Search for information on an invalid addon should fail with no user
  Section `Addon Info: Fetch invalid addon info (no user)`;
  const { res: res1, json: invalid1 } = await request(`/api/v1/addons/${context.addonId}-invalid`);

  Assert(res1)('status').eq(404);
  Assert(invalid1)('success').eq(false);

  // ---------------------------------

  // Search for information on an invalid addon should fail even with a user
  Section `Addon Info: Fetch invalid addon info (with user)`;
  const { res: res2, json: invalid2 } = await request(`/api/v1/addons/${context.addonId}-invalid`, context.authToken);

  Assert(res2)('status').eq(404);
  Assert(invalid2)('success').eq(false);

  // ---------------------------------

  // Search for information on the test addon that we installed should return
  // valid addon Info but not be flagged as installed at all if there is no user
  // logged in.
  Section `Addon Info: Fetch installed addon info (no user)`;
  const { res: res3, json: valid1 } = await request(`/api/v1/addons/${context.overlayAddonId}`);

  Assert(res3)('status').eq(200);
  Assert(valid1)
    ('installed').eq(false)
    ('overlayUrl').eq('');

  // ---------------------------------

  Section `Addon Info: Schema validation for installed addon record (no user)`;
  Assert(valid1)
    (validAddon).eq(true);

  // ---------------------------------

  // Search for information on the test addon that we installed should return
  // valid addon Info but and be flagged as installed when there is a user
  // logged in.
  Section `Addon Info: Fetch installed addon info (with user)`;
  const { res: res4, json: valid2 } = await request(`/api/v1/addons/${context.overlayAddonId}`, context.authToken);

  Assert(res4)('status').eq(200);
  Assert(valid2)
    ('installed').eq(true)
    ('overlayUrl')
      (url => url.endsWith(`/${context.overlayId}`)).eq(true);

  // ---------------------------------

  // Search for information on the test addon that we know is not installed
  // should return valid addon Info but not be flagged as installed.
  Section `Addon Info: Fetch uninstalled addon info (no user)`;
  const { res: res5, json: valid3 } = await request(`/api/v1/addons/${context.addonId}`);

  Assert(res5)('status').eq(200);
  Assert(valid3)
    ('installed').eq(false)
    ('overlayUrl').eq('');

  // ---------------------------------

  Section `Addon Info: Schema validation for uninstalled addon record (with user)`;
  Assert(valid3)
    (validAddon).eq(true);

  // ---------------------------------

  // Search for information on the test addon that we know is not installed
  // should return valid addon Info but and be flagged as installed.
  Section `Addon Info: Fetch uninstalled addon info (with user)`;
  const { res: res6, json: valid4 } = await request(`/api/v1/addons/${context.addonId}`, context.authToken);

  Assert(res6)('status').eq(200);
  Assert(valid3)
    ('installed').eq(false)
    ('overlayUrl').eq('');
}


// =============================================================================
