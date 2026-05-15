# @nattivus/sdk

O **Nattivus SDK** é a biblioteca pública utilizada para construir extensões (módulos) no ecossistema NattivusECO.

## Instalação

```bash
npm install @nattivus/sdk
# ou
yarn add @nattivus/sdk
```

## Como Criar um Módulo

Qualquer módulo NattivusECO deve exportar um arquivo `module.manifest.ts` na sua raiz (que compila para `module.manifest.js`).

### Exemplo Básico

```typescript
import { createManifest } from '@nattivus/sdk';

export const manifest = createManifest({
  moduleId: 'meu.modulo.fantastico',
  version: '1.0.0',
  sdkVersion: '>=0.0.1', // Range semver exigido do Shell
  displayName: 'Meu Módulo Fantástico',
  description: 'Adiciona funcionalidades incríveis ao Nattivus.',
  
  // Entidades que terão tabelas gerenciadas pelo módulo
  entities: [
    {
      name: 'MinhaEntidade',
      tableName: 'minha_entidade'
    }
  ],

  // Rotas da API
  routes: [
    {
      method: 'GET',
      path: '/api/fantastico',
      handler: 'MeuController.metodo',
      description: 'Endpoint de teste'
    }
  ],

  // Permissões granuladas que podem ser atribuídas a roles
  permissions: [
    {
      flag: 'fantastico:read',
      description: 'Permite leitura'
    }
  ],

  // Hooks do Ciclo de Vida
  async onActivate({ workspaceId }) {
    // Ex: Rodar migrações, popular dados base
    console.log(`Módulo ativado no workspace ${workspaceId}`);
  },

  async onDeactivate({ workspaceId }) {
    // Limpeza de recursos (atenção: não drop tabelas por default)
  }
});
```

## Política SemVer

O `@nattivus/sdk` segue a versão Semântica Estrita (Semantic Versioning).
Mudanças em `minor` ou `patch` são retrocompatíveis. Mudanças na versão `major` significam quebra de contrato e exigem atualização no `sdkVersion` do seu manifesto.
