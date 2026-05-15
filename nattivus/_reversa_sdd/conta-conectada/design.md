# Conta Conectada, Design Técnico

> Especificação técnica de como o módulo de Contas Conectadas é construído no Twenty CRM.

## Interface

### Entidades (Workspace Entities)

| Entidade | Descrição | Principais Campos |
|----------|-----------|-------------------|
| `ConnectedAccount` | Raiz da conexão externa | `provider`, `handle` (e-mail), `accessToken`, `refreshToken`, `scopes` |

### Serviços e Drivers

| Símbolo | Função | Observação |
|---------|--------|------------|
| `ConnectedAccountRefreshTokensService` | Orquestra a renovação de tokens | Delegada para drivers específicos (Google/MS) |
| `GoogleApiRefreshTokensService` | Driver para Google OAuth | Lida com endpoints do Google Identity |
| `MicrosoftApiRefreshTokensService` | Driver para Microsoft OAuth | Lida com MSAL/Azure AD |
| `ImapSmtpCaldavApisService` | Abstração para conexões manuais | Gerencia credenciais e validação de host |

## Fluxo de Autenticação OAuth
1. Frontend dispara `useTriggerApiOAuth`. 🟢
2. O usuário é redirecionado para o provedor (Google/MS).
3. O provedor retorna um `code` para o callback do servidor.
4. O servidor troca o `code` por `accessToken` e `refreshToken`. 🟡
5. O registro em `ConnectedAccount` é criado/atualizado e os canais de sincronização são inicializados. 🟢

## Gestão de Refresh Tokens
- O sistema possui um `RefreshTokensManager` que encapsula a complexidade de cada provedor. 🟢
- Em caso de falha de renovação, o serviço lança uma `ConnectedAccountRefreshTokensException`. 🟢
- O utilitário `parse-google-oauth-error.util.ts` e `parse-msal-error.util.ts` traduzem erros de API em estados internos do CRM (ex: conta revogada). 🟢

## Dependências
- `WorkspaceMember`: A conta conectada pertence a um membro específico. 🟢
- `CalendarChannel`: Consome a conexão para sincronizar eventos. 🟢
- `MessageChannel`: Consome a conexão para sincronizar e-mails. 🟢
- `Scheduler / Workers`: Executam as tarefas de refresh em background. 🟡

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| Arquitetura de drivers para OAuth | `refresh-tokens-manager/drivers/` | 🟢 |
| Centralização de tratamento de erros de provedor | `utils/parse-google-oauth-error.util.ts` | 🟢 |
| Gestão de throttling baseada em IP/Conta | `utils/is-throttled.ts` | 🟢 |
| Abstração de protocolos (IMAP/SMTP/CalDAV) | `imap-smtp-caldav-apis.service.ts` | 🟢 |

## Estado Interno
- O `SyncStatus` é computado dinamicamente no frontend (`computeSyncStatus.ts`) com base nos metadados da conta e dos canais. 🟢

## Riscos e Lacunas
- 🔴 Lógica de expiração do `refreshToken` (alguns provedores exigem re-login após X dias mesmo com refresh).
- 🔴 Armazenamento seguro de segredos de cliente (Client ID/Secret) para multi-tenant (se são globais ou por workspace).
- 🟡 Suporte a MFA (Multi-Factor Authentication) para conexões IMAP diretas (App Passwords).
