# Plano de Exploração — twenty-crm-erp

> Criado pelo Reversa em 2026-05-10
> Marque cada tarefa com ✅ quando concluída.
> Você pode editar este plano antes de iniciar: adicione, remova ou reordene tarefas conforme necessário.

---

## Fase 1: Reconhecimento 🔍

- [x] **Scout** — Mapeamento de estrutura de pastas e tecnologias
- [x] **Scout** — Análise de dependências e gerenciadores de pacotes
- [x] **Scout** — Identificação de entry points, CI/CD e configurações

## Decisão de organização das specs 🗂️

> Entre o Scout e o Arqueólogo, o Reversa pergunta como você quer organizar as specs (por módulo, caso de uso, endpoint, híbrida, por features ou customizada). A escolha fica persistida em `.reversa/config.toml` na seção `[specs]` e não será reperguntada em execuções futuras. Para reapresentar o menu, remova manualmente a seção.

## Fase 2: Escavação 🏗️

- [x] **Archaeologist** — Análise do módulo `company`
- [x] **Archaeologist** — Análise do módulo `person`
- [x] **Archaeologist** — Análise do módulo `opportunity`
- [x] **Archaeologist** — Análise do módulo `task`
- [x] **Archaeologist** — Análise do módulo `workflow`
- [x] **Archaeologist** — Análise do módulo `messaging`
- [x] **Archaeologist** — Análise do módulo `calendar`
- [x] **Archaeologist** — Análise do módulo `note`
- [x] **Archaeologist** — Análise do módulo `attachment`
- [x] **Archaeologist** — Análise do módulo `workspace-member`
- [x] **Archaeologist** — Análise do módulo `connected-account`
- [x] **Archaeologist** — Análise do módulo `timeline`
- [x] **Archaeologist** — Análise do módulo `dashboard`
- [x] **Archaeologist** — Análise do módulo `twenty-erp`

## Fase 3: Interpretação 🧠

- [x] **Detetive** — Arqueologia Git e ADRs retroativos (4 ADRs)
- [x] **Detetive** — Regras de negócio implícitas e máquinas de estado (6 state machines, 14 regras)
- [x] **Detetive** — Matriz de permissões (RBAC/ACL) (30 flags confirmadas, 3 guard types)
- [x] **Arquiteto** — Diagramas C4 (Contexto, Containers, Componentes)
- [x] **Arquiteto** — ERD completo e integrações externas
- [x] **Arquiteto** — Spec Impact Matrix

## Fase 4: Geração 📝

- [x] **Redator** — Specs SDD por componente (`empresa`, `pessoa`, `oportunidade`, `tarefa`, `fluxo-de-trabalho`, `mensagens`)
- [x] **Redator** — Specs SDD das units restantes (calendário, nota, anexo, membro-do-workspace, conta-conectada, timeline, dashboard)
- [x] **Redator** — Flowcharts por módulo (10 diagramas)
- [x] **Redator** — User Stories (traceability/user-stories.md)
- [x] **Redator** — Code/Spec Matrix (traceability/code-spec-matrix.md)

## Fase 5: Revisão ✅

- [x] **Revisor** — Revisão cruzada de specs (13 specs revisadas)
- [x] **Revisor** — Resolução de lacunas com o usuário (42 perguntas respondidas em 3 arquivos)
- [x] **Revisor** — Relatório de confiança final (`confidence-report.md` — 75%)

---

## Agentes Independentes

> Execute estes agentes quando os recursos estiverem disponíveis — podem rodar em qualquer fase.

- [ ] **Visor** — Análise de interface via screenshots
- [ ] **Data Master** — Análise completa do banco de dados
- [x] **Design System** — Extração de tokens de design (10 categorias, 6 componentes, 17 delta ERP)
- [ ] **Tracer** — Análise dinâmica (requer sistema acessível)

---

## Fluxos Pós-Descoberta

- [x] **Evolve** — Plataforma CRM+ERP dual-perfil sobre base Twenty (handoff em `_reversa_sdd/evolution/handoff.md`)
- [ ] **Migrate** — Time de Migração (Paradigm Advisor → Curator → Strategist → Designer → Screen Translator → Inspector)
- [ ] **Reconstructor** — Plano bottom-up para reimplementar a partir das specs

---

## Próximo passo

O Time de Descoberta está **100% concluído**. O `_reversa_sdd/` está completamente populado.
A decisão pendente é: iniciar com `/reversa-requirements` (levantamento formal) ou `/reversa-coding` (execução direta do handoff.md) para a Fase 0 — Spike Técnico do twenty-erp.
