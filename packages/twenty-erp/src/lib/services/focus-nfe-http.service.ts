import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class FocusNfeHttpService {
  private readonly logger = new Logger(FocusNfeHttpService.name);

  private async applyHttpInterceptor<T>(operation: string, requestFn: () => Promise<T>): Promise<T> {
    this.logger.log(`[AUDIT] HTTP Interceptor - Iniciando chamada para: ${operation}`);
    const start = Date.now();
    try {
      const result = await requestFn();
      const duration = Date.now() - start;
      this.logger.log(`[AUDIT] HTTP Interceptor - Sucesso em ${operation} (${duration}ms)`);
      return result;
    } catch (error) {
      const duration = Date.now() - start;
      this.logger.error(`[AUDIT] HTTP Interceptor - Falha em ${operation} (${duration}ms):`, error);
      throw error;
    }
  }

  async emitirNfe(payload: any): Promise<any> {
    return this.applyHttpInterceptor('Focus API - Emitir NFe', async () => {
      this.logger.log(`Enviando NF-e para Focus: ${JSON.stringify(payload)}`);
      // Mock HTTP request
      const mockResponse = {
        status: 202,
        referencia: payload.ref || 'mock-ref-123'
      };
      this.logger.log(`Resposta Focus NF-e: ${JSON.stringify(mockResponse)}`);
      return mockResponse;
    });
  }
}
