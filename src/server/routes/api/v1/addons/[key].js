import { config } from '#core/config';
import { db, dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';
import { NotFound } from '#lib/exceptions';


// =============================================================================


/* Find and return back the information on a particular addon, based on being
 * given either the slug for that addon or its addonID.
 *
 * If there is a user that is currently logged in, a check is done to see if
 * their channel has this addon installed, and if so the returned value will
 * indicate that by adding the following fields to the object.
 *
 *   - installed = true
 *   - config = { config object }
 *   - overlayUrl = 'http://something'
 *
 * The extra fields will not be present if there is not a logged in user. If
 * a user is logged in, then 'installed' is always added, even if its value
 * ends up being false. */
export const GET = {
  description: 'Obtain information on the addon with the given slug or id',

  handler: async (req, res) => {
    try {
      // Check to see if there's an authorized user or not
      const userInfo = getAuthorizedUser(req, false);

      // Find the addon with the slug or ID provided.
      const body = await db.twitchAddon.findFirst({
        where: {
          OR: [
            { slug: req.params.key },
            { addonId: req.params.key },
          ]
        }
      });

      // Signal back if there was nothing found.
      if (body === null) {
        throw new NotFound(`no such addon '${req.params.key}'`);
      }

      // If we got a user, we need to look to see if they have installed this
      // addon or not; if not, assume the lookup failed.
      let userConfig = null;
      if (userInfo !== null) {
        userConfig = await db.twitchUserAddons.findUnique({
          where: {
            userId_addonId: { userId: userInfo.userId, addonId: body.addonId }
          },
        });
      }

      // Flag whether or not this is installed;
      body.installed = userConfig !== null;

      // All records include an overlayId and overlayUrl, even if they are just
      // empty (say because not installed, or because this is not something that
      // uses an overlay in the first place).
      let overlayId = '';
      let overlayUrl = '';

      // If this addon is installed, then set up the overlay URL and the
      // configuration information for this user.
      if (body.installed === true) {
        overlayId = userConfig.overlayId;
        overlayUrl = (overlayId === '' ? '' : `${config.get('rootUrl')}/overlay/${overlayId}`)
      }

      body.overlayId = overlayId;
      body.overlayUrl = overlayUrl;

      res.json(body || {})
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
