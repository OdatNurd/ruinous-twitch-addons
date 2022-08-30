import { db, dbErrResponse } from '../lib/db.js';
import { NotFound } from '../lib/exceptions.js';

import { getAddonList, getAddonById } from './api/addons.js';
import { getOverlayInfo } from './api/overlays.js';
import { getUserAddons, installUserAddon, uninstallUserAddon } from './api/users.js';


// =============================================================================


/* A helper function that can be assigned to a route in order to generate an
 * error that indicates that this API endpoint does not exist. */
function reportInvalidAPI(db, req, res) {
  try {
    throw new NotFound('invalid API endpoint');
  }
  catch (error) {
    dbErrResponse(error, res);
  }
}


// ============================================================================


/* Given an express app, add in all of the routes that specify operations that
 * can be taken as a part of the API. */
export function setupRouting(app) {
  app.get('/api/v1/addons', (req, res) => getAddonList(db, req, res));
  app.get('/api/v1/addons/:key', (req, res) => getAddonById(db, req, res));

  app.get('/api/v1/overlay/:overlayId', (req, res) => getOverlayInfo(db, req, res));

  app.get('/api/v1/user/addons', (req, res) => getUserAddons(db, req, res));
  app.post('/api/v1/user/addons/:addonId', (req, res) => installUserAddon(db, req, res));
  app.delete('/api/v1/user/addons/:addonId', (req, res) => uninstallUserAddon(db, req, res));

  // As a catch-all, catch any other API requests and flag them as invalid.
  app.all('/api/*', (req, res) => reportInvalidAPI(db, req, res));
}


// =============================================================================
