import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@nattivus/shared';

/**
 * HelloMessage — Entidade de demonstração do módulo hello-world.
 *
 * Demonstra:
 * - Extensão de BaseEntity (auditoria automática)
 * - Campos específicos do módulo
 * - Workspace-scoped (workspace_id herdado da BaseEntity)
 *
 * Ref: T059, packages/modules/hello-world/README.md
 */
@Entity({ name: 'hello_message', schema: 'public' })
export class HelloMessage extends BaseEntity {
  @Column({ type: 'text' })
  content!: string;

  @Column({ name: 'author_id', type: 'uuid' })
  authorId!: string;

  @Column({ name: 'workspace_id', type: 'uuid' })
  workspaceId!: string;
}
