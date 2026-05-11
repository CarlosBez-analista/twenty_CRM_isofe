# Matriz de Permissões (RBAC / ACL)

Visão geral dos perfis de acesso, deduzida do histórico do Git e da estrutura de objetos (ex: "batch role resolution com DataLoader", "WorkspaceMember", comandos de permissão de Workspace).

## Papéis (Roles) no Workspace

| Papel | Descrição | Confiança |
|-------|-----------|-----------|
| **Admin / Owner** | Possui acesso completo ao Workspace. Pode conectar canais globais, gerenciar faturamento, criar integrações e alterar configurações do sistema. | 🟡 INFERIDO |
| **Standard User / Member** | Acesso às operações comuns do CRM. Pode visualizar oportunidades, clientes e tarefas, mas sua visão pode ser filtrada por restrições de propriedade. | 🟡 INFERIDO |
| **Guest / Restricted** | (Se existir) Apenas leitura ou acesso limitado a registros específicos onde foram marcados como observadores. | 🔴 LACUNA |

## Matriz de Permissões por Entidade (Estimativa)

| Objeto | Membro Comum | Administrador | Regra Específica de Contexto |
|--------|--------------|---------------|------------------------------|
| **Company** | Leitura global, Escrita parcial | Full Access | Edição restrita se `accountOwner` for ativado no modo de privacidade. |
| **Opportunity** | Ler, Criar, Atualizar | Full Access | Acesso pode ser bloqueado se a flag de privacidade de negócios estiver ativa e o usuário não for o `ownerId`. |
| **Task** | Gerenciar próprias | Full Access | O `assigneeId` tem sempre acesso de escrita. |
| **Workflow** | Apenas Leitura | Criar, Editar, Deploy | Apenas Admins devem poder alterar gatilhos e integrações sistêmicas para evitar abuso e limite de créditos do metered billing. |
| **Dashboard** | Gerenciar próprios | Full Access | Membros organizam seus PageLayouts, Admins gerenciam globais. |
| **Billing / Config** | Sem acesso | Full Access | Pagamentos, migrações e chaves da API de integração. |

### Regras Implícitas de Visibilidade
1. **Atribuição (`Owner / Assignee`)**: Entidades com campos como `ownerId`, `assigneeId` ou `accountOwner` (presentes em Opportunity, Task e Company) tendem a definir a restrição de acesso na camada de banco de dados (Row Level Security ou filtros na API via interceptors/guards no NestJS).
2. **Resolução de Roles em Lote**: A aplicação utiliza `DataLoader` para carregar papéis do usuário (`role resolution`) evitando o problema de N+1 queries no GraphQL, garantindo que as diretivas de proteção na API analisem os privilégios corretamente.

> **Nota:** É necessário consultar o esquema GraphQL real no `twenty-server` (directives de `@auth` ou decorators no NestJS `@Roles()`, `@Permissions()`) para validar esta matriz com 100% de precisão.
