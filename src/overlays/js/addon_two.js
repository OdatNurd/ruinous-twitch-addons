import '../css/addon_common.css';

import { addonId } from '$seed/addons/addon_two.js';

// import AddonTwo from '../AddonTwo.svelte'

/* Error ouf the page and leave, if there is some issue with starting up. */
function panic(reason) {
  console.log(`AAAH, PANIC AT THE DISCO: ${reason}`);
}

/* Launch the overlay; this will connect via a socket connection to the back end
 * and request information about the overlay itself, which includes its config
 * info and the "owner" of this instance of it.
 *
 * If all checks out, the overlay is started and can do what it likes. If there
 * is some error, an error dialog is displayed and nothing else happens. */
function launch(addonId, entrypoint) {
  // Get the overlayID from the window location hash; if there isn't one, we
  // are unhappy and can't possibly continue.
  const overlayId = location.hash.substr(1);
  if (overlayId === undefined) {
    return panic('There was no overlayID provided in the URL fragment');
  }

  // Connect our socket, specifying a distinct namespace that we should be
  // talking to which is based on the addon ID.
  //
  // The defaults are to connect right away, reconnect on disconnect, and keep
  // trying for forever. In addition
  let socket = io(`/${addonId}`, {
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
        panic(info.reason);
      } else {
        entrypoint(info);
      }
    });
  });

  // We got disconnected; we might want to set a flag so that we know it
  // happened allowing us to respond to a reconnect.
  socket.on('disconnect', (e) => console.log(`our socket got disconnected`));
}

// Kick off the overlay with our hard coded addon ID; the library will make
// all connections and fetch all information. If all is well, the callback will
// be invoked with information on the overlay that we're serving.
launch(addonId, overlayInfo => {
  console.log('Our overlay configuration is: ', overlayInfo);
});