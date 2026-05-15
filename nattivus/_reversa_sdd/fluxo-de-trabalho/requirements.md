# Requirements: Fluxo de Trabalho (Workflow)

> Identificador: `005-fluxo-de-trabalho`
> Data: 2026-05-11
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Fluxo de Trabalho gerencia a automação de processos dentro do CRM. Ele permite criar sequências lógicas compostas por um gatilho (`trigger`) e uma série de ações ou passos (`steps`). O sistema suporta versionamento de fluxos, permitindo manter rascunhos (`DRAFT`) enquanto uma versão anterior está ativa (`ACTIVE`), além de registrar cada execução individual (`runs`) para fins de auditoria e depuração.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `packages/twenty-server/src/modules/workflow/common/standard-objects/workflow.workspace-entity.ts` | Entidade pai que agrupa versões e execuções. Estados: DRAFT, ACTIVE, DEACTIVATED. | 🟢 |
| `packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-version.workspace-entity.ts` | Definição da lógica: gatilhos (`WorkflowTrigger`) e passos (`WorkflowAction`). | 🟢 |
| `packages/twenty-server/src/modules/workflow/common/standard-objects/workflow-run.workspace-entity.ts` | Registro histórico de execuções do fluxo. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Administrador do CRM | Automatizar tarefas | "Sempre que uma Oportunidade for criada, criar automaticamente uma Tarefa para o dono da conta." |
| Analista de Operações de Vendas | Garantir integridade | "Sempre que o estágio mudar para 'CUSTOMER', atualizar o campo ICP da Empresa para verdadeiro." |
| Usuário do Sistema | Acompanhar execuções | Verificar se um fluxo de automação rodou com sucesso ou falhou em um registro específico. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Versionamento Imutável. Uma versão `ACTIVE` não deve ser editada diretamente; deve-se criar um novo `DRAFT` para alterações. 🟡
   - Origem no legado: Inferido da estrutura `workflow-version`.
   - Tipo: inferida
2. **RN-02:** Gatilho Único por Versão. Cada versão de fluxo possui exatamente um ponto de entrada (`trigger`). 🟢
   - Origem no legado: `workflow-version.workspace-entity.ts#trigger`
   - Tipo: confirmada
3. **RN-03:** Execução em Passos. As ações são executadas sequencialmente conforme definido no array de `steps`. 🟢
   - Origem no legado: `workflow-version.workspace-entity.ts#steps`
   - Tipo: confirmada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | CRUD de Workflows | Must | Criar a estrutura básica de um fluxo com nome e metadados. | 🟢 |
| RF-02 | Gestão de Versões | Must | Permitir criar múltiplas versões para um mesmo workflow. | 🟢 |
| RF-03 | Configuração de Gatilho | Must | Definir o evento disparador (ex: criação de registro, atualização de campo). | 🟢 |
| RF-04 | Definição de Ações | Must | Configurar a sequência de passos que o sistema deve executar. | 🟢 |
| RF-05 | Monitoramento de Runs | Should | Listar o histórico de execuções com status de sucesso ou erro. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Confiabilidade | Isolamento de Versão | O status do fluxo (`ACTIVE`/`DEACTIVATED`) é controlado globalmente mas executado via versão específica. | 🟢 |
| Desempenho | Execução Assíncrona | (Inferida) Workflows complexos devem rodar em background para não travar a UI. | 🟡 |
| Auditabilidade | Rastreabilidade | Vínculo de execuções com `TimelineActivity`. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Ativação de nova versão de workflow
  Dado que existe um workflow "Auto-Task" com a versão 1 ativa
  Quando eu publico a versão 2 como "ACTIVE"
  Então a versão 1 deve ser marcada como "ARCHIVED" ou "DEACTIVATED"
  E novos gatilhos devem disparar a lógica da versão 2

Cenário: Falha na execução do workflow
  Dado um workflow configurado com um passo inválido
  Quando o gatilho for disparado
  Então o sistema deve registrar um "WorkflowRun" com status de erro
  E detalhar qual passo falhou
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Estrutura necessária para qualquer automação. |
| RF-03 | Must | Sem gatilho a automação nunca inicia. |
| RF-04 | Must | Ações são o valor entregue pela automação. |
| RF-02 | Should | Importante para evolução sem quebra, mas um sistema simples poderia ter versão única. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] Existe suporte para condicionais (if/else) ou loops (foreach) dentro da lista de `steps`?
- 🔴 [DÚVIDA] O sistema permite "re-play" de uma execução que falhou?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-11 | Versão inicial gerada por `/reversa-writer` | reversa-writer |
