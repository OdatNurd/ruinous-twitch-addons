import 'dotenv/config';

import { generateTestCookie, initializeDatabase } from '#test/utils';


// =============================================================================


/* When we generate a JWT, this is the user that the token is for. */
const TEST_USER_INFO = {
  userId : "752216359",
  username : "obottest",
  displayName : "OBotTest",
  profilePic : "https://static-cdn.jtvnw.net/jtv_user_pictures/d4489cf0-20c2-4e59-b3fb-7014bff4279a-profile_image-300x300.png"
}


// =============================================================================

/* Executed before all tests begin; this is given an object that is shared
 * between all test runs; it's also sent to the teardown hook when testing is
 * completed. */
export async function setup(context) {
  // Store the test user and the generated cookie into the context for use in
  // tests.
  context.userInfo = TEST_USER_INFO;
  context.brokenUser = { ...TEST_USER_INFO, username: "whodatnurd"};
  context.authToken = generateTestCookie(TEST_USER_INFO);
  context.brokenToken = context.authToken.replace("=ey", "=eyBork");

  // Related to addons for a particular user, these are the fields that control
  // what addons commands are working with. The first is the id of the addon
  // that we are going to use in our overlay tests, and the second is the one
  // used in our addon tests.
  context.overlayAddonId = '2BNIa2BOEP7kF10eeOdObXjNsQk';
  context.addonId = '2C0usq54Rpo4TZtuQa7mDADAhjV';

  // Ensure that the database is clean before we proceed; our tests may leave
  // some records behind.
  await initializeDatabase(context);
}

/* These events fire before and after a file's tests have been executed. */
export function beforeFile (filename) {}
export function afterFile (filename) {}

/* This is executed after all tests have completed, but before the results are
 * reported. This should clean up any shared resources that were created in
 * the setup, if needed. */
export function teardown (context) {}