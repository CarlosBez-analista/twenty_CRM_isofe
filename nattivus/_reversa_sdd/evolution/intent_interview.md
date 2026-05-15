# Entrevista de Intenção — Produto Expandido CRM + ERP

> **Projeto:** twenty-crm-erp
> **Fase:** Evolve — Coleta de Intenção
> **Status:** ✅ Preenchido
> **Diretriz central:** _O ERP é o sistema de registro mestre. O CRM serve ao ERP como camada de relacionamento._

---

## Como preencher

Responda diretamente abaixo de cada questão.
Use `[x]` para marcar opções de múltipla escolha ou escreva livremente na área `> Resposta:`.
Não há resposta errada — o objetivo é capturar sua visão.

---

## Q1 — Público-alvo do produto expandido

> Para quem é o produto? Quem vai operar o CRM+ERP no dia a dia?

**Opções:**

- [x] (A) Pequenas empresas brasileiras — foco: simplicidade, NF-e, moeda BRL
- [x] (B) Médias empresas B2B — foco: multi-filial, controle de estoque, aprovação de compras
- [ ] (C) Uso interno da própria operação (produto para consumo próprio)
- [x] (D) Outro

> **Resposta / Contexto:**
>
> Produto multi-perfil com dois segmentos distintos compartilhando a mesma base técnica:
>
> 1. **Empresas comerciais** (pequenas e médias, física ou online): precisam de ERP+CRM integrado com fluxo comercial completo — Oportunidade → Pedido → NF-e → Financeiro.
> 2. **Institutos educacionais e sociais** (ex.: ISOFÉ): precisam de gestão de beneficiários/famílias, programas sociais, estoque de doações, controle de atendimentos e prestação de contas a financiadores com indicadores de impacto (SROI).
>
> Os dois perfis usam a mesma plataforma. Módulos são ativados por perfil de workspace — um workspace empresarial não vê os módulos sociais, e vice-versa.

---

## Q2 — Módulos ERP desejados na V1

> Quais capacidades devem entrar na primeira versão do ERP?
> Marque com `[x]` os que devem entrar. Use `[r]` para "roadmap futuro" e `[n]` para "não entra".

| Módulo | Incluir? | Observações |
|--------|----------|-------------|
| Financeiro (contas a pagar / receber / fluxo de caixa) | `[x]` | Empresas: contas a receber/pagar. Institutos: centros de custo, registro de doações financeiras |
| Pedidos / Orçamentos (Oportunidade → Pedido → Fatura) | `[x]` | Empresas: fluxo comercial completo. Institutos: Serviço → Agendamento (variante do mesmo fluxo) |
| Estoque / Produtos (catálogo, movimentação, SKU) | `[x]` | Empresas: SKU e movimentação comercial. Institutos: cestas, kits, materiais, vagas — com rastreio por lote/parceiro |
| Compras (requisição, pedido de compra, fornecedores) | `[r]` | Roadmap — Fase 2 |
| Fiscal / NF-e (emissão de nota fiscal eletrônica, DANFE) | `[x]` | Apenas perfil empresarial. Integração via serviço externo (Focus NF-e ou Nuvem Fiscal) |
| Relatórios operacionais (DRE, Balanço, dashboards financeiros) | `[x]` | Empresas: DRE, Fluxo de Caixa. Institutos: indicadores de impacto social, SROI, prestação de contas |
| Projetos / Contratos (gestão de escopo, marcos, entregas) | `[r]` | Roadmap |
| RH / Equipe (colaboradores, folha simplificada, férias) | `[n]` | Fora do escopo V1 |

> **Contexto adicional / módulos extras (exclusivos para institutos sociais):**
>
> Os módulos abaixo não existem em ERPs comerciais tradicionais e são necessários para o perfil de institutos:
>
> - **Programas Institucionais** `[x]` — frentes de impacto social (Saúde, Jurídico, Assistência, Educação, Esporte). Cada programa tem serviços, produtos, orçamento e financiador vinculados.
> - **Cadastro de Beneficiários e Famílias** `[x]` — entidades `person` e `family` como registros mestres no ERP, com índice de vulnerabilidade, consentimento LGPD e proteção especial para menores.
> - **Doações** `[x]` — `donation_record` com rastreio por parceiro, tipo (produto, dinheiro, hora voluntária), programa vinculado e comprovação de distribuição via estoque.

---

## Q3 — Integração CRM ↔ ERP

> A diretriz é que o ERP é o sistema de registro mestre e o CRM serve ao ERP. Como esse fluxo deve acontecer na prática?

