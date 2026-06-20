import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { cloudflareTest, readD1Migrations } from '@cloudflare/vitest-pool-workers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig(async () => {
  const root = fileURLToPath(new URL('./', import.meta.url))
  const migrations = await readD1Migrations(path.join(root, 'migrations'))

  return {
    resolve: {
      alias: {
        '@': path.join(root, 'src'),
      },
    },
    test: {
      root,
      name: `${pkg.name}:worker`,
      include: ['tests/worker/*.spec.ts'],
      setupFiles: ['tests/worker/setup.ts'],
    },
    plugins: [
      cloudflareTest({
        wrangler: { configPath: './wrangler.jsonc' },
        miniflare: {
          bindings: { TEST_MIGRATIONS: migrations },
        },
      }),
      vue(),
      tailwindcss(),
    ],
  }
})
