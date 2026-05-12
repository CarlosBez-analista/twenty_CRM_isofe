# Intenção do Produto — CRM + ERP

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fonte primária:** `evolution/intent_interview.md` (preenchido por CarlosBez-analista)
> **Produto base:** Twenty CRM (open source, monorepo Nx)
> **Produto alvo:** Plataforma CRM+ERP dual-perfil

---

## 1. Síntese da Intenção

Transformar o Twenty CRM em uma **plataforma de gestão integrada CRM+ERP** que atenda dois perfis distintos com a mesma base técnica:

| Perfil | Segmento | Fluxo central |
|--------|----------|---------------|
| **Empresarial** | Pequenas e médias empresas comerciais (física ou online) | Oportunidade → Pedido → NF-e → Financeiro |
| **Social/Educacional** | Institutos sociais e educacionais (ex.: ISOFÉ) | Beneficiário/Família → Programa → Atendimento → Impacto |

Módulos ativados por perfil de workspace — um workspace empresarial não vê os módulos sociais, e vice-versa.

---

## 2. Produto Alvo — Descrição

> **"Uma única plataforma onde CRM e ERP compartilham a mesma base de dados, API e UI — sem duplicação de cadastros, sem integrações frágeis entre sistemas separados."**

O Twenty CRM já entrega como infraestrutura tudo que um ERP precisa: modelo de objetos flexível, motor de automação, multi-tenancy, sistema de permissões, auditoria polimórfica, busca vetorial e dashboards. O que falta são os **módulos de domínio ERP** construídos em cima dessa base.

---

## 3. Personas Operacionais

### Perfil Empresarial

| Persona | Papel | Uso diário |
|---------|-------|-----------|
| **Vendedor** | Gerencia oportunidades no funil CRM | Cria oportunidades, converte em pedidos |
| **Operador Comercial** | Aprova e acompanha pedidos | Revisa pedidos, aprova desvios, emite NF-e |
| **Gestor Financeiro** | Controla fluxo de caixa | Baixa contas, acompanha recebíveis/pagáveis |
| **Gestor de Estoque** | Controla inventário | Entrada/saída, alertas de mínimo |
| **Admin** | Configura workspace | Papéis, integrações, catálogo, automações |

### Perfil Social/Educacional

| Persona | Papel | Uso diário |
|---------|-------|-----------|
| **Atendente** | Primeiro contato | Cadastra beneficiários, cria agendamentos |
| **Assistente Social** | Acompanhamento familiar | Plano social, casos, histórico |
| **Coordenador de Programa** | Gestão de programas | Indicadores, revisão de atendimentos |
| **Gestor de Estoque** | Controle de doações físicas | Entrada de doações, saída por entrega |
| **Gestor Financeiro** | Centros de custo e doações | Orçamento por programa, prestação de contas |
| **Voluntário Técnico** | Executa atendimentos | Registra via WhatsApp (fluxo guiado) |
| **Diretoria** | Governança | Dashboard de impacto (leitura) |
| **DPO** | Conformidade LGPD | Logs, consentimentos, incidentes |
| **Financiador ESG** | Transparência | Portal de impacto e SROI |

---

## 4. Capacidades Alvo (resumo executivo)

### Preservar do Twenty CRM

- Empresa, Pessoa, Oportunidade (entidades base — cliente/parceiro no ERP)
- Workflow Engine (BullMQ + Trigger/Steps) — automação de negócios
- Timeline & Auditoria polimórfica — rastreabilidade automática
- Dashboard Engine — KPIs e indicadores
- Sistema de permissões (WorkspaceMember + Roles)
- API GraphQL — consumida por todos os módulos
- Multi-workspace / tenancy — multi-empresa e multi-instituto
- Attachments polimórficos — NF-e, contratos, documentos
- Busca full-text (TSVECTOR)

### Módulos ERP novos — Perfil Empresarial (V1)

