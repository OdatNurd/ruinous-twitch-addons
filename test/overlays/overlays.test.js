import { endpointMatch, request } from '#test/utils';
import { validOverlay } from '#test/validators';


// =============================================================================

/* Test:
 *    /api/v1/overlay
 *    /overlay
 *
 * These endpoints are for gathering information about an overlay that is part
 * of an installed Addon for a user, and for redirecting the user to a specific
 * page that represents that addon's overlay based on the ID of the overlay. */
export async function test({Assert, Section}, context) {
  // Attempt to fetch information for a nonexistant overlay should fail
  Section `Overlays: Fetch invalid overlay info`;
  const [ res1, invalid ] = await request(`/api/v1/overlay/${context.overlayId}-invalid`);

  Assert(res1) `status`.eq(404);
  Assert(invalid) `success`.eq(false);

  // ---------------------------------

  // We should be able to request information for a valid overlay.
  Section `Overlays: Fetch valid overlay info`;
  const [ res2, overlay ] = await request(`/api/v1/overlay/${context.overlayId}`);

  Assert(res2) `status`.eq(200);
  Assert(overlay)
    `userId`.eq(context.userInfo.userId)
    `addonId`.eq(context.overlayAddonId)
    `overlayId`.eq(context.overlayId)

  // ---------------------------------

  Section `Overlays: Schema validation for overlay record`;
  Assert(overlay)
    (validOverlay).eq(true);

  // ---------------------------------

  Section `Overlays: Redirect for invalid overlay ID`;
  const [ res3 ] = await request(`/overlay/${context.overlayId}-invalid`, {}, false);

  // All overlay requests should redirect, but a request for an invalid overlay
  // should redirect to a known error page.
  Assert(res3)
    `status`.eq(200)
    `url`
      (url => endpointMatch(url, '/overlay/no_such_overlay.html')).eq(true);

  // ---------------------------------


  Section `Overlays: Redirect for valid overlay ID`;
  const [ res4 ] = await request(`/overlay/${context.overlayId}`, {}, false);

  // The valid overlay should not send us to the invalid overlay page, and the
  // page should have a hash on it that includes the overlayId, since that is
  // how the overlay knows what it represents when it loads.
  Assert(res4)
    `status`.eq(200)
    `url`
      (url => endpointMatch(url, '/overlay/no_such_overlay.html')).eq(false)
    `url`
      (url => url.endsWith(`#${context.overlayId}`));
}


// =============================================================================
