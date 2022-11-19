import { trim, icon } from '#seed/tools';


// =============================================================================


/* The unique ID for this addon; this is a ksuid and is the only part of an
 * addon that is guaranteed not to chance once an addon is made publicly
 * available (unless the addon is removed from the applciation entirely). */
export const addonId ='2BNIO9lVnPY9lKgIMsBVQICBLAM';


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

  // A toggle-able boolean value; has a default and requires you to specify the
  // labels for when it's turned on and off, so that you can tell what it's
  // gonna do.
  {
    "type": "bool",
    "field": "kickTheZed",
    "default": false,
    "name": "Should we kick people whose nicks include a Z?",
    "description": trim(`
      Because we need to test the \`bool\` type, this setting controls
      whether or not people whose nicks start with a Z are kicked somewhere
      for some unknown reason.
      `),
    "labels": ["Zed is a cool dude", "Zed's Dead, baby." ],
  },

  // An enumeration; a list of possible values, and a default value.
  {
    "type": "enum",
    "field": "placeOfZeke",
    "default": "third",
    "name": "What place to give people named Zeke",
    "description": trim(`
      In the olympics, what place do we want to pretend Zeke got in the melon
      growing event?

      ***NOTE:*** If the option to kick people whose nicks start with Z is
      turned on above, then poor Zeke is gonna get the shaft.
    `),
    "placeholder": "Select Zeke's Winnability",
    "values": [
      {
        "label": "The first option",
        "value": "first"
      },
      {
        "label": "The middle option" ,
        "value": "second"
      },
      {
        "label": "The non sequiter option",
        "value": "third"
      }
    ],
  },

  // An integer input fiield; this is for freeform number entry where a slider
  // might not be appropriate, and for which a whole number is desired.
  // Minimum and maximum values are supported, but are optional if you want an
  // unbounded number. They don't have to be provided in pairs.
  {
    "type": "int",
    "field": "toadsSprocketed",
    "default": 69,
    "name": "Number of Toads to Sprocket",
    "description": trim(`
      For the purposes of this setting, the Sprocket doesn't need to be wet.
    `),
    "placeholder": "Toads to be sprocketed",
    "minValue": 0,
    "maxValue": 100,
  },

  // An integer slider; must have a minimum, maximum and a step value that
  // controls what the values are. This is also tied to an edit control that
  // allows you to directly specify a value. The value is forced to be an
  // integral value.
  {
    "type": "int-slider",
    "field": "wetnessFactor",
    "default": 10,
    "name": "Wetness Level",
    "description": trim(`
      On a scale of *0* to *10*, where *0* is a low number and *10* is a high
      number, how wet are the sprockets that we use for toading.
    `),
    "minValue": 0,
    "maxValue": 10,
    "stepValue": 1,
  },

  // An float input fiield; this is for freeform number entry where a slider
  // might not be appropriate, and for which a fractional number is desired.
  // Minimum and maximum values are supported, but are optional if you want an
  // unbounded number. They don't have to be provided in pairs.
  {
    "type": "float",
    "field": "gigawatts",
    "default": 1.21,
    "name": "1.21 Gigawatts?!",
    "description": trim(`
      What was I thinking, Tom? It can't be done, it can't!
    `),
    "placeholder": "Ride the lightning",
    "minValue": 0,
    "maxValue": 10,
  },

  // An integer slider; must have a minimum, maximum and a step value that
  // controls what the values are. This is also tied to an edit control that
  // allows you to directly specify a value. The value is forced to be an
  // integral value.
  {
    "type": "float-slider",
    "field": "lightningCount",
    "default": 1,
    "name": "Lightning Bolt Count",
    "description": trim(`
      How many lightning bolts do we think we're going to need?
    `),
    "minValue": 0,
    "maxValue": 1,
    "stepValue": 0.01,
  },
]


/* The core data for the addon. This pulls in the ID and the above schema
 * info into a complete object describing the properties of the addon. */
export const data = {
  'addonId': addonId,
  'name': 'Addon The First',
  'slug': 'addon-one',
  'iconPic': icon('skull.png'),
  'blurb': trim(`
    A simple addon that does something cool.
  `),
  'description': trim(`
    For testing purposes, this is a sample addon that only requires an
    integration with the Twitch chat, but doesn't display anything and thus
    doesn't need an overlay.
  `),
  'requiresChat': true,
  'requiresOverlay': false,
  'overlayFile': '',
  'staticFile': '',
  'configSchema': config,
};


// =============================================================================