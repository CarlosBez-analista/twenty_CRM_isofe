# Especificação do Produto Alvo

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Produto alvo:** Plataforma CRM+ERP dual-perfil sobre base Twenty

---

## 1. Visão do Produto

> **"Uma plataforma integrada onde CRM e ERP compartilham a mesma base de dados, API e UI — sem duplicação de cadastros, sem integrações frágeis entre sistemas separados — atendendo empresas comerciais e institutos sociais com a mesma tecnologia."**

### Identidade

- **Produto base:** Twenty CRM (open source)
- **Produto alvo:** Twenty CRM+ERP (nome provisório — renomear antes do lançamento)
- **Diretriz central:** ERP é o sistema de registro mestre. CRM serve ao ERP como camada de relacionamento.
- **Modelo de extensão:** `packages/twenty-erp` no monorepo Nx — Twenty Core intacto.

---

## 2. Perfis de Workspace

### Perfil A — Empresarial

**Para quem:** Pequenas e médias empresas brasileiras (física ou online), B2B e B2C.

**O que ativa:**
- CRM: Empresa, Pessoa, Oportunidade, Tarefa, Nota (existente)
- ERP: Catálogo de Produtos, Pedidos, Estoque, Financeiro, NF-e, Relatórios

**Fluxo central:**
```
Empresa/Pessoa → Oportunidade → [CLOSED_WON] → Pedido de Venda
→ Reserva de Estoque → NF-e → Conta a Receber → Baixa Financeira
```

---

### Perfil B — Social/Educacional

**Para quem:** Institutos sociais e educacionais brasileiros (OSCs, ONGs, fundações).

**O que ativa:**
- ERP: Beneficiários, Famílias, Parceiros, Programas, Catálogo de Serviços, Catálogo de Produtos Sociais, Estoque de Doações, Donation Record, Centros de Custo
- CRM: Agendamentos, Atendimentos, Casos, Checklist de Documentos, Perfil de Voluntário, Indicadores de Impacto

**Fluxo central:**
```
Beneficiário/Família (ERP) → Programa/Serviço (ERP)
→ Agendamento (CRM) → Atendimento (CRM)
→ [Se produto físico] Baixa de Estoque (ERP)
→ Indicadores de Impacto → Relatório para Financiador
```

---

## 3. Capacidades por Módulo

### 3.1 Módulos CRM (Existentes — Preservados)

| Módulo | Capacidade | Confiança |
|--------|-----------|-----------|
| Empresa | CRUD, owner, timeline, attachments | 🟢 |
| Pessoa | CRUD, associação a empresa, timeline | 🟢 |
| Oportunidade | Funil de estágios, owner, valor, timeline | 🟢 |
| Tarefa | TODO/IN_PROGRESS/DONE, polimórfica | 🟢 |
| Nota | Rich text, polimórfica | 🟢 |
| Attachment | Polimórfico, storage S3/local | 🟢 |
| Workflow | Trigger/Steps, BullMQ, versionamento | 🟢 |
| Dashboard | PageLayout + Widget + ClickHouse | 🟢 |
| Timeline | Auditoria polimórfica automática | 🟢 |
| WorkspaceMember | RBAC, roles, multi-workspace | 🟢 |

### 3.2 Módulos ERP Empresarial (Novos — V1)

| Módulo | Entidades principais | Confiança |
|--------|---------------------|-----------|
| Catálogo | `Produto`, `CategoriaProduto` | 🟡 |
| Pedidos | `PedidoDeVenda`, `ItemDePedido`, `Orcamento` | 🟡 |
| Estoque | `MovimentacaoDeEstoque`, `Localizacao` | 🟡 |
| Financeiro | `ContaAReceber`, `Lancamento`, `CentroDeCusto` | 🟡 |
| Fiscal | Integração externa NF-e / NFS-e | 🟡 |
| Relatórios | DRE, Fluxo de Caixa, Aging — ClickHouse | 🟡 |

### 3.3 Módulos ERP Social (Novos — V1)

