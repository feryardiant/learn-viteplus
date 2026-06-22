import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import Card from '@/components/card.vue'

describe('Card', () => {
  it('renders with links', () => {
    const links = [{ href: 'https://example.com', label: 'Example', icon: '/icon.svg' }]

    const wrapper = mount(Card, {
      props: { links },
      slots: { default: '<h2>Title</h2>' },
    })

    expect(wrapper.text()).toContain('Title')
    expect(wrapper.text()).toContain('Example')
  })

  it('renders icon slot for each link', () => {
    const links = [
      { href: 'https://a.com', label: 'A', icon: '/a.svg' },
      { href: 'https://b.com', label: 'B', icon: '/b.svg' },
    ]

    const wrapper = mount(Card, {
      props: { links },
      slots: {
        default: '<h2>Title</h2>',
        icon: ({ icon }) => `<img src="${icon}" />`,
      },
    })

    const items = wrapper.findAll('li')
    expect(items.length).toBe(2)
  })
})
