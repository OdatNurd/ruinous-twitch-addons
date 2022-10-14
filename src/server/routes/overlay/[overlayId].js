import { config } from '#core/config';
import { dbErrResponse } from '#lib/db';

import fetch from 'node-fetch';


// =============================================================================


/* Given an overlayId, this will look up the information on that overlay, which
 * includes the information on the addon itself as well as the user that has
 * added the addon, and then redirects to the appropriate page, passing it the
 * information it needs to make a request of the back end to get its config
 * info. */
export const GET = {
  description: 'Redirect to the static page that represents the given overlayId',

  handler: async (req, res) => {
    try {
      // Fetch information about this particular overlay from the back end
      const params = req.params;

      // With only a small, minor migration and a little bit of a hoop jump, coax
      // our web framework into actually providing us some manner of actual usable
      // URL.
      const baseURL = `${req.protocol}://${req.headers.host}`

      // Default to there being no overlay result in case the lookup fails.
      let staticFileUrl = `${config.get('rootUrl')}/overlay/no_such_overlay.html`;

      // Make a request of the API that knows about overlays to get information
      // about this one; if it worked, then create a full URL to redirect there
      const result = await fetch(`${baseURL}/api/v1/overlay/${params.overlayId}`);
      if (result.ok) {
        const overlay = await result.json();
        staticFileUrl = `${config.get('rootUrl')}/overlay/${overlay.addon.staticFile}#${params.overlayId}`;
      }

      return res.status(302).set({
        location: staticFileUrl
      }).send();
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
