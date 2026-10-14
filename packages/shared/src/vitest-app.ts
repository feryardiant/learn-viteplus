import { resolve } from 'node:path'

import { type UserConfig } from 'vite-plus'

export function sharedVitestAppConfig(appDir: string, pkgName: string): UserConfig {
  return {
    resolve: {
      alias: {
        '@': resolve(appDir, 'src'),
      },
    },
    test: {
      root: appDir,
      name: `${pkgName}:app`,
      include: ['tests/app/**/*.spec.ts'],
      environment: 'jsdom',
    },
  }
}
