# Roadmap de Evolução — CRM+ERP

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fontes:** `target_product_spec.md`, `expansion_gap.md`, `new_capabilities.md`, `target_product_architecture.md`

---

## Visão Geral das Fases

```
FASE 0 — Spike e Fundação Técnica          [Atual → semana 2]
FASE 1 — ERP Empresarial V1                [semana 3 → semana 10]
FASE 2 — ERP/CRM Social V1 (ISOFÉ)        [semana 6 → semana 14]
FASE 3 — Portais e Canais Externos         [semana 12 → semana 20]
FASE 4 — ERP Avançado + Integrações        [semana 18 → semana 28]
FASE 5 — Hardening e Compliance            [paralelo → contínuo]
```

> As fases 1 e 2 podem ser executadas em paralelo por times distintos após a Fase 0.

---

## FASE 0 — Spike e Fundação Técnica

**Objetivo:** Validar que o padrão `BaseWorkspaceEntity` suporta os módulos ERP antes de comprometer o roadmap.

**Critério de pronto:** Um `PedidoWorkspaceEntity` mínimo criado em `packages/twenty-erp`, com Timeline, busca full-text e API GraphQL funcionando sem nenhuma configuração adicional no Core.

### Entregas

| # | Entregável | Dependências | Prioridade |
|---|-----------|-------------|-----------|
| F0-01 | Criar pacote `packages/twenty-erp` no monorepo Nx | — | 🔴 Crítica |
| F0-02 | Spike: `PedidoWorkspaceEntity` mínimo com 3 campos | F0-01 | 🔴 Crítica |
| F0-03 | Verificar herança de Timeline, busca e API GraphQL no spike | F0-02 | 🔴 Crítica |
| F0-04 | Investigar GAP-M02: passagem de variáveis entre steps do Workflow | F0-02 | 🔴 Crítica |
| F0-05 | Corrigir GAP-C01: cron de limpeza de arquivos órfãos no storage | — | 🟡 Alta |
| F0-06 | Corrigir GAP-C03: validação de admin único por workspace | — | 🟡 Alta |
| F0-07 | Definir Decisão D1: parceiro fiscal (Focus NF-e ou Nuvem Fiscal) | — | 🟡 Alta |
| F0-08 | Definir Decisão D4: modelo de negócio (open source + premium ou fechado) | — | 🟡 Alta |
| F0-09 | Criar estrutura de pastas de `packages/twenty-erp/src/modules/` | F0-01 | 🟢 Normal |
| F0-10 | Criar sistema de seeds de módulos ERP | F0-01 | 🟢 Normal |

**Estimativa:** 1-2 semanas · 1 desenvolvedor

---

## FASE 1 — ERP Empresarial V1

**Objetivo:** Produto funcional para empresas comerciais com fluxo Oportunidade → Pedido → NF-e → Financeiro.

**Critério de pronto:**
- Pedido de Venda criado automaticamente de `Opportunity CLOSED_WON`
- NF-e emitida via integração externa após faturamento
- Conta a Receber gerada com vencimento
- Dashboard com DRE básico funcionando

### Entregas por módulo

#### Módulo Catálogo (semana 3-4)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-01 | `Produto`: CRUD + busca full-text | F0-03 | 3 dias |
| E1-02 | `CategoriaProduto`: CRUD | F0-03 | 1 dia |
| E1-03 | Extensão em `Company`: `erpType`, `erpCustomerCode`, CNPJ, IE | F0-03 | 2 dias |
| E1-04 | Frontend: páginas `/erp/catalogo/produtos` e `/erp/catalogo/categorias` | E1-01 | 3 dias |

#### Módulo Pedidos (semana 4-6)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-05 | `PedidoDeVenda`: CRUD + máquina de estados | E1-01, F0-04 | 4 dias |
| E1-06 | `ItemDePedido`: CRUD vinculado ao Pedido e ao Produto | E1-05 | 2 dias |
| E1-07 | `Orcamento`: CRUD + conversão para Pedido | E1-05 | 3 dias |
| E1-08 | Workflow: `CLOSED_WON` → cria `PedidoDeVenda` | E1-05, F0-04 | 2 dias |
| E1-09 | Workflow: aprovação → notifica Emissor Fiscal | E1-05 | 1 dia |
| E1-10 | Frontend: páginas `/erp/pedidos` (lista + detalhe) | E1-05 | 3 dias |

