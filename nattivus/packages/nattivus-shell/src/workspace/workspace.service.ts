import { Client } from 'pg';
import * as crypto from 'crypto';

/**
 * WorkspaceService + WorkspaceMemberService — Gerenciamento de tenants.
 *
 * WorkspaceService:
 * - Criar workspace (slug único, validação)
 * - Buscar por id/slug
 * - Atualizar brand_overrides e profile
 * - Soft-delete
 *
 * WorkspaceMemberService:
 * - Convidar usuário por email (token de convite)
 * - Aceitar convite
 * - Atualizar roles
 * - Remover membro (soft-delete)
 *
 * Ref: data-delta.md §2.5–2.6, _reversa_sdd/domain.md RN-3
 */

export interface Workspace {
  id: string;
  slug: string;
  displayName: string;
  brandOverrides: Record<string, unknown>;
  profile: 'social' | 'enterprise' | 'both';
  createdAt: Date;
  updatedAt: Date;
}

export interface WorkspaceMember {
  id: string;
  workspaceId: string;
  userId: string;
  roles: string[];
  invitedAt: Date;
  acceptedAt: Date | null;
}

// ── WorkspaceService ─────────────────────────────────────────────────

export class WorkspaceService {
  constructor(private readonly client: Client) {}

  async create(params: {
    slug: string;
    displayName: string;
    profile?: 'social' | 'enterprise' | 'both';
    brandOverrides?: Record<string, unknown>;
  }): Promise<Workspace> {
    const { rows } = await this.client.query<Workspace>(
      `INSERT INTO workspace (slug, display_name, profile, brand_overrides)
       VALUES ($1, $2, $3, $4)
       RETURNING id, slug, display_name AS "displayName",
                 brand_overrides AS "brandOverrides", profile,
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      [
        params.slug,
        params.displayName,
        params.profile ?? 'social',
        JSON.stringify(params.brandOverrides ?? {}),
      ],
    );
    return rows[0];
  }

  async findById(id: string): Promise<Workspace | null> {
    const { rows } = await this.client.query<Workspace>(
      `SELECT id, slug, display_name AS "displayName",
              brand_overrides AS "brandOverrides", profile,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM workspace WHERE id = $1 AND deleted_at IS NULL`,
      [id],
    );
    return rows[0] ?? null;
  }

  async findBySlug(slug: string): Promise<Workspace | null> {
    const { rows } = await this.client.query<Workspace>(
      `SELECT id, slug, display_name AS "displayName",
              brand_overrides AS "brandOverrides", profile,
              created_at AS "createdAt", updated_at AS "updatedAt"
       FROM workspace WHERE slug = $1 AND deleted_at IS NULL`,
      [slug],
    );
    return rows[0] ?? null;
  }

  async update(
    id: string,
    updates: Partial<Pick<Workspace, 'displayName' | 'brandOverrides' | 'profile'>>,
  ): Promise<Workspace> {
    const setClauses: string[] = [];
    const values: unknown[] = [];
    let idx = 1;

    if (updates.displayName !== undefined) {
      setClauses.push(`display_name = $${idx++}`);
      values.push(updates.displayName);
    }
    if (updates.brandOverrides !== undefined) {
      setClauses.push(`brand_overrides = $${idx++}`);
      values.push(JSON.stringify(updates.brandOverrides));
    }
    if (updates.profile !== undefined) {
      setClauses.push(`profile = $${idx++}`);
      values.push(updates.profile);
    }

    if (setClauses.length === 0) throw new Error('No fields to update');
    values.push(id);

    const { rows } = await this.client.query<Workspace>(
      `UPDATE workspace SET ${setClauses.join(', ')}
       WHERE id = $${idx} AND deleted_at IS NULL
       RETURNING id, slug, display_name AS "displayName",
                 brand_overrides AS "brandOverrides", profile,
                 created_at AS "createdAt", updated_at AS "updatedAt"`,
      values,
    );
    return rows[0];
  }

  async softDelete(id: string): Promise<void> {
    await this.client.query(
      `UPDATE workspace SET deleted_at = now() WHERE id = $1`,
      [id],
    );
  }
}

// ── WorkspaceMemberService ───────────────────────────────────────────

export class WorkspaceMemberService {
  constructor(private readonly client: Client) {}

  /** Cria um convite pendente para um usuário */
  async invite(params: {
    workspaceId: string;
    userId: string;
    roles?: string[];
  }): Promise<WorkspaceMember & { inviteToken: string }> {
    const inviteToken = crypto.randomBytes(32).toString('hex');
    const roles = params.roles ?? ['member'];

    const { rows } = await this.client.query<WorkspaceMember>(
      `INSERT INTO workspace_member (workspace_id, user_id, roles)
       VALUES ($1, $2, $3)
       RETURNING id, workspace_id AS "workspaceId", user_id AS "userId",
                 roles, invited_at AS "invitedAt", accepted_at AS "acceptedAt"`,
      [params.workspaceId, params.userId, roles],
    );

    return { ...rows[0], inviteToken };
  }

  /** Aceita um convite pendente */
  async accept(workspaceId: string, userId: string): Promise<void> {
    await this.client.query(
      `UPDATE workspace_member SET accepted_at = now()
       WHERE workspace_id = $1 AND user_id = $2 AND accepted_at IS NULL`,
      [workspaceId, userId],
    );
  }

  /** Atualiza os roles de um membro */
  async updateRoles(
    workspaceId: string,
    userId: string,
    roles: string[],
  ): Promise<void> {
    await this.client.query(
      `UPDATE workspace_member SET roles = $3
       WHERE workspace_id = $1 AND user_id = $2 AND deleted_at IS NULL`,
      [workspaceId, userId, roles],
    );
  }

  /** Remove membro (soft-delete) */
  async remove(workspaceId: string, userId: string): Promise<void> {
    await this.client.query(
      `UPDATE workspace_member SET deleted_at = now()
       WHERE workspace_id = $1 AND user_id = $2`,
      [workspaceId, userId],
    );
  }

  /** Lista membros ativos de um workspace */
  async listMembers(workspaceId: string): Promise<WorkspaceMember[]> {
    const { rows } = await this.client.query<WorkspaceMember>(
      `SELECT id, workspace_id AS "workspaceId", user_id AS "userId",
              roles, invited_at AS "invitedAt", accepted_at AS "acceptedAt"
       FROM workspace_member
       WHERE workspace_id = $1 AND deleted_at IS NULL
       ORDER BY invited_at`,
      [workspaceId],
    );
    return rows;
  }
}
