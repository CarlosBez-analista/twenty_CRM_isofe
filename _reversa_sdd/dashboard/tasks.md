# Tarefas Técnicas: Painéis e Gráficos (Dashboard)

Tarefas para implementação ou migração do sistema analítico de painéis.

## 📋 Lista de Tarefas

### 1. Estrutura de Metadados
- [ ] **T-01: Implementar Entidade `Dashboard`**
  - Criar `DashboardWorkspaceEntity`.
  - Configurar relação com `PageLayout`.
  - Origem: `packages/twenty-server/src/modules/dashboard/standard-objects/dashboard.workspace-entity.ts`
  - Confiança: 🟢

- [ ] **T-02: Lógica de Duplicação**
  - Implementar `DashboardDuplicationService`.
  - Garantir cópia profunda do `PageLayout` e seus widgets.
  - Origem: `packages/twenty-server/src/modules/dashboard/services/dashboard-duplication.service.ts`
  - Confiança: 🟢

### 2. Motor de Gráficos (Chart Data)
- [ ] **T-03: Implementar Query Service Analítico**
  - Criar `ChartDataQueryService` para converter filtros em SQL.
  - Implementar suporte a funções de agregação (`sum`, `avg`, `count`).
  - Origem: `packages/twenty-server/src/modules/dashboard/chart-data/services/chart-data-query.service.ts`
  - Confiança: 🟢

- [ ] **T-04: Implementar Formatação por Tipo de Gráfico**
  - Criar serviços específicos: `BarChartDataService`, `LineChartDataService`, `PieChartDataService`.
  - Garantir retorno no formato esperado pelo front-end.
  - Origem: `packages/twenty-server/src/modules/dashboard/chart-data/services/*.ts`
  - Confiança: 🟢

### 3. Front-end e Widgets
- [ ] **T-05: Criar Widgets de Gráfico**
  - Implementar componentes React para renderização (`GraphWidgetBarChart`, etc.).
  - Integrar com o sistema de `PageLayout`.
  - Origem: `packages/twenty-front/src/modules/page-layout/widgets/graph/`
  - Confiança: 🟢

## 🚩 Definição de Pronto (DoD)
- Painéis podem ser criados e excluídos via interface.
- Gráficos exibem dados reais do banco de dados refletindo os filtros aplicados.
- Funcionalidade de duplicação validada (IDs de layout não colidem).
- Cobertura de testes unitários para os serviços de cálculo analítico.
