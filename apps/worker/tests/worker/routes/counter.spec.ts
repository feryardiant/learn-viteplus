import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

import worker from '~/main.ts'

const BASE_URL = 'http://localhost/api/counter' as const

describe('integration', () => {
  async function fetchCounterApi(ip: string, method: 'GET' | 'PUT' | 'DELETE' = 'GET') {
    const ctx = createExecutionContext()
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    }) as Parameters<typeof worker.fetch>[0]

    const res = await worker.fetch(req, env, ctx)
    await waitOnExecutionContext(ctx)

    expect(res.status).toBe(200)

    return await res.json<{ count: number }>()
  }

  async function getCounterDB(ip: string) {
    interface Counter {
      ip_address: string
      count: number
    }

    const counter = await env.DB.prepare('SELECT * FROM counters WHERE ip_address = ?').bind(ip).first<Counter>()

    expect(counter).not.toBeNull()

    return counter as Counter
  }

  it('GET /api/counter returns 0 for new IP', async () => {
    const ip = '10.0.0.1'
    const body = await fetchCounterApi(ip)
    const counter = await getCounterDB(ip)

    expect(counter).toEqual({ ip_address: ip, count: 0 })
    expect(body.count).toBe(counter.count)
  })

  it('PUT /api/counter increments count', async () => {
    const ip = '10.0.0.1'
    const body = await fetchCounterApi(ip, 'PUT')
    const counter = await getCounterDB(ip)

    expect(counter).toEqual({ ip_address: ip, count: 1 })
    expect(body.count).toBe(counter.count)
  })

  it('PUT /api/counter increments again', async () => {
    const ip = '10.0.0.1'
    const body = await fetchCounterApi(ip, 'PUT')
    const counter = await getCounterDB(ip)

    expect(counter).toEqual({ ip_address: ip, count: 2 })
    expect(body.count).toBe(counter.count)
  })

  it('DELETE /api/counter resets count to 0', async () => {
    const ip = '10.0.0.1'
    const body = await fetchCounterApi(ip, 'DELETE')
    const counter = await getCounterDB(ip)

    expect(counter).toEqual({ ip_address: ip, count: 0 })
    expect(body.count).toBe(counter.count)

    const bodyConfirm = await fetchCounterApi(ip)

    expect(bodyConfirm.count).toBe(0)
  })
})
