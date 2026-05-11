# ADR 0001: Implementação de Controle de Faturamento Medido via ClickHouse

**Data:** 2026-05-11 (Data retroativa extraída do histórico Git)
**Status:** Aceito

## Contexto
O sistema oferece execução de automações e operações em larga escala que consomem recursos de infraestrutura. Para fornecer um modelo de negócios viável, é necessário aplicar limites justos baseados no uso real (`metered credit cap`). A quantidade de eventos ou operações pode ser altíssima, o que tornaria o banco transacional principal (Postgres) um gargalo caso fosse utilizado para contabilização analítica e checagens frequentes de limites.

## Decisão
Foi decidido adicionar a verificação (`enforcement`) dos limites de uso atrelados a cobrança (`metered credit cap`) delegando o processamento das métricas pesadas de consumo para o banco de dados analítico **ClickHouse**. O ClickHouse armazenará eventos granulares de uso sem degradar a performance transacional do Postgres.

## Alternativas Consideradas
1. **Contadores atômicos no PostgreSQL:** Atualizar colunas nas tabelas de uso (`creditsUsed`) via Redis ou direto na tabela.
   *Problema:* Risco de contenção, overhead em tabelas transacionais, perda do histórico granular (que é útil para exibição de fatura e auditoria).
2. **Serviço externo de agregação (ex: Stripe Metered Billing direto):** Confiar toda agregação à API externa de cobrança.
   *Problema:* Dependência intensa e limites de rate-limit com o Stripe para verificações em real-time (`enforcement`).

## Consequências
- **Positivas:** Desempenho e escalabilidade garantidos para o processamento do volume alto de transações e logs gerados. Separação de obrigações entre banco de gravação primário e banco analítico (OLAP).
- **Negativas:** Maior complexidade arquitetural; os desenvolvedores precisam conhecer e lidar com dois bancos diferentes na stack local e em CI/CD, sincronizando dados e permissões entre eles (via pipelines ou workers asíncronos).

> Referência Git: `455022f652 Add ClickHouse-backed metered credit cap enforcement (#19586)`
