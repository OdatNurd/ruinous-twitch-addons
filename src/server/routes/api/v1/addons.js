import { config } from '#core/config';
import { db, dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';

import ksuid from 'ksuid';


/* Find and return back a dict that contains the addon ID's of all of the addons
 * that have been added by the user who is currently logged in as keys, and
 * information about those addons as objects. The current user is based on the
 * token provided in the request.
 *
 * If there's not a JWT token in the cookie, or it's not valid, then this will
 * return an empty dict. */
async function fetchUserAddons(db, req) {
  const result = {};

  // If there's nobody logged in, the result set will be empty.
  const userInfo = getAuthorizedUser(req, false);
  if (userInfo === null) {
    return result;
  }

  // Find all of the addons that this user has installed; then add their ID's
  // to the set.
  const data = await db.twitchUserAddons.findMany({
    where: { userId: userInfo.userId },
  });

  data.forEach(addon => result[addon.addonId] = addon);
  return result;
}


// =============================================================================


/* Fetch a complete list of all of the addons that are known and return back
 * their details in an array; in theory the array could be empty, although in
 * practice there is always data seeded into the database.
 *
 * In addition to the core fields for the addon, there are also some extra
 * synthesized fields that are added:
 *
 *   - installed = true/false
 *   - overlayId = something
 *   - overlayUrl = 'http://something'
 *
 * Installed indicates if the current user has this addon installed or not; if
 * the request does not include a user, this is present but always contains the
 * value false.
 *
 * If an addon is installed, and it also supports an overlay, then overlayId
 * and overlayUrl will be present, which gives you the unique ID for this user's
 * installation of the overlay, and the Url that you can use to fetch it. */
export const GET = {
  description: 'Obtain a list of all of the currently known addons',

  handler: async (req, res) => {
    try {
      // Fetch the complete list of addons that are known and, if there is
      // currently a logged in user, the list of addons that they have installed.
      //
      // findMany() always returns an array, even if it finds nothing (as opposed
      // to null).
      const result = await db.twitchAddon.findMany({});
      const userAddons = await fetchUserAddons(db, req);

      // Parse the timestamps out of the entry ID's, and then sort based on them to
      // put the entries into their creation order.
      result.forEach(entry => {
        entry.timestamp = ksuid.parse(entry.addonId).timestamp;

        // Pull out theuser information (if any) for this addon; we can use that
        // to know if this is installed or not.
        const userInfo = userAddons[entry.addonId];
        entry.installed = userInfo !== undefined;

        // OverlayId is empty when not installed, or the overlayId from the
        // record if this is installed. When there is a nonempty overlayId,
        // there should also be a nonempty overlayUrl too.
        entry.overlayId = (entry.installed === true) ? userInfo.overlayId : '';
        entry.overlayUrl = (entry.overlayId === '') ? '' : `${config.get('rootUrl')}/overlay/${userInfo.overlayId}`;
      });
      result.sort((a, b) => a.timestamp - b.timestamp);
      result.forEach(e => delete e["timestamp"]);

      res.json(result);
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
