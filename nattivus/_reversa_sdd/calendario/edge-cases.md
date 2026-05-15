# Calendário, Casos de Borda (Edge Cases)

> Documentação de comportamentos extremos e exceções identificados no módulo de Calendário.

## 1. Conflito de Participantes Duplicados
- **Cenário:** Um evento é sincronizado onde um participante possui múltiplos e-mails que apontam para a mesma `Person` no CRM, ou múltiplos participantes possuem o mesmo e-mail.
- **Comportamento Esperado:** O sistema deve garantir a unicidade da associação na Timeline. A lógica em `calendar-event-participant-match-participant.job.ts` deve priorizar a correspondência exata de e-mail e evitar a criação de duplicatas na tabela de junção. 🟡

## 2. Eventos de Dia Inteiro vs. Fusos Horários
- **Cenário:** Eventos marcados como `isFullDay = true` sincronizados entre usuários em fusos horários diferentes.
- **Comportamento Esperado:** O sistema deve armazenar datas de dia inteiro sem componente de tempo (ou fixado em 00:00:00 UTC) para evitar que o evento "salte" de dia dependendo do fuso horário de quem visualiza. Evidências em `calendar-event-mapper.util.ts`. 🟡

## 3. Revogação de Token durante Sincronização
- **Cenário:** O usuário revoga a permissão do Google/Outlook enquanto um Job de sincronização longa está em andamento.
- **Comportamento Esperado:** O `CalendarChannelSyncStatusService` deve capturar o erro de autenticação (401 Unauthorized), marcar o `syncStatus` como `FAILED` ou `AUTH_ERROR` e suspender tentativas futuras até a reautenticação. 🟢

## 4. Eventos Recorrentes com Exceções
- **Cenário:** Uma série de eventos recorrentes onde uma ocorrência específica foi modificada ou cancelada no provedor externo.
- **Comportamento Esperado:** O Twenty CRM deve tratar cada exceção como um registro `CalendarEvent` distinto vinculado à série original via um identificador de recorrência, ou atualizar apenas a ocorrência específica se ela já existir no banco. 🔴 (Requer validação da lógica de persistência de recorrência).
