
// =============================================================================


/* Trim all extraneous whitespace out of a piece of text; this will remove all
 * runs of multiple whitespace characters with a single, and trim away any
 * leading and trailing whitespace.
 *
 * This will compact down a multi line string into something that renders nicer
 * when rendered as Markdown, where newlines and whitespace can be significant
 * to the output. */
export const trim = text => text.replace(/[ \t]+/g, ' ').trim();

/* This is a simple abstraction which, given the name of an icon, generates the
 * appropriate URL for it.
 *
 * This is a helper so that we can easily change the overall location of all
 * addon images in a single location. */
export const icon = text => `/icons/addons/${text}`

/* This is a simple abstraction which converts a schema object into the proper
 * format for storage into the database.
 *
 * Currently this is just a simple JSON conversion, but in the future more could
 * be done with this, such as validations etc. */
export const schema = obj => JSON.stringify(obj)


// =============================================================================
