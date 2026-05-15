# Novas Capacidades — Módulos ERP

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fontes:** `intent_interview.md`, `ideas/ideia_ERP_CRM-01.md`, `ideas/ERP_CRM_stakeholders-claude.md`, `ideas/Ecossistema Servicos Produtos Isofe Detalhado_claude.md`

---

## Convenções

- **Confiança 🟢** = baseado em artefato existente (ISOFÉ / Twenty)
- **Confiança 🟡** = inferido a partir da intenção ou produto base
- **Confiança 🔴** = decisão pendente

---

## MÓDULO 1 — Catálogo de Produtos

**Responsabilidade:** Repositório central de produtos e serviços com preço, unidade, NCM/CEST.

**Entidades novas:**

### `Produto` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'produtos', labelSingular: 'Produto' })
export class ProdutoWorkspaceEntity extends BaseWorkspaceEntity {
  sku: string;                    // Código do produto
  nome: string;
  descricao: string;
  preco: number;
  unidade: ProdutoUnidadeEnum;    // UN, KG, CX, M, L, etc.
  ncm: string;                    // Código NCM para NF-e
  cest: string;                   // Código CEST
  ativo: boolean;
  categoria: CategoriaProduto;    // Relação
  estoqueAtual: number;           // Campo calculado ou referência ao inventário
}
```

### `CategoriaProduto` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'categoriasProduto' })
export class CategoriaProdutoWorkspaceEntity extends BaseWorkspaceEntity {
  nome: string;
  descricao: string;
}
```

**Conexão com entidades existentes:**
- `Company` (fornecedor do produto) via `erpType = FORNECEDOR`
- `MovimentacaoDeEstoque` (entrada/saída)

**APIs/Eventos:**
- `GET /produtos` — listagem com filtro por categoria e ativo
- `GET /produtos/:id/estoque` — saldo atual

**Dependências:** Nenhuma — módulo fundação.

**Riscos:** NCM e CEST devem ser validados contra tabela SEFAZ — manter tabela de referência separada.

**Confiança:** 🟡

---

## MÓDULO 2 — Pedidos de Venda

**Responsabilidade:** Pedido originado de Oportunidade CRM; gerencia ciclo de vida comercial até faturamento.

**Entidades novas:**

### `PedidoDeVenda` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'pedidosDeVenda', labelSingular: 'Pedido de Venda' })
export class PedidoDeVendaWorkspaceEntity extends BaseWorkspaceEntity {
  numero: number;                   // Sequencial automático por workspace
  status: PedidoStatusEnum;         // RASCUNHO | APROVADO | FATURADO | CANCELADO
  valorTotal: number;
  empresa: CompanyWorkspaceEntity;  // ← CRM Company (cliente)
  contato: PersonWorkspaceEntity;   // ← CRM Person (contato)
  oportunidade: OpportunityWorkspaceEntity; // ← rastreabilidade CRM
  itens: PedidoItemWorkspaceEntity[];
  notaFiscalNumero: string;
  notaFiscalXmlUrl: string;         // URL do XML no storage
  dataEntregaPrevista: Date;
  observacoes: string;
}
```

### `ItemDePedido` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'itensDePedido' })
export class ItemDePedidoWorkspaceEntity extends BaseWorkspaceEntity {
  pedido: PedidoDeVendaWorkspaceEntity;
  produto: ProdutoWorkspaceEntity;
  quantidade: number;
  precoUnitario: number;
  desconto: number;
  total: number;                    // calculado: (quantidade * precoUnitario) - desconto
}
```

