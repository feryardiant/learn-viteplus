import { sharedViteConfig } from '@learn-viteplus/shared'
import vue from '@vitejs/plugin-vue'
import vuePack from 'unplugin-vue/rolldown'
import { defineConfig } from 'vite-plus'

export default defineConfig(() => {
  const base = sharedViteConfig(import.meta.dirname)

  return {
    ...base,
    pack: {
      dts: { vue: true },
      deps: {
        neverBundle: ['vue', 'pinia', 'tailwindcss'],
      },
      entry: ['./src/*.ts'],
      exports: {
        customExports(exports) {
          exports['.'] = {
            style: './style.css',
            import: exports['.'],
          }

          exports['./assets/*'] = './assets/*'

          return exports
        },
      },
      platform: 'neutral',
      plugins: [vuePack({})],
    },
    plugins: [vue()],
    test: {
      ...base.test,
      environment: 'jsdom',
    },
  } as ReturnType<typeof sharedViteConfig>
})
