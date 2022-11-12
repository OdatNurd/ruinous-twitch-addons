import { request, requestWithAuth } from '#test/utils';

import { validConfigResponse } from '#test/validators';

import objEqual from 'fast-deep-equal';


// =============================================================================


/* Test:
 *    /api/v1/user/addons/:addonid/config
 *
 * This endpoint is for querying and manipulating the configuration for a user's
 * installed addons. */
 export async function test({Assert, Section}, context) {
  // You should not be able to fetch the config for a non existant addon
  Section `User Addon Config: Invalid addon`;

  const [ res1, missing ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}-invalid/config`, context.authToken);

  Assert(res1) `status`.eq(404);
  Assert(missing) `success`.eq(false);

  // ---------------------------------

  // You should not be able to fetch config for uninstalled addons
  Section `User Addon Config: Uninstalled addon`;

  const [ res2, uninstalled ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}/config`, context.authToken);

  Assert(res2) `status`.eq(404);
  Assert(uninstalled) `success`.eq(false);

  // ---------------------------------

  // You should not be able to fetch config for an installed addon with no user
  Section `User Addon Config: Installed but no user`;

  const [ res3, noUser ] = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`);

  Assert(res3) `status`.eq(401);
  Assert(noUser) `success`.eq(false);


  // ---------------------------------

  // You should be able to fetch the config for installed addons (with user)
  Section `User Addon Config: Fetch config`;

  const [ res4, valid ] = await requestWithAuth(`/api/v1/user/addons/${context.overlayAddonId}/config`, context.authToken);

  Assert(res4) `status`.eq(200);
  Assert(valid)
    (validConfigResponse).eq(true)
    `userId`.eq(context.userInfo.userId)
    `addonId`.eq(context.overlayAddonId)
    `overlayId`.eq(context.overlayId)
    `config`
      (obj => objEqual({ nickname: 'Curmudgeon' }, obj)).eq(true);

  // ---------------------------------

  // You should not be able to set the config for a non existant addon
  Section `User Addon Config: Update config for invalid addon`;

  const [ res5, updNoExist ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}-invalid/config`, context.authToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  });

  Assert(res5) `status`.eq(404);
  Assert(updNoExist) `success`.eq(false);


  // ---------------------------------

  // You should not be able to set the config for an uninstalled addon
  Section `User Addon Config: Update config for uninstalled addon`;

  const [ res6, updNotInstalled ] = await requestWithAuth(`/api/v1/user/addons/${context.addonId}/config`, context.authToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  });

  Assert(res6) `status`.eq(404);
  Assert(updNotInstalled) `success`.eq(false);


  // ---------------------------------

  // You should not be able to set config for an installed addon with no user
  Section `User Addon Config: Update config for installed (no user)`;

  const [ res7, updNoUser ] = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  });

  Assert(res7) `status`.eq(401);
  Assert(updNoUser) `success`.eq(false);


  // ---------------------------------

  // You should be able to set the config for installed addons (with user)
  Section `User Addon Config: Update config for installed (with user)`;

  const [ res8 ] = await requestWithAuth(`/api/v1/user/addons/${context.overlayAddonId}/config`, context.authToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  }, false);

  Assert(res8) `status`.eq(204);


  // ---------------------------------

  // After setting the config, fetching it should produce the new value
  Section `User Addon Config: Verify config changes for user`;

  const [ res9, verified ] = await requestWithAuth(`/api/v1/user/addons/${context.overlayAddonId}/config`, context.authToken);

  Assert(res9) `status`.eq(200);
  Assert(verified)
    `config`
      (obj => objEqual({ nickname: 'WhoDatNurd' }, obj)).eq(true);

  // ---------------------------------

}

// =============================================================================