#### Módulo Estoque (semana 5-7)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-11 | `MovimentacaoDeEstoque`: CRUD + tipos | E1-01 | 3 dias |
| E1-12 | `Localizacao`: CRUD hierárquico | E1-11 | 2 dias |
| E1-13 | Workflow cron: alerta de estoque mínimo → Task | E1-11 | 1 dia |
| E1-14 | Workflow: Pedido `APROVADO` → reserva de estoque | E1-11, E1-05 | 1 dia |
| E1-15 | Frontend: página `/erp/estoque` | E1-11 | 2 dias |

#### Módulo Financeiro (semana 7-8)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-16 | `ContaAReceber`: CRUD + máquina de estados | E1-05 | 3 dias |
| E1-17 | `CentroDeCusto`: CRUD | — | 2 dias |
| E1-18 | `Lancamento`: CRUD + baixa manual | E1-16 | 2 dias |
| E1-19 | Workflow: Pedido `FATURADO` → cria `ContaAReceber` | E1-16, E1-05 | 1 dia |
| E1-20 | Workflow cron: vencimento hoje → cobrança por e-mail | E1-16 | 1 dia |
| E1-21 | Frontend: página `/erp/financeiro` | E1-16 | 2 dias |

#### Módulo Fiscal (semana 8-10)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-22 | `erp-fiscal-service`: projeto Node.js + Focus NF-e API | D1 definida, E1-05 | 5 dias |
| E1-23 | Webhook: `erp-fiscal-service` → atualiza `PedidoDeVenda.notaFiscalNumero` | E1-22 | 2 dias |
| E1-24 | Storage: anexar XML NF-e e DANFE ao Pedido | E1-22 | 1 dia |
| E1-25 | Frontend: botão "Emitir NF-e" na página de Pedido | E1-22 | 1 dia |

#### Relatórios Empresariais (semana 9-10)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-26 | Query ClickHouse: DRE por período | E1-16 | 2 dias |
| E1-27 | Query ClickHouse: Fluxo de Caixa | E1-16 | 2 dias |
| E1-28 | Query ClickHouse: Aging de Recebíveis | E1-16 | 1 dia |
| E1-29 | Dashboard widgets: DRE, Fluxo de Caixa, Aging | E1-26 | 2 dias |

#### RBAC ERP Empresarial (semana 3 — paralelo)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| E1-30 | Papéis: `APROVADOR_PEDIDO`, `EMISSOR_FISCAL`, `GESTOR_ESTOQUE`, `GESTOR_FINANCEIRO` | F0-03 | 3 dias |
| E1-31 | Testes de acesso cruzado entre perfis | E1-30 | 2 dias |

**Estimativa total Fase 1:** ~8 semanas · 2 desenvolvedores

---

## FASE 2 — ERP/CRM Social V1 (ISOFÉ)

**Objetivo:** Produto funcional para institutos sociais com fluxo Beneficiário → Atendimento → Indicadores.

**Critério de pronto:**
- `Person` + `Family` como registros mestres no ERP
- `Programa` + `CatalogoDeServicos` configuráveis
- `AgendamentoDeServico` criado via atendente
- `RegistroDeAtendimento` disparando `MovimentacaoDeEstoque` quando há produto físico
- `DonationRecord` com rastreio até saída de estoque
- `ImpactIndicator` com SROI básico
- RBAC por perfil funcional operando

### Entregas por módulo

