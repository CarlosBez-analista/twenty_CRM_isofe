# Requisitos: Painéis e Gráficos (Dashboard)

O módulo de Dashboard permite a visualização analítica de dados do CRM através de gráficos personalizáveis e painéis organizados, facilitando a tomada de decisão baseada em dados.

## 🎯 Escopo

### Must Have
- **Gestão de Painéis**: Criar, editar, renomear e excluir painéis (dashboards). 🟢
- **Visualização de Gráficos**: Renderizar diferentes tipos de gráficos: Barras (Bar), Linhas (Line), Pizza (Pie) e Medidores (Gauge). 🟢
- **Agregação de Dados**: Calcular métricas de agregação (Soma, Média, Contagem) sobre os registros do CRM. 🟢
- **Filtros Temporais e de Campo**: Filtrar dados exibidos nos gráficos por períodos ou valores específicos. 🟢

### Should Have
- **Duplicação de Dashboard**: Permitir clonar um painel existente com todas as suas configurações de gráficos. 🟢
- **Posicionamento Flexível**: Organizar a ordem dos painéis e dos widgets dentro dos painéis. 🟢
- **Integração com Metadados**: Suporte automático para novos campos e objetos customizados nos eixos dos gráficos. 🟢

### Could Have
- **Exportação de Dados**: Baixar os dados brutos ou a imagem do gráfico. 🟡
- **Compartilhamento**: Definir permissões de visualização por equipe ou membro. 🟡

## 🛠️ Requisitos Não Funcionais

- **Performance de Consulta**: Consultas analíticas devem ser otimizadas para evitar lentidão no banco de dados operacional (uso de índices e caches de metadados). 🟡
- **Responsividade**: Os gráficos devem se ajustar ao tamanho da tela e aos diferentes layouts de página. 🟢
- **Sincronização de Layout**: Mudanças no dashboard devem ser refletidas no `pageLayout` correspondente de forma atômica. 🟢

## ✅ Critérios de Aceitação

### Cenário 1: Duplicação de Dashboard
**Dado** que existe um Dashboard "Vendas Q1" com 3 gráficos
**Quando** o usuário solicita a duplicação
**Então** um novo Dashboard deve ser criado com o título "Copy of Vendas Q1", possuindo seu próprio `pageLayoutId` e clones idênticos dos gráficos originais. 🟢

### Cenário 2: Cálculo de Gráfico de Barras
**Dado** um gráfico configurado para contar "Oportunidades por Estágio"
**Quando** o front-end solicita os dados via GraphQL
**Então** o back-end deve retornar um array de objetos contendo o rótulo (Estágio) e o valor (Quantidade), respeitando os filtros globais do dashboard. 🟢

## 📊 MoSCoW

- **Must**: CRUD de Dashboards; Gráficos de Barra/Linha/Pizza; Agregações básicas; Integração com `pageLayout`.
- **Should**: Duplicação de Dashboards; Sincronização automática de layout; Suporte a objetos customizados.
- **Could**: Gráficos de Gauge (Medidores); Filtros avançados por múltiplos campos.
- **Won't**: Edição direta de SQL pelo usuário (segurança); Dashboards públicos sem autenticação.
