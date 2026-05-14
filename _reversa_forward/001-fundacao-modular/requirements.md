# Requirements: Fundação Modular do Produto

> Identificador: `001-fundacao-modular`
> Data: `2026-05-14`
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

Construir o esqueleto técnico da plataforma **NattivusECO** — produto privado novo de gestão integrada **CRM + ERP**, comercializado em dois módulos funcionais: **NattivusCRM** e **NattivusERP**. A plataforma é organizada como um shell modular onde cada módulo é uma unidade auto-contida, ativável por workspace e componentizável internamente. O produto é **inspirado** no Twenty CRM — herdando padrões de modelo de dados, motor de workflow, timeline polimórfica e dashboards — mas **não é um fork**: arquitetura, código e identidade são próprios. Esta feature entrega o shell (autenticação, multi-tenancy, carregamento de módulos, contratos compartilhados, SDK público para extensões de terceiros) sobre o qual todos os módulos subsequentes serão construídos. **Ordem de priorização funcional pós-fundação:** perfil Social/Institucional primeiro (caso ISOFÉ — gestão de doações, voluntários, atendimentos, sem fins lucrativos), depois perfil Empresarial completo (incluindo NF-e).

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/architecture.md` | Twenty é monorepo Nx com backend NestJS + GraphQL, frontend React + Vite + Jotai, Postgres transacional, ClickHouse analítico, Redis/BullMQ para filas. Padrão a herdar como referência, não como obrigação. | 🟢 |
| `_reversa_sdd/domain.md#regras-implicitas` | Regras transversais a serem replicadas conceitualmente: soft-delete global (`deletedAt`), busca vetorial (`searchVector` TSVECTOR), anexos polimórficos, ownership universal por `WorkspaceMember`, pipeline de guards em 3 camadas (auth → permission → domain). | 🟢 |
| `_reversa_sdd/domain.md#glossario` | Conceitos-chave a preservar no produto novo: Workspace, WorkspaceMember, Standard Object, PermissionFlagType. | 🟢 |
| `_reversa_sdd/inventory.md` | Stack já validada no legado (TypeScript, NestJS, React, Postgres, ClickHouse, Redis). Boa base de partida; pode ser revista no spike técnico. | 🟢 |
| `_reversa_sdd/evolution/target_product_architecture.md#topologia` | Topologia legada propõe `packages/twenty-erp` ao lado do Twenty Core. Adaptar conceitualmente: produto novo tem `packages/<produto>-shell`, `packages/<produto>-crm`, `packages/<produto>-erp`. | 🟡 |
| `_reversa_sdd/evolution/product_intent.md#decisoes-tecnicas` | Decisão prévia "Stack: React/NestJS/TypeScript (existente)" foi feita sob lente de fork. Sob nova lente (produto novo), a stack passa a ser candidato preferencial — não obrigatório. | 🟡 |
| `_reversa_sdd/permissions.md` | Modelo RBAC do Twenty: PermissionFlagType (Settings + Tools), 3 guard types, 30 flags confirmadas. Servir de referência para o sistema de permissões do produto novo. | 🟢 |
| `_reversa_sdd/evolution/handoff.md#decisoes-pendentes` | Decisões D3 (nome do produto) e D4 (modelo de negócio) **resolvidas** nesta sessão de clarify: marca = NattivusECO; modelo = privado com SDK público. D1 (parceiro fiscal) segue para feature de Fiscal. | 🟢 |
| **Decisão de stack (sessão 2026-05-14)** | Stack confirmada: TypeScript + NestJS + React + Vite + Postgres (com extensão **pgvector**) + Redis/BullMQ + ClickHouse + **Qdrant** (vetorial standalone). Mantém caminho de menor atrito sobre o conhecimento já extraído. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| **Engenheiro de plataforma** | Criar o esqueleto que sustenta todos os módulos | Inicializa monorepo, gera shell, valida que módulo placeholder carrega via descoberta automática |
| **Admin de workspace** | Configurar instância para uso por uma organização | Cria workspace, ativa módulos CRM e/ou ERP conforme perfil (empresarial ou social), convida membros |
| **WorkspaceMember (qualquer papel)** | Autenticar e usar o sistema | Faz login, recebe permissões conforme papel, vê apenas dados do próprio workspace e módulos habilitados |
| **DevOps** | Operar a plataforma | Provisiona instância (cloud ou self-hosted), executa migrações, configura observabilidade |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Cada módulo funcional (CRM, ERP-Empresarial, ERP-Social) é **opt-in por workspace**. O shell descobre módulos disponíveis no monorepo e expõe um catálogo; o admin ativa apenas os relevantes para o perfil da organização. 🟢
   - Origem no legado: `_reversa_sdd/evolution/product_intent.md#sintese` (módulos ativados por perfil)
   - Tipo: nova
