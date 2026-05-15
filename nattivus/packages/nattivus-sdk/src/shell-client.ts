/**
 * ShellClient — Interface para módulos acessarem serviços do shell.
 *
 * Módulos recebem uma instância via injeção de dependência (NestJS).
 * O shell implementa; o SDK apenas declara o contrato.
 *
 * Referência: _reversa_forward/001-fundacao-modular/interfaces/sdk-contract.md §5
 */

/** Resultado de busca semântica */
export interface SemanticSearchResult {
  id: string;
  score: number;
  payload: Record<string, unknown>;
}

/** Informações do workspace corrente */
export interface WorkspaceInfo {
  id: string;
  slug: string;
  displayName: string;
  profile: 'social' | 'enterprise' | 'both';
}

/** Informações do usuário corrente */
export interface UserInfo {
  id: string;
  email: string;
  roles: string[];
}

/** Contrato do cliente do shell exposto aos módulos */
export interface ShellClient {
  /**
   * Busca semântica unificada (pgvector ou Qdrant conforme coleção)
   */
  semanticSearch(params: {
    collection: string;
    query: number[];
    topK?: number;
    filter?: Record<string, unknown>;
  }): Promise<SemanticSearchResult[]>;

  /**
   * Registra entrada no audit log
   */
  audit(params: {
    action: string;
    entityType?: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
  }): Promise<void>;

  /**
   * Retorna informações do workspace corrente (do request context)
   */
  getCurrentWorkspace(): Promise<WorkspaceInfo>;

  /**
   * Retorna informações do usuário corrente (do request context)
   */
  getCurrentUser(): Promise<UserInfo>;
}
