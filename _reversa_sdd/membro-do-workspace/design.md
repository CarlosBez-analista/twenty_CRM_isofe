# Membro do Workspace, Design Técnico

> Especificação técnica de como o módulo de Membros do Workspace é construído no Twenty CRM.

## Interface

### Entidades (Workspace Entities)

| Entidade | Descrição | Principais Campos |
|----------|-----------|-------------------|
| `WorkspaceMember` | Representação do usuário no workspace | `userId`, `name`, `jobTitle`, `avatarUrl`, `timezone`, `locale`, `dateFormat` |

### Hooks e Serviços Principais

| Símbolo | Função | Observação |
|---------|--------|------------|
| `useLoadCurrentUser` | Carrega os dados do membro logado | Ponto central de inicialização da sessão frontend |
| `WorkspaceMemberPreQueryHook` | Valida permissões antes de persistência | Injetado em operações de create/update/delete |
| `useUpdateWorkspaceMemberSettings`| Realiza mutações no perfil | Gerencia o merge de novas configurações |

## Fluxo de Autenticação e Contexto
1. O usuário se autentica (via módulo `Auth` / `User`).
2. O frontend chama `useLoadCurrentUser` para obter o `WorkspaceMember` correspondente ao workspace ativo. 🟢
3. As preferências (timezone, locale) são carregadas e injetadas em contextos globais (ex: `DatePicker`). 🟢
4. Toda atividade criada (notas, tarefas) usa o `id` do `WorkspaceMember` como autor/dono. 🟢

## Gestão de Preferências
- O sistema armazena preferências granulares (formato de hora, primeiro dia da semana, tema). 🟢
- O utilitário `mergeWorkspaceMemberSettingsIntoCurrent` garante que alterações parciais não sobrescrevam todo o perfil. 🟢
- Hooks específicos como `useUserTimezone` e `useUserDateFormat` abstraem o acesso a esses dados para os componentes de UI. 🟢

## Dependências
- `User`: Entidade global de autenticação. 🟢
- `Workspace`: Entidade pai do contexto. 🟢
- `Role`: Define as permissões de acesso do membro. 🟢
- `Attachment`: Usado para o armazenamento do arquivo de avatar. 🟢

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| Separação entre User e WorkspaceMember | `workspace-member.workspace-entity.ts` | 🟢 |
| Hooks de Pre-Query para segurança granular | `workspace-member-query-hook.module.ts` | 🟢 |
| Listener para limpeza de avatar em deleção | `workspace-member-avatar-file-deletion.listener.ts` | 🟢 |
| Persistência de tema no estado do navegador | `persistedColorSchemeState.ts` | 🟢 |

## Estado Interno
- O frontend mantém o estado do membro atual e suas preferências usando Recoil/Apollo Cache. 🟢
- O esquema de cores (`colorScheme`) é sincronizado entre as preferências do BD e o estado do sistema (`useColorScheme`). 🟢

## Riscos e Lacunas
- 🔴 Lógica de resolução de conflitos quando um usuário pertence a múltiplos workspaces com preferências diferentes.
- 🔴 Detalhes da implementação da lógica de convites (`WorkspaceInvitation`) e expiração de links.
- 🟡 Sincronização em tempo real de alterações de permissões (se requer refresh ou usa SSE/WebSockets).
