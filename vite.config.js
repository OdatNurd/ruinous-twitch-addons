import { resolve } from 'path';

const config = {
  build: {
    outDir: "static/",
    assetsDir: "overlay/assets",
    emptyOutDir: false,
    rollupOptions: {
      input: {
        addon_two: resolve('./overlay/addon_two.html'),
        addon_three: resolve('./overlay/addon_three.html')
      }
    },
  },
  server: {
    port: 4000,
  },
  resolve: {
    alias: {
      $css: resolve("./overlay/css"),
      $svg: resolve("./overlay/images/svg"),
      $js: resolve("./overlay/js"),
    }
  }
};

export default config;