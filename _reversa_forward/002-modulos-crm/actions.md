# Actions: Módulos Funcionais de CRM

> Identificador: `002-modulos-crm`
> Data: `2026-05-14`

## Fase 1, Design e Integração Inicial

| ID | Descrição | Dependências | Status |
|----|-----------|--------------|--------|
| T001 | Definir estratégia de FKs entre módulos no manifesto do Nattivus (Física vs Virtual). | - | `[ ]` |
| T002 | Definir padrão de API inicial (REST, GraphQL ou ambos) e tipagens base no SDK. | - | `[ ]` |
| T003 | Inicializar projeto do módulo `company` (`project.json`, `module.manifest.ts`). | - | `[ ]` |
| T004 | Inicializar projeto do módulo `person` (`project.json`, `module.manifest.ts`). | T001 | `[ ]` |
| T005 | Inicializar projeto do módulo `opportunity` (`project.json`, `module.manifest.ts`). | T001 | `[ ]` |

## Fase 2, Entidades e Banco de Dados

| ID | Descrição | Dependências | Status |
|----|-----------|--------------|--------|
| T006 | Criar entidade `Company` herdando de `BaseEntity`. | T003 | `[ ]` |
| T007 | Criar entidade `Person` com parsing de Display Name. | T004 | `[ ]` |
| T008 | Criar entidade `Opportunity` com pipeline stages (Enum). | T005 | `[ ]` |
| T009 | Configurar migrações isoladas (`.sql`) para os 3 módulos usando RLS/Tenant Context. | T006, T007, T008 | `[ ]` |

## Fase 3, Controllers e Lógica

| ID | Descrição | Dependências | Status |
|----|-----------|--------------|--------|
| T010 | Implementar rotas e validações do módulo `company` (Domain extração). | T006 | `[ ]` |
| T011 | Implementar rotas e validações do módulo `person` (vínculo Company). | T007 | `[ ]` |
| T012 | Implementar rotas e validações do módulo `opportunity`. | T008 | `[ ]` |

## Fase 4, Automação e UI

| ID | Descrição | Dependências | Status |
|----|-----------|--------------|--------|
| T013 | Configurar Github Actions `nattivus-ci.yml` para testes no Nx Workspace. | - | `[ ]` |
| T014 | Refinar `nattivus-ui` com propriedades dinâmicas e paleta ERP mapeada. | - | `[ ]` |
