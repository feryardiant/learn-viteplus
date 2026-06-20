import path from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import tailwindcss from '@tailwindcss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig(() => {
  const root = fileURLToPath(new URL('./', import.meta.url))

  return {
    resolve: {
      alias: {
        '@': path.join(root, 'src'),
      },
    },
    test: {
      root,
      name: `${pkg.name}:app`,
      include: ['tests/app/*.spec.ts'],
      environment: 'jsdom',
    },
    plugins: [vue(), tailwindcss()],
  }
})
