import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath, URL } from 'node:url'

import { renderToString } from 'vue/server-renderer'

import { createApp } from './src/app.ts'

const fetch: ExportedHandler['fetch'] = async (req) => {
  const url = new URL(req.url)

  if (url.pathname.startsWith('/api')) {
    return Response.json({ foo: 'Anu' })
  }

  if (url.pathname.startsWith('/anu')) {
    // const indexHtml = fileURLToPath(new URL('./index.html', import.meta.url))
    let template = readFileSync(resolve(import.meta.dirname, 'index.html'), 'utf-8')

    // const { createServer } = await import('vite-plus')
    // const vite = await createServer({
    //   appType: 'custom',
    //   server: { middlewareMode: true },
    // })

    // template = await vite.transformIndexHtml(url.toString(), template)

    // console.log(template)

    // const { app } = createApp()
    // const html = template.replace('<!--ssr-outlet-->', await renderToString(app))

    return new Response(template, { status: 200 })
    // return new Response(html, { status: 200 })
  }

  return new Response(null, { status: 404 })
}

export default { fetch } satisfies ExportedHandler
