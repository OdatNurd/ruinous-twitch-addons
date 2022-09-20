import addon_one from '#addons/addon_one';
import addon_two from '#addons/addon_two';
import addon_three from '#addons/addon_three';


// =============================================================================


/* Initialize all of the addon back end code; this passes through the database
 * and socket.io handle to the initialization routines for each of the addons
 * in order. */
export function initializeAddons(db, io) {
  addon_one(db, io);
  addon_two(db, io);
  addon_three(db, io);
}


// =============================================================================
