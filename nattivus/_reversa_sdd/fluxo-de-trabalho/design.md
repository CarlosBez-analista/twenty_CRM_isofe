# Design: Fluxo de Trabalho (Workflow)

> Identificador: `005-fluxo-de-trabalho`
> Data: 2026-05-11
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Arquitetura de Dados

### 1.1. Entidade Raiz: `Workflow`

Gerencia o agrupamento lógico das automações.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `name` | `string` | Nome amigável da automação. | 🟢 |
| `lastPublishedVersionId` | `uuid` | Ponteiro para a versão ativa atual. | 🟢 |
| `statuses` | `enum[]` | Lista de estados permitidos no fluxo. | 🟢 |

### 1.2. Entidade de Definição: `WorkflowVersion`

Contém a "receita" da automação.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `trigger` | `WorkflowTrigger` | Definição do evento disparador (JSON/Object). | 🟢 |
| `steps` | `WorkflowAction[]` | Array ordenado de ações a executar. | 🟢 |
| `status` | `enum` | DRAFT, ACTIVE, DEACTIVATED, ARCHIVED. | 🟢 |
| `workflowId` | `uuid` | FK para o Workflow pai. | 🟢 |

### 1.3. Entidades de Suporte

- **`WorkflowRun`:** Persiste cada instância de execução.
- **`WorkflowAutomatedTrigger`:** (Inferido) Gerencia o agendamento ou hooks de sistema vinculados aos gatilhos.

## 2. Lógica de Execução

- **Trigger Engine:** Monitora eventos do ORM (Insert/Update/Delete) ou agendamentos cron.
- **Action Executor:** Itera sobre o array `steps` da versão `ACTIVE`, injetando o contexto do registro que disparou o gatilho em cada ação.
- **Error Handling:** Cada passo pode retornar sucesso ou falha, impactando o status final do `WorkflowRun`.

## 3. Versionamento

O sistema adota um padrão de imutabilidade para versões publicadas. Alterações na lógica resultam no incremento de versão, garantindo que execuções em andamento terminem na versão em que começaram.

## 4. Estratégia de Busca

- **Campos:** Busca textual pelo nome do workflow e das versões.

## 5. Lacunas de Design

- 🔴 [DÚVIDA] As ações (`WorkflowAction`) são executadas em um ambiente isolado (sandbox) ou têm acesso direto às APIs do servidor?
- 🔴 [DÚVIDA] Como é feita a resolução de variáveis dinâmicas entre os passos (ex: usar o ID gerado no passo 1 como entrada para o passo 2)?
