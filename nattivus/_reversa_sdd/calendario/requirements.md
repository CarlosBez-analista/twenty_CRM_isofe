# Calendário

> Requisitos funcionais e de negócio para o módulo de Calendário. Foca no QUE a unidade faz.

## Visão Geral
O módulo de Calendário é responsável pela sincronização, armazenamento e exibição de eventos provenientes de provedores externos (Google, Outlook). Ele permite que usuários visualizem compromissos vinculados a registros de CRM (Empresas, Pessoas, Oportunidades) e gerenciem a participação em eventos.

## Responsabilidades
- Sincronizar eventos de canais de calendário externos. 🟢
- Vincular automaticamente eventos a entidades do CRM com base nos participantes. 🟢
- Gerenciar o status de resposta dos participantes. 🟢
- Aplicar restrições de visibilidade para eventos privados. 🟢
- Filtrar eventos com base em uma lista de bloqueio (blocklist). 🟢

## Regras de Negócio
- Um canal de calendário deve ter um status de sincronização (`syncStatus`). 🟢
- Eventos marcados como privados só podem ser visualizados pelo proprietário ou participantes autorizados. 🟢
- Participantes são vinculados a `Person` ou `WorkspaceMember` via e-mail. 🟢
- Eventos de endereços na blocklist devem ser ignorados na sincronização. 🟢
- A sincronização é considerada obsoleta (`stale`) se não ocorrer dentro de um intervalo definido. 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Sincronização de eventos externos | Must | Eventos criados no Google/Outlook aparecem no CRM após o ciclo de sync. |
| RF-02 | Associação automática com CRM | Must | Evento com participante `pessoa@empresa.com` aparece na linha do tempo daquela Pessoa. |
| RF-03 | Gestão de visibilidade | Must | Usuários sem permissão não veem detalhes de eventos privados de terceiros. |
| RF-04 | Gestão de participantes | Should | O sistema deve atualizar o status de resposta (aceito, recusado, pendente) dos participantes. |
| RF-05 | Filtro de blocklist | Could | Domínios ou e-mails na blocklist não devem gerar eventos no CRM. |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Performance | Sincronização eficiente via processamento em lote (batch query) | `calendar-event.service.ts` | 🟢 |
| Segurança | Restrição de visibilidade em nível de consulta (query hook) | `apply-calendar-events-visibility-restrictions.service.ts` | 🟢 |
| Disponibilidade | Verificação de obsolescência de sincronização | `is-sync-stale.util.ts` | 🟢 |
| Escalabilidade | Uso de processamento assíncrono para vinculação de participantes | `calendar-event-participant-match-participant.job.ts` | 🟢 |

## Critérios de Aceitação

```gherkin
Dado que um usuário vinculou sua conta do Google Calendar
Quando um novo evento é criado no Google com um contato existente no CRM
Então o evento deve aparecer na Timeline do contato no Twenty CRM 🟢

Dado um evento marcado como "Privado" por um Workspace Member
Quando outro usuário tenta visualizar este evento na Timeline de uma Empresa vinculada
Então os detalhes do evento (título, descrição) devem ser omitidos ou ocultados 🟢

Dado um e-mail na blocklist do sistema
Quando um convite de calendário é recebido desse e-mail
Então o sistema não deve criar o registro de CalendarEvent correspondente 🟢
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Sincronização de eventos | Must | Funcionalidade principal de integração |
| Associação com CRM | Must | Valor central para o CRM (contexto de atividades) |
| Visibilidade de eventos | Must | Requisito crítico de privacidade e segurança |
| Status de resposta | Should | Importante para acompanhamento mas não impede a exibição |
| Blocklist | Could | Funcionalidade de conveniência para evitar ruído |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `calendar-event.workspace-entity.ts` | `CalendarEvent` | 🟢 |
| `calendar-channel.workspace-entity.ts` | `CalendarChannel` | 🟢 |
| `calendar-event.service.ts` | `CalendarEventService` | 🟢 |
| `calendar-event-participant.service.ts` | `CalendarEventParticipantService` | 🟢 |
| `apply-calendar-events-visibility-restrictions.service.ts` | `ApplyCalendarEventsVisibilityRestrictionsService` | 🟢 |