### `Orcamento` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'orcamentos' })
export class OrcamentoWorkspaceEntity extends BaseWorkspaceEntity {
  numero: number;
  status: OrcamentoStatusEnum;      // RASCUNHO | ENVIADO | APROVADO | RECUSADO | EXPIRADO
  validade: Date;
  empresa: CompanyWorkspaceEntity;
  itens: ItemDeOrcamentoWorkspaceEntity[];
  pedidoGerado: PedidoDeVendaWorkspaceEntity; // quando convertido
}
```

**Conexão com entidades existentes:**
- `Opportunity` (origem do pedido) — campo `oportunidade` + `origemCrm`
- `Company` (cliente) — mesmo registro do CRM, sem duplicação
- `Person` (contato) — mesmo registro do CRM
- `Timeline` — cada mudança de status registrada automaticamente
- `Workflow` — trigger `CLOSED_WON` → cria `PedidoDeVenda`

**APIs/Eventos:**
- `POST /pedidos-de-venda/create-from-opportunity` — chamado pelo Workflow
- `PATCH /pedidos-de-venda/:id/aprovar` — muda status para `APROVADO`
- `PATCH /pedidos-de-venda/:id/faturar` — dispara NF-e + cria `ContaAReceber`

**Automações Workflow:**

| Gatilho | Ação |
|---------|------|
| `Opportunity.stage = CLOSED_WON` | Cria `PedidoDeVenda` com status `RASCUNHO` |
| `PedidoDeVenda.status = APROVADO` | Reserva estoque + notifica operador |
| `PedidoDeVenda.status = FATURADO` | Chama `erp-fiscal-service` (NF-e) + cria `ContaAReceber` |
| `PedidoDeVenda.status = CANCELADO` | Libera reserva de estoque |

**Dependências:** Módulo Catálogo, Módulo Estoque, Módulo Financeiro, `erp-fiscal-service`.

**Riscos:** 🟡 GAP-M02: verificar passagem de contexto de variáveis no Workflow antes de implementar o trigger `CLOSED_WON`.

**Confiança:** 🟡

---

## MÓDULO 3 — Estoque

**Responsabilidade:** Controle de inventário com movimentações rastreáveis. Compartilhado entre perfil empresarial e social.

**Entidades novas:**

### `MovimentacaoDeEstoque` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'movimentacoesDeEstoque' })
export class MovimentacaoDeEstoqueWorkspaceEntity extends BaseWorkspaceEntity {
  produto: ProdutoWorkspaceEntity;
  tipo: MovimentacaoTipoEnum;       // ENTRADA | SAIDA | AJUSTE | PERDA | TRANSFERENCIA
  quantidade: number;
  dataMovimentacao: Date;
  origemPedido: PedidoDeVendaWorkspaceEntity;    // empresarial
  origemAtendimento: string;        // ID de ServiceAttendance (social) — string FK externa
  parceiro: CompanyWorkspaceEntity; // fornecedor ou doador
  centroDeCusto: CentroDeCustoWorkspaceEntity;
  lote: string;                     // social: número do lote da doação
  validade: Date;                   // social: validade do produto físico
  observacoes: string;
}
```

### `Localizacao` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'localizacoes' })
export class LocalizacaoWorkspaceEntity extends BaseWorkspaceEntity {
  nome: string;                     // "Depósito Central", "Polo Norte"
  tipo: LocalizacaoTipoEnum;        // DEPOSITO | POLO | PRATELEIRA
  parent: LocalizacaoWorkspaceEntity; // hierarquia
}
```

**Conexão com entidades existentes:**
- `PedidoDeVenda` (saída comercial)
- `Company` (fornecedor — entrada; doador — social)
- `Workflow` — cron de alerta de estoque mínimo

**Automações Workflow:**

| Gatilho | Ação |
|---------|------|
| `estoqueAtual < estoqueMinimo` (Cron diário) | Cria `Task` para o Gestor de Estoque |
| `PedidoDeVenda.status = APROVADO` | Cria `MovimentacaoDeEstoque` (tipo: RESERVA) |
| Webhook do CRM (`ServiceAttendance` com produto) | Cria `MovimentacaoDeEstoque` (tipo: SAIDA) |

**Dependências:** Módulo Catálogo.

**Confiança:** 🟡 (empresarial), 🟢 (social — baseado no modelo ISOFÉ)

---

## MÓDULO 4 — Financeiro

**Responsabilidade:** Contas a receber, contas a pagar, lançamentos e centros de custo.

**Entidades novas:**

### `ContaAReceber` (Standard Object ERP)

```typescript
@WorkspaceObject({ namePlural: 'contasAReceber' })
export class ContaAReceberWorkspaceEntity extends BaseWorkspaceEntity {
  pedido: PedidoDeVendaWorkspaceEntity;
  empresa: CompanyWorkspaceEntity;
  valor: number;
  vencimento: Date;
  status: ContaStatusEnum;          // ABERTA | PARCIAL | PAGA | VENCIDA | CANCELADA
  dataPagamento: Date;
  valorPago: number;
  formaPagamento: FormaPagamentoEnum; // PIX | BOLETO | CARTAO | TRANSFERENCIA | DINHEIRO
  comprovante: string;              // URL do comprovante no storage
}
```

### `CentroDeCusto` (Standard Object ERP)

Compartilhado entre perfil empresarial e social.

```typescript
@WorkspaceObject({ namePlural: 'centrosDeCusto' })
export class CentroDeCustoWorkspaceEntity extends BaseWorkspaceEntity {
  nome: string;
  programa: ProgramaWorkspaceEntity;    // social: programa vinculado
  fonteDeRecurso: CompanyWorkspaceEntity; // social: financiador
  orcamento: number;
  gasto: number;
  status: CentroDeCustoStatusEnum;   // ATIVO | ENCERRADO | BLOQUEADO
}
```

**Automações Workflow:**

| Gatilho | Ação |
|---------|------|
| `PedidoDeVenda.status = FATURADO` | Cria `ContaAReceber` com vencimento calculado |
| `ContaAReceber.vencimento = HOJE` (Cron) | Envia cobrança (e-mail via `twenty-emails`) |
| `ContaAReceber.status = VENCIDA` | Cria `Task` para o Gestor Financeiro |

**Dependências:** Módulo Pedidos, `erp-payment-service` (Fase 2 — PIX/boleto).

**Confiança:** 🟡

---

## MÓDULO 5 — Fiscal (NF-e / NFS-e)

**Responsabilidade:** Emissão de documentos fiscais via serviço externo. O produto não implementa stack fiscal internamente.

**Arquitetura:**

```
PedidoDeVenda (ERP)
    ↓ [Workflow: status = FATURADO]
