import { logger } from '#core/logger';


// =============================================================================


/* The unique addon data that represents this addon; this is full data record
 * for this addon as represented as in the database, which is also used by the
 * client side code. */
import { data } from '#seed/addons/addon_one';

/* Get our subsystem logger. */
const log = logger(data.slug);


// =============================================================================


/* Initialize the back end services for this addon. This gets a handle that
 * allows it to access the database and the top level socket.io handle so that
 * it can register any listeners that it needs. */
export default function initialize(db, io) {
  // Currently, no logic is defined for this addon.
}


// =============================================================================
