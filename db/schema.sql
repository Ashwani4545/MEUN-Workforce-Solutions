-- MEUN database schema (PostgreSQL). Safe to run repeatedly: every statement
-- is idempotent. Apply with `npm run db:migrate`.

CREATE TABLE IF NOT EXISTS users (
  id            text PRIMARY KEY,
  name          text NOT NULL,
  email         text NOT NULL,
  phone         text NOT NULL,
  password_hash text NOT NULL,
  role          text NOT NULL CHECK (role IN ('customer', 'worker', 'admin')),
  city          text,
  created_at    timestamptz NOT NULL DEFAULT now()
);
-- Emails are unique regardless of case.
CREATE UNIQUE INDEX IF NOT EXISTS users_email_lower_idx ON users (lower(email));

-- Worker profiles. The nested profile (verification flags, languages, ...) is
-- stored as JSON so the shape in types/index.ts stays the single source of truth.
CREATE TABLE IF NOT EXISTS workers (
  id         text PRIMARY KEY,
  data       jsonb NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id              text PRIMARY KEY,
  idempotency_key text NOT NULL UNIQUE,
  user_id         text NOT NULL REFERENCES users (id),
  worker_id       text NOT NULL,
  category        text NOT NULL,
  sub_service     text NOT NULL,
  package         text NOT NULL,
  date            text NOT NULL,
  time_slot       text NOT NULL,
  address         jsonb NOT NULL,
  notes           text NOT NULL DEFAULT '',
  price_summary   jsonb NOT NULL,
  status          text NOT NULL,
  start_otp       text NOT NULL,
  created_at      timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS bookings_user_idx ON bookings (user_id, created_at DESC);

CREATE TABLE IF NOT EXISTS contact_submissions (
  id           text PRIMARY KEY,
  name         text NOT NULL,
  contact      text NOT NULL,
  email        text NOT NULL,
  city         text NOT NULL,
  persona_type text NOT NULL,
  message      text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Rotating, single-use refresh tokens. Shared across all server instances.
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token_id   text PRIMARY KEY,
  user_id    text NOT NULL,
  expires_at timestamptz NOT NULL
);
CREATE INDEX IF NOT EXISTS refresh_tokens_expires_idx ON refresh_tokens (expires_at);

-- Fixed-window rate-limit counters. Shared across all server instances.
CREATE TABLE IF NOT EXISTS rate_limits (
  key      text PRIMARY KEY,
  count    integer NOT NULL,
  reset_at timestamptz NOT NULL
);
