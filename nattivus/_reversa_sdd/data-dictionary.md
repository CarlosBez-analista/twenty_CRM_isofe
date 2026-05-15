# Dicionário de Dados — Legado

Este documento descreve as entidades, campos e relacionamentos identificados no sistema legado.

---

## Módulo: Company

### Entidade: `Company` (Standard Object)
Representa uma empresa ou organização no CRM.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | Identificador único universal. | 🟢 |
| `createdAt` | `DateTime` | `timestamp` | ✅ | Data de criação do registro. | 🟢 |
| `updatedAt` | `DateTime` | `timestamp` | ✅ | Data da última atualização. | 🟢 |
| `deletedAt` | `DateTime` | `timestamp` | ❌ | Data de exclusão (soft-delete). | 🟢 |
| `name` | `TEXT` | `varchar` | ❌ | Nome da empresa. | 🟢 |
| `domainName` | `LINKS` | `jsonb` | ✅ | URLs e domínio principal da empresa. | 🟢 |
| `employees` | `NUMBER` | `integer` | ❌ | Quantidade de funcionários. | 🟢 |
| `linkedinLink` | `LINKS` | `jsonb` | ❌ | Link para perfil no LinkedIn. | 🟢 |
| `xLink` | `LINKS` | `jsonb` | ❌ | Link para perfil no X (Twitter). | 🟢 |
| `annualRecurringRevenue` | `CURRENCY` | `jsonb` | ❌ | Receita recorrente anual (ARR). | 🟢 |
| `address` | `ADDRESS` | `jsonb` | ✅ | Endereço completo. | 🟢 |
| `idealCustomerProfile` | `BOOLEAN` | `boolean` | ✅ | Indica se a empresa se encaixa no ICP. | 🟢 |
| `position` | `NUMBER` | `integer` | ✅ | Ordem de exibição/criação. | 🟢 |
| `createdBy` | `ACTOR` | `jsonb` | ✅ | Dados do usuário/sistema que criou. | 🟢 |
| `updatedBy` | `ACTOR` | `jsonb` | ✅ | Dados do usuário/sistema que atualizou. | 🟢 |
| `searchVector` | `TSVECTOR` | `tsvector` | ✅ | Vetor de busca textual. | 🟢 |

### Relacionamentos (Company)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Company` | 1:N | `Person` | `people` | Contatos associados à empresa. |
| `Company` | N:1 | `WorkspaceMember` | `accountOwner` | Usuário responsável pela conta. |
| `Company` | 1:N | `Opportunity` | `opportunities` | Oportunidades de negócio vinculadas. |
| `Company` | 1:N | `Task` | `taskTargets` | Tarefas relacionadas à empresa. |
| `Company` | 1:N | `Note` | `noteTargets` | Notas e anotações. |
| `Company` | 1:N | `Attachment` | `attachments` | Arquivos anexados. |
| `Company` | 1:N | `TimelineActivity` | `timelineActivities` | Histórico de atividades. |

---

## Módulo: Person

### Entidade: `Person` (Standard Object)
Representa um indivíduo ou contato no CRM.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | Identificador único universal. | 🟢 |
| `createdAt` | `DateTime` | `timestamp` | ✅ | Data de criação do registro. | 🟢 |
| `updatedAt` | `DateTime` | `timestamp` | ✅ | Data da última atualização. | 🟢 |
| `deletedAt` | `DateTime` | `timestamp` | ❌ | Data de exclusão (soft-delete). | 🟢 |
| `name` | `FULL_NAME` | `jsonb` | ❌ | Nome e sobrenome do contato. | 🟢 |
| `emails` | `EMAILS` | `jsonb` | ✅ | E-mail primário e lista de secundários. | 🟢 |
| `linkedinLink` | `LINKS` | `jsonb` | ❌ | Link para perfil no LinkedIn. | 🟢 |
| `xLink` | `LINKS` | `jsonb` | ❌ | Link para perfil no X (Twitter). | 🟢 |
| `jobTitle` | `TEXT` | `varchar` | ❌ | Cargo ou função. | 🟢 |
| `phones` | `PHONES` | `jsonb` | ❌ | Lista de números de telefone. | 🟢 |
| `city` | `TEXT` | `varchar` | ❌ | Cidade de residência/trabalho. | 🟢 |
| `avatarFile` | `FILE` | `jsonb` | ❌ | Referência ao arquivo de avatar. | 🟢 |
| `position` | `NUMBER` | `integer` | ✅ | Ordem de exibição/criação. | 🟢 |
| `createdBy` | `ACTOR` | `jsonb` | ✅ | Dados do usuário/sistema que criou. | 🟢 |
| `updatedBy` | `ACTOR` | `jsonb` | ✅ | Dados do usuário/sistema que atualizou. | 🟢 |
| `companyId` | `UUID` | `uuid` | ❌ | ID da empresa vinculada. | 🟢 |
| `searchVector` | `TSVECTOR` | `tsvector` | ✅ | Vetor de busca textual. | 🟢 |

