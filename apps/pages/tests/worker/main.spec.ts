import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

import worker from '~/main.ts'

const BASE_URL = 'http://localhost/api' as const

describe('unit', () => {
  async function fetchApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '172.16.0.1') {
    const ctx = createExecutionContext()
    const req = new Request(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    }) as Parameters<typeof worker.fetch>[0]

    const res = await worker.fetch(req, env, ctx)
    await waitOnExecutionContext(ctx)

    return res
  }

  it('GET /api returns json', async () => {
    const res = await fetchApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ foo: string }>()
    expect(body.foo).toBe('bar')
  })
})

describe('integration', () => {
  async function fetchApi(method: 'GET' | 'PUT' | 'DELETE' = 'GET', ip: string = '192.168.1.100') {
    const res = await fetch(BASE_URL, {
      method,
      headers: { 'cf-connecting-ip': ip },
    })

    return res
  }

  it('GET /api returns json', async () => {
    const res = await fetchApi()

    expect(res.status).toBe(200)
    const body = await res.json<{ foo: string }>()
    expect(body.foo).toBe('bar')
  })
})
