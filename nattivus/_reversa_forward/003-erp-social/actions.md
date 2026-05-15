# Actions: ERP/CRM Social V1 (ISOFÉ)

> Identificador: `003-erp-social`
> Data: `2026-05-15`
> Roadmap: `_reversa_forward/003-erp-social/roadmap.md`

## Resumo

| Métrica | Valor |
|---------|-------|
| Total de ações | 32 |
| Paralelizáveis (`[//]`) | 5 |
| Maior cadeia de dependência | T002 → T008 → T016 → T017 → T023 |

## Fase 1, Preparação

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T001 | Inicializar pacote `nattivus-social` no monorepo Nx (`project.json`, `module.manifest.ts`). | - | `[//]` | `nattivus/packages/modules/social/project.json` | 🟢 | `[X]` |
| T002 | Criar migrações base para Cadastros Sociais (extensão Person, Family, Programa, CatalogoDeServicos). | T001 | `[//]` | `nattivus/packages/modules/social/migrations/001-base-social.sql` | 🟢 | `[X]` |
| T003 | Criar migrações para Doações e Estoque (ProductCatalog, InventoryItem, MovimentacaoDeEstoque, DonationRecord). | T001 | `[//]` | `nattivus/packages/modules/social/migrations/002-inventory.sql` | 🟢 | `[X]` |
| T004 | Criar migrações para CRM Social (Agendamento, Atendimento, CaseRecord, DocumentChecklist, VolunteerProfile). | T001 | `[//]` | `nattivus/packages/modules/social/migrations/003-crm-social.sql` | 🟢 | `[X]` |
| T005 | Criar migrações para Indicadores e SROI (ImpactIndicator). | T001 | `[//]` | `nattivus/packages/modules/social/migrations/004-indicators.sql` | 🟢 | `[X]` |

## Fase 2, Testes

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T006 | Criar specs de acesso cruzado RBAC (voluntários de pilares diferentes não se enxergam). | T001 | - | `nattivus/packages/modules/social/test/rbac-social.spec.ts` | 🟢 | `[X]` |
| T007 | Criar specs de integração para proteção de menores (LGPD birthDate < 18). | T001 | - | `nattivus/packages/modules/social/test/lgpd-minors.spec.ts` | 🟢 | `[X]` |

## Fase 3, Núcleo

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T008 | Implementar extensão de `Person` (`personType`, `cpf` AES-256, `consentStatus`, `birthDate`). | T002 | - | `nattivus/packages/modules/social/src/entities/person-social.entity.ts` | 🟢 | `[X]` |
| T009 | Implementar `Family` (CRUD + vulnerabilityScore). | T008 | - | `nattivus/packages/modules/social/src/services/family.service.ts` | 🟢 | `[X]` |
| T010 | Implementar `Programa` (CRUD por pilar). | T002 | - | `nattivus/packages/modules/social/src/services/programa.service.ts` | 🟢 | `[X]` |
| T011 | Implementar `CatalogoDeServicos` (CRUD + elegibilidade + LGPD flag). | T010 | - | `nattivus/packages/modules/social/src/services/catalogo-servicos.service.ts` | 🟢 | `[X]` |
| T012 | Implementar `ProductCatalog` (tipos social/físico/institucional). | T003 | - | `nattivus/packages/modules/social/src/services/product-catalog.service.ts` | 🟢 | `[X]` |
| T013 | Implementar `InventoryItem` (lote, validade, parceiro doador). | T012 | - | `nattivus/packages/modules/social/src/services/inventory-item.service.ts` | 🟢 | `[X]` |
| T014 | Implementar `MovimentacaoDeEstoque` (lote, validade, triggered_by). | T013 | - | `nattivus/packages/modules/social/src/services/movimentacao-estoque.service.ts` | 🟢 | `[X]` |
| T015 | Implementar `DonationRecord` (produto, dinheiro, hora voluntária). | T013, T010 | - | `nattivus/packages/modules/social/src/services/donation-record.service.ts` | 🟢 | `[X]` |
| T016 | Implementar `AgendamentoDeServico` (CRUD, check-in, QR code). | T011, T008 | - | `nattivus/packages/modules/social/src/services/agendamento.service.ts` | 🟢 | `[X]` |
| T017 | Implementar `RegistroDeAtendimento` (CRUD + privacidade + exigeRevisao). | T016 | - | `nattivus/packages/modules/social/src/services/registro-atendimento.service.ts` | 🟢 | `[X]` |
| T018 | Implementar `CaseRecord` (CRUD + tipo + status + atribuição). | T008 | - | `nattivus/packages/modules/social/src/services/case-record.service.ts` | 🟢 | `[X]` |
| T019 | Implementar `DocumentChecklist` (armazenamento seguro e sensibilidade). | T018 | - | `nattivus/packages/modules/social/src/services/document-checklist.service.ts` | 🟢 | `[X]` |
| T020 | Implementar `VolunteerProfile` (CRUD + área profissional + antecedentes). | T008 | - | `nattivus/packages/modules/social/src/services/volunteer-profile.service.ts` | 🟢 | `[X]` |
| T021 | Implementar `ImpactIndicator` (CRUD + tipos + anonimização). | T010, T017 | - | `nattivus/packages/modules/social/src/services/impact-indicator.service.ts` | 🟢 | `[X]` |