### Relacionamentos (Person)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Person` | N:1 | `Company` | `company` | Empresa à qual o contato pertence. |
| `Person` | 1:N | `Opportunity` | `pointOfContactForOpportunities` | Oportunidades onde é o ponto de contato. |
| `Person` | 1:N | `Task` | `taskTargets` | Tarefas relacionadas ao contato. |
| `Person` | 1:N | `Note` | `noteTargets` | Notas e anotações. |
| `Person` | 1:N | `Attachment` | `attachments` | Arquivos anexados. |
| `Person` | 1:N | `MessageParticipant` | `messageParticipants` | Participação em mensagens/e-mails. |
| `Person` | 1:N | `CalendarEventParticipant` | `calendarEventParticipants` | Participação em eventos de calendário. |
| `Person` | 1:N | `TimelineActivity` | `timelineActivities` | Histórico de atividades. |

---
---

## Módulo: Opportunity

### Entidade: `Opportunity` (Standard Object)
Representa uma oportunidade de negócio ou venda no CRM.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | Identificador único universal. | 🟢 |
| `createdAt` | `DateTime` | `timestamp` | ✅ | Data de criação do registro. | 🟢 |
| `updatedAt` | `DateTime` | `timestamp` | ✅ | Data da última atualização. | 🟢 |
| `deletedAt` | `DateTime` | `timestamp` | ❌ | Data de exclusão (soft-delete). | 🟢 |
| `name` | `TEXT` | `varchar` | ❌ | Nome da oportunidade. | 🟢 |
| `amount` | `CURRENCY` | `jsonb` | ❌ | Valor da oportunidade (valor + moeda). | 🟢 |
| `closeDate` | `DATE_TIME` | `timestamp` | ❌ | Data prevista para fechamento. | 🟢 |
| `stage` | `SELECT` | `varchar` | ✅ | Estágio do funil (NEW, SCREENING, etc). | 🟢 |
| `position` | `NUMBER` | `integer` | ✅ | Ordem de exibição. | 🟢 |
| `createdBy` | `ACTOR` | `jsonb` | ✅ | Dados do criador. | 🟢 |
| `updatedBy` | `ACTOR` | `jsonb` | ✅ | Dados de quem atualizou. | 🟢 |
| `pointOfContactId` | `UUID` | `uuid` | ❌ | ID do contato principal. | 🟢 |
| `companyId` | `UUID` | `uuid` | ❌ | ID da empresa vinculada. | 🟢 |
| `ownerId` | `UUID` | `uuid` | ❌ | ID do dono da oportunidade. | 🟢 |
| `searchVector` | `TSVECTOR` | `tsvector` | ✅ | Vetor de busca textual. | 🟢 |

### Relacionamentos (Opportunity)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Opportunity` | N:1 | `Person` | `pointOfContact` | Pessoa que é o ponto de contato. |
| `Opportunity` | N:1 | `Company` | `company` | Empresa vinculada à oportunidade. |
| `Opportunity` | N:1 | `WorkspaceMember` | `owner` | Membro do workspace dono da conta. |
| `Opportunity` | 1:N | `Task` | `taskTargets` | Tarefas vinculadas. |
| `Opportunity` | 1:N | `Note` | `noteTargets` | Notas vinculadas. |
| `Opportunity` | 1:N | `Attachment` | `attachments` | Anexos vinculados. |
| `Opportunity` | 1:N | `TimelineActivity` | `timelineActivities` | Histórico de atividades. |

---

## Módulo: Task

