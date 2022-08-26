import { addAddonAPIs } from './addons.js';
import { addOverlayAPIs } from './overlays.js';
import { addUserAPIs } from './users.js';


// =============================================================================


/* Given an express app, add in all of the routes that specify operations that
 * can be taken as a part of the API. */
export function setupAPIEndpoints(app) {
  addAddonAPIs(app);
  addOverlayAPIs(app);
  addUserAPIs(app);
}


// =============================================================================
