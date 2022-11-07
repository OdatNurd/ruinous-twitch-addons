import joker from '@axel669/joker';


// =============================================================================


/* Information about a user, which emcompasses not only a logged in user but
 * also the user that has installed addons and the like. */
const userSchema = {
  "userId": "string",
  "username": "string",
  "displayName": "string",
  "profilePic": "string",
}

/* Information about addons, both installed and uninstalled. These can be pulled
 * in a variety of ways, but all should conform to this structure. */
const addonSchema = {
  "id": "string",
  "installed": "bool",
  "addonId": "string",
  "slug": "string",
  "name": "string",
  "iconPic": "string",
  "blurb": "string",
  "description": "string",
  "requiresChat": "bool",
  "requiresOverlay": "bool",
  "overlayFile": "string",
  "staticFile": "string",
  "overlayId": "string",
  "overlayUrl": "string",
  "configSchema[]": {
    "type": "string",
    "field": "string",
    // "default": "string",      // The default actually depends on the type
    "name": "string",
    "description": "string",
    "?placeholder": "string", // only "string" and "number"; sets the placeholder text
    "?labels[]": "string",    // only "boolean"; sets the label text
    "?values[]": "string",    // only for "enum"; the list of options to pick
    "?integer": "bool",       // Only for "range" and "number"; float or int?
    "?minValue": "number",    // only for "range" and "number"; sets range
    "?maxValue": "number",    // only for "range" and "number"; sets range
    "?stepValue": "number",   // only for "range";  value change on slider
  }
}

/* Information that is returned from a request to install a new addon; this
 * provides back some core information that is needed as a result of the
 * addition to avoid the client that made the call having to make a separate
 * request. */
const addonInstallSchema = {
  "id": "string",
  "userId": "string",
  "addonId": "string",
  "overlayId": "string",
  "overlayUrl": "string",
  "config": {}
}

/* Information that is returned regarding the information on a specific overlay,
 * which includes details on who owns the overlay, the config, and information
 * on the addon that the overlay is for. */
const overlaySchema = {
  "id": "string",
  "userId": "string",
  "addonId": "string",
  "overlayId": "string",
  "config": {},
  "addon": addonSchema,
  "owner": userSchema
}



// =============================================================================


/* Validators that can test wether specific objects match their schema. */
export const validUser = joker.compile({ root: userSchema });
export const validAddonInstall = joker.compile({ root: addonInstallSchema });
export const validAddon = joker.compile({ root: addonSchema });
export const validAddonList = joker.compile({ "root[]": addonSchema });
export const validOverlay = joker.compile({ root: overlaySchema })


// =============================================================================
