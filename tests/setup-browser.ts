import { chromium, type Browser, type Page } from 'playwright'
import { inject } from 'vite-plus/test'

type PageOptions = Parameters<Browser['newPage']>[0]

let browser: Browser | null = null
let page: Page

export async function launchBrowser(options: PageOptions = {}): Promise<void> {
  if (!browser) {
    browser = await chromium.launch({
      headless: 'GITHUB_ACTIONS' in process.env,
    })
  }

  const baseURL = inject('devUrl')

  page = await browser.newPage({
    baseURL,
    ...options,
  })
}

export async function closeBrowser(): Promise<void> {
  if (browser) {
    await browser.close()
    browser = null
  }
}

export async function visit(path: string = '', fn: (page: Page) => Promise<void>) {
  const url = inject('devUrl')

  await page.goto(`${url}${path}`)
  await page.waitForLoadState('networkidle')

  await fn(page)
}
