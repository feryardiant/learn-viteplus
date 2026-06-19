import { fileURLToPath, URL } from 'node:url'

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  test: {
    name: `${pkg.name}:app`,
    root: fileURLToPath(new URL('.', import.meta.url)),
    include: ['tests/app/*.spec.ts'],
    environment: 'jsdom',
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  plugins: [vue()],
})
