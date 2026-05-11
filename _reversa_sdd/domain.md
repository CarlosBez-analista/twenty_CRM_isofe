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

## Regras de Negócio Implícitas

1. **Atribuição Universal (Ownership)**: Praticamente todas as entidades (Opportunity, Company) possuem um `WorkspaceMember` como dono (`ownerId` / `accountOwner`). 🟡 INFERIDO
2. **Sistema de Anexos Polimórfico**: O anexo pode ser vinculado a uma Tarefa, Nota, Pessoa, Empresa, Oportunidade ou Workflow. 🟢 CONFIRMADO
3. **Tarefas Polimórficas (`TaskTarget`)**: Uma mesma tarefa pode referenciar uma Person, Company e/ou Opportunity simultaneamente usando uma tabela de ligação polimórfica. 🟢 CONFIRMADO
4. **Soft-Delete Global**: Todos os Standard Objects implementam o padrão de exclusão lógica usando a coluna `deletedAt`. Apenas raramente a exclusão é física. 🟢 CONFIRMADO
5. **Busca Textual Vetorial**: A coluna `searchVector` (`TSVECTOR` no Postgres) é mantida para todos os principais Standard Objects, garantindo busca full-text performática. 🟢 CONFIRMADO
6. **Sincronização em Background**: Integrações de calendário e email dependem de "canais" (`MessageChannel`, `CalendarChannel`) que operam de forma assíncrona baseados no `syncStage` e `syncStatus`. 🟢 CONFIRMADO
7. **Versionamento de Workflows**: Ao alterar um workflow, uma nova `WorkflowVersion` é criada. Execuções (`WorkflowRun`) dependem da versão específica que estava ativa no momento. 🟢 CONFIRMADO
8. **Billing Limitado por ClickHouse**: O monitoramento de consumo (metered credit cap) para cobrança utiliza infraestrutura no ClickHouse. 🟢 CONFIRMADO (Evidência Git)
