# Nota

> Requisitos funcionais e de negócio para o módulo de Notas. Foca no QUE a unidade faz.

## Visão Geral
O módulo de Notas permite que usuários registrem informações textuais ricas vinculadas a diversas entidades do CRM (Empresas, Pessoas, Oportunidades). Ele atua como um repositório centralizado de conhecimento e histórico de interações manuais.

## Responsabilidades
- Criar, visualizar, editar e excluir notas. 🟢
- Vincular uma única nota a múltiplos registros do CRM (polimorfismo). 🟢
- Suportar formatação de texto rico (Rich Text). 🟢
- Permitir a recuperação de notas excluídas (Soft-delete/Restore). 🟢

## Regras de Negócio
- Uma nota pode ter um título opcional e um conteúdo obrigatório. 🟢
- O vínculo entre uma nota e um objeto do CRM é gerenciado via `NoteTarget`. 🟢
- Quando uma nota é excluída, os vínculos correspondentes em `NoteTarget` também devem ser tratados. 🟢
- A exclusão é lógica (soft-delete), permitindo restauração via interface ou API. 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Criação de nota rica | Must | Usuário consegue salvar texto com formatação (negrito, listas). |
| RF-02 | Vinculação múltipla | Must | Uma nota sobre uma reunião aparece tanto na página da Empresa quanto na página da Pessoa participante. |
| RF-03 | Exclusão lógica | Should | Notas excluídas não aparecem na listagem principal, mas podem ser restauradas. |
| RF-04 | Listagem por entidade | Must | Ao abrir uma Oportunidade, o sistema carrega apenas as notas vinculadas a ela. |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Segurança | Controle de acesso via query hooks | `note-post-query-hook.service.ts` | 🟢 |
| Integridade | Limpeza de vínculos em exclusão | `note-delete-many.post-query.hook.ts` | 🟢 |
| UX | Feedback instantâneo na listagem | `NoteList.tsx` | 🟢 |

## Critérios de Aceitação

```gherkin
Dado que um usuário está na página de uma Empresa
Quando ele clica em "Adicionar Nota" e salva um texto
Então a nota deve aparecer na seção de Notas daquela Empresa 🟢

Dado uma nota vinculada a uma Empresa e a uma Pessoa
Quando o usuário exclui a nota na página da Empresa
Então a nota também deve desaparecer da página da Pessoa 🟢

Dado uma nota excluída recentemente
Quando o administrador solicita a restauração da nota
Então a nota e seus vínculos originais devem ser reativados 🟢
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Persistência de notas | Must | Funcionalidade básica de registro |
| Vinculação (NoteTarget) | Must | Essencial para o contexto do CRM |
| Formatação Rich Text | Should | Importante para legibilidade mas secundário à persistência |
| Soft-delete / Restore | Should | Melhora a segurança contra erros do usuário |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `note.workspace-entity.ts` | `Note` | 🟢 |
| `note-target.workspace-entity.ts` | `NoteTarget` | 🟢 |
| `note-post-query-hook.service.ts` | `NotePostQueryHookService` | 🟢 |
| `useNotes.ts` | `useNotes` hook | 🟢 |
