import { exports } from 'cloudflare:workers'
import { describe, expect, it } from 'vite-plus/test'

describe('integration', () => {
  it('response with json', async () => {
    const res = await exports.default.fetch('http://localhost/api')

    expect(res.status).toBe(200)
  })
})
