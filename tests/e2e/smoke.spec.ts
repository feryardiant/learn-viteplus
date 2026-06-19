import { expect, it, beforeAll, afterAll } from 'vite-plus/test'

import { closeBrowser, launchBrowser, visit } from '../setup-browser.ts'

beforeAll(async () => {
  await launchBrowser()
}, 40_000)

afterAll(async () => {
  await closeBrowser()
})

it('should render the home page', async () => {
  await visit('/', async (page) => {
    const body = await page.textContent('h1')

    expect(body).toContain('Get started')
  })
})

it('should navigate to the other page', async () => {
  await visit('/other', async (page) => {
    const body = await page.textContent('h1')

    expect(body).toContain('This is another page')
  })
})
