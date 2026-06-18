import { env } from 'cloudflare:workers'
import { H3, html } from 'h3/cloudflare'

import { render } from '../src/ssr.ts'

const app = new H3({
  onError(error, { res }) {
    res.status = error.status || 500

    return {
      message: error.message,
      stack: error.stack?.split('\n'),
    }
  },
})

app.use(({ req }, next) => {
  if (!req.headers.get('accept')?.includes('text/html')) {
    return env.ASSETS.fetch(new URL(req.url), req)
  }

  return next()
})

app.get('/**', async ({ req }) => {
  const body = await env.ASSETS.fetch(new URL('/index.html', req.url)).then(async (res) => {
    const template = await res.text()
    const appHtml = await render(new URL(req.url))

    return template.replace('<!--ssr-outlet-->', appHtml)
  })

  return html(body)
})

export default {
  async fetch(req, env, ctx) {
    return app.request(req, {}, { cloudflare: { ctx, env } })
  },
} satisfies ExportedHandler<Env>
