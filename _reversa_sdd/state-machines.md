# Máquinas de Estado

Documentação das transições de estado para as principais entidades do CRM.

## Opportunity (Oportunidade)
A oportunidade transita por diversos estágios do funil. O campo `stage` define o estado.

```mermaid
stateDiagram-v2
    [*] --> NEW: Criação
    NEW --> SCREENING: Início de negociação
    SCREENING --> PROPOSAL: Apresentação de valores
    PROPOSAL --> WON: Sucesso
    PROPOSAL --> LOST: Falha na negociação
    SCREENING --> LOST
    NEW --> LOST
    WON --> [*]
    LOST --> [*]
```
> Confiança: 🟡 INFERIDO (Os estágios exatos podem ser customizáveis).

---

## Task (Tarefa)
O fluxo básico de conclusão de tarefas baseado no campo `status`.

```mermaid
stateDiagram-v2
    [*] --> TODO: Criada
    TODO --> IN_PROGRESS: Iniciada
    IN_PROGRESS --> DONE: Finalizada
    TODO --> DONE: Finalizada direta
    DONE --> TODO: Reaberta
    DONE --> [*]
```
> Confiança: 🟢 CONFIRMADO

---

## WorkflowRun (Execução de Fluxo)
O ciclo de vida de uma execução em background (`WorkflowRun`).

```mermaid
stateDiagram-v2
    [*] --> ENQUEUED: Acionado
    ENQUEUED --> RUNNING: Processo alocado
    RUNNING --> COMPLETED: Sucesso
    RUNNING --> FAILED: Erro
    RUNNING --> TIMEOUT: Tempo limite excedido
    COMPLETED --> [*]
    FAILED --> [*]
    TIMEOUT --> [*]
```
> Confiança: 🟡 INFERIDO

---

## Sync Channels (CalendarChannel / MessageChannel)
Representa o status da sincronização de e-mails ou calendários com provedores externos (`syncStage`).

```mermaid
stateDiagram-v2
    [*] --> PENDING_AUTH: Aguardando consentimento
    PENDING_AUTH --> FETCH: Baixando histórico
    FETCH --> IMPORT: Importando p/ BD
    IMPORT --> ACTIVE: Sincronizado (Polling)
    FETCH --> ERROR: Falha de comunicação
    IMPORT --> ERROR: Falha na inserção
    ACTIVE --> ERROR: Token expirado
    ERROR --> FETCH: Retry
    ACTIVE --> [*]: Desconectado
```
> Confiança: 🟡 INFERIDO
