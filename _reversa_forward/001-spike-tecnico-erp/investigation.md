# Investigation: Spike Técnico ERP

## Pesquisa de Fundo

### 1. Injeção de Pacotes Nx no Monorepo
A plataforma baseia-se em um monorepo gerenciado pelo Nx (`nx: 22.5.4`). Para introduzir o pacote `twenty-erp` de maneira segura:
- O novo pacote deverá ser referenciado no `tsconfig.base.json`.
- A integração com o módulo raiz (`twenty-server`) deve seguir os padrões de provedores (providers/modules) do NestJS. O core precisa carregar o `ErpModule` da mesma forma que carrega integrações externas como o Zapier (`twenty-zapier`).

### 2. Standard Objects e Workspace Entities
A arquitetura do Twenty mapeia objetos de negócio através de decorators e metadados. A criação de `PedidoWorkspaceEntity` exige herança de `BaseWorkspaceEntity`.
- **Benefícios herdados:**
  - `searchVector` para buscas full-text PostgreSQL.
  - Campos de auditoria `createdAt`, `updatedAt`, `deletedAt` (Soft Delete).
  - Geração automática de endpoints REST/GraphQL.
  - Vínculos em potencial com o módulo de **Timeline**, permitindo que interações no Pedido (ex: notas, anexos) reflitam no contexto de uma "Empresa" ou "Contato".

### 3. Integração Workflow / Action Customizada
O GAP-M02 foi respondido com a abordagem de criar uma "Action Customizada ERP". O `WorkflowExecutorService` do Twenty orquestra passos (Steps).
- Devemos registrar um novo tipo de Step ou Action no dicionário de workflows que delegue a execução para o pacote `twenty-erp`.
- A serialização do contexto precisa garantir que dados completos (ex: informações financeiras de uma Oportunidade) sejam expostos e passados de maneira estrita ao worker da Action.

### 4. Integração Fiscal Focus NF-e
Sendo a escolha para emissões na V1, o Focus NF-e oferece uma API REST.
- **Autorização:** Via Token.
- **Ambiente:** Teste (Homologação) e Produção.
- **Integração:** Será disparada primariamente pela conclusão de fluxos (ex: Status de Pedido alterado para 'Faturado') consumindo dados gerados a partir do objeto padrão `Pedido`.
