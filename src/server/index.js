import { config } from './config.js';

import { PrismaClient } from '@prisma/client';
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import { db } from './lib/db.js';
import { coreAPIRoutes } from './routes/index.js';
import { setupTwitchIntegrations } from './twitch.js';

import eiows from "eiows";
import express from 'express';
import http from 'http';

import { redirectToHTTPS } from 'express-http-to-https';


// =============================================================================


/* Set up all of our back end websocket connectivity. */
function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('=> Incoming websocket connection');

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);

      // This will emit the event to every currently connected socket. We almost
      // certainly don't want this in the final code we're ultimately working
      // towards.
      io.emit('chat message', 'this is a message from the server');
    });

    // Set up to listen to when this user disconnects
    socket.on('disconnect', () => {
      console.log('=> client socket disconnected');
    });
  });
}


// =============================================================================


/* Send the static file given in response to the request; this is used solely
 * for client side routing reasons; it's needed for when the user hard reloads
 * a route on the client end, since from our perspective the whole site is a
 * single page. */
function fullfillSPARequest(req, res) {
  console.log(`performing a client side SPA reload for URL: ${req.url}`);

  const options = {
    root: config.get('webRoot'),
    dotfiles: 'deny',
    headers: {
      'x-timestamp': Date.now(),
      'x-sent': true,
      'x-item-filename': "index.html"
    }
  };

  // TODO: This should fail if the file doesn't exist; does that happen?
  res.sendFile("index.html", options, err => {
    if (err) {
      console.error(`Error: ${err}`);
      res.status(404).send('Error sending file');
    }
  });
}


// =============================================================================


/* Try to load an existing token from the database, and if we find one, use it
 * to set up the database. */
async function launch() {
  // console.log(config.toString());

  // The express application that houses the routes that we use to carry out
  // authentication with Twitch as well as serve user requests.
  const app = express();
  app.use(express.json());

  // Redirect all insecure requests to a secure version of the URL, but not when
  // the host is localhost.
  app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 302));

  // Set up some middleware that will serve static files out of the static
  // folder so that we don't have to inline the pages in code.
  app.use(express.static(config.get('webRoot')));

  // Create a server to serve our content
  const server = http.createServer(app);

  // Create a socket-io server using the eiows server as the back end, wrapped
  // inside of our main server.
  const io = new Server(server, {
    wsEngine: eiows.Server
  });

  // Set up all of the API endpoints and other core routes.
  app.use(coreAPIRoutes());

  // Wildcard all unknown routes to the index page to support client side routing;
  // this could maybe only cover routes we know exist? Or we need to know how to
  // get the client side router to display something for routes that don't exist.
  //
  // This has to happen last or we'll end up capturing other routes (I think).
  app.get("/*", (req, res) => fullfillSPARequest(req, res,));

  // Set up our websocket handling.
  setupSockets(io);

  // Initialize Twitch
  setupTwitchIntegrations();

  // Get the server to listen for incoming requests.
  const webPort = config.get('port');
  server.listen(webPort, () => {
    console.log(`Listening for web requests on http://localhost:${webPort}`);
  });
}


// =============================================================================

launch();