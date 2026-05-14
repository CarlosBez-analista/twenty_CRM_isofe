<!--
Template de corpo do actions.md
Carregado por /reversa-to-do e atualizado por /reversa-coding.
-->

# Actions: Spike Técnico ERP

> Identificador: `001-spike-tecnico-erp`
> Data: `2026-05-13`
> Roadmap: `_reversa_forward/001-spike-tecnico-erp/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 10 |
| Paralelizáveis (`[//]`) | 4 |
| Maior cadeia de dependência | 4 |

## Fase 1, Preparação

<!-- Setup, scaffolding, migrações iniciais, configuração de infraestrutura local. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Criar o pacote Nx `twenty-erp` na raiz do monorepo (`npx nx generate @nx/node:library twenty-erp`) | - | `[//]` | `packages/twenty-erp/project.json` | 🟢 | `[X]` |
| T002 | Definir e exportar `ErpModule` como entry point principal do pacote | T001 | - | `packages/twenty-erp/src/lib/erp.module.ts` | 🟢 | `[X]` |
| T003 | Registrar importação do `ErpModule` no servidor core do Twenty CRM | T002 | - | `packages/twenty-server/src/app.module.ts` | 🟢 | `[X]` |

## Fase 2, Testes

<!-- Testes que precisam existir antes ou logo após o núcleo. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T004 | Criar spec inicial para garantir correta injeção de dependências do módulo ERP | T002 | `[//]` | `packages/twenty-erp/src/lib/erp.module.spec.ts` | 🟢 | `[X]` |

## Fase 3, Núcleo

<!-- Lógica central da feature. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T005 | Implementar `PedidoWorkspaceEntity` estendendo `BaseWorkspaceEntity` com os decorators core | T001 | - | `packages/twenty-erp/src/lib/entities/pedido.workspace-entity.ts` | 🟢 | `[X]` |
| T006 | Registrar a nova entidade nos providers do `ErpModule` para exposição automática | T005, T002 | - | `packages/twenty-erp/src/lib/erp.module.ts` | 🟢 | `[X]` |

## Fase 4, Integração

<!-- Cola com outras partes do sistema, contratos externos, ganchos. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T007 | Criar `FocusNfeHttpService` como HTTP client isolado do provedor fiscal | T001 | `[//]` | `packages/twenty-erp/src/lib/services/focus-nfe-http.service.ts` | 🟢 | `[X]` |
| T008 | Criar a Action Customizada `EmissorFiscalWorkflowAction` que consumirá o payload do Pedido | T005, T007 | - | `packages/twenty-erp/src/lib/actions/emissor-fiscal.workflow-action.ts` | 🟢 | `[X]` |
| T009 | Registrar `EmissorFiscalWorkflowAction` no dicionário/registry do `WorkflowExecutorService` do core | T008 | - | `packages/twenty-server/src/engine/workflow/workflow.module.ts` | 🟡 | `[X]` |

## Fase 5, Polimento

<!-- Logs, telemetria, mensagens de erro, documentação curta. -->

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T010 | Adicionar interceptor de log/auditoria ao enviar requisição HTTP para a NF-e | T007 | `[//]` | `packages/twenty-erp/src/lib/services/focus-nfe-http.service.ts` | 🟢 | `[X]` |

## Notas de execução

<!--
Todas as tarefas foram concluídas e devidamente implementadas, seja no twenty-erp isolado ou injetadas de forma desacoplada no twenty-server.
-->

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-13 | Versão inicial gerada por `/reversa-to-do` | reversa |
