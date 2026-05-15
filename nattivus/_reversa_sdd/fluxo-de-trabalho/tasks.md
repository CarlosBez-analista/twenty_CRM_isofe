# Fluxo de Trabalho (Workflow), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] Motor de execução de tarefas (Queue/Worker) configurado.
- [ ] Sistema de hooks do ORM capaz de disparar eventos em mutações de dados.
- [ ] Tipagem de metadados para definições de Trigger e Action.

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir Entidades de Workflow e Versionamento
  - Origem no legado: `workflow.workspace-entity.ts` e `workflow-version.workspace-entity.ts`.
  - Critério de pronto: Esquema de banco de dados pronto para armazenar Workflows, Versões (com gatilhos e passos) e Status.
  - Confiança: 🟢

- [ ] T-02, Implementar Registro de Execuções (`WorkflowRun`)
  - Origem no legado: `workflow-run.workspace-entity.ts`.
  - Critério de pronto: Tabela de auditoria capaz de logar o início, fim e resultado de cada automação disparada.
  - Confiança: 🟢

- [ ] T-03, Criar Tipagem para Gatilhos e Ações
  - Origem no legado: `workflow-trigger.type.ts` e `workflow-action.type.ts`.
  - Critério de pronto: Interfaces TypeScript que definem o contrato de entrada/saída para os diferentes tipos de automação.
  - Confiança: 🟢

- [ ] T-04, Configurar Lógica de Publicação
  - Origem no legado: Enum `WorkflowStatus` e lógica de `lastPublishedVersionId`.
  - Critério de pronto: Serviço capaz de trocar a versão ativa de um fluxo e arquivar a anterior de forma atômica.
  - Confiança: 🟡

## Tarefas de Teste

- [ ] TT-01, Teste de criação de rascunho: Validar se uma nova versão inicia em `DRAFT` e permite edição dos passos.
- [ ] TT-02, Teste de disparo por evento: Criar um gatilho de "Ao criar Pessoa" e validar se a criação de um registro dispara a entrada no `WorkflowRun`.
- [ ] TT-03, Teste de execução sequencial: Configurar dois passos e validar se o segundo é executado apenas após o sucesso do primeiro.
- [ ] TT-04, Teste de versionamento: Garantir que editar um rascunho não afeta a execução de uma versão que já está `ACTIVE`.

## Ordem Sugerida
1. T-01 (Entity definitions) e T-03 (Type contracts).
2. T-02 (Logging infrastructure).
3. T-04 (Lifecycle management).
4. TT-01 a TT-04 (Testes).

## Lacunas Pendentes (🔴)
- **Engine de Automação:** Identificar no legado se a execução é feita via BullMQ, NestJS Tasks ou algum engine de workflow dedicado (ex: Temporal).
- **Segurança de Execução:** Mapear os limites de recursos (CPU/Memória/Timeouts) aplicados às automações para evitar loop infinito ou degradação do servidor.
