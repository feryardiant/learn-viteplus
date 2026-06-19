import type { Page } from 'playwright'
import { describe, expect, it, beforeAll, afterAll } from 'vite-plus/test'

import { startServer, stopServer, createPage, closeBrowser, getDevUrl } from '../setup.ts'

let page: Page

beforeAll(async () => {
  await startServer()
  page = await createPage()
}, 40000)

afterAll(async () => {
  await closeBrowser()
  stopServer()
})

describe('App (e2e)', () => {
  it('should render the home page', async () => {
    await page.goto(getDevUrl())
    await page.waitForLoadState('networkidle')

    const title = await page.textContent('h1')
    expect(title).toContain('Get started')
  })

  it('should navigate to the other page', async () => {
    await page.goto(getDevUrl('/other'))
    await page.waitForLoadState('networkidle')

    const body = await page.textContent('h1')
    expect(body).toContain('This is another page')
  })
})
