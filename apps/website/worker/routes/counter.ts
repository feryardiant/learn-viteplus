import { H3 } from 'h3'

export const counterRoutes = new H3()
  /**
   * Retrieve counter for Client IP.
   */
  .get('/', async ({ context, req }) => {
    const count = await context.env.DB.prepare('SELECT count FROM counters WHERE ip_address = ?')
      .bind(req.ip)
      .first<number>('count')

    if (count !== null) {
      return { count }
    }

    await context.env.DB.prepare('INSERT INTO counters (ip_address, count) VALUES (?, 0)').bind(req.ip).run()

    return { count: 0 }
  })

  /**
   * Update counter for Client IP.
   */
  .put('/', async ({ context, req }) => {
    let count = await context.env.DB.prepare('SELECT count FROM counters WHERE ip_address = ?')
      .bind(req.ip)
      .first<number>('count')

    if (count !== null) {
      count++
      await context.env.DB.prepare('UPDATE counters SET count = ? WHERE ip_address = ?').bind(count, req.ip).run()
    }

    return { count }
  })

  /**
   * Reset counter for Client IP.
   */
  .delete('/', async ({ context, req }) => {
    await context.env.DB.prepare('UPDATE counters SET count = 0 WHERE ip_address = ?').bind(req.ip).run()

    return { count: 0 }
  })
