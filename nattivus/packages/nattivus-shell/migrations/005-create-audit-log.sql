-- Migration 005: Create audit log table
-- Ref: data-delta.md §2.9

CREATE TABLE audit_log (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid,
  user_id       uuid,
  action        text        NOT NULL,
  entity_type   text,
  entity_id     uuid,
  metadata      jsonb       NOT NULL DEFAULT '{}',
  occurred_at   timestamptz NOT NULL DEFAULT now(),
  request_id    text
);

CREATE INDEX idx_audit_log_workspace ON audit_log (workspace_id, occurred_at DESC);
CREATE INDEX idx_audit_log_action ON audit_log (action, occurred_at DESC);
