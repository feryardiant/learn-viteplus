import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    dts: {
      tsgo: true,
    },
    exports: true,
  },
  test: {
    include: ['tests/units/*.spec.ts', 'tests/integrations/*.spec.ts'],
    reporters: ['default', ['junit', { outputFile: 'tests/reports/junit.xml' }]],
    coverage: {
      provider: 'istanbul',
      include: ['src/**'],
      reportsDirectory: 'tests/reports/coverage',
    },
  },
})
