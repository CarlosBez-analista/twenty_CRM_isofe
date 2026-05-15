# Casos de Borda: Painéis e Gráficos (Dashboard)

Cenários complexos e tratamentos necessários para o sistema de Dashboards.

## ⚠️ Casos Identificados

### 1. Consultas sobre Grandes Volumes de Dados
- **Situação**: Um gráfico configurado para agregar milhões de registros sem filtros temporais.
- **Tratamento Esperado**: O sistema deve impor limites de `TIMEOUT` na query e sugerir a aplicação de filtros. 🟡 (Inferido como boa prática, sinais de `exceptions` no módulo de `chart-data`).

### 2. Mudança de Tipo de Campo no Eixo
- **Situação**: Um campo usado no eixo X de um gráfico muda de `TEXT` para `NUMBER` no metadado.
- **Tratamento Esperado**: O `ChartDataService` deve validar a compatibilidade do tipo antes da execução ou retornar um erro amigável ("Tipo de campo incompatível para este gráfico"). 🟢 (Confirmado pela presença de `exceptions` e filtros de metadados).

### 3. Duplicação de Dashboard com Objeto Customizado Deletado
- **Situação**: O usuário tenta duplicar um dashboard que contém um gráfico baseado em um objeto que foi removido do sistema.
- **Tratamento Esperado**: O processo de duplicação deve ignorar widgets órfãos ou marcar como "Configuração Inválida" em vez de quebrar a transação. 🔴 (LACUNA: Requer validação da resiliência do `DashboardDuplicationService`).

### 4. Zero Data em Gráficos Proporcionais
- **Situação**: Um gráfico de Pizza onde todos os valores retornados são zero.
- **Tratamento Esperado**: O front-end deve exibir um estado de "Sem dados para exibir" (Empty State) em vez de um gráfico vazio ou erro de divisão por zero. 🟢

### 5. Colisão de Cores em Categorias Dinâmicas
- **Situação**: Um gráfico de barras com 50 categorias diferentes.
- **Tratamento Esperado**: O sistema deve possuir uma paleta cíclica de cores ou agrupar categorias menores em um item "Outros" para manter a legibilidade. 🟡 (Inferido pela complexidade visual do front-end).
