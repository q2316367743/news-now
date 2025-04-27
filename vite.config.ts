// vite.config.js
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import {defineConfig} from "vite";
import path from "path";
import UnoCSS from 'unocss/vite';
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite';
import {ArcoResolver, TDesignResolver} from 'unplugin-vue-components/resolvers';

function _resolve(dir: string) {
  return path.resolve(__dirname, dir);
}

export default defineConfig({
  resolve: {
    alias: {
      "@": _resolve("src")
    },
  },
  plugins: [
    vue(), vueJsx(), UnoCSS(),
    AutoImport({
      resolvers: [ArcoResolver(), TDesignResolver({
        library: 'vue-next'
      })],
      imports: ['vue', '@vueuse/core', 'vue-router'],
    }),
    Components({
      resolvers: [
        ArcoResolver({
          sideEffect: true
        }),
        TDesignResolver({
          library: 'vue-next'
        })
      ]
    })
  ],
  base: "./",
  build: {
    outDir: "src-utools/dist"
  },

});
