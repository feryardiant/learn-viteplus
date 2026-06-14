import { renderToString } from 'vue/server-renderer'

import { createApp } from './app.ts'

export async function render(url: URL) {
  const { app, router } = createApp()

  await router.push(url.pathname)
  await router.isReady()

  const appHtml = await renderToString(app)

  return appHtml
}
