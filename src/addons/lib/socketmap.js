import { logger } from '#core/logger';


// =============================================================================


/* Get our subsystem logger. */
const log = logger('socket-map');

/* An object that wraps our current connections to overlays; in the table,
 * the keys are:
 *    - the socket.id of a socket
 *    - a combination of a userId and an addonId
 *
 * This allows us to look up information on a connection based either on its
 * socket id (say in response to a socket event) OR by knowing a particular
 * Twitch user that we want to address and the addon to which we want to address
 * it.
 *
 * For keys of the first form, the value is an object that provides information
 * about the overlay at the other end, which includes its ID, the ID of the
 * addon it represents, information on the owner of the socket, and the socket
 * object itself.
 *
 * For keys of the second form, the value is an array of the objects as seen in
 * the first form because it's possible for multiple connections from the same
 * overlay to exist (e.g. different browser tabs or OBS scenes).
 *
 * A socket ID is in a distinct namespace from both a Twitch userID and an
 * addonID, so there is no chance of collisions in the table, but note that the
 * arrays will contain references to the objects in the socket.id keys.
 *
 * The routines that maintain this table will make sure to make or break links
 * as needed. */
 const socketMap = {
  // "socket.id": { overlayId, addonId, owner, socket },
  // "userId.addonId": [{ overlayId, addonId, owner, socket }],
};

/* For our socketMap we need to store keys that are a composite of the userId
 * and addonId of a given overlay; this simple lambda creates such a key for
 * us. */
const userAddonKey = info => `${info.owner.userId}.${info.addonId}`;


// =============================================================================


/* Given a socket object and information on the overlay to which it applies,
 * this will check the socket map to make sure that this socket isn't already
 * represented in the table.
 *
 * If it's not, this will add the appropriate entries to the socket map to
 * allow external code to look up information both by the socket ID as well as
 * by the unique combination of the user and addon.
 *
 * All entries stored in the table include all available information in their
 * values, which includes the socket as well, allowing for easier communications
 * with the remote overlays. */
export function addSocket(socket, overlayInfo) {
  // In the general case, we should be getting full on Objects; however some
  // interactive test tools provide us the data as a string instead, which is
  // sad.
  if (typeof overlayInfo === "string") {
    overlayInfo = JSON.parse(overlayInfo);
  }

  // If a socket with this ID is already in the socketMap, then this socket is
  // already represented. This should never happen in the normal course of
  // things, but it is indicative of an overlay announcing itself more than
  // once, which is not cool.
  let entry = socketMap[socket.id];
  if (socketMap[socket.id] !== undefined) {
    log.warn(`socket ${socket.id} is already in the socket map (${overlayInfo.owner.displayName}:${overlayInfo.addonId})`)
    return;
  }

  log.info(`HELO from socket ${socket.id} (${overlayInfo.owner.displayName}:${overlayInfo.addonId})`)

  // Create the entry that we want to store, which is going to be a duplicate
  // of the incoming information, but with the socket attached.
  entry = { socket, ...overlayInfo }

  // Create a key for our composite lookup and grab the value; if it's not
  // available yet, then add it.
  const key = userAddonKey(overlayInfo);
  const addonList = socketMap[key] ?? [];

  // Add in the socket ID map directly, and then our composite key; this
  // operation may have surfaced a new array, so make sure to store it back.
  socketMap[socket.id] = entry;
  addonList.push(entry);
  socketMap[key] = addonList;
}


// =============================================================================


/* Update the socket map to remove the connection for the given socket.
 *
 * This will remove all entries for that socket, which includes composite keys
 * that are looked up by other information but still share the same socket. */
export function removeSocket(socket) {
  // Find the entry that associates with this socket in our table; if this is
  // not found, we can do nothing.
  const entry = socketMap[socket.id];
  if (entry === undefined) {
    log.warn(`socket with id ${socket.id} disconnected, but was not found in the socket map`);
    return;
  }

  log.info(`disconnect from socket ${socket.id} (${entry.owner.displayName}:${entry.addonId})`)


  // Grab out the list of overlays that associate with the user and addon for
  // this key.
  const key = userAddonKey(entry);
  let addonList = socketMap[key] ?? [];

  // Remove from the addonList array all entries where the socket.id matches.
  const idx = addonList.findIndex((item) => item.socket.id === socket.id);
  if (idx !== -1) {
    addonList.splice(idx, 1);
  } else {
    log.warn(`socket with id ${socket.id} disconnected, but was not found in ${key}`);
  }

  // We can get rid of the keys now; if we ended up removing all of the entries
  // for the composite key, we can remove that key too.
  delete socketMap[socket.id];
  if (addonList.length === 0) {
    delete socketMap[key];
  }
}


// =============================================================================


/* Given a socket, return back the structure that defines what it associates
 * with; if there is no record of this socket, null is returned */
export function socketLookupBySocket(socket) {
  return socketMap[socket.id] ?? null;
}


// =============================================================================


/* Given a userId and an addonId, return back the sockets that represent
 * connections for overlays in that addon for that user.
 *
 * The return value is an array of data items, which may be empty. */
export function socketLookupByUser(userId, addonId) {
  const key = userAddonKey({ userId, addonId });
  return socketMap[key] ?? [];
}


// =============================================================================

