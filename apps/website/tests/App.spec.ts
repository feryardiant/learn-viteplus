import { mount } from '@vue/test-utils'
import { createPinia } from 'pinia'
import { describe, it, expect } from 'vite-plus/test'

import App from '@/App.vue'
import { router } from '@/router'

const pinia = createPinia()

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
