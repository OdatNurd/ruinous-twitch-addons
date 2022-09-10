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
 * that is expected to be authorized, but there is no authorization token
 * present (or there is, but it is invalid). */
export class NotFound extends Error {
  constructor(message = "", ...args) {
    super(message, ...args);
  }
}


// =============================================================================
