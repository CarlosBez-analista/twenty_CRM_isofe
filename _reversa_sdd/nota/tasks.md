# Nota, Tarefas de Implementação

> Lista de tarefas para reconstrução do módulo de Notas com base nas evidências do sistema legado.

## Pré-requisitos
- [ ] Entidades base de CRM implementadas (Pessoa, Empresa, Oportunidade).
- [ ] Infraestrutura de Hooks de banco de dados (TypeORM/NestJS) configurada.

## Tarefas

- [ ] T-01, Implementar Entidade Note
  - Origem no legado: `packages/twenty-server/src/modules/note/standard-objects/note.workspace-entity.ts`
  - Critério de pronto: Tabela `notes` criada com suporte a conteúdo Rich Text e autor (`createdBy`).
  - Confiança: 🟢

- [ ] T-02, Implementar Vinculação Polimórfica (NoteTarget)
  - Origem no legado: `packages/twenty-server/src/modules/note/standard-objects/note-target.workspace-entity.ts`
  - Critério de pronto: Tabela de junção criada permitindo associar uma nota a qualquer `targetId` + `targetEntityType`.
  - Confiança: 🟢

- [ ] T-03, Configurar Hooks de Exclusão e Restauração
  - Origem no legado: `packages/twenty-server/src/modules/note/query-hooks/`
  - Critério de pronto: Operações de DELETE e RESTORE em notas propagam o estado corretamente para as listagens.
  - Confiança: 🟢

- [ ] T-04, Implementar Interface de Listagem e Criação
  - Origem no legado: `packages/twenty-front/src/modules/activities/notes/components/`
  - Critério de pronto: Componentes `NotesCard` e `NoteTile` exibindo conteúdo formatado e permitindo edição.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Validar que uma nota criada em um contato aparece corretamente na empresa vinculada (via `NoteTarget`).
- [ ] TT-02, Testar persistência de formatação HTML/Markdown no campo `content`.
- [ ] TT-03, Verificar se a restauração de uma nota recupera todos os seus vínculos originais.

## Ordem Sugerida
1. **Core (T-01, T-02)**: Definir a estrutura de dados e as relações polimórficas.
2. **Business Logic (T-03)**: Implementar as regras de ciclo de vida e segurança.
3. **UI (T-04)**: Construir a experiência do usuário sobre a API estável.

## Lacunas Pendentes (🔴)
- Definir o motor de Rich Text (Ex: Tiptap, Quill) para garantir compatibilidade de esquema entre frontend e backend.
- Decidir se as notas devem suportar versionamento (histórico de edições).
