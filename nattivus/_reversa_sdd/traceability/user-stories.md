# User Stories: Fluxos Principais

Esta seção descreve os fluxos de valor do ponto de vista do usuário final, ancorados nas especificações técnicas.

## US-01: Gestão de Atividades na Timeline
**Como** um consultor de vendas,
**Eu quero** visualizar todas as notas e e-mails trocados com um cliente em ordem cronológica,
**Para que** eu possa entender o contexto da negociação antes de uma nova reunião.

- **Critérios de Aceitação:**
  - O sistema deve carregar eventos de múltiplas fontes (e-mail, notas, tarefas).
  - Eventos deletados não devem aparecer na linha do tempo.
  - Deve ser possível identificar quem foi o autor de cada nota.
- **Unit Relacionada:** `timeline/`

## US-02: Análise de Conversão no Dashboard
**Como** gestor comercial,
**Eu quero** visualizar um gráfico de barras com a quantidade de oportunidades em cada estágio,
**Para que** eu possa identificar gargalos no funil de vendas.

- **Critérios de Aceitação:**
  - O gráfico deve atualizar em tempo real conforme as oportunidades mudam de estágio.
  - Deve ser possível filtrar o dashboard por período (Ex: Último Trimestre).
  - Ao clicar em uma barra, o sistema deve permitir o drill-down para a lista de registros.
- **Unit Relacionada:** `dashboard/`

## US-03: Automação de Onboarding de Cliente
**Como** administrador do sistema,
**Eu quero** configurar um fluxo que crie uma tarefa automaticamente quando uma oportunidade for marcada como "Fechado/Ganho",
**Para que** o time de sucesso do cliente seja notificado sem intervenção manual.

- **Critérios de Aceitação:**
  - O gatilho (trigger) deve ser o evento de atualização de status da oportunidade.
  - A tarefa criada deve herdar o responsável da oportunidade ou um valor padrão.
  - O histórico da automação deve ser visível para auditoria.
- **Unit Relacionada:** `fluxo-de-trabalho/`
