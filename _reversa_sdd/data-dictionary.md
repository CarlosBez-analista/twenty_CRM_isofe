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
