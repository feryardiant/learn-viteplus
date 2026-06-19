import { fileURLToPath, URL } from 'node:url'

import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig({
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  test: {
    name: `${pkg.name}:worker`,
    root: fileURLToPath(new URL('./', import.meta.url)),
    include: ['tests/worker/*.spec.ts'],
  },
  plugins: [
    cloudflareTest({
      wrangler: { configPath: './wrangler.jsonc' },
    }),
    vue(),
    tailwindcss(),
  ],
})
