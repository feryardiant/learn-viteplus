import { render } from './src/server'

export default {
  async fetch(req, env) {
    const url = new URL(req.url)

    if (url.pathname.startsWith('/api')) {
      return Response.json({ foo: 'Anu' })
    }

    try {
      const appHtml = await render(url)
      const template = await env.ASSETS.fetch(new URL('/index.html', req.url)).then(async (res) => await res.text())

      return new Response(template.replace('<!--ssr-outlet-->', appHtml), {
        headers: { 'content-type': 'text/html' },
      })
    } catch (err) {
      return new Response(
        JSON.stringify({
          error: err instanceof Error ? err.message : String(err),
          stack: err instanceof Error ? err.stack : undefined,
        }),
        { status: 500, headers: { 'content-type': 'application/json' } },
      )
    }
  },
} satisfies ExportedHandler<Env>
