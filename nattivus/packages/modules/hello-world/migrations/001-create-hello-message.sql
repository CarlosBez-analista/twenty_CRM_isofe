-- hello-world module migration
-- Criado automaticamente durante onActivate()
-- Cada módulo gerencia suas próprias tabelas

CREATE TABLE IF NOT EXISTS hello_message (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content     text        NOT NULL CHECK (length(content) > 0),
  author_id   uuid        NOT NULL,
  workspace_id uuid       NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now(),
  updated_at  timestamptz NOT NULL DEFAULT now(),
  deleted_at  timestamptz,

  FOREIGN KEY (workspace_id) REFERENCES workspace(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_hello_message_workspace
  ON hello_message(workspace_id)
  WHERE deleted_at IS NULL;

-- Trigger para updated_at
CREATE TRIGGER tg_hello_message_updated_at
  BEFORE UPDATE ON hello_message
  FOR EACH ROW EXECUTE FUNCTION tg_set_updated_at();

-- Habilitar RLS (isolamento por workspace)
ALTER TABLE hello_message ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation ON hello_message
  USING (workspace_id = current_setting('app.workspace_id')::uuid);
