# Roadmap: Spike Técnico ERP

> Identificador: `001-spike-tecnico-erp`
> Data: `2026-05-13`
> Requirements: `_reversa_forward/001-spike-tecnico-erp/requirements.md`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA

## 1. Resumo da abordagem

A abordagem visa estender a plataforma Twenty criando um pacote isolado `twenty-erp` utilizando o Nx. Neste pacote, definiremos a entidade `PedidoWorkspaceEntity` estendendo a infraestrutura existente do Twenty (`BaseWorkspaceEntity`, decorators) para herdar nativamente recursos como API GraphQL, Timeline, e Soft-delete. Para integrações e automações, como a conexão com o provedor fiscal Focus NF-e, criaremos uma **Action Customizada ERP** que se acoplará ao motor de workflows do Twenty (`WorkflowExecutorService`) através de eventos, garantindo que o módulo core permaneça inalterado e compatível com atualizações do upstream.

## 2. Princípios aplicados

*(Nenhum princípio documentado no arquivo `principles.md` no momento.)*

| Princípio | Como a feature se relaciona | Status |
|-----------|------------------------------|--------|
| N/A | | |

## 3. Decisões técnicas

| ID | Decisão | Justificativa | Alternativas descartadas | Confidência |
|----|---------|----------------|--------------------------|-------------|
| D-01 | **Isolamento de Pacote Nx** (`packages/twenty-erp`) | Permite desenvolver as regras ERP sem tocar no `twenty-server`, garantindo zero conflito com atualizações do CRM core. | Injetar código diretamente no módulo core do CRM. | 🟢 |
| D-02 | **Uso de Standard Objects Core** (`PedidoWorkspaceEntity`) | Reaproveita toda a infraestrutura base: `searchVector`, `deletedAt`, integração com Timeline e API GraphQL automática. | Criar entidades ORM raw desvinculadas da arquitetura do Workspace. | 🟢 |
| D-03 | **Integração Fiscal via Focus NF-e** | Solução madura e mais consolidada para a versão inicial do emissor fiscal. | Nuvem Fiscal, Mock/Abstração inicial. | 🟢 |
| D-04 | **Action Customizada de Workflow** | Evita modificar o serviço core `WorkflowExecutorService` e restringe o acoplamento do ERP a uma Action executada pelo motor. | Alterar o core, Workaround com persistência em banco. | 🟢 |

## 4. Premissas

*(Nenhuma premissa baseada em dúvidas pendentes, pois todas as lacunas foram esclarecidas no `reversa-clarify`.)*

| Premissa | Origem (`requirements.md` seção) | Risco se errada |
|----------|----------------------------------|-----------------|
| N/A | | |

## 5. Delta arquitetural

| Componente | Arquivo de origem no legado | Tipo de mudança | Resumo |
|------------|------------------------------|-----------------|--------|
| `twenty-erp` | *N/A (novo componente)* | componente-novo | Módulo isolado contendo entidades e serviços do ERP. |
| `Workflow Engine` | `_reversa_sdd/architecture.md` | regra-alterada | Acoplamento de uma nova Action/Trigger específica para propagação de contexto do ERP. |

## 6. Delta no modelo de dados

- Resumo das mudanças: Inserção do modelo `PedidoWorkspaceEntity` estendendo as tabelas base do sistema para suportar a operação de pedidos de venda no padrão Workspace.
- Detalhe completo em: `_reversa_forward/001-spike-tecnico-erp/data-delta.md`

## 7. Delta de contratos externos

| Contrato | Tipo | Arquivo de detalhe |
|----------|------|--------------------|
| Integração Focus NF-e | HTTP | `_reversa_forward/001-spike-tecnico-erp/interfaces/focus-nfe.md` |

## 8. Plano de migração

1. Criar o novo projeto Node/Nest na root (`npx nx generate @nx/node:library twenty-erp`).
2. Configurar a importação do pacote ERP no arquivo raiz de compilação ou registro do Twenty (para que as entidades sejam lidas pelo TypeORM/GraphQL).
3. (Opcional) Executar script de setup de banco para sincronizar o schema (caso a geração das tabelas Standard Objects exija uma rotina manual).

## 9. Riscos e mitigações

| Risco | Impacto | Probabilidade | Mitigação |
|-------|---------|---------------|-----------|
| Impacto no tempo de boot por adição de novo módulo | baixo | baixo | Monitorar o tempo de inicialização do NestJS durante o spike e garantir injeção preguiçosa (lazy load) onde aplicável. |
| Incompatibilidade do contexto na Action Customizada | médio | médio | Fazer testes unitários precoces focados especificamente no payload que transita do CRM para o ERP através do workflow. |

## 10. Critério de pronto

- [ ] Pacote Nx criado e compilando junto com o projeto.
- [ ] `PedidoWorkspaceEntity` acessível via playground GraphQL.
- [ ] Teste de conceito aprovando a passagem de variáveis do CRM para a Action do ERP.
- [ ] Todas as ações do `actions.md` marcadas `[X]`.
- [ ] `regression-watch.md` gerado.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-13 | Versão inicial gerada por `/reversa-plan` | reversa |
