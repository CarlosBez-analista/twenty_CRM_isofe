# Paleta de Cores — Twenty UI

> **Fonte:** `packages/twenty-ui/src/theme-constants/theme-light.css` (gerado), `ColorsLight.ts`, `GrayScaleLight.ts`
> **Confiança:** 🟢 CONFIRMADO — extraído de arquivos de configuração

---

## Sistema de Cores

O Twenty UI usa `color(display-p3 ...)` (wide-gamut P3) como espaço de cor primário, com fallbacks hex para cores semânticas.

---

## 1. Accent (Azul — Cor Primária da Marca)

| Token CSS | Hex aproximado | Uso |
|-----------|---------------|-----|
| `--t-accent-primary` / `--t-accent-accent5` | `#D4DEFD` | Fundo destaque, hover |
| `--t-accent-secondary` | `#D4DEFD` | Secundário |
| `--t-accent-tertiary` / `--t-accent-accent3` | `#EDF2FC` | Focus ring background |
| `--t-accent-quaternary` / `--t-accent-accent2` | `#F8F9FF` | Hover sutil |
| `--t-accent-accent1` | `#FDFEFF` | Mais claro |
| `--t-accent-accent4` | `#E2EAFF` | — |
| `--t-accent-accent6` | `#C4D0FE` | — |
| `--t-accent-accent7` | `#AEBDF4` | — |
| `--t-accent-accent8` / `--t-accent-accent3570` | `#91A3EA` | Border azul |
| `--t-accent-accent9` | `#466FD5` | Azul principal |
| `--t-accent-accent10` | `#3C57CC` | Hover botão azul |
| `--t-accent-accent11` | `#415ABF` | — |
| `--t-accent-accent12` | `#222C59` | Mais escuro |

---

## 2. Background

| Token CSS | Valor | Uso |
|-----------|-------|-----|
| `--t-background-primary` | `#FFFFFF` | Fundo principal (cards, modais) |
| `--t-background-secondary` | `#FCFCFC` | Fundo padrão (app shell) |
| `--t-background-tertiary` | `#F1F1F1` | Hover padrão |
| `--t-background-quaternary` | `#EBEBEB` | Active / pressionado |
| `--t-background-inverted-primary` | `#333333` | Fundo invertido (dark elements) |
| `--t-background-inverted-secondary` | `#666666` | — |
| `--t-background-danger` | `#FBE8E8` | Fundo de erro / alerta destrutivo |
| `--t-background-transparent-primary` | `rgba(255,255,255,0.5)` | Glassmorphism |
| `--t-background-transparent-strong` | `rgba(0,0,0,0.161)` | Overlay forte |
| `--t-background-transparent-medium` | `rgba(0,0,0,0.078)` | Overlay médio |
| `--t-background-transparent-light` | `rgba(0,0,0,0.039)` | Overlay leve |
| `--t-background-transparent-lighter` | `rgba(0,0,0,0.02)` | Hover mínimo |
| `--t-background-transparent-danger` | `#F3000D14` | Fundo perigo transparente |
| `--t-background-transparent-blue` | `#0047F112` | Fundo info transparente |
| `--t-background-transparent-orange` | `#FF9C0029` | Fundo warning transparente |
| `--t-background-transparent-success` | `#00A43319` | Fundo sucesso transparente |
| `--t-background-overlay-primary` | `rgba(0,0,0,0.722)` | Modal overlay escuro |
| `--t-background-overlay-secondary` | `rgba(0,0,0,0.361)` | Overlay médio |
| `--t-background-overlay-tertiary` | `rgba(0,0,0,0.071)` | Overlay leve |

---

## 3. Cores Semânticas de Feedback

| Token CSS | Hex | Uso |
|-----------|-----|-----|
| `--t-snack-bar-success-color` | p3(0.297,0.637,0.581) ≈ `#4CA293` | Texto sucesso |
| `--t-snack-bar-success-background-color` | `#00A43319` | Fundo sucesso |
| `--t-snack-bar-error-color` | p3(0.83,0.329,0.324) ≈ `#D35352` | Texto erro |
| `--t-snack-bar-error-background-color` | `#F3000D14` | Fundo erro |
| `--t-snack-bar-warning-color` | p3(0.9,0.45,0.2) ≈ `#E67233` | Texto aviso |
| `--t-snack-bar-warning-background-color` | `#FF9C0029` | Fundo aviso |
| `--t-snack-bar-info-color` | p3(0.276,0.384,0.837) ≈ `#466FD5` | Texto informação |
| `--t-snack-bar-info-background-color` | `#0047F112` | Fundo informação |

