import { spawn } from 'node:child_process'
import { dirname } from 'node:path'

import type { TestProject } from 'vite-plus/test/node'

let server: ReturnType<typeof spawn> | null = null

async function startServer(): Promise<string> {
  let devUrl = 'http://localhost:5173'

  return new Promise((resolve, reject) => {
    let settled = false
    let errorMessage = ''

    const proc = spawn('vp', ['run', '@feryardiant/lvp-web#dev'], {
      cwd: dirname(import.meta.dirname),
      stdio: 'pipe',
      env: process.env,
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

    let output = ''

    const onData = (data: Buffer) => {
      if (settled) return
      output += data.toString()

      const match = output.match(/Local:\s+http:\/\/localhost:(\d+)/)

      if (match) {
        devUrl = `http://localhost:${match[1]}`
        settled = true

        clearTimeout(timeout)
        setTimeout(() => {
          resolve(devUrl)
        }, 1000)
        return
      }

      if (output.toLowerCase().includes('error:')) {
        const errorMatch = output.match(/error:\s*(.+)/i)
        if (errorMatch) {
          errorMessage = errorMatch[1]
        }
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

    if (!proc.pid) {
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
  const url = await startServer()

  project.provide('devUrl', url)
}

export async function teardown() {
  await stopServer()
}
