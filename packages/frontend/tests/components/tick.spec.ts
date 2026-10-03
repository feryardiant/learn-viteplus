import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import Tick from '@/components/tick.vue'

describe('Tick', () => {
  it('renders tick div', () => {
    const wrapper = mount(Tick)
    const tick = wrapper.find('.ticks')
    expect(tick.exists()).toBe(true)
  })
})
