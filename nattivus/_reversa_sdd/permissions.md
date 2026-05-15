# Matriz de Permissões (RBAC / ACL)

Visão geral dos perfis de acesso, baseada no enum `PermissionFlagType` confirmado em `twenty-shared` e nos Guards do NestJS.

## Arquitetura de Guards (Pipeline de Autorização)

O sistema utiliza 3 tipos de Permission Guards aplicados como decorators `@UseGuards()`:

| Guard | Comportamento | Quando usar |
|-------|---------------|-------------|
| `SettingsPermissionGuard(flag)` | Consulta `PermissionsService.userHasWorkspaceSettingPermission()` com a flag. Lança `PermissionsException` se negado. Permite bypass durante `PENDING_CREATION` / `ONGOING_CREATION`. | Maioria dos endpoints protegidos. 🟢 CONFIRMADO |
| `CustomPermissionGuard` | Sempre retorna `true`. Serve como documentação de que o endpoint tem lógica custom dentro do resolver. | Self-only ops, lógica dinâmica de ownership. 🟢 CONFIRMADO |
| `NoPermissionGuard` | Sempre retorna `true`. Marca endpoint como intencionalmente aberto (onboarding, público). | Onboarding, profile updates, leitura básica. 🟢 CONFIRMADO |

> Confiança: 🟢 CONFIRMADO — Código-fonte dos guards lido e documentado.

---

## Flags de Permissão (`PermissionFlagType`)

Enum confirmado em `packages/twenty-shared/src/constants/PermissionFlagType.ts`:

### Settings Permissions

| Flag | Escopo | Confiança |
|------|--------|-----------|
| `API_KEYS_AND_WEBHOOKS` | Gerenciamento de API Keys e Webhooks. | 🟢 CONFIRMADO |
| `WORKSPACE` | Configurações gerais do workspace (nome, URL, logo). | 🟢 CONFIRMADO |
| `WORKSPACE_MEMBERS` | Convidar, remover e gerenciar membros. | 🟢 CONFIRMADO |
| `ROLES` | Criar e editar papéis/roles no workspace. | 🟢 CONFIRMADO |
| `DATA_MODEL` | Alterar campos customizados, Standard Objects, metadados. | 🟢 CONFIRMADO |
| `SECURITY` | Configurar SSO, 2FA, políticas de segurança. | 🟢 CONFIRMADO |
| `WORKFLOWS` | Criar, editar e fazer deploy de workflows. | 🟢 CONFIRMADO |
| `IMPERSONATE` | Capacidade de impersonar outro membro do workspace. | 🟢 CONFIRMADO |
| `SSO_BYPASS` | Ignorar exigência de SSO para login. | 🟢 CONFIRMADO |
| `APPLICATIONS` | Gerenciar aplicações conectadas (OAuth clients). | 🟢 CONFIRMADO |
| `MARKETPLACE_APPS` | Instalar/desinstalar apps do marketplace. | 🟢 CONFIRMADO |
| `LAYOUTS` | Gerenciar Page Layouts e widgets de dashboard. | 🟢 CONFIRMADO |
| `BILLING` | Gerenciar assinatura, plano e cobrança. | 🟢 CONFIRMADO |
| `AI_SETTINGS` | Configurar modelos e features de IA. | 🟢 CONFIRMADO |

### Tool Permissions

| Flag | Escopo | Confiança |
|------|--------|-----------|
| `AI` | Usar assistente de IA e agentes. | 🟢 CONFIRMADO |
| `VIEWS` | Criar e editar Views customizadas. | 🟢 CONFIRMADO |
| `UPLOAD_FILE` | Upload de arquivos (attachments). | 🟢 CONFIRMADO |
| `DOWNLOAD_FILE` | Download de arquivos. | 🟢 CONFIRMADO |
| `SEND_EMAIL_TOOL` | Usar ferramenta de envio de email via workflow. | 🟢 CONFIRMADO |
| `HTTP_REQUEST_TOOL` | Usar ferramenta HTTP Request (crucial para ERP → Evolution GO / Telegram). | 🟢 CONFIRMADO |
| `CODE_INTERPRETER_TOOL` | Usar interpretador de código (sandbox). | 🟢 CONFIRMADO |
| `IMPORT_CSV` | Importar dados via CSV. | 🟢 CONFIRMADO |
| `EXPORT_CSV` | Exportar dados via CSV. | 🟢 CONFIRMADO |
| `CONNECTED_ACCOUNTS` | Conectar contas externas (Google/Microsoft). | 🟢 CONFIRMADO |
| `PROFILE_INFORMATION` | Editar informações do próprio perfil. | 🟢 CONFIRMADO |

---

## Matriz de Permissões por Entidade

| Objeto | Membro Comum | Administrador | Regra Específica de Contexto |
|--------|--------------|---------------|------------------------------|
| **Company** | Leitura global, Escrita parcial | Full Access | Edição restrita se `accountOwner` for ativado no modo de privacidade. |
| **Opportunity** | Ler, Criar, Atualizar | Full Access | Acesso pode ser bloqueado se a flag de privacidade de negócios estiver ativa e o usuário não for o `ownerId`. |
| **Task** | Gerenciar próprias | Full Access | O `assigneeId` tem sempre acesso de escrita. |
| **Workflow** | Apenas Leitura | Requer flag `WORKFLOWS` | Apenas quem tem a flag `WORKFLOWS` pode alterar triggers e steps. |
| **Dashboard** | Gerenciar próprios | Requer flag `LAYOUTS` | Membros organizam seus PageLayouts; `LAYOUTS` flag controla edição de globais. |
| **Billing / Config** | Sem acesso | Requer flag `BILLING` | Flag dedicada para pagamentos, planos e chaves API. |
| **Webhook** | Sem acesso | Requer flag `API_KEYS_AND_WEBHOOKS` | Migrado para v2 como entidade de metadado. |
| **Pedido (ERP)** | Criar, Ler, Atualizar | Full Access | Emissão fiscal depende de acesso ao workflow que dispara a action. 🟡 INFERIDO |
| **HTTP Request (ERP→Evolution/Telegram)** | Sem acesso | Requer flag `HTTP_REQUEST_TOOL` | Controla quem pode configurar integrações HTTP nos workflows. |

### Regras Implícitas de Visibilidade
1. **Atribuição (`Owner / Assignee`)**: Entidades com campos como `ownerId`, `assigneeId` ou `accountOwner` tendem a definir a restrição de acesso via interceptors/guards no NestJS. 🟡 INFERIDO
2. **Resolução de Roles em Lote**: A aplicação utiliza `DataLoader` para carregar papéis do usuário (`role resolution`) evitando o problema de N+1 queries no GraphQL. 🟢 CONFIRMADO (Evidência Git)
3. **Bypass em Onboarding**: Durante `PENDING_CREATION` e `ONGOING_CREATION`, o `SettingsPermissionGuard` permite todas as operações, pois o workspace ainda não está configurado. 🟢 CONFIRMADO
4. **`NoPermissionGuard` como Documentação**: Endpoints decorados com este guard são intencionalmente abertos. Qualquer nova mutation do ERP deve usar `SettingsPermissionGuard` ou `CustomPermissionGuard` — nunca `NoPermissionGuard` sem justificativa. 🟢 CONFIRMADO

> **Nota para o ERP:** Operações fiscais (emissão de NF-e) devem exigir no mínimo a flag `WORKFLOWS` (para configurar o workflow) e `HTTP_REQUEST_TOOL` (para executar as chamadas à SEFAZ/Focus NFe). Recomenda-se criar uma flag dedicada `ERP_FISCAL` no futuro.
