# Base do Produto Atual — Twenty CRM

> **Gerado por:** reversa-evolve
> **Data:** 2026-05-12
> **Fontes:** `inventory.md`, `architecture.md`, `domain.md`, `permissions.md`, `state-machines.md`, `gaps.md`

---

## 1. Visão Geral

| Atributo | Valor |
|----------|-------|
| Nome | Twenty (Open Source CRM) |
| Tipo | Monorepo Nx |
| Linguagem | TypeScript 5.9.x |
| Pacotes | 12 pacotes (`twenty-server`, `twenty-front`, `twenty-ui`, `twenty-shared`, `twenty-utils`, `twenty-sdk`, `twenty-zapier`, `twenty-emails`, `twenty-docs`, `twenty-website`, `twenty-cli`, `twenty-companion`) |
| Backend | NestJS + GraphQL + TypeORM |
| Frontend | React + Jotai + Apollo Client + Linaria + Vite |
| Banco principal | PostgreSQL |
| Banco analítico | ClickHouse |
| Cache / Filas | Redis + BullMQ |
| Testes | ~1318 arquivos (Jest, Vitest, Playwright) |

---

## 2. Classificação: Preservar / Expandir / Repensar

### 🟢 PRESERVAR — Base confiável, herda o produto alvo

#### Infraestrutura técnica

| Componente | O que faz | Por que preservar |
|------------|-----------|-------------------|
| `BaseWorkspaceEntity` | Base de todas as entidades: `id` (UUID), `createdAt`, `updatedAt`, `deletedAt`, `searchVector` | Módulos ERP seguem exatamente este padrão — herdam soft-delete, busca e API gratuitamente |
| Workflow Engine (BullMQ + Trigger/Steps) | Automação por evento ou cron; versionamento de versões | Cola entre CRM e ERP: `CLOSED_WON` → Pedido, entrega → baixa de estoque |
| Timeline Activity (polimórfica) | Feed de auditoria automático para qualquer entidade | Todo evento ERP (mudança de pedido, lançamento, entrada de estoque) rastreado automaticamente |
| Dashboard Engine (PageLayout + Widget + ChartData) | Dashboards configuráveis por workspace | KPIs comerciais e indicadores de impacto social sem nova infra de BI |
| Sistema de permissões (WorkspaceMember + Roles) | RBAC por workspace | Base do controle de acesso ao ERP: aprova pedido, emite NF-e, acessa dados sensíveis |
| API GraphQL (NestJS + Apollo) | API única consumida por frontend e integrações | Todos os módulos ERP disponíveis imediatamente na mesma API |
| Multi-workspace / tenancy | Ambientes isolados por organização | Multi-empresa, multi-CNPJ e multi-instituto sem nova arquitetura |
| Attachments polimórficos | Arquivos vinculados a qualquer entidade | XML NF-e, DANFE, contratos, laudos, documentos de beneficiários |
| Busca full-text (TSVECTOR / GIN index) | Busca em qualquer Standard Object | Busca por número de pedido, beneficiário, produto, NF-e |
| Soft-delete global (`deletedAt`) | Exclusão lógica em vez de física | Cancelamentos de pedido, reversão de lançamentos — nunca destrutivos |
| ClickHouse | Banco analítico | DRE, Fluxo de Caixa, indicadores de impacto — queries pesadas fora do PostgreSQL transacional |
| Storage de arquivos (local/S3/Backblaze) | Armazenamento de anexos | Pronto para XML NF-e, PDFs de DANFE, relatórios de prestação de contas |
| Infraestrutura de e-mail (`twenty-emails` + react-email) | Templates transacionais | Notificações de pedido, lembretes de vencimento, relatórios automáticos para financiadores |

#### Entidades CRM base

| Entidade | Papel no produto alvo |
|----------|-----------------------|
| `Company` | Cliente ERP (comercial) / Parceiro/Financiador (social). Campo `erpType` adicional |
| `Person` | Contato CRM e beneficiário/voluntário (social). Registro de vendedor, atendente |
| `Opportunity` | Pré-pedido comercial. Transição `CLOSED_WON` → `Pedido de Venda` |
| `Task` | Tarefas operacionais — alertas de follow-up comercial e revisão de atendimentos |
| `Note` | Notas sobre clientes, oportunidades, atendimentos |
| `Attachment` | Documentos polimórficos (NF-e, contratos, laudos) |
| `WorkflowRun` | Execução de automação ERP e social |
| `WorkspaceMember` | Usuário autenticado — base do RBAC de ambos os perfis |

#### Máquinas de estado existentes (reutilizáveis)

| Entidade | Estados | Reutilização no ERP |
|----------|---------|---------------------|
| `Opportunity` | NEW → SCREENING → PROPOSAL → WON/LOST | `WON` dispara criação de `Pedido de Venda` |
| `Task` | TODO → IN_PROGRESS → DONE | Alertas de aprovação de pedido, revisão de atendimento |
| `WorkflowRun` | ENQUEUED → RUNNING → COMPLETED/FAILED/TIMEOUT | Toda automação ERP (NF-e, baixa, alerta de estoque) |

---

### 🟡 EXPANDIR — Existem mas precisam de capacidades adicionais