- Catálogo de Produtos (SKU, preço, NCM/CEST)
- Pedidos de Venda (← Oportunidade CRM)
- Financeiro: Contas a Receber + Contas a Pagar
- Estoque (movimentação, alertas)
- Fiscal: NF-e e NFS-e (via serviço externo)
- Relatórios: DRE, Fluxo de Caixa

### Módulos ERP novos — Perfil Social (V1)

- Programas Institucionais
- Beneficiários e Famílias (person + family como registros mestres)
- Doações (donation_record com rastreio por parceiro e lote)
- Atendimentos / Agendamentos
- Indicadores de Impacto e SROI

### Simplificar ou adiar

- Connected Accounts (sync e-mail/calendário) — não prioritário V1
- Mensagens internas — substituível por WhatsApp (institutos) / e-mail externo (empresas)

---

## 5. Fluxos Centrais de Integração CRM ↔ ERP

### Fluxo Empresarial

```
Empresa/Pessoa (CRM) → Oportunidade (CRM)
    → [CLOSED_WON — Workflow automático]
    → Pedido de Venda (ERP)
    → Separação de Estoque → NF-e → Conta a Receber → Baixa
```

### Fluxo Social

```
Beneficiário/Família (ERP — registro mestre)
    → Serviço no catálogo (ERP)
    → Agendamento (CRM — IA/WhatsApp ou atendente)
    → Atendimento (CRM)
    → [Se produto físico] Baixa de Estoque (ERP)
    → Indicadores de Impacto → Relatório para Financiador
```

**Regra compartilhada:** O ERP é o sistema de registro mestre. O CRM consome registros do ERP e nunca cria dados mestres autonomamente.

---

## 6. Decisões Técnicas Confirmadas

| Decisão | Escolha | Justificativa |
|---------|---------|---------------|
| Stack | React / NestJS / TypeScript (existente) | Nenhuma nova linguagem |
| Modelo de extensão | `packages/twenty-erp` no monorepo Nx | Twenty Core intacto |
| Padrão de entidade ERP | `BaseWorkspaceEntity` + Standard Objects | Herda Timeline, busca, soft-delete, API gratuitamente |
| Fiscal | Microserviço externo (Focus NF-e / Nuvem Fiscal) | Complexidade fiscal BR delegada a especialista |
| Analytics | ClickHouse (já existente) | Relatórios pesados fora do PostgreSQL transacional |
| Deploy | Self-hosted e cloud via multi-workspace | Sem nova arquitetura de infra |

---

## 7. Restrições e Compliance

| Requisito | Perfil | Prioridade |
|-----------|--------|-----------|
| NF-e (SEFAZ) | Empresarial | V1 |
| NFS-e (Prefeitura) | Empresarial | V1 |
| LGPD | Ambos | V1 — crítico para institutos (dados sensíveis) |
| PIX / Boleto / Open Finance | Empresarial | Fase 2 |
| Multi-empresa / multi-CNPJ | Ambos | Via multi-workspace existente |
| Prestação de contas a financiadores (SROI) | Social | V1 |
| Portal de transparência (anonimizado) | Social | V1 |

---

## 8. Nível de Ousadia

**Balanceado** — Twenty como core de CRM preservado integralmente. ERP construído como camada de módulos adjacentes no mesmo monorepo, integrados via Workflow Engine e GraphQL nativos. Sem redesenho de UI; reutiliza `twenty-ui` e padrões existentes.

---

## 9. Visão em 12 meses

Produto funcional com dois perfis de workspace configuráveis (empresarial e social/instituto), com CRM preservado, módulos ERP comerciais básicos (Pedidos, Estoque, Financeiro, NF-e) e módulos sociais (Programas, Beneficiários, Doações, Atendimentos, Indicadores). O diferencial: **único sistema que atende empresas B2B e institutos sociais com a mesma base técnica**, sem adaptar ERP genérico ao contexto social.

---

*Fonte: `evolution/intent_interview.md` · Instituto ISOFÉ · 2026-05-12*
