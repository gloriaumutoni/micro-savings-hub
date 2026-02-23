CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE IF NOT EXISTS groups (
  id            UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  name          VARCHAR(255) NOT NULL,
  description   TEXT,
  target_amount NUMERIC(15, 2) NOT NULL,
  currency      VARCHAR(10)  NOT NULL DEFAULT 'RWF',
  total_saved   NUMERIC(15, 2) NOT NULL DEFAULT 0,
  created_at    TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contributions (
  id          UUID        PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id    UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  member_name VARCHAR(255) NOT NULL,
  amount      NUMERIC(15, 2) NOT NULL,
  created_at  TIMESTAMPTZ  NOT NULL DEFAULT NOW()
);
