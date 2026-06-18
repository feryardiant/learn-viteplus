import { fileURLToPath, URL } from 'node:url'

import { cloudflare } from '@cloudflare/vite-plugin'
import { cloudflareTest } from '@cloudflare/vitest-pool-workers'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv, TestProjectConfiguration, UserConfig } from 'vite-plus'

const projects: TestProjectConfiguration[] = [
  {
    test: {
      name: 'unit',
      include: ['tests/units/*.spec.ts'],
      environment: 'jsdom',
    },
  },
]

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')

  return {
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    test: {
      // environment: 'jsdom',
      include: ['tests/units/*.spec.ts'],
      root: fileURLToPath(new URL('./', import.meta.url)),
      // projects,
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