#### Cadastros mestres ERP Social (semana 6-8)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-01 | Extensões em `Person`: `personType`, `cpf` (AES-256), `consentStatus`, `birthDate` | F0-03 | 4 dias |
| S2-02 | `Family`: CRUD + `vulnerabilityScore` | S2-01 | 3 dias |
| S2-03 | `Programa`: CRUD por pilar | F0-03 | 2 dias |
| S2-04 | `CatalogoDeServicos`: CRUD + elegibilidade + sensibilidade LGPD | S2-03 | 3 dias |
| S2-05 | `ProductCatalog` (social): tipos físico/digital/social/institucional | F0-03 | 2 dias |
| S2-06 | `InventoryItem`: lote, validade, parceiro doador | S2-05 | 2 dias |
| S2-07 | `MovimentacaoDeEstoque` (extensão social): campos `lote`, `validade`, `triggered_by_crm_attendance_id` | E1-11 | 1 dia |

#### Doações (semana 7-8)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-08 | `DonationRecord`: CRUD + tipos (produto, dinheiro, hora voluntária) | S2-06, S2-03 | 3 dias |
| S2-09 | Workflow: `RegistroDeAtendimento` por voluntário → `DonationRecord` (HORA_VOLUNTARIA) | S2-08 | 1 dia |

#### CRM Social: Agendamentos e Atendimentos (semana 8-11)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-10 | `AgendamentoDeServico`: CRUD + QR code + check-in | S2-04, S2-01 | 4 dias |
| S2-11 | `RegistroDeAtendimento`: CRUD + privacidade + `exigeRevisao` | S2-10 | 4 dias |
| S2-12 | Workflow: `RegistroDeAtendimento` com produto → `MovimentacaoDeEstoque` (SAIDA) | S2-11, S2-07 | 2 dias |
| S2-13 | `CaseRecord`: CRUD + tipo + status + atribuição | S2-01 | 3 dias |
| S2-14 | `DocumentChecklist`: CRUD + sensibilidade + armazenamento seguro | S2-13 | 2 dias |
| S2-15 | `VolunteerProfile`: CRUD + área profissional + antecedentes | S2-01 | 2 dias |

#### Indicadores de Impacto (semana 11-13)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-16 | `ImpactIndicator`: CRUD + tipos + anonimização | S2-03, S2-11 | 3 dias |
| S2-17 | Query ClickHouse: SROI por programa e período | S2-08, S2-16 | 3 dias |
| S2-18 | Dashboard widgets: SROI, atendimentos por pilar, vulnerabilidade | S2-17 | 2 dias |
| S2-19 | Relatório PDF anonimizado para financiadores | S2-16 | 3 dias |

#### RBAC Social (semana 6 — paralelo)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-20 | Papéis: `COORDENADOR_PROGRAMA`, `VOLUNTARIO_TECNICO`, `DPO`, `FINANCIADOR` | F0-03 | 3 dias |
| S2-21 | Filtro automático por `program_id` (coordenador) | S2-20 | 2 dias |
| S2-22 | Filtro automático por `pillar` (voluntário técnico) | S2-20 | 2 dias |
| S2-23 | Proteção de menores: middleware `birthDate < 18` | S2-01, S2-20 | 3 dias |
| S2-24 | Testes de acesso cruzado entre voluntários de pilares diferentes | S2-22 | 2 dias |

#### LGPD (semana 7 — paralelo)

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| S2-25 | Fluxo de coleta e renovação de consentimento LGPD | S2-01 | 2 dias |
| S2-26 | Log de auditoria de mudança de `consentStatus` na Timeline | S2-25 | 1 dia |
| S2-27 | Endpoint de exportação de dados do titular (portabilidade LGPD) | S2-01 | 2 dias |
| S2-28 | "Hard-delete LGPD": exclusão real de dados sensíveis após soft-delete | S2-01 | 2 dias |

**Estimativa total Fase 2:** ~9 semanas · 2 desenvolvedores (pode ser paralelo à Fase 1)

---

## FASE 3 — Portais e Canais Externos

