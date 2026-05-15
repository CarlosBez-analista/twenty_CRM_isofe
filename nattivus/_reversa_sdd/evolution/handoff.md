# Handoff — Agente Codificador

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Para:** Agente de implementação / desenvolvedor que inicia a construção

---

## 1. Contexto do Produto

Você está iniciando a construção de uma **plataforma CRM+ERP dual-perfil** sobre a base do Twenty CRM (open source, monorepo Nx, TypeScript).

**O que existe:** Twenty CRM funcionando com Company, Person, Opportunity, Workflow, Timeline, Dashboard, Multi-workspace, GraphQL API.

**O que você vai construir:** Módulos ERP no pacote `packages/twenty-erp`, seguindo exatamente o mesmo padrão do Twenty sem tocar no Core.

**Dois perfis de produto:**
1. **Empresarial** — fluxo Oportunidade → Pedido → Estoque → NF-e → Financeiro
2. **Social/Educacional** — fluxo Beneficiário/Família → Serviço → Atendimento → Impacto Social

---

## 2. Onde Ler Antes de Escrever Código

| Documento | O que contém |
|-----------|-------------|
| `evolution/product_intent.md` | Intenção do produto, personas, decisões técnicas |
| `evolution/current_product_base.md` | O que preservar, expandir e repensar do Twenty |
| `evolution/expansion_gap.md` | Todas as lacunas funcionais, de dados e arquitetura |
| `evolution/target_product_spec.md` | Requisitos funcionais e critérios de pronto |
| `evolution/new_capabilities.md` | Especificação técnica de cada módulo ERP com entidades e automações |
| `evolution/target_product_architecture.md` | Topologia, diagrama C4, fluxos de integração |
| `evolution/evolution_roadmap.md` | Roadmap por fase com dependências e estimativas |
| `ideas/ideia_ERP_CRM-01.md` | Tese estratégica do produto e exemplos de código TypeScript |
| `ideas/ERP_CRM_stakeholders-claude.md` | Mapa de stakeholders e matriz RBAC completa (perfil social) |
| `ideas/Ecossistema Servicos Produtos Isofe Detalhado_claude.md` | Catálogo de serviços/produtos e fluxos detalhados do perfil social |
| `architecture.md` | Arquitetura atual do Twenty |
| `domain.md` | Glossário e regras de domínio |
| `gaps.md` | Gaps críticos herdados a resolver antes de produção |

---

## 3. Por Onde Começar — Fase 0

**Tarefa imediata:** Spike técnico do padrão de extensão.

### Passo 1 — Criar o pacote

```bash
# No monorepo Nx
npx nx generate @nx/node:library twenty-erp \
  --directory=packages/twenty-erp \
  --importPath=@twenty-crm/twenty-erp
```

### Passo 2 — Criar o primeiro Standard Object ERP

Criar `packages/twenty-erp/src/modules/pedidos/pedido.workspace-entity.ts`:

```typescript
import { WorkspaceObject } from 'src/engine/twenty-orm/decorators/workspace-object.decorator';
import { WorkspaceField } from 'src/engine/twenty-orm/decorators/workspace-field.decorator';
import { WorkspaceRelation } from 'src/engine/twenty-orm/decorators/workspace-relation.decorator';
import { BaseWorkspaceEntity } from 'src/engine/twenty-orm/base.workspace-entity';
import { FieldMetadataType } from 'src/engine/metadata-modules/field-metadata/field-metadata.entity';
import { CompanyWorkspaceEntity } from 'src/modules/company/standard-objects/company.workspace-entity';

// IDs estáveis — nunca mudar após criar (como os Standard Objects existentes)
export const PEDIDO_STANDARD_OBJECT_IDS = {
  pedido: '20240512-erp-pedido-0001-000000000000',
};

@WorkspaceObject({
  standardId: PEDIDO_STANDARD_OBJECT_IDS.pedido,
  namePlural: 'pedidos',
  labelSingular: 'Pedido',
  labelPlural: 'Pedidos',
  description: 'Pedido de venda originado de uma Oportunidade',
  icon: 'IconShoppingCart',
})
export class PedidoWorkspaceEntity extends BaseWorkspaceEntity {
  @WorkspaceField({
    standardId: '...',
    type: FieldMetadataType.NUMBER,
    label: 'Número',
    description: 'Número sequencial do pedido',
    icon: 'IconHash',
  })
  numero: number;

  @WorkspaceField({
    standardId: '...',
    type: FieldMetadataType.SELECT,
    label: 'Status',
    options: [
      { value: 'RASCUNHO', label: 'Rascunho', position: 0, color: 'gray' },
      { value: 'APROVADO', label: 'Aprovado', position: 1, color: 'blue' },
      { value: 'FATURADO', label: 'Faturado', position: 2, color: 'green' },
      { value: 'CANCELADO', label: 'Cancelado', position: 3, color: 'red' },
    ],
    defaultValue: "'RASCUNHO'",
  })
  status: string;

  @WorkspaceRelation({
    standardId: '...',
    type: RelationMetadataType.MANY_TO_ONE,
    label: 'Empresa',
    description: 'Cliente do pedido',
    icon: 'IconBuildingSkyscraper',
    inverseSideTarget: () => CompanyWorkspaceEntity,
    inverseSideFieldKey: 'pedidos',
  })
  empresa: CompanyWorkspaceEntity;
}
```

