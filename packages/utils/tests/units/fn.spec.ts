import { describe, expect, it } from 'vite-plus/test'

import { fn } from '../../src/index.js'

describe('fn', () => {
  it('returns the correct greeting', () => {
    expect(fn()).toBe('Hello, tsdown!')
  })
})
