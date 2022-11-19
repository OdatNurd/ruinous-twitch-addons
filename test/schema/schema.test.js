import { validateAddonConfig } from '#core/lib/schema';
import { request, requestWithAuth } from '#test/utils';

import { validConfigResponse } from '#test/validators';

import objEqual from 'fast-deep-equal';


// =============================================================================

/* This is the configuration that should be present in the schema test addon
 * after it's first installed. */
const defaultConfig = {
  nickname: 'Curmudgeon',
  kickTheZed: false,
  placeOfZeke: 'third',
  toadsSprocketed: 69,
  wetnessFactor: 10,
  gigawatts: 1.21,
  lightningCount: 1
};

/* When we attempt to insert an invalid configuration, this is the basis of the
 * one that we try to submit. */
const invalidConfig = {
  nickname: 12,
  kickTheZed: 'false',
  placeOfZeke: 'fourth',
  toadsSprocketed: 6.9,
  wetnessFactor: 100,
  gigawatts: -1.21,
  lightningCount: 2
};

/* Test:
 *    /api/v1/user/addons/:addonid/config
 *
 * This endpoint is for querying and manipulating the configuration for a user's
 * installed addons.
 *
 * Tests in this set specifically validate that the configuration returned from
 * and submitted for changes follow the schema rules properly. */
 export async function test({Assert, Section}, context) {
  // You should be able to fetch the config for installed addons, and it should
  // be valid.
  Section `Addon Config Schema: Fetch and validate config`;

  const [ res1, valid ] = await requestWithAuth(`/api/v1/user/addons/${context.schemaAddonId}/config`, context.authToken);

  Assert(res1) `status`.eq(200);
  Assert(valid)
    (validConfigResponse).eq(true)
    `userId`.eq(context.userInfo.userId)
    `addonId`.eq(context.schemaAddonId)
    `config`
      (obj => objEqual(defaultConfig, obj)).eq(true)
    `config`
      (obj => validateAddonConfig(context.schemaAddonId, obj) === true)

  // ---------------------------------

  // Attempting to violate the constraints of the schema when applying the
  // configuration should fail.
  Section `Addon Config Schema: Set invalid config`;

  const [ res2, invalid ] = await requestWithAuth(`/api/v1/user/addons/${context.schemaAddonId}/config`, context.authToken, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(invalidConfig)
  }, true);

  Assert(res2) `status`.eq(400);
  Assert(invalid)
    `success`.eq(false)
    `reason`.eq('invalid config: item.nickname is not a string, ' +
                                'item.kickTheZed is not a bool, ' +
                                'item.placeOfZeke is not one of: [first, second, third], ' +
                                'item.toadsSprocketed is not an integer, ' +
                                'item.wetnessFactor needs to be at most 10, ' +
                                'item.gigawatts needs to be at least 0, ' +
                                'item.lightningCount needs to be at most 1');


  // ---------------------------------

  Section `Addon Config Schema: Config still unchanged after invalid sets`;

  const [ res3, stillValid ] = await requestWithAuth(`/api/v1/user/addons/${context.schemaAddonId}/config`, context.authToken);

  Assert(res3) `status`.eq(200);
  Assert(stillValid)
    (validConfigResponse).eq(true)
    `userId`.eq(context.userInfo.userId)
    `addonId`.eq(context.schemaAddonId)
    `config`
      (obj => objEqual(defaultConfig, obj)).eq(true)
    `config`
      (obj => validateAddonConfig(context.schemaAddonId, obj) === true)

}

// =============================================================================
