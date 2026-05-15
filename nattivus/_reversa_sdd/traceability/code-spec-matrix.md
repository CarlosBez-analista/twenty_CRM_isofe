# Matriz de Rastreabilidade: Código vs Specs

Esta matriz mapeia os principais arquivos e módulos do código legado para as especificações (units) geradas no Software Design Document (SDD).

| Arquivo/Pasta do Legado | Unit SDD Correspondente | Cobertura | Notas |
|:--- |:--- |:---: |:--- |
| `packages/twenty-server/src/modules/company/` | `empresa/` | 🟢 | Mapeamento completo de domínio e entidades. |
| `packages/twenty-server/src/modules/person/` | `pessoa/` | 🟢 | Inclui lógica de relações e metadados. |
| `packages/twenty-server/src/modules/opportunity/` | `oportunidade/` | 🟢 | Pipeline de vendas e estágios. |
| `packages/twenty-server/src/modules/task/` | `tarefa/` | 🟢 | Gestão de atividades e status. |
| `packages/twenty-server/src/modules/workflow/` | `fluxo-de-trabalho/` | 🟢 | Automação e execução de nós. |
| `packages/twenty-server/src/modules/messaging/` | `mensagens/` | 🟢 | Integração de e-mail e chat. |
| `packages/twenty-server/src/modules/calendar/` | `calendario/` | 🟢 | Eventos e sincronização. |
| `packages/twenty-server/src/modules/note/` | `nota/` | 🟢 | Registros de texto vinculados. |
| `packages/twenty-server/src/modules/attachment/` | `anexo/` | 🟢 | Gestão de arquivos e storage. |
| `packages/twenty-server/src/modules/workspace-member/` | `membro-do-workspace/` | 🟢 | Usuários e permissões internas. |
| `packages/twenty-server/src/modules/connected-account/` | `conta-conectada/` | 🟢 | OAuth e provedores externos. |
| `packages/twenty-server/src/modules/timeline/` | `timeline/` | 🟢 | Histórico cronológico e fan-out. |
| `packages/twenty-server/src/modules/dashboard/` | `dashboard/` | 🟢 | Analítico e visualização de dados. |
| `packages/twenty-server/src/engine/` | `architecture.md` | 🟡 | Coberto na especificação de arquitetura global. |
| `packages/twenty-front/src/modules/` | Diversas | 🟡 | Mapeado conforme correspondência de domínio. |

## Legenda
- 🟢 **Completa**: A funcionalidade principal e regras de negócio foram mapeadas.
- 🟡 **Parcial**: Apenas a estrutura ou componentes principais foram mapeados.
- 🔴 **Pendente**: Módulo identificado mas ainda não detalhado.
- **n/a**: Arquivo de infraestrutura ou configuração sem unit de negócio específica.
