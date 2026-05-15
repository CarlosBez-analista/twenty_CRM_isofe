-- Migration 002: Create auth tables
-- Ref: data-delta.md §2.1–2.4

-- 2.1 user (global)
CREATE TABLE "user" (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  email         citext      NOT NULL UNIQUE,
  password_hash text        NOT NULL,
  status        text        NOT NULL DEFAULT 'pending'
                            CHECK (status IN ('pending', 'active', 'disabled')),
  mfa_enrolled_at   timestamptz,
  last_login_at     timestamptz,
  failed_login_count int    NOT NULL DEFAULT 0,
  locked_until      timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz
);

-- 2.2 mfa_secret (global, 1:1 with user)
CREATE TABLE mfa_secret (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id          uuid        NOT NULL UNIQUE REFERENCES "user"(id) ON DELETE CASCADE,
  secret_encrypted bytea       NOT NULL,
  algorithm        text        NOT NULL DEFAULT 'SHA1',
  digits           int         NOT NULL DEFAULT 6,
  period_seconds   int         NOT NULL DEFAULT 30,
  confirmed_at     timestamptz,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

-- 2.3 backup_code (global)
CREATE TABLE backup_code (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  code_hash   text        NOT NULL,
  consumed_at timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_backup_code_available ON backup_code (user_id) WHERE consumed_at IS NULL;

-- 2.4 refresh_token (global)
CREATE TABLE refresh_token (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id            uuid        NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  token_hash         text        NOT NULL UNIQUE,
  issued_at          timestamptz NOT NULL DEFAULT now(),
  expires_at         timestamptz NOT NULL,
  revoked_at         timestamptz,
  device_fingerprint text
);

CREATE INDEX idx_refresh_token_active ON refresh_token (user_id) WHERE revoked_at IS NULL AND expires_at > now();
