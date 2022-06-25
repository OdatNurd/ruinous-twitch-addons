// =============================================================================


/* This hook runs on the server and gets information from the event that's
 * provided by the handle() function in order to set up the session data that is
 * provided to the client side code.
 *
 * As such, it's important to make sure that the only data that we expose here
 * is data that's safe to have on the client, since anyone will be able to
 * see it there.
 *
 * This doesn't always trigger, only on the first server side load; as such in
 * order to update the session, API calls need to be made. */
export function getSession({ locals }) {
  if (locals.user === undefined) return {}

  return {
    user: {
      username: locals.user.username,
      userId: locals.user.userId,
      name: locals.user.name,
      profile: locals.user.profileImg,
    },
  }
}


// =============================================================================
