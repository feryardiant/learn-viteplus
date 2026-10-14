import { sharedViteConfig } from '@learn-viteplus/shared'
import tailwindcss from '@tailwindcss/vite'
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
        devExports: true,
        customExports(exports) {
          exports['.'] = {
            style: './style.css',
            import: exports['.'],
          }

          exports['./assets/*'] = './assets/*'
          exports['./tsconfig.json'] = './tsconfig.json'

          return exports
        },
      },
      platform: 'neutral',
      plugins: [vuePack({})],
    },
    plugins: [vue(), tailwindcss()],
    test: {
      ...base.test,
      environment: 'jsdom',
    },
  } as ReturnType<typeof sharedViteConfig>
})
