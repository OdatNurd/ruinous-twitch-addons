import { db } from '$lib/db';
import { getAuthToken } from '$lib/cookie';


// =============================================================================


export async function get({ request, params }) {
  // Look at the cookie. the beautiful cookie. get the userID from there or
  // signal that the person can go straight to hell without passing go or
  // collecting 200 dollars.
  const token = getAuthToken(request);
  if (token === null) {
    return {
      status: 401
    }
  }

  // We have a userId, so look up all of the addons that this particular user
  // has added. This query returns information about the addon record when we
  // only want the addons, so we need to post-process this a little bit.
  const data = await db.twitchUserAddons.findMany({
    where: { userId: token.userId},
    include: { addon: true }
  });

  return {
    status: 200,
    body: data.map(entry => entry.addon)
  }
}


// =============================================================================
