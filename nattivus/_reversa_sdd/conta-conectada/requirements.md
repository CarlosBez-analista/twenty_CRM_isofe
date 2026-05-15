# Conta Conectada

> Requisitos funcionais e de negócio para o módulo de Contas Conectadas. Foca no QUE a unidade faz.

## Visão Geral
O módulo de Conta Conectada gerencia o vínculo entre o usuário do CRM e seus provedores externos de comunicação e calendário (Google, Microsoft, IMAP/SMTP). Ele é o alicerce para a sincronização de e-mails e eventos, garantindo que o Twenty CRM tenha acesso autorizado e contínuo aos dados externos.

## Responsabilidades
- Autenticar e autorizar contas via OAuth2 (Google e Microsoft). 🟢
- Suportar conexões diretas via protocolos IMAP, SMTP e CalDAV. 🟢
- Gerenciar o ciclo de vida de tokens de acesso (refresh tokens). 🟢
- Monitorar e reportar o status de sincronização (`SyncStatus`) de cada canal. 🟢
- Orquestrar fluxos de reconexão em caso de falha de autenticação. 🟢

## Regras de Negócio
- Uma conta conectada pode possuir múltiplos canais de sincronização (Mensagens e Calendário). 🟢
- O sistema deve diferenciar entre contas de provedores gerenciados (Google/MS) e contas genéricas (IMAP). 🟢
- Tokens de acesso devem ser renovados automaticamente antes da expiração. 🟢
- Falhas críticas de OAuth (ex: permissão revogada) devem marcar a conta para reconexão manual. 🟢
- O sistema deve respeitar limites de taxa (throttling) impostos pelos provedores externos. 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Conexão via OAuth | Must | Usuário consegue vincular conta Google/Outlook via popup oficial do provedor. |
| RF-02 | Conexão IMAP/SMTP | Must | Usuário consegue configurar servidor, porta e credenciais manualmente. |
| RF-03 | Renovação de Tokens | Must | O sistema atualiza o `accessToken` usando o `refreshToken` sem intervenção do usuário. |
| RF-04 | Monitoramento de Sync | Should | A interface exibe se a conta está "Sincronizada", "Falhando" ou "Reconexão Necessária". |
| RF-05 | Gestão de Canais | Should | Usuário consegue ativar/desativar individualmente a sincronização de E-mail ou Calendário. |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Performance | Throttle de requisições para evitar bloqueio de IP | `is-throttled.ts` | 🟢 |
| Resiliência | Retry exponencial em erros transitórios de rede | `connected-account-refresh-tokens.service.ts` | 🟡 |
| Segurança | Armazenamento criptografado de tokens | `connected-account.workspace-entity.ts` | 🟡 |
| Extensibilidade | Arquitetura de drivers por provedor | `refresh-tokens-manager/drivers/` | 🟢 |

## Critérios de Aceitação

```gherkin
Dado que um usuário inicia a conexão com o Google
Quando ele autoriza os escopos necessários no Google OAuth
Então o Twenty CRM deve armazenar o refreshToken e criar os canais de Calendar e Messages 🟢

Dado uma conta com token expirado
Quando o sistema tenta realizar uma sincronização
Então o RefreshTokensManager deve obter um novo accessToken e prosseguir com a tarefa 🟢

Dado que o usuário revogou o acesso no painel do Outlook
Quando o Twenty CRM recebe um erro de "invalid_grant"
Então a conta deve ser marcada com SyncStatus = ONBOARDING_RECONNECT_NEEDED 🟢
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Autenticação OAuth | Must | Principal forma de conexão para a maioria dos usuários |
| Gestão de Refresh Tokens | Must | Necessário para operação em background (sync) |
| Protocolos Legados (IMAP/SMTP) | Should | Importante para usuários enterprise/custom |
| Interface de Status | Should | Crítico para transparência e troubleshooting |
| Auto-reconnection | Could | Melhora resiliência mas pode ser manual inicialmente |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `connected-account.workspace-entity.ts` | `ConnectedAccount` | 🟢 |
| `connected-account-refresh-tokens.service.ts` | `ConnectedAccountRefreshTokensService` | 🟢 |
| `google-api-refresh-tokens.service.ts` | Driver específico do Google | 🟢 |
| `useTriggerApiOAuth.ts` | Hook de inicialização de OAuth no frontend | 🟢 |
