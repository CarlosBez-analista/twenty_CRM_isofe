# Módulo Hello World (`nattivus.hello-world`)

Este é um módulo de demonstração (template) para o ecossistema NattivusECO.
Ele ilustra todas as peças necessárias para que um pacote externo seja reconhecido, instalado e ativado pelo **Nattivus Shell**.

## O que este módulo demonstra?

1. **Manifesto (`src/module.manifest.ts`)**
   Uso do `createManifest` importado do `@nattivus/sdk` para expor metadados, permissões e rotas.

2. **Entidade de Domínio (`src/hello-message.entity.ts`)**
   Criação de uma entidade estendendo `BaseEntity` do pacote `@nattivus/shared`, garantindo atributos obrigatórios (id, created_at, updated_at, deleted_at, workspace_id).

3. **Migrações Isoladas (`migrations/001-create-hello-message.sql`)**
   Exemplo de um script SQL para criar a tabela com Row-Level Security (RLS) habilitado. O `onActivate` garante a execução apenas no escopo do Workspace que ativar o módulo.

4. **Lifecycle Hooks**
   O `module.manifest.ts` possui `onActivate` e `onDeactivate` que rodam quando o Administrador ativa a extensão para seu tenant.

## Como Desenvolver seu Próprio Módulo

1. Copie esta pasta como base:
   ```bash
   cp -r packages/modules/hello-world packages/modules/seu-modulo
   ```
2. Altere o `project.json` e o `package.json` definindo seu novo nome.
3. Modifique o `moduleId` no manifesto para garantir unicidade (ex: `sua-empresa.seu-modulo`).
4. Rode a build:
   ```bash
   yarn nx build seu-modulo
   ```
5. O `ModuleDiscoveryService` do Shell irá automaticamente buscar e registrar qualquer `.manifest.js` dentro da pasta `packages/modules/*/dist/`.
