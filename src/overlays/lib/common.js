// =============================================================================


function getClientSocket(addonId) {
  // Connect our socket, specifying a distinct namespace that we should be
  // talking to which is based on the addon ID.
  //
  // The defaults are to connect right away, reconnect on disconnect, and keep
  // trying for forever. In addition
  return io(`/${addonId}`, {
    // The amount of time a connection attempt will wait to establish before
    // failing.
    timeout: 20000,

    // Immediately connect and always reconnect if we get disconnected; keep
    // trying forever.
    autoConnect: true,
    reconnection: true,
    reconnectionAttempts: Infinity,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,

    // This factor is applied to the reconnection time so that if the server goes
    // down ti doesn't get immediately swamped by all clients connecting again.
    randomizationFactor: 0.5,

    // we want to use websockets right away if they are available, and fall back
    // to polling only if they're not (and we probably don't want polling either,
    // generally speaking).
    transports: ["websocket", "polling"]
  });
}


// =============================================================================


/* Transmit a HELO message to the back end with the provided overlayInfo object
 * to tell it who we are.
 *
 * The back end, while it will acknowledge our connection and respond to some
 * incoming requests (such as the request for overlay information) will not
 * treat us as connected until we announce ourselves and it knows who we are. */
function announce(socket, overlayInfo) {
  socket.emit('HELO', {
    overlayId: overlayInfo.overlayId,
    addonId: overlayInfo.addonId,
    owner: overlayInfo.owner
  });
}


// =============================================================================


/* "Launch" the overlay; this will create a socket connection to the back end,
 * gather the overlayId from the hash in the URL, and use it to request info
 * from the back end on this particular overlay.
 *
 * If the overlayId cannot be found or is not valid as far as the back end is
 * concerned, this will reject with an error that indicates what went wrong.
 *
 * On success it will announce itself to the back end code as an overlay for a
 * specific Addon associated with a specific user. */
export function launch(addonId) {
  return new Promise((resolve, reject) => {
    // Get the overlayID from the window location hash; if there isn't one, we
    // are unhappy and can't possibly continue.
    const overlayId = location.hash.substr(1);
    if (overlayId === undefined) {
      return reject('There was no overlayID provided in the URL fragment');
    }

    // Create the socket that will talk to the back end code for this addon ID.
    const socket = getClientSocket(addonId);

    // When we connect for the very first time, request information about this
    // overlay from the back end code; this will respond with an overlay-info
    // message that tells us about ourselves and also provides the socket
    // instance so that the overlay can talk to the back end for any other
    // requests it needs to.
    //
    // This only happens on initial connect; in other cases we should silently
    // pick up where we left off; the server side can apprise of of any missing
    // information when we reconnect.
    socket.once('connect', () => {
      socket.emit('get-overlay-info', overlayId, (overlayInfo) => {
        if (overlayInfo.success === false) {
          reject(overlayInfo.reason);
        } else {
          // Announce to the back end code who we are so that it can track our
          // socket with more context.
          announce(socket, overlayInfo)

          // Set up to listen for further connects by just announcing to the
          // back end with the information that we already have.
          setTimeout(() => {
            socket.on('connect', () => {
              announce(socket, overlayInfo)
            });
          }, 0);

          resolve({overlayInfo, socket});
        }
      });
    });

    // We got disconnected; we might want to set a flag so that we know it
    // happened allowing us to respond to a reconnect.
    socket.on('disconnect', (e) => console.log(`our socket got disconnected`));
  });
}


// =============================================================================
