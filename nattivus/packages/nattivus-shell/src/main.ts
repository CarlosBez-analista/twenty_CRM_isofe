import 'reflect-metadata';
import * as http from 'http';
import { Client } from 'pg';
import { createClient } from 'redis';

import { InMemoryKeyStore, JwtService } from './auth/jwt.service';
import { PasswordService } from './auth/password.service';
import { TotpService } from './auth/totp.service';
import { BackupCodeService } from './auth/backup-code.service';
import { UserService } from './auth/user.service';
import { RefreshTokenService } from './auth/refresh-token.service';

import { WorkspaceService, WorkspaceMemberService } from './workspace/workspace.service';
import { ModuleRegistryService } from './modules/module-registry.service';
import { ModuleDiscoveryService } from './modules/module-discovery.service';
import { ModuleActivationService } from './modules/module-activation.service';

import { VectorIndexRegistryService } from './semantic/vector-index-registry.service';
import { PgvectorStrategy } from './semantic/pgvector.strategy';
import { QdrantStrategy } from './semantic/qdrant.strategy';
import { SemanticSearchService } from './semantic/semantic-search.service';

import { AuditLogService } from './audit/audit-log.service';

/**
 * main.ts — Bootstrap do NattivusECO Shell.
 *
 * Sequência de inicialização:
 * 1. Conectar ao Postgres
 * 2. Conectar ao Redis
 * 3. Inicializar serviços (sem IoC container por ora — DI manual para portabilidade)
 * 4. Executar descoberta de módulos
 * 5. Subir servidor HTTP simples (NestJS completo na Fase 5)
 *
 * Ref: T058, ADR-0007
 */

async function bootstrap() {
  console.log('[nattivus] Starting NattivusECO Shell...');

  // ── Postgres ─────────────────────────────────────────────────────────
  const dbUrl = process.env['DATABASE_URL'];
  if (!dbUrl) throw new Error('DATABASE_URL is required');

  const dbClient = new Client({ connectionString: dbUrl });
  await dbClient.connect();
  console.log('[nattivus] Database connected');

  // ── Redis (opcional — não bloqueia boot se indisponível) ─────────────
  const redisUrl = process.env['REDIS_URL'] ?? 'redis://localhost:6379';
  const redis = createClient({ url: redisUrl });
  redis.on('error', (err) => console.warn('[nattivus] Redis error:', err.message));
  try {
    await redis.connect();
    console.log('[nattivus] Redis connected');
  } catch (err: any) {
    console.warn('[nattivus] Redis unavailable — continuing without cache:', err.message);
  }

  // ── JWT Key Store ────────────────────────────────────────────────────
  const keyStore = new InMemoryKeyStore();
  await keyStore.addKey('primary');
  const jwtService = new JwtService(keyStore);

  // ── Auth Services ────────────────────────────────────────────────────
  const passwordService = new PasswordService();
  const totpService = new TotpService();
  const backupCodeService = new BackupCodeService();
  const userService = new UserService(dbClient);
  const refreshTokenService = new RefreshTokenService(dbClient);

  // ── Workspace Services ───────────────────────────────────────────────
  const workspaceService = new WorkspaceService(dbClient);
  const workspaceMemberService = new WorkspaceMemberService(dbClient);

  // ── Module System ────────────────────────────────────────────────────
  const moduleRegistryService = new ModuleRegistryService(dbClient);
  const moduleActivationService = new ModuleActivationService(dbClient, moduleRegistryService);
  const moduleDiscoveryService = new ModuleDiscoveryService(moduleRegistryService);

  console.log('[nattivus] Running module discovery...');
  const discoveryResults = await moduleDiscoveryService.discoverAll();
  const registered = discoveryResults.filter((r) => r.status === 'registered');
  const failed = discoveryResults.filter((r) => r.status !== 'registered');

  console.log(`[nattivus] Modules discovered: ${registered.length} registered, ${failed.length} failed`);
  if (failed.length) {
    failed.forEach((r) =>
      console.warn(`[nattivus]   ⚠ ${r.moduleId}: ${r.status} — ${r.reason ?? ''}`),
    );
  }

  // ── Semantic Search ──────────────────────────────────────────────────
  const vectorRegistryService = new VectorIndexRegistryService(dbClient);
  const pgvectorStrategy = new PgvectorStrategy(dbClient);
  const qdrantStrategy = new QdrantStrategy({
    url: process.env['QDRANT_URL'] ?? 'http://localhost:6333',
    apiKey: process.env['QDRANT_API_KEY'],
  });
  const semanticSearchService = new SemanticSearchService(
    vectorRegistryService,
    pgvectorStrategy,
    qdrantStrategy,
  );

  // ── Audit Log ────────────────────────────────────────────────────────
  const auditLogService = new AuditLogService(dbClient);

  // ── HTTP Server (stub — NestJS app completo na Fase 5) ───────────────
  const port = parseInt(process.env['PORT'] ?? '3000', 10);
  const server = http.createServer((_req, res) => {
    // Health check mínimo para validação de container
    if (_req.url === '/health' && _req.method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'healthy', ts: new Date().toISOString() }));
      return;
    }
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ name: 'nattivus-shell', version: '0.0.1' }));
  });

  server.listen(port, () => {
    console.log(`[nattivus] Shell listening on port ${port}`);
    console.log(`[nattivus] Health: http://localhost:${port}/health`);
  });

  // ── Graceful shutdown ────────────────────────────────────────────────
  async function shutdown(signal: string) {
    console.log(`\n[nattivus] Received ${signal}, shutting down...`);
    server.close();
    await redis.quit().catch(() => {});
    await dbClient.end();
    console.log('[nattivus] Shutdown complete');
    process.exit(0);
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Expõe serviços no global para uso em testes de integração quando necessário
  (global as any).__nattivus = {
    dbClient, jwtService, keyStore,
    passwordService, totpService, backupCodeService,
    userService, refreshTokenService,
    workspaceService, workspaceMemberService,
    moduleRegistryService, moduleActivationService, moduleDiscoveryService,
    semanticSearchService, auditLogService,
  };

  console.log('[nattivus] Boot complete ✓');
}

bootstrap().catch((err) => {
  console.error('[nattivus] Fatal error during bootstrap:', err);
  process.exit(1);
});
