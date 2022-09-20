import { config } from '#core/config';
import { logger } from '#core/logger';
import { Unauthorized, NotFound } from '#lib/exceptions';

import { PrismaClient, Prisma } from '@prisma/client';

import crypto from 'crypto';


// =============================================================================


/* Some helper functions for sending results of queries back to the initiating
 * client end, if those queries don't need to contain a specific body. */
const error = (res, status, reason) => res.status(status).json({ success: false, reason })


/* Get our subsystem logger. */
const log = logger('db');


// =============================================================================


/* When we persist token information into the database, we first encrypt it to
 * ensure that casual inspection doesn't leak anything important. This sets the
 * algorithm that is used for the encryption. */
const algorithm = 'aes-256-ctr';

/* The secret to use when performing encryption and decryption; if this changes
 * after data has been encrypted into the database, that data will be rendered
 * unreadable. */
const cryptSecret = config.get('db.cryptKey');

/* A map between Prisma error codes (from the PrismaClientKnownRequestError
 * exception) and what the eventual HTTP status code for that error should
 * be. */
const prismaErrorMap = {
  // Unique constraint failed on the {constraint}
  "P2002": 409,

  // Foreign key constraint failed on the field: {field_name}
  "P2003": 404,

  // "The column {column} does not exist in the current database."
  "P2022": 404,

  // "An operation failed because it depends on one or more records that were
  // required but not found. {cause}"
  "P2025": 404,
}


// =============================================================================


/* Given an exception that has been thrown as a result of a Prisma DB request
 * failing, return back an appropriate value to return from the request handler
 * to indicate the error.
 *
 * This may potentialy contain a response body that indicates the reason for
 * the error, or it may just include the HTTP status to return, depending on
 * the error.
 *
 * There is special handling for Prisma exceptions, but this can provide a
 * response for any exception that's caught. */
export function dbErrResponse(errorObj, res) {
  // Pluck out the error, sanitize it, and display it
  const msg = errorObj.message.replace(/\n/g, '');
  log.error(msg);

  // Is the error related to the user not being authorized?
  if (errorObj instanceof Unauthorized) {
    return error(res, 401, msg);
  }

  // Is the error that something that was expected is not found?
  if (errorObj instanceof NotFound) {
    return error(res, 404, msg);
  }

  // If this is a Prisma error, handle it specifically.
  if (errorObj instanceof Prisma.PrismaClientKnownRequestError) {

    // Use the prisma error map to determine the status; anything we don't
    // recognize is a generic 500. This also grabs out a potential error
    // body to help diagnose the error.
    return error(res, prismaErrorMap[errorObj.code] || 500, errorObj.meta.cause || msg)
  }

  // The exception is not Prisma related; a generic fail.
  return error(res, 500, msg);
}


// =============================================================================


/* Given a piece of text, encrypt it. This will return an encrypted version of
 * the string suitable for passing to the decrypt endpoint. */
export function encrypt(text) {
  // Create a new initialization vector for each encryption for extra
  // security; this makes the key harder to guess, but is required in order to
  // decrypt the data.
  const iv = crypto.randomBytes(16);

  // Do the encryption on the data, leaving it in an encrypted buffer.
  const cipher = crypto.createCipheriv(algorithm, cryptSecret, iv);
  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  // The returned value needs to contain the initialization vector used during
  // the operation as well as the data, so bundle it into an object.
  //
  // We then convert that into a string and encode it as base64 so that it's a
  // single string that's easier on the eyes and easier to store in the
  // database.
  return Buffer.from(JSON.stringify({
    iv: iv.toString('hex'),
    content: encrypted.toString('hex')
  })).toString('base64');
}


// =============================================================================


/* Given a piece of encrypted text that was returned from the encrypt function,
 * decrypt it and return the original string. */
export function decrypt(text) {
  // Decode the incoming text back into base64, and then decode it back into
  // an object that contains the encrypted data and the vector used to create
  // it.
  const hash = JSON.parse(Buffer.from(text, 'base64').toString('utf-8'));
  const iv = Buffer.from(hash.iv, 'hex');

  // Create the object that will do the decrypt using the data from the hash
  const decipher = crypto.createDecipheriv(algorithm, cryptSecret, iv);
  const content = Buffer.from(hash.content, 'hex');

  // Return the decrypted data.
  return Buffer.concat([decipher.update(content), decipher.final()]).toString();
}


// =============================================================================


export const db = new PrismaClient();
