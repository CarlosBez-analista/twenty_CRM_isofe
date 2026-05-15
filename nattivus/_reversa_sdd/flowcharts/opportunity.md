# Fluxogramas: Opportunity

## Fluxo de Funil (Pipeline)
Representação dos estágios sequenciais definidos nos metadados.

```mermaid
graph TD
    NEW[New] --> SCREENING[Screening]
    SCREENING --> MEETING[Meeting]
    MEETING --> PROPOSAL[Proposal]
    PROPOSAL --> CUSTOMER[Customer]
    
    style NEW fill:#f96,stroke:#333
    style CUSTOMER fill:#ff9,stroke:#333
```

## Lógica de Agregação do Kanban
Processo de renderização da visão de Kanban com cálculo de totais.

```mermaid
graph TD
    Start[Acessar Visão By Stage] --> Fetch[Buscar Oportunidades do Workspace]
    Fetch --> Group[Agrupar por campo: stage]
    Group --> Sum[Somar campo: amount]
    Sum --> Render[Renderizar Colunas com Totais]
    
    subgraph "Metadados Aplicados"
        direction LR
        M1[ViewType: KANBAN]
        M2[groupBy: stage]
        M3[aggregate: SUM amount]
    end
```
