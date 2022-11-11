import { api, apiJSON } from '#test/utils';
import { validAddonInstall, validAddonList } from '#test/validators';


// =============================================================================


/* Simple internal helper; some requests in this module require JSON, and some
 * may require a token but all require a method. This wraps up the logic so the
 * tests are clearer. */
async function request(endpoint, method, token, resolveJSON) {
  const options = { method }
  if (token !== undefined) {
    options.headers = {
      'Cookie': token
    }
  }

  if (resolveJSON === true) {
    return apiJSON(endpoint, options);
  }

  return api(endpoint, options);
}


// =============================================================================


/* Test:
 *    /api/v1/user/addons
 *
 * This endpoint is for querying and manipulating the list of addons for a
 * specific user. This includes getting the list of addons that exist, adding
 * new installations, and removing old ones.
 *
 * Implicitly, installing addons can also add overlays, but we test that in a
 * separate location. */
 export async function test({Assert, Section}, context) {
  // You should not be able to uninstall an addon that is not yet installed.
  Section `User Addons: Uninstall when not installed`;
  const res1 = await request(`/api/v1/user/addons/${context.addonId}`, 'DELETE', context.authToken);

  Assert(res1)('status').eq(404);

  // ---------------------------------

  // When a valid addon is not installed, it should be installable.
  Section `User Addons: Install of valid addon`;
  const { res: res2, json: added } = await request(`/api/v1/user/addons/${context.addonId}`, 'POST', context.authToken, true);

  Assert(res2)('status').eq(201);

  // ---------------------------------

  Section `User Addons: Schema validation for install record`;
  Assert(added)(validAddonInstall).eq(true);

  // ---------------------------------

  // It should not be possible to install an addon that is already installed.
  Section `User Addons: Install when already installed`;
  const { res: res3, json: notAdded } = await request(`/api/v1/user/addons/${context.addonId}`, 'POST', context.authToken, true);

  Assert(res3)('status').eq(409);
  Assert(notAdded)('success').eq(false);

  // ---------------------------------

  // It should not be possible to install an addon that does not exist
  Section `User Addons: Install of invalid addon`;
  const { res: res4, json: nonexistant } = await request(`/api/v1/user/addons/${context.addonId}-invalid`, 'POST', context.authToken, true);

  Assert(res4)('status').eq(404);
  Assert(nonexistant)('success').eq(false);

  // ---------------------------------

  // We should be able to uninstall an addon that is actually installed
  Section `User Addons: Uninstall when installed`;
  const res5 = await request(`/api/v1/user/addons/${context.addonId}`, 'DELETE', context.authToken);

  // This should result in a 404 error because this addon is not actually
  // installed.
  Assert(res5)('status').eq(204);

  // ---------------------------------

  // You should not be able to uninstall an addon that does not exist
  Section `User Addons: Uninstall of invalid addon`;
  const res6 = await request(`/api/v1/user/addons/${context.addonId}-invalid`, 'DELETE', context.authToken);

  Assert(res6)('status').eq(404);

  // ---------------------------------

  // The list of addons that are installed should at this point be a known
  // quantity.
  Section `User Addons: Validate installed addons`;

  const { res: res7, json: addonList } = await request('/api/v1/user/addons', 'GET', context.authToken, true);

  Assert(res7)('status').eq(200);
  Assert(addonList)('length').eq(1);

  // We expect a single addon, which we also want to validate
  const addon = (addonList.length === 1) ? addonList[0] : {};

  Assert(addon)
    ('addonId').eq(context.overlayAddonId)
    ('installed').eq(true)
    ('overlayId').eq(context.overlayId);

  // ---------------------------------

  Section `User Addons: Schema validation for list of installed addons`;
  Assert(addonList)
     (validAddonList).eq(true);

  // ---------------------------------

  // The list of addons that are installed should cause an error if there is
  // no user.
  Section `User Addons: Fetch installed with no user logged in`;

  const { res: res8, json: addonListFail } = await request('/api/v1/user/addons', 'GET', undefined, true);

  Assert(res8)('status').eq(401);
  Assert(addonListFail)('success').eq(false);

  // ---------------------------------

  // Installation should fail when there is no user to install for
  Section `User Addons: Install addon with no user logged in`;

  const { res: res9, json: addUnauth } = await request(`/api/v1/user/addons/${context.addonId}`, 'POST', undefined, true);

  Assert(res9)('status').eq(401);
  Assert(addUnauth)('success').eq(false);

  // ---------------------------------

  // Uninstalling should fail when there is no user to uninstall for
  Section `User Addons: Uninstall addon with no user logged in`;

  const res10 = await request(`/api/v1/user/addons/${context.addonId}`, 'DELETE');

  Assert(res10)('status').eq(401);
}


// =============================================================================
