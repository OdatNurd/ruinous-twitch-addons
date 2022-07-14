// =============================================================================


/* Some helper functions to make our configuration easier to read. */
const _ = text => text.replace(/[ \t]+/g, ' ').trim();
const icon = text => `/icons/addons/${text}`


// =============================================================================


/* A list of all of the currently known addons in the system. */
export const addons = [
  {
    'addonId': '2BNIO9lVnPY9lKgIMsBVQICBLAM',
    'name': 'Addon One',
    'slug': 'addon-one',
    'iconPic': icon('skull.png'),
    'title': 'The First Addon',
    'description': _(`The first, sample addon for use in testing.`),
    'requiresChat': true,
    'requiresOverlay': false,
    'configSchemaUrl': '',
    'defaultConfigUrl': '',
  },
  {
    'addonId': '2BNIa2BOEP7kF10eeOdObXjNsQk',
    'name': 'Addon Two',
    'slug': 'addon-two',
    'iconPic': icon('witch_hat.png'),
    'title': 'The Second Addon',
    'description': _(`
*Lorem* **ipsum** \`dolor\` sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.

Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse
cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    `),
    'requiresChat': false,
    'requiresOverlay': true,
    'configSchemaUrl': '',
    'defaultConfigUrl': '',
  }
]


// =============================================================================
