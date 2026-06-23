import type { H3 } from 'h3'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { MockD1Database } from '../helpers/mock-d1.ts'

const mockDB = new MockD1Database()

vi.mock('cloudflare:workers', () => ({
  get env() {
    return { DB: mockDB }
  },
}))

import { createApiRoutes } from '@/routes.ts'

const BASE_URL = 'http://localhost/counter' as const

describe('counter routes', () => {
  let api: H3

  beforeEach(() => {
    api = createApiRoutes()
  })

  async function fetchCounterApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '172.16.0.1') {
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    })

    const res = await api.fetch(req)

    expect(res.status).toBe(200)

    return await res.json<{ count: number }>()
  }

  it('GET /api/counter creates and returns 0', async () => {
    const body = await fetchCounterApi()

    expect(body.count).toBe(0)
  })

  it('PUT /api/counter increments', async () => {
    const body = await fetchCounterApi('PUT')

    expect(body.count).toBe(1)
  })

  it('DELETE /api/counter resets', async () => {
    const body = await fetchCounterApi('DELETE')

    expect(body.count).toBe(0)
  })

  it('uses cf-connecting-ip header for client IP', async () => {
    const body = await fetchCounterApi('GET', '10.0.0.99')

    expect(body.count).toBe(0)
  })
})
