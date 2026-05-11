# Gaps de Especificação — twenty-crm-erp

> Gerado pelo Revisor em 2026-05-11
> Doc Level: `detalhado` — gaps categorizados por severidade (crítico / moderado / cosmético).

---

## Resumo

| Severidade | Total |
|------------|-------|
| 🔴 Crítico | 4 |
| 🟡 Moderado | 11 |
| ⚪ Cosmético | 2 |
| ✅ Resolvidos | 27 |

---

## 🔴 Críticos — Bloqueiam reimplementação segura

### GAP-C01 — Orphan Cleanup no Storage de Anexos
**Módulo:** `anexo/design.md`
**Descrição:** Não existe (ou não foi confirmada) lógica de limpeza de arquivos físicos após exclusão do registro no banco. Arquivos órfãos causam custos crescentes de storage e violam LGPD em caso de dados pessoais.
**Ação recomendada:** Implementar job agendado (cron) que lista arquivos no storage e verifica se o UUID correspondente ainda existe na tabela `Attachment`. Deletar física e definitivamente os órfãos.
**Prioridade:** Alta — deve ser implementado antes de produção.

---

### GAP-C02 — Lógica de Sincronização do syncCursor (Calendário)
**Módulo:** `calendario/design.md`
**Descrição:** A lógica exata de como o `syncCursor` é atualizado após falhas parciais é desconhecida pelo proprietário. Sem isso, o sistema pode importar eventos duplicados ou perder eventos após reconexão.
**Ação recomendada:** Investigar o código do módulo de calendário para localizar o handler de `syncCursor`. Documentar a estratégia (checkpoint-based vs timestamp-based).
**Prioridade:** Alta — crítico para a confiabilidade da integração de calendário.

---

### GAP-C03 — Validação de Admin Único por Workspace
**Módulo:** `membro-do-workspace/edge-cases.md`
**Descrição:** Não confirmado se o Twenty impede nativamente que o último admin de um workspace seja removido ou rebaixado. Se não houver essa trava, o workspace pode ficar sem governança.
**Ação recomendada:** Buscar hook `pre-query` ou `before-delete` no módulo `workspace-member`. Se ausente, implementar validação: `if (adminCount == 1 && isRemovingAdmin) throw BusinessRuleError`.
**Prioridade:** Alta — risco de perda de acesso ao workspace.

---

### GAP-C04 — Indexação de Busca Textual em Notas
**Módulo:** `nota/design.md`
**Descrição:** A busca dentro do conteúdo de notas não está especificada. O usuário indicou que usa ID e número sequencial como índice, mas não há confirmação de Full-Text Search no campo de conteúdo.
**Ação recomendada:** Confirmar se o campo `body`/`richText` possui um `searchVector` ou GIN index no PostgreSQL. Se não, avaliar custo-benefício de implementar FTS via `tsvector`.
**Prioridade:** Alta — impacta usabilidade em bases com muitas notas.

---

## 🟡 Moderados — Impactam qualidade ou roadmap

### GAP-M01 — Recorrência de Eventos de Calendário
**Módulo:** `calendario/edge-cases.md`
**Descrição:** Como o sistema trata edição de uma única ocorrência de um evento recorrente (ex: Google Calendar "Edit this event" vs "Edit all events") é desconhecido.
**Ação recomendada:** Verificar se há campo `recurringEventId` ou similar na tabela `CalendarEvent`. Documentar a estratégia.

---

### GAP-M02 — Resolução de Variáveis entre Passos de Workflow
**Módulo:** `fluxo-de-trabalho/design.md`
**Descrição:** O mecanismo de passagem de dados entre steps (output do step 1 como input do step 2) não foi confirmado pelo proprietário.
**Ação recomendada:** Investigar o `WorkflowExecutorService` para identificar como o `state` JSON é construído e como as expressões de template são resolvidas.

---

### GAP-M03 — Condicionais e Loops em Workflows
**Módulo:** `fluxo-de-trabalho/requirements.md`
**Descrição:** Suporte a `if/else` e `forEach` dentro dos steps não foi confirmado. O proprietário acredita que existe, mas não tem certeza.
**Ação recomendada:** Verificar os tipos de nós disponíveis no `WorkflowNodeType` enum.

