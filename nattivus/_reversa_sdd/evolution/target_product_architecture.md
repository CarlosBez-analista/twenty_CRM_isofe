# Arquitetura do Produto Alvo

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fontes:** `architecture.md`, `inventory.md`, `ideas/ideia_ERP_CRM-01.md`, `target_product_spec.md`

---

## 1. Princípio Arquitetural

> **O Twenty Core não é modificado.** Os módulos ERP são adicionados como extensões usando o mesmo padrão de `BaseWorkspaceEntity` + Standard Objects. A infraestrutura existente (Workflow, Timeline, Dashboard, GraphQL, ClickHouse, Storage) é reutilizada sem alteração.

---

## 2. Topologia do Monorepo

```
packages/
├── twenty-server/          ← Core NestJS (INTOCADO)
├── twenty-front/           ← Core React (INTOCADO — exceto novas páginas ERP)
├── twenty-ui/              ← Design System (INTOCADO)
├── twenty-shared/          ← Tipos compartilhados (EXTENSÍVEL)
├── twenty-utils/           ← Utilitários (INTOCADO)
├── twenty-sdk/             ← SDK (INTOCADO)
├── twenty-emails/          ← Templates de e-mail (EXTENSÍVEL)
│
└── twenty-erp/             ← NOVO PACOTE — módulos ERP
    ├── src/
    │   ├── modules/
    │   │   ├── catalogo/           ← Produto, CategoriaProduto
    │   │   ├── pedidos/            ← PedidoDeVenda, ItemDePedido, Orcamento
    │   │   ├── estoque/            ← MovimentacaoDeEstoque, Localizacao
    │   │   ├── financeiro/         ← ContaAReceber, CentroDeCusto, Lancamento
    │   │   ├── fiscal/             ← Integração NF-e (cliente do erp-fiscal-service)
    │   │   ├── relatorios/         ← Queries ClickHouse + Dashboard widgets
    │   │   ├── programas/          ← Programa, CatalogoDeServicos (social)
    │   │   ├── beneficiarios/      ← Family, extensões em Person (social)
    │   │   ├── atendimentos/       ← AgendamentoDeServico, RegistroDeAtendimento (social)
    │   │   ├── doacoes/            ← RegistroDeDoacao, IndicadorDeImpacto (social)
    │   │   └── rbac-erp/          ← Papéis funcionais ERP (APROVADOR_PEDIDO, DPO etc.)
    │   ├── workflows/              ← Definições de automação ERP
    │   │   ├── oportunidade-to-pedido.workflow.ts
    │   │   ├── pedido-to-nfe.workflow.ts
    │   │   ├── atendimento-to-estoque.workflow.ts
    │   │   └── alerta-estoque-minimo.workflow.ts
    │   └── seeds/                  ← Dados iniciais (categorias, plano de contas, pilares)
    └── package.json
```

**Regra:** `twenty-erp` importa de `twenty-server` e `twenty-shared`, nunca ao contrário. Sem acoplamento reverso.

---