| Módulo | Entidades principais | Confiança |
|--------|---------------------|-----------|
| Pessoas/Famílias | `Person` (estendido), `Family` | 🟢 (ISOFÉ) |
| Programas | `Program`, `ServiceCatalog`, `ProductCatalog` | 🟢 (ISOFÉ) |
| Estoque Social | `InventoryItem`, `StockMovement` | 🟢 (ISOFÉ) |
| Doações | `DonationRecord` | 🟢 (ISOFÉ) |
| Centros de Custo | `CostCenter` | 🟢 (ISOFÉ) |

### 3.4 Módulos CRM Social (Novos — V1)

| Módulo | Entidades principais | Confiança |
|--------|---------------------|-----------|
| Agendamentos | `ServiceAppointment` | 🟢 (ISOFÉ) |
| Atendimentos | `ServiceAttendance` | 🟢 (ISOFÉ) |
| Casos | `CaseRecord` | 🟢 (ISOFÉ) |
| Documentos | `DocumentChecklist` | 🟢 (ISOFÉ) |
| Voluntários | `VolunteerProfile` | 🟢 (ISOFÉ) |
| Impacto | `ImpactIndicator` | 🟢 (ISOFÉ) |

### 3.5 Módulos Fase 2+

| Módulo | Perfil | Fase |
|--------|--------|------|
| Compras (`PedidoDeCompra`, `ContaAPagar`) | Empresarial | Fase 2 |
| Integração PIX / Boleto | Empresarial | Fase 2 |
| Portal de Voluntário | Social | Fase 2 |
| Portal de Transparência | Social | Fase 2 |
| NFS-e | Empresarial | Fase 2 |
| Open Finance | Empresarial | Fase 3 |
| Marketplace | Empresarial | Fase 3 |
| RH / Folha simplificada | Ambos | Roadmap |

---

## 4. Requisitos Funcionais Críticos

### RF-01 — Transição CRM→ERP (Empresarial)

O evento `Opportunity.stage = CLOSED_WON` deve disparar automaticamente via Workflow a criação de um `PedidoDeVenda` com:
- `empresa_id` ← `Opportunity.companyId`
- `contato_id` ← `Opportunity.personId`
- `valor_total` ← `Opportunity.amount`
- `origem_crm` ← `Opportunity.id` (rastreabilidade bidirecional)
- `status` ← `RASCUNHO` (aguarda confirmação do operador)

### RF-02 — Transição CRM→ERP (Social)

O registro de `ServiceAttendance` com produto físico deve disparar via Webhook/Evento a criação de um `StockMovement` (saída) no ERP com:
- `product_id` ← produto referenciado no atendimento
- `quantity` ← quantidade entregue
- `triggered_by_crm_attendance_id` ← `ServiceAttendance.id`
- `movement_type` ← `SAIDA`

### RF-03 — Empresa = Cliente ERP sem duplicação

O registro de `Company` do CRM **é** o registro de cliente no ERP. Dois campos adicionais definem o papel:
- `erpType`: enum `['CLIENTE', 'FORNECEDOR', 'AMBOS']`
- `erpCustomerCode`: código interno para NF-e

### RF-04 — ERP como registro mestre (Social)

`Person` e `Family` são criados no ERP antes de serem operacionalizados no CRM. Pré-cadastros feitos via IA/WhatsApp têm status `PENDENTE_VALIDACAO` até revisão humana no ERP.

### RF-05 — RBAC granular por módulo

Papéis funcionais adicionais além de Admin/Member:

| Papel | Permissão chave |
|-------|----------------|
| `APROVADOR_PEDIDO` | Aprova/rejeita `PedidoDeVenda` |
| `EMISSOR_FISCAL` | Emite NF-e/NFS-e |
| `GESTOR_ESTOQUE` | CRUD em `MovimentacaoDeEstoque` e `InventoryItem` |
| `GESTOR_FINANCEIRO` | CRUD em `ContaAReceber`, `Lancamento`, `DonationRecord` |
| `COORDENADOR_PROGRAMA` | Acesso filtrado por `program_id` (social) |
| `VOLUNTARIO_TECNICO` | Acesso restrito a agenda própria filtrada por `pillar` |
| `DPO` | Logs de auditoria, sem acesso a conteúdo de atendimentos |
| `FINANCIADOR` | Dashboard de impacto anonimizado (leitura) |

