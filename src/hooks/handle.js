import { config} from '$lib/config';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';


/* This gets invoked on the server when pages are requested, including during
 * server side page generation. Note however that requests for static assets
 * (including pre-rendered pages) are not handled by SvelteKit and as such this
 * method doesn't trigger. Observably, the main * site always triggers this, but
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
  // We want our site to only ever be secure; so, if this is an insecure URL
  // and we're not in development mode, redirect this request to a secured
  // version of the page.
  if (event.url.protocol === 'http:' && event.url.hostname.includes('twitch.ruinouspileofcrap.com')) {
    event.url.protocol = 'https:'
    return Response.redirect(event.url.href, 302);
  }

  try {
    const cookieHeader = event.request.headers.get('cookie')
    const cookies = cookie.parse(cookieHeader ?? '')

    if (cookies.authToken !== undefined) {
      const token = jwt.verify(cookies.authToken, config.get('jwt.public'), {
        algorithms: ['RS256']
      });

      event.locals.user = {
        username: token.username,
        userId: token.userId,
        name: token.name,
        profileImg: token.profileImg,
      }
    }
  } catch (err) {
    console.error(`received JWT was invalid; rejecting: ${err.message}`);
  }

  return await resolve(event)
}