## 3. Diagrama de Containers (C4)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        PLATAFORMA CRM+ERP                               │
│                                                                         │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │                    twenty-front (React SPA)                      │   │
│  │                                                                  │   │
│  │  ┌────────────┐  ┌────────────┐  ┌─────────────┐  ┌──────────┐ │   │
│  │  │  /crm/*    │  │  /erp/*    │  │  /social/*  │  │Dashboard │ │   │
│  │  │ (existente)│  │ (novo)     │  │ (novo)      │  │(existente│ │   │
│  │  └─────┬──────┘  └─────┬──────┘  └──────┬──────┘  └────┬─────┘ │   │
│  │        └───────────────┴────────────────┴──────────────┘        │   │
│  │                              │ Apollo GraphQL Client             │   │
│  └──────────────────────────────┼───────────────────────────────────┘   │
│                                 │                                       │
│  ┌──────────────────────────────┼───────────────────────────────────┐   │
│  │              API GATEWAY — twenty-server (NestJS)                │   │
│  │                         GraphQL + REST                           │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │                   MÓDULOS CRM (existentes)              │    │   │
│  │  │  Company | Person | Opportunity | Task | Note           │    │   │
│  │  │  Workflow Engine | Timeline | Dashboard | WorkspaceMember│    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  ┌─────────────────────────────────────────────────────────┐    │   │
│  │  │               MÓDULOS ERP (twenty-erp)                  │    │   │
│  │  │                                                         │    │   │
│  │  │  ┌─────────────────────┐  ┌─────────────────────────┐  │    │   │
│  │  │  │  PERFIL EMPRESARIAL │  │   PERFIL SOCIAL         │  │    │   │
│  │  │  │                     │  │                         │  │    │   │
│  │  │  │  Catálogo           │  │  Programas              │  │    │   │
│  │  │  │  Pedidos de Venda   │  │  Beneficiários/Famílias │  │    │   │
│  │  │  │  Estoque            │  │  ServiceCatalog         │  │    │   │
│  │  │  │  Financeiro         │  │  Agendamentos           │  │    │   │
│  │  │  │  Fiscal (cliente)   │  │  Atendimentos           │  │    │   │
│  │  │  │  Relatórios         │  │  Doações / SROI         │  │    │   │
│  │  │  └─────────────────────┘  └─────────────────────────┘  │    │   │
│  │  │                                                         │    │   │
│  │  │  ┌──────────────────────────────────────────────────┐   │    │   │
│  │  │  │            RBAC ERP (papéis funcionais)          │   │    │   │
│  │  │  └──────────────────────────────────────────────────┘   │    │   │
│  │  └─────────────────────────────────────────────────────────┘    │   │
│  │                                                                  │   │
│  │  ┌──────────────────────────────────────────────────────────┐   │   │
│  │  │                   WORKERS (BullMQ)                       │   │   │
│  │  │  Workflow Runs | Sync Jobs | Fiscal Webhook Handler      │   │   │
│  │  └──────────────────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
│                                                                         │
│  ┌──────────────┐  ┌─────────────┐  ┌────────────┐  ┌──────────────┐   │
│  │  PostgreSQL  │  │  ClickHouse │  │   Redis    │  │  Storage     │   │
│  │  (dados      │  │  (analytics │  │  (filas +  │  │  (S3/local)  │   │
│  │   trans.)    │  │   ERP+Social│  │   cache)   │  │  NF-e, docs  │   │
│  └──────────────┘  └─────────────┘  └────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘

SERVIÇOS EXTERNOS
┌─────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│ erp-fiscal-     │  │ erp-whatsapp-    │  │ erp-payment-     │
│ service         │  │ service          │  │ service          │
│ (Node.js)       │  │ (Node.js + LLM)  │  │ (Node.js)        │
│ Focus NF-e /    │  │ WhatsApp Business│  │ PIX / Boleto     │
│ Nuvem Fiscal    │  │ API + LLM        │  │ (Fase 2)         │
└─────────────────┘  └──────────────────┘  └──────────────────┘
```

---

## 4. Limites entre Módulos

### Dados compartilhados (sem duplicação)

| Entidade | Módulo proprietário | Módulos consumidores |
|----------|--------------------|--------------------|
| `Company` | CRM (existente) | ERP: Pedidos (cliente/fornecedor), Doações (parceiro) |
| `Person` | CRM + ERP extensão | CRM: contato; ERP Social: beneficiário, voluntário |
| `WorkspaceMember` | CRM (existente) | ERP: RBAC (papel funcional vinculado ao membro) |
| `Workflow` | CRM (existente) | ERP: triggers e actions de automação |
| `Timeline` | CRM (existente) | ERP: registra automaticamente toda mutação de entidade |
| `Dashboard` | CRM (existente) | ERP: widgets de KPI financeiros e de impacto social |

### Dados exclusivos de cada camada

| Módulo | Entidades exclusivas |
|--------|---------------------|
| ERP Empresarial | `Produto`, `PedidoDeVenda`, `MovimentacaoDeEstoque`, `ContaAReceber`, `CentroDeCusto` |
| ERP Social | `Family`, `Programa`, `CatalogoDeServicos`, `InventoryItem`, `DonationRecord` |
| CRM Social | `AgendamentoDeServico`, `RegistroDeAtendimento`, `CaseRecord`, `VolunteerProfile`, `ImpactIndicator` |

---

## 5. Fluxo de Autorização (RBAC)

```
Requisição GraphQL
        ↓
AuthGuard (JWT + WorkspaceMember)
        ↓
RoleGuard (papel funcional ERP: APROVADOR_PEDIDO, DPO, etc.)
        ↓
[Perfil Social] ProgramFilter (filtra por program_id do coordenador)
[Perfil Social] PilarFilter (filtra por pillar do voluntário técnico)
[Perfil Social] MinorProtectionMiddleware (birthDate < 18 → oculta campos)
        ↓
Resolver GraphQL
        ↓
Repository (PostgreSQL)
```

---

## 6. Fluxos de Integração CRM ↔ ERP

### Fluxo A — Oportunidade → Pedido (Empresarial)

```
Opportunity.stage = CLOSED_WON
        ↓ [WorkflowTrigger: DATABASE_EVENT]
WorkflowRun enfileirado (BullMQ)
        ↓
WorkflowAction: HTTP POST /erp/pedidos/create-from-opportunity
        ↓
ERP cria PedidoDeVenda {
  status: RASCUNHO,
  empresa_id: opportunity.companyId,
  valor_total: opportunity.amount,
  origem_crm: opportunity.id
}
        ↓
Timeline da Opportunity: "Pedido #1234 criado"
Timeline do Pedido: "Originado de Opportunity #ABCD"
        ↓
[Operador aprova]
PedidoDeVenda.status = APROVADO
        ↓
WorkflowAction: reserva MovimentacaoDeEstoque (RESERVA)
WorkflowAction: notifica Emissor Fiscal
```

### Fluxo B — Atendimento → Estoque (Social)

```
RegistroDeAtendimento criado com produto físico
        ↓ [WorkflowTrigger: DATABASE_EVENT em RegistroDeAtendimento]
WorkflowRun enfileirado (BullMQ)
        ↓
WorkflowAction: HTTP POST /erp/estoque/saida
        ↓
ERP cria StockMovement {
  tipo: SAIDA,
  produto_id: atendimento.produtoId,
  quantidade: atendimento.quantidade,
  triggered_by_crm_attendance_id: atendimento.id
}
        ↓
[Cron diário] estoqueAtual < estoqueMinimo
        ↓
WorkflowAction: cria Task para Gestor de Estoque
```

### Fluxo C — Sincronização ERP → CRM (Social)

```
ERP: novo Person criado (status: ATIVO)
        ↓ [WorkflowTrigger: DATABASE_EVENT]
CRM: cria/atualiza visão relacional do beneficiário
        ↓
CRM: beneficiário disponível para AgendamentoDeServico
```

---

## 7. Estratégia de Dados Sensíveis (LGPD)

| Dado | Tratamento | Módulo |
|------|-----------|--------|
| CPF (`Person.cpf`) | Criptografia AES-256 em repouso | ERP Social |
| Dados de saúde (`RegistroDeAtendimento` sensível) | `privacyLevel = SENSIVEL`, acesso restrito por role | CRM Social |
| Dados jurídicos (`CaseRecord`) | Acesso restrito por role e por advogado atribuído | CRM Social |
| Dados de menores | Campos pessoais ocultos para voluntários; exige `authorizationByResponsible` | ERP Social + CRM Social |
| Consentimento LGPD | `Person.consentStatus` + log de auditoria na Timeline | ERP Social |
| Logs de auditoria | Acesso exclusivo do papel `DPO` | Timeline + RBAC |
| Dados anonimizados para relatórios | Agregação por programa/período sem person_id | ClickHouse queries |

---

## 8. Estratégia de Migração / Ativação

Não há migração de dados — o produto é novo. A ativação segue este sequenciamento:

```
FASE 0 — Base existente estável (Twenty CRM atual)
    ↓
FASE 1 — Spike técnico: criar PedidoWorkspaceEntity mínimo
    ↓ Validar que herda Timeline, busca, API sem configuração adicional
FASE 2 — Módulos ERP Empresariais (V1)
    ↓
FASE 3 — Módulos ERP/CRM Sociais (V1)
    ↓
FASE 4 — Portais externos (voluntário, transparência, IA WhatsApp)
    ↓
FASE 5 — Hardening, compliance, relatórios avançados
```

---

## 9. Riscos Arquiteturais

| Risco | Severidade | Mitigação |
|-------|-----------|-----------|
| Divergência com upstream do Twenty (OSS) | 🟡 Médio | `packages/twenty-erp` separado. Patches mínimos no core |
| Complexidade fiscal BR (NF-e) | 🔴 Alto | Delegar para serviço externo especializado |
| Performance de relatórios financeiros | 🟡 Médio | ClickHouse já presente para queries analíticas |
| GAP-C01: Orphan storage | 🟡 Médio | Cron de limpeza antes de produção |
| GAP-M02: Passagem de variáveis no Workflow | 🔴 Alto | Spike técnico obrigatório antes de implementar `Oportunidade → Pedido` |
| GAP-C03: Admin único | 🟡 Médio | Validação `pre-delete` em `WorkspaceMember` |
| LGPD: dados sensíveis sem criptografia | 🔴 Alto | CPF e campos sensíveis com AES-256 desde o início |
| Segregação RBAC entre voluntários de pilares diferentes | 🔴 Alto | Testes automatizados de acesso cruzado obrigatórios |

---

*Fontes: `architecture.md`, `inventory.md`, `ideas/ideia_ERP_CRM-01.md` · 2026-05-12*
