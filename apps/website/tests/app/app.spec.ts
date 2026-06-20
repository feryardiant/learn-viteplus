import { mount } from '@vue/test-utils'
import { createPinia, setActivePinia } from 'pinia'
import { beforeEach, describe, expect, it, vi } from 'vite-plus/test'

import { createRouter } from '@/app'
import App from '@/app.vue'
import { useCounterStore } from '@/stores/counter'

const router = createRouter()

describe('App', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    vi.restoreAllMocks()
  })

  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, createPinia()],
      },
    })

    const nav = wrapper.find('nav')
    expect(nav.exists()).toBe(true)
    expect(nav.text()).toContain('Home')
    expect(nav.text()).toContain('Other')
  })

  describe('counter store', () => {
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

  describe('home page counter', () => {
    it('displays counter with initial count 0', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ count: 0 }), { status: 200 }))

      const wrapper = mount(App, {
        global: {
          plugins: [router, createPinia()],
        },
      })

      await vi.waitFor(() => {
        const button = wrapper.find('#counter button.counter')
        expect(button.text()).toContain('Count is 0')
      })
    })

    it('increments counter on button click', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ count: 0 }), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ count: 1 }), { status: 200 }))

      const wrapper = mount(App, {
        global: {
          plugins: [router, createPinia()],
        },
      })

      await vi.waitFor(() => {
        expect(wrapper.find('#counter button.counter').exists()).toBe(true)
      })

      await wrapper.find('#counter button.counter').trigger('click')

      await vi.waitFor(() => {
        expect(wrapper.find('#counter button.counter').text()).toContain('Count is 1')
      })
    })

    it('resets counter on reset click', async () => {
      vi.spyOn(globalThis, 'fetch')
        .mockResolvedValueOnce(new Response(JSON.stringify({ count: 3 }), { status: 200 }))
        .mockResolvedValueOnce(new Response(JSON.stringify({ count: 0 }), { status: 200 }))

      const wrapper = mount(App, {
        global: {
          plugins: [router, createPinia()],
        },
      })

      await vi.waitFor(() => {
        expect(wrapper.find('#counter button.counter').text()).toContain('Count is 3')
      })

      await wrapper.find('#counter button[type="reset"]').trigger('click')

      await vi.waitFor(() => {
        expect(wrapper.find('#counter button.counter').text()).toContain('Count is 0')
      })
    })
  })
})
