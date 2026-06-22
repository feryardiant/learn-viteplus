import { H3 } from 'h3'

import { counterRoutes } from './counter'

export const apiRoutes = new H3()
  /**
   * Home Route
   */
  .get('/', () => ({ foo: 'bar' }))
  /**
   * Counter Routes
   */
  .use('/counter', counterRoutes)
