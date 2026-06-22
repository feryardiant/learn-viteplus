interface CounterRow {
  ip_address: string
  count: number
}

class MockD1PreparedStatement {
  private query: string
  private values: unknown[]
  private store: CounterRow[]

  constructor(query: string, values: unknown[], store: CounterRow[]) {
    this.query = query
    this.values = values
    this.store = store
  }

  bind(...values: unknown[]): MockD1PreparedStatement {
    return new MockD1PreparedStatement(this.query, values, this.store)
  }

  async first<T = unknown>(col?: string): Promise<T | null> {
    const ip = this.values[0] as string
    const row = this.store.find((r) => r.ip_address === ip)

    if (!row) return null

    return (col ? row[col as keyof CounterRow] : row) as T
  }

  async run(): Promise<{ success: boolean }> {
    const sql = this.query.trim().toUpperCase()

    if (sql.startsWith('INSERT')) {
      const ip = this.values[0] as string
      this.store.push({ ip_address: ip, count: 0 })
    } else if (sql.startsWith('UPDATE')) {
      const count = this.values[0] as number
      const ip = this.values[1] as string
      const row = this.store.find((r) => r.ip_address === ip)

      if (row) row.count = count
    }

    return { success: true }
  }
}

export class MockD1Database {
  private store: CounterRow[] = []

  prepare(query: string): MockD1PreparedStatement {
    return new MockD1PreparedStatement(query, [], this.store)
  }
}
