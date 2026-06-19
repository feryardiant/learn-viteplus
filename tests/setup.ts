import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

import { chromium, type Browser, type Page } from 'playwright'

const ROOT = resolve(import.meta.dirname, '../..')

let server: ReturnType<typeof spawn> | null = null
let browser: Browser | null = null
let devUrl = 'http://localhost:5173'

export async function startServer(): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    let settled = false

    const proc = spawn('vp', ['run', '@feryardiant/lvp-web#dev'], {
      cwd: ROOT,
      stdio: 'pipe',
      env: { ...process.env, NODE_ENV: 'development' },
    })
    server = proc

    const timeout = setTimeout(() => {
      if (settled) return
      settled = true
      reject(new Error('Dev server did not start within 30s'))
    }, 30000)

    const onData = (data: Buffer) => {
      if (settled) return
      const text = data.toString()

      const match = text.match(/Local:\s+http:\/\/localhost:(\d+)/)
      if (match) {
        devUrl = `http://localhost:${match[1]}`
      }

      if (text.includes('localhost:') || text.includes('Ready') || text.includes('press')) {
        settled = true
        clearTimeout(timeout)
        setTimeout(resolvePromise, 1000)
      }
    }

    proc.stdout?.on('data', onData)
    proc.stderr?.on('data', onData)

    proc.on('error', (err) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(err)
    })

    proc.on('exit', (code, signal) => {
      if (settled) return
      settled = true
      clearTimeout(timeout)
      reject(new Error(`Dev server exited before readiness (code=${code}, signal=${signal})`))
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
    browser = await chromium.launch({})
  }
  return await browser.newPage()
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export function getDevUrl(path: string = ''): string {
  return `${devUrl}${path}`
}
