import { config } from '#core/config';
import { dbErrResponse } from '#lib/db';

import cookie from 'cookie';


// =============================================================================


/* This handles a POST request to request that the currently logged in user be
 * logged out. This does a simple redirect back to the root of the site,
 * redacting away the client side cookie that tracks the login information.
 *
 * No back end information needs to change as a result of a logout because the
 * login doesn't actually persist anything on the server either. */
export const GET = {
  description: 'Log out the currently active user, if any',

  handler: async (req, res) => {
    try {
      // To log out, we just erase the cookie; this could be more intelligent and
      // check to see if there is one or whatever, but meh.
      return res.status(302).set({
        location: '/',
        "Set-Cookie": cookie.serialize('authToken', '', {
          httpOnly: true,
          expires: new Date(1970,1,1),
          secure: config.get('env') === 'production',
          sameSite: config.get('env') === 'production' ? 'strict' : undefined
        })
      }).send();
    }
    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
