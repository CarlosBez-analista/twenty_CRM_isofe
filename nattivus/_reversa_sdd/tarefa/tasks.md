# Tarefa (Task), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] Implementação de `WorkspaceMember` funcional (para `assigneeId`).
- [ ] Sistema de Metadados com suporte a `RichTextMetadata`.
- [ ] Infraestrutura de Standard Objects com suporte a tabelas de relação polimórfica (Target pattern).

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir o Standard Object Metadata para `Task`
  - Origem no legado: `task.workspace-entity.ts`.
  - Critério de pronto: Entidade `Task` declarada com suporte a RichText e campos de auditoria/auditoria.
  - Confiança: 🟢

- [ ] T-02, Implementar Entidade de Vínculo `TaskTarget`
  - Origem no legado: `task-target.workspace-entity.ts`.
  - Critério de pronto: Tabela de junção criada com FKs para Task, Person, Company e Opportunity.
  - Confiança: 🟢

- [ ] T-03, Configurar Vetor de Busca (`searchVector`)
  - Origem no legado: `SEARCH_FIELDS_FOR_TASKS`.
  - Critério de pronto: Busca funcional cobrindo título e descrição rica.
  - Confiança: 🟢

- [ ] T-04, Implementar Lógica de Ordenação (`position`)
  - Origem no legado: Campo `position` na entidade.
  - Critério de pronto: Novas tarefas recebem posição sequencial correta para exibição em listas.
  - Confiança: 🟡

## Tarefas de Teste

- [ ] TT-01, Teste de vínculo múltiplo: Criar uma tarefa e vinculá-la a uma Pessoa e uma Empresa simultaneamente; verificar se ambos aparecem em `TaskTarget`.
- [ ] TT-02, Teste de Rich Text: Salvar uma tarefa com formatação (HTML/JSON) no `bodyV2` e recuperar sem perda de dados.
- [ ] TT-03, Teste de atribuição: Validar se apenas membros válidos do workspace podem ser definidos como `assignee`.
- [ ] TT-04, Teste de busca: Buscar por uma palavra-chave contida apenas no meio do campo de descrição rica.

## Ordem Sugerida
1. T-01 (Task Metadata).
2. T-02 (TaskTarget Relation).
3. T-03 (Search Vector).
4. TT-01 a TT-04 (Testes).

## Lacunas Pendentes (🔴)
- **Status Workflow:** Mapear a lista exata de strings aceitas no campo `status` a partir dos metadados globais de aplicação.
- **Cleanup de Target:** Verificar se existe algum trigger no banco para deletar `TaskTarget` quando a `Task` pai sofre um hard-delete (se aplicável).