| Componente | Estado atual | Expansão necessária |
|------------|-------------|---------------------|
| `Company` | Entidade CRM de cliente B2B | Adicionar `erpType` (CLIENTE/FORNECEDOR/AMBOS), `erpCustomerCode`, campos fiscais (CNPJ, IE, regime tributário) |
| `Person` | Contato CRM | Adicionar `personType` (contato/beneficiário/voluntário/colaborador), `cpf` (criptografado), `consentStatus` (LGPD) |
| RBAC | Admin/Member/Guest (genérico) | Papéis específicos por módulo ERP: Aprovador de Pedido, Emissor Fiscal, Gestor de Estoque, DPO, Coordenador de Programa |
| Dashboard Engine | KPIs genéricos | Templates pré-configurados: DRE, Fluxo de Caixa, Indicadores de Impacto Social, SROI |
| Workflow Engine | Trigger/Steps genéricos | Ações específicas: criar pedido de venda, disparar NF-e, baixar estoque, registrar hora voluntária |
| Busca | TSVECTOR em Standard Objects | Estender para Produtos, Pedidos, Beneficiários, Atendimentos |

---

### 🔴 REPENSAR — Precisam mudar para acomodar a expansão

| Componente | Problema atual | Solução proposta |
|------------|---------------|-----------------|
| Modelo de roles (RBAC) | Apenas Admin/Member — sem granularidade por módulo | Novo sistema de papéis funcionais por módulo ERP ativado |
| Ausência de dados mestres de ERP | Company é apenas CRM, sem campos fiscais, sem estoque | Extensão via Standard Objects ERP (não reescrita) |
| Sem fluxo de aprovação | Workflow não tem conceito de "aprovação multi-nível" nativo | Implementar via Workflow Steps com ação `WAIT_FOR_APPROVAL` |
| Sem conceito de "registro mestre" | No Twenty atual, CRM é a fonte de verdade | Para o perfil social, ERP é o sistema de registro mestre; CRM consome. Exige nova disciplina de dados |

---

## 3. Ativos Técnicos por Reutilização

| Ativo | Módulo ERP Empresarial | Módulo ERP Social |
|-------|------------------------|-------------------|
| `BaseWorkspaceEntity` | Pedido, Produto, ContaReceber | Programa, Beneficiário, Atendimento, Doação |
| Workflow Engine | CLOSED_WON → Pedido, NF-e, Alerta estoque | Atendimento → baixa estoque, hora voluntária → ERP |
| Timeline | Histórico de pedido, nota fiscal | Histórico de atendimento, caso, evolução familiar |
| Dashboard Engine | DRE, Fluxo de Caixa, Aging | Indicadores de impacto, SROI, vulnerabilidade territorial |
| Attachments | NF-e XML, DANFE, contratos | Laudos, documentos LGPD, relatórios de financiadores |
| ClickHouse | Relatórios financeiros pesados | Indicadores de impacto por período/território |
| Multi-workspace | Multi-empresa, multi-CNPJ | Multi-instituto |
| Storage S3 | Arquivos NF-e, PDFs | Documentos de beneficiários (criptografados) |

---

## 4. Gaps do Produto Atual Relevantes para a Evolução

> Gaps herdados do `gaps.md` que impactam diretamente os módulos ERP:

| Gap | Impacto na evolução | Ação antes do ERP |
|-----|--------------------|--------------------|
| **GAP-C01** — Orphan cleanup no storage | Arquivos de NF-e e documentos de beneficiários podem ficar órfãos após exclusão | Implementar cron de limpeza antes de produção |
| **GAP-C03** — Admin único por workspace | Workspace empresarial ou de instituto pode ficar sem governança | Validar `if (adminCount == 1 && isRemovingAdmin) throw` |
| **GAP-M02** — Resolução de variáveis entre steps de Workflow | Dados da Oportunidade não chegam corretamente ao Pedido se a passagem de contexto falhar | Confirmar `WorkflowExecutorService` antes de implementar transição CRM→ERP |
| **GAP-M03** — Condicionais e loops em Workflows | Fluxos de aprovação de pedido e notificações de estoque mínimo dependem de condicionais | Verificar `WorkflowNodeType` enum |
| **GAP-C04** — FTS em Notas | Busca de histórico de atendimento e notas de casos não funciona | Avaliar GIN index em `body`/`richText` antes de produção |

---

## 5. O Que o Twenty Já Resolve (Grátis)

- ✅ Autenticação e autorização de usuários
- ✅ Onboarding de workspace
- ✅ Estrutura de banco de dados modular (extensível por objetos)
- ✅ UI premium e responsiva (React + Linaria)
- ✅ Sistema de notificações e integrações (email, webhooks via Workflow)
- ✅ Infraestrutura de filas (BullMQ) para jobs assíncronos
- ✅ Analytics (ClickHouse) para relatórios pesados
- ✅ Storage de arquivos (local/S3/Backblaze)
- ✅ Soft-delete global
- ✅ Busca full-text automática em todas as entidades
- ✅ Multi-tenancy por workspace

---

*Fontes: `inventory.md`, `architecture.md`, `domain.md`, `permissions.md`, `state-machines.md`, `gaps.md` · 2026-05-12*
