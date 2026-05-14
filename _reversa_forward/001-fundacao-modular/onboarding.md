# Onboarding: Testar a Fundação NattivusECO pela Primeira Vez

> Passo a passo executável para um humano (desenvolvedor) que vai validar a fundação após o `/reversa-coding` rodar.
> Tempo estimado: 30–45 minutos na primeira vez.

## 0. Pré-requisitos

- Node 20+ e Yarn 4 instalados
- Docker Desktop rodando (para Postgres + Redis + Qdrant)
- Git
- Um app autenticador TOTP no celular (Google Authenticator, Authy, 1Password, Bitwarden)

## 1. Clonar e instalar

```bash
git clone <repo-url> nattivus-eco
cd nattivus-eco
yarn install
```

Critério de sucesso: nenhum erro de resolução. `yarn nx graph` abre e mostra `nattivus-shell`, `nattivus-shared`, `nattivus-ui`, `nattivus-sdk` e `modules/hello-world`.

## 2. Subir dependências de infra

```bash
docker compose -f docker/compose.dev.yml up -d postgres redis qdrant
```

Critério: três containers `healthy` em `docker ps`. Postgres responde em `5432`, Redis em `6379`, Qdrant em `6333`.

## 3. Inicializar o banco

```bash
cp .env.example .env
yarn db:init
yarn db:migrate
```

Critério: `yarn db:migrate` aplica 7 migrações sem erro. Conferir via psql ou DBeaver:
- Tabelas presentes: `user`, `mfa_secret`, `backup_code`, `refresh_token`, `workspace`, `workspace_member`, `module_registry`, `module_activation`, `audit_log`, `vector_index_registry`
- Extensão `pgvector` ativa: `SELECT * FROM pg_extension WHERE extname = 'vector';`
- RLS ativa em `workspace_member`: `SELECT relrowsecurity FROM pg_class WHERE relname = 'workspace_member';` → `t`

## 4. Subir o shell

```bash
yarn build:shared && yarn build:sdk
yarn dev:shell
```

Critério: log estruturado mostra:
- `[shell] starting`
- `[modules] discovered: hello-world v0.0.1`
- `[shell] listening on http://localhost:3000`

Health check:
```bash
curl http://localhost:3000/health
```
Espera-se JSON `{"status":"ok","db":"ok","redis":"ok","qdrant":"ok"}`.

## 5. Criar usuário e workspace (via CLI seed)

```bash
yarn shell:seed-admin --email admin@nattivus.test --password 'TempPass!2026' --workspace 'Workspace Demo'
```

Critério: comando imprime `user_id`, `workspace_id` e a frase `Status: pending (MFA enrollment required at first login)`.

## 6. Primeiro login + enrollment TOTP

```bash
curl -X POST http://localhost:3000/auth/login \
  -H 'Content-Type: application/json' \
  -d '{"email":"admin@nattivus.test","password":"TempPass!2026"}'
```

Resposta esperada: HTTP 200 com `{"intermediate_token":"...","mfa_required":true,"enrollment_required":true,"qr_code_data_url":"data:image/png;base64,..."}`.

1. Decodificar o QR code (ou usar o `otpauth://` retornado em `secret_uri`) no app autenticador.
2. Submeter o primeiro TOTP:

```bash
curl -X POST http://localhost:3000/auth/totp/verify \
  -H 'Content-Type: application/json' \
  -d '{"intermediate_token":"...","totp":"123456"}'
```

Resposta esperada: HTTP 200 com `{"access_token":"<jwt>","refresh_token":"<opaque>","backup_codes":["abcd-efgh-ijkl", ...]}` (10 backup codes).

**⚠️ Anotar os backup codes** — eles só aparecem uma vez.

## 7. Testar endpoint protegido

```bash
curl http://localhost:3000/api/me -H "Authorization: Bearer <access_token>"
```

Resposta esperada: `{"user":{"id":"...","email":"admin@nattivus.test"},"workspaces":[{"id":"...","display_name":"Workspace Demo"}]}`.

## 8. Validar isolamento multi-tenant

```bash
yarn shell:seed-admin --email b@nattivus.test --password 'TempPass!2026' --workspace 'Workspace B'
```

Logar com `b@nattivus.test`, listar entidades do módulo `hello-world` no workspace B. Tentar acessar entidades do workspace A via id direto. **Esperado: HTTP 404** (RLS bloqueia, não retorna nem confirma existência).

## 9. Validar descoberta automática de módulo

1. Copiar `packages/modules/hello-world` para `packages/modules/hello-twin`.
2. Trocar `module.id` no `module.manifest.ts` para `nattivus.demo.twin` e ajustar rotas.
3. Rodar `yarn build:modules`.
4. Reiniciar o shell (`yarn dev:shell`).

Esperado: log mostra `[modules] discovered: hello-world v0.0.1, hello-twin v0.0.1`. Rota nova responde sem editar o shell.

## 10. Validar SDK público

```bash
cd /tmp && mkdir nattivus-sdk-test && cd nattivus-sdk-test
yarn init -y
yarn add @nattivus/sdk
```

Critério: pacote instala. `node -e "console.log(require('@nattivus/sdk'))"` lista exports (`IModule`, `BaseEntity`, `PermissionFlag`, `createManifest`, etc).

## 11. Validar busca semântica (plumbing-only)

```bash
curl -X POST http://localhost:3000/api/semantic/register \
  -H "Authorization: Bearer <access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"collection":"demo.docs","backend":"qdrant","dimensions":1536,"metric":"cosine"}'

curl -X POST http://localhost:3000/api/semantic/upsert \
  -H "Authorization: Bearer <access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"collection":"demo.docs","items":[{"id":"d1","embedding":[0.1,0.2,...],"payload":{"title":"Doc 1"}}]}'

curl -X POST http://localhost:3000/api/semantic/search \
  -H "Authorization: Bearer <access_token>" \
  -H 'Content-Type: application/json' \
  -d '{"collection":"demo.docs","query":[0.1,0.2,...],"topK":5}'
```

Esperado: register cria coleção em Qdrant + registro em `vector_index_registry`. Search retorna o item indexado com score.

## 12. Encerrar

```bash
docker compose -f docker/compose.dev.yml down
```

## Critério geral de sucesso

Todos os cenários Gherkin do `requirements.md` passam manualmente seguindo estes passos. Falha em qualquer um vira ticket de regressão antes de declarar a fundação pronta.

## Troubleshooting

| Sintoma | Causa provável | Ação |
|---------|----------------|------|
| `yarn db:migrate` falha em `CREATE EXTENSION vector` | Postgres sem pgvector | Usar imagem `pgvector/pgvector:pg16` no compose, não `postgres:16` |
| `qdrant` retorna 404 ao registrar coleção | Container Qdrant não subiu | Conferir `docker logs qdrant` — provável conflito de porta |
| TOTP é rejeitado mesmo correto | Clock skew entre dev e celular | Sincronizar relógio do host; TOTP tolera ±30s por padrão |
| Login retorna 401 após `failed_login_count >= 5` | Lockout ativo | Esperar `locked_until` ou resetar via `yarn shell:unlock-user --email <x>` |
