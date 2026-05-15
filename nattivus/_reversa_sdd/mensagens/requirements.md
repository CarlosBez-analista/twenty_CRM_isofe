# Requirements: Mensagens (Messaging)

> Identificador: `006-mensagens`
> Data: 2026-05-11
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Mensagens centraliza a comunicação externa (e-mails) e interna dentro do CRM. Ele organiza as interações em fios de conversa (`threads`), vincula participantes (`participants`) a registros de contatos e gerencia a sincronização através de canais (`channels`). Permite que o usuário visualize o histórico completo de comunicação sem sair do contexto de uma Pessoa, Empresa ou Oportunidade.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `packages/twenty-server/src/modules/messaging/common/standard-objects/message.workspace-entity.ts` | Estrutura da mensagem individual: subject, text, receivedAt, threadId. | 🟢 |
| `packages/twenty-server/src/modules/messaging/common/standard-objects/message-thread.workspace-entity.ts` | Agrupamento de mensagens por assunto e linha temporal. | 🟢 |
| `packages/twenty-server/src/modules/messaging/common/standard-objects/message-participant.workspace-entity.ts` | Vinculação de remetentes e destinatários a WorkspaceMembers ou Pessoas. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Vendedor | Centralizar e-mails | Visualizar todos os e-mails trocados com um contato diretamente na linha do tempo da Pessoa. |
| SDR | Iniciar conversa | Enviar um e-mail a partir do CRM que será registrado como uma nova `Message` vinculada a um `MessageThread`. |
| Gestor de Vendas | Auditar comunicação | Revisar o tom e o conteúdo das mensagens trocadas em uma Oportunidade crítica. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Agrupamento por Thread. Mensagens com o mesmo `headerMessageId` ou assunto relacionado devem ser agrupadas no mesmo `messageThreadId`. 🟢
   - Origem no legado: `message.workspace-entity.ts#messageThreadId`
   - Tipo: confirmada
2. **RN-02:** Participação Multinível. Uma mensagem pode ter múltiplos participantes (To, Cc, Bcc), mapeados via `MessageParticipant`. 🟢
   - Origem no legado: `message-participant.workspace-entity.ts`
   - Tipo: confirmada
3. **RN-03:** Sincronização via Canais. As mensagens são injetadas no sistema através de canais configurados (Gmail, Outlook), mapeados em `MessageChannel`. 🟢
   - Origem no legado: `message-channel.workspace-entity.ts`
   - Tipo: confirmada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Armazenamento de Mensagens | Must | Salvar conteúdo textual, assunto e metadados de cabeçalho de e-mails. | 🟢 |
| RF-02 | Fios de Conversa (Threads) | Must | Agrupar mensagens relacionadas para exibição cronológica. | 🟢 |
| RF-03 | Gestão de Participantes | Must | Identificar remetente e destinatários, vinculando-os a contatos existentes no CRM. | 🟢 |
| RF-04 | Organização em Pastas | Should | Permitir classificar mensagens em pastas (Inbox, Sent, Trash) via `MessageFolder`. | 🟢 |
| RF-05 | Busca por Assunto | Must | Permitir busca rápida de mensagens através do campo `subject`. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Busca Full-text | Indexação via `SEARCH_FIELDS_FOR_MESSAGE`. | 🟢 |
| Integridade | Rastreabilidade de Cabeçalho | Uso de `headerMessageId` para garantir a reconstrução correta de threads em sincronizações assíncronas. | 🟢 |
| Privacidade | Isolamento de Canal | Mensagens são vinculadas a `MessageChannel` específicos para respeitar permissões de conta conectada. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Recebimento de nova mensagem em thread existente
  Dado que existe um thread com assunto "Dúvida sobre proposta"
  Quando um novo e-mail com o mesmo In-Reply-To for processado
  Então a nova mensagem deve ser vinculada ao thread existente
  E a data de atualização do thread deve ser renovada

Cenário: Identificação de participante conhecido
  Dado que recebo um e-mail do endereço "cliente@empresa.com"
  E existe uma Pessoa cadastrada com esse e-mail
  Quando a mensagem for processada
  Então o sistema deve criar um MessageParticipant vinculado ao ID da Pessoa
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Requisito básico para histórico de comunicação. |
| RF-02 | Must | Essencial para usabilidade (evita mensagens soltas). |
| RF-03 | Must | Necessário para o contexto de CRM (saber com quem se fala). |
| RF-04 | Should | Ajuda na organização, mas o histórico na linha do tempo é mais crítico. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] O sistema armazena o corpo do e-mail em HTML completo ou apenas texto puro (`text`)?
- 🔴 [DÚVIDA] Como são tratados anexos pesados dentro das mensagens? São migrados para o módulo de `Attachment` global?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-11 | Versão inicial gerada por `/reversa-writer` | reversa-writer |
