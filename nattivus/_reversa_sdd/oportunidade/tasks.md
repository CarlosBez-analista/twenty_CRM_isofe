# Oportunidade (Opportunity), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] Entidades `Company` e `Person` devem estar funcionais.
- [ ] Sistema de Metadados de Objetos com suporte a campos do tipo `SELECT` e `CURRENCY`.
- [ ] Motor de visualização (Kanban/Lista) capaz de interpretar grupos por campo de seleção.

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir o Standard Object Metadata para `Opportunity`
  - Origem no legado: `opportunity.workspace-entity.ts`.
  - Critério de pronto: Declaração da entidade com campos `amount`, `stage`, `ownerId` e vínculos relacionais.
  - Confiança: 🟢

- [ ] T-02, Configurar Estágios Padrão (`stage`)
  - Origem no legado: `compute-opportunity-standard-flat-field-metadata.util.ts`.
  - Critério de pronto: O campo `stage` deve vir pré-populado com as opções (NEW, SCREENING, MEETING, PROPOSAL, CUSTOMER) e suas respectivas cores/posições.
  - Confiança: 🟢

- [ ] T-03, Implementar Visualização Kanban
  - Origem no legado: `compute-standard-opportunity-view-groups.util.ts`.
  - Critério de pronto: Configuração de visualização que agrupa as oportunidades pelas opções do campo `stage`.
  - Confiança: 🟡

- [ ] T-04, Configurar Vetor de Busca (`searchVector`)
  - Origem no legado: `SEARCH_FIELDS_FOR_OPPORTUNITY`.
  - Critério de pronto: Busca funcional pelo nome da oportunidade.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Teste de transição de estágio: Validar se a alteração do campo `stage` persiste corretamente e reflete na ordenação.
- [ ] TT-02, Teste de moeda: Inserir valores em diferentes moedas (USD, BRL) e validar se o metadado é preservado.
- [ ] TT-03, Teste de relacionamento: Garantir que a oportunidade pode ser filtrada por `companyId` ou `ownerId`.
- [ ] TT-04, Teste de visualização: Validar se o utilitário de visualização gera os grupos corretos para o Kanban baseando-se nos metadados.

## Ordem Sugerida
1. T-01 (Entity Metadata) e T-02 (Stage Options).
2. T-04 (Search Vector).
3. T-03 (Kanban Groups).
4. TT-01 a TT-04 (Testes).

## Lacunas Pendentes (🔴)
- **Cálculo de Probabilidade:** Avaliar se a propriedade deprecada `probability` deve ser removida do schema novo ou se deve ser mantida apenas como dado histórico migrado.
- **Formatação de Moeda:** Confirmar se o frontend utiliza uma biblioteca global de internacionalização para exibir o campo `amount` baseando-se no workspace.
