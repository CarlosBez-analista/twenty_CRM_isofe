/**
 * ModuleAdminResolver — Schema e resolvers GraphQL para gerenciamento de módulos.
 *
 * Queries:
 *   modules: [Module!]!       — lista todos os módulos ativos
 *   module(id: ID!): Module   — detalhe de um módulo
 *
 * Mutations:
 *   activateModule(input: ActivateModuleInput!): ModuleActivation!
 *   deactivateModule(input: DeactivateModuleInput!): Boolean!
 *
 * Nota: Usa SDL-first com strings de schema (sem NestJS GraphQL decorators)
 * para não forçar dependência de @nestjs/graphql na Fase 4.
 * O resolver real é registrado no AppModule via GraphQL plugin.
 *
 * Ref: T057
 */

export const moduleTypeDefs = /* GraphQL */ `
  type Module {
    id: ID!
    moduleId: String!
    version: String!
    disabledGlobally: Boolean!
    discoveredAt: String!
  }

  type ModuleActivation {
    id: ID!
    workspaceId: String!
    moduleId: String!
    activatedAt: String!
    activatedByUserId: String!
  }

  input ActivateModuleInput {
    workspaceId: String!
    moduleId: String!
    activatedByUserId: String!
    config: String
  }

  input DeactivateModuleInput {
    workspaceId: String!
    moduleId: String!
  }

  extend type Query {
    modules: [Module!]!
    module(id: ID!): Module
  }

  extend type Mutation {
    activateModule(input: ActivateModuleInput!): ModuleActivation!
    deactivateModule(input: DeactivateModuleInput!): Boolean!
  }
`;

import { ModuleRegistryService } from './module-registry.service';
import { ModuleActivationService } from './module-activation.service';

export class ModuleAdminResolver {
  constructor(
    private readonly registryService: ModuleRegistryService,
    private readonly activationService: ModuleActivationService,
  ) {}

  // ── Queries ──────────────────────────────────────────────────────────

  async modules() {
    return this.registryService.listActive();
  }

  async module(_: unknown, { id }: { id: string }) {
    return this.registryService.findById(id);
  }

  // ── Mutations ────────────────────────────────────────────────────────

  async activateModule(
    _: unknown,
    { input }: { input: {
      workspaceId: string;
      moduleId: string;
      activatedByUserId: string;
      config?: string;
    }},
  ) {
    const config = input.config ? JSON.parse(input.config) : {};
    return this.activationService.activate({ ...input, config });
  }

  async deactivateModule(
    _: unknown,
    { input }: { input: { workspaceId: string; moduleId: string } },
  ) {
    await this.activationService.deactivate(input);
    return true;
  }

  /** Mapa de resolvers compatível com graphql-js makeExecutableSchema */
  get resolverMap() {
    return {
      Query: {
        modules: () => this.modules(),
        module: (_: unknown, args: { id: string }) => this.module(_, args),
      },
      Mutation: {
        activateModule: (
          _: unknown,
          args: { input: Parameters<typeof this.activateModule>[1]['input'] },
        ) => this.activateModule(_, args),
        deactivateModule: (
          _: unknown,
          args: { input: Parameters<typeof this.deactivateModule>[1]['input'] },
        ) => this.deactivateModule(_, args),
      },
    };
  }
}
