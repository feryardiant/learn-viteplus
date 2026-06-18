import { H3, html } from 'h3/cloudflare'

import { render } from '../src/ssr.ts'
import { apiRoutes } from './routes'

const app = new H3({
  onError(error, { res }) {
    res.status = error.status

    return {
      message: error.message,
      stack: error.stack?.split('\n'),
    }
  },
})

app.use(({ context: { env }, req }, next) => {
  if (!req.headers.get('accept')?.includes('text/html')) {
    return env.ASSETS.fetch(new URL(req.url), req)
  }

  return next()
})

app.mount('/api', apiRoutes)

app.get('/**', async ({ context: { env }, req }) => {
  const body = await env.ASSETS.fetch(new URL('/index.html', req.url)).then(async (res) => {
    const template = await res.text()
    const { html } = await render(new URL(req.url), { env, req })

    return template.replace('<!--ssr-outlet-->', html)
  })

  return html(body)
})

export default {
  async fetch(req, env, context) {
    return app.request(req.url, req, { context, env })
  },
} satisfies ExportedHandler<Env>
