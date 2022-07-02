// =============================================================================


/* Some helper functions to make our configuration easier to read. */
const _ = text => text.replace(/\s+/g, ' ').trim();
const icon = text => `/icons/addons/${text}`


// =============================================================================


/* A list of all of the currently known addons in the system. */
export const addons = [
  {
    'addonId': '2BNIO9lVnPY9lKgIMsBVQICBLAM',
    'name': 'Addon One',
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
    'iconPic': icon('witch_hat.png'),
    'title': 'The Second Addon',
    'description': _(`The second, sample addon for use in testing. This one is 80% lamer.`),
    'requiresChat': false,
    'requiresOverlay': true,
    'configSchemaUrl': '',
    'defaultConfigUrl': '',
  }
]


// =============================================================================
