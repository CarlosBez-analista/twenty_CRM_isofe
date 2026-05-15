# Matriz de Lacunas da Expansão

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fontes:** `intent_interview.md`, `gaps.md`, `domain.md`, `architecture.md`, `ideas/`

---

## Legenda

| Símbolo | Significado |
|---------|-------------|
| ✅ Existe | Capacidade já presente no Twenty CRM atual |
| 🟡 Parcial | Existe mas precisa de extensão ou configuração |
| 🔴 Ausente | Não existe — precisa ser construído |
| 🔵 Externo | Delegado a serviço externo (não implementar internamente) |
| 🟣 Decisão | Requer decisão humana antes de implementar |

---

## 1. Funcional

### 1.1 Perfil Empresarial

| Área | Capacidade | Existe hoje | Necessário no produto alvo | Gap | Decisão |
|------|-----------|-------------|---------------------------|-----|---------|
| Catálogo | Produtos com SKU, descrição, preço, unidade | 🔴 Ausente | `Produto` como Standard Object ERP | **Construir** | — |
| Catálogo | Categorias de produto | 🔴 Ausente | `CategoriaProduto` | **Construir** | — |
| Catálogo | Lista de preços por cliente/volume | 🔴 Ausente | `ListaDePrecos` | **Construir (V2)** | Pode ser V2 |
| Pedidos | Pedido de Venda originado de Oportunidade | 🔴 Ausente | `PedidoDeVenda` + `ItemDePedido` | **Construir** | — |
| Pedidos | Orçamento (versão pré-pedido) | 🔴 Ausente | `Orcamento` | **Construir** | — |
| Pedidos | Aprovação multi-nível de pedido | 🔴 Ausente | Workflow Step `WAIT_FOR_APPROVAL` | **Construir** | Verificar GAP-M03 |
| Estoque | Movimentação de entrada/saída/ajuste | 🔴 Ausente | `MovimentacaoDeEstoque` | **Construir** | — |
| Estoque | Alerta de estoque mínimo | 🔴 Ausente | Workflow Cron | **Construir** | — |
| Estoque | Localização (depósito, prateleira) | 🔴 Ausente | `Localizacao` | **Construir** | — |
| Compras | Pedido de Compra + Fornecedor | 🔴 Ausente | `PedidoDeCompra` | **Construir (Fase 2)** | Fora do V1 |
| Compras | Recebimento de mercadoria | 🔴 Ausente | Gera `MovimentacaoDeEstoque` (entrada) | **Construir (Fase 2)** | Fora do V1 |
| Financeiro | Conta a Receber (gerada do Pedido) | 🔴 Ausente | `ContaAReceber` | **Construir** | — |
| Financeiro | Conta a Pagar (gerada do Pedido de Compra) | 🔴 Ausente | `ContaAPagar` | **Construir (Fase 2)** | Fase 2 |
| Financeiro | Lançamento / baixa manual ou automática | 🔴 Ausente | `Lancamento` | **Construir** | — |
| Financeiro | Centro de Custo | 🔴 Ausente | `CentroDeCusto` | **Construir** | — |
| Financeiro | Fluxo de Caixa (dashboard ClickHouse) | 🟡 Parcial | ClickHouse existe; query específica ausente | **Implementar query** | — |
| Fiscal | NF-e de Saída | 🔴 Ausente | Integração via Focus NF-e / Nuvem Fiscal | **🔵 Externo** | Definir parceiro fiscal |
| Fiscal | NFS-e (serviço) | 🔴 Ausente | Idem | **🔵 Externo** | — |
| Fiscal | Armazenamento de XML e DANFE | 🟡 Parcial | Storage existe; attachment polimórfico existe | **Configurar** | — |
| Relatórios | DRE (Demonstrativo de Resultado) | 🔴 Ausente | Query ClickHouse + Dashboard | **Construir** | — |
| Relatórios | Curva ABC de Produtos | 🔴 Ausente | Query + Dashboard Widget | **Construir** | — |
| Relatórios | Aging de Recebíveis | 🔴 Ausente | Query + Dashboard Widget | **Construir** | — |
| CRM→ERP | Transição Oportunidade → Pedido de Venda | 🔴 Ausente | Workflow: `CLOSED_WON` → cria `PedidoDeVenda` | **Construir** | GAP-M02: verificar passagem de contexto |

### 1.2 Perfil Social/Educacional

