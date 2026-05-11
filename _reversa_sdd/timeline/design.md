# Design: Linha do Tempo (Timeline)

Este documento descreve a arquitetura técnica e o fluxo de dados do módulo de Linha do Tempo.

## 🏗️ Arquitetura

O sistema baseia-se em um modelo de **Event-Driven Architecture (EDA)**. As atividades não são inseridas diretamente pelos módulos de negócio, mas sim capturadas através de eventos de banco de dados (`ObjectRecordBaseEvent`) e processadas pelo `TimelineActivityService`.

### Componentes Principais
- **TimelineActivityService**: Orquestrador que recebe lotes de eventos (`WorkspaceEventBatch`), analisa o metadado do objeto e decide como transformar o evento em um payload de timeline.
- **TimelineActivityRepository**: Responsável pelo `upsert` eficiente dos registros no banco de dados.
- **TimelineActivityWorkspaceEntity**: Entidade central que armazena os eventos. Possui campos de relação (`EntityRelation`) para todos os objetos padrão do sistema.

## 🗄️ Modelo de Dados

### TimelineActivityWorkspaceEntity
| Campo | Tipo | Descrição | Confiança |
|-------|------|-----------|-----------|
| `happensAt` | Date | Data/hora do evento | 🟢 |
| `name` | String | Nome identificador do tipo de evento (ex: `linked-note.created`) | 🟢 |
| `properties` | JSON | Dados variáveis do evento (diff de campos, valores antigos/novos) | 🟢 |
| `linkedRecordId` | UUID | ID do registro que gerou a atividade (ex: ID da Nota) | 🟢 |
| `linkedRecordCachedName` | String | Nome do registro no momento do evento | 🟢 |
| `workspaceMemberId` | UUID | ID do usuário que gerou a ação | 🟢 |
| `target*Id` | UUID | Chaves estrangeiras para Person, Company, Opportunity, etc. | 🟢 |

## 🔄 Fluxos de Dados

### 1. Processamento de Eventos (Upsert)
1. O `TimelineActivityService` recebe um `WorkspaceEventBatch`.
2. O serviço identifica o tipo de objeto (`note`, `task`, `noteTarget`, etc.).
3. Se for uma atividade direta (`note`, `task`):
   - Busca os alvos vinculados (ex: `noteTarget`).
   - Para cada alvo, cria um `TimelineActivityPayload`.
   - Extrai o título da atividade para o `linkedRecordCachedName`.
4. Se for um vínculo (`noteTarget`, `taskTarget`):
   - Identifica o objeto de origem e o destino.
   - Gera o payload para o objeto destino.
5. O `TimelineActivityRepository` realiza o `upsertTimelineActivities`, garantindo que eventos duplicados ou atualizações sejam tratados corretamente.

## 🧩 Integrações
- **Note Module**: Gera eventos de criação/edição de notas.
- **Task Module**: Gera eventos de criação/edição/status de tarefas.
- **Object Metadata**: Utilizado para resolver os nomes singulares e IDs de metadados dos objetos vinculados.

## 🛠️ Tecnologias
- **NestJS**: Framework do serviço.
- **TypeORM**: Mapeamento objeto-relacional.
- **GraphQL**: Exposição dos dados para o front-end (via repositório padrão).
