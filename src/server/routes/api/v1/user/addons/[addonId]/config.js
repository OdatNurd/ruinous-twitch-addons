import { config } from '#core/config';
import { db, dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';
import { NotFound } from '#lib/exceptions';


// =============================================================================


/* This will obtain the configuration for an addon installed by the currently
 * logged in user.
 *
 * The return value will contain the current user's configuration data; an error
 * response is generated if this user does not have this addon installed. */
export const GET = {
  description: "Obtain the user's configuration for an addon",

  mask: {
    "id": "string",
    "userId": "string",
    "addonId": "string",
    "overlayId": "string",
    "overlayUrl": "string",
    "config": {},
    "schema": []
  },

  handler: async (req, res) => {
    // Try to find the configuration record that associates an installation of
    // this addon with this user; that record will contain the appropriate
    // configuration record for this addon.
    try {
      // Get the authorized user; will throw if there is not a valid user.
      const userInfo = getAuthorizedUser(req, true);
      const addonId = req.params.addonId;

      // Fetch out the configuration record; uniqueness constraints ensures that
      // there can only ever be at most one of these.
      const configInfo = await db.twitchUserAddons.findUnique({
        where: {
          userId_addonId: { userId: userInfo.userId, addonId }
        },
        include: { addon: true }
      });

      // If no record is found, then this addon isn't installed by this user.
      if (configInfo === null) {
        throw new NotFound(`addon not installed`);
      }

      // Move the schema up to the root so we can mask away the addon info
      configInfo.schema = configInfo.addon.configSchema;
      configInfo.overlayUrl = configInfo.overlayId
      if (configInfo.overlayUrl !== '') {
        configInfo.overlayUrl = `${config.get('rootUrl')}/overlay/${configInfo.overlayId}`
      }

      // TODO: In a future update, this may not be needed, if we can use
      // jsonMask to obey the mask above.
      delete configInfo.addon;

      return res.status(200).json(configInfo);
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}



// =============================================================================


/* This will update the configuration information for a user's installed addons.
 * The request body must contain the new configuration information, which should
 * conform to the schema of the configuration for the addon in question.
 *
 * It is an error to try to apply an invalid config, an empty config, or to try
 * to adjust an addon that does not exist. */
export const POST = {
  description: "Update a user's addon configuration",

  handler: async (req, res) => {
    // Try to find the configuration record that associates an installation of
    // this addon with this user; that record will contain the appropriate
    // configuration record for this addon.
    try {
      // Get the authorized user; will throw if there is not a valid user.
      const userInfo = getAuthorizedUser(req, true);
      const addonId = req.params.addonId;

      // If the request was provided invalid JSON (as determined by our custom
      // middleware), trigger an error.
      if (req.invalid_json === true) {
        throw new SyntaxError('the provided JSON is not valid');
      }

      // Fetch out the configuration record; uniqueness constraints ensures that
      // there can only ever be at most one of these.
      const configInfo = await db.twitchUserAddons.findUnique({
        where: {
          userId_addonId: { userId: userInfo.userId, addonId }
        },
        include: { addon: true }
      });

      // If no record is found, then this addon isn't installed by this user.
      if (configInfo === null) {
        throw new NotFound(`addon not installed`);
      }

      // TODO: Validate the request body; this has to validate against the
      // schema, and should ultimately contain only the fields specified there,
      // so we should use jsonMask on this at some point.

      await db.twitchUserAddons.update({
        where: {
          userId_addonId: { userId: userInfo.userId, addonId }
        },
        data: {
          config: req.body
        }
      })

      return res.status(204).send();
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
