import { createExecutionContext, waitOnExecutionContext } from 'cloudflare:test'
import { env } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

import worker from '../../worker/main'

describe('worker', () => {
  it('response with json', async () => {
    const ctx = createExecutionContext()
    const req = new Request('http://localhost/api')

    const res = await worker.fetch(req, env, ctx)

    await waitOnExecutionContext(ctx)

    expect(res.status).toBe(200)
  })
})
