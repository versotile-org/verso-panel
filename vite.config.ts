import { defineConfig } from 'vite';
import { svelte } from '@sveltejs/vite-plugin-svelte';
import { viteSingleFile } from 'vite-plugin-singlefile';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
      sass: {
        api: 'modern-compiler',
      },
    },
  },
  plugins: [
    svelte({
      onwarn(warning, defaultHandler) {
        // don't warn on <marquee> elements, cos they're cool
        if (warning.code === 'a11y-no-static-element-interactions') return;

        // handle all other warnings normally
        if (defaultHandler !== void 0) {
          defaultHandler(warning);
        }
      },
    }),
    viteSingleFile(),
  ],
  resolve: {
    alias: [
      {
        find: '@images',
        replacement: path.resolve(__dirname, './src/assets/images'),
      },
    ],
  },
});
