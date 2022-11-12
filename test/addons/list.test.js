import { request, requestWithAuth } from '#test/utils';
import { validAddonList } from '#test/validators';


// =============================================================================


/* Test:
 *    /api/v1/addons
 *
 * This endpoint fetches information about addons; either the whole list of
 * addons, or information on a specific addon.
 *
 * When an addon is not provided, the whole list of addons is returned; when an
 * addon is specified, information on only that addon is returned.
 *
 * When there is an active user, the returned data may include extra fields,
 * such as the overlayId and URL.
 *
 * Regardless of there being an active user, there is always a field named
 * installed; it will always be false if there is no user.  */
 export async function test({Assert, Section}, context) {
  // With no user, the list of addons should contain all of the addons from the
  // seed data.
  Section `Addon List: Addon count with no current user`;
  const [ res1, emptyUser ] = await request('/api/v1/addons');

  Assert(res1) `status`.eq(200);
  Assert(emptyUser) `length`.eq(3);

  // ---------------------------------

  // When there is a user, the result count should be the same as when there is
  // a user.
  Section `Addon List: Addon count with current user`;
  const [ res2, withUser ] = await requestWithAuth('/api/v1/addons', context.authToken);

  Assert(res2) `status`.eq(200);
  Assert(withUser) `length`.eq(emptyUser.length);

  // ---------------------------------

  // In the no-user result set, the test addon should not be flagged as
  // installed.
  Section `Addon List: Test addon 1 not installed when no user`;

  // Should not be installed, which means no overlay info
  const userAddon1 = emptyUser.find(el => el.addonId === context.overlayAddonId)
  Assert(userAddon1)
    `installed`.eq(false)
    `overlayId`.eq('')
    `overlayUrl`.eq('');


  // ---------------------------------

  // In the user result set, the test addon should be flagged as installed.
  Section `Addon List: Test addon 1 installed with current user`;

  // SHould be installed, which means the overlayId matches and the URL looks
  // correct.
  const userAddon2 = withUser.find(el => el.addonId === context.overlayAddonId)
  Assert(userAddon2)
    `installed`.eq(true)
    `overlayId`.eq(context.overlayId)
    `overlayUrl`
      (url => url.endsWith(`/${context.overlayId}`)).eq(true)

  // ---------------------------------

  // In the no-user result set, the second test addon should not be flagged as
  // installed.
  Section `Addon List: Test addon 2 not installed when no user`;

  // Should not be installed, which means no overlay info
  const userAddon3 = emptyUser.find(el => el.addonId === context.addonId)
  Assert(userAddon3)
    `installed`.eq(false)
    `overlayId`.eq('')
    `overlayUrl`.eq('');

  // ---------------------------------

  // In the no-user result set, the second test addon should not be flagged as
  // installed.
  Section `Addon List: Test addon 2 not installed with current user`;

  // Should not be installed, which means no overlay info
  const userAddon4 = emptyUser.find(el => el.addonId === context.addonId)
  Assert(userAddon4)
    `installed`.eq(false)
    `overlayId`.eq('')
    `overlayUrl`.eq('');

  // ---------------------------------

  Section `Addon List: Schema validation for addon list (with user)`;
  Assert(withUser)
    (validAddonList).eq(true);

  // ---------------------------------

  Section `Addon List: Schema validation for addon list (no user)`;
  Assert(emptyUser)
    (validAddonList).eq(true);
}


// =============================================================================
