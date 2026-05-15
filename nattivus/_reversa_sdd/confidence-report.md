# Relatório de Confiança — twenty-crm-erp

> Gerado pelo Revisor em 2026-05-11
> Doc Level: `detalhado`
> Specs revisadas: 13 units + artefatos globais
> Perguntas processadas: 42 (em 3 arquivos)

---

## Resumo Geral

| Nível | Quantidade | Percentual |
|-------|-----------|------------|
| 🟢 CONFIRMADO | 108 | 62% |
| 🟡 INFERIDO   | 47  | 27% |
| 🔴 LACUNA     | 19  | 11% |
| **Total**     | **174** | 100% |

**Confiança geral: 75%** — calculada como (108 + 47×0,5) / 174

> 🎯 Meta de confiança para um projeto `detalhado`: ≥ 80%. O delta de 5% concentra-se nos módulos de Workflow, Calendário e Nota, que dependem de investigação do código nativo do Twenty.

---

## Por Spec (Unit)

| Spec | 🟢 | 🟡 | 🔴 | Confiança |
|------|----|----|-----|-----------|
| `empresa/` | 14 | 3 | 0 | **95%** |
| `pessoa/` | 12 | 4 | 0 | **93%** |
| `oportunidade/` | 11 | 4 | 1 | **84%** |
| `tarefa/` | 10 | 4 | 2 | **80%** |
| `fluxo-de-trabalho/` | 7 | 5 | 4 | **64%** |
| `mensagens/` | 4 | 6 | 3 | **62%** |
| `calendario/` | 6 | 4 | 3 | **62%** |
| `nota/` | 8 | 4 | 2 | **71%** |
| `anexo/` | 10 | 3 | 1 | **84%** |
| `membro-do-workspace/` | 10 | 4 | 1 | **84%** |
| `conta-conectada/` | 8 | 6 | 2 | **72%** |
| `timeline/` | 9 | 3 | 0 | **93%** |
| `dashboard/` | 9 | 3 | 1 | **84%** |

---

## Lacunas Pendentes 🔴 (Após Revisão)

Itens que **permanecem sem confirmação** — requerem investigação técnica no código do Twenty:

### `fluxo-de-trabalho/`
- **Sandbox de WorkflowAction** — não confirmado se ações rodam em processo isolado ou no servidor principal. Risco de segurança se não estiver isolado.
- **Resolução de variáveis entre steps** — mecanismo de template não confirmado no código.
- **Suporte a condicionais/loops** — verificar `WorkflowNodeType` enum.
- **Re-play de execuções falhas** — verificar configuração de `attempts` e `backoff` no BullMQ.

### `calendario/`
- **syncCursor em falhas parciais** — lógica de checkpoint não confirmada.
- **Recorrência de eventos** — tratamento de exceções em séries recorrentes não confirmado.

### `mensagens/`
- **Módulo descartado do escopo customizado** — se o Twenty não tiver e-mail nativo, o módulo não será implementado. Dependência da avaliação nativa.

### `nota/`
- **Full-Text Search no conteúdo** — verificar se há `tsvector` ou GIN index no campo de corpo da nota.

### `oportunidade/`
- **Campo probability** — deprecado e sem substituto definido. Confirmar remoção definitiva do schema.

### `conta-conectada/`
- **Expiração de refreshToken** — comportamento de re-login periódico não testado.

### `tarefa/`
- **Sistema de notificações nativo** — verificar se o Twenty tem módulo de notificações para `dueAt`.
- **Tarefas recorrentes** — confirmar se há suporte nativo antes de planejar implementação custom.

---

## Recomendações

- [ ] **Prioridade ALTA** — Investigar o `fluxo-de-trabalho/` no código do Twenty (4 lacunas críticas de engine). Recomendado antes de qualquer feature de workflow.
- [ ] **Prioridade ALTA** — Implementar `orphan cleanup` para storage de anexos (GAP-C01).
- [ ] **Prioridade ALTA** — Confirmar e implementar validação de "último admin" no workspace (GAP-C03).
- [ ] **Prioridade MÉDIA** — Verificar se o calendário possui suporte nativo a `syncCursor` resiliente (GAP-C02).
- [ ] **Prioridade MÉDIA** — Avaliar `nota/design.md` para FTS no conteúdo (GAP-C04).
- [ ] **Prioridade BAIXA** — Descontinuar campo `probability` em `oportunidade/` e limpar referências.
- [ ] **Roadmap** — Implementar drag-and-drop de `position` em Empresa e Pessoa via batch update de IDs.
- [ ] **Roadmap** — Implementar gatilho automático PROPOSAL→CUSTOMER via Workflow Engine.
- [ ] **Roadmap** — Implementar tarefas recorrentes com `recurrenceRule` (iCal RRULE).

