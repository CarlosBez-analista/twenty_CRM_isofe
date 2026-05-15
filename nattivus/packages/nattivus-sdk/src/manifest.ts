/**
 * Contratos de manifesto de módulo NattivusECO.
 *
 * Cada módulo exporta um objeto que satisfaz IModule via createManifest().
 * O shell valida o shape no startup (discovery) e registra no module_registry.
 *
 * Referência: _reversa_forward/001-fundacao-modular/interfaces/sdk-contract.md
 */

/**
 * Referência virtual a uma entidade de outro módulo.
 *
 * Não cria FK no banco — o shell valida existência em nível de aplicação.
 * Decisão T001: módulos independentes, sem acoplamento de schema. Ver ADR-0007.
 */
export interface ModuleRef {
  /** moduleId do módulo alvo */
  moduleId: string;
  /** Nome da entidade alvo (PascalCase) */
  entityName: string;
}

/** Especificação de uma entidade exposta pelo módulo */
export interface EntitySpec {
  /** Nome da entidade (PascalCase) */
  name: string;
  /** Nome da tabela no banco */
  tableName: string;
  /** Se true, herda BaseEntity (workspaceId, soft-delete, etc.) */
  standardObject: boolean;
  /** Dimensão do vetor de embedding (0 = sem embedding) */
  embeddingDimensions?: number;
  /**
   * Referências virtuais a entidades de outros módulos.
   * Declaradas aqui para documentação e validação em aplicação;
   * nunca geram FK no banco.
   */
  references?: ModuleRef[];
}

/** Especificação de uma rota REST exposta pelo módulo */
export interface RouteSpec {
  /** Método HTTP */
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  /** Path relativo ao prefixo do módulo */
  path: string;
  /** Descrição para documentação */
  description?: string;
  /** Permissões necessárias (referência a PermissionFlag) */
  permissions?: string[];
  /** Nome do handler no controller (ex: 'CompanyController.findAll') */
  handler?: string;
}

/**
 * Especificação de uma operação GraphQL exposta pelo módulo.
 *
 * Decisão T002: abordagem híbrida REST+GraphQL.
 * REST — integrações externas e CRUD simples.
 * GraphQL — queries complexas com filtros e dados relacionados.
 */
export interface GraphQLOperationSpec {
  /** 'query' | 'mutation' | 'subscription' */
  kind: 'query' | 'mutation' | 'subscription';
  /** Nome da operação no schema GraphQL */
  operationName: string;
  /** Descrição para documentação */
  description?: string;
  /** Permissões necessárias */
  permissions?: string[];
}

/** Contrato principal de um módulo NattivusECO */
export interface IModule {
  /** Identificador único do módulo (ex: 'nattivus.crm.core') */
  moduleId: string;
  /** Nome legível */
  name: string;
  /** Versão SemVer do módulo */
  version: string;
  /** Range SemVer do SDK suportado */
  sdkVersion: string;
  /** Entidades declaradas */
  entities: EntitySpec[];
  /** Rotas REST declaradas */
  routes: RouteSpec[];
  /** Operações GraphQL declaradas (opcional — T002) */
  graphqlOperations?: GraphQLOperationSpec[];
  /** Permissões declaradas pelo módulo */
  permissions: string[];
  /** Dependências de outros módulos (moduleId[]) */
  dependencies?: string[];
  /** Callback executado na ativação do módulo no workspace */
  onActivate?: (context: { workspaceId: string }) => Promise<void>;
  /** Callback executado na desativação */
  onDeactivate?: (context: { workspaceId: string }) => Promise<void>;
}

/** Alias para retrocompatibilidade e clareza */
export type IModuleManifest = IModule;

/**
 * Helper type-safe para criar um manifesto de módulo.
 * Garante que o objeto satisfaz IModule em compile-time.
 */
export function createManifest(manifest: IModule): IModule {
  return manifest;
}

/**
 * Helper para declarar uma entidade com defaults sensatos.
 */
export function defineEntity(spec: Partial<EntitySpec> & Pick<EntitySpec, 'name' | 'tableName'>): EntitySpec {
  return {
    standardObject: true,
    embeddingDimensions: 0,
    ...spec,
  };
}
