
/* The unique AddonID that represents this addon; this is the ID that the record
 * for this addon is represented as in the database, which is also used by the
 * client side code. */
import { addonId } from '#seed/addons/addon_one';


// =============================================================================


/* Initialize the back end services for this addon. This gets a handle that
 * allows it to access the database and the top level socket.io handle so that
 * it can register any listeners that it needs. */
export default function initialize(db, io) {
  console.log('Server side code for Addon One has initialized');
}


// =============================================================================
