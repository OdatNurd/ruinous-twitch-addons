import { config } from '$lib/config';
import { getAuthToken } from '$lib/cookie';


// =============================================================================


/* This gets invoked on the server when pages are requested, including during
 * server side page generation. Note however that requests for static assets
 * (including pre-rendered pages) are not handled by SvelteKit and as such this
 * method doesn't trigger. Observably, the main site always triggers this, but
 * visiting other pages doesn't unless you reload on them.
 *
 * This is because the first page access pre-renders the appropriate content
 * and ships it up, then passes off to the local client side code treating the
 * app as a SPA; the "root" link always hits the server though.
 *
 * This drives home the idea that since we're validating the token here and
 * setting up local information to be gathered from the session in the page that
 * we be extra careful to make anything that requires auth take a trip to the
 * server (e.g. by hitting an endpoint to carry out the action or get data)
 * since that will force a re-request that allows us to validate the token. */
export async function handle({event, resolve}) {
  // If this is a forwarded Heroku request from an insecure protocol, redirect
  // the request to a secured URL because we absolutely require SSL.
  //
  // Regardless of the incoming protocol, the Heroku router hits us as https,
  // which is why need to use the header to do this.
  if (event.request.headers.get('x-forwarded-proto') === 'http') {
    return Response.redirect(event.url.href, 302);
  }

  // Check the event request for an auth cookie which contains our JWT and if
  // found, verify it. If it's all good, set up the locals so that we can use it
  // to set up the session.
  const token = getAuthToken(event.request);
  if (token !== null) {
    event.locals.user = {
      username: token.username,
      userId: token.userId,
      displayName: token.displayName,
      profilePic: token.profilePic,
    }
  }

  return await resolve(event)
}


// =============================================================================
