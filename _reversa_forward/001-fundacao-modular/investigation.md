# Investigation: Fundação Modular NattivusECO

> Pesquisa de fundo, alternativas avaliadas e padrões aplicáveis para a feature `001-fundacao-modular`.

## 1. Pergunta central

Como construir uma plataforma multi-tenant CRM+ERP modular, com extensibilidade via SDK público, embeddings nativos, 2FA obrigatório e isolamento inviolável, sem reinventar padrões já validados pelo Twenty CRM?

## 2. Padrões herdados do `_reversa_sdd/`

| Padrão extraído | Fonte | Como replicar no NattivusECO |
|-----------------|-------|------------------------------|
| `BaseWorkspaceEntity` (id, workspaceId, deletedAt, searchVector, position) | `_reversa_sdd/architecture.md`, `_reversa_sdd/domain.md#regras-implicitas` (4, 5) | `BaseEntity` em `nattivus-shared`, herdada por todas entidades de módulos |
| Pipeline de 3 guards (auth → permission → domain) | `_reversa_sdd/domain.md#regra-12` | Decorators `@RequireAuth`, `@RequirePermission`, `@RequireDomain` no `@nattivus/sdk` |
| `PermissionFlagType` com 30 flags confirmadas | `_reversa_sdd/permissions.md` | Contrato `PermissionFlag` no SDK; módulos declaram flags no manifesto |
| Soft-delete global via `deletedAt` | `_reversa_sdd/domain.md#regra-4` | Embutido em `BaseEntity`, ativado por padrão no ORM |
| TSVECTOR para busca full-text | `_reversa_sdd/domain.md#regra-5` | Coluna `searchVector` mantida automaticamente por trigger no Postgres |
| Workflow Engine (BullMQ + steps) | `_reversa_sdd/architecture.md#padroes-arquiteturais` | Fora do escopo da fundação; entra como módulo `nattivus-workflow` em feature futura |
| Multi-workspace tenancy | `_reversa_sdd/domain.md#glossario` (Workspace) | Reforçado: RLS no Postgres + middleware ORM (defesa em profundidade) |
| Standard Object com `standardId` UUID estável | `_reversa_sdd/evolution/handoff.md#regras-absolutas` | Convenção mantida: módulos declaram standardIds em constants no manifesto |
| Anexos polimórficos | `_reversa_sdd/domain.md#regra-2` | Não entra na fundação; tema de módulo `nattivus-attachments` |

## 3. Alternativas avaliadas para decisões-chave

### 3.1 Stack backend (D-02)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| NestJS + GraphQL Yoga | Maturidade, decorators ricos, herda mental model do Twenty | Boilerplate, peso runtime | **Escolhido** (D-02) |
| Fastify + tRPC | Mais leve, type-safe end-to-end | Sem ecosystem de decorators maduro; tRPC inviabiliza SDK público em outras linguagens | Descartado |
| Hono + Bun | Performance superior, leve | Bun ainda imaturo para Postgres avançado (RLS, listen/notify); risco de regressão em libs | Descartado para v1 |

### 3.2 Estratégia multi-tenant (D-06)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| RLS Postgres + middleware ORM | Defesa em profundidade; vazamento exigiria falha em duas camadas | Custo de configuração inicial; debug mais difícil | **Escolhido** (D-06) |
| Schema-per-tenant | Isolamento forte, backup por cliente | Migrações N×; pgvector exige instalação por schema; trava ao escalar | Descartado |
| Apenas filtro ORM | Simples | Bug em um ORM call vaza tudo; histórico de incidentes em SaaS | Descartado |

### 3.3 Vector store (D-04, D-05)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| Postgres + pgvector | Transação acoplada, sem coordenação extra, simples para vetores curtos | Recall@k inferior em coleções >10⁵ vetores; índice HNSW custa RAM | **Escolhido** para vetores curtos (D-04) |
| Qdrant standalone | Performance superior em larga escala, filtros ricos | Backup separado, coordenação de consistência (eventual) | **Escolhido** para coleções grandes (D-05) |
| Apenas pgvector | Stack simples | Limita capacidade de busca semântica em documentos extensos | Descartado |
| Pinecone / Weaviate Cloud | Managed, baixa fricção | Vendor lock-in, custo recorrente, dados saem da casa | Descartado |
| Milvus | Maduro, escalável | Operacionalmente mais pesado que Qdrant | Descartado |

### 3.4 Autenticação (D-07, D-08)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| Email/senha + TOTP via `otplib` | Sem dependência externa, padrão RFC 6238, custo zero | UX exige educação do usuário | **Escolhido** (D-07) |
| SSO OAuth (Google/MS) | Conveniência, segurança da plataforma do provedor | Lock-in, complica self-hosted para institutos | Descartado v1 (MoSCoW Won't) |
| Senha + SMS | UX mais simples | SMS é vulnerável a SIM swap; LGPD pede mais cuidado com telefone | Descartado |
| WebAuthn / Passkeys | Estado da arte | Suporte ainda heterogêneo em mobile/desktop antigos | Adiado para feature futura |

### 3.5 Descoberta de módulos (D-10)

| Opção | Prós | Contras | Decisão |
|-------|------|---------|---------|
| Glob em `packages/modules/*/dist/module.manifest.js` no startup | Determinístico, type-safe (TS), falha cedo | Requer build prévio | **Escolhido** (D-10) |
| Class-path scanning runtime | Sem build prévio | Lento, vulnerável a reflexão | Descartado |
| Plugin registry runtime (DB ou API) | Dinâmico, ativável sem deploy | Adiciona ponto de falha; segurança complexa | Descartado v1 |

## 4. Referências externas relevantes

- **OWASP ASVS 4.0** — controles V2 (autenticação) e V4 (autorização) para definir limites de senha, lockout e refresh tokens.
- **RFC 6238 (TOTP)** — base do enrollment e validação de segundo fator.
- **PostgreSQL Row-Level Security docs** — base de D-06; políticas por workspace e função de sessão.
- **pgvector v0.7+** — operadores `<->` (L2), `<#>` (inner product), índices HNSW e IVFFlat.
- **Qdrant docs** — coleções, payload schema, gRPC + REST API.
- **NestJS Custom Decorators** — base de implementação dos guards encadeáveis (D-14).
- **SemVer 2.0** — política de versionamento do `@nattivus/sdk` (D-15).
- **LGPD Art. 46** — exigência de medidas de segurança e proteção de dados (informa D-07/D-08 e a postura geral de privacidade).

## 5. Padrões anti-padrão evitados

| Anti-padrão | Por que evitamos |
|-------------|------------------|
| Singleton de tenant context | Esconde dependência, dificulta teste; usar contexto injetado por request |
| Permissão hard-coded em controller | Acopla módulo ao shell; declarar no manifesto |
| Migration global única | Não permite ativar módulo isoladamente; migrações por módulo |
| Embedding "on read" | Latência alta; computar assíncrono na escrita |
| JWT só, sem refresh nem revogação | Vazamento = sessão eterna; refresh opaco hash-comparado em DB |

## 6. Pontos de incerteza (apurar no spike)

1. Custo de manter RLS sincronizada quando módulos adicionam tabelas (provisionamento automático de policies). 🟡
2. Estratégia de chunking + embedding para documentos longos (out of scope na fundação, mas o índice precisa ser desenhado pensando nisso). 🟡
3. Estratégia de rotação de chaves JWT (operacional: como distribuir nova chave sem downtime). 🟡

Esses três são candidatos a virar tarefas de exploração no `actions.md` quando `/reversa-to-do` rodar.
