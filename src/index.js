import { config } from './config.js';

import { PrismaClient } from '@prisma/client';
import { Server } from "socket.io";
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

import { db } from './lib/db.js';
import { setupAPIEndpoints } from './api/index.js';
import { setupTwitchIntegrations } from './twitch.js';

import eiows from "eiows";
import express from 'express';
import http from 'http';


// =============================================================================


/* Set up all of our back end websocket connectivity. */
function setupSockets(io) {
  io.on('connection', (socket) => {
    console.log('a user connected');

    socket.on('chat message', (msg) => {
      console.log('message: ' + msg);

      // This will emit the event to every currently connected socket. We almost
      // certainly don't want this in the final code we're ultimately working
      // towards.
      io.emit('chat message', msg);

      // This is like io.emit, except that it goes to everyone but the socket
      // that is doing the broadcast; so the docs say, but it no worky
      // socket.broadcast.emit('chat message', msg);
    });

    // Set up to listen to when this user disconnects
    socket.on('disconnect', () => {
      console.log('user disconnected');
    });
  });
}


// =============================================================================


/* Try to load an existing token from the database, and if we find one, use it
 * to set up the database. */
async function launch() {
  console.log(config.toString());

  // The express application that houses the routes that we use to carry out
  // authentication with Twitch as well as serve user requests.
  const app = express();
  app.use(express.json());

  // Set up some middleware that will serve static files out of the static
  // folder so that we don't have to inline the pages in code.
  app.use(express.static('static'));

  // Create a server to serve our content
  const server = http.createServer(app);

  // Create a socket-io server using the eiows server as the back end, wrapped
  // inside of our main server.
  const io = new Server(server, {
    wsEngine: eiows.Server
  });

  // Set up all of the API endpoints
  setupAPIEndpoints(app);

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