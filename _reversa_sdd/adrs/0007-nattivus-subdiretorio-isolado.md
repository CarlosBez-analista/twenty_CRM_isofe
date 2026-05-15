# ADR-0007: NattivusECO como Subdiretório Isolado no Repo do Twenty

- **Status:** Aceito
- **Data:** 2026-05-14
- **Confiança:** 🟢 CONFIRMADO (Decisão de Projeto)

## Contexto

O NattivusECO é um produto novo que será desenvolvido a partir dos artefatos gerados pelo Reversa (`_reversa_sdd/`, `_reversa_forward/`). Esses artefatos residem no repositório do Twenty CRM legado (`twenty_CRM_isofe`). O produto final precisa de seu próprio repositório e identidade, mas durante o desenvolvimento o ciclo forward do Reversa (`legacy-impact.md`, `regression-watch.md`) depende de acesso direto aos artefatos de extração.

## Decisão

Criar o monorepo NattivusECO como subdiretório `nattivus/` na raiz do repositório do Twenty CRM, **completamente auto-contido** (próprio `package.json`, `nx.json`, `node_modules`, `tsconfig.base.json`). Nenhuma dependência de importação cruza entre `nattivus/` e o código do Twenty.

Quando o produto estiver funcional, extrair `nattivus/` para um repositório independente via `git subtree split` (preserva histórico) ou cópia direta (mais simples).

### Estrutura

```
twenty_CRM_isofe/
├── nattivus/                    ← monorepo NattivusECO (auto-contido)
│   ├── package.json
│   ├── nx.json
│   ├── tsconfig.base.json
│   ├── .yarnrc.yml
│   ├── .env.example
│   ├── docker/compose.dev.yml
│   └── packages/
│       ├── nattivus-shell/
│       ├── nattivus-shared/
│       ├── nattivus-sdk/
│       ├── nattivus-ui/
│       └── modules/hello-world/
├── _reversa_sdd/                ← intacto
├── _reversa_forward/            ← intacto
└── packages/                    ← código do Twenty (intacto)
```

### Restrições

1. **Zero acoplamento**: `nattivus/` não importa nada de fora de si mesmo
2. **Não toca o legado**: nenhum arquivo pré-existente do Twenty é modificado
3. **`node_modules` separados**: `nattivus/` usa seu próprio gerenciador de pacotes
4. **Extração trivial**: a mudança para repo independente não requer refatoração

## Alternativas Consideradas

1. **Repo separado desde o início**: Rejeitado — perde acesso direto aos artefatos do Reversa durante o ciclo forward; `legacy-impact.md` e `regression-watch.md` ficariam sem âncora
2. **Pacotes dentro de `packages/` do Twenty**: Rejeitado — mistura namespaces; risco de acoplamento acidental com o `nx.json` e `tsconfig` do Twenty
3. **Monorepo compartilhado**: Rejeitado — viola o princípio "não modificar legado" (teria que alterar `nx.json` da raiz)

## Consequências

- **Positivas**: ciclo Reversa forward funcional, isolamento total, extração futura trivial
- **Negativas**: disco extra com `node_modules` duplicados; `.gitignore` do Twenty precisa de uma entrada `nattivus/node_modules/` (não é modificação de código legado, apenas configuração de ignore)
- **Riscos**: nenhum identificado — abordagem conservadora por design
