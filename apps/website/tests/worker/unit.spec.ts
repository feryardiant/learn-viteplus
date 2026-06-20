import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

import worker from '../../worker/main.ts'

describe('unit', () => {
  it('GET /api returns json', async () => {
    const ctx = createExecutionContext()
    const req = new Request('http://localhost/api')

    const res = await worker.fetch(req as Parameters<typeof worker.fetch>[0], env, ctx)
    await waitOnExecutionContext(ctx)

    expect(res.status).toBe(200)
    const body = await res.json<{ foo: string }>()
    expect(body.foo).toBe('bar')
  })

  describe('counter routes', () => {
    it('GET /api/counter creates and returns 0', async () => {
      const ctx = createExecutionContext()
      const req = new Request('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': '172.16.0.1' },
      })

      const res = await worker.fetch(req as Parameters<typeof worker.fetch>[0], env, ctx)
      await waitOnExecutionContext(ctx)

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })

    it('PUT /api/counter increments', async () => {
      const ctx = createExecutionContext()
      const req = new Request('http://localhost/api/counter', {
        method: 'PUT',
        headers: { 'cf-connecting-ip': '172.16.0.1' },
      })

      const res = await worker.fetch(req as Parameters<typeof worker.fetch>[0], env, ctx)
      await waitOnExecutionContext(ctx)

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(1)
    })

    it('DELETE /api/counter resets', async () => {
      const ctx = createExecutionContext()
      const req = new Request('http://localhost/api/counter', {
        method: 'DELETE',
        headers: { 'cf-connecting-ip': '172.16.0.1' },
      })

      const res = await worker.fetch(req as Parameters<typeof worker.fetch>[0], env, ctx)
      await waitOnExecutionContext(ctx)

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })

    it('uses cf-connecting-ip header for client IP', async () => {
      const ctx = createExecutionContext()
      const req = new Request('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': '10.0.0.99' },
      })

      const res = await worker.fetch(req as Parameters<typeof worker.fetch>[0], env, ctx)
      await waitOnExecutionContext(ctx)

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })
  })
})
