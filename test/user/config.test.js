import { api, apiJSON } from '#test/utils';
import { validConfigResponse } from '#test/validators';

import objEqual from 'fast-deep-equal';


// =============================================================================


/* Simple internal helper; some requests in this module require JSON, and some
 * may require a token but all require a method. This wraps up the logic so the
 * tests are clearer. */
async function request(endpoint, method, token, options, resolveJSON) {
  options = {
    method,
    ...(options || {})
  }

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
 *    /api/v1/user/addons/:addonid/config
 *
 * This endpoint is for querying and manipulating the configuration for a user's
 * installed addons. */
 export async function test({Assert, Section}, context) {
  // You should not be able to fetch the config for a non existant addon
  Section `User Addon Config: Invalid addon`;

  const { res: res1, json: missing } = await request(`/api/v1/user/addons/${context.addonId}-invalid/config`, 'GET', context.authToken, {}, true);

  Assert(res1) `status`.eq(404);
  Assert(missing) `success`.eq(false);

  // ---------------------------------

  // You should not be able to fetch config for uninstalled addons
  Section `User Addon Config: Uninstalled addon`;

  const { res: res2, json: uninstalled } = await request(`/api/v1/user/addons/${context.addonId}/config`, 'GET', context.authToken, {}, true);

  Assert(res2) `status`.eq(404);
  Assert(uninstalled) `success`.eq(false);

  // ---------------------------------

  // You should not be able to fetch config for an installed addon with no user
  Section `User Addon Config: Installed but no user`;

  const { res: res3, json: noUser } = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, 'GET', undefined, {}, true);

  Assert(res3) `status`.eq(401);
  Assert(noUser) `success`.eq(false);


  // ---------------------------------

  // You should be able to fetch the config for installed addons (with user)
  Section `User Addon Config: Fetch config`;

  const { res: res4, json: valid } = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, 'GET', context.authToken, {}, true);

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

  const { res: res5, json: updNoExist} = await request(`/api/v1/user/addons/${context.addonId}-invalid/config`, 'POST', undefined, {
    headers: {
      'Cookie': context.authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  }, true);

  Assert(res5) `status`.eq(404);
  Assert(updNoExist) `success`.eq(false);


  // ---------------------------------

  // You should not be able to set the config for an uninstalled addon
  Section `User Addon Config: Update config for uninstalled addon`;

  const { res: res6, json: updNotInstalled} = await request(`/api/v1/user/addons/${context.addonId}/config`, 'POST', undefined, {
    headers: {
      'Cookie': context.authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  }, true);

  Assert(res6) `status`.eq(404);
  Assert(updNotInstalled) `success`.eq(false);


  // ---------------------------------

  // You should not be able to set config for an installed addon with no user
  Section `User Addon Config: Update config for installed (no user)`;

  const { res: res7, json: updNoUser} = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, 'POST', undefined, {
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  }, true);

  Assert(res7) `status`.eq(401);
  Assert(updNoUser) `success`.eq(false);


  // ---------------------------------

  // You should be able to set the config for installed addons (with user)
  Section `User Addon Config: Update config for installed (with user)`;

  const res8 = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, 'POST', undefined, {
    headers: {
      'Cookie': context.authToken,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      nickname: 'WhoDatNurd'
    })
  });

  Assert(res8) `status`.eq(204);


  // ---------------------------------

  // After setting the config, fetching it should produce the new value
  Section `User Addon Config: Verify config changes for user`;

  const { res: res9, json: verified } = await request(`/api/v1/user/addons/${context.overlayAddonId}/config`, 'GET', context.authToken, {}, true);

  Assert(res9) `status`.eq(200);
  Assert(verified)
    `config`
      (obj => objEqual({ nickname: 'WhoDatNurd' }, obj)).eq(true);
  console.log(verified);

  // ---------------------------------

}

// =============================================================================