### Passo 3 — Validar

Após criar a entidade, verificar:
- [ ] Timeline registra criação/edição do Pedido automaticamente
- [ ] Busca full-text retorna Pedidos por número ou nome
- [ ] GraphQL schema expõe `pedidos { edges { node { id numero status } } }`
- [ ] Soft-delete (`deletedAt`) funciona

### Passo 4 — Resolver GAP-M02

Antes de implementar a automação `CLOSED_WON → PedidoDeVenda`, verificar:

```bash
# Localizar o executor de workflows para entender passagem de variáveis entre steps
grep -r "WorkflowExecutorService" packages/twenty-server/src --include="*.ts" -l
grep -r "resolveTemplateVariable\|outputSchema\|state" packages/twenty-server/src/modules/workflow --include="*.ts"
```

Se a passagem de contexto funcionar, implementar o Workflow trigger. Se não, abrir GAP antes de avançar.

---

## 4. Regras Absolutas

| Regra | Por quê |
|-------|---------|
| **Nunca modificar o Twenty Core** | Manter compatibilidade com upstream OSS |
| **Todos os módulos ERP em `packages/twenty-erp`** | Isolamento e sem acoplamento reverso |
| **Seguir o padrão `BaseWorkspaceEntity`** | Herdar Timeline, busca, soft-delete e API gratuitamente |
| **IDs de Standard Objects são UUIDs estáveis** | Nunca mudar após criar — quebra o metadata engine |
| **CPF e dados sensíveis: criptografia AES-256 em repouso** | LGPD Art. 46 — obrigatório desde o início |
| **Voluntários de pilares diferentes nunca se cruzam** | Requisito de privacidade — testar com acesso cruzado |
| **Menores de 18 anos têm proteção automática** | LGPD + ECA — implementar antes de produção social |
| **CRM nunca cria dados mestres autonomamente** | ERP é o sistema de registro mestre |
| **Pré-cadastros via IA têm status `PENDENTE_VALIDACAO`** | Revisão humana obrigatória antes de operacionalizar |

---

## 5. Decisões Humanas Pendentes (Não Avançar sem Resposta)

> **Atualização 2026-05-14:** Ordem de prioridade do roadmap formalizada em **ADR-0006**. Resumo: (1) `001-fundacao-modular` → (2) `002-crm-core` → (3) features sociais ISOFÉ → (4) features empresariais → (5) `00N-fiscal-emissor`. Decisões fiscais ficam diferidas até o passo 5.

| ID | Decisão | Impacto direto | Urgência |
|----|---------|---------------|---------|
| ~~**D1**~~ ✅ Resolvida | ~~Parceiro fiscal: Focus NF-e ou Nuvem Fiscal~~ → **Substituída por ADR-0005** (camada multi-provedor via Adapter Pattern). Não há mais escolha única — cada workspace configura seu provedor; ISOFÉ usa `NullFiscalAdapter`. | Não bloqueia mais Fase 1 nem fundação. Detalhamento na feature `00N-fiscal-emissor` conforme ADR-0006. | ⚪ Diferida para feature fiscal |
| **D2** | LLM para agente IA WhatsApp: GPT-4o, Claude, Gemini | Define custo e capacidade do P3-03 | 🟡 Antes de Fase 3 |
| **D3** | Nome do produto final | Marketing e identidade | 🟡 Antes do lançamento |
| **D4** | Modelo de negócio: open source + módulos premium ou fechado | Define o que é público no repositório | 🔴 Antes do V1 |
| **D5** | Metodologia SROI: valores de referência por tipo de serviço | Define campos obrigatórios em `ImpactIndicator` | 🔴 Antes de S2-17 |

---

## 6. Gaps Críticos a Resolver Antes de Produção

| Gap | O que fazer |
|-----|------------|
| **GAP-C01** — Orphan storage | Criar cron que lista arquivos no storage e verifica se UUID existe na tabela `Attachment`. Deletar órfãos. |
| **GAP-C03** — Admin único | Em `WorkspaceMember`, antes de remover ou rebaixar, verificar: `if (adminCount == 1 && isRemovingAdmin) throw BusinessRuleError`. |
| **GAP-M02** — Variáveis no Workflow | 🟡 Parcialmente resolvido pelo spike `001-spike-tecnico-erp` (decisão D-04 — Action Customizada). Falta teste de integração ponta-a-ponta validando serialização do payload `Opportunity → Action`. Detalhes em `_reversa_sdd/gaps.md#gap-m02`. |
| **GAP-C04** — FTS em Notas | Verificar se `body` tem GIN index. Se não, avaliar custo-benefício de `tsvector`. |

