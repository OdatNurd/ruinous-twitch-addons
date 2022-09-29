import { trim, schema, icon } from '#seed/tools';


// =============================================================================


/* The unique ID for this addon; this is a ksuid and is the only part of an
 * addon that is guaranteed not to chance once an addon is made publicly
 * available (unless the addon is removed from the applciation entirely). */
export const addonId ='2C0usq54Rpo4TZtuQa7mDADAhjV';


/* The configuration schema for this addon. */
const config = [
  // A number slider; must have a minimum, maximum and a step value that
  // controls what the values are. This is also tied to an edit control that
  // allows you to directly specify a value. If desired, you can force the
  // value selected to be an integer.
  {
    "type": "range",
    "field": "coolnessFactor",
    "default": 10,
    "name": "Coolness Level",
    "description": trim(`
      On a scale of *0* to *10*, where *0* is a low number and *10* is a high
      number, make an arbitrary determination for how cool something random is.
    `),
    "integer": false, // If true, only non-floating point numbers are allowed
    "minValue": 0,
    "maxValue": 10,
    "stepValue": 0.1,
  },
]


/* The core data for the addon. This pulls in the ID and the above schema
 * info into a complete object describing the properties of the addon. */
export const data = {
  'addonId': addonId,
  'name': 'Addon Numero Troi',
  'slug': 'addon-three',
  'iconPic': icon('power_plug.png'),
  'blurb': trim(`
    This is the third, and greatest, of the sample addons; it uses both the
    chat AND an overlay.
  `),
  'description': trim(`
    This extra special test addon is purely for having a test record for which
    it is known that we both display something visually using an overlay and
    also require a connection to the Twitch chat of the user to gather commands
    and/or display output.
  `),
  'requiresChat': true,
  'requiresOverlay': true,
  'overlayFile': 'AddonThree.svelte',
  'staticFile': 'addon_three.html',
  'configSchema': schema(config),
};


// =============================================================================

