# NattivusECO Shell

O **Shell** é o núcleo central do ecossistema NattivusECO. Ele fornece a infraestrutura runtime para execução de módulos, segurança, autenticação e acesso ao banco de dados isolado por *tenant* (Workspace).

## Visão Geral

O Shell atua como o hospedeiro das extensões (módulos). Ele não contém regras de negócio de domínio; seu único propósito é garantir:
- Autenticação e Autorização (JWT, MFA, permissões)
- Isolamento Multi-tenant (RLS automático via Postgres)
- Descoberta e Ativação de Módulos (Lifecycle)
- Registro de Auditoria e Busca Semântica

## Comandos Principais

A partir da raiz do monorepo (`nattivus/`):

- **Iniciar em modo de desenvolvimento:**
  ```bash
  yarn nx run nattivus-shell:start:dev
  ```

- **Resetar Banco de Dados (Destrutivo):**
  Aplica o schema do zero. Usado em dev.
  ```bash
  yarn nx run nattivus-shell:db:reset
  ```

- **Rodar Migrações:**
  ```bash
  yarn nx run nattivus-shell:db:migrate
  ```

- **Criar primeiro Administrador:**
  ```bash
  yarn nx run nattivus-shell:seed:admin --email admin@example.com --password "senha123" --workspace-name "Minha Empresa" --workspace-slug "empresa"
  ```

- **Desbloquear Usuário (após tentativas falhas):**
  ```bash
  yarn nx run nattivus-shell:unlock:user --email admin@example.com
  ```

## Troubleshooting

- **Redis error:** O sistema logará um aviso mas continuará funcionando. O cache/rate-limit degradará para memória.
- **Qdrant error:** Se a busca semântica falhar, garanta que o container Qdrant está rodando e a `QDRANT_URL` está correta.
- **`app.workspace_id` ausente:** Todas as chamadas para dados isolados devem possuir o header `X-Workspace-Id`. Caso contrário, o `TenantContextMiddleware` barrará a requisição antes do RLS atuar.
