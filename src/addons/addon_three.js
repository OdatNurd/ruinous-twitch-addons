import { logger } from '#core/logger';


// =============================================================================


/* Get our subsystem logger. */
const log = logger('addon_three');

/* The unique AddonID that represents this addon; this is the ID that the record
 * for this addon is represented as in the database, which is also used by the
 * client side code. */
import { addonId } from '#seed/addons/addon_three';


// =============================================================================


/* Initialize the back end services for this addon. This gets a handle that
 * allows it to access the database and the top level socket.io handle so that
 * it can register any listeners that it needs. */
export default function initialize(db, io) {
  log.info('server side code for Addon Three has initialized');

  // Create a custom namespace just for consumers of this addon
  const namespace = io.of(`/${addonId}`);

  // Set up handlers for when a new socket connects
  namespace.on('connection', (socket) => {
    log.debug(`incoming addon_three socket connection: ${socket.id}`);

    // If the socket sends a message, display it
    socket.on('message', (msg) => {
      log.info(`message from overlay: ${msg}`);

      socket.emit('message', 'message acknowledged');
    });

    // Set up to listen to when this user disconnects
    socket.on('disconnect', () => {
      log.debug(`socket connection closed: ${socket.id}`);
    });
  });

}


// =============================================================================
