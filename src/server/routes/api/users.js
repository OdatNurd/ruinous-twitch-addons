import { config } from '#core/config';
import { dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';
import { NotFound } from '#lib/exceptions';

import ksuid from 'ksuid';


// =============================================================================


/* Fetch a list of all of the addons that the currently logged in user has added
 * to their account; this will always be a list, even if that list is empty.
 *
 * The result of this query is a list of the details for all of the addons for
 * this user, which will also include the following fields:
 *
 *   - installed = true
 *   - config = { config object }
 *   - overlayUrl = 'http://something'
 *
 * If there is not currently a logged in user, this will trigger an error. */
export async function getUserAddons(db, req, res) {
  try {
    // Get the authorized user; will throw if there is not a valid user.
    const userId = getAuthorizedUser(req, true);

    // We have a userId, so look up all of the addons that this particular user
    // has added; this will always be an array, even if that array is empty.
    const data = await db.twitchUserAddons.findMany({
      where: { userId },
      include: { addon: true }
    });

    // The query will return information about the addon records and also
    // include the information about the addons themselves; so before we return
    // we need to post-process the data a bit.
    return res.json(data.map(entry => {
      // Set up the base record that we wantr to transmit back
      const addon = { installed: true, ...entry.addon };

      // Parse the config schema into an object, and also add in the config
      // and the overlay URL.
      addon.configSchema = JSON.parse(addon.configSchema);
      addon.config = JSON.parse(entry.configJSON);
      if (entry.overlayId !== '') {
        addon.overlayUrl = `${config.get('overlayBase')}/${entry.overlayId}`;
      }
      return addon;
    }));
  }

  catch (error) {
    dbErrResponse(error, res);
  }
}


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
export async function installUserAddon(db, req, res) {
  // Try to insert a new record for this addon; this will reject if there's
  // already an entry for this addon for this user, or if the input is invalid,
  // and we can handle that below.
  try {
    // Get the authorized user; will throw if there is not a valid user.
    const userId = getAuthorizedUser(req, true);
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

    // The config schema is stored as a string of JSON, so parse that out into
    // an object for us to work with.
    addonInfo.configSchema = JSON.parse(addonInfo.configSchema);

    // If this addon requires an overlay, then generate a custom, randomized
    // URL for this user.
    const overlayId = addonInfo.requiresOverlay === false ? '' : ksuid.randomSync().string;

    // Generate a default configuration setup for this user's use.
    const configJSON = {};
    addonInfo.configSchema.forEach(item => configJSON[item.field] = item.default);

    // Insert a new record for this user to associate them with this addon;
    // if the addon is invalid or they already have this addon installed, this
    // will throw an error.
    const data = await db.twitchUserAddons.create({
      data: {
        userId,
        addonId,
        overlayId,
        configJSON: JSON.stringify(configJSON)
      }
    });

    // We insert the config JSON into the database as a string, but we want to
    // return it back from the request as an actual object. Also, the overlayId
    // needs to be a URL since the client has no direct access to the config
    // to know what the base is,
    data.configJSON = configJSON;
    data.overlayUrl = `${config.get('overlayBase')}/${data.overlayId}`

    return res.status(201).json(data);
  }
  catch (error) {
    dbErrResponse(error, res);
  }
}


// =============================================================================


/* This is the reverse of the above, and will "uninstall" the addon from the
 * channel by removing the record from the database.
 *
 * The return is always an empty object, although an attempt to remove an addon
 * that is not installed will trigger an error. */
export async function uninstallUserAddon(db, req, res) {
  try {
    // Get the authorized user; will throw if there is not a valid user.
    const userId = getAuthorizedUser(req, true);
    const addonId = req.params.addonId;

    // Remove the given record; this will generate an error if the record is
    // not actually present
    await db.twitchUserAddons.delete({
      where: {
        userId_addonId: { userId, addonId }
      },
    });

    return res.status(204).send();
  }
  catch (error) {
    dbErrResponse(error, res);
  }
}


// =============================================================================
