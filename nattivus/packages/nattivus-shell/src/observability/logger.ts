import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import pino from 'pino';

/**
 * T063: Logger Estruturado & Correlation ID Middleware
 *
 * Utiliza o pino para logging de alta performance em formato JSON,
 * adequando-se às necessidades de observabilidade da Fase 5.
 *
 * O middleware injeta e propaga `X-Request-Id` em toda a cadeia
 * da requisição, útil para rastrear a origem no AuditLog e em
 * debugs distribuídos.
 */

// Instância singleton do logger pino
export const logger = pino({
  level: process.env['LOG_LEVEL'] || 'info',
  formatters: {
    level: (label) => {
      return { level: label.toUpperCase() };
    },
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const headerName = 'X-Request-Id';
    let reqId = req.header(headerName);

    if (!reqId) {
      reqId = randomUUID();
      req.headers[headerName.toLowerCase()] = reqId; // para a aplicação ler
    }

    res.setHeader(headerName, reqId); // para o cliente receber de volta
    
    // Injeta no namespace ou no próprio req para uso subsequente
    (req as any).requestId = reqId;

    next();
  }
}
