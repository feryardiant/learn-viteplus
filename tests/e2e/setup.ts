import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

import { chromium, type Browser, type Page } from 'playwright'

const ROOT = resolve(import.meta.dirname, '../..')
const DEV_URL = 'http://localhost:5173'

let server: ReturnType<typeof spawn> | null = null
let browser: Browser | null = null

export async function startServer(): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    const proc = spawn('bunx', ['vp', 'dev'], {
      cwd: ROOT,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'development' },
    })
    server = proc

    const timeout = setTimeout(() => {
      reject(new Error('Dev server did not start within 30s'))
    }, 30000)

    const onData = (data: Buffer) => {
      const text = data.toString()
      if (text.includes('localhost:') || text.includes('Ready') || text.includes('press')) {
        clearTimeout(timeout)
        setTimeout(resolvePromise, 1000)
      }
    }

    proc.stdout?.on('data', onData)
    proc.stderr?.on('data', onData)

    proc.on('error', (err) => {
      clearTimeout(timeout)
      reject(err)
    })
  })
}

export function stopServer(): void {
  if (server) {
    server.kill('SIGTERM')
    server = null
  }
}

export async function createPage(): Promise<Page> {
  if (!browser) {
    browser = await chromium.launch({ headless: true })
  }
  return await browser.newPage()
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export { DEV_URL }
