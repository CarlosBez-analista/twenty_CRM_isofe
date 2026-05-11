# Design: Oportunidade (Opportunity)

> Identificador: `003-oportunidade`
> Data: 2026-05-11
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Arquitetura de Dados

### 1.1. Entidade Principal: `Opportunity`

Baseada em `OpportunityWorkspaceEntity`.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `name` | `string` | Título da oportunidade. | 🟢 |
| `amount` | `CurrencyMetadata` | Valor monetário e moeda. | 🟢 |
| `closeDate` | `date` | Data prevista de fechamento. | 🟢 |
| `stage` | `select` | Estágio atual do pipeline. | 🟢 |
| `pointOfContactId` | `uuid` | FK para a Pessoa principal. | 🟢 |
| `companyId` | `uuid` | FK para a Empresa vinculada. | 🟢 |
| `ownerId` | `uuid` | FK para o membro do workspace (dono). | 🟢 |
| `position` | `number` | Ordem relativa no Kanban/Lista. | 🟢 |
| `searchVector` | `tsvector` | Vetor de busca textual (apenas nome). | 🟢 |

### 1.2. Relacionamentos

- **N:1** com `Company` (Empresa) - Obrigatório conceitualmente.
- **N:1** com `Person` (Pessoa) - Ponto de contato principal.
- **N:1** com `WorkspaceMember` (Membro) - Dono da oportunidade.
- **1:N** com `TaskTarget`, `NoteTarget`, `Attachment`, `TimelineActivity`.

## 2. Configurações de UI (Metadata)

### 2.1. Estágios (Stages)

Definidos em `buildOpportunityStandardFlatFieldMetadatas`.

| Valor | Label | Cor | Posição |
|-------|-------|-----|---------|
| `NEW` | New | Red | 0 |
| `SCREENING` | Screening | Purple | 1 |
| `MEETING` | Meeting | Sky | 2 |
| `PROPOSAL` | Proposal | Turquoise | 3 |
| `CUSTOMER` | Customer | Yellow | 4 |

### 2.2. Visualizações Padrão

- **All Opportunities:** Lista plana de todos os registros.
- **Kanban:** Agrupado pelo campo `stage`, ordenado por `position`.
- **Layout de Página:** Definido em `DefaultOpportunityRecordPageLayout.ts` para exibir detalhes, linha do tempo e relações laterais.

## 3. Lógica de Negócio

- **Ownership:** Segue o padrão de `BaseWorkspaceEntity` com rastreamento de quem criou e quem atualizou.
- **Persistência:** Relacionamentos configurados com `onDelete: SET_NULL` para evitar que a exclusão de um contato ou empresa quebre o registro da oportunidade (preservando o histórico financeiro).

## 4. Estratégia de Busca

- **Campos:** Apenas o campo `name` é utilizado para o `searchVector` conforme `SEARCH_FIELDS_FOR_OPPORTUNITY`.

## 5. Lacunas de Design

- 🔴 [DÚVIDA] Existe algum gatilho automático para mudar o estágio de "PROPOSAL" para "CUSTOMER" ao fechar um contrato externo?
- 🔴 [DÚVIDA] Como o sistema lida com diferentes moedas no mesmo pipeline ao calcular o total por estágio?
