# Mapeamento do Legado — Person

Este documento rastreia os arquivos originais do projeto legado que compõem as funcionalidades do módulo **Person**.

## Backend (Server)

| Arquivo | Responsabilidade | Referência |
|---------|------------------|------------|
| `packages/twenty-server/src/modules/person/standard-objects/person.workspace-entity.ts` | Definição da entidade de banco de dados e campos. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-server/src/modules/person/standard-objects/person.workspace-entity.ts) |
| `packages/twenty-server/src/modules/contact-creation-manager/services/create-person.service.ts` | Lógica de criação individual e restauração. | 🟢 CONFIRMADO |
| `packages/twenty-server/src/modules/contact-creation-manager/services/create-company-and-contact.service.ts` | Orquestração da criação de contatos com auto-vínculo de empresa. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-server/src/modules/contact-creation-manager/services/create-company-and-contact.service.ts) |
| `packages/twenty-server/src/modules/contact-creation-manager/utils/get-first-name-and-last-name-from-handle-and-display-name.util.ts` | Utilitário de parsing de nomes. | 🟢 CONFIRMADO |

## Frontend (Front)

| Arquivo | Responsabilidade | Referência |
|---------|------------------|------------|
| `packages/twenty-front/src/modules/people/types/Person.ts` | Definição de tipo TypeScript para a UI e GraphQL. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-front/src/modules/people/types/Person.ts) |

---
