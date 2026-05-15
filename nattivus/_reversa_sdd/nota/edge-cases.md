# Nota, Casos de Borda (Edge Cases)

> Documentação de comportamentos extremos e exceções identificados no módulo de Notas.

## 1. Órfãos de NoteTarget
- **Cenário:** Um registro pai (ex: uma Empresa) é excluído permanentemente (hard-delete), mas existem `NoteTargets` apontando para ele.
- **Comportamento Esperado:** O sistema deve realizar uma limpeza (cleanup) ou deixar a nota disponível apenas nos outros alvos. Se a nota ficar sem nenhum `NoteTarget`, ela deve ser marcada para deleção ou arquivada. 🟡

## 2. Concorrência na Edição
- **Cenário:** Dois usuários abrem a mesma nota para edição simultânea.
- **Comportamento Esperado:** O sistema legado parece não implementar "optimistic locking" complexo em nível de campo, o que pode resultar na sobrescrita do conteúdo pelo último que salvar. 🔴 (Requer validação se existe algum mecanismo de WebSocket para edição colaborativa).

## 3. Conteúdo Massivo / Injeção de Código
- **Cenário:** Usuário cola um texto extremamente longo ou scripts maliciosos no editor de Rich Text.
- **Comportamento Esperado:** O backend deve sanitizar o HTML recebido no campo `content` e o frontend deve usar sanitização ao renderizar para evitar XSS. 🟢 (Implícito nos padrões de segurança do NestJS/React observados).

## 4. Notas em Registros Restaurados
- **Cenário:** Uma Empresa é excluída (soft-delete) e depois restaurada.
- **Comportamento Esperado:** Todas as notas e vínculos em `NoteTarget` devem permanecer intactos, já que a exclusão foi apenas lógica no pai. 🟢
