import { resolve } from 'node:path'

import { type UserConfig } from 'vite-plus'

export function sharedVitestWorkerConfig(appDir: string, pkgName: string): UserConfig {
  return {
    resolve: {
      alias: {
        '@': resolve(appDir, 'src'),
        '~': resolve(appDir, 'worker'),
      },
    },
    test: {
      root: appDir,
      name: `${pkgName}:worker`,
      include: ['tests/worker/**/*.spec.ts'],
      setupFiles: ['tests/worker/setup.ts'],
    },
  }
}
