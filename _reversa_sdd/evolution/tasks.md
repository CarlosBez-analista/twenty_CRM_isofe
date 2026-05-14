# Tasks - Reversa Evolve: CRM -> CRM + ERP

> **Projeto:** twenty-crm-erp (produto NattivusECO)
> **Fase:** Evolve
> **Iniciado em:** 2026-05-11
> **Atualizado em:** 2026-05-14
> **Diretriz central:** O CRM serve ao ERP. **Primeiro cliente: ISOFÉ (Perfil Social).**
> **Status:** concluido para handoff da Fase 0.

## Ordem de Prioridade do Roadmap (ADR-0006)

| Ordem | Bloco | Cliente alvo |
| --- | --- | --- |
| 1 | `001-fundacao-modular` (em execução, ~26%) | Plataforma toda |
| 2 | `002-crm-core` (Company, Person, Opportunity, Task) | Todos os perfis |
| 3 | Features sociais (ISOFÉ-first): Beneficiário, Família, Programa, Atendimento, Doação, SROI | Perfil Social |
| 4 | Features empresariais: Pedido, Estoque, Financeiro | Perfil Empresarial |
| 5 | `00N-fiscal-emissor` (camada multi-provedor — ADR-0005) | Perfil Empresarial |
| 6 | Adapters fiscais adicionais (Tecnospeed, NFe.io, prefeituras) | Sob demanda |

**Regra:** o fiscal só entra depois do empresarial estar pronto. ISOFÉ não precisa de fiscal em V1 (usa `NullFiscalAdapter`).

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
| GAP-M02 | [/] | 🟡 Resolução parcial via spike `001-spike-tecnico-erp` (Action Customizada — decisão D-04). Falta teste de integração ponta-a-ponta. Ver `_reversa_sdd/gaps.md#gap-m02`. | Não bloqueia mais a fundação. |
| D1 | [x] | ✅ Substituída por **ADR-0005** (Adapter Pattern multi-provedor). Não há mais escolha única — cada workspace configura seu provedor. ISOFÉ usa `NullFiscalAdapter`. | Diferida para feature `00N-fiscal-emissor` conforme **ADR-0006**. |
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

## Etapa 10 - Design System ERP (Pre-requisito de Frontend)

> **Prioridade:** executa antes do `/reversa-design-system` e antes de qualquer tela ERP.
> Lacunas registradas em `expansion_gap.md` secao 4A.

- [x] Executar `/reversa-design-system` para extrair tokens existentes do `twenty-ui`.
- [x] Mapear delta de tokens semanticos necessarios para ERP: `--t-erp-fiscal-*`, `--t-erp-stock-*`, `--t-erp-approval-*`, `--t-erp-social-*`.
- [x] Listar componentes ausentes no `twenty-ui` com prioridade de implementacao (ver `_reversa_sdd/design-system/design-system.md`).
- [x] Definir estrategia visual para seletor de perfil — **Admin panel** (Settings > Workspace > Perfil ERP).
- [x] Definir portal de voluntario — **rota interna** `/volunteer` com `twenty-ui`.
- [x] Definir portal de transparencia — **subdominio separado** (`transparencia.dominio.com`).

---

## Fase 0 - Spike e Fundacao Tecnica

> **Status:** pendente — discutir abordagem na proxima sessao (`/reversa-requirements` ou `/reversa-coding`).
> **Pre-requisito concluido:** Etapa 10 (Design System ERP) ✅

- [ ] Criar `packages/twenty-erp` via Nx generator.
- [ ] Criar spike de `PedidoWorkspaceEntity` (minimal: numero, status, empresa).
- [ ] Validar que herda Timeline, busca full-text, GraphQL e soft-delete automaticamente.
- [/] Investigar GAP-M02: `WorkflowExecutorService` — passagem de contexto entre steps. Abordagem definida (Action Customizada) e implementada no spike T008/T009; resta teste de integração serializando payload real `Opportunity → Action`.
- [ ] Definir abordagem: `/reversa-requirements` (levantamento formal) ou `/reversa-coding` (execucao direta do handoff.md).

---

## Decisoes Pendentes (Nao Avancar Sem Resposta)

> Ver tambem `handoff.md` secao 5.

| ID | Decisao | Urgencia |
|----|---------|---------|
| ~~D1~~ ✅ | ~~Parceiro fiscal: Focus NF-e ou Nuvem Fiscal~~ → resolvida por **ADR-0005** (multi-provedor) + **ADR-0006** (ordem de prioridade) | ⚪ Diferida — só relevante na feature `00N-fiscal-emissor` |
| D2 | LLM para agente IA WhatsApp | 🟡 Antes da Fase 3 |
| D3 | Nome do produto final | 🟡 Antes do lancamento |
| D4 | Modelo de negocio: open source + premium ou fechado | 🔴 Antes do V1 |
| D5 | Metodologia SROI | 🔴 Antes de S2-17 |
