import { config } from '$lib/config';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';


// =============================================================================


/* Given a request object, look for an authentication token that tells us who
 * the currently logged in user is.
 *
 * The return value is null if there is no cookie in the request, or if the
 * authorization token is not valid (i.e. the signature cannot be verified). */
export function getAuthToken(request) {
  try {
    const cookieHeader = request.headers.get('cookie')
    const cookies = cookie.parse(cookieHeader ?? '')

    // If we got an auth token out of the cookie, then verify the signature and
    // return it back.
    if (cookies.authToken !== undefined) {
      return jwt.verify(cookies.authToken, config.get('jwt.public'), {
        algorithms: ['RS256']
      });
    }
  } catch (err) {
    console.error(`received JWT was invalid; rejecting: ${err.message}`);
  }

  // There was not a cookie for the auth token, or there was but it did not have
  // a valid signature.
  return null;
}


// =============================================================================
