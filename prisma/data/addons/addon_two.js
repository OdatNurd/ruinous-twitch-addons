import { trim, icon } from '#seed/tools';


// =============================================================================


/* The unique ID for this addon; this is a ksuid and is the only part of an
 * addon that is guaranteed not to chance once an addon is made publicly
 * available (unless the addon is removed from the applciation entirely). */
export const addonId = '2BNIa2BOEP7kF10eeOdObXjNsQk';


/* The configuration schema for this addon. */
const config = [
  // Simple String; has a default value, and that's that.
  {
    "type": "string",
    "field": "nickname",
    "default": "Curmudgeon",
    "name": "Nickname of a guy somewhere",
    "description": trim(`
      This sets the nickname to use for whatever it is that this addon is
      actually doing. I have ***no idea*** what that might actually be though.
    `),
    "placeholder": "nickname of the guy",
  },
]


/* The core data for the addon. This pulls in the ID and the above schema
 * info into a complete object describing the properties of the addon. */
export const data = {
  'addonId': addonId,
  'name': 'Addon Part Two',
  'slug': 'addon-two',
  'iconPic': icon('witch_hat.png'),
  'blurb': trim(`
    A second addon. This one does something different than the first one does.
  `),
  'description': trim(`
    This addon is for testing purposes and is something that will display
    content visually in stream via an overlay, but which doesn't have or need
    an integration with the Twitch chat of the user that adds it.
  `),
  'requiresChat': false,
  'requiresOverlay': true,
  'overlayFile': 'AddonTwo.svelte',
  'staticFile': 'addon_two.html',
  'configSchema': config,
};


// =============================================================================
