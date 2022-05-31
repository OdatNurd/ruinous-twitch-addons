import express from 'express';
import forceSecure from 'force-secure-express';
import path from 'path';

import { fileURLToPath } from 'url';


// =============================================================================


/* The port that our application listens on; this will be provided by the
 * environment, but if that variable is not present, use a default instead. */
const PORT = process.env.PORT || 5000

/* We want to grab the directory name of the current file to ensure that we can
 * properly serve files from the appropriate place. Since __dirname is not valid
 * in ECMAScript modules, so we need to fake it up. */
const __dirname = path.dirname(fileURLToPath(import.meta.url));


// =============================================================================


/* As a simple test, serve static files out of the public directory and listen
 * on the configured port. */
express()
  .use(forceSecure(["twitch.ruinouspileofcrap.com"]))
  .use(express.static(path.join(__dirname, '../public')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`))
