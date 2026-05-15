# Tipografia — Twenty UI

> **Fonte:** `FontCommon.ts`, `theme-light.css`
> **Confiança:** 🟢 CONFIRMADO

---

## Famílias

| Uso | Família | Fallback |
|-----|---------|---------|
| Interface geral | **Inter** | `sans-serif` |
| Código / monospace | **DM Mono** | — |

Token CSS: `--t-font-family: Inter, sans-serif`
Token CSS: `--t-code-font-family: DM Mono`

---

## Escala de Tamanhos

| Token | Valor rem | Valor px (base 16px) | Uso típico |
|-------|-----------|---------------------|-----------|
| `--t-font-size-xxs` | `0.625rem` | `10px` | Caption micro, badges |
| `--t-font-size-xs` | `0.85rem` | `13.6px` | Labels, placeholders, meta |
| `--t-font-size-sm` | `0.92rem` | `14.7px` | Corpo secundário, tooltips |
| `--t-font-size-md` | `1rem` | `16px` | Corpo padrão, botões |
| `--t-font-size-lg` | `1.23rem` | `19.7px` | Subtítulo, section header |
| `--t-font-size-xl` | `1.54rem` | `24.6px` | Título de página |
| `--t-font-size-xxl` | `1.85rem` | `29.6px` | Hero, título principal |

---

## Pesos

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-font-weight-regular` | `400` | Corpo |
| `--t-font-weight-medium` | `500` | Botões, labels, labels de campo |
| `--t-font-weight-semi-bold` | `600` | Títulos, seção headers |

---

## Line Height

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-text-line-height-lg` | `1.5` | Corpo de texto longo (parágrafos) |
| `--t-text-line-height-md` | `1.1` | Títulos, elementos compactos |

---

## Cores de Fonte

| Token | Valor aprox. | Uso |
|-------|-------------|-----|
| `--t-font-color-primary` | `#333333` | Texto principal |
| `--t-font-color-secondary` | `#666666` | Texto secundário, labels |
| `--t-font-color-tertiary` | `#999999` | Placeholder, disabled |
| `--t-font-color-light` | `#B3B3B3` | Caption, meta info |
| `--t-font-color-extra-light` | `#CCCCCC` | Disabled state |
| `--t-font-color-inverted` | `#FFFFFF` | Texto em fundo escuro |
| `--t-font-color-danger` | `#D35352` | Mensagem de erro inline |

---

## Hierarquia de Uso (ERP — Recomendação)

| Nível | Tamanho | Peso | Uso ERP |
|-------|---------|------|---------|
| Page title | `xl` (24.6px) | `semiBold` | "Pedidos de Venda", "Estoque" |
| Section header | `lg` (19.7px) | `semiBold` | "Itens do Pedido", "Financeiro" |
| Card title | `md` (16px) | `medium` | Nome do pedido, número |
| Body | `md` (16px) | `regular` | Descrições, observações |
| Table cell | `sm` (14.7px) | `regular` | Conteúdo de linhas de tabela |
| Label / caption | `xs` (13.6px) | `medium` | Cabeçalho de coluna, meta |
| Badge / chip | `xxs` (10px) | `medium` | Status fiscal, código |

> 🟡 **INFERIDO** — a hierarquia ERP é uma projeção sobre os tokens existentes. Não há hierarquia explícita documentada no `twenty-ui` para módulos ERP.

---

## Delta ERP — Tipografia Compacta

O `twenty-ui` não possui variante `compact` para tabelas densas (listas de pedidos, extratos financeiros, aging de recebíveis). É necessário definir:

| Proposta | Valor | Contexto |
|----------|-------|---------|
| `--t-font-size-table-compact` | `0.8rem` (12.8px) | Tabelas de muitas colunas |
| `--t-font-weight-table-header` | `600` | Cabeçalho de coluna de tabela |
| `--t-text-line-height-compact` | `1.0` | Linhas de tabela compacta |
