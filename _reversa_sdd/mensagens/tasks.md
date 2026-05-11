# Mensagens (Messaging), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] Implementação de `Person` e `WorkspaceMember` funcional (para mapeamento de participantes).
- [ ] Sistema de gestão de contas conectadas (OAuth para Gmail/Outlook).
- [ ] Infraestrutura de Standard Objects com suporte a relacionamentos muitos-para-muitos.

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir Entidades Core de Mensageria
  - Origem no legado: `message.workspace-entity.ts` e `message-thread.workspace-entity.ts`.
  - Critério de pronto: Esquema de banco de dados para Mensagens e Threads com suporte a metadados de e-mail.
  - Confiança: 🟢

- [ ] T-02, Implementar Mapeamento de Participantes (`MessageParticipant`)
  - Origem no legado: `message-participant.workspace-entity.ts`.
  - Critério de pronto: Lógica capaz de vincular e-mails a registros de contatos ou membros do workspace.
  - Confiança: 🟢

- [ ] T-03, Configurar Canais e Pastas
  - Origem no legado: `message-channel.workspace-entity.ts` e `message-folder.workspace-entity.ts`.
  - Critério de pronto: Suporte a múltiplos canais de entrada e organização lógica de mensagens.
  - Confiança: 🟢

- [ ] T-04, Implementar Lógica de Threading
  - Origem no legado: Campo `headerMessageId` e utilitários de sincronização.
  - Critério de pronto: Agrupamento automático de mensagens baseando-se em referências de cabeçalho.
  - Confiança: 🟡

## Tarefas de Teste

- [ ] TT-01, Teste de criação de thread: Enviar duas mensagens relacionadas e validar se ambas aparecem no mesmo thread.
- [ ] TT-02, Teste de participante: Receber mensagem de um e-mail cadastrado em `Person` e validar se o ID da pessoa é atribuído ao participante.
- [ ] TT-03, Teste de pasta: Mover uma mensagem para a lixeira (`Trash`) e validar se a associação de pasta foi atualizada.
- [ ] TT-04, Teste de busca: Buscar por uma palavra-chave no assunto de uma mensagem e retornar o thread correspondente.

## Ordem Sugerida
1. T-01 (Message/Thread Entities) e T-03 (Channels/Folders).
2. T-02 (Participant mapping logic).
3. T-04 (Threading algorithm).
4. TT-01 a TT-04 (Testes).

## Lacunas Pendentes (🔴)
- **Sanitização de HTML:** Verificar se o sistema possui um serviço de limpeza de HTML para exibir o conteúdo das mensagens de forma segura no frontend.
- **Vínculo com CRM Objects:** Identificar como as mensagens são associadas a uma Oportunidade específica (manualmente ou via detecção de contexto).
