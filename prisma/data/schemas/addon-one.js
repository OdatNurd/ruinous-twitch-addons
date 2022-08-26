// =============================================================================


const _ = text => text.replace(/[ \t]+/g, ' ').trim();


// =============================================================================


export const config = [
  // Simple String; has a default value, and that's that.
  {
    "type": "string",
    "field": "nickname",
    "default": "Curmudgeon",
    "name": "Nickname of a guy somewhere",
    "description": _(`
      This sets the nickname to use for whatever it is that this addon is
      actually doing. I have ***no idea*** what that might actually be though.
    `),
    "placeholder": "nickname of the guy",
  },

  // A toggle-able boolean value; has a default and requires you to specify the
  // labels for when it's turned on and off, so that you can tell what it's
  // gonna do.
  {
    "type": "boolean",
    "field": "kickTheZed",
    "default": false,
    "name": "Should we kick people whose nicks include a Z?",
    "description": _(`
      Because we need to test the \`boolean\` type, this setting controls
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
    "description": _(`
      In the olympics, what place do we want to pretend Zeke got in the melon
      growing event?

      ***NOTE:*** If the option to kick people whose nicks start with Z is
      turned on above, then poor Zeke is gonna get the shaft.
    `),
    "values": ["first", "second", "third"],
  },

  // A number slider; must have a minimum, maximum and a step value that
  // controls what the values are. This is also tied to an edit control that
  // allows you to directly specify a value. If desired, you can force the
  // value selected to be an integer.
  {
    "type": "range",
    "field": "coolnessFactor",
    "default": 10,
    "name": "Coolness Level",
    "description": _(`
      On a scale of *0* to *10*, where *0* is a low number and *10* is a high
      number, make an arbitrary determination for how cool something random is.
    `),
    "integer": false, // If true, only non-floating point numbers are allowed
    "minValue": 0,
    "maxValue": 10,
    "stepValue": 0.1,
  },

  // A number input field; this is for freeform number entry where a slider
  // might not be appropriate. Minimum and Maximum values are supported, but
  // optional. If desired, you can force the value entered to be an integer.
  {
    "type": "number",
    "field": "femtoRaidTime",
    "default": 69,
    "name": "Raid frequency in femtoseconds",
    "description": _(`
      Sets the time between automated raids in the super handy time base of
      femtoseconds, because we like big numbers and we cannot lie.
    `),
    "placeholder": "raid time (femtoseconds)",
    "integer": true, // If true, only non-floating point numbers are allowed
    // These fields are optional here
    "minValue": 0,
    "maxValue": 10,
  },
]


// =============================================================================
