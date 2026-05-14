import { Test, TestingModule } from '@nestjs/testing';
import { ErpModule } from './erp.module';

describe('ErpModule', () => {
  it('should compile the module', async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ErpModule],
    }).compile();

    expect(module).toBeDefined();
  });
});
