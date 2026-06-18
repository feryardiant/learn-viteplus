import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv, UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      include: ['tests/units/*.spec.ts', 'tests/integrations/*.spec.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      reporters: ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]],
      coverage: {
        provider: 'istanbul',
        include: ['src/**', 'worker/**'],
        reportsDirectory: 'tests/reports/coverage',
      },
    },
    plugins: [
      env.VITEST
        ? cloudflareTest({ wrangler: { configPath: './wrangler.jsonc' } })
        : cloudflare({ viteEnvironment: { name: 'ssr' } }),
      vue(),
      tailwindcss(),
      vueDevTools(),
    ].filter(Boolean),
  }
})
