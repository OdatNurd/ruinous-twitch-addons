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

      return res.json(data[0]);
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
