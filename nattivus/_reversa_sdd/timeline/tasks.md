# Tarefas Técnicas: Linha do Tempo (Timeline)

Este documento lista as tarefas necessárias para a reconstrução ou manutenção do módulo de Linha do Tempo, baseadas na análise do sistema legado.

## 📋 Lista de Tarefas

### 1. Infraestrutura e Entidade
- [ ] **T-01: Criar Entidade `TimelineActivity`**
  - Implementar `TimelineActivityWorkspaceEntity` com todos os campos de relação (`targetPerson`, `targetCompany`, etc.).
  - Definir campos de auditoria (`happensAt`, `workspaceMemberId`).
  - Origem: `packages/twenty-server/src/modules/timeline/standard-objects/timeline-activity.workspace-entity.ts`
  - Confiança: 🟢

### 2. Lógica de Negócio (Serviços)
- [ ] **T-02: Implementar Orquestrador de Eventos**
  - Criar `TimelineActivityService` com método `upsertEvents`.
  - Implementar lógica de transformação de eventos (`transformEventsToTimelineActivityPayloads`).
  - Origem: `packages/twenty-server/src/modules/timeline/services/timeline-activity.service.ts`
  - Confiança: 🟢

- [ ] **T-03: Implementar Resolução de Alvos (Targets)**
  - Implementar métodos privados para lidar com `noteTarget` e `taskTarget`.
  - Garantir que a atividade seja propagada para todos os objetos vinculados.
  - Origem: `packages/twenty-server/src/modules/timeline/services/timeline-activity.service.ts`
  - Confiança: 🟢

### 3. Repositório e Performance
- [ ] **T-04: Criar Repositório Customizado**
  - Implementar `TimelineActivityRepository` com lógica de `upsert` em lote.
  - Otimizar consultas para evitar N+1 ao buscar alvos.
  - Origem: `packages/twenty-server/src/modules/timeline/repositories/timeline-activity.repository.ts`
  - Confiança: 🟢

### 4. Integração e Gatilhos
- [ ] **T-05: Configurar EventEmitter**
  - Vincular o processamento da Timeline aos eventos de banco de dados globais.
  - Garantir que mudanças em `note` e `task` disparem a atualização.
  - Confiança: 🟡 (Inferido pela arquitetura NestJS do sistema).

## 🚩 Definição de Pronto (DoD)
- Entidade persistida no banco de dados com migrações correspondentes.
- Testes de integração validando que a criação de uma Nota gera um registro na TimelineActivity.
- Performance validada para processamento de eventos em lote.
