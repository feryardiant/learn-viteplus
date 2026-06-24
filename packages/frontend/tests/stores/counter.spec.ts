import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { useCounterStore } from '../../src/stores/counter.js'

describe('counter store', () => {
  beforeEach(() => {
    vi.stubEnv('SSR', false)
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('fetchCount calls GET /api/counter', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ count: 5 }), { status: 200 }))

    const store = useCounterStore()
    await store.fetchCount()

    expect(store.count).toBe(5)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/counter', { method: 'GET' })
  })

  it('increment calls PUT /api/counter', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ count: 3 }), { status: 200 }))

    const store = useCounterStore()
    await store.increment()

    expect(store.count).toBe(3)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/counter', { method: 'PUT' })
  })

  it('reset calls DELETE /api/counter', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ count: 0 }), { status: 200 }))

    const store = useCounterStore()
    await store.reset()

    expect(store.count).toBe(0)
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/counter', { method: 'DELETE' })
  })

  it('returns 0 on fetch failure', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network error'))

    const store = useCounterStore()
    await store.fetchCount()

    expect(store.count).toBe(0)
  })
})
