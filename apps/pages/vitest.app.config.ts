import { sharedVitestAppConfig } from '@learn-viteplus/shared'
import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig(() => {
  return {
    ...sharedVitestAppConfig(import.meta.dirname, pkg.name),
    plugins: [vue(), tailwindcss()],
  }
})