2. **RN-02:** O shell **não conhece** o domínio dos módulos. Toda comunicação entre módulos passa por contratos públicos (eventos + tipos compartilhados em `<produto>-shared`). Dependência reversa (módulo → shell, sim; shell → módulo, não; módulo A → módulo B, apenas via contrato). 🟢
   - Origem no legado: `_reversa_sdd/evolution/target_product_architecture.md#topologia` (regra "twenty-erp importa de twenty-server, nunca ao contrário")
   - Tipo: nova
3. **RN-03:** Toda entidade de domínio em qualquer módulo herda automaticamente: `id` UUID, `createdAt`, `updatedAt`, `deletedAt` (soft-delete), `workspaceId` (multi-tenancy), `searchVector` (busca full-text), `position` (ordenação manual). Garantia via classe base ou mixin do shell. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#regras-implicitas` (regras 4, 5)
   - Tipo: nova (replicando padrão confirmado)
4. **RN-04:** Isolamento multi-tenant é **inviolável**: nenhuma consulta atravessa workspaces. Implementado em camada de baixo nível (row-level security no Postgres + filtro automático no ORM), nunca delegado ao código de domínio. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#glossario` (Workspace), `_reversa_sdd/permissions.md`
   - Tipo: nova
5. **RN-05:** Pipeline de autorização em **3 camadas obrigatórias** para cada endpoint: (a) autenticação (token válido), (b) permission flag (módulo + ação), (c) regra de domínio (opcional). Configurado declarativamente, não dispersado no código. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#regras-implicitas` (regra 12)
   - Tipo: nova
6. **RN-06:** Componentização interna obrigatória nos módulos: cada módulo expõe **componentes UI** parametrizáveis (props/slots) e **componentes de domínio** (entidades configuráveis via metadata, não hard-coded). Um cliente deve conseguir customizar campos visíveis e fluxos sem fork de código. 🟡
   - Origem no legado: `_reversa_sdd/evolution/product_intent.md#sintese` (módulos componentizados e flexíveis — declaração de intent do usuário)
   - Tipo: nova
7. **RN-07:** Identidade visual e branding são **trocáveis por configuração** (nome, logo, paleta primária, favicon). Default da plataforma carrega identidade **NattivusECO**; workspaces white-label podem sobrescrever via settings. 🟢
   - Origem no legado: inexistente — requisito de produto novo
   - Tipo: nova
8. **RN-08:** O shell expõe um **SDK público versionado** (`@nattivus/sdk`) que terceiros podem usar para construir módulos fora do monorepo principal. Compatibilidade entre versões do SDK segue SemVer estrito. 🟢
   - Origem no legado: inexistente — decisão de modelo de licenciamento (sessão clarify 2026-05-14)
   - Tipo: nova
9. **RN-09:** Autenticação obrigatória com **email/senha + 2FA TOTP**. Não há login sem segundo fator após o primeiro acesso (enrollment obrigatório no primeiro login). Tokens TOTP seguem RFC 6238. 🟢
   - Origem no legado: inexistente — decisão de segurança (sessão clarify 2026-05-14)
   - Tipo: nova