| Área | Capacidade | Existe hoje | Necessário no produto alvo | Gap | Decisão |
|------|-----------|-------------|---------------------------|-----|---------|
| Cadastros mestres | Beneficiário (`person` estendido) | 🟡 Parcial | `Person` + campos: `cpf` (criptografado), `personType`, `consentStatus`, `birthDate`, `disabilityStatus` | **Estender** | — |
| Cadastros mestres | Família (`family`) | 🔴 Ausente | `Family`: responsável, renda, moradia, insegurança alimentar, `vulnerabilityScore` | **Construir** | — |
| Cadastros mestres | Programa Institucional (`program`) | 🔴 Ausente | `Program`: pilar, financiador, coordenador, datas, status | **Construir** | — |
| Cadastros mestres | Catálogo de Serviços (`service_catalog`) | 🔴 Ausente | `ServiceCatalog`: tipo, elegibilidade, sensibilidade LGPD, canal | **Construir** | — |
| Cadastros mestres | Catálogo de Produtos Sociais (`product_catalog`) | 🔴 Ausente | `ProductCatalog`: físico/digital/social/institucional | **Construir** | — |
| Estoque social | Inventário de doações (`inventory_item`) | 🔴 Ausente | Com lote, validade, parceiro doador, quantidade reservada | **Construir** | — |
| Estoque social | Movimentação de estoque social (`stock_movement`) | 🔴 Ausente | Com rastreio até `service_attendance` do CRM | **Construir** | — |
| Doações | Registro de doações (`donation_record`) | 🔴 Ausente | Produto, dinheiro ou hora voluntária; vinculado a programa e parceiro | **Construir** | — |
| Agendamentos | Agendamento de serviço (`service_appointment`) | 🔴 Ausente | QR code de check-in, canal de origem, IA ou atendente | **Construir** | — |
| Atendimentos | Registro de atendimento (`service_attendance`) | 🔴 Ausente | Status, resultado, próximo passo, privacidade, executor, disparo de estoque | **Construir** | — |
| Casos | Caso jurídico/social (`case_record`) | 🔴 Ausente | Tipo, prioridade, status, atribuição, acompanhamento | **Construir** | — |
| Documentos | Checklist de documentos (`document_checklist`) | 🔴 Ausente | Por serviço ou caso, sensibilidade, armazenamento seguro | **Construir** | — |
| Voluntários | Perfil de voluntário (`volunteer_profile`) | 🔴 Ausente | Área profissional, registro, disponibilidade, antecedentes | **Construir** | — |
| Impacto | Indicadores de impacto (`impact_indicator`) | 🔴 Ausente | Quantitativo, qualitativo, financeiro, SROI; anonimizado | **Construir** | — |
| Financeiro social | Centro de custo por programa | 🔴 Ausente | `CentroDeCusto` (compartilhado com perfil empresarial) | **Construir** | — |
| Canal IA | Agente WhatsApp (fluxo guiado) | 🔴 Ausente | LLM + WhatsApp Business API + chamadas à API GraphQL | **🔵 Externo** | 🟣 Definir LLM e provedor |
| Portal | Portal de voluntário (simplificado) | 🔴 Ausente | Web responsivo com acesso por token, agenda restrita | **Construir** | — |
| Portal | Portal de transparência (financiadores) | 🔴 Ausente | Dashboard web público/restrito com dados anonimizados | **Construir** | — |

---

## 2. Dados

| Gap | Descrição | Ação |
|-----|-----------|------|
| `Company` sem campos fiscais | CNPJ, IE, regime tributário ausentes | Adicionar via extensão Standard Object |
| `Person` sem CPF criptografado | Dado sensível LGPD não tratado | Adicionar campo com criptografia em repouso |
| `Person` sem `consentStatus` | Consentimento LGPD não rastreado | Adicionar enum e log de auditoria |
| `Person` sem `birthDate` | Necessário para proteção de menores de 18 anos | Adicionar campo |
| Sem entidade `Family` | Núcleo familiar não representado | Construir Standard Object `Family` |
| Sem entidade `Program` | Programas institucionais não representados | Construir Standard Object `Program` |
| Sem rastreio de lote no estoque | Validade, lote e parceiro doador não rastreados | Construir `InventoryItem` com campos de lote |
| Sem `donation_record` | Horas voluntárias e doações não contabilizadas | Construir para permitir cálculo de SROI |

---

## 3. Arquitetura

