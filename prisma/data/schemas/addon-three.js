// =============================================================================


const _ = text => text.replace(/[ \t]+/g, ' ').trim();


// =============================================================================


export const config = [
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
]


// =============================================================================