---

### GAP-M04 — Re-play de Execução de Workflow
**Módulo:** `fluxo-de-trabalho/requirements.md`
**Descrição:** O proprietário acredita que o sistema retenta ações que falharam, mas não confirmou o mecanismo exato.
**Ação recomendada:** Verificar configuração de retry no BullMQ (opção `attempts` e `backoff`).

---

### GAP-M05 — Sandbox de WorkflowAction
**Módulo:** `fluxo-de-trabalho/design.md`
**Descrição:** Não confirmado se as ações executam em sandbox isolado ou têm acesso direto às APIs do servidor.
**Ação recomendada:** Verificar se há Worker em processo separado ou se as ações são executadas no mesmo processo NestJS.

---

### GAP-M06 — Expiração do refreshToken por Provedor
**Módulo:** `conta-conectada/design.md`
**Descrição:** A lógica exata de expiração e re-autenticação para provedores que impõem re-login periódico não foi confirmada.
**Ação recomendada:** Verificar `refreshToken` handler no `ConnectedAccountService`. Documentar tempo de vida e fluxo de renovação.

---

### GAP-M07 — Upgrade de Escopos OAuth
**Módulo:** `conta-conectada/edge-cases.md`
**Descrição:** Não confirmado se existe detecção automática de gap de escopos. O proprietário indica que é uma melhoria futura.
**Ação recomendada:** Planejar como feature futura: comparar escopos armazenados vs escopos necessários e disparar fluxo de re-autorização.

---

### GAP-M08 — Gatilho Automático de Estágio (PROPOSAL → CUSTOMER)
**Módulo:** `oportunidade/design.md`
**Descrição:** O proprietário confirma que este comportamento é roadmap futuro, não implementado atualmente.
**Ação recomendada:** Documentar como feature futura. Implementar como Workflow com trigger em evento de contrato fechado.

---

### GAP-M09 — Notificações Automáticas de Tarefas por dueAt
**Módulo:** `tarefa/requirements.md`
**Descrição:** Não confirmado se o Twenty tem sistema de notificações push/email nativo para lembretes de tarefas.
**Ação recomendada:** Verificar se há módulo de notificações no Twenty. Se sim, criar job que verifica `dueAt` e dispara notificação X horas antes.

---

### GAP-M10 — Tarefas Recorrentes
**Módulo:** `tarefa/requirements.md`
**Descrição:** O proprietário confirma que tarefas recorrentes são roadmap futuro e importantes.
**Ação recomendada:** Documentar como feature futura. Modelo sugerido: campo `recurrenceRule` (iCal RRULE) + job que gera próxima ocorrência ao completar a atual.

---

### GAP-M11 — Resiliência do DashboardDuplicationService
**Módulo:** `dashboard/edge-cases.md`
**Descrição:** O comportamento ao duplicar um dashboard com widgets órfãos (configuração inválida) não foi confirmado pelo proprietário.
**Ação recomendada:** Testar a duplicação com um widget órfão e observar se a transação aborta ou ignora o widget.

---

## ⚪ Cosméticos — Não bloqueiam operação

### GAP-K01 — Campo `probability` Deprecado em Oportunidade
**Módulo:** `oportunidade/requirements.md`
**Descrição:** O campo foi deprecado e o proprietário confirma que não possui valor prático para o modelo de negócio atual (foco em valor real, não probabilístico).
**Decisão:** Remover da spec como campo ativo. Manter apenas nota histórica.

---

### GAP-K02 — Módulo de Mensagens/Email (Descartado)
**Módulo:** `mensagens/`
**Descrição:** O proprietário confirma que o gerenciamento de e-mails **não é escopo deste projeto** se não for nativo do Twenty. O CRM usará e-mail apenas para notificações do sistema (lembretes de tarefas, compromissos).
**Decisão:** Marcar o módulo `mensagens` como fora de escopo do projeto customizado. Usar apenas funcionalidades nativas do Twenty, se existirem.

---

## ✅ Gaps Resolvidos nesta sessão

