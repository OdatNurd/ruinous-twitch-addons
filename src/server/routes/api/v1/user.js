import { dbErrResponse } from '#lib/db';
import { getAuthorizedUser } from '#lib/auth';


// =============================================================================


/* Fetch information on the currently logged in user, if any. This uses the
 * authToken cookie which, if properly verified, will contain:
 *
 *   - userId      - the unique userId of the user
 *   - username    - the login name of the user
 *   - displayName - The user's display name
 *   - profilePic  - The full URL to the user's Twitch profile picture
 *
 * The result will always be an empty object if there's no cookie, or the token
 * it contains is not valid (e.g. expired, does not pass the signing key,
 * and so on. */
export const GET = {
  description: 'Obtain information on the currently logged in user, if any',

  handler: async (req, res) => {
    try {
      const user = {};

      // Get the token and decode it; if we get one, use the information to populate
      // the user object. If there is not a token, the empty object will be used
      // as-is.
      const token = getAuthorizedUser(req, false);
      if (token !== null) {
        user.username = token.username;
        user.userId = token.userId;
        user.displayName = token.displayName;
        user.profilePic = token.profilePic;
      }

      return res.json(user);
    }

    catch (error) {
      dbErrResponse(error, res);
    }
  }
}


// =============================================================================
