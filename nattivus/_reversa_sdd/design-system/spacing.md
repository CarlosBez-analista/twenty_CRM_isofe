# Espaçamento, Grid e Breakpoints — Twenty UI

> **Fonte:** `theme-light.css`, `theme-constants/constants.ts`
> **Confiança:** 🟢 CONFIRMADO

---

## Escala de Espaçamento

Base: `4px` (multiplicador: `--t-spacing-multiplicator: 4`)

| Token | Valor | Uso típico |
|-------|-------|-----------|
| `--t-spacing-0` | `0px` | Reset |
| `--t-spacing-0_5` | `2px` | Micro gap |
| `--t-spacing-1` | `4px` | Gap entre ícone e texto |
| `--t-spacing-1_5` | `6px` | — |
| `--t-spacing-2` | `8px` | Padding de botão, padding de chip |
| `--t-spacing-3` | `12px` | Padding de input |
| `--t-spacing-4` | `16px` | Padding interno padrão |
| `--t-spacing-5` | `20px` | — |
| `--t-spacing-6` | `24px` | Gap entre seções |
| `--t-spacing-8` | `32px` | Altura de botão medium |
| `--t-spacing-10` | `40px` | — |
| `--t-spacing-12` | `48px` | — |
| `--t-spacing-16` | `64px` | — |
| `--t-spacing-20` | `80px` | — |
| `--t-spacing-24` | `96px` | — |
| `--t-spacing-32` | `128px` | Max da escala |

> Escala completa: `spacing-0` até `spacing-32` (passo 4px). Frações disponíveis: `0_5` (2px) e `1_5` (6px).

---

## Tokens de Layout Especiais

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-between-siblings-gap` | `2px` | Gap entre elementos irmãos (ícones inline) |
| `--t-table-horizontal-cell-margin` | `8px` | Margem horizontal de célula de tabela |
| `--t-table-checkbox-column-width` | `32px` | Largura da coluna de checkbox |
| `--t-table-horizontal-cell-padding` | `8px` | Padding horizontal de célula |
| `--t-side-panel-width` | `500px` | Largura do painel lateral |

---

## Breakpoints

| Nome | Valor | Observação |
|------|-------|-----------|
| `MOBILE_VIEWPORT` | `768px` | Único breakpoint explícito definido em `constants.ts` |

> 🟡 **INFERIDO** — O projeto usa apenas `MOBILE_VIEWPORT = 768px` como breakpoint documentado. Breakpoints adicionais (tablet, desktop-large) não estão definidos explicitamente — são inferidos via `useIsMobile()` hook que testa `< 768px`.

---

## Tamanhos de Modal

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-modal-size-sm-width` | `300px` | Confirmação, alertas curtos |
| `--t-modal-size-md-width` | `400px` | Formulários simples |
| `--t-modal-size-lg-width` | `53%` | Formulários complexos |
| `--t-modal-size-xl-width` / height | `1200px × 800px` | Visualizações ricas |
| `--t-modal-size-fullscreen` | `100dvw × 100dvh` | Modo tela cheia |

---

## Z-index

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-last-layer-z-index` | `2147483647` | Camada absoluta superior (toasts, modais críticos) |

> 🔴 **LACUNA** — Não há escala z-index intermediária documentada. Camadas como dropdown, tooltip, modal, overlay dependem de valores hardcoded ou inferidos por posição no DOM.

---

## Blur (Glassmorphism)

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-blur-light` | `blur(6px) saturate(200%)...` | Painéis flutuantes |
| `--t-blur-medium` | `blur(12px) saturate(200%)...` | Overlays de modal |
| `--t-blur-strong` | `blur(20px) saturate(200%)...` | Fullscreen overlay |

---

## Delta ERP — Espaçamento

O sistema de espaçamento atual é suficiente para módulos ERP sem adições. Porém, faltam tokens semânticos de uso:

| Proposta | Valor sugerido | Contexto |
|----------|---------------|---------|
| `--t-erp-table-row-height` | `40px` (spacing-10) | Altura de linha em tabelas ERP |
| `--t-erp-table-row-height-compact` | `32px` (spacing-8) | Tabelas compactas (extrato, aging) |
| `--t-erp-form-section-gap` | `24px` (spacing-6) | Gap entre seções de formulário multi-step |
| `--t-erp-split-panel-min-width` | `320px` | Master no SplitView (pedido + itens) |
