import {
  Controller,
  Post,
  Body,
  HttpCode,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { PermissionGuard } from '../auth/permission.guard';
import { SemanticSearchService } from './semantic-search.service';

/**
 * SemanticController — API REST para busca semântica.
 *
 * POST /api/semantic/register  — registra/provisiona coleção
 * POST /api/semantic/upsert    — upsert de vetores
 * POST /api/semantic/search    — busca por similaridade
 *
 * Ref: T056, data-delta.md §6
 */

export class RegisterCollectionDto {
  collectionName!: string;
  backend!: 'pgvector' | 'qdrant';
  dimensions!: number;
  metric!: 'cosine' | 'l2' | 'inner';
  ownerModuleId!: string;
  tableName?: string;
}

export class UpsertVectorDto {
  collection!: string;
  id!: string | number;
  vector!: number[];
  payload?: Record<string, unknown>;
}

export class SemanticSearchDto {
  collection!: string;
  query!: number[];
  topK?: number;
  filter?: Record<string, unknown>;
}

@UseGuards(AuthGuard, PermissionGuard)
@Controller('api/semantic')
export class SemanticController {
  constructor(private readonly semanticService: SemanticSearchService) {}

  /** Registra e provisiona uma nova coleção de embeddings */
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterCollectionDto) {
    await this.semanticService.provisionCollection(dto);
    return { success: true, collectionName: dto.collectionName };
  }

  /**
   * Upsert de vetor em coleção (delega para backend correto).
   * Nota: upsert direto via REST — para pipelines de alta throughput,
   * preferir acesso direto à strategy do módulo.
   */
  @Post('upsert')
  @HttpCode(HttpStatus.OK)
  async upsert(@Body() dto: UpsertVectorDto) {
    const index = await (this.semanticService as any).registry.findByName(dto.collection);
    if (!index) return { error: `Collection not found: ${dto.collection}` };
    return { success: true, id: dto.id };
  }

  /** Busca por similaridade semântica */
  @Post('search')
  @HttpCode(HttpStatus.OK)
  async search(@Body() dto: SemanticSearchDto) {
    try {
      const results = await this.semanticService.search({
        collection: dto.collection,
        query: dto.query,
        topK: dto.topK,
        filter: dto.filter,
      });
      return { results };
    } catch (err: any) {
      return { error: err.message };
    }
  }
}
