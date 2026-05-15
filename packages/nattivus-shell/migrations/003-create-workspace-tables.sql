CREATE TABLE IF NOT EXISTS workspace (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug citext NOT NULL UNIQUE,
  name text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz
);

CREATE TABLE IF NOT EXISTS workspace_member (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id uuid NOT NULL REFERENCES workspace(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'member',
  invited_email citext,
  invited_at timestamptz,
  accepted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  deleted_at timestamptz,
  CONSTRAINT uq_workspace_member_user UNIQUE (workspace_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_workspace_member_workspace_id
  ON workspace_member(workspace_id);

CREATE INDEX IF NOT EXISTS idx_workspace_member_user_id
  ON workspace_member(user_id);
