# Membro do Workspace, Tarefas de Implementação

> Lista de tarefas para reconstrução do módulo de Membros do Workspace com base nas evidências do sistema legado.

## Pré-requisitos
- [ ] Entidades globais `User` e `Workspace` implementadas.
- [ ] Infraestrutura de Hooks de banco de dados configurada.
- [ ] Serviço de upload de arquivos (para avatars) disponível.

## Tarefas

- [ ] T-01, Implementar Entidade WorkspaceMember
  - Origem no legado: `packages/twenty-server/src/modules/workspace-member/standard-objects/workspace-member.workspace-entity.ts`
  - Critério de pronto: Tabela criada com suporte a dados de perfil e campos de preferência (timezone, locale).
  - Confiança: 🟢

- [ ] T-02, Configurar Hooks de Ciclo de Vida e Segurança
  - Origem no legado: `packages/twenty-server/src/modules/workspace-member/query-hooks/`
  - Critério de pronto: Operações de criação, edição e deleção de membros passam pelas validações de pré-query.
  - Confiança: 🟢

- [ ] T-03, Implementar Listener de Limpeza de Avatar
  - Origem no legado: `packages/twenty-server/src/modules/workspace-member/listeners/workspace-member-avatar-file-deletion.listener.ts`
  - Critério de pronto: Ao excluir um membro, o arquivo físico do avatar associado é removido do storage.
  - Confiança: 🟢

- [ ] T-04, Implementar Hook de Carregamento de Usuário Atual (Frontend)
  - Origem no legado: `packages/twenty-front/src/modules/users/hooks/useLoadCurrentUser.ts`
  - Critério de pronto: O frontend recupera os dados do `WorkspaceMember` correto ao iniciar a sessão.
  - Confiança: 🟢

- [ ] T-05, Implementar Gestão de Preferências e Localização
  - Origem no legado: `packages/twenty-front/src/modules/ui/input/components/internal/date/hooks/`
  - Critério de pronto: Componentes de data e hora respeitam o fuso horário e formato definidos no perfil do membro.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Validar que um `User` pode ser vinculado a dois `WorkspaceMembers` em workspaces distintos sem conflito de preferências.
- [ ] TT-02, Testar a aplicação de tema (dark/light) baseada na preferência salva no perfil.
- [ ] TT-03, Verificar se a deleção lógica (soft-delete) de um membro impede seu acesso imediato ao workspace.

## Ordem Sugerida
1. **Modelagem (T-01)**: Estrutura fundamental de identidade no workspace.
2. **Backend Logic (T-02, T-03)**: Garantir segurança e integridade de dados.
3. **Frontend Context (T-04, T-05)**: Disponibilizar os dados do membro para toda a aplicação.

## Lacunas Pendentes (🔴)
- Definir o fluxo de "Onboarding" para novos membros (passos obrigatórios após aceitar convite).
- Especificar a política de expiração de convites pendentes.
