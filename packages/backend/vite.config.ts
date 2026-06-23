import { sharedViteConfig } from '@learn-viteplus/shared'
import { defineConfig } from 'vite-plus'

export default defineConfig(() => {
  const base = sharedViteConfig(import.meta.dirname)

  return {
    ...base,
    pack: {
      entry: ['src/index.ts', 'src/vite.ts'],
      dts: { tsgo: true },
      deps: {
        neverBundle: ['cloudflare:workers', 'h3'],
      },
      exports: {
        devExports: true,
        customExports(exports) {
          exports['./tsconfig.json'] = './tsconfig.json'

          return exports
        },
      },
    },
  } as ReturnType<typeof sharedViteConfig>
})
