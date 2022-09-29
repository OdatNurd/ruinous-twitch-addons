import fs from 'fs-jetpack';


/* Given a configuration object that contains a set of replacement options,
 * return a modified version of the input string that has all of the matches
 * for each replacement replaced with the configured value. */
const doReplacements = (config, inputString) => inputString.replace(
  new RegExp(Object.keys(config.replace).join('|'), 'g'), match => config.replace[match]
)

/* A simple plugin for rollup that will generate our svelte overlays using
 * templated code.
 *
 * This will perform configured replacements in the boilerplate code to:
 *   - Allow the template overlay.js bootstrapper to import the right component
 *   - Pass the overlay.js bootstrapper the required addonId for it to function
 *   - Copy the template HTML file over, modifying the script tag on the way
 *
 * This allows us to have any number of Svelte based templates with a minimum of
 * boilerplate files. */
const overlay = (config) => {
  return {
    name: 'svelte-overlay',
    map: null,

    /* Transform incoming files; code is the full content of the file, and id
     * is the name of the file.
     *
     * Here we are only willing to transform files that are part of our
     * overlay templates. */
    transform(code, id) {
      // Only do replacements in template files; this will work over any file
      // that exists in that location, although probably it only needs to work
      // on source files.
      if (id.match(/overlays\/template\/.*$/)) {
        return doReplacements(config, code);
      }

      // Pass through
      return null;
    },

    /* Work to generate our bundle; here we need to ensure that we copy
     * through the template HTML file, performing any replacements needed in
     * order to have the template work as expected. */
    async generateBundle() {
      this.emitFile({
        type: "asset",
        fileName: config.staticFile,
        source: doReplacements(config, fs.read(config.output, 'utf8'))
      })
    }
  }
}

export default overlay;