import { cloudflare } from '@cloudflare/vite-plugin'
import { sharedViteConfig } from '@learn-viteplus/shared'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { defineConfig, loadEnv } from 'vite-plus'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, import.meta.dirname, '')
  const config = sharedViteConfig(import.meta.dirname)

  return {
    ...config,
    test: {
      ...config.test,
      projects: ['vitest.*.config.ts'],
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