O produto tem **dois fluxos de integração**, um para cada perfil:

---

### Fluxo comercial (empresas)

```
Empresa / Pessoa (CRM)
        ↓
Oportunidade (CRM)
        ↓
FECHADO GANHO  ← gatilho automático via Workflow
        ↓
Pedido de Venda (ERP)  ← criado com dados da Oportunidade
        ↓
Separação de Estoque → NF-e → Conta a Receber → Baixa Financeira
```

**Opções para o gatilho de transição:**

- [x] (A) Automático — "Fechado Ganho" na Oportunidade cria um Pedido no ERP via Workflow
- [ ] (B) Manual — usuário clica em "Converter para Pedido" na Oportunidade
- [ ] (C) Semi-automático — ERP é notificado e o operador confirma a criação do pedido
- [ ] (D) Outro

---

### Fluxo social (institutos)

```text
Beneficiário / Família (ERP — registro mestre)
        ↓
Serviço no catálogo (ERP — configurado pela equipe)
        ↓
Agendamento (CRM)  ← IA via WhatsApp ou atendente
        ↓
Check-in / Atendimento (CRM)
        ↓
[Se produto físico] Baixa de Estoque (ERP)  ← disparo automático do CRM
        ↓
Indicadores de Impacto (CRM + ERP) → Relatório para Financiador
```

**Gatilho:** registro de `service_attendance` no CRM dispara `stock_movement` no ERP quando o atendimento envolve produto físico.

---

> **Regra comum a ambos os fluxos:**
>
> A Empresa/Pessoa do CRM **é** o registro de cliente/parceiro no ERP — sem duplicação. Para institutos, o `person` e o `family` do ERP são os registros canônicos, consumidos pelo CRM como camada de relacionamento. O CRM **nunca cria dados mestres autonomamente**.

---

## Q4 — Stack e plataforma de desenvolvimento

> Onde e como o produto expandido vai rodar?

**Opções:**
- [ ] (A) Sobre o próprio Twenty open source — customizações internas, novos módulos dentro da plataforma
- [ ] (B) Stack separada — ERP em serviço/app independente que consome a API do Twenty (GraphQL/REST)
- [ ] (C) Sistema novo do zero — Twenty apenas como referência de modelo de domínio, nova implementação completa
- [x] (D) Híbrido — Twenty para CRM, novo pacote `packages/twenty-erp` dentro do mesmo monorepo Nx para os módulos ERP, integrados por API/eventos
- [ ] (E) Sem restrição definida ainda

> **Resposta / Contexto:**
>
> O Twenty Core **não é modificado**. Os módulos ERP são implementados como extensões no padrão `BaseWorkspaceEntity` + Standard Objects existente — herdando automaticamente Timeline, busca full-text, soft-delete e API GraphQL.
>
> Integrações externas (NF-e, NFS-e, PIX) ficam em microserviços leves desacoplados, acionados via Webhook do Workflow Engine nativo.
>
> - **Stack:** React / NestJS / TypeScript / PostgreSQL / ClickHouse (já existente — sem nova linguagem)
> - **Prazo V1:** indefinido — prioridade é validar o spike técnico (`PedidoWorkspaceEntity` mínimo) antes de comprometer o roadmap
> - **Restrições:** sem Java; self-hosted e cloud ambos suportados via multi-workspace

---

## Q5 — Nível de ousadia / ambição do produto

> Quão radical pode ser a mudança em relação ao Twenty atual?

- [ ] (A) **Conservador** — preservar ao máximo o Twenty, adicionar módulos ERP de forma incremental e não invasiva
- [x] (B) **Balanceado** — Twenty como core de CRM preservado integralmente. ERP construído como camada de módulos adjacentes dentro do mesmo monorepo, integrados via Workflow Engine e GraphQL nativos. Sem redesenho da UI; reutiliza `twenty-ui` e padrões existentes.
- [ ] (C) **Transformacional** — redesenhar para um produto totalmente novo onde CRM e ERP têm peso igual na arquitetura

> **Resposta / Contexto — visão de produto em 1 ano:**
>
> Em 12 meses: produto funcional com dois perfis de workspace configuráveis (empresarial e social/instituto), com CRM preservado, módulos ERP comerciais básicos (Pedidos, Estoque, Financeiro, NF-e) e módulos sociais (Programas, Beneficiários, Doações, Atendimentos, Indicadores de Impacto). O diferencial competitivo é ser o único sistema que atende com a mesma base técnica tanto empresas B2B quanto institutos sociais — sem adaptar um ERP genérico para o contexto social.

