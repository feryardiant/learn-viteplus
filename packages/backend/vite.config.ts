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
      exports: true,
    },
  } as ReturnType<typeof sharedViteConfig>
})
