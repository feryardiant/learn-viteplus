import { sharedViteConfig } from '@learn-viteplus/shared'
import { defineConfig } from 'vite-plus'

export default defineConfig(() => {
  const base = sharedViteConfig(import.meta.dirname)

  return {
    ...base,
    pack: {
      dts: { tsgo: true },
      deps: {
        neverBundle: ['cloudflare:workers', 'h3'],
      },
      exports: {
        customExports(exports) {
          exports['.'] = { types: './src/index.ts', import: exports['.'] }
          exports['./tsconfig.json'] = './tsconfig.json'

          return exports
        },
      },
    },
  } as ReturnType<typeof sharedViteConfig>
})
