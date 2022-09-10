import { writable, derived } from 'svelte/store';


// =============================================================================


/* This simple function will return back a random unique ID value to be used
 * on the toast notfications, since Svelte needs something to distinguish
 * components when they're added to the DOM to know how to update things. */
const _id = () => '_' + Math.random().toString(36).substr(2, 9)


// =============================================================================


/* Create and return an object that will store our toast notification messages;
 * this is set up as a store which will auto-remove items contained a short
 * time after they are added; the timing of that is configurable. */
function createNotificationStore () {
  // Create a base store that contains our notifications; this will be
  // manuipulated via a derived store, which allows us to remove notifications
  // after a set time.
  const _notifications = writable([]);

  /* The core method for adding in a notification; this will add a new record
   * to the underlying notification store, triggering anything that is
   * subscribed to it when the change happens. */
  function send(message, type, timeout) {
    // Update the store; the callback gets the current state and we return
    // a new state, which is the original state plus one new notification using
    // the values given.
    _notifications.update(state => [...state, { id: _id(), type, message, timeout }]);
  }

  // Derive a store from the notification store which will automaticaly set a
  // timer to remove the item added once it's been set, causing the underlying
  // store to also change.
  const notifications = derived(_notifications, ($_notifications, set) => {
    set($_notifications);

    // If there is at least one notification now, set a timer to remove it from
    // the underlying store when the timeout for it expires.
    if ($_notifications.length > 0) {
      const timer = setTimeout(() => {
        // Update the store by throwing the first item off, then setting the
        // value back in.
        _notifications.update(state => {
          state.shift();
          return state;
        })
      }, $_notifications[0].timeout);

      // Return back a closure that will be called if there are no subscribers
      // to cancel our running timeout.
      return () => {
        clearTimeout(timer);
      }
    }
  })

  // Pull the subscribe method out of the derived store, then return back our
  // own "store-like" object, which allows you to subscribe to it and trigger
  // notifications using the built in method.
  const { subscribe } = notifications
  return {
    subscribe,
    message: (msg, timeout) => send(msg, 'message', timeout ?? 1000),
    info: (msg, timeout) => send(msg, 'info', timeout ?? 1000),
    warning: (msg, timeout) => send(msg, 'warning', timeout ?? 1000),
    success: (msg, timeout) => send(msg, 'success', timeout ?? 1000),
    error: (msg, timeout) => send(msg, 'error', timeout ?? 1000),
  }
}


// =============================================================================


/* Create a notification store to be used for our toast mechanim and export it
 * for the layout to use. */
export const toast = createNotificationStore()