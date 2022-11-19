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


/* Information about the various types of configuration objects that can appear
 * in a list of configuration schema items; the schema on this varies depending
 * on the type of the record. */
const addonConfigSchema = {
  "joker.type": "conditional",
  condition: (item) => item.type,

  "string": {
    "type": "string",
    "field": "string",
    "default": "string",
    "name": "string",
    "description": "string",
    "placeholder": "string",
  },

  "int": {
    "type": "string",
    "field": "string",
    "default": "int",
    "name": "string",
    "description": "string",
    "placeholder": "string",
    "?minValue": "int",
    "?maxValue": "int",
  },

  "float": {
    "type": "string",
    "field": "string",
    "default": "number",
    "name": "string",
    "description": "string",
    "placeholder": "string",
    "?minValue": "number",
    "?maxValue": "number",
  },

  "int-slider": {
    "type": "string",
    "field": "string",
    "default": "int",
    "name": "string",
    "description": "string",
    "minValue": "int",
    "maxValue": "int",
    "stepValue": "int",
  },

  "float-slider": {
    "type": "string",
    "field": "string",
    "default": "number",
    "name": "string",
    "description": "string",
    "minValue": "number",
    "maxValue": "number",
    "stepValue": "number",
  },

  "bool": {
    "type": "string",
    "field": "string",
    "default": "bool",
    "name": "string",
    "description": "string",
    "labels": { "joker.type": "array", length: 2 },
    "labels[]": "string",
  },

  "enum": {
    "type": "string",
    "field": "string",
    "default": "string",
    "name": "string",
    "description": "string",
    "placeholder": "string",
    "values": { "joker.type": "array", min: 1 },
    "values[]": {
      "label": "string",
      "value": "string"
    },
  }
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

  // This is only present when the overlayId is not an empty string; when
  // present it should be a URL, and that URL should contain the overlayId as
  // a hashed value.
  "?overlayUrl": "string",
  "configSchema[]": addonConfigSchema
};


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


/* Information that is returned when asking the configuration endpoint to
 * provide the configuration information for a specific addon installed by a
 * specific user. */
const configResponseSchema = {
  "id": "string",
  "userId": "string",
  "addonId": "string",
  "overlayId": "string",
  "overlayUrl": "string",
  "config": {},
  "schema[]": addonConfigSchema
}


// =============================================================================


/* Validators that can test wether specific objects match their schema. */
export const validUser = joker.validator({ root: userSchema });
export const validAddonInstall = joker.validator({ root: addonInstallSchema });
export const validAddon = joker.validator({ root: addonSchema });
export const validAddonList = joker.validator({ "root[]": addonSchema });
export const validOverlay = joker.validator({ root: overlaySchema });
export const validConfigResponse = joker.validator( { root: configResponseSchema });


// =============================================================================
