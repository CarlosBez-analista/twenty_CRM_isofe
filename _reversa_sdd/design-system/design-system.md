# Design System — Twenty UI (Consolidado)

> **Gerado por:** reversa-design-system
> **Data:** 2026-05-13
> **Fonte primária:** `packages/twenty-ui/src/theme-constants/theme-light.css` (gerado automaticamente dos arquivos TypeScript)
> **Escala de confiança:** 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## Visão Geral

O `twenty-ui` é a biblioteca de componentes do Twenty CRM. Usa:

- **Linaria** — CSS-in-JS zero-runtime (styled-components pattern, sem runtime overhead)
- **CSS Custom Properties** — todos os tokens são variáveis CSS com prefixo `--t-`
- **Tabler Icons** — biblioteca de ícones SVG (~4.000 ícones)
- **Display-P3** — espaço de cor wide-gamut para fidelidade visual em telas modernas
- **Inter** (interface) + **DM Mono** (código)

---

## Arquivos de Referência

| Arquivo | Conteúdo |
|---------|---------|
| [color-palette.md](./color-palette.md) | Paleta completa, tokens de fundo, accent, tags, border, feedback, delta ERP |
| [typography.md](./typography.md) | Famílias, escala de tamanhos, pesos, line-heights, cores, delta ERP |
| [spacing.md](./spacing.md) | Escala 0-128px, tokens de layout especiais, modal sizes, breakpoints, delta ERP |
| [tokens.md](./tokens.md) | Tabela unificada de todos os tokens + componentes existentes + delta ERP |

---

## Estado do Design System

### O que existe e está pronto para uso

| Categoria | Status | Observação |
|-----------|--------|-----------|
| Paleta de cores | 🟢 | 30+ cores nomeadas com escala 1-12, modo claro e escuro |
| Tipografia | 🟢 | Inter em 7 tamanhos, 3 pesos, line-heights |
| Espaçamento | 🟢 | Escala 0-128px (base 4px), tokens especiais de tabela |
| Border radius | 🟢 | 7 variantes (xs a pill) |
| Sombras | 🟢 | 4 elevações |
| Animação | 🟢 | 4 durações |
| Ícones | 🟢 | Tabler Icons — inclui ícones ERP nativos |
| Componentes base | 🟢 | Button, Tag, Chip, Avatar, Icon |
| Modo escuro | 🟢 | `theme-dark.css` presente (tokens paralelos) |

### O que está ausente (Delta ERP)

| Categoria | Status | O que falta |
|-----------|--------|------------|
| Tokens semânticos ERP | 🔴 | Cores para estados fiscal, estoque, aprovação, social |
| DataTable densa | 🔴 | Componente para listas grandes com colunas fixas e paginação server-side |
| MultiStepForm | 🔴 | Stepper horizontal para formulários multi-etapa |
| SplitView | 🔴 | Layout master-detail (Pedido + Itens) |
| StatusBadge ERP | 🔴 | Variante `fiscal` e `approval` no sistema de badges |
| PrintLayout | 🔴 | Layout de impressão (DANFE, DRE, relatórios) |
| NumberInput monetário | 🟡 | Máscara R$ / BRL sobre input existente |
| CpfInput | 🟡 | Máscara CPF sobre input existente |
| QRCodeDisplay | 🟡 | Exibição de QR code para check-in |
| Tipografia compacta | 🔴 | Tokens `font-size-table-compact`, `line-height-compact` |
| Layout ERP | 🔴 | Tokens `erp-table-row-height`, `erp-split-panel-min-width` |
| Breakpoints intermediários | 🔴 | Só `MOBILE_VIEWPORT=768px` existe; sem tablet/desktop-wide |
| Z-index scale | 🔴 | Só `last-layer` documentado; demais camadas são hardcoded |

---

## Tokens ERP a Adicionar (Resumo)

> Adicionar em `packages/twenty-ui/src/theme/constants/ErpTokens.ts` e incluir no script de geração do CSS.

