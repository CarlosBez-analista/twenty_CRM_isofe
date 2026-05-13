# Tabela de Todos os Tokens — Twenty UI

> **Fonte:** `theme-light.css`, arquivos TypeScript de constantes
> **Confiança:** 🟢 CONFIRMADO (exceto seção Delta)
> **Convenção de nomenclatura:** `--t-{categoria}-{subcategoria}-{variante}`

---

## Ícones

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-icon-size-sm` | `14px` | Ícone inline em texto |
| `--t-icon-size-md` | `16px` | Ícone padrão |
| `--t-icon-size-lg` | `20px` | Ícone de ação |
| `--t-icon-size-xl` | `24px` | Ícone hero / botão grande |
| `--t-icon-stroke-sm` | `1.6` | Traço fino |
| `--t-icon-stroke-md` | `2` | Traço padrão |
| `--t-icon-stroke-lg` | `2.5` | Traço bold |

---

## Tipografia

| Token | Valor |
|-------|-------|
| `--t-font-family` | `Inter, sans-serif` |
| `--t-font-size-xxs` | `0.625rem` |
| `--t-font-size-xs` | `0.85rem` |
| `--t-font-size-sm` | `0.92rem` |
| `--t-font-size-md` | `1rem` |
| `--t-font-size-lg` | `1.23rem` |
| `--t-font-size-xl` | `1.54rem` |
| `--t-font-size-xxl` | `1.85rem` |
| `--t-font-weight-regular` | `400` |
| `--t-font-weight-medium` | `500` |
| `--t-font-weight-semi-bold` | `600` |
| `--t-text-line-height-lg` | `1.5` |
| `--t-text-line-height-md` | `1.1` |
| `--t-font-color-primary` | p3(0.2,0.2,0.2) ≈ `#333` |
| `--t-font-color-secondary` | p3(0.4,0.4,0.4) ≈ `#666` |
| `--t-font-color-tertiary` | p3(0.6,0.6,0.6) ≈ `#999` |
| `--t-font-color-light` | p3(0.702,...) ≈ `#B3B3B3` |
| `--t-font-color-extra-light` | p3(0.8,...) ≈ `#CCCCCC` |
| `--t-font-color-inverted` | `#FFFFFF` |
| `--t-font-color-danger` | p3(0.83,0.329,0.324) ≈ `#D35352` |
| `--t-code-font-family` | `DM Mono` |

---

## Espaçamento

| Token | Valor |
|-------|-------|
| `--t-spacing-0` | `0px` |
| `--t-spacing-0_5` | `2px` |
| `--t-spacing-1` | `4px` |
| `--t-spacing-1_5` | `6px` |
| `--t-spacing-2` | `8px` |
| `--t-spacing-3` | `12px` |
| `--t-spacing-4` | `16px` |
| `--t-spacing-5` | `20px` |
| `--t-spacing-6` | `24px` |
| `--t-spacing-7` | `28px` |
| `--t-spacing-8` | `32px` |
| `--t-spacing-9` | `36px` |
| `--t-spacing-10` | `40px` |
| `--t-spacing-12` | `48px` |
| `--t-spacing-16` | `64px` |
| `--t-spacing-20` | `80px` |
| `--t-spacing-24` | `96px` |
| `--t-spacing-32` | `128px` |

---

## Border

| Token | Valor |
|-------|-------|
| `--t-border-radius-xs` | `2px` |
| `--t-border-radius-sm` | `4px` |
| `--t-border-radius-md` | `8px` |
| `--t-border-radius-xl` | `20px` |
| `--t-border-radius-xxl` | `40px` |
| `--t-border-radius-pill` | `999px` |
| `--t-border-radius-rounded` | `100%` |
| `--t-border-color-strong` | `#D6D6D6` |
| `--t-border-color-medium` | `#EBEBEB` |
| `--t-border-color-light` | `#F1F1F1` |
| `--t-border-color-inverted` | `#333333` |
| `--t-border-color-danger` | `#FBC7C7` |
| `--t-border-color-blue` | `#AEBDF4` |

---

## Sombras (Box Shadow)