10. **RN-10:** A plataforma oferece capacidade de **busca semântica e embeddings** desde a fundação. Vetores curtos e ligados a entidades transacionais ficam em **Postgres + pgvector**; vetores grandes e coleções dedicadas (documentos, conhecimento) ficam em **Qdrant**. Módulos consomem essa capacidade via API uniforme exposta pelo shell. 🟢
    - Origem no legado: inexistente — decisão de stack (sessão clarify 2026-05-14)
    - Tipo: nova

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Inicializar monorepo NattivusECO com estrutura `packages/nattivus-shell`, `packages/nattivus-shared`, `packages/nattivus-ui`, `packages/nattivus-sdk` (público) e diretório `packages/modules/` para módulos funcionais | Must | `yarn install` roda sem erro; `nx graph` mostra os pacotes; shell tem `main.ts` que sobe servidor HTTP; `@nattivus/sdk` publicável como pacote npm | 🟢 |
| RF-02 | Definir contrato `IModule` em `<produto>-shared` que cada módulo deve implementar (manifesto: id, nome, versão, entidades, rotas, permissions, dependências) | Must | Interface tipada exportada; teste estático verifica que módulo placeholder satisfaz o contrato | 🟢 |
| RF-03 | Implementar descoberta automática de módulos: shell escaneia `packages/*-module-*` no startup, valida manifesto, registra rotas/entidades | Must | Adicionar um módulo `hello-world` faz o endpoint `/api/hello` aparecer sem editar shell | 🟢 |
| RF-04 | Implementar autenticação por email/senha **com 2FA TOTP obrigatório** (RFC 6238), emitindo JWT de curta duração + refresh token | Must | Login com senha válida pede TOTP; primeiro login obriga enrollment com QR code; TOTP inválido bloqueia emissão; refresh emite novo par; rate limit em tentativas falhas | 🟢 |
| RF-04b | Permitir gerar e revogar **backup codes** (códigos de uso único) para recuperação de TOTP | Must | Usuário gera N códigos no enrollment; cada código consumido é invalidado; revogação substitui o conjunto inteiro | 🟢 |
| RF-05 | Implementar entidade `Workspace` e `WorkspaceMember` no shell com convites por email e papéis configuráveis | Must | Admin cria workspace; convida membro; membro recebe email com link de aceite; após aceitar, vê o workspace | 🟢 |
| RF-06 | Implementar isolamento multi-tenant via row-level security no Postgres + filtro automático no ORM por `workspaceId` | Must | Teste de integração: usuário do workspace A faz query e nunca recebe dados do workspace B, mesmo via SQL direto | 🟢 |
| RF-07 | Implementar pipeline de guards de 3 camadas (auth → permission → domain) configurável por decorador/middleware | Must | Endpoint anotado com `@RequirePermission('crm.read')` rejeita usuário sem a flag; auth ausente → 401; permission ausente → 403 | 🟢 |
| RF-08 | Implementar classe base `BaseEntity` (ou equivalente) com `id`, `createdAt`, `updatedAt`, `deletedAt`, `workspaceId`, `searchVector`, `position`. Soft-delete e busca textual ativados por padrão | Must | Entidade de teste que estende `BaseEntity` herda os campos; `entity.delete()` faz soft-delete; busca por texto encontra registros | 🟢 |
| RF-09 | Catálogo de módulos no admin: lista módulos disponíveis, status (ativo/inativo no workspace), botão para ativar/desativar | Must | Admin acessa `/settings/modules`, ativa módulo, recarrega — rotas do módulo passam a responder; desativa — rotas retornam 404/desabilitado | 🟢 |
| RF-10 | Sistema de tema/branding configurável: default carrega identidade **NattivusECO**; workspaces white-label sobrescrevem nome, logo, paleta primária e favicon via settings ou env vars | Should | Sem config customizada, header mostra "NattivusECO"; trocar `WORKSPACE_BRAND_NAME` ou settings via UI atualiza título e header sem rebuild | 🟢 |
| RF-13 | Expor API uniforme de **busca semântica** no shell que abstrai backend de embeddings (pgvector para vetores curtos por entidade, Qdrant para coleções grandes/documentos). Módulos consomem via SDK sem conhecer o backend | Should | Módulo chama `semanticSearch({collection, query})` e recebe resultados ranqueados; troca de backend não exige mudança de código nos módulos | 🟢 |
| RF-14 | Publicar `@nattivus/sdk` como pacote versionado com contratos `IModule`, helpers de manifesto, tipos compartilhados e cliente do shell para extensões externas | Should | `npm install @nattivus/sdk` em projeto externo permite implementar `IModule`; CI publica versão a cada tag SemVer; breaking changes seguem major bump | 🟢 |
| RF-11 | Bootstrap de banco de dados: comandos `db:init`, `db:migrate`, `db:reset` no shell. Migrações por módulo isoladas e ordenadas por dependência declarada no manifesto | Must | `yarn db:init` cria schema do shell; ativar módulo executa migrações dele; rollback funciona | 🟢 |
| RF-12 | Observabilidade base: logs estruturados (JSON), correlation ID por request, health check `/health` retornando status do DB, cache e dependências críticas | Should | `/health` responde 200 com JSON; logs incluem `requestId`, `workspaceId`, `userId` quando aplicável | 🟡 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| **Modularidade** | Adicionar um módulo novo não pode exigir mudança no shell nem nos outros módulos. Manifesto é o único ponto de integração. | Princípio central do produto (RN-01, RN-02) | 🟢 |
| **Componentização** | Componentes UI dos módulos expõem props/slots; entidades de domínio são configuráveis via metadata, não hard-coded | Intent declarada por Bez (memória `project_intent.md`) | 🟢 |
| **Isolamento multi-tenant** | Cross-tenant data leak é tratado como bug de severidade máxima — teste de regressão obrigatório em CI | RN-04, herdado de Twenty (`_reversa_sdd/domain.md`) | 🟢 |
| **Segurança** | Senhas armazenadas com hash forte (Argon2 ou bcrypt cost ≥ 12); JWTs com expiração curta (≤15min) e refresh tokens revogáveis; HTTPS obrigatório em produção | OWASP boilerplate; LGPD para uso futuro com dados sensíveis (perfil social) | 🟢 |
| **Privacidade (LGPD)** | Shell prevê desde a fundação: campo de consentimento por workspace, log de acessos a dados pessoais, capacidade de exportar e apagar dados de um titular | `_reversa_sdd/evolution/handoff.md#regras-absolutas` (LGPD obrigatório) | 🟢 |
| **Desempenho** | Startup do shell em ambiente local: <5 segundos. Latência de endpoint trivial (`/health`): p95 <50ms. Descoberta de módulos não escala linearmente além de 50 módulos. | Razoável para shell antes de qualquer carga real; revisar quando módulos funcionais entrarem | 🟡 |
| **Observabilidade** | Logs estruturados, métricas Prometheus expostas em `/metrics`, traces OpenTelemetry opcionais | RF-12; padrão de mercado para SaaS multi-tenant | 🟡 |
| **Portabilidade** | Deploy self-hosted (Docker Compose) e cloud (container em qualquer orquestrador). Sem dependência de provedor específico. | `_reversa_sdd/evolution/product_intent.md#decisoes-tecnicas` (deploy self-hosted e cloud) | 🟡 |
| **Documentação** | Cada módulo entrega: README (uso), manifesto comentado, exemplos de extensão. Shell entrega guia "como criar um módulo novo" e documentação pública do `@nattivus/sdk` | Pré-requisito para terceiros estenderem a plataforma via SDK público sem fork | 🟢 |
| **Inteligência semântica** | Plataforma suporta embeddings desde o dia zero: pgvector (vetores curtos colados a entidades transacionais), Qdrant (coleções dedicadas de documentos/conhecimento). API unificada exposta pelo shell | RN-10; capacita módulos a entregarem busca semântica, sugestões e classificação sem reinventar infra de IA | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Bootstrap do monorepo
  Dado um diretório vazio
  Quando executo o script de bootstrap do produto novo
  Então o monorepo é gerado com packages shell, shared, ui e diretório de módulos
  E "yarn install" completa sem erro
  E "nx graph" lista os pacotes

