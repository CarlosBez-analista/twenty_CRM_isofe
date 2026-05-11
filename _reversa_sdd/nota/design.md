# Nota, Design Técnico

> Especificação técnica de como o módulo de Notas é construído no Twenty CRM.

## Interface

### Entidades (Workspace Entities)

| Entidade | Descrição | Principais Campos |
|----------|-----------|-------------------|
| `Note` | O corpo da nota | `title`, `content` (Rich Text), `createdBy` |
| `NoteTarget` | Tabela de junção polimórfica | `noteId`, `targetId`, `targetEntityType` |

### Hooks e Serviços

| Símbolo | Assinatura | Retorno | Observação |
|---------|-----------|---------|------------|
| `NotePostQueryHookService` | `apply(query, action)` | `void` | Intercepta operações de query para aplicar lógica de negócio |
| `useNotes` | `(targetId: string)` | `Note[]` | Hook React para buscar e gerenciar notas de uma entidade |

## Fluxo de Vinculação (NoteTarget)
1. Quando uma nota é salva, o frontend envia o conteúdo e os IDs dos objetos relacionados.
2. O backend cria o registro em `Note`. 🟢
3. Para cada objeto relacionado, é criado um registro em `NoteTarget` apontando para o `noteId`. 🟢
4. Esta estrutura permite que uma nota seja compartilhada entre uma Empresa, seus Contatos e Oportunidades vinculadas sem duplicar o conteúdo. 🟢

## Gestão de Ciclo de Vida (Soft-delete)
- O Twenty CRM utiliza exclusão lógica para Notas. 🟢
- Os hooks `note-delete-one.post-query.hook.ts` e `note-delete-many.post-query.hook.ts` garantem que, ao excluir uma nota, a visibilidade dos `NoteTargets` seja afetada ou que lógica de limpeza seja disparada. 🟢
- O processo inverso é realizado pelos hooks de `restore`, reativando a nota no banco de dados. 🟢

## Dependências
- `WorkspaceMember`: Para atribuir a autoria da nota (`createdBy`). 🟢
- `RichTextEditor`: Componente de frontend para edição do campo `content`. 🟡
- `Timeline`: Exibe notas como uma das atividades principais do registro. 🟢

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| Arquitetura de alvos polimórficos | `note-target.workspace-entity.ts` | 🟢 |
| Lógica de negócio via Hooks de Post-Query | `note-query-hook.module.ts` | 🟢 |
| Estado global de variáveis de query | `currentNotesQueryVariablesState.ts` | 🟢 |

## Estado Interno
- O frontend mantém o estado das variáveis de consulta (filtros, paginação) no `currentNotesQueryVariablesState` (usando Recoil ou similar). 🟢

## Riscos e Lacunas
- 🔴 Limite de caracteres para o conteúdo da nota (especialmente para grandes quantidades de HTML/Rich Text).
- 🔴 Lógica de indexação para busca textual dentro do conteúdo das notas.
- 🟡 Comportamento de anexos dentro de notas (se são tratados nesta unit ou via integração com a unit `anexo`).
