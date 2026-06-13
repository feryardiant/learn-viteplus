import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig } from 'vite-plus'

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    environment: 'jsdom',
    root: fileURLToPath(new URL('./', import.meta.url)),
  },
  plugins: [process.env.VITEST ? undefined : cloudflare(), vue(), vueDevTools()].filter(Boolean),
})
