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

## Architecture Viewer

Na raiz de `nattivus/` há um visualizador interativo da arquitetura do sistema:

| Arquivo | Papel |
|---|---|
| `nattivus/index.html` | Interface navegável com sidebar, steps numerados e highlighting |
| `nattivus/nattivus-arch.json` | Snapshot da arquitetura — fonte de dados do viewer |

### Como abrir

```bash
# A partir da raiz do monorepo
cd nattivus && npx serve .
# Acesse http://localhost:3000
```

O HTML faz polling do JSON a cada 30 segundos — edite `nattivus-arch.json` e o browser reflete automaticamente.

### O que está documentado

- **Boot Sequence** — 12 steps numerados de 1 (validação de env) até N (sistema pronto), com layer badge por camada
- **Estado & Cache** — JWT in-memory, Redis, Postgres, module_registry, vector index registry
- **Fluxo de Dados** — 3 flows completos: REST genérico, Login com MFA, Module Discovery no boot
- **Inputs & API** — REST, GraphQL, CLI e variáveis de ambiente com valores default
- **Módulos CRM** — Company, Person, Opportunity com deps, permissões e regras de negócio
- **Entidades** — Todos os modelos com campos, tabelas e referências virtuais entre módulos
- **Migrations SQL** — 8 migrations em ordem sequencial
- **Auth System** — 7 componentes + fluxo de login com MFA numerado
- **Busca Semântica** — pgvector vs Qdrant com critério de escolha
- **Eventos & Audit** — Auth events, system events, module lifecycle hooks
- **Feature Ativa** — Estado atual do ciclo Reversa (feature, ADRs, próximos steps)

### Atualizar o JSON

O arquivo `nattivus-arch.json` é gerado manualmente a partir dos JSONs em `.reversa/` e do scan do código.
Para regenerar após mudanças significativas na arquitetura, atualize as seções relevantes do JSON diretamente.

## Troubleshooting

- **Redis error:** O sistema logará um aviso mas continuará funcionando. O cache/rate-limit degradará para memória.
- **Qdrant error:** Se a busca semântica falhar, garanta que o container Qdrant está rodando e a `QDRANT_URL` está correta.
- **`app.workspace_id` ausente:** Todas as chamadas para dados isolados devem possuir o header `X-Workspace-Id`. Caso contrário, o `TenantContextMiddleware` barrará a requisição antes do RLS atuar.
