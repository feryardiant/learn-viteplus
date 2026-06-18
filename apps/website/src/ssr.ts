import { renderToString, type SSRContext } from 'vue/server-renderer'

import { createApp } from './app.ts'

export async function render(url: URL, context?: SSRContext) {
  const { app, router } = createApp()

  await router.push(url.pathname)
  await router.isReady()

  const html = await renderToString(app, context)

  return { html }
}