---

## Q6 — Capacidades do CRM atual que DEVEM ser preservadas

> O que do Twenty CRM é inegociável e deve existir no produto expandido?

> **Resposta:**
>
> - **Empresa, Pessoa, Oportunidade** — entidades base; são o cliente/parceiro/fornecedor no ERP e o beneficiário/parceiro no contexto social
> - **Workflow Engine** (BullMQ + Trigger/Steps) — cola entre CRM e ERP; automações de negócio e sociais
> - **Timeline & Auditoria polimórfica** — rastreabilidade automática de pedidos, atendimentos, movimentações de estoque
> - **Dashboard Engine** (PageLayout + Widget + ChartData) — KPIs comerciais e indicadores de impacto social sem nova infraestrutura de BI
> - **Sistema de permissões** (WorkspaceMember + Roles) — base do RBAC; controla quem aprova pedido, emite NF-e ou acessa dados sensíveis de beneficiários
> - **API GraphQL** — todos os módulos ERP são consumidos pelo mesmo cliente React/Apollo; integrações externas conectam pela mesma API
> - **Multi-workspace / tenancy** — suporte natural a multi-empresa, multi-CNPJ e multi-instituto sem nova arquitetura
> - **Attachments polimórficos** — XML NF-e, DANFE, contratos, documentos de beneficiários, laudos
> - **Busca full-text** (TSVECTOR) — busca por número de pedido, beneficiário, produto, NF-e

---

## Q7 — Capacidades do CRM atual que PODEM ser simplificadas ou descartadas

> O que não precisa migrar para o produto expandido, ou pode ser simplificado?

> **Resposta:**
>
> - **Connected Accounts** (sync de email/calendário) — não prioritário para V1; institutos usam WhatsApp, empresas usam email externo já integrado ao Workflow
> - **Módulo de mensagens interno** — substituível pelo canal WhatsApp (institutos) ou email via Connected Accounts (empresas); sem prioridade V1
> - **Integração de calendário** — agendamento próprio do módulo ERP cobre o caso de uso dos institutos; empresas usam calendário externo

---

## Q8 — Restrições e compliance

> Há restrições legais, fiscais ou de integração que o produto deve respeitar?

**Checklist inicial:**

- [x] Emissão de NF-e (Nota Fiscal Eletrônica) — SEFAZ — para perfil empresarial
- [x] NFS-e (Nota Fiscal de Serviço Eletrônica) — Prefeitura — para perfil empresarial de serviços
- [x] LGPD — crítico para ambos os perfis; especialmente sensível nos institutos (dados de saúde, jurídicos, menores de idade, situação socioeconômica)
- [x] Integração com banco (PIX, boleto, Open Finance) — para perfil empresarial, Fase 2
- [ ] Integração com marketplace (Mercado Livre, Shopify, etc.) — roadmap distante, não entra V1
- [x] Multi-empresa / multi-CNPJ — via multi-workspace já existente
- [x] Prestação de contas a financiadores (relatórios SROI, impacto social anonimizado) — obrigatório para institutos

> **Contexto adicional:**
>
> Para institutos: toda entidade com dado pessoal sensível (saúde, jurídico, menor de idade) exige `lgpd_sensitivity` e controle de acesso por perfil (RBAC). O consentimento LGPD deve ser coletado no cadastro e renovado periodicamente. O DPO precisa de acesso a logs de auditoria sem acesso ao conteúdo dos atendimentos.
>
> Para empresas: NF-e e NFS-e são delegadas a serviço externo especializado (Focus NF-e / Nuvem Fiscal) via API — sem implementar o stack fiscal interno.

---

## Observações livres

> O produto precisa de uma identidade própria separada do "Twenty CRM". Sugestões de nome a avaliar: `Vinte`, `Twenty One`, `TwentyOps`, `Nexus`. A decisão impacta o modelo de negócio (open source com módulos premium pagos vs. produto fechado).
>
> O módulo social (institutos) é um diferencial competitivo sem concorrente direto no mercado brasileiro — nenhum ERP/CRM convencional atende bem institutos sem adaptações caras. Esse nicho merece atenção estratégica na V1.

---

## Histórico de preenchimento

| Data       | Seção preenchida  | Autor                       |
|------------|-------------------|-----------------------------|
| 2026-05-12 | Q1 a Q8 completas | CarlosBez-analista + Claude |

---

> **Próximo passo:** Rode `/reversa-evolve` — o agente lerá este arquivo e gerará os 8 artefatos de evolução automaticamente sem refazer a entrevista.