### Entidade: `Task` (Standard Object)
Representa uma tarefa, lembrete ou item de checklist.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | Identificador único universal. | 🟢 |
| `createdAt` | `DateTime` | `timestamp` | ✅ | Data de criação. | 🟢 |
| `updatedAt` | `DateTime` | `timestamp` | ✅ | Última atualização. | 🟢 |
| `deletedAt` | `DateTime` | `timestamp` | ❌ | Data de exclusão. | 🟢 |
| `title` | `TEXT` | `varchar` | ❌ | Título da tarefa. | 🟢 |
| `bodyV2` | `RICH_TEXT` | `jsonb` | ❌ | Conteúdo detalhado da tarefa. | 🟢 |
| `dueAt` | `DATE_TIME` | `timestamp` | ❌ | Prazo para conclusão. | 🟢 |
| `status` | `SELECT` | `varchar` | ✅ | Status (`TODO`, `IN_PROGRESS`, `DONE`). | 🟢 |
| `position` | `POSITION` | `integer` | ✅ | Ordem de exibição. | 🟢 |
| `assigneeId` | `UUID` | `uuid` | ❌ | ID do responsável pela tarefa. | 🟢 |
| `createdBy` | `ACTOR` | `jsonb` | ✅ | Dados do criador. | 🟢 |
| `updatedBy` | `ACTOR` | `jsonb` | ✅ | Dados de quem atualizou. | 🟢 |
| `searchVector` | `TSVECTOR` | `tsvector` | ✅ | Vetor de busca textual. | 🟢 |

### Entidade: `TaskTarget` (Standard Object - Link)
Entidade de ligação polimórfica que conecta tarefas a outros objetos.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID do vínculo. | 🟢 |
| `taskId` | `UUID` | `uuid` | ✅ | ID da tarefa pai. | 🟢 |
| `targetPersonId` | `UUID` | `uuid` | ❌ | ID do contato alvo. | 🟢 |
| `targetCompanyId` | `UUID` | `uuid` | ❌ | ID da empresa alvo. | 🟢 |
| `targetOpportunityId` | `UUID` | `uuid` | ❌ | ID da oportunidade alvo. | 🟢 |

### Relacionamentos (Task)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Task` | N:1 | `WorkspaceMember` | `assignee` | Usuário responsável pela execução. |
| `Task` | 1:N | `TaskTarget` | `taskTargets` | Vínculos com outros objetos do sistema. |
| `Task` | 1:N | `Attachment` | `attachments` | Arquivos anexados à tarefa. |
| `Task` | 1:N | `TimelineActivity` | `timelineActivities` | Registro na linha do tempo. |

---

## Módulo: Workflow

### Entidade: `Workflow` (Standard Object)
Define a estrutura básica de um fluxo de automação.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID único do workflow. | 🟢 |
| `name` | `TEXT` | `varchar` | ❌ | Nome amigável do workflow. | 🟢 |
| `statuses` | `ARRAY` | `jsonb` | ❌ | Lista de status (DRAFT, ACTIVE, etc). | 🟢 |
| `lastPublishedVersionId` | `UUID` | `uuid` | ❌ | ID da última versão publicada. | 🟢 |
| `position` | `NUMBER` | `integer` | ✅ | Ordem de exibição. | 🟢 |
| `searchVector` | `TSVECTOR` | `tsvector` | ✅ | Vetor de busca. | 🟢 |

### Entidade: `WorkflowVersion` (Standard Object)
Versão específica de um workflow, contendo o grafo de execução.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID da versão. | 🟢 |
| `name` | `TEXT` | `varchar` | ❌ | Nome da versão. | 🟢 |
| `trigger` | `JSON` | `jsonb` | ❌ | Definição do gatilho (Trigger). | 🟡 |
| `steps` | `JSON` | `jsonb` | ❌ | Lista de passos e conexões (Grafo). | 🔴 |
| `status` | `SELECT` | `varchar` | ✅ | Status da versão. | 🟢 |
| `workflowId` | `UUID` | `uuid` | ✅ | ID do workflow pai. | 🟢 |

### Entidade: `WorkflowRun` (Standard Object)
Instância de execução de um workflow.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID da execução. | 🟢 |
| `status` | `SELECT` | `varchar` | ✅ | Status (ENQUEUED, RUNNING, etc). | 🟢 |
| `enqueuedAt` | `DateTime` | `timestamp` | ❌ | Data de enfileiramento. | 🟢 |
| `startedAt` | `DateTime` | `timestamp` | ❌ | Data de início real. | 🟢 |
| `endedAt` | `DateTime` | `timestamp` | ❌ | Data de término. | 🟢 |
| `state` | `JSON` | `jsonb` | ✅ | Estado completo da execução (Outputs). | 🔴 |
| `workflowVersionId` | `UUID` | `uuid` | ✅ | Versão executada. | 🟢 |

