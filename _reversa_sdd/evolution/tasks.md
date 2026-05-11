# Tasks — Reversa Evolve: CRM → CRM + ERP

> **Projeto:** twenty-crm-erp
> **Fase:** Evolve
> **Iniciado em:** 2026-05-11
> **Diretriz central:** O CRM serve ao ERP.

---

## Legenda

- `[ ]` Pendente
- `[/]` Em progresso
- `[x]` Concluído
- `[~]` Bloqueado / aguardando decisão

---

## Etapa 1 — Coleta de Intenção

- [x] Ativar `/reversa-evolve` e iniciar entrevista de intenção
- [x] Criar `intent_interview.md` com 8 questões estruturadas
- [ ] **[USUÁRIO]** Preencher `intent_interview.md` com visão do produto
- [ ] **[USUÁRIO]** Popular pasta `_reversa_sdd/evolution/ideas/` com pesquisas e referências

---

## Etapa 2 — Análise da Base Existente

> Depende: `intent_interview.md` preenchida

- [ ] Ler SDD completo e mapear capacidades atuais do Twenty CRM
- [ ] Classificar cada capacidade: Preservar / Expandir / Repensar
- [ ] Gerar `current_product_base.md`

---

## Etapa 3 — Mapeamento de Lacunas (GAP Analysis)

> Depende: Etapa 2

- [ ] Cruzar capacidades atuais vs módulos ERP desejados (Q2)
- [ ] Identificar gaps funcionais, de dados, arquitetura, UI, compliance
- [ ] Gerar `expansion_gap.md` com matriz de gaps

---

## Etapa 4 — Especificação do Produto Alvo

> Depende: Etapas 2 e 3

- [ ] Escrever visão do produto expandido em 1 página
- [ ] Definir personas (CRM user vs ERP operator)
- [ ] Mapear fluxo CRM → ERP (Oportunidade → Pedido → Fatura)
- [ ] Gerar `target_product_spec.md`

---

## Etapa 5 — Novas Capacidades

> Depende: Q2 preenchida

- [ ] Detalhar cada módulo ERP novo (responsabilidade, entidades, APIs, regras)
- [ ] Mapear conexões com entidades existentes do CRM
- [ ] Gerar `new_capabilities.md`

---

## Etapa 6 — Arquitetura Alvo

> Depende: Etapas 4 e 5 + resposta Q4 (stack)

- [ ] Propor topologia do sistema (monolito modular vs microsserviços vs híbrido)
- [ ] Definir limites entre módulos CRM e ERP
- [ ] Mapear dados compartilhados vs dados por módulo
- [ ] Definir estratégia de autorização multi-módulo
- [ ] Gerar `target_product_architecture.md`

---

## Etapa 7 — Roadmap de Evolução

> Depende: Etapa 6

- [ ] Organizar em 5 fases: Fundações → Núcleo ERP → Integração CRM↔ERP → Operação → Hardening
- [ ] Definir critérios de pronto por fase
- [ ] Gerar `evolution_roadmap.md`

---

## Etapa 8 — Handoff

> Depende: Todas as etapas anteriores

- [ ] Consolidar decisões arquiteturais em `handoff.md`
- [ ] Listar dependências e riscos top 5
- [ ] Indicar próximo agente a acionar (`/reversa-migrate` ou `/reversa-reconstructor`)
- [ ] Gerar `handoff.md`

---

## Etapa 9 — Revisão e Push

- [ ] Revisar todos os artefatos gerados
- [ ] Commit e push para `https://github.com/CarlosBez-analista/twenty_CRM_isofe.git`
- [ ] Atualizar `state.json` com checkpoint do evolve

---

## Blockers Conhecidos

| ID | Blocker | Depende de |
|----|---------|------------|
| B01 | Stack não definida | Resposta Q4 do usuário |
| B02 | Módulos ERP V1 não confirmados | Resposta Q2 do usuário |
| B03 | Nível de ousadia arquitetural | Resposta Q5 do usuário |
| B04 | Compliance fiscal (NF-e / NFS-e) | Resposta Q8 do usuário |

---

## Artefatos de Saída Esperados

| Arquivo | Status |
|---------|--------|
| `evolution/intent_interview.md` | ✅ Criado |
| `evolution/tasks.md` | ✅ Criado |
| `evolution/ideas/` | ✅ Pasta criada |
| `evolution/current_product_base.md` | ⏳ Pendente |
| `evolution/expansion_gap.md` | ⏳ Pendente |
| `evolution/target_product_spec.md` | ⏳ Pendente |
| `evolution/new_capabilities.md` | ⏳ Pendente |
| `evolution/target_product_architecture.md` | ⏳ Pendente |
| `evolution/evolution_roadmap.md` | ⏳ Pendente |
| `evolution/handoff.md` | ⏳ Pendente |