erp-fiscal-service (Node.js)
    ↓ [HTTP POST]
Focus NF-e API / Nuvem Fiscal API
    ↓ [SEFAZ]
XML autorizado + DANFE
    ↓ [Webhook de retorno]
Twenty Storage (attachment em PedidoDeVenda)
PedidoDeVenda.notaFiscalNumero atualizado
```

**Dados necessários por entidade:**

| Dado | Origem |
|------|--------|
| CNPJ emitente | Workspace config |
| CNPJ/CPF destinatário | `Company.documentoFiscal` ou `Person.cpf` |
| Produtos com NCM, CEST, preço | `Produto.ncm`, `Produto.cest`, `ItemDePedido.preco` |
| Valor total, frete, desconto | `PedidoDeVenda` |
| Endereço de entrega | `Company.address` |
| Regime tributário | Workspace config |

**Microserviço:** `erp-fiscal-service`
- Runtime: Node.js + TypeScript
- Integração: Focus NF-e ou Nuvem Fiscal (🟣 decisão pendente D1)
- Comunicação: Webhook bidirecional via Workflow Engine

**Confiança:** 🔴 (decisão D1 pendente — parceiro fiscal)

---

## MÓDULO 6 — Relatórios Gerenciais (ClickHouse)

**Responsabilidade:** Dashboards analíticos sobre dados do ERP usando a infraestrutura ClickHouse existente.

**Relatórios planejados — Perfil Empresarial:**

| Relatório | Fonte | Widget |
|-----------|-------|--------|
| DRE (Demonstrativo de Resultado) | `ContaAReceber` + `ContaAPagar` (Fase 2) | Tabela + Gráfico de barras |
| Fluxo de Caixa | `ContaAReceber` + `Lancamento` | Gráfico de linha por período |
| Aging de Recebíveis | `ContaAReceber` por faixa de vencimento | Tabela agrupada |
| Curva ABC de Produtos | `ItemDePedido` agrupado por produto | Gráfico de pareto |
| Ranking de Vendedores | `PedidoDeVenda` por `WorkspaceMember` | Tabela ordenada |

**Relatórios planejados — Perfil Social:**

| Relatório | Fonte | Widget |
|-----------|-------|--------|
| Atendimentos por pilar | `ServiceAttendance` | Gráfico de pizza / barras |
| Custo por atendimento | `CostCenter.gasto` ÷ count(`ServiceAttendance`) | KPI card |
| SROI | `DonationRecord` + `ServiceAttendance` + `ImpactIndicator` | KPI card |
| Mapa de vulnerabilidade | `Family.vulnerabilityScore` por bairro | Mapa de calor |
| Horas voluntárias | `DonationRecord` (tipo: HORA_VOLUNTARIA) | KPI + tendência |
| Pessoas capacitadas | `ServiceAttendance` (serviços educacionais) | KPI |

**Dependências:** ClickHouse (existente), Dashboard Engine (existente).

**Confiança:** 🟡 (estrutura de query a definir)

---

## MÓDULO 7 — Programas Institucionais (Social)

**Responsabilidade:** Frentes de impacto social do instituto. Unidade de gestão, orçamento e prestação de contas.

**Entidades novas:**

### `Programa` (Standard Object ERP — Social)

```typescript
@WorkspaceObject({ namePlural: 'programas', labelSingular: 'Programa' })
export class ProgramaWorkspaceEntity extends BaseWorkspaceEntity {
  nome: string;
  pilar: PilarEnum;                 // SAUDE | JURIDICO | ASSISTENCIA | EDUCACAO | ESPORTE
  descricao: string;
  financiador: CompanyWorkspaceEntity; // parceiro financiador (FK → Company)
  coordenador: PersonWorkspaceEntity;  // coordenador (FK → Person/WorkspaceMember)
  dataInicio: Date;
  dataFim: Date;
  status: ProgramaStatusEnum;       // PLANEJADO | ATIVO | PAUSADO | ENCERRADO
}
```

### `CatalogoDeServicos` (Standard Object ERP — Social)

```typescript
@WorkspaceObject({ namePlural: 'catalogosDeServicos' })
export class CatalogoDeServicosWorkspaceEntity extends BaseWorkspaceEntity {
  programa: ProgramaWorkspaceEntity;
  nome: string;
  pilar: PilarEnum;
  tipoServico: TipoServicoEnum;     // INDIVIDUAL | COLETIVO | RECORRENTE | EVENTO | REMOTO
  elegibilidade: string;
  exigeAgendamento: boolean;
  exigeDocumentos: boolean;
  duracaoMinutos: number;
  canal: CanalEnum;                 // PRESENCIAL | WHATSAPP | SITE | HIBRIDO
  sensibilidadeLgpd: SensibilidadeEnum; // BAIXA | MEDIA | ALTA | SENSIVEL
  ativo: boolean;
}
```

**Confiança:** 🟢 (baseado no modelo ISOFÉ)

---

## MÓDULO 8 — Beneficiários e Famílias (Social)

**Responsabilidade:** Cadastros mestres do sistema social. ERP é a fonte de verdade.

**Extensões em entidades existentes:**

### `Person` (estendido)

Campos adicionais para perfil social:
- `personType`: enum `['CONTATO', 'BENEFICIARIO', 'VOLUNTARIO', 'COLABORADOR']`
- `cpf`: string (criptografado em repouso — AES-256)
- `whatsapp`: string
- `consentStatus`: enum `['PENDENTE', 'CONCEDIDO', 'REVOGADO', 'EXPIRADO']`
- `birthDate`: Date (ativa proteção automática para menores)
- `disabilityStatus`: boolean
- `disabilityType`: string

### `Family` (Standard Object ERP — Social)

```typescript
@WorkspaceObject({ namePlural: 'familias', labelSingular: 'Família' })
export class FamilyWorkspaceEntity extends BaseWorkspaceEntity {
  responsavel: PersonWorkspaceEntity;
  membros: PersonWorkspaceEntity[];
  householdSize: number;
  rendaFaixa: RendaFaixaEnum;       // ATE_1SM | 1A2SM | 2A3SM | ACIMA_3SM | SEM_RENDA
  situacaoMoradia: MoradiaEnum;     // PROPRIA | ALUGADA | CEDIDA | OCUPACAO | RUA
  insegurancaAlimentar: InsegurancaEnum; // BAIXA | MODERADA | ALTA | CRITICA
  vulnerabilityScore: number;       // índice calculado 0-100
  territorio: string;               // bairro / comunidade
  ativo: boolean;
}
```

**Confiança:** 🟢 (baseado no modelo ISOFÉ)

---

## MÓDULO 9 — Atendimentos e Agendamentos (Social — CRM)

**Responsabilidade:** Execução e registro dos serviços. Consume registros mestres do ERP.

### `AgendamentoDeServico` (Standard Object CRM — Social)

Referencia entidades do ERP por ID. CRM não replica os dados mestres.

Campos principais:
- `serviceId` (FK → `CatalogoDeServicos`)
- `beneficiarioPerson` (FK → `Person`)
- `familia` (FK → `Family`)
- `dataHoraInicio`, `dataHoraFim`
- `status`: enum `['SOLICITADO', 'CONFIRMADO', 'REMARCADO', 'CONCLUIDO', 'FALTOU', 'CANCELADO']`
- `canalOrigem`: enum `['WHATSAPP', 'SITE', 'PRESENCIAL', 'TELEFONE']`
- `criadoPorIa`: boolean
- `qrCodeToken`: string
- `checkedInAt`: Date

### `RegistroDeAtendimento` (Standard Object CRM — Social)

Quando envolve produto físico, dispara `StockMovement` no ERP.

Campos principais:
- `agendamento` (FK → `AgendamentoDeServico`)
- `beneficiarioPerson` (FK → `Person`)
- `status`: enum `['REALIZADO', 'PARCIAL', 'NAO_COMPARECEU']`
- `resultado`: enum `['RESOLVIDO', 'ENCAMINHADO', 'EM_ACOMPANHAMENTO', 'SEM_ELEGIBILIDADE']`
- `resumo`: string (restrito — máximo de dados necessários)
- `proximoPasso`: string
- `privacidade`: enum `['OPERACIONAL', 'RESTRITO', 'SENSIVEL']`
- `erpStockMovementId`: string (ID do movimento disparado no ERP — quando houver)
- `exigeRevisao`: boolean

**Automações:**

| Gatilho | Ação |
|---------|------|
| `RegistroDeAtendimento` criado com produto físico | Webhook → ERP: cria `StockMovement` (SAIDA) |
| `RegistroDeAtendimento` por voluntário | Webhook → ERP: cria `DonationRecord` (HORA_VOLUNTARIA) |

**Confiança:** 🟢 (baseado no modelo ISOFÉ)

---

## MÓDULO 10 — Doações e Indicadores de Impacto (Social)

**Responsabilidade:** Rastreabilidade de doações e cálculo de SROI.

### `RegistroDeDoacao` (Standard Object ERP — Social)

```typescript
@WorkspaceObject({ namePlural: 'registrosDeDoacao' })
export class RegistroDeDoacaoWorkspaceEntity extends BaseWorkspaceEntity {
  parceiro: CompanyWorkspaceEntity;         // doador
  tipoDoacao: TipoDoacaoEnum;               // PRODUTO | DINHEIRO | SERVICO | HORA_VOLUNTARIA
  produto: ProdutoWorkspaceEntity;          // quando produto físico
  quantidade: number;
  valorEstimado: number;
  recebidoEm: Date;
  usoRestrito: boolean;
  programa: ProgramaWorkspaceEntity;        // programa vinculado
  comprovante: string;                      // URL no storage
}
```

### `IndicadorDeImpacto` (Standard Object CRM — Social)

```typescript
@WorkspaceObject({ namePlural: 'indicadoresDeImpacto' })
export class IndicadorDeImpactoWorkspaceEntity extends BaseWorkspaceEntity {
  programa: ProgramaWorkspaceEntity;
  servico: CatalogoDeServicosWorkspaceEntity;
  nomeIndicador: string;
  tipoIndicador: TipoIndicadorEnum;         // QUANTITATIVO | QUALITATIVO | FINANCEIRO | SROI
  periodo: string;                          // ex: "2026-05"
  valor: number;
  meta: number;
  fontesDados: string;                      // CRM | ERP | AMBOS
  anonimizado: boolean;
}
```

**Fórmula SROI:**

```
SROI = valor_social_gerado / investimento_total

valor_social_gerado =
  ∑ (atendimentos × valor_estimado_por_tipo_servico)   [CRM]
  + ∑ (produtos_distribuidos × valor_estimado)          [ERP]
  + ∑ (horas_voluntarias × valor_hora_referencia)       [ERP]

investimento_total =
  ∑ DonationRecord.valorEstimado (do parceiro)          [ERP]
```

🟣 **Decisão D5 pendente:** acordar metodologia SROI com o primeiro financiador antes de fixar os valores de referência.

**Confiança:** 🟢 (baseado no modelo ISOFÉ)

---

*Fontes: `ideas/ideia_ERP_CRM-01.md`, `ideas/ERP_CRM_stakeholders-claude.md`, `ideas/Ecossistema Servicos Produtos Isofe Detalhado_claude.md` · 2026-05-12*
