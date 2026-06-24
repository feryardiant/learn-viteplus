import { mount } from '@vue/test-utils'
import { describe, expect, it } from 'vite-plus/test'

import ExternalLink from '@/components/external-link.vue'

describe('ExternalLink', () => {
  it('renders link with href and label', () => {
    const wrapper = mount(ExternalLink, {
      props: { href: 'https://example.com', label: 'Example' },
    })

    const link = wrapper.find('a')
    expect(link.exists()).toBe(true)
    expect(link.attributes('href')).toBe('https://example.com')
    expect(link.attributes('target')).toBe('_blank')
    expect(link.text()).toContain('Example')
  })

  it('renders slot content', () => {
    const wrapper = mount(ExternalLink, {
      props: { href: 'https://example.com', label: 'Example' },
      slots: { default: '<span>Icon</span>' },
    })

    expect(wrapper.text()).toContain('Icon')
    expect(wrapper.text()).toContain('Example')
  })
})
