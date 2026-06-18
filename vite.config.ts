import { defineConfig, loadEnv, TestUserConfig, UserConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    staged: {
      '*': 'vp check --fix',
    },
    test: {
      projects: [
        'apps/*',
        'packages/*',
        'apps/website/vitest.app.config.ts',
        {
          test: {
            name: pkg.name,
            include: ['tests/e2e/*.spec.ts'],
            testTimeout: 60000,
            hookTimeout: 40000,
          },
        },
      ],
      coverage: {
        provider: 'istanbul',
        include: ['src/**', 'worker/**'],
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
      },
      options: { typeAware: true, typeCheck: true },
      overrides: [
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
