import { readdirSync, readFileSync } from 'node:fs'
import { basename, resolve } from 'node:path'

import { createAndUploadReport } from '@codecov/bundle-analyzer'
import mm from 'micromatch'

import repo from '../package.json' with { type: 'json' }

const pkgs = repo.workspaces.reduce((pkgs, pattern) => {
  const state = mm.scan(pattern, {})
  const wsPath = resolve(process.cwd(), state.base)

  try {
    const wsPkgs = readdirSync(wsPath)
      .filter((pkg) => !pkg.startsWith('.'))
      .map((pkg) => resolve(wsPath, pkg))

    pkgs.push(...wsPkgs)

    return pkgs
  } catch {
    return pkgs
  }
}, [])

const uploadConfig = {
  website: {
    buildPaths: ['./dist/client', './dist/ssr'],
    ignorePatterns: ['*.ico', '*.map', '.assetsignore', 'wrangler.json'],
  },
}

for (const pkgPath of pkgs) {
  const pkg = basename(pkgPath)
  const { buildPaths, ignorePatterns } = uploadConfig[pkg] || {
    buildPaths: ['./dist'],
    ignorePatterns: ['*.map'],
  }

  const pkgJsonFile = readFileSync(resolve(pkgPath, 'package.json'), 'utf8')
  const pkgJson = JSON.parse(pkgJsonFile)

  // Upload bundle
  await createAndUploadReport(
    buildPaths.map((path) => resolve(pkgPath, path)),
    {
      bundleName: pkgJson.name,
      uploadToken: process.env.CODECOV_TOKEN,
      enableBundleAnalysis: !!process.env.CODECOV_TOKEN,
      uploadOverrides: {
        sha: process.env.COMMIT_SHA,
      },
      debug: true,
    },
    {
      ignorePatterns,
      normalizeAssetsPattern: '[name]-[hash].[ext]',
    },
  )
}

console.log('Bundle uploaded successfully')
