import { createAndUploadReport } from '@codecov/bundle-analyzer'

import pkg from '../package.json' with { type: 'json' }

// Upload bundle
await createAndUploadReport(
  ['./dist/client', './dist/ssr'],
  {
    bundleName: pkg.name,
    apiUrl: 'https://api.codecov.io',
    uploadToken: process.env.CODECOV_TOKEN,
    enableBundleAnalysis: !!process.env.CODECOV_TOKEN,
    debug: true,
  },
  {
    ignorePatterns: ['*.map'],
    normalizeAssetsPattern: '[name]-[hash].[ext]',
  },
)

console.log('Bundle uploaded successfully')
