# Entrevista de Intenção — Produto Expandido CRM + ERP

> **Projeto:** twenty-crm-erp
> **Fase:** Evolve — Coleta de Intenção
> **Status:** ⏳ Aguardando preenchimento
> **Diretriz central:** _O CRM serve ao ERP_ — o CRM é a camada comercial e relacional que alimenta a operação do ERP.

---

## Como preencher

Responda diretamente abaixo de cada questão.
Use `[x]` para marcar opções de múltipla escolha ou escreva livremente na área `> Resposta:`.
Não há resposta errada — o objetivo é capturar sua visão.

---

## Q1 — Público-alvo do produto expandido

> Para quem é o produto? Quem vai operar o CRM+ERP no dia a dia?

**Opções:**
- [ ] (A) Pequenas empresas brasileiras — foco: simplicidade, NF-e, moeda BRL
- [ ] (B) Médias empresas B2B — foco: multi-filial, controle de estoque, aprovação de compras
- [ ] (C) Uso interno da própria operação (produto para consumo próprio)
- [ ] (D) Outro

> **Resposta / Contexto:**
>
> _(escreva aqui)_

---

## Q2 — Módulos ERP desejados na V1

> Quais capacidades devem entrar na primeira versão do ERP?
> Marque com `[x]` os que devem entrar. Use `[r]` para "roadmap futuro" e `[n]` para "não entra".

| Módulo | Incluir? | Observações |
|--------|----------|-------------|
| Financeiro (contas a pagar / receber / fluxo de caixa) | `[ ]` | |
| Pedidos / Orçamentos (Oportunidade → Pedido → Fatura) | `[ ]` | |
| Estoque / Produtos (catálogo, movimentação, SKU) | `[ ]` | |
| Compras (requisição, pedido de compra, fornecedores) | `[ ]` | |
| Fiscal / NF-e (emissão de nota fiscal eletrônica, DANFE) | `[ ]` | |
| Relatórios operacionais (DRE, Balanço, dashboards financeiros) | `[ ]` | |
| Projetos / Contratos (gestão de escopo, marcos, entregas) | `[ ]` | |
| RH / Equipe (colaboradores, folha simplificada, férias) | `[ ]` | |

> **Contexto adicional / outros módulos:**
>
> _(escreva aqui)_

---

## Q3 — Integração CRM ↔ ERP

> A diretriz é que o CRM alimenta o ERP. Como esse fluxo deve acontecer na prática?

**Fluxo central esperado:**

```
[Empresa/Pessoa no CRM]
       ↓
[Oportunidade no CRM]
       ↓
[???] ← defina aqui como passa para o ERP
       ↓
[Pedido / Orçamento / Fatura no ERP]
```

**Opções para o gatilho de transição:**
- [ ] (A) Automático — "Fechado Ganho" na Oportunidade cria um Pedido no ERP automaticamente
- [ ] (B) Manual — usuário clica em "Converter para Pedido" na Oportunidade
- [ ] (C) Semi-automático — ERP é notificado e o operador confirma a criação do pedido
- [ ] (D) Outro

> **Resposta / Contexto — como os dados devem fluir do CRM para o ERP:**
>
> _(escreva aqui — ex.: quais campos da Oportunidade viram campos do Pedido, quem valida, etc.)_

---

## Q4 — Stack e plataforma de desenvolvimento

> Onde e como o produto expandido vai rodar?

**Opções:**
- [ ] (A) Sobre o próprio Twenty open source — customizações internas, novos módulos dentro da plataforma
- [ ] (B) Stack separada — ERP em serviço/app independente que consome a API do Twenty (GraphQL/REST)
- [ ] (C) Sistema novo do zero — Twenty apenas como referência de modelo de domínio, nova implementação completa
- [ ] (D) Híbrido — Twenty para CRM, novo serviço para ERP, integrados por API/eventos
- [ ] (E) Sem restrição definida ainda

> **Resposta / Contexto — stack preferida, restrições técnicas, prazo estimado:**
>
> _(escreva aqui — ex.: stack preferida React/Node, prazo 6 meses, restrição: sem Java)_

---

## Q5 — Nível de ousadia / ambição do produto

> Quão radical pode ser a mudança em relação ao Twenty atual?

- [ ] (A) **Conservador** — preservar ao máximo o Twenty, adicionar módulos ERP de forma incremental e não invasiva
- [ ] (B) **Balanceado** — Twenty como core de CRM, ERP construído como serviços adjacentes integrados
- [ ] (C) **Transformacional** — redesenhar para um produto totalmente novo onde CRM e ERP têm peso igual na arquitetura

> **Resposta / Contexto — visão de produto em 1 ano:**
>
> _(escreva aqui)_

---

## Q6 — Capacidades do CRM atual que DEVEM ser preservadas

> O que do Twenty CRM é inegociável e deve existir no produto expandido?

> **Resposta:**
>
> _(escreva aqui — ex.: gestão de contatos, funil de oportunidades, automações via Workflow, etc.)_

---

## Q7 — Capacidades do CRM atual que PODEM ser simplificadas ou descartadas

> O que não precisa migrar para o produto expandido, ou pode ser simplificado?

> **Resposta:**
>
> _(escreva aqui — ex.: módulo de mensagens, integração de calendário, etc.)_

---

## Q8 — Restrições e compliance

> Há restrições legais, fiscais ou de integração que o produto deve respeitar?

**Checklist inicial:**
- [ ] Emissão de NF-e (Nota Fiscal Eletrônica) — SEFAZ
- [ ] NFS-e (Nota Fiscal de Serviço Eletrônica) — Prefeitura
- [ ] LGPD — proteção de dados pessoais
- [ ] Integração com banco (PIX, boleto, Open Finance)
- [ ] Integração com marketplace (Mercado Livre, Shopify, etc.)
- [ ] Multi-empresa / multi-CNPJ
- [ ] Outra

> **Contexto adicional:**
>
> _(escreva aqui)_

---

## Observações livres

> Use este espaço para qualquer ideia, referência de produto, print de tela de concorrente ou visão que ainda não cabe nas perguntas acima.

> _(escreva aqui)_

---

## Histórico de preenchimento

| Data | Seção preenchida | Autor |
|------|------------------|-------|
| — | — | — |

---

> **Próximo passo:** Após preencher, rode `/reversa-evolve` novamente — o agente lerá este arquivo e gerará os 8 artefatos de evolução automaticamente sem refazer a entrevista.
