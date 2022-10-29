import { config } from '#core/config';
import { db, dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';


// =============================================================================


/* Fetch a list of all of the addons that the currently logged in user has added
 * to their account; this will always be a list, even if that list is empty.
 *
 * The result of this query is a list of the details for all of the addons for
 * this user, which will also include the following fields:
 *
 *   - installed = true
 *   - config = { config object }
 *   - overlayId = overlayKeyId
 *   - overlayUrl = 'http://something/overlayKeyId'
 *
 * If there is not currently a logged in user, this will trigger an error. */
export const GET = {
  description: 'Obtain information on the addons installed by the current user',

  handler: async (req, res) => {
    try {
      // Get the authorized user; will throw if there is not a valid user.
      const userInfo = getAuthorizedUser(req, true);

      // We have a userId, so look up all of the addons that this particular user
      // has added; this will always be an array, even if that array is empty.
      const data = await db.twitchUserAddons.findMany({
        where: { userId: userInfo.userId },
        include: { addon: true }
      });

      // The query will return information about the addon records and also
      // include the information about the addons themselves; so before we return
      // we need to post-process the data a bit.
      return res.json(data.map(entry => {
        // Set up the base record that we wantr to transmit back
        const addon = { installed: true, ...entry.addon, overlayId: entry.overlayId };

        // Add in the overlay URL if this item requires one.
        if (entry.overlayId !== '') {
          addon.overlayUrl = `${config.get('rootUrl')}/overlay/${entry.overlayId}`;
        }
        return addon;
      }));
    }

    catch (error) {
      dbErrResponse(error, res);
    }
  }
}

// =============================================================================
