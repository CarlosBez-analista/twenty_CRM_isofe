# Regras de Domínio e Glossário

## Glossário

| Termo | Definição | Confiança |
|-------|-----------|-----------|
| **Workspace** | Ambiente isolado de uma organização que contém membros e dados do CRM. | 🟡 INFERIDO |
| **Workspace Member** | Usuário pertencente a um Workspace. Pode ter permissões e papéis específicos. | 🟢 CONFIRMADO |
| **Standard Object** | Entidades padrão do sistema (Company, Person, Opportunity, Task, etc) com suporte nativo na arquitetura core. | 🟢 CONFIRMADO |
| **Company** | Uma conta B2B, organização ou empresa gerenciada no CRM. | 🟢 CONFIRMADO |
| **Person** | Contato B2B ou B2C, geralmente associado a uma Company. | 🟢 CONFIRMADO |
| **Opportunity** | Deal ou negócio em andamento que transita por estágios do funil de vendas. | 🟢 CONFIRMADO |
| **Workflow** | Fluxo de automação baseado em triggers (Cron/Database Event) com grafo de execução e versionamento. | 🟢 CONFIRMADO |
| **Connected Account** | Conta externa conectada via OAuth para sincronização de canais (ex. Google/Microsoft Calendar ou Email). | 🟢 CONFIRMADO |
| **Timeline Activity** | Registro de auditoria ou histórico de ações de um objeto (feed da entidade). | 🟢 CONFIRMADO |
| **Page Layout & Widget** | Sistema que permite construir dashboards customizados de maneira dinâmica. | 🟢 CONFIRMADO |
| **Pedido** | (ERP) Entidade que representa uma venda ou ordem de serviço, vinculada a uma Company e opcionalmente a uma Opportunity. Transita do status RASCUNHO até FATURADO. | 🟢 CONFIRMADO |
| **Emissão Fiscal** | (ERP) Workflow Action que monta o payload de NF-e e envia para a SEFAZ via Focus NFe. | 🟢 CONFIRMADO |
| **PermissionFlagType** | Enum centralizado em `twenty-shared` que define todas as flags de permissão do sistema (Settings + Tools). | 🟢 CONFIRMADO |

## Regras de Negócio Implícitas

1. **Atribuição Universal (Ownership)**: Praticamente todas as entidades (Opportunity, Company) possuem um `WorkspaceMember` como dono (`ownerId` / `accountOwner`). 🟡 INFERIDO
2. **Sistema de Anexos Polimórfico**: O anexo pode ser vinculado a uma Tarefa, Nota, Pessoa, Empresa, Oportunidade ou Workflow. 🟢 CONFIRMADO
3. **Tarefas Polimórficas (`TaskTarget`)**: Uma mesma tarefa pode referenciar uma Person, Company e/ou Opportunity simultaneamente usando uma tabela de ligação polimórfica. 🟢 CONFIRMADO
4. **Soft-Delete Global**: Todos os Standard Objects implementam o padrão de exclusão lógica usando a coluna `deletedAt`. Apenas raramente a exclusão é física. 🟢 CONFIRMADO
5. **Busca Textual Vetorial**: A coluna `searchVector` (`TSVECTOR` no Postgres) é mantida para todos os principais Standard Objects, garantindo busca full-text performática. 🟢 CONFIRMADO
6. **Sincronização em Background**: Integrações de calendário e email dependem de "canais" (`MessageChannel`, `CalendarChannel`) que operam de forma assíncrona baseados no `syncStage` e `syncStatus`. 🟢 CONFIRMADO
7. **Versionamento de Workflows**: Ao alterar um workflow, uma nova `WorkflowVersion` é criada. Execuções (`WorkflowRun`) dependem da versão específica que estava ativa no momento. 🟢 CONFIRMADO
8. **Billing Limitado por ClickHouse**: O monitoramento de consumo (metered credit cap) para cobrança utiliza infraestrutura no ClickHouse. 🟢 CONFIRMADO (Evidência Git)
9. **Pedido → Emissão Fiscal (ERP)**: Um `Pedido` só pode ter NF-e emitida se estiver presente no contexto do workflow. A action `EmissorFiscalWorkflowAction` valida obrigatoriamente a presença do pedido antes de montar o payload e despachar via `FocusNfeHttpService`. 🟢 CONFIRMADO
10. **HTTP Interceptor de Auditoria (ERP)**: Toda chamada HTTP a APIs externas no módulo ERP passa por um interceptor genérico que registra latência e status (sucesso/erro), garantindo rastreabilidade sem instrumentação manual. 🟢 CONFIRMADO
11. **Webhook v2 como Entidade de Metadado**: Webhooks foram migrados de `core-modules` para `metadata-modules` (commit `bc7791871f`), transformando-os em entidades FlatEntity com suporte a `universalIdentifier`. Isso desacopla webhooks do legado Zapier e os torna cidadãos de primeira classe na arquitetura de metadados. 🟢 CONFIRMADO (Evidência Git)
12. **Guard Pipeline de 3 camadas**: Todo endpoint no NestJS passa por: (1) `WorkspaceAuthGuard` (autenticação), (2) um Permission Guard (autorização — `SettingsPermissionGuard`, `CustomPermissionGuard` ou `NoPermissionGuard`) e opcionalmente (3) Guards específicos de domínio (`CreateViewPermissionGuard`, etc). 🟢 CONFIRMADO

## Regras de Negócio — Integrações (Evolution GO + Telegram)

> Estas regras substituem a integração legada Zapier, conforme decisão de projeto.

13. **Mensageria via Workflow HTTP_REQUEST**: Notificações via WhatsApp (Evolution GO) e Telegram devem ser configuradas como ações `HTTP_REQUEST` dentro de Workflows do Twenty, sem código custom no backend — apenas parametrização no editor de workflows. 🟢 CONFIRMADO (Decisão de Projeto)
14. **Sem Dependência de Zapier**: O pacote `twenty-zapier` permanece no monorepo por compatibilidade, mas não é utilizado no deploy operacional deste fork. 🟢 CONFIRMADO (Decisão de Projeto)
