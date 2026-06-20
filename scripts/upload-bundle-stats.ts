import { Console } from 'node:console'
import { createWriteStream, existsSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'

import { createAndUploadReport } from '@codecov/bundle-analyzer'
import { glob } from 'tinyglobby'

import repo from '../package.json' with { type: 'json' }

const pkgs = await glob(repo.workspaces, {
  absolute: true,
  onlyDirectories: true,
})

interface UploadConfig {
  buildPaths: string[]
  ignorePatterns: string[]
}

const uploadConfig: Record<string, UploadConfig> = {
  website: {
    buildPaths: ['./dist/client', './dist/ssr'],
    ignorePatterns: ['*.ico', '*.map', '.assetsignore', 'wrangler.json'],
  },
}

const skipped = []

for (const pkgPath of pkgs) {
  const pkg = basename(pkgPath)
  const { buildPaths, ignorePatterns } = uploadConfig[pkg] || { buildPaths: ['./dist'], ignorePatterns: ['*.map'] }

  const buildPathsAbs = buildPaths.map((path) => resolve(pkgPath, path))

  if (buildPathsAbs.filter((path) => !existsSync(path)).length) {
    console.log(`Skipping '${pkg}' bundle stats upload (no build output found)`)

    skipped.push(pkg)
    continue
  }

  const pkgJson = await readFile(resolve(pkgPath, 'package.json'), 'utf8').then((content) => JSON.parse(content))

  console.log(`::group::Uploading '${pkgJson.name}' bundle stats...`)

  // Upload bundle
  await createAndUploadReport(
    buildPathsAbs,
    {
      bundleName: pkgJson.name,
      uploadToken: process.env.CODECOV_TOKEN,
      enableBundleAnalysis: !!process.env.CODECOV_TOKEN,
      uploadOverrides: { sha: process.env.COMMIT_SHA },
      dryRun: !process.env.GITHUB_ACTIONS,
      debug: 'RUNNER_DEBUG' in process.env,
    },
    {
      ignorePatterns,
      normalizeAssetsPattern: '[name]-[hash].[ext]',
    },
  )

  console.log(`::endgroup::`)
}

if (skipped.length < pkgs.length) {
  console.log(`${skipped.length}/${pkgs.length} bundles uploaded successfully`)
}

// All bundle skipped.
if (skipped.length === pkgs.length || skipped.includes('website') || !process.env.GITHUB_OUTPUT) process.exit(0)

const logger = new Console(createWriteStream(process.env.GITHUB_OUTPUT))

logger.log('should-deploy=%d', 1)
