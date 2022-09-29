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
    // message that tells us about ourselves.
    //
    // This only happens on initial connect; in other cases we should silently
    // pick up where we left off; the server side can apprise of of any missing
    // information when we reconnect.
    socket.once('connect', () => {
      console.log(`addon two overlay ${socket.id} requesting overlay info`);
      socket.emit('get-overlay-info', overlayId, (info) => {
        if (info.success === false) {
          reject(info.reason);
        } else {
          resolve(info);
        }
      });
    });

    // We got disconnected; we might want to set a flag so that we know it
    // happened allowing us to respond to a reconnect.
    socket.on('disconnect', (e) => console.log(`our socket got disconnected`));
  });
}


// =============================================================================
