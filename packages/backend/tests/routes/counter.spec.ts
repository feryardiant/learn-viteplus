import type { H3 } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { MockD1Database } from '../helpers/mock-d1.ts'

let mockDB: MockD1Database

vi.mock('cloudflare:workers', () => ({
  get env() {
    return { DB: mockDB }
  },
}))

import { createApiRoutes } from '@/routes.ts'

describe('counter routes', () => {
  let api: H3
  const BASE_URL = 'http://localhost/counter' as const

  beforeEach(() => {
    api = createApiRoutes()
    mockDB = new MockD1Database()
  })

  async function fetchCounterApi(ip: string, method: 'GET' | 'PUT' | 'DELETE' = 'GET') {
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    })

    const res = await api.fetch(req)

    expect(res.status).toBe(200)

    return await res.json<{ count: number }>()
  }

  it('GET /api/counter creates and returns 0', async () => {
    const body = await fetchCounterApi('172.16.0.1')

    expect(body.count).toBe(0)
  })

  it('PUT /api/counter increments', async () => {
    // await fetchCounterApi('172.16.0.1')
    const body = await fetchCounterApi('172.16.0.1', 'PUT')

    expect(body.count).toBe(1)
  })

  it('DELETE /api/counter resets', async () => {
    const body = await fetchCounterApi('172.16.0.1', 'DELETE')

    expect(body.count).toBe(0)
  })

  it('uses cf-connecting-ip header for client IP', async () => {
    const body = await fetchCounterApi('10.0.0.99')

    expect(body.count).toBe(0)
  })
})
