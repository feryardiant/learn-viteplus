import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect } from 'vite-plus/test'

import { createRouter } from '@/app'
import App from '@/App.vue'

const pinia = createPinia()
const router = createRouter()

describe('App', () => {
  it('mounts renders properly', () => {
    const wrapper = mount(App, {
      global: {
        plugins: [router, pinia],
      },
    })

    expect(wrapper.html()).toContain('<nav><a href="/" class="">Home</a><a href="/other" class="">Other</a></nav>')
  })
})