---

## 4. Escala de Cinza (GrayScale)

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-gray-scale-gray1` | `#FFFFFF` | Branco puro |
| `--t-gray-scale-gray2` | `#FCFCFC` | Fundo secundário |
| `--t-gray-scale-gray3` | `#F9F9F9` | — |
| `--t-gray-scale-gray4` | `#F1F1F1` | — |
| `--t-gray-scale-gray5` | `#EBEBEB` | Border light |
| `--t-gray-scale-gray6` | `#D6D6D6` | Border medium |
| `--t-gray-scale-gray7` | `#CCCCCC` | — |
| `--t-gray-scale-gray8` | `#B3B3B3` | Font extra-light |
| `--t-gray-scale-gray9` | `#999999` | Font light |
| `--t-gray-scale-gray10` | `#838383` | Font tertiary |
| `--t-gray-scale-gray11` | `#666666` | Font secondary |
| `--t-gray-scale-gray12` | `#333333` | Font primary |

---

## 5. Cores Nomeadas (Named Colors — usadas via `--t-color-*`)

O sistema define cores nomeadas em escala completa. Cores principais:

| Nome | Hex aprox. | Uso principal |
|------|-----------|---------------|
| `blue` | `#466FD5` | Accent primário, links, botão CTA |
| `red` | `#D35352` | Erros, ações destrutivas |
| `green` | `#54A170` | Sucesso, status ativo |
| `orange` | `#E67233` | Avisos |
| `amber` | `#FFC442` | Atenção |
| `yellow` | `#FFEB38` | — |
| `turquoise` | `#4CA293` | Sucesso alternativo |
| `gray` | `#999999` | Neutro |

> Cada cor tem escala `1`–`12` disponível via `--t-color-{nome}{n}`.

---

## 6. Tags (28 cores disponíveis)

Cada cor de tag tem dois tokens: `--t-tag-text-{cor}` e `--t-tag-background-{cor}`.

Cores disponíveis: `gray` | `mauve` | `slate` | `sage` | `olive` | `sand` | `tomato` | `red` | `ruby` | `crimson` | `pink` | `plum` | `purple` | `violet` | `iris` | `cyan` | `turquoise` | `sky` | `blue` | `jade` | `green` | `grass` | `mint` | `lime` | `bronze` | `gold` | `brown` | `orange` | `amber` | `yellow`

---

## 7. Border

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-border-color-strong` | `#D6D6D6` | Bordas visíveis |
| `--t-border-color-medium` | `#EBEBEB` | Bordas padrão |
| `--t-border-color-light` | `#F1F1F1` | Bordas sutis |
| `--t-border-color-inverted` | `#333333` | Bordas em fundo escuro |
| `--t-border-color-danger` | `#FBC7C7` | Bordas de erro |
| `--t-border-color-blue` | `#AEBDF4` | Bordas accent |

---

## 8. Tokens ERP a Criar (Delta — Ausentes)

> 🔴 Estes tokens **não existem** no `twenty-ui` atual. Devem ser adicionados antes de implementar telas ERP.

| Token proposto | Hex sugerido | Semântica |
|----------------|-------------|-----------|
| `--t-erp-fiscal-emitida` | `#54A170` (green) | NF-e emitida com sucesso |
| `--t-erp-fiscal-cancelada` | `#D35352` (red) | NF-e cancelada |
| `--t-erp-fiscal-contingencia` | `#E67233` (orange) | NF-e em contingência |
| `--t-erp-fiscal-pendente` | `#999999` (gray) | Aguardando emissão |
| `--t-erp-stock-ok` | `#54A170` (green) | Estoque acima do mínimo |
| `--t-erp-stock-alert` | `#FFC442` (amber) | Estoque próximo do mínimo |
| `--t-erp-stock-zero` | `#D35352` (red) | Estoque zerado |
| `--t-erp-approval-draft` | `#999999` (gray) | Pedido rascunho |
| `--t-erp-approval-pending` | `#E67233` (orange) | Aguardando aprovação |
| `--t-erp-approval-approved` | `#466FD5` (blue) | Aprovado |
| `--t-erp-approval-rejected` | `#D35352` (red) | Reprovado |
| `--t-erp-approval-invoiced` | `#54A170` (green) | Faturado |
| `--t-erp-social-active` | `#54A170` (green) | Beneficiário / programa ativo |
| `--t-erp-social-suspended` | `#E67233` (orange) | Suspenso |
| `--t-erp-social-at-risk` | `#D35352` (red) | Em risco / vulnerabilidade alta |