Cenário: Módulo placeholder é descoberto automaticamente
  Dado o shell rodando
  E um módulo "hello-world" presente em packages/ com manifesto válido
  Quando reinicio o shell
  Então a rota GET /api/hello é registrada
  E responde 200 sem que eu tenha editado código do shell

Cenário: Isolamento multi-tenant
  Dado dois workspaces "A" e "B" com dados em uma mesma tabela
  E um usuário autenticado no workspace "A"
  Quando ele executa qualquer query sobre essa tabela
  Então apenas linhas com workspaceId = A são retornadas
  E nenhuma forma de bypass (ORM, GraphQL, raw SQL via API) expõe linhas de B

Cenário: Pipeline de autorização rejeita usuário sem permissão
  Dado um endpoint protegido por @RequirePermission("crm.read")
  E um usuário autenticado sem essa flag
  Quando ele chama o endpoint
  Então recebe 403 Forbidden
  E o log estruturado registra a tentativa com requestId, userId e a permissão exigida

Cenário: Ativação de módulo no workspace
  Dado um admin autenticado no workspace
  E o módulo "crm" disponível no catálogo mas inativo no workspace
  Quando o admin clica em "Ativar" para o módulo "crm"
  Então as rotas do módulo crm passam a responder dentro do workspace
  E entidades do módulo aparecem na API
  E não há vazamento para outros workspaces que não ativaram

Cenário (negativo): Módulo com manifesto inválido não é carregado
  Dado um módulo presente em packages/ com manifesto sem id ou versão
  Quando o shell inicia
  Então o módulo é rejeitado com log de erro descritivo
  E o shell continua subindo normalmente sem esse módulo

