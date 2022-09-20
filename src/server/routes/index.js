import express from 'express';

import { db, dbErrResponse } from '#lib/db';
import { NotFound } from '#lib/exceptions';

import { getAddonList, getAddonById } from '#api/addons';
import { getOverlayInfo } from '#api/overlays';
import { getCurrentUser } from '#api/user';
import { getUserAddons, installUserAddon, uninstallUserAddon } from '#api/users';
import { doTwitchLogin } from '#routes/login';
import { doTwitchLogout } from '#routes/logout';
import { redirectToStaticOverlay } from '#routes/overlay';


// ============================================================================


/* Create and return back an express router that contains all of the routes
 * that we need in order to serve the API and the static content for addons
 * that the back end portion is responsible for. */
export function coreAPIRoutes() {
  const router = express.Router();

  // TODO: Is there a nicer way to get this sort of thing? We need both
  // variations as far as limited testing has shown, or without the extra path
  // we end up at a client side route.
  router.get('/login', (req, res) => doTwitchLogin(db, req, res));
  router.get('/login/*', (req, res) => doTwitchLogin(db, req, res));

  router.get('/logout', (req, res) => doTwitchLogout(db, req, res));
  router.get('/overlay/:overlayId', (req, res) => redirectToStaticOverlay(db, req, res));

  router.get('/api/v1/addons', (req, res) => getAddonList(db, req, res));
  router.get('/api/v1/addons/:key', (req, res) => getAddonById(db, req, res));

  router.get('/api/v1/overlay/:overlayId', (req, res) => getOverlayInfo(db, req, res));

  router.get('/api/v1/user', (req, res) => getCurrentUser(db, req, res));

  router.get('/api/v1/user/addons', (req, res) => getUserAddons(db, req, res));
  router.post('/api/v1/user/addons/:addonId', (req, res) => installUserAddon(db, req, res));
  router.delete('/api/v1/user/addons/:addonId', (req, res) => uninstallUserAddon(db, req, res));

  // As a catch-all, catch any other API requests and flag them as invalid.
  router.all('/api/*', (req, res) => dbErrResponse(new NotFound(`no such API endpoint: ${req.path}`), res));

  return router;
}


// =============================================================================
