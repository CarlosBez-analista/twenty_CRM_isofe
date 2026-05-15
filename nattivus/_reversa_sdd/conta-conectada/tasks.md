# Conta Conectada, Tarefas de Implementação

> Lista de tarefas para reconstrução do módulo de Contas Conectadas com base nas evidências do sistema legado.

## Pré-requisitos
- [ ] Configuração de App no Google Cloud Console e Microsoft Azure AD.
- [ ] Infraestrutura de Workers para tarefas de background (refresh de tokens).
- [ ] Cofre de segredos (Vault/Env) para Client IDs e Secrets.

## Tarefas

- [ ] T-01, Implementar Entidade ConnectedAccount
  - Origem no legado: `packages/twenty-server/src/modules/connected-account/standard-objects/connected-account.workspace-entity.ts`
  - Critério de pronto: Tabela criada com campos para tokens OAuth e metadados do provedor.
  - Confiança: 🟢

- [ ] T-02, Implementar RefreshTokensManager e Drivers
  - Origem no legado: `packages/twenty-server/src/modules/connected-account/refresh-tokens-manager/`
  - Critério de pronto: Serviço capaz de renovar tokens Google e Microsoft de forma isolada.
  - Confiança: 🟢

- [ ] T-03, Implementar Serviço de Abstração IMAP/SMTP/CalDAV
  - Origem no legado: `packages/twenty-server/src/modules/connected-account/services/imap-smtp-caldav-apis.service.ts`
  - Critério de pronto: Possibilidade de conectar e validar contas via protocolos padrão sem OAuth.
  - Confiança: 🟢

- [ ] T-04, Implementar Tratamento de Erros e Throttling
  - Origem no legado: `packages/twenty-server/src/modules/connected-account/utils/is-throttled.ts`
  - Critério de pronto: Sistema identifica limites de taxa e erros fatais de OAuth, atualizando o status da conta.
  - Confiança: 🟢

- [ ] T-05, Implementar Fluxo de Reautenticação (Frontend)
  - Origem no legado: `packages/twenty-front/src/modules/settings/accounts/hooks/useTriggerProviderReconnect.ts`
  - Critério de pronto: Interface notifica o usuário sobre falhas de token e permite iniciar o fluxo de reconexão.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Simular expiração de token e validar renovação automática pelo Job de background.
- [ ] TT-02, Validar comportamento de reconexão após revogação manual no painel do Google.
- [ ] TT-03, Testar conexão IMAP com servidores customizados (ex: Zoho, iCloud).

## Ordem Sugerida
1. **Infra OAuth (T-01, T-02)**: Base necessária para a maioria das integrações.
2. **Protocolos Legados (T-03)**: Expandir compatibilidade.
3. **Resiliência (T-04)**: Adicionar robustez contra erros de API.
4. **UX de Recuperação (T-05)**: Fechar o ciclo com a interface de usuário.

## Lacunas Pendentes (🔴)
- Definir como lidar com a mudança de escopos exigidos por novas versões do Twenty CRM (re-consentimento).
- Especificar a estratégia de "warm-up" para novas contas sincronizadas para evitar bloqueio por volume.