---

## 7. Entidades por Ordem de Implementação

### Perfil Empresarial (Fase 1)

```
1. CategoriaProduto
2. Produto
3. Company (extensão: erpType, erpCustomerCode, CNPJ, IE)
4. Localizacao
5. MovimentacaoDeEstoque
6. CentroDeCusto
7. Orcamento
8. PedidoDeVenda
9. ItemDePedido
10. ContaAReceber
11. Lancamento
12. [Workflow] CLOSED_WON → PedidoDeVenda
13. [Workflow] APROVADO → reserva estoque
14. [Workflow] FATURADO → NF-e + ContaAReceber
15. [erp-fiscal-service] NF-e via Focus NF-e
16. [Queries ClickHouse] DRE, Fluxo de Caixa, Aging
```

### Perfil Social (Fase 2)

```
1. Person (extensões: personType, cpf criptografado, consentStatus, birthDate)
2. Family
3. CostCenter (compartilhado)
4. Programa
5. CatalogoDeServicos
6. ProductCatalog (social)
7. InventoryItem
8. MovimentacaoDeEstoque (extensão social: lote, validade)
9. DonationRecord
10. VolunteerProfile
11. AgendamentoDeServico
12. RegistroDeAtendimento
13. CaseRecord
14. DocumentChecklist
15. ImpactIndicator
16. [Workflow] RegistroDeAtendimento → StockMovement
17. [Workflow] Atendimento por voluntário → DonationRecord (hora)
18. [Queries ClickHouse] SROI, atendimentos por pilar
19. [RBAC] Papéis funcionais e filtros automáticos
20. [LGPD] Consentimento, portabilidade, exclusão, menores
```

---

## 8. Critérios de Pronto (Definition of Done)

### V1 Empresarial — pronto quando:

- [ ] Pedido de Venda criado automaticamente de `Opportunity CLOSED_WON`
- [ ] Itens de pedido vinculados ao catálogo de produtos
- [ ] Movimentação de estoque criada ao aprovar pedido
- [ ] NF-e emitida via integração externa após faturamento
- [ ] XML NF-e e DANFE armazenados como attachment no Pedido
- [ ] `ContaAReceber` gerada com vencimento
- [ ] Cobrança por e-mail no vencimento
- [ ] Dashboard com DRE e Fluxo de Caixa funcionando
- [ ] RBAC: APROVADOR_PEDIDO e EMISSOR_FISCAL testados
- [ ] Testes de acesso cruzado passando

### V1 Social — pronto quando:

- [ ] `Person` + `Family` criáveis no ERP com campos LGPD
- [ ] `Programa` + `CatalogoDeServicos` configuráveis por pilar
- [ ] `AgendamentoDeServico` com QR code de check-in
- [ ] `RegistroDeAtendimento` disparando `MovimentacaoDeEstoque` quando há produto físico
- [ ] `DonationRecord` rastreável até `StockMovement` de saída
- [ ] `ImpactIndicator` com SROI calculável por programa
- [ ] Relatório PDF anonimizado para financiadores
- [ ] RBAC: filtro por `program_id` (coordenador) e `pillar` (voluntário) testados
- [ ] Proteção de menores (`birthDate < 18`) implementada e testada
- [ ] Fluxo de consentimento LGPD funcionando

---

## 9. Referências de Padrão (Código Existente para Copiar)

| Padrão | Arquivo de referência no Twenty |
|--------|--------------------------------|
| Standard Object | `packages/twenty-server/src/modules/company/standard-objects/company.workspace-entity.ts` |
| Workflow Trigger | `packages/twenty-server/src/modules/workflow/workflow-trigger/` |
| Workflow Action | `packages/twenty-server/src/modules/workflow/workflow-actions/` |
| Dashboard Widget | `packages/twenty-server/src/modules/analytics/` + ClickHouse |
| RBAC Guard | `packages/twenty-server/src/engine/guards/` |
| Storage Attachment | `packages/twenty-server/src/modules/attachment/` |
| Timeline Activity | `packages/twenty-server/src/modules/timeline/` |

---

> **Próximo passo imediato:** Executar o Passo 1 (criar pacote `packages/twenty-erp`) e o Passo 2 (spike do `PedidoWorkspaceEntity`) para validar o padrão antes de avançar.

---

*Gerado por reversa-evolve · Instituto ISOFÉ / twenty-crm-erp · 2026-05-12*