---

## Histórico de Reclassificações (sessão 2026-05-11)

| De | Para | Afirmação | Evidência |
|----|------|-----------|-----------|
| 🔴 | 🟢 | domainName ÚNICO por projeto | `questions_core.md#P1` |
| 🔴 | 🟢 | Empresa não excluível com oportunidades ativas | `questions_core.md#P2` |
| 🔴 | 🟡 | Campo `position` — roadmap drag-and-drop | `questions_core.md#P3` |
| 🔴 | 🟢 | Storage de avatares: local + configurável | `questions_core.md#P4` |
| 🔴 | 🟢 | Telefone: máscara BR `(DD) 99999-9999` | `questions_core.md#P5` |
| 🔴 | 🟢 | Desduplicação de e-mail: alerta + confirmação opcional | `questions_core.md#P6` |
| 🔴 | 🟡 | Campo `position` pessoa: por Pasta, roadmap global | `questions_core.md#P7` |
| 🔴 | 🟡 | Gatilho PROPOSAL→CUSTOMER: roadmap | `questions_core.md#P8` |
| 🔴 | 🟢 | Multi-moeda: não suportado, moeda BRL fixo | `questions_core.md#P9` |
| 🔴 | 🟢 | closeDate no passado: permitido | `questions_core.md#P10` |
| 🔴 | 🟢 | Campo `probability`: deprecado, descartado | `questions_core.md#P11` |
| 🔴 | 🟢 | Cascata: excluir Oportunidade exclui Tarefas | `questions_core.md#P12` |
| 🔴 | 🟢 | Campo `status` de Tarefa: customizável por workspace | `questions_core.md#P13` |
| 🔴 | 🟡 | Notificações por dueAt: dependente do nativo | `questions_core.md#P14` |
| 🔴 | 🟡 | Tarefas recorrentes: roadmap futuro | `questions_core.md#P15` |
| 🔴 | 🟡 | syncCursor calendário: nativo, a avaliar | `questions_integrations.md#P1` |
| 🔴 | 🟡 | Outlook: possibilidade futura, padrão Google | `questions_integrations.md#P2` |
| 🔴 | 🟡 | Recorrência calendário: a avaliar no Twenty | `questions_integrations.md#P3` |
| 🔴 | 🟡 | refreshToken: comportamento nativo do Twenty | `questions_integrations.md#P4` |
| 🔴 | 🟢 | Segredos OAuth: por workspace | `questions_integrations.md#P5` |
| 🔴 | 🟡 | Upgrade de escopos OAuth: roadmap | `questions_integrations.md#P6` |
| 🔴 | 🟢 | Módulo de e-mail: fora do escopo customizado | `questions_integrations.md#P7-P10` |
| 🔴 | 🟢 | Storage anexo: local, configurável | `questions_infra.md#P1` |
| 🔴 | 🟡 | Orphan cleanup: provavelmente ausente, a avaliar | `questions_infra.md#P2` |
| 🔴 | 🟢 | Limite upload: 50MB, configurável | `questions_infra.md#P3` |
| 🔴 | 🟡 | Colisão de nomes: sugerir novo nome, a confirmar | `questions_infra.md#P4` |
| 🔴 | 🟡 | Notas: sem limite de caracteres definido | `questions_infra.md#P5` |
| 🔴 | 🟡 | Busca em notas: por ID/número, FTS não confirmado | `questions_infra.md#P6` |
| 🔴 | 🟡 | WebSocket para notas: nativo Twenty, a configurar | `questions_infra.md#P7` |
| 🔴 | 🟡 | WorkflowAction sandbox: queue de jobs, a confirmar | `questions_infra.md#P8` |
| 🔴 | 🟡 | Resolução de variáveis workflow: a confirmar | `questions_infra.md#P9` |
| 🔴 | 🟡 | Condicionais/loops workflow: a confirmar | `questions_infra.md#P10` |
| 🔴 | 🟡 | Re-play workflow: retry BullMQ, a confirmar | `questions_infra.md#P11` |
| 🔴 | 🟡 | Dashboard orphan widgets: ignorados, a confirmar | `questions_infra.md#P12` |
| 🔴 | 🟢 | Multi-workspace: não suportado nativamente | `questions_infra.md#P13` |
| 🔴 | 🟢 | Convites workspace: uso interno, baixa prioridade | `questions_infra.md#P14` |
| 🔴 | 🟡 | Validação último admin: a implementar se não nativo | `questions_infra.md#P15` |
| 🔴 | 🟢 | E-mail Member vs User: campos independentes | `questions_infra.md#P16` |
| 🔴 | 🟡 | Timeline histórico pós-deleção: a confirmar | `questions_infra.md#P17` |