### Entidade: `WorkflowAutomatedTrigger` (Standard Object)
Configuração de gatilhos automáticos (DB/Cron).

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID do gatilho. | 🟢 |
| `type` | `SELECT` | `varchar` | ✅ | Tipo (DATABASE_EVENT, CRON). | 🟢 |
| `settings` | `JSON` | `jsonb` | ✅ | Configurações específicas do tipo. | 🟡 |
| `workflowId` | `UUID` | `uuid` | ✅ | Workflow associado. | 🟢 |

### Relacionamentos (Workflow)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Workflow` | 1:N | `WorkflowVersion` | `versions` | Versões do workflow. |
| `Workflow` | 1:N | `WorkflowRun` | `runs` | Histórico de execuções. |
| `Workflow` | 1:N | `WorkflowAutomatedTrigger` | `automatedTriggers` | Gatilhos configurados. |
| `WorkflowVersion` | 1:N | `WorkflowRun` | `runs` | Execuções desta versão. |

---

## Módulo: Messaging

### Entidade: `Message` (Standard Object)
Representa um e-mail ou mensagem individual.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID único da mensagem. | 🟢 |
| `headerMessageId` | `TEXT` | `varchar` | ❌ | ID original do cabeçalho do e-mail. | 🟢 |
| `subject` | `TEXT` | `varchar` | ❌ | Assunto da mensagem. | 🟢 |
| `text` | `TEXT` | `text` | ❌ | Conteúdo em texto plano. | 🟡 |
| `receivedAt` | `DateTime` | `timestamp` | ❌ | Data de recebimento. | 🟢 |
| `messageThreadId` | `UUID` | `uuid` | ❌ | ID da thread associada. | 🟢 |

### Entidade: `MessageThread` (Standard Object)
Agrupamento lógico de mensagens relacionadas.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID da thread. | 🟢 |
| `subject` | `TEXT` | `varchar` | ❌ | Assunto consolidado da thread. | 🟢 |

### Entidade: `MessageParticipant` (Standard Object)
Indivíduos envolvidos em uma mensagem (De, Para, CC, Cco).

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID do participante. | 🟢 |
| `role` | `SELECT` | `varchar` | ✅ | Papel (FROM, TO, CC, BCC). | 🟢 |
| `handle` | `TEXT` | `varchar` | ❌ | Endereço de e-mail. | 🟢 |
| `displayName` | `TEXT` | `varchar` | ❌ | Nome de exibição. | 🟢 |
| `messageId` | `UUID` | `uuid` | ✅ | ID da mensagem vinculada. | 🟢 |
| `personId` | `UUID` | `uuid` | ❌ | Vínculo opcional com `Person`. | 🟢 |
| `workspaceMemberId` | `UUID` | `uuid` | ❌ | Vínculo opcional com membro do workspace. | 🟢 |

### Entidade: `MessageChannel` (Standard Object)
Configuração de sincronização de uma conta de e-mail.

| Campo | Tipo Legado | Tipo Físico (DB) | Obrigatório | Descrição | Escala |
|-------|-------------|------------------|:-----------:|-----------|:------:|
| `id` | `UUID` | `uuid` | ✅ | ID do canal. | 🟢 |
| `handle` | `TEXT` | `varchar` | ❌ | E-mail da conta conectada. | 🟢 |
| `type` | `SELECT` | `varchar` | ✅ | Tipo (GMAIL, MICROSOFT, IMAP). | 🟢 |
| `syncStatus` | `SELECT` | `varchar` | ❌ | Status da sincronização. | 🟢 |
| `syncStage` | `SELECT` | `varchar` | ✅ | Estágio atual (FETCH, IMPORT, etc). | 🟢 |
| `syncedAt` | `DateTime` | `timestamp` | ❌ | Data da última sincronização bem-sucedida. | 🟢 |
| `connectedAccountId` | `UUID` | `uuid` | ✅ | ID da conta conectada original. | 🟢 |

