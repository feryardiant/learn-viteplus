import { defineConfig, loadEnv, TestUserConfig, UserConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    staged: {
      '*': 'vp check --fix',
    },
    test: {
      projects: [
        'apps/website/vitest.*.config.ts',
        'packages/*',
        {
          test: {
            name: pkg.name,
            globalSetup: ['tests/setup-server.ts'],
            include: ['tests/e2e/*.spec.ts'],
            testTimeout: 60000,
            hookTimeout: 40000,
          },
        },
      ],
      coverage: {
        provider: 'istanbul',
        reportsDirectory: 'tests/reports/coverage',
      },
      reporters,
    },
    fmt: {
      printWidth: 120,
      singleQuote: true,
      semi: false,
      sortImports: true,
    },
    lint: {
      jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
      rules: {
        'vite-plus/prefer-vite-plus-imports': 'error',
        'no-console': ['error', { allow: ['warn', 'error'] }],
        'unicorn/filename-case': ['error', { case: 'kebabCase' }],
      },
      options: { typeAware: true, typeCheck: true },
      overrides: [
        {
          files: ['**/tests/**/*.ts', '**/scripts/**/*.{js,mjs,ts}', '**/*.config.ts'],
          rules: {
            'no-console': ['off'],
          },
        },
        {
          files: ['**/*.test.ts', '**/*.spec.ts'],
          plugins: ['typescript', 'vitest'],
          rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            'vitest/no-disabled-tests': 'error',
          },
        },
      ],
    },
    run: {
      cache: true,
    },
  }
})
