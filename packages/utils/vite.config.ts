import { defineConfig, loadEnv, type TestUserConfig, type UserConfig } from 'vite-plus'

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
        provider: 'istanbul',
        include: ['src/**'],
        reportsDirectory: 'tests/reports/coverage',
      },
    },
  }
})
