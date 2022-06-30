
import { PrismaClient } from '@prisma/client';
import { config } from '$lib/config';

import crypto from 'crypto';


// =============================================================================


/* When we persist token information into the database, we first encrypt it to
 * ensure that casual inspection doesn't leak anything important. This sets the
 * algorithm that is used for the encryption. */
const algorithm = 'aes-256-ctr';

/* The secret to use when performing encryption and decryption; if this changes
 * after data has been encrypted into the database, that data will be rendered
 * unreadable. */
const cryptSecret = config.get('db.cryptKey');


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
