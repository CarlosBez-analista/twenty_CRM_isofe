# Impacto no Legado: 001-spike-tecnico-erp

Data: 2026-05-14
Feature: `001-spike-tecnico-erp`

## Impacto por Arquivo

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `packages/twenty-server/src/app.module.ts` | Backend (AppModule) | `regra-nova` | MEDIUM | Adição do novo módulo `ErpModule` na raiz da aplicação. |
| `packages/twenty-server/src/modules/workflow/workflow-executor/workflow-executor.module.ts` | Workflow | `regra-nova` | HIGH | Registro do `ErpModule` para permitir injeção de dependências das actions no executor. |
| `packages/twenty-server/src/modules/workflow/workflow-executor/workflow-actions/types/workflow-action-type.enum.ts` | Workflow | `regra-nova` | MEDIUM | Extensão dos tipos suportados pelo motor com `EMISSOR_FISCAL`. |
| `packages/twenty-server/src/modules/workflow/workflow-executor/factories/workflow-action.factory.ts` | Workflow | `regra-nova` | HIGH | Atualização do switch/case da factory para resolver a nova action de emissão fiscal. |
| `packages/twenty-erp/*` | ERP Module | `componente-novo` | MEDIUM | Criação isolada do pacote ERP (biblioteca) contendo entidades, serviços (Focus NFe) e actions. |

## Diff Conceitual por Componente

- **Backend (AppModule)**: A infraestrutura principal passou a enxergar e injetar os provedores definidos no novo pacote `twenty-erp`.
- **Workflow**: O motor de workflows do CRM (legado) não teve sua mecânica alterada, mas o dicionário de actions disponíveis foi expandido. Agora o `WorkflowActionFactory` reconhece o enum `EMISSOR_FISCAL` e instancia corretamente a `EmissorFiscalWorkflowAction` injetada via `ErpModule`. O acoplamento ocorreu apenas no ponto de extensão natural (factory/enum).
- **ERP Module (Novo)**: Foi criado um novo bounded context (`twenty-erp`) que encapsula o domínio de notas fiscais (`PedidoWorkspaceEntity`) e as integrações externas (`FocusNfeHttpService`).

## Preservadas

As seguintes regras do domínio mantiveram-se intactas após as modificações:

- **Sistema de Anexos Polimórfico** (🟢 CONFIRMADO)
- **Tarefas Polimórficas (`TaskTarget`)** (🟢 CONFIRMADO)
- **Soft-Delete Global** (🟢 CONFIRMADO)
- **Busca Textual Vetorial** (🟢 CONFIRMADO)
- **Sincronização em Background** (🟢 CONFIRMADO)
- **Versionamento de Workflows** (🟢 CONFIRMADO)
- **Billing Limitado por ClickHouse** (🟢 CONFIRMADO)

## Modificadas

- *Nenhuma regra verde (🟢 CONFIRMADO) do domínio foi modificada ou removida nesta iteração.*
