import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, expect, it, vi } from 'vite-plus/test'

import { createRouter } from '@/app'
import App from '@/app.vue'

const router = createRouter()

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