### Relacionamentos (Messaging)

| `Message` | N:1 | `MessageThread` | `messageThread` | Thread à qual a mensagem pertence. |
| `Message` | 1:N | `MessageParticipant` | `messageParticipants` | Lista de destinatários e remetente. |
| `MessageParticipant` | N:1 | `Person` | `person` | Referência ao contato no CRM. |
| `MessageParticipant` | N:1 | `WorkspaceMember` | `workspaceMember` | Referência ao usuário interno. |
| `MessageChannel` | N:1 | `ConnectedAccount` | `connectedAccount` | Configuração de auth do canal. |
| `MessageChannel` | 1:N | `MessageFolder` | `messageFolders` | Pastas monitoradas pelo canal. |

---

## Módulo: Calendar

### Entidade: `CalendarChannel`
Representa a sincronização de um calendário externo.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | `uuid` | ✅ | Identificador único. |
| `handle` | `string` | ❌ | Endereço de e-mail associado. |
| `syncStatus` | `enum` | ❌ | Status (Active, Error, etc.). |
| `syncStage` | `enum` | ✅ | Etapa atual do sync. |
| `visibility` | `enum` | ✅ | Visibilidade (Public, Private, etc.). |
| `isContactAutoCreationEnabled` | `boolean` | ✅ | Se cria contatos automaticamente. |
| `connectedAccountId` | `uuid` | ✅ | FK para a conta conectada. |

### Entidade: `CalendarEvent`
Representa um evento de calendário.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | `uuid` | ✅ | Identificador único. |
| `iCalUid` | `string` | ✅ | UID padrão iCal. |
| `title` | `string` | ❌ | Título do evento. |
| `startsAt` | `timestamp` | ❌ | Data/hora de início. |
| `endsAt` | `timestamp` | ❌ | Data/hora de término. |
| `isFullDay` | `boolean` | ✅ | Flag de dia inteiro. |
| `location` | `text` | ❌ | Localização. |
| `conferenceLink` | `json` | ❌ | Links de conferência. |

### Entidade: `CalendarEventParticipant`
Participantes de um evento.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | `uuid` | ✅ | Identificador único. |
| `handle` | `string` | ❌ | E-mail do participante. |
| `displayName` | `string` | ❌ | Nome visível. |
| `isOrganizer` | `boolean` | ✅ | Flag de organizador. |
| `responseStatus` | `enum` | ✅ | Status de resposta. |
| `calendarEventId` | `uuid` | ✅ | FK para o evento. |
| `personId` | `uuid` | ❌ | FK opcional para Person. |
| `workspaceMemberId` | `uuid` | ❌ | FK opcional para WorkspaceMember. |

### Entidade: `CalendarChannelEventAssociation`
Associação entre canal e evento.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `eventExternalId` | `string` | ✅ | ID no provedor externo. |
| `calendarChannelId` | `uuid` | ✅ | FK para o canal. |
| `calendarEventId` | `uuid` | ✅ | FK para o evento. |

### Relacionamentos (Calendar)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `CalendarChannel` | 1:1 | `ConnectedAccount` | `connectedAccount` | Configuração de conta. |
| `CalendarEvent` | 1:N | `CalendarEventParticipant` | `participants` | Participantes do evento. |
| `CalendarEventParticipant` | N:1 | `Person` | `person` | Referência ao contato. |
| `CalendarEventParticipant` | N:1 | `WorkspaceMember` | `workspaceMember` | Referência ao membro. |
| `CalendarChannelEventAssociation` | N:1 | `CalendarChannel` | `channel` | Canal associado. |
| `CalendarChannelEventAssociation` | N:1 | `CalendarEvent` | `event` | Evento associado. |

---

## Módulo: Note
Gestão de notas ricas e anotações vinculadas a múltiplos registros.

### Entidade: `Note`
O registro principal da nota.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | `uuid` | ✅ | Identificador único. |
| `title` | `string` | ✅ | Título da nota. |
| `bodyV2` | `richText` | ❌ | Conteúdo formatado da nota. |
| `position` | `number` | ✅ | Ordenação na interface. |
| `timelineActivities` | `timelineActivity` | One-to-Many | Atividades na timeline do objeto |