| Gap | Descrição | Ação |
|-----|-----------|------|
| Sem pacote `twenty-erp` | Módulos ERP não existem no monorepo | Criar `packages/twenty-erp` seguindo padrão Nx |
| Sem RBAC granular por módulo | Roles existentes (Admin/Member) insuficientes para ERP | Estender sistema de papéis com perfis funcionais |
| Sem fluxo de aprovação nativo | Workflow não tem `WAIT_FOR_APPROVAL` | Implementar Step específico |
| Sem microserviço fiscal | NF-e e NFS-e exigem integração SEFAZ | Criar `erp-fiscal-service` (Node.js + Focus NF-e) |
| GAP-C01: Orphan storage | Arquivos órfãos após exclusão | Implementar cron de limpeza antes de produção |
| GAP-C03: Admin único | Workspace pode perder governança | Implementar validação `pre-delete` em `WorkspaceMember` |
| GAP-M02: Passagem de contexto no Workflow | Dados podem não fluir entre steps | Investigar `WorkflowExecutorService` antes de usar |

---

## 4. UI / Frontend

| Gap | Descrição | Ação |
|-----|-----------|------|
| Sem páginas ERP | Frontend não tem rotas para módulos ERP | Criar `packages/twenty-front/src/pages/erp/` |
| Sem seletor de perfil de workspace | Usuário não escolhe entre perfil empresarial e social | Criar fluxo de onboarding com seleção de perfil |
| Sem portal de voluntário | Interface simplificada para voluntários | Criar app/rota separada com acesso por token |
| Sem portal de transparência | Interface para financiadores | Criar rota pública/restrita com dados anonimizados |
| Sem widget SROI no Dashboard | Indicador de Retorno Social não visualizável | Criar widget específico no Dashboard Engine |

---

## 4A. Design System — Lacunas para o ERP

> **Prioridade:** 🔴 Bloqueia implementação de qualquer tela ERP.
> **Pré-requisito de:** `/reversa-design-system` e toda a Fase 1 de frontend.
> **Fonte:** análise do `twenty-ui` vs requisitos visuais dos módulos ERP.

### 4A.1 Identidade visual dual (CRM vs ERP)

| Gap | Descrição | Ação |
|-----|-----------|------|
| `twenty-ui` projetado para CRM | Tokens, espaçamentos e composições assumem layout de relacionamentos (cards, sidebars, timeline). Módulos ERP têm padrões visuais diferentes: tabelas densas, formulários multi-step, layouts de impressão | Mapear delta de tokens antes de criar qualquer tela ERP |
| Sem semântica de cor para contexto ERP | O sistema de cores atual cobre estados CRM (lead quente, oportunidade aberta). ERP precisa de estados fiscais (emitido, cancelado, contingência), estados de estoque (OK, mínimo, zerado) e estados de aprovação (rascunho, aprovado, reprovado) | Adicionar tokens semânticos: `--color-erp-fiscal-*`, `--color-erp-stock-*`, `--color-erp-approval-*` |
| Sem tokens de tipografia para densidade informacional | Tabelas ERP (itens de pedido, extrato financeiro) exigem tamanhos menores e espaçamento mais compacto que o padrão CRM | Definir variante `size="compact"` nos componentes de tabela |

### 4A.2 Componentes ausentes no `twenty-ui`

| Componente | Módulos que precisam | Complexidade |
|-----------|---------------------|-------------|
| `DataTable` com paginação server-side e colunas fixas | Pedidos, Estoque, Financeiro, Relatórios | 🔴 Alta |
| `MultiStepForm` com stepper horizontal | Onboarding de perfil, Emissão NF-e, Cadastro de Família | 🔴 Alta |
| `SplitView` (master-detail: Pedido + Itens) | PedidoDeVenda, RegistroDeAtendimento | 🟡 Média |
| `StatusBadge` com variantes fiscais e ERP | Pedidos, NF-e, ContaAReceber | 🟡 Média |
| `PrintLayout` | DANFE, relatório de impacto para financiadores, DRE | 🟡 Média |
| `NumberInput` com máscara monetária (R$) | Financeiro, Pedidos, Orçamento | 🟢 Baixa |
| `CpfInput` com máscara e validação | Cadastro de Beneficiários (Perfil Social) | 🟢 Baixa |
| `QRCodeDisplay` | Agendamento de Serviço (check-in) | 🟢 Baixa |

### 4A.3 Telas/fluxos sem estratégia visual definida

