# Membro do Workspace, Casos de Borda (Edge Cases)

> Documentação de comportamentos extremos e exceções identificados no módulo de Membros do Workspace.

## 1. Conflito de Fuso Horário entre Membros
- **Cenário:** O Membro A (Londres, UTC+0) e o Membro B (São Paulo, UTC-3) visualizam o mesmo registro criado "Hoje".
- **Comportamento Esperado:** O sistema deve armazenar datas em UTC no banco e aplicar o offset do Membro logado no frontend via `useUserTimezone`. Evidência em `packages/twenty-front/src/modules/ui/input/components/internal/date/hooks/useUserTimezone.ts`. 🟢

## 2. Deleção do Último Administrador
- **Cenário:** O administrador tenta excluir seu próprio registro ou o último administrador ativo do workspace.
- **Comportamento Esperado:** O sistema deve possuir uma validação (provavelmente no `pre-query.hook`) que impeça que um workspace fique sem administradores ativos. 🔴 (Requer confirmação da lógica de validação de contagem de admins).

## 3. Upload de Avatar Corrompido ou Excesso de Tamanho
- **Cenário:** O usuário tenta fazer upload de um arquivo de 50MB como foto de perfil.
- **Comportamento Esperado:** O `WorkspaceMemberPictureUploader.tsx` deve validar o tamanho no cliente, e o servidor deve possuir limites de payload para evitar ataques de negação de serviço. 🟡

## 4. Mudança de E-mail do User
- **Cenário:** O e-mail do `User` global é alterado, mas o e-mail de exibição no `WorkspaceMember` é estático.
- **Comportamento Esperado:** O sistema deve decidir se sincroniza o e-mail automaticamente ou se mantém o e-mail do `WorkspaceMember` como um campo independente para comunicações do workspace. 🔴 (Lógica de sincronização User-Member pendente de validação).
