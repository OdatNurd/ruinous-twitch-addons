import { db } from '$lib/db';


// =============================================================================


/* Given a key that is either a addon ID or its slug name, fetch the details on
 * the addon that matches that filter criteria. */
export async function GET({ params }) {
  const body = await db.twitchAddon.findFirst({
    where: {
      OR: [
        { slug: params.key },
        { addonId: params.key },
      ]
    }
  });

  return {
    status: 200,
    body: body || {}
  }
}


// =============================================================================
