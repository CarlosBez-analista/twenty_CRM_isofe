import { cleanDatabase } from './fixtures';

/** Limpa o banco antes de cada test suite */
beforeEach(async () => {
  await cleanDatabase();
});
