import { db } from '$lib/db';


// =============================================================================


export async function get({ url }) {
  const userId = url.searchParams.get('userId');

  // If we did not get a userID, then we can simply look for and return every
  // possible addon.
  if (userId === null) {
    return {
      status: 200,
      body: await db.twitchAddon.findMany({})
    }
  }

  // We have a userId, so look up all of the addons that this particular user
  // has added. This query returns information about the addon record when we
  // only want the addons, so we need to post-process this a little bit.
  const data = await db.twitchUserAddons.findMany({
    where: { userId },
    include: { addon: true }
  });

  return {
    status: 200,
    body: data.map(entry => entry.addon)
  }
}


// =============================================================================
