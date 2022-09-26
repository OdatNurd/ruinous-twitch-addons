import 'dotenv/config';

import svelte from 'rollup-plugin-svelte';
import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
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
            $path({
              root: ".",
              paths: {
                $seed: "prisma/data",
              }
            }),
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