```typescript
// packages/twenty-ui/src/theme/constants/ErpTokensLight.ts
export const ERP_TOKENS_LIGHT = {
  fiscal: {
    emitida: 'var(--t-color-green)',
    cancelada: 'var(--t-color-red)',
    contingencia: 'var(--t-color-orange)',
    pendente: 'var(--t-color-gray)',
  },
  stock: {
    ok: 'var(--t-color-green)',
    alert: 'var(--t-color-amber)',
    zero: 'var(--t-color-red)',
  },
  approval: {
    draft: 'var(--t-color-gray)',
    pending: 'var(--t-color-orange)',
    approved: 'var(--t-color-blue)',
    rejected: 'var(--t-color-red)',
    invoiced: 'var(--t-color-green)',
  },
  social: {
    active: 'var(--t-color-green)',
    suspended: 'var(--t-color-orange)',
    atRisk: 'var(--t-color-red)',
  },
  layout: {
    tableRowHeight: '40px',
    tableRowHeightCompact: '32px',
    formSectionGap: '24px',
    splitPanelMinWidth: '320px',
  },
  font: {
    sizeTableCompact: '0.8rem',
    weightTableHeader: '600',
    lineHeightCompact: '1.0',
  },
};
```

---

## Componentes Prioritários a Construir

Em ordem de implementação (desbloqueiam mais funcionalidades ERP):

1. **`StatusBadge`** com variantes ERP — usa tokens acima, baixo esforço, alto reuso
2. **`DataTable`** com paginação server-side — faz parte de todo módulo ERP
3. **`SplitView`** — Pedido + Itens, Atendimento + Histórico
4. **`MultiStepForm`** — Onboarding de perfil, emissão NF-e, cadastro de Família
5. **`PrintLayout`** — DANFE, DRE, relatório de transparência
6. **`NumberInput`** com máscara R$ — todos os campos monetários
7. **`CpfInput`** com validação — cadastro de beneficiários
8. **`QRCodeDisplay`** — check-in de serviço

---

## Estratégia de Extensão

**Princípio:** Não modificar o `twenty-ui` Core. Adicionar em camada separada dentro do mesmo pacote ou em `packages/twenty-erp/src/ui/`.

```
packages/twenty-erp/
└── src/
    └── ui/
        ├── tokens/
        │   └── erp-tokens.ts         ← tokens semânticos ERP
        ├── components/
        │   ├── StatusBadge/          ← variantes fiscal/approval/stock
        │   ├── DataTable/            ← tabela densa server-side
        │   ├── SplitView/            ← layout master-detail
        │   ├── MultiStepForm/        ← stepper horizontal
        │   ├── PrintLayout/          ← CSS @media print
        │   ├── NumberInput/          ← máscara monetária
        │   ├── CpfInput/             ← máscara + validação CPF
        │   └── QRCodeDisplay/        ← exibição QR code
        └── index.ts
```

> Componentes em `twenty-erp/ui/` importam tokens do `twenty-ui` via `themeCssVariables` + novos tokens ERP. Sem acoplamento reverso.

---

## Decisões de Estratégia Visual (2026-05-13)

| Tela / Fluxo | Decisão | Implicação |
|-------------|---------|-----------|
| **Seletor de perfil** (Empresarial/Social) | Configuração no **painel Admin** (`Settings > Workspace > Perfil ERP`) — sem step de onboarding | Nenhum componente de seleção de perfil no fluxo de cadastro; campo `erpProfile` nas configurações do workspace |
| **Portal de voluntário** | **Rota interna** `/volunteer` dentro do app Twenty, usando `twenty-ui` | Rota protegida por token JWT restrito; sem app separado; herda o design system existente |
| **Portal de transparência** | **Subdomínio separado** (`transparencia.dominio.com`) | Pacote independente (`packages/twenty-transparency` ou Next.js standalone); consome API pública anonimizada do ClickHouse; sem autenticação workspace |

---

## Breakpoints — Decisão Pendente

🔴 **LACUNA** — Módulos ERP precisam de estratégia responsiva para:
- Portal de voluntário (mobile-first, acesso externo)
- Portal de transparência (possível tela wide de financiador)
- Tabelas densas (scroll horizontal ou colunas colapsáveis em mobile)

**Opções:**
1. Adicionar breakpoints intermediários em `twenty-ui/src/theme-constants/constants.ts` (`TABLET_VIEWPORT = 1024`, `DESKTOP_WIDE = 1440`)
2. Definir breakpoints apenas em `twenty-erp/ui/tokens/erp-tokens.ts` sem tocar no core

Recomendação: opção 2 para manter o princípio de não modificar o core.

---

*Gerado por reversa-design-system · twenty-crm-erp · 2026-05-13*
