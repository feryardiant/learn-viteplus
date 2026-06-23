import { H3 } from 'h3'
import type { H3 as H3Type } from 'h3'

import { counterRoutes } from './routes/counter.ts'

export function createApiRoutes(): H3Type {
  const app = new H3()

  /**
   * Middleware to resolve client IP from cf-connecting-ip header.
   */
  app.use(({ req }, next) => {
    if (!req.ip) {
      req.ip = req.headers.get('cf-connecting-ip') || undefined
    }

    return next()
  })

  /**
   * Home Route
   */
  app.get('/', () => ({ foo: 'bar' }))

  /**
   * Counter Routes
   */
  app.use('/counter', counterRoutes)

  return app
}
