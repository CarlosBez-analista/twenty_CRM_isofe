# Inventário do Projeto — twenty-crm-erp

Mapeamento realizado pelo Scout em 2026-05-10.

## 1. Visão Geral
- **Nome:** Twenty (Open Source CRM)
- **Tipo:** Monorepo Nx
- **Linguagem Principal:** TypeScript (v5.9.2)
- **Gerenciador de Pacotes:** Yarn (v4.13.0)

## 2. Estrutura de Pacotes (`packages/`)
| Pacote | Função Principal | Tecnologias Chave |
|--------|------------------|-------------------|
| `twenty-server` | Backend API | NestJS, GraphQL, TypeORM, PostgreSQL, ClickHouse, BullMQ |
| `twenty-front` | Frontend Web App | React, Linaria, Jotai, Apollo Client, Vite |
| `twenty-ui` | Design System / UI | React, Linaria, Storybook |
| `twenty-sdk` | SDK para integrações | TypeScript |
| `twenty-shared` | Código compartilhado | TypeScript |
| `twenty-utils` | Utilitários | TypeScript |
| `twenty-zapier` | Integração Zapier | TypeScript |
| `twenty-emails` | Templates de e-mail | react-email |
| `twenty-docs` | Documentação técnica | MDX, TypeScript |
| `twenty-website` | Site institucional | Next.js |
| `twenty-cli` | Ferramenta de linha de comando | Nest Commander |
| `twenty-companion` | Assistente / Extensão | TypeScript |

## 3. Pontos de Entrada e Fluxos
- **Server:** `packages/twenty-server/src/main.ts`
- **Frontend:** `packages/twenty-front/src/main.tsx`
- **Dev Workflow:** `nx start` (via script root)
- **CI/CD:** GitHub Actions em `.github/workflows/`

## 4. Banco de Dados
- **Relacional:** PostgreSQL (gerenciado via TypeORM em `packages/twenty-server/src/database/pg/`)
- **Analítico:** ClickHouse (em `packages/twenty-server/src/database/clickHouse/`)
- **Cache/Queue:** Redis (via BullMQ e ioredis)

## 5. Qualidade e Testes
- **Total de arquivos de teste:** ~1318
- **Frameworks:**
  - Jest (Server-side e unitários)
  - Vitest (Frontend e componentes)
  - Playwright (E2E)
- **Linter:** Oxlint (via `twenty-oxlint-rules`)
- **Observabilidade:** Sentry, OpenTelemetry

## 6. Configurações Globais
- `nx.json`: Configurações do monorepo
- `package.json`: Dependências raiz e workspaces
- `.yarnrc.yml`: Configurações do Yarn Berry
- `tsconfig.base.json`: Configurações base do compilador TS
