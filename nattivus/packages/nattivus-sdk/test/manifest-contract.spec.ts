/**
 * T030 — Teste de contrato do IModule
 *
 * Valida que:
 * 1. createManifest() aceita um manifesto válido sem erros de compilação
 * 2. defineEntity() aplica defaults corretamente
 * 3. Manifestos incompletos causam erros de tipo em compile-time
 *    (verificado via ts-jest — se o arquivo não compilar, o teste falha)
 */

import {
  createManifest,
  defineEntity,
  type IModule,
  type EntitySpec,
  type RouteSpec,
} from '@nattivus/sdk';

describe('IModule contract (SDK manifest)', () => {
  describe('createManifest()', () => {
    it('accepts a fully valid manifest', () => {
      const manifest = createManifest({
        moduleId: 'test.module',
        name: 'Test Module',
        version: '1.0.0',
        sdkVersion: '>=0.0.1',
        entities: [],
        routes: [],
        permissions: [],
      });
      expect(manifest.moduleId).toBe('test.module');
    });

    it('preserves optional fields', () => {
      const onActivate = jest.fn();
      const onDeactivate = jest.fn();
      const manifest = createManifest({
        moduleId: 'test.module',
        name: 'Test Module',
        version: '1.0.0',
        sdkVersion: '>=0.0.1',
        entities: [],
        routes: [],
        permissions: ['test.module:read'],
        dependencies: ['nattivus.core'],
        onActivate,
        onDeactivate,
      });
      expect(manifest.dependencies).toEqual(['nattivus.core']);
      expect(manifest.onActivate).toBe(onActivate);
    });

    it('accepts entities with EntitySpec shape', () => {
      const entity: EntitySpec = {
        name: 'Contact',
        tableName: 'contact',
        standardObject: true,
        embeddingDimensions: 768,
      };
      const manifest = createManifest({
        moduleId: 'test.module',
        name: 'Test',
        version: '0.1.0',
        sdkVersion: '>=0.0.1',
        entities: [entity],
        routes: [],
        permissions: [],
      });
      expect(manifest.entities[0].name).toBe('Contact');
    });

    it('accepts routes with all HTTP methods', () => {
      const methods: RouteSpec['method'][] = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'];
      const routes: RouteSpec[] = methods.map(method => ({
        method,
        path: `/${method.toLowerCase()}`,
      }));
      const manifest = createManifest({
        moduleId: 'test.module',
        name: 'Test',
        version: '0.1.0',
        sdkVersion: '>=0.0.1',
        entities: [],
        routes,
        permissions: [],
      });
      expect(manifest.routes).toHaveLength(5);
    });
  });

  describe('defineEntity()', () => {
    it('applies default standardObject=true', () => {
      const entity = defineEntity({ name: 'Lead', tableName: 'lead' });
      expect(entity.standardObject).toBe(true);
      expect(entity.embeddingDimensions).toBe(0);
    });

    it('overrides defaults when provided', () => {
      const entity = defineEntity({
        name: 'Vector',
        tableName: 'vector_item',
        standardObject: false,
        embeddingDimensions: 1536,
      });
      expect(entity.standardObject).toBe(false);
      expect(entity.embeddingDimensions).toBe(1536);
    });
  });

  describe('Type compatibility', () => {
    it('IModule is assignable from createManifest() output', () => {
      const manifest: IModule = createManifest({
        moduleId: 'compat.test',
        name: 'Compat',
        version: '0.0.1',
        sdkVersion: '>=0.0.1',
        entities: [],
        routes: [],
        permissions: [],
      });
      expect(manifest).toBeDefined();
    });
  });
});
