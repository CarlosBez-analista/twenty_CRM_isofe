# Empresa (Company), Design Técnico

> Foca no COMO o módulo Empresa é construído e orquestrado dentro da plataforma CRM, com base na arquitetura padronizada de objetos.

## Interface
O módulo Empresa opera como um objeto de negócio padrão na plataforma, sendo exposto primariamente através das interfaces de API genéricas para objetos (GraphQL e REST).

### Campos de Entrada / Modelo de Dados (Schema)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `name` | `string` | Nome da empresa. |
| `domainName` | `string` | Domínio principal para enriquecimento e unicidade (opcional). |
| `accountOwnerId` | `uuid` | Referência ao WorkspaceMember responsável. |
| `idealCustomerProfile` | `boolean` | Flag de ICP. |
| `annualRevenue` | `json` / `currency` | Faturamento anual da empresa. |
| `employees` | `integer` | Número estimado de colaboradores. |
| `intro` | `text` | Descrição ou introdução da empresa. |
| `address` | `json` | Estrutura de endereço composta. |
| `timezone` | `string` | Fuso horário operacional da empresa. |
| `whatsapp`, `x`, `linkedin` | `json` / `string` | Links e contatos sociais. |

### API (GraphQL e Object API)

Como um "Standard Object", o CRUD é gerenciado pela camada central da plataforma.

| Operação | Assinatura Genérica | Retorno | Observação |
|----------|---------------------|---------|------------|
| Query | `companies(filter, sort, limit)` | `CompanyConnection` | Listagem com paginação e suporte a SearchVector. |
| Query | `company(id)` | `Company` | Retorna um registro único. |
| Mutation | `createCompany(data)` | `Company` | Criação com possibilidade de enriquecimento assíncrono. |
| Mutation | `updateCompany(id, data)` | `Company` | Atualização parcial de campos. |
| Mutation | `deleteCompany(id)` | `Company` | Exclusão lógica (soft-delete). |

## Fluxo Principal
1. **Criação de Empresa:** O usuário submete a criação de uma `Company` (ex: via workspace interface).
2. **Validação:** A plataforma valida os dados obrigatórios (`name`).
3. **Persistência:** A inserção ocorre no banco de dados com gravação das timestamps (`createdAt`, `updatedAt`).
4. **Atualização do Vetor de Busca:** O campo `searchVector` é atualizado assincronamente (ou via trigger no PostgreSQL) concatenando nome e domínio para viabilizar busca textual.
5. **Enriquecimento (Opcional):** Se o `domainName` for informado, serviços de enriquecimento externos (como Clearbit) podem atualizar campos estendidos via background job.

## Fluxos Alternativos
- **Exclusão Lógica:** Quando `deleteCompany(id)` é chamado, o sistema preenche a coluna `deletedAt` com o timestamp atual. O registro deixa de aparecer nas buscas normais, mas permanece no banco para auditoria ou lixeira.
- **Associação de Relacionamentos:** Adicionar uma Nota (`Note`) ou Tarefa (`Task`) a uma empresa dispara a criação do respectivo registro filho associado ao UUID da empresa (via `companyId` nos objetos filhos).

## Dependências
- **Object Metadata Engine:** Responsável por instanciar a estrutura do banco e expor a API de `Company` baseada no schema declarado.
- **WorkspaceMember:** Todas as empresas estão atreladas ao contexto do workspace, mas possuem um dono direto (`accountOwnerId`), exigindo a resolução de membros ativos.
- **Enrichment Service:** Módulo acoplável para enriquecer `annualRevenue`, `employees`, etc. com base no domínio.

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| **Persistência via Standard Object** | Uso do padrão genérico de definições de objetos (`metadata`). | 🟡 |
| **Soft Delete** | Presença do campo `deletedAt` e arquitetura base do sistema. | 🟢 |
| **SearchVector** | Existência da coluna `searchVector` mapeada para TSVector no PostgreSQL. | 🟢 |
| **Relacionamentos Dinâmicos** | Campos relacionais padrão para Notas, Tarefas, Anexos, Oportunidades. | 🟢 |

## Estado Interno
O módulo de Empresa não mantém um estado transicional complexo (como uma Opportunity ou Task). O estado reflete exatamente os dados persistidos no banco. As únicas transições implícitas são entre:
- `Ativo` (`deletedAt: null`)
- `Deletado` (`deletedAt: timestamp`)

## Observabilidade
- Logs de mutação gerenciados pelo Audit Logging genérico da plataforma, gravando quem alterou o quê (`updatedAt`, `createdBy`, `updatedBy`).
- Eventos de Webhook disparados no barramento de eventos internos: `company.created`, `company.updated`, `company.deleted`.

## Riscos e Lacunas
- 🟢 **Desduplicação:** O `domainName` deve ser ÚNICO por projeto/empresa (constraint UNIQUE). Um cliente pode ter múltiplos domainNames, mas nunca pode haver dois registros com o mesmo domínio em projetos distintos. ✅ Respondida pelo usuário em 2026-05-11.
- 🟡 **Enriquecimento Síncrono vs Assíncrono:** Assumimos que o enriquecimento de dados pelo `domainName` acontece por background job, mas a confirmação do mecanismo exato requer inspeção de pacotes externos.
