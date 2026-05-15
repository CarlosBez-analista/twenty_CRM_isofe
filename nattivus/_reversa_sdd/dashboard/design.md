# Design: Painéis e Gráficos (Dashboard)

Este documento descreve a arquitetura técnica para geração e exibição de dados analíticos no sistema.

## 🏗️ Arquitetura

O sistema de Dashboard é híbrido, dividindo a responsabilidade entre metadados de painel e execução de consultas analíticas.

### Componentes de Back-end
- **DashboardModule**: Gerencia o CRUD de painéis e a lógica de duplicação.
- **ChartDataModule**: Especializado em transformar configurações de widgets (armazenadas no `pageLayout`) em consultas SQL/ORM e retornar dados formatados para gráficos.
- **ChartDataQueryService**: Abstração central que traduz filtros e agregações do GraphQL para comandos do banco de dados.

### Componentes de Front-end
- **PageLayout System**: Os dashboards são, tecnicamente, instâncias de layouts de página.
- **Graph Widgets**: Componentes React (`BarChart`, `LineChart`, `PieChart`) que consomem a API de `chartData` e utilizam bibliotecas de visualização para renderizar os dados.

## 🗄️ Modelo de Dados

### DashboardWorkspaceEntity
| Campo | Tipo | Descrição | Confiança |
|-------|------|-----------|-----------|
| `title` | String | Nome do painel | 🟢 |
| `pageLayoutId` | UUID | Referência ao layout que contém os widgets de gráficos | 🟢 |
| `position` | Number | Ordem de exibição no menu lateral | 🟢 |
| `createdBy` | JSON | Metadados do autor da criação | 🟢 |

### Configuração de Widget (JSON no PageLayout)
Os gráficos não são entidades isoladas no banco, mas sim widgets dentro do `properties` de um `PageLayout`.
- `type`: `bar-chart` | `line-chart` | `pie-chart`
- `sourceObject`: Nome do objeto alvo (ex: `opportunity`)
- `aggregateFunction`: `count` | `sum` | `avg`
- `xAxisField`: Campo para o eixo X (geralmente temporal ou categórico)
- `yAxisField`: Campo para o eixo Y (valor a ser agregado)

## 🔄 Fluxo de Geração de Gráfico

1. **Definição**: O usuário adiciona um widget de gráfico a um Dashboard (Front-end).
2. **Configuração**: Os parâmetros (filtros, eixos, métrica) são salvos no `PageLayout`.
3. **Requisição**: O widget dispara uma query GraphQL para `chartData`.
4. **Cálculo (Back-end)**:
   - O `ChartDataService` identifica o tipo de gráfico.
   - Aplica filtros de segurança e multilocação.
   - Executa a agregação no banco de dados.
   - Aplica ordenação e limite de resultados.
5. **Renderização**: O Front-end recebe o JSON de séries e categorias e desenha o gráfico.

## 🛠️ Tecnologias
- **NestJS / GraphQL**: Back-end API.
- **TypeORM**: Consultas analíticas básicas.
- **React**: Componentização dos widgets.
- **D3.js / Recharts**: Bibliotecas de visualização (inferidas pelo padrão do Twenty).
