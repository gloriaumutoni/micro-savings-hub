-- AfrikaSave database schema
-- Run once against your Neon database:
--   psql "<DATABASE_URL>" -f backend/db/init.sql

-- Drop tables in reverse dependency order (safe for re-runs)
DROP TABLE IF EXISTS contributions;
DROP TABLE IF EXISTS group_invites;
DROP TABLE IF EXISTS group_memberships;
DROP TABLE IF EXISTS groups;
DROP TABLE IF EXISTS users;

-- 1. users
CREATE TABLE users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         VARCHAR(255) UNIQUE NOT NULL,
  password_hash TEXT        NOT NULL,
  role          VARCHAR(20) NOT NULL DEFAULT 'user'
                CHECK (role IN ('user', 'system_admin')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. groups
CREATE TABLE groups (
  id            UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  name          VARCHAR(255)  NOT NULL,
  description   TEXT,
  target_amount NUMERIC(15,2) NOT NULL,
  currency      VARCHAR(10)   NOT NULL DEFAULT 'RWF',
  total_saved   NUMERIC(15,2) NOT NULL DEFAULT 0,
  status        VARCHAR(10)   NOT NULL DEFAULT 'active'
                CHECK (status IN ('active', 'closed')),
  end_date      TIMESTAMPTZ,
  created_by    UUID          NOT NULL REFERENCES users(id),
  created_at    TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);

-- 3. group_memberships
CREATE TABLE group_memberships (
  id        UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id  UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id   UUID        NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role      VARCHAR(10) NOT NULL DEFAULT 'member'
            CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (group_id, user_id)
);

-- 4. group_invites
CREATE TABLE group_invites (
  id         UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID        NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  token      VARCHAR(64) UNIQUE NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  used       BOOLEAN     NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. contributions
CREATE TABLE contributions (
  id         UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
  group_id   UUID          NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id    UUID          NOT NULL REFERENCES users(id),
  amount     NUMERIC(15,2) NOT NULL CHECK (amount > 0),
  created_at TIMESTAMPTZ   NOT NULL DEFAULT NOW()
);
