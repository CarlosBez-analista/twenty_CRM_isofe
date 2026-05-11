# Design: Tarefa (Task)

> Identificador: `004-tarefa`
> Data: 2026-05-11
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Arquitetura de Dados

### 1.1. Entidade Principal: `Task`

Baseada em `TaskWorkspaceEntity`.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `title` | `string` | Título ou resumo da tarefa. | 🟢 |
| `bodyV2` | `RichTextMetadata` | Descrição detalhada formatada. | 🟢 |
| `dueAt` | `datetime` | Data e hora de vencimento. | 🟢 |
| `status` | `string` | Estado atual (ex: TODO, DONE). | 🟢 |
| `position` | `number` | Ordem de exibição. | 🟢 |
| `assigneeId` | `uuid` | FK para o responsável (WorkspaceMember). | 🟢 |
| `searchVector` | `tsvector` | Vetor de busca (título + corpo). | 🟢 |

### 1.2. Entidade de Vínculo: `TaskTarget`

Essencial para o suporte polimórfico de alvos.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `taskId` | `uuid` | FK para a tarefa. | 🟢 |
| `targetPersonId` | `uuid` | FK opcional para Pessoa. | 🟢 |
| `targetCompanyId` | `uuid` | FK opcional para Empresa. | 🟢 |
| `targetOpportunityId` | `uuid` | FK opcional para Oportunidade. | 🟢 |

### 1.3. Relacionamentos

- **N:1** com `WorkspaceMember` (`assignee`) - Quem deve executar.
- **1:N** com `TaskTarget` - Os objetos relacionados à tarefa.
- **1:N** com `Attachment` - Arquivos anexados à tarefa.
- **1:N** com `TimelineActivity` - Registro cronológico da tarefa.

## 2. Lógica de Negócio

### 2.1. Modelo de Alvos (Targets)

Diferente de outros módulos, as tarefas não possuem uma FK direta para empresa ou pessoa na tabela principal. Elas utilizam a tabela `TaskTarget` como uma ponte, permitindo que uma mesma tarefa apareça na linha do tempo de múltiplos objetos simultaneamente.

### 2.2. Estados e Transições

- **Default:** Novas tarefas costumam iniciar sem status ou com um valor padrão definido em metadados.
- **Conclusão:** A marcação de "concluída" altera o campo `status`, mas preserva o registro (exclusão apenas via soft-delete `deletedAt`).

## 3. Estratégia de Busca

- **Multicampo:** Indexa tanto o `title` (peso maior) quanto o `bodyV2` (peso menor) para busca global de atividades.

## 4. Interfaces de Front-end

- **Editor:** Utiliza componentes compatíveis com `RichTextMetadata` para edição do corpo da tarefa.
- **Vínculos:** A interface deve permitir adicionar/remover alvos, refletindo as alterações na tabela `TaskTarget`.

## 5. Lacunas de Design

- 🔴 [DÚVIDA] Existe alguma regra de cascata onde a exclusão de uma Oportunidade remove automaticamente suas Tarefas vinculadas (ou apenas os registros em `TaskTarget`)?
- 🔴 [DÚVIDA] O campo `status` é um enum fixo ou pode ser customizado por workspace?
