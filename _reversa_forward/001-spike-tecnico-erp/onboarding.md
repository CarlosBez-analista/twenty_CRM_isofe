# Onboarding Técnico: Spike Técnico ERP

Siga este guia prático para testar o funcionamento básico do Spike Técnico após a implementação.

## Pré-requisitos
- Ter o ambiente Nx configurado localmente (Docker, Node, Yarn).
- O backend rodando sem erros.

## Passos para validação:

### 1. Inicializar a Aplicação
Inicie a aplicação utilizando o comando padrão do monorepo Nx.
```bash
yarn start
```
Verifique no log do console se o módulo `ErpModule` foi carregado corretamente sem impactar o tempo de boot de forma alarmante.

### 2. Validação da API GraphQL
Acesse a URL do playground GraphQL do Twenty (geralmente `http://localhost:3000/graphql`).
Execute a seguinte mutation para testar a criação de um Pedido:

```graphql
mutation CreatePedido {
  createOnePedido(data: {
    codigo: "PED-0001",
    status: "RASCUNHO",
    valorTotal: 1500.00,
    companyId: "<substituir-por-um-id-valido-de-company>"
  }) {
    id
    codigo
    status
    createdAt
  }
}
```
Verifique se a entidade foi inserida e se um ID foi retornado.

### 3. Validação de Deleção (Soft-Delete)
Execute a mutation de exclusão para o ID retornado acima:
```graphql
mutation DeletePedido {
  deleteOnePedido(where: { id: "<id-do-pedido>" }) {
    id
    deletedAt
  }
}
```
Verifique se o campo `deletedAt` foi preenchido corretamente, comprovando a herança de `BaseWorkspaceEntity`.

### 4. Gatilho de Integração Fiscal (Apenas Logs neste Spike)
- Alterar o status do Pedido criado de "RASCUNHO" para "FATURADO" pela API.
- Observar os logs do servidor.
- Uma "Action Customizada ERP" anexada a um Workflow deve interceptar a mudança de status e imprimir no log o payload de envio para o Focus NF-e.
