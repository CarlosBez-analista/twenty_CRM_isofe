# Conta Conectada, Casos de Borda (Edge Cases)

> Documentação de comportamentos extremos e exceções identificados no módulo de Contas Conectadas.

## 1. Refresh Token Revogado (Out-of-band)
- **Cenário:** O usuário remove o acesso do Twenty CRM diretamente no painel de segurança do Google, sem avisar o CRM.
- **Comportamento Esperado:** Na próxima tentativa de refresh, a API retornará `invalid_grant`. O sistema deve capturar isso via `parse-google-oauth-error.util.ts`, desativar a sincronização e marcar a conta com status de reconexão necessária. 🟢

## 2. Mudança de Senha em Contas IMAP/SMTP
- **Cenário:** O usuário altera a senha no provedor de e-mail genérico.
- **Comportamento Esperado:** A próxima tentativa de conexão falhará com erro de autenticação. O CRM deve detectar a falha e solicitar que o usuário atualize as credenciais no formulário de configuração de conta. 🟡

## 3. Limite de Taxa (Rate Limiting) Agressivo
- **Cenário:** O sistema tenta sincronizar 10.000 e-mails de uma vez em uma conta nova, atingindo o limite da API do provedor.
- **Comportamento Esperado:** O utilitário `is-throttled.ts` deve ser consultado. O sistema deve suspender temporariamente a sincronização daquela conta específica e agendar uma nova tentativa com backoff exponencial. 🟢

## 4. Escopos de OAuth Insuficientes
- **Cenário:** O sistema é atualizado para exigir acesso ao calendário, mas a conta foi conectada anteriormente apenas com acesso a e-mails.
- **Comportamento Esperado:** O sistema deve identificar que o `refreshToken` atual não possui os escopos necessários e disparar um fluxo de "Upgrade de Permissão" ou reconexão no frontend. 🔴 (Lógica de detecção de gap de escopos pendente).
