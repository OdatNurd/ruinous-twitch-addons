import { sveltekit } from '@sveltejs/kit/vite';
import path from "path";

const config = {
  plugins: [sveltekit()],
  server: {
    port: 3000,
  },
  resolve: {
    alias: {
      $components: path.resolve("./src/components"),
    }
  }
};

export default config;