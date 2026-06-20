-- Migration number: 0001 	 2026-06-20T15:14:29.223Z
CREATE TABLE IF NOT EXISTS counters (
  ip_address TEXT PRIMARY KEY,
  count INTEGER DEFAULT 0
);
