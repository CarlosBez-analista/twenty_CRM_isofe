<!--
Template de corpo do requirements.md
Carregado por /reversa-requirements e atualizado por /reversa-clarify.
-->

# Requirements: Spike Técnico do twenty-erp

> Identificador: `001-spike-tecnico-erp`
> Data: `2026-05-13`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O Spike Técnico visa validar a fundação do novo ERP modular (twenty-erp) sobre a base do CRM existente. A feature entrega a prova de conceito arquitetural criando o primeiro objeto padrão ERP sem modificar o core, e resolve dois bloqueios fundamentais: a definição do parceiro de integração fiscal (D1) e a confirmação da capacidade do motor de workflow em passar variáveis de contexto entre etapas (GAP-M02).

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md#Padrões Arquiteturais` | Backend NestJS com TypeORM e Frontend React/Vite. | 🟢 |
| `_reversa_sdd/domain.md#Regras de Negócio Implícitas` | Atribuição Universal, Soft-Delete Global e Busca Textual Vetorial nativos. | 🟢 |
| `_reversa_sdd/evolution/handoff.md#3. Por Onde Começar — Fase 0` | Passos para criação do pacote `twenty-erp` e do `PedidoWorkspaceEntity`. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Desenvolvedor | Validar a arquitetura técnica de extensão | Criar o módulo ERP e a entidade Pedido, observando a herança de funcionalidades do CRM (Timeline, API, etc). |
| Arquiteto de Software | Desbloquear o fluxo de integração e automação | Investigar a passagem de variáveis no WorkflowExecutorService e decidir o parceiro fiscal. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** O módulo ERP não deve alterar o Twenty Core (`packages/twenty-server`, etc.), garantindo compatibilidade com o upstream open source. 🟢
   - Tipo: nova
2. **RN-02:** IDs de Standard Objects do ERP (ex: `PEDIDO_STANDARD_OBJECT_IDS`) devem ser UUIDs estáveis e imutáveis. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#Standard Object`
   - Tipo: nova
3. **RN-03:** O serviço de integração fiscal deve operar de forma assíncrona com o ERP, via webhook ou workflow action. 🟡
   - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Criar pacote Nx `twenty-erp` | Must | O pacote é isolado e compila com sucesso no monorepo. | 🟢 |
| RF-02 | Implementar `PedidoWorkspaceEntity` | Must | Entidade é exposta via GraphQL com suporte a soft-delete (`deletedAt`) e busca (`searchVector`). | 🟢 |
| RF-03 | Validar GAP-M02 (WorkflowExecutorService) | Must | O contexto de uma etapa de workflow (ex: valor da Oportunidade) é passado corretamente para a próxima etapa (ERP). | 🟢 |
| RF-04 | Definir parceiro de integração fiscal | Must | Implementar integração fiscal utilizando o Focus NF-e para a versão inicial (V1). | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Impacto nulo no tempo de boot do Twenty CRM | A injeção de novas entidades via decorators não deve degradar a inicialização. | 🟡 |
| Arquitetura | Isolamento de módulos | Os módulos ERP residem estritamente em `packages/twenty-erp`. | 🟢 |
| Observabilidade | Registro de criação de Pedido | A criação do Pedido deve constar na Timeline automaticamente. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Sucesso na criação da entidade Pedido via API
  Dado que o módulo ERP foi configurado
  Quando uma requisição GraphQL de criação de Pedido for enviada
  Então o Pedido é criado no banco
  E um evento na Timeline é gerado automaticamente

Cenário: Falha ao propagar variáveis no Workflow (GAP-M02 negativo)
  Dado que um trigger de workflow é disparado
  Quando a etapa seguinte tentar ler variáveis que o WorkflowExecutorService não serializou corretamente
  Então o erro deve ser capturado de forma clara para que um GAP técnico seja aberto
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 (Pacote Nx) | Must | Requisito fundamental para escrever código do ERP. |
| RF-02 (PedidoWorkspaceEntity) | Must | Valida o padrão arquitetural core do ERP. |
| RF-03 (GAP-M02 Workflow) | Must | A automação CRM->ERP depende inteiramente dessa passagem. |
| RF-04 (Decisão Fiscal D1) | Must | Define a infraestrutura da Camada 2 (serviços externos). |

## 9. Esclarecimentos

### Sessão 2026-05-13
- **Q:** Parceiro fiscal (D1): Qual serviço deve ser escolhido para a versão inicial (V1) do módulo fiscal, considerando custos, limites e licenciamento open source?
  **R:** Focus NF-e (Mais consolidado, documentação madura).
- **Q:** GAP-M02 (WorkflowExecutorService): Se o WorkflowExecutorService não suportar a passagem de variáveis, qual deve ser a abordagem?
  **R:** Criar uma Action Customizada ERP: Criar action paralela isolada estritamente para o `twenty-erp` sem alterar o core.

## 10. Lacunas

> Nenhuma lacuna pendente. Todas resolvidas.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-13 | Versão inicial gerada por `/reversa-requirements` | reversa |
