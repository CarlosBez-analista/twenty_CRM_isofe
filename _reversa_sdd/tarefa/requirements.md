# Requirements: Tarefa (Task)

> Identificador: `004-tarefa`
> Data: 2026-05-11
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Tarefa gerencia as atividades pendentes e o fluxo de trabalho dos membros do workspace. Ele permite criar itens de ação com título (`title`), descrição rica (`bodyV2`), data de vencimento (`dueAt`) e status de conclusão. Através da entidade `TaskTarget`, as tarefas podem ser vinculadas de forma flexível a Pessoas, Empresas, Oportunidades ou Objetos Customizados.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `packages/twenty-server/src/modules/task/standard-objects/task.workspace-entity.ts` | Definição de campos: title, bodyV2 (RichText), dueAt, status, assigneeId. | 🟢 |
| `packages/twenty-server/src/modules/task/standard-objects/task-target.workspace-entity.ts` | Estrutura de vínculos polimórficos para Person, Company, Opportunity e Custom Objects. | 🟢 |
| `_reversa_sdd/state-machines.md#Módulo: Task` | Estados possíveis para o campo `status` (ex: TODO, DONE). | 🟡 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Membro do Workspace | Organizar o dia | Criar uma tarefa "Ligar para cliente" vinculada a uma Pessoa específica com data para hoje. |
| SDR / Pré-vendas | Acompanhamento (Follow-up) | Criar uma tarefa recorrente ou pontual após uma reunião para não esquecer de enviar materiais. |
| Gestor de Equipe | Delegar trabalho | Atribuir uma tarefa crítica (`assigneeId`) a um membro específico da equipe. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Vínculos Flexíveis (Targets). Uma única tarefa pode estar associada a múltiplos alvos através de registros na tabela `TaskTarget`. 🟢
   - Origem no legado: `task-target.workspace-entity.ts`
   - Tipo: confirmada
2. **RN-02:** Conteúdo em Rich Text. O corpo da tarefa suporta formatação avançada (links, negrito, listas) via metadado `RichTextMetadata`. 🟢
   - Origem no legado: `task.workspace-entity.ts#bodyV2`
   - Tipo: confirmada
3. **RN-03:** Ordenação Manual. O campo `position` permite que o usuário reorganize as tarefas visualmente em listas de afazeres. 🟢
   - Origem no legado: `task.workspace-entity.ts#position`
   - Tipo: confirmada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | CRUD de Tarefas | Must | Criar, editar, visualizar e remover tarefas com campos básicos. | 🟢 |
| RF-02 | Gestão de Status | Must | Permitir marcar tarefas como concluídas ou alterar para outros estados definidos. | 🟢 |
| RF-03 | Atribuição de Responsável | Must | Permitir definir um `assignee` (WorkspaceMember) para a tarefa. | 🟢 |
| RF-04 | Agendamento (Due Date) | Should | Permitir definir data e hora de vencimento (`dueAt`). | 🟢 |
| RF-05 | Vínculo Multi-objeto | Must | Permitir associar a tarefa a um ou mais contatos, empresas ou negócios. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Busca Textual | Indexação do título e do corpo (bodyV2) via `SEARCH_FIELDS_FOR_TASKS`. | 🟢 |
| Flexibilidade | Suporte a Custom Objects | `TaskTarget` permite vínculo com entidades criadas pelo usuário via `CustomWorkspaceEntity`. | 🟢 |
| UX | Histórico de Atividade | Registro automático de criação/edição via `TimelineActivity`. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Criação de tarefa vinculada a uma oportunidade
  Dado que existe uma oportunidade "Projeto Alpha"
  Quando eu crio uma tarefa com título "Revisar contrato" e vinculo ao "Projeto Alpha"
  Então o sistema deve criar um registro em TaskTarget apontando para o taskId e o targetOpportunityId

Cenário: Conclusão de tarefa
  Dado que tenho uma tarefa com status "TODO"
  Quando eu marco a tarefa como concluída
  Então o status deve mudar para "DONE" (ou equivalente) e a data de atualização deve ser registrada
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Funcionalidade base de produtividade. |
| RF-02 | Must | Necessário para controle de fluxo de trabalho. |
| RF-05 | Must | Essencial para o contexto de CRM (tarefas precisam de alvos). |
| RF-04 | Should | Importante para prazos, mas o sistema funciona sem datas obrigatórias. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] O sistema suporta lembretes/notificações automáticas baseadas no `dueAt`?
- 🔴 [DÚVIDA] Existe alguma lógica de "tarefas recorrentes" no legado ou apenas tarefas pontuais?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-11 | Versão inicial gerada por `/reversa-writer` | reversa-writer |
