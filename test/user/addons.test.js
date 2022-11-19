import { request, requestWithAuth } from '#test/utils';
import { validAddonInstall, validAddonList } from '#test/validators';

import fetch from "node-fetch";


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
  const [ res1 ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}`, context.authToken, {
    method: 'DELETE',
  }, false);
  Assert(res1) `status`.eq(404);

  // ---------------------------------

  // When a valid addon is not installed, it should be installable.
  Section `User Addons: Install of valid addon`;
  const [ res2, added ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}`, context.authToken, {
    method: 'POST',
  });

  Assert(res2) `status`.eq(201);

  // ---------------------------------

  Section `User Addons: Schema validation for install record`;
  Assert(added)(validAddonInstall).eq(true);

  // ---------------------------------

  // It should not be possible to install an addon that is already installed.
  Section `User Addons: Install when already installed`;
  const [ res3, notAdded ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}`, context.authToken, {
    method: 'POST'
  });

  Assert(res3) `status`.eq(409);
  Assert(notAdded) `success`.eq(false);

  // ---------------------------------

  // It should not be possible to install an addon that does not exist
  Section `User Addons: Install of invalid addon`;
  const [ res4, nonexistant ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}-invalid`, context.authToken, {
    method: 'POST'
  });

  Assert(res4) `status`.eq(404);
  Assert(nonexistant) `success`.eq(false);

  // ---------------------------------

  // We should be able to uninstall an addon that is actually installed
  Section `User Addons: Uninstall when installed`;
  const [ res5 ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}`, context.authToken, {
    method: 'DELETE'
  }, false);

  // This should result in a 404 error because this addon is not actually
  // installed.
  Assert(res5) `status`.eq(204);

  // ---------------------------------

  // You should not be able to uninstall an addon that does not exist
  Section `User Addons: Uninstall of invalid addon`;
  const [ res6 ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}-invalid`, context.authToken, {
    method: 'DELETE'
  }, false);

  Assert(res6) `status`.eq(404);

  // ---------------------------------

  // The list of addons that are installed should at this point be a known
  // quantity.
  Section `User Addons: Validate installed addons`;

  const [ res7, addonList ] = await requestWithAuth('/api/v1/user/addons', context.authToken);

  Assert(res7) `status`.eq(200);
  Assert(addonList) `length`.eq(2);

  // We expect to get two addons; we need to validate the one that is related
  // to the overlayId.
  const addon = addonList.find(e => e.addonId === context.overlayAddonId) ?? {};

  Assert(addon)
    `addonId`.eq(context.overlayAddonId)
    `installed`.eq(true)
    `overlayId`.eq(context.overlayId);

  // ---------------------------------

  Section `User Addons: Schema validation for list of installed addons`;
  Assert(addonList)
     (validAddonList).eq(true);

  // ---------------------------------

  // The list of addons that are installed should cause an error if there is
  // no user.
  Section `User Addons: Fetch installed with no user logged in`;

  const [ res8, addonListFail ] = await request('/api/v1/user/addons');

  Assert(res8) `status`.eq(401);
  Assert(addonListFail) `success`.eq(false);

  // ---------------------------------

  // Installation should fail when there is no user to install for
  Section `User Addons: Install addon with no user logged in`;

  const [ res9, addUnauth ] = await request(`/api/v1/user/addons/${context.addonId}`, {
    method: 'POST'
  });

  Assert(res9) `status`.eq(401);
  Assert(addUnauth) `success`.eq(false);

  // ---------------------------------

  // Uninstalling should fail when there is no user to uninstall for
  Section `User Addons: Uninstall addon with no user logged in`;

  const [ res10 ] = await request(`/api/v1/user/addons/${context.addonId}`, {
    method: 'DELETE'
  }, false);

  Assert(res10) `status`.eq(401);
}


// =============================================================================
