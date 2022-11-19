// =============================================================================


/* This is a simple custom exception to be thrown when a request is being made
 * that is expected to be authorized, but there is no authorization token
 * present (or there is, but it is invalid). */
export class Unauthorized extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}


// =============================================================================


/* This is a simple custom exception to be thrown when a request is being made
 * that is expected to operate on a resource but that resource is not found */
export class NotFound extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}


// =============================================================================


/* This is a simple custom exception to be thrown when an attempt is made to
 * modify a configuration record but the configuration data is not valid (does
 * not meet the schema requirements for the addon the config is for). */
export class InvalidConfigError extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}


// =============================================================================
