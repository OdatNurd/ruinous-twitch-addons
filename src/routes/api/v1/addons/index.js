import { db } from '$lib/db';
import ksuid from 'ksuid';


// =============================================================================


/* Obtain the complete list of addons that are known to the system. */
export async function GET({ url }) {
  const result = await db.twitchAddon.findMany({});

  // Parse the timestamps out of the entry ID's, and then sort based on them to
  // put the entries into their creation order.
  result.forEach(entry => entry.timestamp = ksuid.parse(entry.addonId).timestamp);
  result.sort((a, b) => a.timestamp - b.timestamp);

  return {
    status: 200,
    body: result
  }
}


// =============================================================================
