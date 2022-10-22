import { config } from '#core/config';
import { logger } from '#core/logger';

import { addSocket, removeSocket } from '#addons/lib/socketmap';

import fetch from 'node-fetch';


// =============================================================================


/* Pull out the base URL that we should use when we make our requests to get
 * overlay information. */
const baseURL = config.get('rootUrl');

/* Get our subsystem logger. */
const log = logger('addon-common');


// =============================================================================


/* Apply a handler to the provided socket object that listens for incoming
 * requests for details on overlays with a specific ID which looks up that
 * information and responds with it in an ACK.
 *
 * The associated event is:
 *   => 'get-overlay-info' with parameter 'overlayId'
 *
 * The result of this request is returned as an ACK to this event, so the client
 * needs to listen specifically for that using a callback to get the requested
 * data; this will contain a success field set to false if the overlay is not
 * valid. */
export function overlayInfoHandler(socket, log) {
  socket.on('get-overlay-info', async (overlayId, callback) => {
    log.info(`request for info on overlay ${overlayId} from socket ${socket.id}`);

    // Request the data and convert it; the callback function causes the socket
    // layer to respond to the intiial request with an ACK that provides the
    // data.
    log.debug(`fetching ${baseURL}/api/v1/overlay/${overlayId}`);
    const result = await fetch(`${baseURL}/api/v1/overlay/${overlayId}`);
    const body = await result.json();
    callback(body);
  });

  // We consider a socket to be connected when it introduces itself to us with
  // a HELO message that tells us who it is. Prior to that we don't track the
  // socket in any meaningful way because we don't know what it represents.
  socket.on('HELO', (overlayInfo) => {
    addSocket(socket, overlayInfo);

    // Synthesize a connect message; we really only consider things connected
    // once they have told us who they are.
    // bridge.emit(`addon.${overlayInfo.addonId}.connect`, socket);
  })
}


// =============================================================================


/* For addons that have an overlay component, the overlays need a way to
 * commuinicate directly with the back end code. This function sets up and
 * returns a namespaced communications channel based on the addonId of the
 * addon.
 *
 * This sets up basic handlers for knowing when a socket connects/disconnects.
 *
 * If socketInit is provided, it should be a function which takes as an argument
 * a socket handle. This can be used to set up any other socket-specific events
 * that may be needed for clients. */
export function initOverlayCommunications(io, log, addonData, socketInit) {
  const namespace = io.of(`/${addonData.addonId}`);;

  log.info(`socket namespace for ${addonData.slug} has initialized`);

  // Simplistically, log when connections and disconnections happen. The driver
  // on the API is actually the client.
  namespace.on('connection', (socket) => {
    // console.log(`*** Incoming socket headers: ${JSON.stringify(socket.handshake.headers, null, 2)}`);
    // Let people interested in information on our addon know that this socket
    // has connected.
    // bridge.emit(`addon.${addonData.addonId}.connect`, socket);

    log.debug(`new incoming ${addonData.slug} socket connection: ${socket.id}; waiting for HELO`);
    socket.on('disconnect', () => {
      // Drop the connection from our tables
      removeSocket(socket);

      // Let interested parties know that this socket is gone now
      // bridge.emit(`addon.${addonData.addonId}.disconnect`, socket);
      log.debug(`socket connection for ${addonData.slug} closed: ${socket.id}`);
    });

    // If we were given a supplemental initializtion function, then invoked it
    // now do the remainder of the setup.
    if (socketInit !== undefined) {
      socketInit(socket);
    }
  });

  return namespace;
}


// =============================================================================

