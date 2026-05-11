# Membro do Workspace

> Requisitos funcionais e de negócio para o módulo de Membros do Workspace. Foca no QUE a unidade faz.

## Visão Geral
O módulo de Membro do Workspace define a identidade e as permissões de um usuário dentro de uma instância específica (Workspace) do Twenty CRM. Ele gerencia as informações de perfil, preferências individuais e o vínculo entre a conta global do usuário e os dados da organização.

## Responsabilidades
- Gerenciar o perfil do membro (nome, cargo, avatar). 🟢
- Armazenar e aplicar preferências de usuário (fuso horário, formato de data, tema). 🟢
- Controlar o ciclo de vida do membro no workspace (convite, ativação, desativação). 🟢
- Atribuir e gerenciar papéis (roles) e permissões. 🟢

## Regras de Negócio
- Um `User` pode ser membro de múltiplos `Workspaces`. 🟢
- O `WorkspaceMember` é a entidade que possui os dados dentro do contexto do CRM (ex: dono de uma conta, autor de uma nota). 🟢
- Preferências de fuso horário e idioma devem ser respeitadas em toda a interface. 🟢
- A exclusão de um membro deve ser lógica (soft-delete) e disparar a limpeza de recursos vinculados (como arquivos de avatar). 🟢
- Convites para novos membros são gerenciados via `WorkspaceInvitation`. 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Gestão de Perfil | Must | Usuário consegue atualizar nome, cargo e foto de perfil. |
| RF-02 | Preferências de Localização | Must | Alterar o fuso horário no perfil atualiza a exibição de datas em todo o sistema. |
| RF-03 | Convite de Membros | Must | Administradores conseguem convidar novos usuários via e-mail. |
| RF-04 | Atribuição de Papéis | Must | É possível definir se um membro é Admin ou Usuário Padrão, afetando seu acesso às configurações. |
| RF-05 | Seleção de Tema | Should | Usuário consegue alternar entre tema claro, escuro ou seguir o sistema. |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Segurança | Validação pré-query para criação/edição | `workspace-member-create-one.pre-query.hook.ts` | 🟢 |
| Integridade | Remoção de arquivos físicos (avatar) em delete | `workspace-member-avatar-file-deletion.listener.ts` | 🟢 |
| Performance | Carregamento otimizado do membro atual | `useLoadCurrentUser.ts` | 🟢 |

## Critérios de Aceitação

```gherkin
Dado que um usuário logado acessa suas configurações de perfil
Quando ele altera seu cargo para "Diretor Comercial" e salva
Então o novo cargo deve ser exibido em todos os registros onde ele é o "Dono" 🟢

Dado um novo usuário convidado para o Workspace
Quando ele aceita o convite e define sua senha
Então um registro de WorkspaceMember deve ser criado vinculado ao seu User ID 🟢

Dado que um administrador remove um membro do Workspace
Quando a operação é processada
Então o acesso do membro deve ser revogado e seu avatar removido do storage 🟢
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Vínculo User-Workspace | Must | Essencial para multi-tenancy |
| Perfil Básico (Nome/Cargo) | Must | Necessário para atribuição de autoria |
| Gestão de Roles | Must | Crítico para segurança e governança |
| Preferências (TZ/Tema) | Should | Importante para UX mas não impede operação |
| Avatar / Foto | Could | Funcionalidade estética |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `workspace-member.workspace-entity.ts` | `WorkspaceMember` | 🟢 |
| `useLoadCurrentUser.ts` | `useLoadCurrentUser` hook | 🟢 |
| `WorkspaceMemberPictureUploader.tsx` | Componente de upload de avatar | 🟢 |
| `useUpdateWorkspaceMemberSettings.ts` | Hook de atualização de perfil | 🟢 |
