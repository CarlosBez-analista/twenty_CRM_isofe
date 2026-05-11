# Visão Geral da Arquitetura

O **Twenty CRM** é uma aplicação monorepo (Nx) dividida em backend (NestJS), frontend (React), utilitários e integração.

## Padrões Arquiteturais
- **Backend**: API GraphQL e REST baseada em NestJS e TypeORM. Processamento assíncrono com BullMQ (Redis).
- **Frontend**: Aplicação SPA em React gerenciada por Vite, usando Jotai para gerência de estado e Apollo Client para GraphQL. Estilização baseada em Linaria e Storybook (`twenty-ui`).
- **Banco de Dados**: PostgreSQL primário para as entidades transacionais e ClickHouse para analytics/billing e monitoramento. Redis usado como broker de filas e cache.

## Integrações
- Integrações externas de e-mail e calendário (via OAuth) com sincronização em background.
- Integração Zapier (`twenty-zapier`).
