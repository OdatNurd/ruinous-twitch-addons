import { addons } from '#seed/addons/index';

import joker from '@axel669/joker';


/// =============================================================================


/* This object contains the schema validation functions that are used to
 * validate the configuration for any given addon; the keys are the addonID's
 * and the values are the joker validation function that will verify that any
 * object passed in is valid based on the schema for that addon. */
const addonConfigSchemas = {};
for (let addon of addons) {
  addonConfigSchemas[addon.addonId] = createConfigSchema(addon);
}


/// =============================================================================


/* Given an addon configuration record, this will return back a joker validation
 * function that valides a configuration record for the config data of that
 * particular addon.
 *
 * Calling the returned function with an object will return true if the config
 * is valid, and a list of reasons why it's not otherwise. */
function createConfigSchema(addonInfo) {
  const schema = {}

  for (let entry of addonInfo.configSchema) {
    let validator;

    switch (entry.type) {
      // Strings and booleans are just simple validations; their fields must be
      // of the appropriate type.
      // TODO: Name the internal boolean type bool so that it matches what
      // joker uses, and then these two items can coalesce and all is nice.
      case 'string':
        validator = 'string';
        break;

      case 'boolean':
        validator = 'bool';
        break;

      // Numbers and ranges must be numbers in a specific range.
      // TODO: This does not validate config.integer, which checks if the
      //       value should be an integer or not.
      case 'number':
      case 'range':
        validator = { 'joker.type': 'number', min: entry.minValue , max: entry.maxValue };
        break;

      // Enumerations must have a value in the configured list of valid items.
      // For these we need to create a custom type based on the name of the
      // enumeration field and the addon that it's for.
      case 'enum':
        const validValues = entry.values.map(e => e.value);

        validator = `${addonInfo.slug}-${entry.field}`;
        const validatorKey = `${validator}.$`;

        joker.extendTypes({ [validatorKey]: (item) => validValues.indexOf(item) === -1 });
        joker.extendErrors({ [validatorKey]: (path) => `${path} is not one of: [${validValues.join(', ')}]` });
        break;

      default:
        throw new TypeError(`cannot create validator; unknown type ${entry.type}`);
    }

    schema[entry.field] = validator;
  }

  return joker.validator({ root: schema })
}

// =============================================================================


/* Given the addonId of an addon and a potential configuration object for that
 * addon, validate to see if the object is valid or not. The return value is
 * true if the validation is successful or an array specifying the reason why
 * not otherwise.
 *
 * If the addon is not a known addon, this will return null to signal that. */
export function validateAddonConfig(addonId, configInfo) {
  const validator = addonConfigSchemas[addonId];

  return validator ? validator(configInfo) : null;
}


// =============================================================================