Cenário: Login exige 2FA TOTP após senha
  Dado um usuário com TOTP já configurado
  Quando ele autentica com email e senha válidos
  Então o sistema responde 200 com um intermediate-token e exige TOTP
  E só emite o par JWT + refresh após TOTP válido
  E TOTP inválido três vezes consecutivas dispara cooldown de 60 segundos

Cenário: Primeiro login força enrollment de TOTP
  Dado um usuário recém-criado sem TOTP configurado
  Quando ele autentica com email e senha válidos pela primeira vez
  Então o sistema exibe QR code para configuração em app autenticador
  E entrega N backup codes de uso único
  E só conclui o login após TOTP de verificação válido

Cenário: Busca semântica via API uniforme do shell
  Dado um módulo que solicitou índice semântico para a entidade "Beneficiario"
  E embeddings já gerados para registros existentes
  Quando o módulo chama semanticSearch({collection: "beneficiario", query: "mães solo com filhos pequenos"})
  Então recebe lista ranqueada por similaridade
  E não precisa saber se o backend foi pgvector ou Qdrant
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 a RF-09, RF-11 | Must | Sem esses, não há produto — são o esqueleto |
| RF-04b (backup codes TOTP) | Must | Sem fallback, perda de dispositivo bloqueia acesso permanentemente |
| RF-10 (tema/branding) | Should | Default Nattivus já cobre lançamento; white-label entra quando houver cliente que peça |
| RF-12 (observabilidade base) | Should | Crítico em produção mas pode iniciar mínima no spike |
| RF-13 (busca semântica) | Should | Capacidade vetorial é diferencial estratégico; pode ser plumbing-only no v1 (API exposta, sem uso de domínio ainda) |
| RF-14 (SDK público) | Should | Modelo de licenciamento depende dele; pode entrar como pacote interno no spike e ser publicado na release |
| Métricas Prometheus / traces OpenTelemetry | Could | Pode entrar em feature dedicada após primeiros módulos funcionais |
| Login social (SSO OAuth Google/Microsoft) | Won't (v1) | 2FA TOTP cobre segurança; SSO entra quando houver cliente corporativo que peça |

## 9. Esclarecimentos

### Sessão 2026-05-14

- **Q:** Nome e identidade do produto novo.
  **R:** Marca-mãe **NattivusECO**. Produtos comerciais: **NattivusCRM** e **NattivusERP**. Pacotes do monorepo passam a usar prefixo `nattivus-*`. SDK público publicado como `@nattivus/sdk`.
- **Q:** Stack técnica do produto novo.
  **R:** Manter TypeScript + NestJS + React + Vite + Postgres + Redis/BullMQ + ClickHouse (opção A, menor atrito sobre o conhecimento extraído). **Adições:** extensão **pgvector** no Postgres (vetores curtos ligados a entidades) + **Qdrant** standalone (coleções vetoriais grandes — documentos, conhecimento). API uniforme exposta pelo shell esconde o backend dos módulos.
- **Q:** Modelo de licenciamento e repositório.
  **R:** Privado com **SDK público** para extensões de terceiros (opção C). O core (shell + módulos comerciais Nattivus) é privado e fechado; `@nattivus/sdk` é publicado em registry público com SemVer estrito para permitir que parceiros construam módulos externos.
- **Q:** Primeiro perfil funcional a entregar após a fundação.
  **R:** **Social/Institucional primeiro** (caso ISOFÉ): CRM clássico + módulos administrativos do ERP relevantes para entidades sem fins lucrativos (controle de produtos doados, serviços de voluntários, pedidos, estoque, financeiro — **sem NF-e nesta fase**). Depois, **Empresarial completo** com CRM clássico + ERP comercial pleno (pedidos, estoque, NF-e, financeiro).
- **Q:** Estratégia de autenticação no MVP.
  **R:** Email/senha + **2FA TOTP obrigatório** (opção D). Enrollment forçado no primeiro login, backup codes obrigatórios. Sem SSO/OAuth no v1.

## 10. Lacunas

Nenhuma `[DÚVIDA]` pendente. Todas as lacunas iniciais foram resolvidas na sessão de esclarecimentos de 2026-05-14.

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-14 | Versão inicial gerada por `/reversa-requirements` | reversa |
| 2026-05-14 | Sessão clarify: resolvidas 3 DÚVIDAs + 2 lacunas de impacto. Marca NattivusECO definida, stack confirmada com pgvector + Qdrant, modelo privado com SDK público, prioridade Social→Empresarial, 2FA TOTP obrigatório. Adicionados RN-08/09/10, RF-04b, RF-13, RF-14 e 3 cenários Gherkin novos. | reversa-clarify |
