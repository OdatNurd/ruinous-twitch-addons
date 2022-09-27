import { logger } from '#core/logger';

import { initOverlayCommunications, overlayInfoHandler } from '#addons/lib/common';


// =============================================================================


/* The unique addon data that represents this addon; this is full data record
 * for this addon as represented as in the database, which is also used by the
 * client side code. */
import { data } from '#seed/addons/addon_three';

/* Get our subsystem logger. */
const log = logger(data.slug);


// =============================================================================


/* Initialize the back end services for this addon. This gets a handle that
 * allows it to access the database and the top level socket.io handle so that
 * it can register any listeners that it needs. */
export default function initialize(db, io) {
  // Use the library routine to initialize communications for our addon; we
  // have an overlay component, so we should also listen for the overlay asking
  // for information about itself.
  initOverlayCommunications(io, log, data, (socket) => {
    overlayInfoHandler(socket, log);
  });
}


// =============================================================================
