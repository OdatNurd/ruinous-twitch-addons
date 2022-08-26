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
]


// =============================================================================
