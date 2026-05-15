import { closeTestClient } from './fixtures';

/**
 * global-teardown.ts — Executado uma vez após todos os testes.
 */
export default async function globalTeardown() {
  await closeTestClient();
}
