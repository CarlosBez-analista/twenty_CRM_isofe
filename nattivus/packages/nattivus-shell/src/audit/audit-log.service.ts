import { Client } from 'pg';

/**
 * AuditLogService — Registro append-only de ações no sistema.
 *
 * - Sem UPDATE/DELETE — apenas INSERT
 * - Suporte a requestId para correlação entre ações do mesmo request
 * - action: string literal (não enum) — extensível por módulos
 *
 * Ref: data-delta.md §2.9, _reversa_sdd/domain.md RN-14 (auditoria)
 */

export interface AuditEntry {
  id: string;
  workspaceId: string | null;
  userId: string | null;
  action: string;
  entityType: string | null;
  entityId: string | null;
  metadata: Record<string, unknown>;
  occurredAt: Date;
  requestId: string | null;
}

export interface LogParams {
  action: string;
  workspaceId?: string;
  userId?: string;
  entityType?: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  requestId?: string;
}

export class AuditLogService {
  constructor(private readonly client: Client) {}

  /** Insere uma entrada no audit log */
  async log(params: LogParams): Promise<AuditEntry> {
    const { rows } = await this.client.query<AuditEntry>(
      `INSERT INTO audit_log
         (workspace_id, user_id, action, entity_type, entity_id, metadata, request_id)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, workspace_id AS "workspaceId", user_id AS "userId",
                 action, entity_type AS "entityType", entity_id AS "entityId",
                 metadata, occurred_at AS "occurredAt", request_id AS "requestId"`,
      [
        params.workspaceId ?? null,
        params.userId ?? null,
        params.action,
        params.entityType ?? null,
        params.entityId ?? null,
        JSON.stringify(params.metadata ?? {}),
        params.requestId ?? null,
      ],
    );
    return rows[0];
  }

  /**
   * Busca entradas do audit log por workspace (paginada).
   * Ordenada por occurred_at DESC (mais recente primeiro).
   */
  async query(params: {
    workspaceId: string;
    action?: string;
    entityType?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditEntry[]> {
    const conditions: string[] = ['workspace_id = $1'];
    const values: unknown[] = [params.workspaceId];
    let idx = 2;

    if (params.action) {
      conditions.push(`action = $${idx++}`);
      values.push(params.action);
    }
    if (params.entityType) {
      conditions.push(`entity_type = $${idx++}`);
      values.push(params.entityType);
    }

    values.push(params.limit ?? 50);
    values.push(params.offset ?? 0);

    const { rows } = await this.client.query<AuditEntry>(
      `SELECT id, workspace_id AS "workspaceId", user_id AS "userId",
              action, entity_type AS "entityType", entity_id AS "entityId",
              metadata, occurred_at AS "occurredAt", request_id AS "requestId"
       FROM audit_log
       WHERE ${conditions.join(' AND ')}
       ORDER BY occurred_at DESC
       LIMIT $${idx} OFFSET $${idx + 1}`,
      values,
    );
    return rows;
  }
}
