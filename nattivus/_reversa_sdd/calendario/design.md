# Calendário, Design Técnico

> Especificação técnica de como o módulo de Calendário é construído no Twenty CRM.

## Interface

### Entidades (Workspace Entities)

| Entidade | Descrição | Principais Campos |
|----------|-----------|-------------------|
| `CalendarChannel` | Canal de conexão com o provedor (Google/Outlook) | `workspaceId`, `connectedAccountId`, `syncStatus`, `syncCursor` |
| `CalendarEvent` | Registro de um evento de calendário | `title`, `description`, `startsAt`, `endsAt`, `isFullDay`, `isPrivate`, `externalId` |
| `CalendarEventParticipant` | Associação entre um evento e um participante | `calendarEventId`, `email`, `displayName`, `status` (accepted, declined, etc.) |

### Serviços Principais

| Símbolo | Assinatura | Retorno | Observação |
|---------|-----------|---------|------------|
| `CalendarEventService.upsert` | `(data: FetchedCalendarEvent)` | `Promise<CalendarEvent>` | Cria ou atualiza evento vindo do sync externo |
| `ApplyCalendarEventsVisibilityRestrictionsService.apply` | `(query: SelectQueryBuilder)` | `void` | Aplica filtros de visibilidade na consulta SQL |
| `CalendarEventParticipantService.match` | `(participantId: string)` | `Promise<void>` | Tenta vincular participante a `Person` ou `WorkspaceMember` |

## Fluxo de Sincronização e Processamento
1. O worker de sincronização (fora desta unit) recupera eventos do provedor externo.
2. `CalendarEventService` realiza o **upsert** do evento, lidando com idempotência via `externalId`. 🟢
3. O sistema emite um evento de domínio indicando a criação/atualização do evento.
4. `calendar-event-participant.listener.ts` reage e dispara o processamento dos participantes. 🟢
5. `CalendarEventParticipantMatchParticipantJob` busca por e-mail correspondente nas tabelas de `Person` e `WorkspaceMember`. 🟢
6. Se encontrado, cria a associação que permite a exibição na Timeline do registro correspondente. 🟢

## Gestão de Visibilidade (Security)
- A classe `ApplyCalendarEventsVisibilityRestrictionsService` intercepta as queries de `findMany` e `findOne` via hooks do TypeORM/NestJS. 🟢
- Se o evento for `isPrivate = true`, a query é modificada para garantir que:
    - O `createdBy` seja o usuário logado, OU
    - O usuário logado esteja na lista de `participants` com status de acesso válido. 🟢

## Dependências
- `ConnectedAccount`: Para gerenciar tokens de acesso aos provedores externos. 🟢
- `Person`: Para vinculação de eventos à linha do tempo de contatos. 🟢
- `WorkspaceMember`: Para identificar o dono do calendário e participantes internos. 🟢
- `Timeline`: Consome eventos de calendário para exibição cronológica. 🟢

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| Hooks de Post-Query para visibilidade | `calendar-event-find-many.post-query.hook.ts` | 🟢 |
| Processamento assíncrono de participantes via jobs | `calendar-event-participant-match-participant.job.ts` | 🟢 |
| Utilização de QueryBuilder para injeção de segurança | `apply-calendar-events-visibility-restrictions.service.ts` | 🟢 |
| Idempotência baseada em `externalId` do provedor | `calendar-event-mapper.util.ts` | 🟡 |

## Observabilidade
- Logs de sincronização e falhas de conexão com provedores externos (esperados no `CalendarChannelSyncStatusService`). 🟡
- Rastreamento de execução de Jobs para processamento de participantes. 🟢

## Riscos e Lacunas
- 🔴 Lógica exata de como o `syncCursor` é atualizado para evitar duplicidade ou perda de eventos em falhas parciais.
- 🔴 Detalhes da integração com o provedor Microsoft Outlook (a maioria das evidências lidas foca em padrões genéricos ou Google).