**Objetivo:** Canais de acesso para voluntários, financiadores e beneficiários (WhatsApp + IA).

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| P3-01 | Portal de Voluntário: web responsivo, acesso por token, agenda restrita | S2-15, S2-10 | 2 semanas |
| P3-02 | Portal de Transparência: dashboard público/restrito anonimizado | S2-19, S2-18 | 1 semana |
| P3-03 | `erp-whatsapp-service`: WhatsApp Business API + LLM (D2 definida) | S2-10, S2-11 | 3 semanas |
| P3-04 | Fluxo guiado de cadastro de beneficiário via IA | P3-03 | 1 semana |
| P3-05 | Fluxo guiado de agendamento via IA | P3-03 | 1 semana |
| P3-06 | Portal de Auditoria (DPO e Conselho Fiscal) | S2-26, S2-27 | 1 semana |

**Estimativa total Fase 3:** ~8 semanas · 2 desenvolvedores

---

## FASE 4 — ERP Avançado e Integrações

**Objetivo:** Expandir o perfil empresarial com compras, contas a pagar e integrações bancárias.

| # | Entregável | Dependências | Esforço |
|---|-----------|-------------|---------|
| A4-01 | `PedidoDeCompra` + `ContaAPagar` | E1-17 | 2 semanas |
| A4-02 | Recebimento de mercadoria → `MovimentacaoDeEstoque` (entrada) | A4-01, E1-11 | 1 semana |
| A4-03 | `erp-payment-service`: PIX + boleto (Asaas / PagSeguro) | E1-16 | 2 semanas |
| A4-04 | NFS-e (nota fiscal de serviço) via `erp-fiscal-service` | E1-22 | 1 semana |
| A4-05 | Multi-empresa: seletor de workspace + CNPJ por workspace | — | 1 semana |

**Estimativa total Fase 4:** ~6 semanas · 2 desenvolvedores

---

## FASE 5 — Hardening e Compliance (Contínuo)

**Objetivo:** Produto estável, auditado e em conformidade legal.

| # | Entregável | Dependências | Quando |
|---|-----------|-------------|--------|
| H5-01 | Pentest de RBAC: acesso cruzado, elevação de privilégio | S2-24 | Antes de produção |
| H5-02 | Auditoria LGPD com DPO real | S2-28 | Antes de produção social |
| H5-03 | Teste de carga: 1000 workspaces simultâneos | Fases 1-2 concluídas | Antes de cloud |
| H5-04 | Documentação de API (GraphQL schema exportado) | Fases 1-2 concluídas | Antes de SDK |
| H5-05 | Estratégia de backup e recuperação de desastres para dados ERP | Fases 1-2 concluídas | Antes de produção |
| H5-06 | Monitoramento: OpenTelemetry + Sentry para módulos ERP | Fases 1-2 concluídas | Fase 1 concluída |

---

## Cronograma Macro (Estimativa 2 Devs)

```
semana:  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28
         ──────────────────────────────────────────────────────────────────────────────────────
FASE 0:  ████████
FASE 1:              ████████████████████████████████████████
FASE 2:                          ████████████████████████████████████████
FASE 3:                                                ████████████████████████
FASE 4:                                                              ████████████████████████
FASE 5:  (paralela durante todas as fases — revisão e hardening contínuos)
```

---

## Dependências Críticas do Caminho

```
F0-01 (pacote twenty-erp)
    └─► F0-02 (spike PedidoWorkspaceEntity)
            └─► F0-03 (validar herança)
                    ├─► E1-01 (Produto) → E1-05 (Pedido) → E1-08 (Workflow CLOSED_WON)
                    │       └─► E1-16 (ContaReceber) → E1-22 (NF-e) ← D1 (parceiro fiscal)
                    └─► S2-01 (Person estendido) → S2-02 (Family) → S2-10 (Agendamento)
                                                         └─► S2-11 (Atendimento) → S2-12 (Estoque Social)
F0-04 (GAP-M02) → E1-08 (Workflow CLOSED_WON) — bloqueante se GAP não resolvido
D1 (parceiro fiscal) → E1-22 (NF-e) — bloqueante
D5 (metodologia SROI) → S2-17 (query SROI) — bloqueante
```

---

*Fontes: `target_product_spec.md`, `expansion_gap.md`, `new_capabilities.md` · 2026-05-12*
