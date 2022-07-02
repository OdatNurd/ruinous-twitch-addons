import { db } from '$lib/db';


// =============================================================================


export async function get({params}) {
  return {
    status: 200,
    body: await db.twitchAddon.findMany({})
  }
}


// =============================================================================
