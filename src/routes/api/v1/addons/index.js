import { db } from '$lib/db';
import { getAuthToken } from '$lib/cookie';

import ksuid from 'ksuid';


// =============================================================================


/* Find and return back a set that contains the addon ID's of all of the addons
 * that have been added by the user who is currently logged in, based on the
 * authorization token provided in the request.
 *
 * If there's not a JWT token in the cookie, or it's not valid, then this will
 * return an empty set. */
async function fetchUserAddons(request) {
  const result = new Set();

  // If there's nobody logged in, the result set will be empty.
  const token = getAuthToken(request);
  if (token === null) {
    return result;
  }

  // Find all of the addons that this user has installed; then add their ID's
  // to the set.
  const data = await db.twitchUserAddons.findMany({
    where: { userId: token.userId },
  });

  data.forEach(addon => result.add(addon.addonId));
  return result;
}


// =============================================================================


/* Obtain the complete list of addons that are known to the system. */
export async function GET({ url, request }) {
  // If there's a logged in user, then fetch information about what addons they
  // currently have installed.
  const userAddons = await fetchUserAddons(request);
  const result = await db.twitchAddon.findMany({});

  // Parse the timestamps out of the entry ID's, and then sort based on them to
  // put the entries into their creation order.
  result.forEach(entry => {
    entry.timestamp = ksuid.parse(entry.addonId).timestamp;
    entry.installed = userAddons.has(entry.addonId);
  });
  result.sort((a, b) => a.timestamp - b.timestamp);

  return {
    status: 200,
    body: result
  }
}


// =============================================================================
