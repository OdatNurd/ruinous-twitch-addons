import express from 'express';

import { db, dbErrResponse } from '../lib/db.js';
import { NotFound } from '../lib/exceptions.js';

import { getAddonList, getAddonById } from './api/addons.js';
import { getOverlayInfo } from './api/overlays.js';
import { getUserAddons, installUserAddon, uninstallUserAddon } from './api/users.js';
import { doTwitchLogin } from './login.js';
import { doTwitchLogout } from './logout.js';
import { redirectToStaticOverlay } from './overlay.js';


// ============================================================================


/* Create and return back an express router that contains all of the routes
 * that we need in order to serve the API and the static content for addons
 * that the back end portion is responsible for. */
export function coreAPIRoutes() {
  const router = express.Router();

  router.get('/login', (req, res) => doTwitchLogin(db, req, res));
  router.get('/logout', (req, res) => doTwitchLogout(db, req, res));
  router.get('/overlay/:overlayId', (req, res) => redirectToStaticOverlay(db, req, res));

  router.get('/api/v1/addons', (req, res) => getAddonList(db, req, res));
  router.get('/api/v1/addons/:key', (req, res) => getAddonById(db, req, res));

  router.get('/api/v1/overlay/:overlayId', (req, res) => getOverlayInfo(db, req, res));

  router.get('/api/v1/user/addons', (req, res) => getUserAddons(db, req, res));
  router.post('/api/v1/user/addons/:addonId', (req, res) => installUserAddon(db, req, res));
  router.delete('/api/v1/user/addons/:addonId', (req, res) => uninstallUserAddon(db, req, res));

  // As a catch-all, catch any other API requests and flag them as invalid.
  router.all('/api/*', (req, res) => dbErrResponse(new NotFound(`no such API endpoint: ${req.path}`), res));

  return router;
}


// =============================================================================
