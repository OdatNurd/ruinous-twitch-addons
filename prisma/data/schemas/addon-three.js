export const config = [
  {
    "name": "fieldOne",
    "type": "string",
    "default": "some value",
    "required": true,
  },
  {
    "name": "fieldTwo",
    "type": "boolean",
    "default": true,
    "required": true,
  },
  {
    "name": "fieldThree",
    "type": "number",
    "range": true, // If true, displayed in controls as a slider; must have min and max
    "minValue": 0,
    "maxValue": 100,
    "default": 69,
    "integer": true, // If true, only non-floating point numbers are allowed
    "required": true,
  },
  {
    "name": "fieldFour",
    "type": "enum",
    "values": ["first", "second", "third"],
    "default": "first",
    "required": true,
  },
]