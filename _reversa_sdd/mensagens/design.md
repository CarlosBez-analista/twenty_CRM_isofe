# Design: Mensagens (Messaging)

> Identificador: `006-mensagens`
> Data: 2026-05-11
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Arquitetura de Dados

### 1.1. Entidade: `Message`

Unidade individual de comunicação.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `headerMessageId` | `string` | ID técnico do cabeçalho do e-mail. | 🟢 |
| `subject` | `string` | Assunto da mensagem. | 🟢 |
| `text` | `string` | Conteúdo da mensagem (texto puro). | 🟢 |
| `receivedAt` | `datetime` | Data/hora de recebimento/envio. | 🟢 |
| `messageThreadId` | `uuid` | FK para o grupo de conversa. | 🟢 |

### 1.2. Entidade: `MessageThread`

Agrupador de conversas.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `subject` | `string` | Assunto base do thread. | 🟢 |

### 1.3. Entidade: `MessageParticipant`

Ponte entre mensagens e atores.

| Campo | Tipo | Descrição | Confidência |
|-------|------|-----------|-------------|
| `role` | `enum` | SENDER, RECIPIENT. | 🟡 |
| `personId` | `uuid` | FK opcional para contato (Pessoa). | 🟢 |
| `workspaceMemberId` | `uuid` | FK opcional para membro interno. | 🟢 |

## 2. Estrutura de Canais e Pastas

- **`MessageChannel`:** Representa a conta conectada (ex: joao@gmail.com).
- **`MessageFolder`:** Representa a organização lógica (Inbox, Sent, Archive).
- **`MessageChannelMessageAssociation`:** Tabela de junção que vincula mensagens a canais e pastas específicas, permitindo que uma mesma mensagem exista em diferentes contextos de pasta para diferentes usuários.

## 3. Lógica de Sincronização

- **Threading:** Utiliza o `headerMessageId` e referências de cabeçalho para agrupar mensagens de forma resiliente, mesmo que o assunto mude ligeiramente (ex: "Re: ...").
- **Participant Mapping:** Ao processar uma mensagem, o sistema tenta resolver os endereços de e-mail contra a base de `Person` e `WorkspaceMember` para enriquecer o registro de participação.

## 4. Estratégia de Busca

- **Campos:** Indexa o `subject` tanto na `Message` quanto no `MessageThread` para permitir localização rápida de conversas.

## 5. Lacunas de Design

- 🔴 [DÚVIDA] Existe suporte para mensagens internas (chat) ou o módulo é focado exclusivamente em e-mails externos?
- 🔴 [DÚVIDA] Como o sistema lida com a privacidade de e-mails em um workspace compartilhado (quem pode ler o quê)?
