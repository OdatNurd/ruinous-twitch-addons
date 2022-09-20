import { config } from '#core/config';

import { dbErrResponse } from '#lib/db';
import { NotFound } from '#lib/exceptions';

import fetch from 'node-fetch';


// =============================================================================


/* Given an overlayId, this will look up the information on that overlay, which
 * includes the information on the addon itself as well as the user that has
 * added the addon, and then redirects to the appropriate page, passing it the
 * information it needs to make a request of the back end to get its config
 * info. */
export async function redirectToStaticOverlay(db, req, res) {
  try {
    // Fetch information about this particular overlay from the back end
    const params = req.params;

    // With only a small, minor migration and a little bit of a hoop jump, coax
    // our web framework into actually providing us some manner of actual usable
    // URL.
    const baseURL = `${req.protocol}://${req.headers.host}`

    // Make a request of the API that knows about overlays to get information
    // about this one.
    const result = await fetch(`${baseURL}/api/v1/overlay/${params.overlayId}`);

    // If the request worked, do a redirect to the static page that it
    // represents.
    if (result.ok) {
      const overlay = await result.json();
      const staticFileUrl = `${config.get('overlayRedirect')}/${overlay.addon.overlayFile}#${params.overlayId}`;

      return res.status(302).set({
        location: staticFileUrl
      }).send();
    }

    // Trigger an error
    throw new NotFound('Unable to find the overlay to redirect to')
  }
  catch (error) {
    dbErrResponse(error, res);
  }
}


// =============================================================================
