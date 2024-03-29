import { config } from '#core/config';
import { db, dbErrResponse, newObjId } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';
import { NotFound } from '#lib/exceptions';

import { joinTwitchChannel, leaveTwitchChannel } from '#core/twitch';

import ksuid from 'ksuid';


// =============================================================================


/* This "installs" an addon for the currently logged in user, creating a new
 * record that associates the addon with the user.
 *
 * The new record will also be set up to include a custom overlay URL (if there
 * is one needed) and will gather from the addon the schema for the config and
 * add a default configuration based on that schema.
 *
 * The return object contains details about the association, and also includes
 * the following fields:
 *   - config = { config object }
 *   - overlayUrl = 'http://something'
 *
 * it is an error to try to add an addon that is already installed; if an
 * attempt is made, an error will result. */
export const POST = {
  description: 'Install the specified addon for the currently logged in user',

  handler: async (req, res) => {
    // Try to insert a new record for this addon; this will reject if there's
    // already an entry for this addon for this user, or if the input is invalid,
    // and we can handle that below.
    try {
      // Get the authorized user; will throw if there is not a valid user.
      const userInfo = getAuthorizedUser(req, true);
      const addonId = req.params.addonId;

      // Look up the database record for the addon being added, so that we can
      // figure out if it needs URL information or not, and what it's
      // configuration schema looks like.
      const addonInfo = await db.twitchAddon.findUnique({
        where: {
          addonId
        }
      });

      // The addon must exist to be added.
      if (addonInfo === null) {
        throw new NotFound(`no such addon '${req.params.addonId}'`);
      }

      // If this addon requires an overlay, then generate a custom, randomized
      // URL for this user.
      const overlayId = addonInfo.requiresOverlay === false ? '' : ksuid.randomSync().string;

      // Generate a default configuration setup for this user's use.
      const configData = {};
      addonInfo.configSchema.forEach(item => configData[item.field] = item.default);

      // Insert a new record for this user to associate them with this addon;
      // if the addon is invalid or they already have this addon installed, this
      // will throw an error.
      const data = await db.twitchUserAddons.create({
        data: {
          id: newObjId(),
          userId: userInfo.userId,
          addonId,
          overlayId,
          config: configData
        }
      });

      // The overlayId needs to be a URL since the client has no direct access
      // to the config to know what the base is.
      data.overlayUrl = `${config.get('rootUrl')}/overlay/${data.overlayId}`

      // If this addon requires chat, then we might need to join the chat if
      // we haven't already.
      if (addonInfo.requiresChat === true) {
        joinTwitchChannel(userInfo.username);
      }

      return res.status(201).json(data);
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}



// =============================================================================


/* This is the reverse of the above, and will "uninstall" the addon from the
 * channel by removing the record from the database.
 *
 * The return is always an empty object, although an attempt to remove an addon
 * that is not installed will trigger an error. */
export const DELETE = {
  description: 'Uninstall the specified addon for the currently logged in uswer',

  handler: async (req, res) => {
    try {
      // Get the authorized user; will throw if there is not a valid user.
      const userInfo = getAuthorizedUser(req, true);
      const addonId = req.params.addonId;

      // Remove the given record; this will generate an error if the record is
      // not actually present
      const addonInfo = await db.twitchUserAddons.delete({
        where: {
          userId_addonId: { userId: userInfo.userId, addonId }
        },
        include: { addon: true }
      });

      // If this addon requires chat, then we might need to leave the chat if
      // deleting this addon removed the last reason for us to be in this
      // channel.
      if (addonInfo.addon.requiresChat === true) {
        leaveTwitchChannel(userInfo.username);
      }

      return res.status(204).send();
    }
    catch (error) {
      dbErrResponse(error, res);
    }

  }
}


// =============================================================================
