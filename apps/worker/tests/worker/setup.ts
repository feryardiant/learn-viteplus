import { applyD1Migrations } from 'cloudflare:test'
import { env } from 'cloudflare:workers'

const { DB, TEST_MIGRATIONS } = env as unknown as {
  DB: D1Database
  TEST_MIGRATIONS: import('@cloudflare/vitest-pool-workers').D1Migration[]
}

await applyD1Migrations(DB, TEST_MIGRATIONS)