| Tela / Fluxo | Problema | Ação |
|-------------|---------|------|
| Seletor de perfil (Empresarial / Social) | ✅ **DECIDIDO** — perfil é configurado pelo Admin no painel de configurações do workspace, não no onboarding. Suporta mudança futura sem fricção no cadastro. | Implementar em `Settings > Workspace > Perfil ERP` |
| Portal de voluntário | ✅ **DECIDIDO** — rota interna `/volunteer` dentro do app Twenty, reutilizando `twenty-ui`. Mais simples de manter. | Criar rota protegida por token em `twenty-front/src/pages/volunteer/` |
| Portal de transparência (financiadores) | ✅ **DECIDIDO** — subdomínio separado (ex: `transparencia.dominio.com`). App leve com API pública anonimizada do ClickHouse. | Criar pacote `packages/twenty-transparency` ou app Next.js standalone |

### 4A.4 Ícones

> ✅ **Não é lacuna.** O Twenty usa `tabler-icons`, que já inclui ícones ERP adequados: `IconShoppingCart`, `IconPackage`, `IconReceipt`, `IconCurrencyReal`, `IconTruckDelivery`, `IconChartBar`. Nenhuma adição necessária.

---

---

## 5. Permissões

| Gap | Descrição | Ação |
|-----|-----------|------|
| Sem papel `Aprovador de Pedido` | Aprovação de pedido não tem papel específico | Criar role funcional |
| Sem papel `Emissor Fiscal` | Emissão de NF-e não tem papel específico | Criar role funcional |
| Sem papel `Coordenador de Programa` | Acesso filtrado por `program_id` não existe | Criar role + filtro automático |
| Sem papel `Voluntário Técnico` | Acesso restrito a agenda própria não existe | Criar role + filtro por `service_catalog.pillar` |
| Sem papel `DPO` | Acesso a logs de auditoria sem acesso a conteúdo não existe | Criar role + interface de auditoria |
| Sem proteção de menores | `person` com `birthDate < 18` não tem restrições adicionais | Implementar flag automático e restrições |
| Sem segregação por pilar | Voluntário de saúde não deve ver casos jurídicos | Filtro automático por `pillar` no RBAC |

---

## 6. Integrações

| Gap | Descrição | Ação |
|-----|-----------|------|
| NF-e / NFS-e | Integração com SEFAZ obrigatória para perfil empresarial | `erp-fiscal-service` (externo) |
| PIX / Boleto | Integração bancária para cobranças automáticas | `erp-payment-service` (externo — Fase 2) |
| WhatsApp Business API | Canal de atendimento e registro para institutos | `erp-whatsapp-service` (externo — com LLM) |
| Open Finance | Conciliação bancária | Fase 3 |
| Marketplace (ML, Shopify) | Canal de vendas | Roadmap distante |

---

## 7. Compliance / Operação

| Gap | Descrição | Ação |
|-----|-----------|------|
| LGPD — consentimento | Não existe fluxo de coleta e renovação de consentimento | Implementar em `person.consentStatus` + log de auditoria |
| LGPD — portabilidade | Não existe exportação de dados do titular | Implementar endpoint de exportação por `person_id` |
| LGPD — exclusão | Soft-delete existe, mas dados criptografados precisam de exclusão real | Implementar "hard-delete LGPD" para dados sensíveis |
| LGPD — menores | Sem restrição automática para `birthDate < 18` | Implementar middleware de proteção |
| Prestação de contas | Relatórios para financiadores não existem | Construir geração de relatório anonimizado por programa |
| SROI | Fórmula e campos não implementados | Construir `impact_indicator` com campo `data_source` e metodologia |

---

## 8. Resumo dos Gaps por Prioridade

| Prioridade | Quantidade | Exemplos |
|------------|-----------|---------|
| 🔴 Crítico (bloqueia V1) | 12 | `Pedido`, `ContaReceber`, `Family`, `Programa`, `service_attendance`, RBAC granular, LGPD-consent |
| 🟡 Importante (impacta qualidade) | 14 | Portal voluntário, Portal transparência, Compras, Aprovação multi-nível, GAP-C01, GAP-C03 |
| 🟢 Roadmap (Fase 2+) | 10 | PIX, Marketplace, RH, Open Finance, NFS-e, GAP-M06, GAP-M07 |
| 🔵 Externo (não implementar) | 3 | NF-e (Focus NF-e), WhatsApp+LLM, Bancos |
| 🟣 Decisão humana pendente | 2 | Parceiro fiscal (Focus NF-e vs Nuvem Fiscal), LLM para agente IA |

---

*Fontes: `intent_interview.md`, `gaps.md`, `domain.md`, `architecture.md`, `ideas/` · 2026-05-12*
