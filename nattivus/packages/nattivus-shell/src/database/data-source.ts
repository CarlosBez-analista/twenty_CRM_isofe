import { DataSource, DataSourceOptions } from 'typeorm';
import * as path from 'path';
import * as fs from 'fs';

/**
 * DataSource para o NattivusECO Shell.
 *
 * - Carrega entidades do shell (auth, workspace, module registry)
 * - Descobre entidades de módulos instalados em packages/modules/
 * - Migrações SQL em /migrations/ (execução ordenada por nome de arquivo)
 *
 * Ref: data-delta.md §6 (carregamento dinâmico de entidades de módulos)
 */

const isProduction = process.env.NODE_ENV === 'production';

/** Descobre automaticamente entidades TypeORM de módulos instalados */
function discoverModuleEntities(): string[] {
  const modulesDir = path.resolve(__dirname, '../../modules');
  if (!fs.existsSync(modulesDir)) return [];

  const patterns: string[] = [];
  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.isDirectory()) {
      const entitiesGlob = path.join(modulesDir, entry.name, 'src', 'entities', '*.{ts,js}');
      patterns.push(entitiesGlob);
    }
  }
  return patterns;
}

const shellEntities = [
  path.join(__dirname, 'entities', '*.{ts,js}'),
];

const moduleEntities = discoverModuleEntities();

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  url: process.env.DATABASE_URL ?? 'postgresql://nattivus:nattivus@localhost:5432/nattivus_dev',
  entities: [...shellEntities, ...moduleEntities],
  migrations: [path.join(__dirname, '..', '..', 'migrations', '*.sql')],
  migrationsRun: false,
  synchronize: false,
  logging: isProduction ? ['error'] : ['query', 'error', 'warn'],
  ssl: isProduction ? { rejectUnauthorized: true } : false,
};

export const AppDataSource = new DataSource(dataSourceOptions);

export default AppDataSource;
