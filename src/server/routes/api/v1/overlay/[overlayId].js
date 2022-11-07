import { config } from '#core/config';
import { db, dbErrResponse } from '#lib/db';
import { NotFound } from '#lib/exceptions';


// =============================================================================


/* Find and return back the information on a particular overlay, based on being
 * given the specific overlay ID. The return value will also include information
 * on the addon itself as well as the user that owns the overlay.
 *
 * This does not require a user to be logged in, and in fact will provide the
 * full details of any overlay whose ID is provided. This is because overlays
 * are meant to be loaded as browser sources, where a login mechanism is not
 * a great UX (or available in all situations).
 *
 * The information this provides is information on the specific configuration
 * for any given overlay, and the inference that it us up to the user to not
 * leak the URL, since anyone that gets it can load the page and expose the
 * information. */
export const GET = {
  description: 'Obtain information on the overlay with the given slug or id',

  handler: async (req, res) => {
    try {
      // We have a userId, so look up all of the addons that this particular user
      // has added; this will always be an array, even if that array is empty.
      const data = await db.twitchUserAddons.findMany({
        where: { overlayId: req.params.overlayId },
        include: { addon: true, owner: true }
      });

      // There should only be a single hit; any more or any less indicates that
      // something went wrong. Probably not great to use a 404 for this if there
      // are more than one hit, but we haven't made the overlayId unique yet.
      if (data.length !== 1) {
        throw new NotFound(`no such overlay '${req.params.overlayId}'`);
      }

      // We can infer that this addon is installed because otherwise there would
      // be no record. Additionally the information on the addon should include
      // the overlayId; technically redundant, but we want the addon field to
      // look the same no matter where it comes from so it can be used
      // interchangeably.
      data[0].addon.installed = true;
      data[0].addon.overlayId = req.params.overlayId;
      data[0].addon.overlayUrl = `${config.get('rootUrl')}/overlay/${req.params.overlayId}`

      // The data for the user includes the bot field, but that is not something
      // that we want or need to convey.
      delete data[0].owner.isBot;

      return res.json(data[0]);
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
