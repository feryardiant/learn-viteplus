import { describe, expect, it, vi } from 'vite-plus/test'

import { MockD1Database } from '../helpers/mock-d1.ts'

const mockDB = new MockD1Database()

vi.mock('cloudflare:workers', () => ({
  get env() {
    return { DB: mockDB }
  },
}))

const { createApiRoutes } = await import('../../src/index.ts')

const api = createApiRoutes()
const BASE_URL = 'http://localhost/counter' as const

describe('counter routes', () => {
  async function fetchCounterApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '172.16.0.1') {
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    })

    return api.fetch(req)
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
