import { writable, derived } from 'svelte/store';


// =============================================================================


/* A simple promise based wrapper around waiting for a short period before
 * continuing; used while in development mode to make the spinner more visible
 * as we work. */
const debugDelay = delay => new Promise(resolve => setTimeout(resolve, delay));


// =============================================================================


/* Given a URL, invoke a fetch for it to gather the JSON result, which will be
 * returned back.
 *
 * If the code is currently running in a development mode, then the result will
 * be delayed for a period before the result is actually returned, to help with
 * debugging and seeing what the user experience would be non-local. */
export async function loadJSON(url) {
  // Fetch the URL provided, and grab the result as data
  const res = await fetch(url);
  const result = await res.json();

  // If we're in development mode, let the spinner stick around a bit before
  // we proceed.
  if (process.env.NODE_ENV === 'development') {
    await debugDelay(500);
  }

  return result;
};


// =============================================================================
