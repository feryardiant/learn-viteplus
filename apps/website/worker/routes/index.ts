import { H3 } from 'h3'

export const apiRoutes = new H3()

apiRoutes.get('/', () => ({ foo: 'bar' }))
