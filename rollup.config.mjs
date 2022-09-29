import 'dotenv/config';

import { addons } from '#seed/addons/index';

import svelte from 'rollup-plugin-svelte';
import overlay from './plugins/svelte-overlay.js';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import postcss from 'rollup-plugin-postcss';
import copyStatic from '@axel669/rollup-copy-static';
import $path from '@axel669/rollup-dollar-path';


const output = process.env.NODE_ENV === "production" ? "www_root" : "www_root_dev";


/* This wille examine the seed data to find all of the addons that have overlays
 * and run a build that will compile their Svelte files to JavaScript and
 * bundle them up into a single HTML and JS file.
 *
 * We use our own custom plugin here so that we can define the overlays just in
 * Svelte components and use boilerplate template files to actually drive the
 * setup process. */
function getOverlays() {
  return addons.filter(addon => addon.requiresOverlay)
    .map(addon => {
      // Determine what the name of the HTML file to use it, and use that to
      // infer what the source file should be named for the compiled code.
      const staticFile = addon.staticFile;
      const scriptFile = staticFile.replace('.html', '.js');

      return {
        input: 'src/overlays/template/overlay.js',
        output: {
          name: 'overlay',
          format: 'iife',
          file: `${output}/overlay/${scriptFile}`,
        },
        plugins: [
          overlay({
            // Compile the input overlay template after injecting the required
            // Svelte component in, and then copy the template HTML file while
            // renaming it to the appropriate name and modifying it to import
            // the generated javascript file.
            output: 'src/overlays/template/overlay.html',
            staticFile,
            replace: {
              '%%ADDON_NAME%%': `${addon.name}`,
              '%%SVELTE_SRC_FILE%%': `${addon.overlayFile}`,
              '%%OVERLAY_SRC_FILE%%': scriptFile,
              '%%ADDON_ID%%': addon.addonId,
            }
          }),
          svelte({}),
          $path({
            root: ".",
            paths: {
              $seed: "prisma/data",
            }
          }),
          commonjs(),
          resolve({ browser: true }),
          postcss(),
        ]
      }
    });
}

export default [
  {
    input: 'src/client/app.js',
    output: {
      file: `${output}/app.js`,
      format: 'iife',
      name: 'app',
    },
    plugins: [
      svelte({}),
      $path({
          root: ".",
          paths: {
            $components: "src/client/components/index.js",
            $stores: "src/client/stores/index.js",
            $lib: "src/client/lib",
          },
          extensions: [".js", ".mjs", ".svelte", ".jsx"]
      }),
      replace(
      {
        'preventAssignment': true,
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
      }),
      commonjs(),
      resolve({ browser: true }),
      postcss(),
      copyStatic("static")
    ],
  },
  ...getOverlays()
]
