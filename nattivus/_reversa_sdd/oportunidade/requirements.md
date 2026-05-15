# Requirements: Oportunidade (Opportunity)

> Identificador: `003-oportunidade`
> Data: 2026-05-11
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Oportunidade gerencia o pipeline de vendas e negócios em andamento. Ele permite rastrear o valor (`amount`), a data prevista de fechamento (`closeDate`) e o estágio atual (`stage`) de cada negociação. Cada oportunidade é vinculada a uma Empresa e pode ter uma Pessoa como ponto de contato principal, além de ser atribuída a um dono (`owner`) dentro do workspace.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/opportunity/legacy-mapping.md` | Mapeamento de arquivos de entidade, visualização e metadados de campo. | 🟢 |
| `packages/twenty-server/src/modules/opportunity/standard-objects/opportunity.workspace-entity.ts` | Definição de campos: amount (currency), stage (select), ownerId, companyId. | 🟢 |
| `packages/twenty-server/src/engine/workspace-manager/twenty-standard-application/utils/field-metadata/compute-opportunity-standard-flat-field-metadata.util.ts` | Estágios padrão: NEW, SCREENING, MEETING, PROPOSAL, CUSTOMER. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Vendedor (Account Executive) | Gerenciar Deal | Mover uma oportunidade entre os estágios (ex: de Proposta para Fechado). |
| Gerente de Vendas | Analisar Pipeline | Visualizar o valor total de oportunidades em cada estágio via Kanban. |
| Membro do Workspace | Registrar Interação | Vincular notas e tarefas a uma oportunidade para manter o histórico do negócio. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Estágios de Venda. Toda oportunidade deve obrigatoriamente pertencer a um estágio pré-definido. 🟢
   - Origem no legado: `compute-opportunity-standard-flat-field-metadata.util.ts#stage`
   - Tipo: confirmada
2. **RN-02:** Valor em Moeda. O campo `amount` suporta múltiplos formatos de moeda através do metadado `CurrencyMetadata`. 🟢
   - Origem no legado: `opportunity.workspace-entity.ts#amount`
   - Tipo: confirmada
3. **RN-03:** Ponto de Contato Único. Cada oportunidade tem um `pointOfContact` principal (Pessoa). 🟢
   - Origem no legado: `opportunity.workspace-entity.ts#pointOfContact`
   - Tipo: confirmada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Pipeline de Estágios | Must | Permitir a transição de estágios conforme o fluxo de vendas definido. | 🟢 |
| RF-02 | Gestão de Valor e Data | Must | Permitir definir o valor do negócio e a data esperada de fechamento. | 🟢 |
| RF-03 | Vínculo com Conta B2B | Must | Cada oportunidade deve estar associada a uma Empresa (Company). | 🟢 |
| RF-04 | Atribuição de Dono | Must | Permitir definir um `WorkspaceMember` como dono da oportunidade. | 🟢 |
| RF-05 | Visualização em Kanban | Should | Suportar agrupamento por estágios para visualização em quadro Kanban. | 🟡 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Usabilidade | Ordem Visual | Uso do campo `position` para manter a ordem manual dos registros em listas/quadros. | 🟢 |
| Integridade | Relacionamentos | Uso de `RelationOnDeleteAction.SET_NULL` para manter integridade ao excluir contatos/empresas. | 🟢 |
| Desempenho | Busca por Nome | Indexação via `SEARCH_FIELDS_FOR_OPPORTUNITY`. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Avanço de estágio da oportunidade
  Dado que tenho uma oportunidade no estágio "NEW"
  Quando eu altero o estágio para "MEETING"
  Então o sistema deve atualizar o status e manter o histórico da alteração

Cenário: Cálculo de valor total no pipeline
  Dado que existem 3 oportunidades com valor de R$ 10.000,00 no estágio "PROPOSAL"
  Quando eu visualizo o resumo do pipeline
  Então o valor total para o estágio "PROPOSAL" deve ser exibido como R$ 30.000,00
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Core do funcionamento de um CRM. |
| RF-02 | Must | Necessário para previsibilidade financeira (Forecasting). |
| RF-03 | Must | Oportunidades não existem sem um cliente/conta associado no B2B. |
| RF-05 | Should | Melhora significativamente a experiência do vendedor, mas a lista básica atende o requisito funcional. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] Existe alguma validação que impeça a `closeDate` de ser no passado?
- 🔴 [DÚVIDA] A probabilidade (`probability`) foi deprecada. Qual campo ou lógica a substituiu para cálculos de previsão?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-11 | Versão inicial gerada por `/reversa-writer` | reversa-writer |
