/* In order to handle redirecting after a Twitch login attempt comes back to us
 * we need to handle a wildcard version.
 *
 * The main login handler does that, and this entry in the route table just
 * defers to it; it uses the URL to know what to do with the request. */
export { GET } from '../login.js';
