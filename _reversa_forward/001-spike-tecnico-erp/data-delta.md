# Delta de Dados: Spike Técnico ERP

Este documento lista as modificações no modelo de dados relacionadas à introdução do pacote ERP.

## 1. Entidades Novas

### `PedidoWorkspaceEntity`
Nova entidade padrão de workspace, baseada em `BaseWorkspaceEntity`.

- **Campos nativos herdados:**
  - `id` (UUID)
  - `createdAt` (DateTime)
  - `updatedAt` (DateTime)
  - `deletedAt` (DateTime) - Soft Delete
  - `searchVector` (tsvector) - Busca Full Text

- **Novos campos (Negócio ERP):**
  - `codigo` (String, obrigatório, gerado sequencial)
  - `status` (Enum: RASCUNHO, APROVADO, FATURADO, CANCELADO)
  - `valorTotal` (Decimal)
  - `dataEmissao` (DateTime)

- **Relacionamentos:**
  - `companyId` -> Vínculo com a empresa/cliente compradora (Many-to-One com `CompanyWorkspaceEntity`).
  - `opportunityId` -> Vínculo (opcional) com a Oportunidade que gerou o Pedido (Many-to-One com `OpportunityWorkspaceEntity`).

## 2. Entidades Modificadas

*Não há modificações estruturais em tabelas nativas do CRM nesta fase.*

## 3. Estruturas Internas e Metadados

- Criação dos metadados de standard object para o `Pedido` no banco de dados para garantir que a interface do Twenty (UI/API) o reconheça dinamicamente.
