import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

describe('integration', () => {
  it('GET /api returns json', async () => {
    const res = await exports.default.fetch('http://localhost/api')

    expect(res.status).toBe(200)
    const body = await res.json<{ foo: string }>()
    expect(body.foo).toBe('bar')
  })

  describe('counter', () => {
    const ip = '192.168.1.100'

    it('GET /api/counter returns 0 for new IP', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })

    it('PUT /api/counter increments count', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        method: 'PUT',
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(1)
    })

    it('PUT /api/counter increments again', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        method: 'PUT',
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(2)
    })

    it('GET /api/counter returns persisted count', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(2)
    })

    it('DELETE /api/counter resets count to 0', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        method: 'DELETE',
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })

    it('GET /api/counter confirms reset', async () => {
      const res = await exports.default.fetch('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': ip },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(0)
    })

    it('different IPs have independent counts', async () => {
      const otherIp = '10.0.0.1'

      await exports.default.fetch('http://localhost/api/counter', {
        headers: { 'cf-connecting-ip': otherIp },
      })

      const res = await exports.default.fetch('http://localhost/api/counter', {
        method: 'PUT',
        headers: { 'cf-connecting-ip': otherIp },
      })

      expect(res.status).toBe(200)
      const body = await res.json<{ count: number }>()
      expect(body.count).toBe(1)
    })
  })
})
