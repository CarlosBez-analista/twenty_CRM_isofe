# Inventário do Sistema Legacy (Twenty CRM + ERP)

## Estrutura Principal de Pastas
- `packages/twenty-server`: Backend principal (NestJS)
- `packages/twenty-front`: Aplicação Frontend (React/Vite)
- `packages/twenty-erp`: Novo Bounded Context ERP (Emissão Fiscal)
- `packages/twenty-ui`: Biblioteca de Componentes / Design System
- `packages/twenty-shared`: Lógica compartilhada
- `packages/twenty-sdk`: SDK do cliente
- `packages/twenty-website-new`: Site Institucional

## Integrações Externas (Planejadas)
- **Evolution GO** (WhatsApp/Mensageria)
- **Telegram** (Bot/Notificações)
*(Nota: O pacote nativo do Zapier será ignorado/descontinuado)*

## Tecnologias e Frameworks
- **Linguagem Principal**: TypeScript
- **Backend**: Node.js, NestJS
- **Frontend**: React, Vite
- **Gerenciador de Pacotes**: Yarn (v4.x)
- **Monorepo**: Nx

## Pontos de Entrada
- **Backend**: `packages/twenty-server/src/main.ts` (inferido)
- **Frontend**: `packages/twenty-front/src/main.tsx` (inferido)
- **Scripts CI/CD**: Presentes em `.github/workflows` (inferido)

## Banco de Dados
- **Relacional**: PostgreSQL (TypeORM/Prisma)
- **Analítico**: ClickHouse (identificado nos ADRs anteriores)
- **Filas**: BullMQ/Redis (identificado na arquitetura)

## Cobertura de Testes
- **Unit/Integração**: Jest, Vitest
- **E2E**: Playwright
- **Cobertura Estimada**: Contém pastas `__tests__` e arquivos `*.spec.ts` abrangentes.
