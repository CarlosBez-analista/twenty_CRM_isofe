# Análise de Código — twenty-crm-erp

> Documento gerado pelo Archaeologist do Reversa.
> Escala de Confiança: 🟢 CONFIRMADO | 🟡 INFERIDO | 🔴 LACUNA

---

## 1. Visão Geral da Arquitetura
O sistema segue uma arquitetura baseada em **Standard Objects** (objetos de negócio padrão) e **Core Engines**. A lógica de negócio é distribuída entre:
- **Entidades do Twenty ORM:** Definições de esquema e relacionamentos.
- **Query Hooks:** Lógica interceptora de operações de banco de dados (Pre/Post query).
- **Listeners:** Reações assíncronas a eventos de banco de dados.
- **Engines Transversais:** Workflow, Messaging, Calendar.

---

## 2. Dicionário de Padrões
- **ActorMetadata:** Armazena quem realizou a ação (source, workspaceMemberId, name).
- **searchVector:** Coluna do tipo `tsvector` para busca full-text no PostgreSQL.
- **BaseWorkspaceEntity:** Classe base que injeta `id`, `createdAt`, `updatedAt` e `deletedAt`.

---

## 3. Módulos Analisados

## 3.1. Company
🟢 CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** Gestão de organizações e contas.

- **Destaque:** Utiliza o campo `domainName` como identificador lógico para enriquecimento de dados e agrupamento de contatos.
- **Relacionamentos:** Possui coleções de `Person`, `Opportunity`, `Task` e `Attachment`.

## 3.2. Person
🟢 CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** Gestão de contatos e indivíduos.

- **Destaque:** Migrou de um campo `phone` único para uma estrutura de `phones` (array), permitindo múltiplos números por contato.
- **FullName:** Utiliza metadados estruturados para nomes, facilitando a internacionalização e ordenação.

## 3.3. Opportunity
🟢 CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** Gestão de oportunidades de negócio e pipeline de vendas.

- **Agregação:** Realiza soma automática de `amount` por estágio no Kanban.
- **Relacionamentos:** Vínculos com `Company` (Empresa), `Person` (Ponto de Contato) e `WorkspaceMember` (Dono).

## 3.4. Task
🟢 CONFIRMADO
**Complexidade:** Média
**Responsabilidade:** Gestão de tarefas e afazeres.

- **Polimorfismo:** Utiliza `TaskTarget` para vincular uma tarefa a múltiplos objetos simultaneamente.
- **Timeline:** Integrada ao módulo de linha do tempo para histórico de interações.

### 5. Módulo: Timeline (Linha do Tempo)
O módulo de Timeline funciona como um log de auditoria reativo e centralizado para todas as atividades relevantes do CRM.

- **Arquitetura Reativa**: Utiliza o `entityEventsToDbQueue` para processar eventos de banco de dados em lote. O job `UpsertTimelineActivityFromInternalEvent` escuta mudanças em objetos específicos (como Notas e Tarefas).
- **Agregação e Alvos**: Quando uma Nota ou Tarefa é criada/alterada, o `TimelineActivityService` identifica todos os registros "alvos" relacionados (Pessoas, Empresas, Oportunidades) e cria entradas de timeline para cada um deles. Isso permite que a aba "Timeline" de uma Empresa mostre todas as notas de todas as pessoas vinculadas a ela.
- **De-duplicação (Merging)**: O `TimelineActivityRepository` possui uma lógica de agrupamento (merging) onde eventos similares que ocorrem dentro de uma janela de 10 minutos (pelo mesmo usuário e no mesmo registro) são consolidados em uma única entrada, atualizando apenas as propriedades.
- **Estrutura de Dados**: Utiliza campos "Morfismo" (polimórficos) via `linkedRecordId` e `linkedObjectMetadataId` para referenciar qualquer tipo de objeto do sistema sem chaves estrangeiras rígidas em todos os casos.

### 6. Módulo: Dashboard (Painéis e Gráficos)
O Dashboard no Twenty CRM é construído sobre a infraestrutura de Metadados de Layout, permitindo alta customização.

