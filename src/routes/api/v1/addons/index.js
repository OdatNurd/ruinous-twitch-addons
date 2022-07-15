import { db } from '$lib/db';


// =============================================================================


/* Obtain the complete list of addons that are known to the system. */
export async function GET({ url }) {
  return {
    status: 200,
    body: await db.twitchAddon.findMany({})
  }
}


// =============================================================================
