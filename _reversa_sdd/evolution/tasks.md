# Tasks - Reversa Evolve: CRM -> CRM + ERP

> **Projeto:** twenty-crm-erp
> **Fase:** Evolve
> **Iniciado em:** 2026-05-11
> **Atualizado em:** 2026-05-13
> **Diretriz central:** O CRM serve ao ERP.
> **Status:** concluido para handoff da Fase 0.

---

## Legenda

- `[ ]` Pendente
- `[/]` Em progresso
- `[x]` Concluido
- `[~]` Bloqueado / aguardando decisao

---

## Etapa 1 - Coleta de Intencao

- [x] Ativar `/reversa-evolve` e iniciar entrevista de intencao.
- [x] Criar `intent_interview.md` com 8 questoes estruturadas.
- [x] Consolidar intencao do produto em `product_intent.md`.
- [x] Ler referencias em `_reversa_sdd/evolution/ideas/`.

## Etapa 2 - Analise da Base Existente

- [x] Ler SDD completo e mapear capacidades atuais do Twenty CRM.
- [x] Classificar capacidades como Preservar / Expandir / Repensar.
- [x] Gerar `current_product_base.md`.

## Etapa 3 - Mapeamento de Lacunas

- [x] Cruzar capacidades atuais vs modulos ERP desejados.
- [x] Identificar gaps funcionais, dados, arquitetura, UI, permissoes, integracoes e compliance.
- [x] Gerar `expansion_gap.md`.

## Etapa 4 - Especificacao do Produto Alvo

- [x] Definir visao do produto CRM+ERP dual-perfil.
- [x] Definir personas e perfis de workspace.
- [x] Mapear fluxos CRM -> ERP empresarial e social.
- [x] Gerar `target_product_spec.md`.

## Etapa 5 - Novas Capacidades

- [x] Detalhar modulos ERP novos, responsabilidades, entidades e regras.
- [x] Mapear conexoes com entidades existentes do CRM.
- [x] Gerar `new_capabilities.md`.

## Etapa 6 - Arquitetura Alvo

- [x] Propor topologia do sistema sobre monorepo Twenty.
- [x] Definir limites entre CRM Core e ERP em `packages/twenty-erp`.
- [x] Mapear dados compartilhados vs dados por modulo.
- [x] Definir estrategia de autorizacao multi-modulo.
- [x] Gerar `target_product_architecture.md`.

## Etapa 7 - Roadmap de Evolucao

- [x] Organizar roadmap em Fase 0 a Fase 5.
- [x] Definir entregaveis, dependencias e criterios de pronto por fase.
- [x] Gerar `evolution_roadmap.md`.

## Etapa 8 - Handoff e Rastreabilidade

- [x] Consolidar decisoes arquiteturais em `handoff.md`.
- [x] Listar dependencias, riscos, decisoes pendentes e gaps criticos.
- [x] Indicar proximo passo imediato: Fase 0 / agente codificador.
- [x] Gerar `traceability.md` da evolucao.
- [x] Atualizar este `tasks.md` para refletir o estado real dos artefatos.

## Etapa 9 - Checkpoint

- [x] Registrar checkpoint `evolve` em `.reversa/state.json`.
- [ ] Commit e push para `https://github.com/CarlosBez-analista/twenty_CRM_isofe.git`.

---

## Bloqueios Para Fases Futuras

| ID | Status | Bloqueio | Impacto |
|----|--------|----------|---------|
| GAP-M02 | [~] | Investigar `WorkflowExecutorService` antes de automatizar `Opportunity CLOSED_WON -> Pedido`. | Bloqueia workflow automatico de Pedido. |
| D1 | [~] | Escolher Focus NF-e ou Nuvem Fiscal. | Bloqueia implementacao fiscal NF-e/NFS-e. |
| D4 | [~] | Decidir modelo de negocio: open source + premium ou fechado. | Bloqueia decisao de empacotamento/publicacao do V1. |
| D5 | [~] | Definir metodologia SROI. | Bloqueia indicadores sociais de impacto financeiro. |
| D2 | [~] | Escolher LLM para agente IA/WhatsApp. | Bloqueia canal IA/WhatsApp da Fase 3. |

---

## Artefatos Gerados

| Arquivo | Status |
|---------|--------|
| `evolution/intent_interview.md` | [x] Criado |
| `evolution/tasks.md` | [x] Atualizado |
| `evolution/ideas/` | [x] Populado |
| `evolution/product_intent.md` | [x] Criado |
| `evolution/current_product_base.md` | [x] Criado |
| `evolution/expansion_gap.md` | [x] Criado |
| `evolution/target_product_spec.md` | [x] Criado |
| `evolution/new_capabilities.md` | [x] Criado |
| `evolution/target_product_architecture.md` | [x] Criado |
| `evolution/evolution_roadmap.md` | [x] Criado |
| `evolution/traceability.md` | [x] Criado |
| `evolution/handoff.md` | [x] Criado |

---

## Proxima Fase Recomendada

**Fase 0 - Spike e Fundacao Tecnica**

1. Criar `packages/twenty-erp`.
2. Criar spike de `PedidoWorkspaceEntity`.
3. Validar Timeline, busca full-text, GraphQL e soft-delete.
4. Investigar GAP-M02 antes do workflow `CLOSED_WON -> Pedido`.