- **Composição via Layout**: Um Dashboard não contém widgets diretamente; ele aponta para um `PageLayout`. Este layout é dividido em `PageLayoutTab` (Abas) e `PageLayoutWidget` (Widgets).
- **Configuração de Widgets**: Cada widget armazena sua configuração técnica (tipo de gráfico, filtros, métricas) e sua posição em grade (`gridPosition`) no formato JSONB.
- **Cálculo de Dados On-the-fly**: O sub-módulo `ChartData` (através de resolvers como `BarChartDataResolver`) processa as requisições de visualização em tempo real, consultando o banco de dados conforme a configuração do widget para retornar os agregados (counts, sums, etc) necessários para renderizar os gráficos.
- **Replicação**: Existe um `DashboardDuplicationService` que permite clonar dashboards inteiros, replicando a estrutura de layouts, abas e widgets.

## 3.5. Workflow
🟢 CONFIRMADO
**Complexidade:** Alta
**Responsabilidade:** Motor de automação e orquestração de processos.

- **Arquitetura:** Executor desacoplado (Runner) que processa grafos de passos (Steps).
- **Throttling:** Limitação de execução por workspace para garantir performance.

## 3.6. Messaging
🟢 CONFIRMADO
**Complexidade:** Alta
**Responsabilidade:** Sincronização de e-mails e gestão de threads.

- **Deduplicação:** Agrupamento inteligente de mensagens em threads via `headerMessageId`.
- **Auto-Contact:** Criação automática de contatos baseada em participantes de e-mail.

## 3.7. Calendar
🟢 CONFIRMADO
**Complexidade:** Alta
**Responsabilidade:** Sincronização de eventos e gestão de disponibilidade.

- **Deduplicação Global:** Uso de `iCalUid` para evitar duplicatas entre diferentes calendários de um mesmo workspace.
- **Canais:** Abstração de provedores (Google/Microsoft) via `CalendarChannel`.

## 3.8. Note
🟢 CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** Registro de anotações ricas.

- **Multi-target:** Uma nota pode aparecer em múltiplos objetos via `NoteTarget`.
- **Conteúdo:** Utiliza `bodyV2` com suporte a Rich Text e menções.

## 3.9. Attachment
🟢 CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** Proxy para arquivos armazenados no storage.

- **Relacionamentos:** Vinculado ao autor (`WorkspaceMember`) e ao alvo polimórfico (`AttachmentTarget`).

## 3.10. Workspace Member
🟢 CONFIRMADO
**Complexidade:** Média
**Responsabilidade:** Representação do usuário dentro do workspace.

- **Preferências:** Centraliza `locale`, `timeZone`, `dateFormat` e esquemas de cores.
- **Hooks de Ciclo de Vida:**
    - `WorkspaceMemberDeleteOnePostQueryHook`: Remove o vínculo global `UserWorkspace` ao deletar um membro.
    - `WorkspaceMemberAvatarFileDeletionListener`: Gerencia a deleção física de arquivos de avatar no storage.
- **Permissões:** A criação é protegida, exigindo fluxos de convite controlados.

## 3.11. Connected Account
🟢 CONFIRMADO
**Complexidade:** Alta
**Responsabilidade:** Gestão de credenciais e conexões com provedores externos.

- **OAuth Lifecycle:** Gerenciamento centralizado de `accessToken` e `refreshToken` com renovação automática.
- **Provedores Suportados:** Google, Microsoft e IMAP/SMTP/CALDAV genérico.
- **Provisionamento:** Serve como base para a criação automática de `MessageChannel` e `CalendarChannel`.


## 3.12. twenty-erp
?? CONFIRMADO
**Complexidade:** Baixa
**Responsabilidade:** M�dulo customizado para emiss�o fiscal e gerenciamento de pedidos, estendendo as funcionalidades do CRM.

- **Entidades:** Introduz PedidoWorkspaceEntity para registrar as vendas (com status, valor total e refer�ncia ao companyId e opportunityId).
- **Servi�os:** FocusNfeHttpService atua como client para a API Focus NFe, incluindo um interceptor HTTP dedicado para logs de auditoria de performance e rastreabilidade ([AUDIT] HTTP Interceptor).
- **Workflows:** Registra o EmissorFiscalWorkflowAction para ser orquestrado pelo motor de workflow do sistema legado, validando o contexto (dados do Pedido) e injetando o payload para emiss�o na SEFAZ via Focus NFe.

