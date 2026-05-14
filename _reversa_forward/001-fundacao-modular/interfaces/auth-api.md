# Interface: Auth API

> Tipo: HTTP/REST (JSON)
> Base path: `/auth`
> Confidência: 🟢 (decisões D-07, D-08 consolidadas no clarify)

## Endpoints

### POST `/auth/login`

Inicia login com credenciais. **Não emite tokens definitivos** — quem tem TOTP precisa completar segundo fator.

**Request:**
```json
{ "email": "user@example.com", "password": "<plaintext>" }
```

**Response 200 — TOTP já configurado:**
```json
{
  "intermediate_token": "<jwt-curto-com-claim-pending-mfa>",
  "mfa_required": true,
  "enrollment_required": false
}
```

**Response 200 — primeiro login, exige enrollment:**
```json
{
  "intermediate_token": "<jwt>",
  "mfa_required": true,
  "enrollment_required": true,
  "secret_uri": "otpauth://totp/NattivusECO:user@example.com?secret=...&issuer=NattivusECO",
  "qr_code_data_url": "data:image/png;base64,..."
}
```

**Erros:**
| HTTP | Código | Quando |
|------|--------|--------|
| 401 | `INVALID_CREDENTIALS` | Email ou senha errados |
| 423 | `ACCOUNT_LOCKED` | `locked_until > now()` (5 tentativas falhas) |
| 403 | `ACCOUNT_DISABLED` | `user.status = 'disabled'` |

**Idempotência:** segura para retry (não tem efeito além de incrementar `failed_login_count`).
**Rate limit:** 10/minuto por IP, 5/minuto por email.

---

### POST `/auth/totp/verify`

Conclui o login submetendo o TOTP (após login ou enrollment).

**Request:**
```json
{ "intermediate_token": "<jwt-do-step-anterior>", "totp": "123456" }
```

**Response 200 — login subsequente:**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<opaco-base64>",
  "expires_in": 900
}
```

**Response 200 — primeiro enrollment:**
```json
{
  "access_token": "<jwt>",
  "refresh_token": "<opaco>",
  "expires_in": 900,
  "backup_codes": ["abcd-efgh", "..."]
}
```

**Erros:**
| HTTP | Código | Quando |
|------|--------|--------|
| 401 | `INVALID_TOTP` | TOTP errado (incrementa contador) |
| 401 | `INTERMEDIATE_EXPIRED` | `intermediate_token` expirou (>5min) |
| 429 | `TOO_MANY_ATTEMPTS` | 3 TOTPs errados consecutivos → cooldown 60s |

**Idempotência:** TOTP válido pode ser submetido só uma vez (claim no intermediate token).

---

### POST `/auth/totp/backup-code`

Login via backup code (perda de dispositivo).

**Request:** `{ "intermediate_token": "...", "backup_code": "abcd-efgh" }`

**Response 200:** mesmo shape de `/auth/totp/verify`. O backup code consumido é marcado em `backup_code.consumed_at`.

**Erro 401 `INVALID_BACKUP_CODE`** se já consumido ou inexistente.

---

### POST `/auth/refresh`

Troca refresh token por novo par.

**Request:** `{ "refresh_token": "<opaco>" }`

**Response 200:**
```json
{ "access_token": "<jwt>", "refresh_token": "<novo-opaco>", "expires_in": 900 }
```

**Comportamento crítico (rotação):** o refresh token usado é **revogado imediatamente** após emissão do novo par. Reuso do antigo retorna 401 + revoga toda a família de tokens daquele usuário (sinal de roubo).

**Erros:**
| HTTP | Código | Quando |
|------|--------|--------|
| 401 | `INVALID_REFRESH` | Token não existe, expirado ou revogado |
| 401 | `REFRESH_REUSE_DETECTED` | Reuso → todas sessões do user revogadas |

---

### POST `/auth/logout`

**Request:** `{ "refresh_token": "<opaco>" }` (ou access_token em header)
**Response 204** — revoga o refresh token. Access token permanece válido até expirar (curta janela).

---

### POST `/auth/backup-codes/regenerate`

**Auth:** Bearer access_token + TOTP atual no header `X-Mfa-Totp`.
**Response 200:** `{ "backup_codes": ["...", "..."] }` (substitui o conjunto inteiro, marca todos os antigos como consumidos).

---

## Tokens — formatos

| Token | Tipo | Vida útil | Armazenamento server |
|-------|------|-----------|----------------------|
| `intermediate_token` | JWT (alg: EdDSA), claim `purpose=mfa_pending` | 5 min | stateless |
| `access_token` | JWT (alg: EdDSA), claim `kid` para rotação de chave | 15 min | stateless |
| `refresh_token` | Opaco (32 bytes random, base64url) | 30 dias | `refresh_token.token_hash` (SHA-256) |

**JWT claims do access_token:**
```json
{
  "sub": "<user_id>",
  "wsm": ["<workspace_member_id_a>", "..."],
  "iat": 1747200000,
  "exp": 1747200900,
  "kid": "key-2026-05"
}
```

> `wsm` lista os WorkspaceMember IDs ativos. Para selecionar workspace ativo, o cliente envia header `X-Workspace-Id: <uuid>` em cada request — o shell valida que o user tem membership.

## Headers obrigatórios em endpoints protegidos

| Header | Valor | Erro se ausente |
|--------|-------|-----------------|
| `Authorization` | `Bearer <access_token>` | 401 `MISSING_AUTH` |
| `X-Workspace-Id` | uuid de workspace válido para o user | 403 `WORKSPACE_REQUIRED` |
| `X-Request-Id` | uuid (opcional, gerado se ausente) | — |

## Timeouts e SLA

- Login p95 < 300ms (sem incluir TOTP).
- Refresh p95 < 50ms (apenas query indexada + assinatura).
- Health endpoint p95 < 50ms.

## Auditoria

Toda chamada gera linha em `audit_log` com `action ∈ {auth.login, auth.totp.verify, auth.totp.backup, auth.refresh, auth.logout, auth.refresh.reuse_detected}`.
