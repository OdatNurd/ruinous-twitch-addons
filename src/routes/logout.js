import { config} from '$lib/config';

import cookie from 'cookie';

export async function get({url}) {
  // To log out, we just erase the cookie; this could be more intelligent and
  // check to see if there is one or whatever, but meh.
  return {
    status: 302,
    headers: {
      location: '/',
      "Set-Cookie": cookie.serialize('authToken', '', {
        httpOnly: true,
        expires: new Date(1970,1,1),
        secure: config.get('env') === 'production',
        sameSite: config.get('env') === 'production' ? 'strict' : undefined
      })
    }
  }
}