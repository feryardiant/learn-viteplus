import { defineConfig, loadEnv, type TestUserConfig, type UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    pack: {
      entry: ['src/*.ts'],
      dts: { tsgo: true },
      exports: {
        customExports(exports) {
          exports['.'] = { types: './src/index.ts', import: exports['.'] }
          exports['./vite'] = { types: './src/vite.ts', import: exports['./vite'] }
          exports['./vitest-app'] = { types: './src/vitest-app.ts', import: exports['./vitest-app'] }
          exports['./vitest-worker'] = { types: './src/vitest-worker.ts', import: exports['./vitest-worker'] }
          exports['./tsconfig.json'] = './tsconfig.json'

          return exports
        },
      },
      deps: {
        neverBundle: [
          'vite-plus',
          'vite',
          '@cloudflare/vite-plugin',
          '@cloudflare/vitest-pool-workers',
          '@tailwindcss/vite',
          '@vitejs/plugin-vue',
          'vite-plugin-vue-devtools',
          '@vitest/coverage-istanbul',
          'vue',
          'tailwindcss',
        ],
      },
    },
  }
})
