import { defineConfig, loadEnv, type TestUserConfig, type UserConfig } from 'vite-plus'

export default defineConfig(({ mode }): UserConfig => {
  const env = loadEnv(mode, '.', '')
  const reporters: TestUserConfig['reporters'] = ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]]

  if (env.GITHUB_ACTIONS === 'true') {
    reporters.push('github-actions')
  }

  return {
    pack: {
      deps: {
        // tsdown <0.23 compatibility: resolve external dependency subpaths.
        // Remove to preserve subpath imports as written (the new default).
        // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
        resolveDepSubpath: true,
      },
      dts: {
        generator: 'tsgo',
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
  }
})
