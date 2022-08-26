// =============================================================================


import { config as addonOneSchema } from './schemas/addon-one.js';
import { config as addonTwoSchema } from './schemas/addon-two.js';
import { config as addonThreeSchema } from './schemas/addon-three.js';


// =============================================================================


/* Some helper functions to make our configuration easier to read. */
const _ = text => text.replace(/[ \t]+/g, ' ').trim();
const icon = text => `/icons/addons/${text}`
const schema = obj => JSON.stringify(obj)


// =============================================================================


/* A list of all of the currently known addons in the system. */
export const addons = [
  {
    'addonId': '2BNIO9lVnPY9lKgIMsBVQICBLAM',
    'name': 'Addon The First',
    'slug': 'addon-one',
    'iconPic': icon('skull.png'),
    'blurb': _(`
      A simple addon that does something cool.
    `),
    'description': _(`
      For testing purposes, this is a sample addon that only requires an
      integration with the Twitch chat, but doesn't display anything and thus
      doesn't need an overlay.
    `),
    'requiresChat': true,
    'requiresOverlay': false,
    'overlayFile': '',
    'configSchema': schema(addonOneSchema),
  },
  {
    'addonId': '2BNIa2BOEP7kF10eeOdObXjNsQk',
    'name': 'Addon Part Two',
    'slug': 'addon-two',
    'iconPic': icon('witch_hat.png'),
    'blurb': _(`
      A second addon. This one does something different than the first one does.
    `),
    'description': _(`
      This addon is for testing purposes and is something that will display
      content visually in stream via an overlay, but which doesn't have or need
      an integration with the Twitch chat of the user that adds it.
    `),
    'requiresChat': false,
    'requiresOverlay': true,
    'overlayFile': 'addon_two.html',
    'configSchema': schema(addonTwoSchema),
  },
  {
    'addonId': '2C0usq54Rpo4TZtuQa7mDADAhjV',
    'name': 'Addon Numero Troi',
    'slug': 'addon-three',
    'iconPic': icon('power_plug.png'),
    'blurb': _(`
      This is the third, and greatest, of the sample addons; it uses both the
      chat AND an overlay.
    `),
    'description': _(`
      This extra special test addon is purely for having a test record for which
      it is known that we both display something visually using an overlay and
      also require a connection to the Twitch chat of the user to gather commands
      and/or display output.
    `),
    'requiresChat': true,
    'requiresOverlay': true,
    'overlayFile': 'addon_three.html',
    'configSchema': schema(addonThreeSchema),
  }
]


// =============================================================================
