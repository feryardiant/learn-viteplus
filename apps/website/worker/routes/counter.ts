import { env } from 'cloudflare:workers'
import { H3 } from 'h3'

function db(query: string, ...values: unknown[]): D1PreparedStatement {
  if (!env.DB) {
    throw new Error('DB is not available')
  }

  const stmt = env.DB.prepare(query)

  return values.length > 0 ? stmt.bind(...values) : stmt
}

export const counterRoutes = new H3()
  /**
   * Retrieve counter for Client IP.
   */
  .get('/', async ({ req }) => {
    const count = await db('SELECT count FROM counters WHERE ip_address = ?', req.ip).first<number>('count')

    if (count !== null) {
      return { count }
    }

    await db('INSERT INTO counters (ip_address, count) VALUES (?, 0)', req.ip).run()

    return { count: 0 }
  })

  /**
   * Update counter for Client IP.
   */
  .put('/', async ({ req }) => {
    let count = await db('SELECT count FROM counters WHERE ip_address = ?', req.ip).first<number>('count')

    if (count !== null) {
      count++
      await db('UPDATE counters SET count = ? WHERE ip_address = ?', count, req.ip).run()
    }

    return { count }
  })

  /**
   * Reset counter for Client IP.
   */
  .delete('/', async ({ req }) => {
    await db('UPDATE counters SET count = 0 WHERE ip_address = ?', req.ip).run()

    return { count: 0 }
  })