| ID | Módulo | Resolução |
|----|--------|-----------|
| R01 | `empresa/design.md` | domainName ÚNICO por projeto — 🟢 CONFIRMADO |
| R02 | `empresa/requirements.md` | Empresa com oportunidade ativa não pode ser excluída — 🟢 CONFIRMADO |
| R03 | `empresa/requirements.md` | Campo `position` sequencial, roadmap drag-and-drop — 🟡 ROADMAP |
| R04 | `pessoa/design.md` | Storage de avatares: local por padrão, configurável — 🟢 CONFIRMADO |
| R05 | `pessoa/design.md` | Normalização de telefone: máscara BR `(DD) 99999-9999` — 🟢 CONFIRMADO |
| R06 | `pessoa/requirements.md` | Desduplicação por e-mail: alerta + confirmação opcional — 🟢 CONFIRMADO |
| R07 | `pessoa/requirements.md` | Campo `position`: por Pasta/Categoria, roadmap global — 🟡 ROADMAP |
| R08 | `oportunidade/design.md` | Gatilho PROPOSAL→CUSTOMER: roadmap futuro — 🟡 ROADMAP |
| R09 | `oportunidade/design.md` | Multi-moeda: não suportado. Moeda fixa: BRL — 🟢 CONFIRMADO |
| R10 | `oportunidade/requirements.md` | closeDate no passado: permitido (ajustes em oportunidades antigas) — 🟢 CONFIRMADO |
| R11 | `oportunidade/requirements.md` | Campo `probability`: deprecado, sem substituto — campo removido do escopo — 🟢 CONFIRMADO |
| R12 | `tarefa/design.md` | Exclusão em cascata: apagar Oportunidade apaga Tarefas vinculadas — 🟢 CONFIRMADO |
| R13 | `tarefa/design.md` | Campo `status`: customizável por workspace — 🟢 CONFIRMADO |
| R14 | `tarefa/requirements.md` | Notificações por dueAt: dependente do sistema nativo do Twenty — 🟡 INFERIDO |
| R15 | `tarefa/requirements.md` | Tarefas recorrentes: roadmap futuro — 🟡 ROADMAP |
| R16 | `calendario/design.md` | syncCursor: lógica nativa do Twenty, a avaliar — 🟡 INFERIDO |
| R17 | `calendario/design.md` | Outlook: possibilidade futura; padrão Google — 🟡 ROADMAP |
| R18 | `calendario/edge-cases.md` | Recorrência: a avaliar nativamente no Twenty — 🟡 INFERIDO |
| R19 | `conta-conectada/design.md` | refreshToken: comportamento nativo do Twenty — 🟡 INFERIDO |
| R20 | `conta-conectada/design.md` | Segredos OAuth: armazenados por workspace — 🟢 CONFIRMADO |
| R21 | `conta-conectada/edge-cases.md` | Upgrade de escopos: melhoria futura — 🟡 ROADMAP |
| R22 | `mensagens/` | Módulo de e-mail: fora de escopo do projeto customizado — 🟢 CONFIRMADO |
| R23 | `anexo/design.md` | Storage: local por padrão, configurável (Backblaze, Cloudinary) — 🟢 CONFIRMADO |
| R24 | `anexo/design.md` | Limite upload: 50MB por arquivo, configurável — 🟢 CONFIRMADO |
| R25 | `anexo/edge-cases.md` | Colisão de nomes: sugerir novo nome — 🟡 INFERIDO |
| R26 | `nota/design.md` | Limite de conteúdo: sem limite de caracteres definido — 🟡 INFERIDO |
| R27 | `nota/edge-cases.md` | WebSocket para edição colaborativa: nativo do Twenty, a configurar — 🟡 INFERIDO |
| R28 | `membro-do-workspace/design.md` | Multi-workspace: não suportado nativamente. Um user = um workspace — 🟢 CONFIRMADO |
| R29 | `membro-do-workspace/design.md` | Convites: uso interno apenas (equipe/colaboradores) — baixa prioridade — 🟢 CONFIRMADO |
| R30 | `membro-do-workspace/edge-cases.md` | Email User vs Member: campos independentes — 🟢 CONFIRMADO |
| R31 | `timeline/edge-cases.md` | Histórico preservado após deleção do registro original — 🟡 INFERIDO |
