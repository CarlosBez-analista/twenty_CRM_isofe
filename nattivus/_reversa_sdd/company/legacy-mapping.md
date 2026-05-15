# Mapeamento do Legado — Company

Este documento rastreia os arquivos originais do projeto legado que compõem as funcionalidades do módulo **Company**.

## Backend (Server)

| Arquivo | Responsabilidade | Referência |
|---------|------------------|------------|
| `packages/twenty-server/src/modules/company/standard-objects/company.workspace-entity.ts` | Definição da entidade de banco de dados e campos. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-server/src/modules/company/standard-objects/company.workspace-entity.ts) |
| `packages/twenty-server/src/modules/contact-creation-manager/services/create-company.service.ts` | Lógica de criação, restauração e enriquecimento. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-server/src/modules/contact-creation-manager/services/create-company.service.ts) |
| `packages/twenty-server/src/modules/contact-creation-manager/utils/extract-domain-from-link.util.ts` | Utilitário para parsing de domínio. | 🟢 CONFIRMADO |
| `packages/twenty-server/src/modules/contact-creation-manager/utils/get-company-name-from-domain-name.util.ts` | Fallback para nome de empresa. | 🟢 CONFIRMADO |

## Frontend (Front)

| Arquivo | Responsabilidade | Referência |
|---------|------------------|------------|
| `packages/twenty-front/src/modules/companies/types/Company.ts` | Definição de tipo TypeScript para a UI e GraphQL. | [Link](file:///c:/app-dev/twenty_CRM_isofe/packages/twenty-front/src/modules/companies/types/Company.ts) |

---
