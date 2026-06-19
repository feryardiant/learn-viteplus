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
      detached: true,
    })

    server = proc

    const timeout = setTimeout(() => {
      if (settled) return
      settled = true

      if (typeof proc.pid === 'number') {
        try {
          process.kill(-proc.pid, 'SIGTERM')
        } catch {}
      }

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

function stopServer(): Promise<void> {
  return new Promise((resolve) => {
    if (!server) {
      resolve()
      return
    }

    const proc = server
    server = null

    if (proc.pid == null) {
      resolve()
      return
    }

    const gid = -proc.pid

    const forceKill = () => {
      try {
        process.kill(gid, 'SIGKILL')
      } finally {
        resolve()
      }
    }

    const timeout = setTimeout(forceKill, 5000)

    proc.on('exit', () => {
      clearTimeout(timeout)
      resolve()
    })

    proc.on('error', () => {
      clearTimeout(timeout)
      resolve()
    })

    try {
      process.kill(gid, 'SIGTERM')
    } catch {
      clearTimeout(timeout)
      resolve()
    }
  })
}

export async function setup(project: TestProject) {
  await startServer()

  project.provide('devUrl', devUrl)
}

export async function teardown() {
  await stopServer()
}