## Fase 4, Integração

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T022 | Action/Workflow: Registro de Atendimento por voluntário cria `DonationRecord` (hora voluntária). | T015, T017 | - | `nattivus/packages/modules/social/src/actions/attendance-to-donation.ts` | 🟢 | `[X]` |
| T023 | Action/Workflow: Registro de Atendimento com produto cria `MovimentacaoDeEstoque` (saída). | T014, T017 | - | `nattivus/packages/modules/social/src/actions/attendance-to-stock.ts` | 🟢 | `[X]` |
| T024 | Implementar endpoint de exportação de dados do titular (portabilidade LGPD). | T008 | - | `nattivus/packages/modules/social/src/controllers/lgpd-export.controller.ts` | 🟢 | `[X]` |

## Fase 5, Polimento

| ID | Descrição | Dependências | Paralelismo | Arquivo alvo | Confidência | Status |
|----|-----------|--------------|-------------|--------------|-------------|--------|
| T025 | Implementar papéis (COORDENADOR_PROGRAMA, VOLUNTARIO, DPO, FINANCIADOR) e filtros de RBAC por pilar/programa. | T010 | - | `nattivus/packages/modules/social/src/auth/social-rbac.guard.ts` | 🟢 | `[X]` |
| T026 | Aplicar middleware de proteção de menores (birthDate < 18) nas rotas necessárias. | T008 | - | `nattivus/packages/modules/social/src/auth/minors-protection.middleware.ts` | 🟢 | `[X]` |
| T027 | Fluxo de coleta e renovação de consentimento LGPD. | T008 | - | `nattivus/packages/modules/social/src/services/lgpd-consent.service.ts` | 🟢 | `[X]` |
| T028 | Log de auditoria para mudança de `consentStatus` integrado à Timeline. | T027 | - | `nattivus/packages/modules/social/src/services/lgpd-audit.service.ts` | 🟢 | `[X]` |
| T029 | Rotina "Hard-delete LGPD" para exclusão real de dados sensíveis de Person. | T008 | - | `nattivus/packages/modules/social/src/jobs/lgpd-hard-delete.job.ts` | 🟢 | `[X]` |
| T030 | Implementar Query em SQL puro/ClickHouse para calcular SROI por programa e período. | T015, T021 | - | `nattivus/packages/modules/social/src/queries/sroi-calculator.query.ts` | 🟢 | `[X]` |
| T031 | Controladores para os widgets do Dashboard Social (SROI, atendimentos por pilar, vulnerabilidade). | T030 | - | `nattivus/packages/modules/social/src/controllers/social-dashboard.controller.ts` | 🟢 | `[X]` |
| T032 | Geração de Relatório PDF anonimizado para financiadores. | T021 | - | `nattivus/packages/modules/social/src/services/funder-report.service.ts` | 🟢 | `[X]` |

## Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-15 | Versão inicial gerada (baseada no `evolution_roadmap.md` Fase 2) | reversa-to-do |