### 4.9. Attachment (Anexo)
Entidade polimórfica que serve como proxy para metadados de arquivos armazenados.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único |
| `name` | `text` | Nome do arquivo original |
| `file` | `object` | Metadados estruturados do arquivo (id, size, etc) |
| `authorId` | `uuid` | ID do membro que criou o anexo |
| `targetId` | `uuid` | ID do objeto associado (Person, Opportunity, etc) |
| `targetObjectName` | `text` | Nome do objeto associado |

**Relacionamentos:**
| Entidade | Relacionamento | Tipo | Descrição |
| :--- | :--- | :--- | :--- |
| `workspaceMember` | `author` | Many-to-One | Criador do anexo |

### 4.10. Workspace Member (Membro do Workspace)
Representa um usuário dentro de um workspace específico, contendo preferências e associações.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | `uuid` | Identificador único |
| `name` | `full_name` | Nome completo (first, last) |
| `userEmail` | `text` | Email do usuário |
| `userId` | `uuid` | ID do usuário global (Core) |
| `avatarUrl` | `text` | URL do avatar |
| `locale` | `text` | Idioma de preferência |
| `timeZone` | `text` | Fuso horário |
| `dateFormat` | `text` | Formato de data |
| `timeFormat` | `text` | Formato de hora |
| `numberFormat` | `text` | Formato de números |
| `colorScheme` | `text` | Preferência de cor da interface |
| `position` | `number` | Posição na ordenação de membros |

**Relacionamentos:**
| Entidade | Relacionamento | Tipo | Descrição |
| :--- | :--- | :--- | :--- |
| `task` | `assignedTasks` | One-to-Many | Tarefas atribuídas ao membro |
| `company` | `accountOwnerForCompanies` | One-to-Many | Empresas onde é o dono da conta |
| `attachment` | `authoredAttachments` | One-to-Many | Anexos criados pelo membro |
| `connectedAccount` | `connectedAccounts` | One-to-Many | Contas externas conectadas |
| `messageParticipant` | `messageParticipants` | One-to-Many | Participação em mensagens/emails |
| `calendarEventParticipant` | `calendarEventParticipants` | One-to-Many | Participação em eventos de calendário |
| `opportunity` | `ownedOpportunities` | One-to-Many | Oportunidades onde é o dono |

### ConnectedAccount
Gerencia integrações OAuth e contas externas (Google, Microsoft, IMAP/SMTP).

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único da conta conectada. |
| `workspaceMemberId` | UUID | Relacionamento com o membro do workspace dono da conta. |
| `provider` | Enum | Provedor da conta (google, microsoft, imap, etc). |
| `accessToken` | String | Token de acesso OAuth (encriptado). |
| `refreshToken` | String | Token de renovação OAuth (encriptado). |
| `handle` | String | Identificador da conta no provedor (ex: e-mail). |

---

### TimelineActivity
Entidade agregadora que registra interações e mudanças de estado relevantes para visualização em feeds de histórico.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único da atividade. |
| `happensAt` | Date | Data/hora da ocorrência do evento. |
| `name` | String | Nome do evento (ex: `linked-note.created`, `task.updated`). |
| `properties` | JSON | Dados detalhados do evento, incluindo diffs de alteração. |
| `workspaceMemberId` | UUID | Membro do workspace que gerou a atividade. |
| `linkedRecordId` | UUID | ID do registro principal relacionado (ex: ID da Nota). |
| `linkedObjectMetadataId` | UUID | Metadata ID do objeto principal relacionado. |
| `targetPersonId` | UUID | (Opcional) Relacionamento com Person. |
| `targetCompanyId` | UUID | (Opcional) Relacionamento com Company. |
| `targetOpportunityId` | UUID | (Opcional) Relacionamento com Opportunity. |

---

### Dashboard
Representa um painel visual customizável composto por widgets e gráficos.

| Campo | Tipo | Descrição |
| :--- | :--- | :--- |
| `id` | UUID | Identificador único do dashboard. |
| `title` | String | Título visível do dashboard. |
| `pageLayoutId` | UUID | Referência ao layout de página que define a estrutura do dashboard. |
| `position` | Int | Ordem de exibição na lista de dashboards. |

---

### PageLayout / Widget (Engine Metadata)
Componentes de infraestrutura que definem a interface e os elementos visuais dos dashboards.

