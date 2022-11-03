import 'dotenv/config';

import { generateTestCookie } from '#test/utils';


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
export function setup(context) {
  // Store the test user and the generated cookie into the context for use in
  // tests.
  context.userInfo = TEST_USER_INFO;
  context.brokenUser = { ...TEST_USER_INFO, username: "whodatnurd"};
  context.authToken = generateTestCookie(TEST_USER_INFO);
  context.brokenToken = context.authToken.replace("=ey", "=eyBork");
}

/* These events fire before and after a file's tests have been executed. */
export function beforeFile (filename) {}
export function afterFile (filename) {}

/* This is executed after all tests have completed, but before the results are
 * reported. This should clean up any shared resources that were created in
 * the setup, if needed. */
export function teardown (context) {}