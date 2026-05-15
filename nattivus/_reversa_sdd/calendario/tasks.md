# Calendário, Tarefas de Implementação

> Lista de tarefas para reconstrução do módulo de Calendário com base nas evidências do sistema legado.

## Pré-requisitos
- [ ] Entidades de base (`Workspace`, `WorkspaceMember`, `Person`) implementadas.
- [ ] Infraestrutura de Mensageria e Jobs configurada.
- [ ] Integração com Provedores Externos (`ConnectedAccount`) funcional.

## Tarefas

- [ ] T-01, Implementar Entidades de Dados do Calendário
  - Origem no legado: `packages/twenty-server/src/modules/calendar/common/standard-objects/`
  - Critério de pronto: Entidades `CalendarChannel`, `CalendarEvent` e `CalendarEventParticipant` persistindo no banco.
  - Confiança: 🟢

- [ ] T-02, Implementar Lógica de Upsert de Eventos
  - Origem no legado: `packages/twenty-server/src/modules/calendar/common/services/calendar-event.service.ts`
  - Critério de pronto: Dados brutos de provedores externos são convertidos e persistidos sem duplicidade (via `externalId`).
  - Confiança: 🟢

- [ ] T-03, Implementar Vinculação Assíncrona de Participantes
  - Origem no legado: `packages/twenty-server/src/modules/calendar/calendar-event-participant-manager/`
  - Critério de pronto: Job `match-participant` associa e-mails de participantes a Pessoas e Membros do Workspace existentes.
  - Confiança: 🟢

- [ ] T-04, Implementar Restrições de Visibilidade (Security Hooks)
  - Origem no legado: `packages/twenty-server/src/modules/calendar/common/query-hooks/calendar-event/`
  - Critério de pronto: Consultas SQL de eventos aplicam filtros baseados em `isPrivate` e permissões do usuário logado.
  - Confiança: 🟢

- [ ] T-05, Implementar Filtro de Blocklist
  - Origem no legado: `packages/twenty-server/src/modules/calendar/common/utils/filter-out-blocklisted-events.util.ts`
  - Critério de pronto: Eventos de remetentes bloqueados são descartados antes da persistência.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Testar fluxo fim-a-fim de sincronização de evento (Google -> CRM -> Timeline).
- [ ] TT-02, Validar que eventos privados não vazam para usuários não autorizados em listagens.
- [ ] TT-03, Testar vinculação de participante quando o e-mail não existe no CRM (deve permanecer como e-mail puro).

## Ordem Sugerida
1. **Infra (T-01)**: Base de dados é necessária para qualquer outra operação.
2. **Serviços de Dados (T-02, T-05)**: Preparar a camada de persistência com regras de filtro.
3. **Inteligência e Associação (T-03)**: Processar as relações após os dados base estarem salvos.
4. **Segurança (T-04)**: Camada final de controle de acesso para garantir privacidade.

## Lacunas Pendentes (🔴)
- Definir o tempo de expiração para o status `stale` da sincronização.
- Especificar o formato exato dos payloads recebidos dos webhooks de Google e Outlook.
