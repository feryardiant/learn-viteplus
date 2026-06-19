import { describe, expect, it } from 'vite-plus/test'

import * as mod from '../../src/index.js'

describe('utils module', () => {
  it('exports fn as a function', () => {
    expect(mod.fn).toBeInstanceOf(Function)
  })

  it('fn returns a string', () => {
    expect(mod.fn()).toBeTypeOf('string')
  })
})
