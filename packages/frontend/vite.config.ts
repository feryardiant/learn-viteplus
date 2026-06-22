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
            types: './src/index.ts',
            import: exports['.'],
          }

          exports['./components'] = { types: './src/components.ts', import: exports['./components'] }
          exports['./assets/*'] = './assets/*'
          exports['./tsconfig.json'] = './tsconfig.json'

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