| Token | Valor |
|-------|-------|
| `--t-box-shadow-light` | `0px 2px 4px rgba(0,0,0,0.039), 0px 0px 4px rgba(0,0,0,0.078)` |
| `--t-box-shadow-strong` | `2px 4px 16px rgba(0,0,0,0.161), 0px 2px 4px rgba(0,0,0,0.078)` |
| `--t-box-shadow-underline` | `0px 1px 0px rgba(0,0,0,0.361)` |
| `--t-box-shadow-super-heavy` | `0px 0px 8px ..., 0px 8px 64px ..., 0px 24px 56px ...` |

---

## Animação

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-animation-duration-instant` | `0.075s` | Micro interações |
| `--t-animation-duration-fast` | `0.15s` | Hover, botão |
| `--t-animation-duration-normal` | `0.3s` | Transições de UI |
| `--t-animation-duration-slow` | `1.5s` | Animações longas (loading) |
| `--t-clickable-element-background-transition` | `background 0.1s ease` | Padrão para clicáveis |

---

## Layout / Modal

| Token | Valor |
|-------|-------|
| `--t-modal-size-sm-width` | `300px` |
| `--t-modal-size-md-width` | `400px` |
| `--t-modal-size-lg-width` | `53%` |
| `--t-modal-size-xl-width` | `1200px` |
| `--t-modal-size-xl-height` | `800px` |
| `--t-modal-size-fullscreen-width` | `100dvw` |
| `--t-modal-size-fullscreen-height` | `100dvh` |
| `--t-side-panel-width` | `500px` |
| `--t-last-layer-z-index` | `2147483647` |

---

## Componente: Button

| Propriedade | Valores disponíveis |
|-------------|-------------------|
| `variant` | `primary` \| `secondary` \| `tertiary` |
| `accent` | `default` \| `blue` \| `danger` |
| `size` | `medium` (32px altura) \| `small` (24px altura) |
| `position` | `standalone` \| `left` \| `middle` \| `right` |
| `inverted` | `boolean` |
| `fullWidth` | `boolean` |
| `isLoading` | `boolean` |

---

## Componentes Existentes no `twenty-ui`

| Componente | Localização | Variantes / Props principais |
|-----------|------------|------------------------------|
| `Button` | `input/button/Button` | variant, accent, size, position, inverted |
| `IconButton` | `input/button/IconButton` | size, accent, variant |
| `FloatingButton` | `input/button/FloatingButton` | — |
| `MainButton` | `input/button/MainButton` | — |
| `LightButton` | `input/button/LightButton` | — |
| `TabButton` | `input/button/TabButton` | — |
| `ButtonGroup` | `input/button/ButtonGroup` | — |
| `Chip` | `components/chip` | — |
| `LinkChip` | `components/chip` | — |
| `Tag` | `components/tag` | 28 cores via `color` prop |
| `Pill` | `components/Pill` | — |
| `Avatar` | `display/avatar` | size: sm/md/lg/xl, type |

---

## Delta ERP — Tokens a Adicionar

> 🔴 Tokens inexistentes. Devem ser adicionados em `packages/twenty-ui/src/theme/constants/` antes de implementar telas ERP.

### Cores Semânticas ERP

```css
/* Fiscal */
--t-erp-fiscal-emitida: var(--t-color-green);
--t-erp-fiscal-cancelada: var(--t-color-red);
--t-erp-fiscal-contingencia: var(--t-color-orange);
--t-erp-fiscal-pendente: var(--t-color-gray);

/* Estoque */
--t-erp-stock-ok: var(--t-color-green);
--t-erp-stock-alert: var(--t-color-amber);
--t-erp-stock-zero: var(--t-color-red);

/* Aprovação / Pedido */
--t-erp-approval-draft: var(--t-color-gray);
--t-erp-approval-pending: var(--t-color-orange);
--t-erp-approval-approved: var(--t-color-blue);
--t-erp-approval-rejected: var(--t-color-red);
--t-erp-approval-invoiced: var(--t-color-green);

/* Social */
--t-erp-social-active: var(--t-color-green);
--t-erp-social-suspended: var(--t-color-orange);
--t-erp-social-at-risk: var(--t-color-red);
```

### Layout ERP

```css
--t-erp-table-row-height: 40px;
--t-erp-table-row-height-compact: 32px;
--t-erp-form-section-gap: 24px;
--t-erp-split-panel-min-width: 320px;
```

### Tipografia ERP Compacta

```css
--t-font-size-table-compact: 0.8rem;
--t-font-weight-table-header: 600;
--t-text-line-height-compact: 1.0;
```