### RF-06 — Proteção de menores (Social)

`Person` com `birthDate` indicando menor de 18 anos deve:
- Ocultar dados pessoais (CPF, endereço, renda) para voluntários técnicos
- Exigir `authorizationByResponsible = true` em serviços educacionais e esportivos
- Marcar `ServiceAttendance.privacyLevel = SENSIVEL` automaticamente

### RF-07 — Consentimento LGPD

Todo `Person` com dado sensível deve ter:
- `consentStatus`: enum `['CONCEDIDO', 'REVOGADO', 'PENDENTE', 'EXPIRADO']`
- Log de auditoria de cada mudança de status
- Fluxo de re-validação periódica

---

## 5. Requisitos Não-Funcionais

| Requisito | Meta | Justificativa |
|-----------|------|---------------|
| Performance | Listagens < 200ms (P95) | Padrão do Twenty atual |
| Disponibilidade | 99.5% (self-hosted) / 99.9% (cloud) | SLA típico de produto B2B |
| Segurança | Dados sensíveis criptografados em repouso (CPF, laudos) | LGPD Art. 46 |
| Escalabilidade | Multi-workspace sem degradação | Padrão já existente |
| Auditoria | Toda mutação de dado ERP registrada na Timeline | Requisito fiscal e de governança |
| Compliance fiscal | NF-e e NFS-e via parceiro homologado SEFAZ | Obrigação legal |
| Backup | Dados de ERP incluídos na estratégia de backup existente | Obrigação contratual |

---

## 6. Critérios de Pronto (Definition of Done)

### V1 — Perfil Empresarial

- [ ] `PedidoDeVenda` criado automaticamente de `Opportunity CLOSED_WON`
- [ ] Itens de pedido vinculados ao catálogo de produtos
- [ ] Movimentação de estoque criada ao aprovar pedido
- [ ] NF-e emitida via integração externa após faturamento
- [ ] `ContaAReceber` gerada com vencimento
- [ ] Dashboard com DRE e Fluxo de Caixa funcionando

### V1 — Perfil Social (ISOFÉ)

- [ ] `Person` + `Family` como registros mestres no ERP
- [ ] `Program` + `ServiceCatalog` configuráveis
- [ ] `ServiceAppointment` criado via atendente ou IA
- [ ] `ServiceAttendance` disparando `StockMovement` quando há produto físico
- [ ] `DonationRecord` com rastreio até `StockMovement` de saída
- [ ] `ImpactIndicator` com cálculo de SROI básico
- [ ] RBAC por perfil funcional operando corretamente
- [ ] Proteção de menores (`birthDate < 18`) implementada

---

## 7. Decisões Humanas Pendentes

| # | Decisão | Impacto | Urgência |
|---|---------|---------|----------|
| D1 | Parceiro fiscal para NF-e: Focus NF-e ou Nuvem Fiscal | Define API de integração fiscal | Alta — antes do spike de NF-e |
| D2 | LLM para agente IA do WhatsApp: GPT-4o, Claude, Gemini | Define custo e capacidade do agente | Média — antes da Fase 3 |
| D3 | Nome do produto final | Define identidade e modelo de negócio | Média — antes do lançamento |
| D4 | Modelo de negócio: open source com módulos premium ou produto fechado | Define monetização | Alta — antes da V1 |
| D5 | Metodologia SROI: como calcular o valor social por real investido | Define campos obrigatórios em `ImpactIndicator` | Alta — antes de demonstração a financiadores |

---

*Fontes: `intent_interview.md`, `ideas/`, `domain.md` · 2026-05-12*
