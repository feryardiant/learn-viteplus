import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv, type TestUserConfig, type UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')
  const root = fileURLToPath(new URL('./', import.meta.url))
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    resolve: {
      alias: {
        '@': path.join(root, 'src'),
      },
    },
    test: {
      projects: ['vitest.*.config.ts'],
      reporters,
      coverage: {
        enabled: 'GITHUB_ACTIONS' in env,
        provider: 'istanbul',
        include: ['src/**', 'worker/**'],
        reportsDirectory: 'tests/reports/coverage',
      },
    },
    plugins: [
      env.VITEST
        ? undefined
        : cloudflare({
            viteEnvironment: { name: 'ssr' },
            config(config) {
              config.d1_databases[0].database_id = env.DATABASE_ID
            },
          }),
      vue(),
      tailwindcss(),
      vueDevTools(),
    ].filter(Boolean),
  }
})
