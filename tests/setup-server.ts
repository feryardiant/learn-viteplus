import { spawn } from 'node:child_process'
import { resolve } from 'node:path'

import type { TestProject } from 'vite-plus/test/node'

const ROOT = resolve(import.meta.dirname, '..')

let server: ReturnType<typeof spawn> | null = null
let devUrl = 'http://localhost:5173'

async function startServer(): Promise<void> {
  return new Promise((resolvePromise, reject) => {
    let settled = false
    let errorMessage = ''

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
        settled = true

        clearTimeout(timeout)
        setTimeout(resolvePromise, 1000)
        return
      }

      if (text.toLowerCase().startsWith('error:')) {
        errorMessage = text.replace(/^error: /, '')
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

    proc.on('exit', (code) => {
      if (settled) return
      settled = true

      if (errorMessage === '') {
        errorMessage = 'Dev server exited before readiness'
      }

      clearTimeout(timeout)
      reject(new Error(`${errorMessage} (code=${code})`))
    })
  })
}

function stopServer(): void {
  if (server) {
    server.kill('SIGTERM')
    server = null
  }
}

export async function setup(project: TestProject) {
  await startServer()

  project.provide('devUrl', devUrl)
}

export async function teardown() {
  stopServer()
}
