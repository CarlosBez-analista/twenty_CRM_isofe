# Traceability - Reversa Evolve

> **Projeto:** twenty-crm-erp
> **Gerado por:** reversa-evolve
> **Atualizado em:** 2026-05-13
> **Objetivo:** conectar fontes, decisoes e artefatos usados para planejar a evolucao CRM -> CRM+ERP.

---

## Matriz Fonte -> Artefato

| Fonte | Evidencia / decisao extraida | Artefato impactado | Tipo | Confianca |
|-------|-------------------------------|--------------------|------|-----------|
| `_reversa_sdd/inventory.md` | Monorepo Nx / TypeScript como base estrutural. | `target_product_architecture.md`, `handoff.md` | Arquitetura | 🟢 CONFIRMADO |
| `_reversa_sdd/dependencies.md` | Stack e dependencias existentes devem ser preservadas. | `current_product_base.md`, `target_product_architecture.md` | Base tecnica | 🟢 CONFIRMADO |
| `_reversa_sdd/architecture.md` | Twenty possui API GraphQL, metadata engine, workspace objects e fronteiras principais. | `target_product_architecture.md`, `handoff.md` | Arquitetura | 🟢 CONFIRMADO |
| `_reversa_sdd/domain.md` | Company, Person, Opportunity, Task, Workflow, Timeline e Dashboard formam a base CRM preservada. | `current_product_base.md`, `target_product_spec.md` | Dominio | 🟢 CONFIRMADO |
| `_reversa_sdd/permissions.md` | RBAC/ACL existente precisa ser estendido para perfis ERP e sociais. | `target_product_spec.md`, `new_capabilities.md` | Permissoes | 🟢 CONFIRMADO |
| `_reversa_sdd/state-machines.md` | Fluxos e estados atuais orientam automacoes futuras. | `expansion_gap.md`, `evolution_roadmap.md` | Workflow | 🟢 CONFIRMADO |
| `_reversa_sdd/traceability/spec-impact-matrix.md` | Mudancas ERP precisam preservar contratos e impacto das specs existentes. | `target_product_architecture.md`, `handoff.md` | Rastreabilidade | 🟢 CONFIRMADO |
| `_reversa_sdd/gaps.md` | Gaps herdados GAP-C01, GAP-C03, GAP-M02 e GAP-C04 devem entrar no plano de producao. | `expansion_gap.md`, `handoff.md` | Risco | 🟢 CONFIRMADO |
| `_reversa_sdd/evolution/intent_interview.md` | Intencao de produto CRM+ERP dual-perfil com trilha empresarial e social. | `product_intent.md`, `target_product_spec.md` | Decisao de produto | 🟢 CONFIRMADO |
| `_reversa_sdd/evolution/ideas/ideia_ERP_CRM-01.md` | Tese de produto CRM+ERP e exemplos conceituais de implementacao. | `new_capabilities.md`, `evolution_roadmap.md` | Ideacao | 🟡 INFERIDO |
| `_reversa_sdd/evolution/ideas/ERP_CRM_stakeholders-claude.md` | Stakeholders e matriz RBAC social. | `target_product_spec.md`, `new_capabilities.md` | Produto / RBAC | 🟡 INFERIDO |
| `_reversa_sdd/evolution/ideas/Ecossistema Servicos Produtos Isofe Detalhado_claude.md` | Catalogo social, atendimentos, servicos, produtos e fluxos ISOFE. | `new_capabilities.md`, `target_product_spec.md` | Produto social | 🟡 INFERIDO |
| Decisao arquitetural registrada no evolve | ERP deve ficar isolado em `packages/twenty-erp`, sem alterar o Core do Twenty. | `target_product_architecture.md`, `handoff.md` | Arquitetura alvo | 🟡 INFERIDO |
| Decisao de faseamento registrada no roadmap | Comecar por spike tecnico antes de modulos de negocio. | `evolution_roadmap.md`, `handoff.md`, `tasks.md` | Roadmap | 🟢 CONFIRMADO |

---

## Decisoes Pendentes Rastreaveis

| ID | Decisao | Onde aparece | Bloqueia |
|----|---------|--------------|----------|
| GAP-M02 | Investigar passagem de contexto no `WorkflowExecutorService`. | `expansion_gap.md`, `handoff.md`, `tasks.md` | Automacao `Opportunity CLOSED_WON -> Pedido`. |
| D1 | Escolher Focus NF-e ou Nuvem Fiscal. | `target_product_spec.md`, `handoff.md`, `tasks.md` | Modulo fiscal NF-e/NFS-e. |
| D4 | Definir modelo de negocio. | `handoff.md`, `tasks.md` | Estrategia de V1 e publicacao. |
| D5 | Definir metodologia SROI. | `target_product_spec.md`, `handoff.md`, `tasks.md` | Indicadores sociais. |
| D2 | Escolher LLM para IA/WhatsApp. | `expansion_gap.md`, `handoff.md`, `tasks.md` | Canal IA/WhatsApp. |

---

## Cobertura Para Handoff

| Artefato | Papel na fase seguinte | Cobertura |
|----------|------------------------|-----------|
| `product_intent.md` | Define o produto alvo e a intencao consolidada. | Completa para Fase 0 |
| `current_product_base.md` | Define o que preservar do Twenty CRM. | Completa para Fase 0 |
| `expansion_gap.md` | Lista lacunas e bloqueios. | Completa para Fase 0; decisoes futuras continuam pendentes |
| `target_product_spec.md` | Define requisitos e Definition of Done. | Completa para Fase 0 |
| `new_capabilities.md` | Detalha modulos ERP empresariais e sociais. | Completa para planejamento; implementacao deve fatiar por fase |
| `target_product_architecture.md` | Define topologia e isolamento em `packages/twenty-erp`. | Completa para spike |
| `evolution_roadmap.md` | Define Fase 0 a Fase 5. | Completa para sequenciamento |
| `handoff.md` | Entrada principal do agente codificador. | Completa para Fase 0 |
| `tasks.md` | Checklist operacional e bloqueios. | Completa e alinhada ao estado real |

---

## Veredito

O `reversa-evolve` esta pronto para alimentar a **Fase 0 - Spike e Fundacao Tecnica**. A fase seguinte pode iniciar pelo pacote `packages/twenty-erp` e pelo spike `PedidoWorkspaceEntity`, mantendo GAP-M02 como investigacao obrigatoria antes da automacao de workflow.
