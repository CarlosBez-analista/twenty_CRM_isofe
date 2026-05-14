# ADR-0005: Camada Fiscal Multi-Provedor via Adapter Pattern

- **Status:** Aceito
- **Data:** 2026-05-14
- **Confiança:** 🟢 CONFIRMADO (Decisão de Produto)
- **Resolve:** D1 (parceiro fiscal) — substitui a escolha única por arquitetura plugável
- **Substitui:** Pré-comprometimento implícito a Focus NF-e feito em `_reversa_forward/001-spike-tecnico-erp/` (vide DEBT do spike)

## Contexto

A plataforma NattivusECO (CRM + ERP sobre base Twenty) será comercializada para clientes com perfis fiscais heterogêneos:

- **Instituição social** (caso ISOFÉ, primeiro cliente): não emite NF-e. Emite recibo de doação, eventualmente NFS-e municipal. Vínculo fiscal pode ser inexistente em V1.
- **Comércio/indústria**: emite NF-e (modelo 55) via SEFAZ por intermédio de provedor (Focus NF-e, Nuvem Fiscal, Tecnospeed, etc.)
- **Prestador de serviço**: emite NFS-e via prefeitura municipal — padrão fragmentado, cobertura varia por provedor.
- **Cliente que já tem contrato fiscal próprio**: precisa conectar adapter customizado ao provedor dele.

Travar a plataforma a um único fornecedor (Focus NF-e ou Nuvem Fiscal) cria três problemas: (1) lock-in comercial impedindo migração entre provedores, (2) custo desnecessário para clientes que não emitem NF-e, (3) impossibilidade de atender prefeituras fora da cobertura do provedor escolhido.

A decisão original D1 do `handoff.md` ("escolher Focus NF-e ou Nuvem Fiscal") era falsa dicotomia.

## Decisão

Adotar **Adapter Pattern** com interface única `IFiscalProvider` em `packages/twenty-erp/src/lib/fiscal/`. Cada provedor é um adapter isolado, e a escolha é **configuração por workspace**, não decisão global do produto.

### Estrutura

```
packages/twenty-erp/src/lib/fiscal/
├── ports/
│   └── fiscal-provider.port.ts        # interface IFiscalProvider
├── adapters/
│   ├── null/
│   │   └── null-fiscal.adapter.ts     # no-op (default ISOFÉ)
│   ├── focus-nfe/
│   │   └── focus-nfe.adapter.ts       # NF-e modelo 55
│   ├── nuvem-fiscal/
│   │   └── nuvem-fiscal.adapter.ts    # NF-e modelo 55 + NFS-e
│   └── custom/
│       └── (carregamento dinâmico via plugin SDK)
├── domain/
│   ├── fiscal-document.ts             # value object cross-provider
│   ├── emission-result.ts
│   └── certificate.ts                 # A1.pfx do cliente, criptografado
└── fiscal.module.ts                    # registry, carrega adapter por config
```

### Contrato `IFiscalProvider`

A interface deve expor, no mínimo:

| Método | Propósito |
|---|---|
| `emitirNFe(payload)` | Emissão modelo 55 |
| `emitirNFSe(payload)` | Emissão municipal (pode lançar `NotSupportedError`) |
| `consultarStatus(chave)` | Polling de status SEFAZ |
| `cancelar(chave, motivo)` | Cancelamento dentro da janela legal |
| `cartaCorrecao(chave, texto)` | CC-e |
| `capabilities()` | Lista de operações suportadas pelo adapter |

`capabilities()` é o que permite a UI esconder funções não suportadas pelo adapter ativo do workspace.

### Configuração por workspace

Novo campo na `WorkspaceEntity`:

```ts
fiscalProvider: 'none' | 'focus_nfe' | 'nuvem_fiscal' | 'custom'
fiscalProviderConfig: EncryptedJSON  // token, ambiente, certificado A1.pfx ref
```

ISOFÉ e clientes não-emissores usam `'none'` e o `NullFiscalAdapter` (no-op com logs). Não precisam contratar nenhum provedor fiscal.

### Carregamento de adapters customizados

Para clientes que querem usar provedor próprio (Tecnospeed, Migrate, NFe.io, integração caseira com SEFAZ direto), o `'custom'` carrega plugin via SDK público em runtime. Detalhamento técnico vai na feature `00N-fiscal-emissor`.

## Alternativas Consideradas

1. **Provedor único Focus NF-e** (proposta original D1): Rejeitado — lock-in, impede ISOFÉ usar sem custo, não cobre prefeituras fora da rede.
2. **Provedor único Nuvem Fiscal**: Rejeitado — mesmas razões.
3. **Implementação SEFAZ direta sem provedor**: Rejeitado — complexidade brutal (cada UF tem webservice próprio, certificado A3 obrigatório, manutenção de schemas XML). Inviável em V1.
4. **Adapter para um provedor + extensibilidade futura "se precisar"**: Rejeitado — YAGNI invertido. A heterogeneidade já é certa, não hipotética. Construir Adapter agora custa pouco mais que o adapter único.

## Consequências

### Positivas

- ISOFÉ entra sem nenhum custo fiscal recorrente (`NullFiscalAdapter`)
- Cliente novo escolhe provedor sem mudar core
- Plataforma pode ser revendida para integradores que tragam adapter próprio
- Migração entre provedores é troca de config, não de código
- Refletivo da realidade brasileira (NF-e nacional centralizada, NFS-e municipal fragmentada)

### Negativas

- Custo de design adicional na feature fiscal (interface bem desenhada exige modelagem cuidadosa do `FiscalDocument` para abstrair diferenças entre provedores)
- Risco de "abstração com furos": se algum provedor expuser funcionalidade que não cabe em `IFiscalProvider`, fica como `capabilities()` extra ou método específico do adapter
- Testes de integração precisam rodar contra sandbox de cada provedor coberto

### Dívida técnica imediata

Os artefatos T007 (`FocusNfeHttpService`), T008 (`EmissorFiscalWorkflowAction`) e T009 (registro no `WorkflowExecutorService`) implementados em `_reversa_forward/001-spike-tecnico-erp/` foram criados **antes** desta decisão e estão acoplados diretamente ao Focus NF-e. Eles ficam marcados como **provisórios** em `_reversa_forward/001-spike-tecnico-erp/DEBT.md` e serão refatorados durante a feature `00N-fiscal-emissor` para encaixar atrás de `IFiscalProvider`.

## Restrições não-funcionais

- Certificado digital A1 (`.pfx`) é **propriedade do cliente final**, nunca embutido no servidor. Upload via UI segura, armazenado criptografado, vinculado ao workspace.
- Tokens de provedor (Focus NF-e, Nuvem Fiscal) ficam em `fiscalProviderConfig` criptografado, escopo workspace.
- Adapter `NullFiscalAdapter` é o **default** para qualquer workspace novo, evitando que cliente sem configuração veja erro de emissão.

## Rastreabilidade

- Resolve: D1 (`_reversa_sdd/evolution/handoff.md`, `_reversa_sdd/evolution/tasks.md`)
- Marca dívida: `_reversa_forward/001-spike-tecnico-erp/actions.md` T007/T008/T009
- Bloqueia execução de: feature `00N-fiscal-emissor` (ainda a ser planejada)
- Não bloqueia: `001-fundacao-modular` (escopo não toca fiscal)
- Relacionado: [[ADR-0006-prioridade-isofe-primeiro]] (define quando essa feature entra no roadmap)
