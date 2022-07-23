// =============================================================================


const _ = text => text.replace(/[ \t]+/g, ' ').trim();


// =============================================================================


export const config = [
  {
    "name": "Nickname of a guy somewhere",
    "field": "nickname",
    "description": _(`
      This sets the nickname to use for whatever it is that this addon is
      actually doing. I have ***no idea*** what that might actually be though.
    `),
    "placeholder": "nickname of the guy",
    "type": "string",
    "default": "Curmudgeon",
  },
  {
    "name": "Should we kick people whose nicks include a Z?",
    "field": "kickTheZed",
    "description": _(`
      Because we need to test the \`boolean\` type, this setting controls
      wether or not people whose nicks start with a Z are kicked somewhere
      for some unknown reason.
      `),
    "type": "boolean",
    "default": true,
  },
  {
    "name": "Raid frequency in femtoseconds",
    "field": "femtoRaidTime",
    "description": _(`
      Sets the time between automated raids in the super handy time base of
      femtoseconds, because we like big numbers and we cannot lie.
    `),
    "placeholder": "raid time (femtoseconds)",
    "type": "number",
    "range": false, // If true, displayed in controls as a slider; must have min and max
    "default": 69,
    "integer": true, // If true, only non-floating point numbers are allowed
  },
  {
    "name": "Coolness Level",
    "field": "coolnessFactor",
    "description": _(`
      On a scale of *0* to *10*, where *0* is a low number and *10* is a high
      number, make an arbitrary determination for how cool something random is.
    `),
    "type": "number",
    "range": true, // If true, displayed in controls as a slider; must have min and max
    "minValue": 0,
    "maxValue": 10,
    "default": 10,
    "integer": true, // If true, only non-floating point numbers are allowed
  },
  {
    "name": "What place to give people named Zeke",
    "field": "placeOfZeke",
    "description": _(`
      In the olympics, what place do we want to pretend Zeke got in the melon
      growing event?

      ***NOTE:*** If the option to kick people whose nicks start with Z is
      turned on above, then poor Zeke is gonna get the shaft.
    `),
    "type": "enum",
    "values": ["first", "second", "third"],
    "default": "third",
  },
]


// =============================================================================
