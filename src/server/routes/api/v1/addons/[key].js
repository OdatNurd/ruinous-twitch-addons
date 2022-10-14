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
      const userId = getAuthorizedUser(req, false);

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

      // Parse the config schema into an object.
      body.configSchema = JSON.parse(body.configSchema);

      // If we got a user, we need to look to see if they have installed this
      // addon or not; if not, assume the lookup failed.
      let userConfig = null;
      if (userId !== null) {
        userConfig = await db.twitchUserAddons.findUnique({
          where: {
            userId_addonId: { userId, addonId: body.addonId }
          },
        });
      }

      // Flag whether or not this is installed;
      body.installed = userConfig !== null;

      // If this addon is installed, then set up the overlay URL and the
      // configuration information and add them to the body.
      if (body.installed === true) {
        const overId = userConfig.overlayId;

        body.overlayUrl = (overId === '' ? '' : `${config.get('rootUrl')}/overlay/${overId}`)
        body.config = JSON.parse(userConfig.configJSON);
      }

      res.json(body || {})
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
