import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import { env, exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

import worker from '~/main.ts'

const BASE_URL = 'http://localhost/api/counter' as const

describe('unit', () => {
  async function fetchCounterApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '172.16.0.1') {
    const ctx = createExecutionContext()
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    }) as Parameters<typeof worker.fetch>[0]

    const res = await worker.fetch(req, env, ctx)
    await waitOnExecutionContext(ctx)

    return res
  }

  it('GET /api/counter creates and returns 0', async () => {
    const res = await fetchCounterApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })

  it('PUT /api/counter increments', async () => {
    const res = await fetchCounterApi('PUT')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(1)
  })

  it('DELETE /api/counter resets', async () => {
    const res = await fetchCounterApi('DELETE')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })

  it('uses cf-connecting-ip header for client IP', async () => {
    const res = await fetchCounterApi('GET', '10.0.0.99')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })
})

describe('integration', () => {
  async function fetchCounterApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '192.168.1.100') {
    const res = await exports.default.fetch(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    })

    return res
  }

  it('GET /api/counter returns 0 for new IP', async () => {
    const res = await fetchCounterApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })

  it('PUT /api/counter increments count', async () => {
    const res = await fetchCounterApi('PUT')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(1)
  })

  it('PUT /api/counter increments again', async () => {
    const res = await fetchCounterApi('PUT')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(2)
  })

  it('GET /api/counter returns persisted count', async () => {
    const res = await fetchCounterApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(2)
  })

  it('DELETE /api/counter resets count to 0', async () => {
    const res = await fetchCounterApi('DELETE')

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })

  it('GET /api/counter confirms reset', async () => {
    const res = await fetchCounterApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(0)
  })

  it('different IPs have independent counts', async () => {
    const otherIp = '10.0.0.1'

    await fetchCounterApi('GET', otherIp)
    const res = await fetchCounterApi('PUT', otherIp)

    expect(res.status).toBe(200)
    const body = await res.json<{ count: number }>()
    expect(body.count).toBe(1)
  })
})
