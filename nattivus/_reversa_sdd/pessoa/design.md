# Design: Pessoa (Person)

> Identificador: `002-pessoa`
> Data: 2026-05-11
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Arquitetura de Dados

### 1.1. Entidade Principal: `Person`

Baseada em `PersonWorkspaceEntity`.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `name` | `FullNameMetadata` | Nome estruturado (first, last). | 🟢 |
| `emails` | `EmailsMetadata` | Coleção de endereços de e-mail. | 🟢 |
| `phones` | `PhonesMetadata` | Coleção de números de telefone. | 🟢 |
| `jobTitle` | `string` | Cargo ou função na empresa. | 🟢 |
| `linkedinLink` | `LinksMetadata` | Link para o perfil profissional. | 🟢 |
| `avatarFile` | `FileOutput[]` | Arquivo de imagem do avatar. | 🟢 |
| `companyId` | `uuid` | FK para a empresa vinculada. | 🟢 |
| `position` | `number` | Ordem de exibição na lista. | 🟢 |
| `searchVector` | `tsvector` | Vetor para busca full-text. | 🟢 |

### 1.2. Relacionamentos

- **N:1** com `Company` (Empresa).
- **1:N** com `Opportunity` (Oportunidade) onde é o ponto de contato.
- **1:N** com `TaskTarget` (Alvos de Tarefas).
- **1:N** com `NoteTarget` (Alvos de Notas).
- **1:N** com `Attachment` (Anexos vinculados).
- **1:N** com `MessageParticipant` (Participação em mensagens/e-mails).

## 2. Fluxos de Lógica (Services)

### 2.1. Criação de Pessoa (`createPeople`)

Localizado em `CreatePersonService`.

1. **Contexto de Workspace:** Garante que a operação ocorra no contexto do ID do workspace fornecido.
2. **Posicionamento:** 
   - Busca a posição máxima atual (`getLastPersonPosition`).
   - Atribui `maxPosition + index` para cada nova pessoa na lista.
3. **Persistência:** Insere no repositório ignorando verificações de permissão em nível de sistema (quando chamado via gerenciador de criação).

### 2.2. Restauração (`restorePeople`)

1. **Atualização em Massa:** Recebe lista de IDs de pessoas e opcionalmente novos IDs de empresa.
2. **Limpeza de Soft-Delete:** Define `deletedAt = null` para os registros.
3. **Vínculo Opcional:** Atualiza o `companyId` se fornecido durante a restauração.

## 3. Interfaces de Front-end

### 3.1. Tipagem TypeScript

Baseada em `Person.ts` (packages/twenty-front).

- Define a interface para consumo via GraphQL.
- Mapeia campos complexos como `emails` e `phones` para componentes de UI específicos.
- Suporta renderização de Avatares a partir do `avatarFile`.

## 4. Estratégia de Busca

- **Campos Indexados:** Nome, E-mails, Telefones e Cargo.
- **Implementação:** Utiliza o utilitário `SEARCH_FIELDS_FOR_PERSON` para gerar a expressão do `searchVector` no banco de dados.

## 5. Lacunas de Design

- 🟢 **[RESOLVIDA] Storage de Avatares:** Por padrão usa storage local. Provídores configuráveis via `.env`: Cloudinary, Backblaze, Bun.ai, Google Cloud, S3. ✅ Respondida em 2026-05-11.
- 🟢 **[RESOLVIDA] Normalização de Telefone:** Implementar máscara dinâmica no padrão brasileiro `(DD) 99999-9999`, aplicando formatação em tempo real. Não usa E.164 — usa máscara visual BR. ✅ Respondida em 2026-05-11.
