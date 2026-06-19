import { codecovVitePlugin } from '@codecov/vite-plugin'
import { defineConfig, loadEnv, type TestUserConfig, type UserConfig } from 'vite-plus'

import pkg from './package.json' with { type: 'json' }

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    pack: {
      dts: {
        tsgo: true,
      },
      exports: true,
    },
    test: {
      include: ['tests/units/*.spec.ts', 'tests/integrations/*.spec.ts'],
      reporters,
      coverage: {
        enabled: 'GITHUB_ACTIONS' in env,
        provider: 'istanbul',
        include: ['src/**'],
        reportsDirectory: 'tests/reports/coverage',
      },
    },
    plugins: [
      codecovVitePlugin({
        enableBundleAnalysis: 'CODECOV_TOKEN' in env && env.CODECOV_TOKEN !== '',
        bundleName: pkg.name,
        uploadToken: env.CODECOV_TOKEN,
      }),
    ],
  }
})
