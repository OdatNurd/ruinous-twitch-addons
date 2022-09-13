import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import postcss from 'rollup-plugin-postcss';
import copyStatic from '@axel669/rollup-copy-static';
import html from '@axel669/rollup-html-input';
import $path from "@axel669/rollup-dollar-path";

import { readdirSync } from 'fs';

const output = process.env.NODE_ENV === "production" ? "www_root" : "www_root_dev";

function getOverlays() {
  return readdirSync('src/overlays/')
    .filter(name => name.endsWith('.html'))
    .map(file => {
       const base = file.split('.')[0];

        return {
          input: `src/overlays/${base}.html`,
          output: {
            file: `${output}/overlay/${base}.js`,
            format: "iife",
          },
          plugins: [
            html (),
            resolve(),
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
      resolve({ browser: true }),
      postcss(),
      copyStatic("static")
    ],
  },
  ...getOverlays()
]