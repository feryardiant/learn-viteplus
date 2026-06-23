import { env } from 'cloudflare:workers'
import { H3 } from 'h3'
import type { H3 as H3Type } from 'h3'

function db(query: string, ...values: unknown[]): D1PreparedStatement {
  const stmt = env.DB.prepare(query)

  return values.length > 0 ? stmt.bind(...values) : stmt
}

export interface Counter {
  ip_address: string
  count: number
}

export const counterRoutes: H3Type = new H3()
  /**
   * Retrieve counter for Client IP.
   */
  .get('/', async ({ req }) => {
    const counter = await db('SELECT count FROM counters WHERE ip_address = ?', req.ip).first<Counter>()

    if (counter !== null) {
      return { count: counter.count }
    }

    await db('INSERT INTO counters (ip_address, count) VALUES (?, 0)', req.ip).run()

    return { count: 0 }
  })

  /**
   * Update counter for Client IP.
   */
  .put('/', async ({ req }) => {
    const counter = await db('SELECT count FROM counters WHERE ip_address = ?', req.ip).first<Counter>()
    let count = counter?.count ?? 0

    if (counter !== null) {
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
