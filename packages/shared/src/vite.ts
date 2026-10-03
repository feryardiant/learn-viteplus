import { resolve } from 'node:path'

import { type TestUserConfig, type UserConfig } from 'vite-plus'

export function sharedViteConfig(root: string): UserConfig {
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (process.env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    root,
    resolve: {
      alias: {
        '@': resolve(root, 'src'),
      },
    },
    test: {
      root,
      include: ['tests/**/*.spec.ts'],
      reporters,
      coverage: {
        enabled: 'GITHUB_ACTIONS' in process.env,
        provider: 'istanbul',
        exclude: ['tests/**'],
        reportsDirectory: 'tests/reports/coverage',
      },
    },
  }
}
