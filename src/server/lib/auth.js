import { config } from '../config.js';
import { logger } from '../logger.js';
import { Unauthorized } from './exceptions.js';

import cookie from 'cookie';
import jwt from 'jsonwebtoken';


// =============================================================================


/* Get our subsystem logger; this subsystem is shared with the login code but
 * separation of concerns makes it make more sense to have both sets of code
 * separate. */
const log = logger('auth');


// =============================================================================


/* Given a request object, look for an authentication token that tells us who
 * the currently logged in user is.
 *
 * The return value is null if there is no cookie in the request, or if the
 * authorization token is not valid (i.e. the signature cannot be verified). */
export function getAuthToken(req) {
  try {
    const cookies = cookie.parse(req.headers.cookie ?? '')

    // If we got an auth token out of the cookie, then verify the signature and
    // return it back.
    if (cookies.authToken !== undefined) {
      return jwt.verify(cookies.authToken, config.get('jwt.public'), {
        algorithms: ['RS256']
      });
    }
  } catch (err) {
    log.error(`JWT could not be verified; rejecting: ${err.message}`);
  }

  // There was not a cookie for the auth token, or there was but it did not have
  // a valid signature.
  return null;
}


// =============================================================================


/* Get the user that is currently logged in for the request given, and return
 * back their userId. The required value, if true, indicates that authorization
 * is required and cannot be missing.
 *
 * The return value is the userId, or null if there is not currently anyone
 * logged in (or their token is invalid/expired).
 *
 * If required is true and there is no authorization, this will throw an
 * exception to that effect. */
export function getAuthorizedUser(req, required) {
  // Get the auth token and decode it; if there isn't one, then there is no
  // user (or their auth is expired/invalid).
  const token = getAuthToken(req);
  if (token === null) {
    // If authorization is required, this is an error.
    if (required) {
      throw new Unauthorized('user is not authorized to access this resource')
    }

    // Just flag it; auth is optional here.
    return null;
  }

  // Must be good.
  return token?.userId;
}


// =============================================================================