| Entidade | Descrição |
| :--- | :--- |
| `PageLayout` | Container principal que define o tipo de layout (ex: DASHBOARD). |
| `PageLayoutTab` | Aba dentro de um layout, organiza widgets em grupos lógicos. |
| `PageLayoutWidget` | Elemento individual (Gráfico, Lista, etc) com `gridPosition` e `configuration`. |

**Relacionamentos:**
| Entidade | Relacionamento | Tipo | Descrição |
| :--- | :--- | :--- | :--- |
| `workspaceMember` | `accountOwner` | Many-to-One | Dono da conta conectada |

### Entidade: `NoteTarget`
Relação polimórfica para vincular notas a diferentes objetos.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `noteId` | `uuid` | ✅ | FK para a nota. |
| `targetPersonId` | `uuid` | ❌ | FK opcional para Person. |
| `targetCompanyId` | `uuid` | ❌ | FK opcional para Company. |
| `targetOpportunityId` | `uuid` | ❌ | FK opcional para Opportunity. |

### Relacionamentos (Note)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Note` | 1:N | `NoteTarget` | `noteTargets` | Vínculos da nota com outros objetos. |
| `Note` | 1:N | `Attachment` | `attachments` | Arquivos anexados à nota. |
| `NoteTarget` | N:1 | `Note` | `note` | Nota pai. |
| `NoteTarget` | N:1 | `Person` | `targetPerson` | Pessoa vinculada. |
| `NoteTarget` | N:1 | `Company` | `targetCompany` | Empresa vinculada. |
| `NoteTarget` | N:1 | `Opportunity` | `targetOpportunity` | Oportunidade vinculada. |

---

## Módulo: Attachment
Gestão de arquivos e anexos vinculados a diferentes objetos do sistema.

### Entidade: `Attachment`
Representa um arquivo anexado. Utiliza uma estrutura polimórfica para vinculação.

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|:-----------:|-----------|
| `id` | `uuid` | ✅ | Identificador único. |
| `name` | `string` | ❌ | Nome do arquivo (Depreciado, use `file[0].label`). |
| `file` | `json[]` | ❌ | Array de objetos `FileOutput` com metadados do arquivo (URL, size, extension). |
| `fileCategory` | `string` | ✅ | Categoria do arquivo (Image, PDF, etc.). |
| `targetTaskId` | `uuid` | ❌ | FK opcional para Task. |
| `targetNoteId` | `uuid` | ❌ | FK opcional para Note. |
| `targetPersonId` | `uuid` | ❌ | FK opcional para Person. |
| `targetCompanyId` | `uuid` | ❌ | FK opcional para Company. |
| `targetOpportunityId` | `uuid` | ❌ | FK opcional para Opportunity. |
| `targetWorkflowId` | `uuid` | ❌ | FK opcional para Workflow. |

### Relacionamentos (Attachment)

| Origem | Tipo | Destino | Campo Relacionado | Descrição |
|--------|------|---------|-------------------|-----------|
| `Attachment` | N:1 | `Task` | `targetTask` | Tarefa à qual o arquivo está anexado. |
| `Attachment` | N:1 | `Note` | `targetNote` | Nota à qual o arquivo está anexado. |
| `Attachment` | N:1 | `Person` | `targetPerson` | Pessoa vinculada. |
| `Attachment` | N:1 | `Company` | `targetCompany` | Empresa vinculada. |
| `Attachment` | N:1 | `Workflow` | `targetWorkflow` | Workflow associado. |

---




## PedidoWorkspaceEntity (M�dulo twenty-erp)
**Mesa / Tabela:** pedido
**Descri��o:** Armazena informa��es de pedidos para emiss�o fiscal no contexto do ERP.

| Campo | Tipo | Obrigat�rio | Padr�o | Descri��o |
|-------|------|-------------|---------|-----------|
| codigo | varchar(255) | Sim | - | Identificador �nico ou n�mero do pedido. |
| status | varchar(50) | Sim | 'RASCUNHO' | Status atual do pedido (ex: RASCUNHO, FATURADO). |
| alorTotal | decimal(10,2) | Sim | - | Valor bruto total do pedido. |
| dataEmissao | timestamp | N�o | null | Data e hora em que a nota/pedido foi emitido. |
| companyId | uuid | Sim | - | ID da empresa cliente vinculada ao pedido. |
| opportunityId | uuid | N�o | null | ID da oportunidade do CRM que gerou o pedido (se aplic�vel). |

