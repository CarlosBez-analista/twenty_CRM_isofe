# Fluxos de Controle - Módulo: twenty-erp

> Documento gerado pelo Archaeologist do Reversa.

## Emissão Fiscal (Workflow Action)

Este fluxo representa a lógica executada pela `EmissorFiscalWorkflowAction` dentro do motor de workflow quando um evento de emissão fiscal é disparado.

```mermaid
graph TD
    A[Início: Trigger Emissão Fiscal] --> B[Obter contexto do Workflow]
    B --> C{Contexto contém Pedido?}
    C -- Não --> D[Lançar Erro: Pedido ausente]
    C -- Sim --> E[Extrair dados do Pedido]
    E --> F[Montar payload da NF-e]
    F --> G[Chamar FocusNfeHttpService.emitirNfe]
    
    subgraph HTTP Interceptor
        G --> H[Log: Iniciando chamada API]
        H --> I[Executar requisição mock/API]
        I -- Sucesso --> J[Log: Sucesso + Latência]
        I -- Erro --> K[Log: Erro + Latência]
    end
    
    J --> L[Retornar resposta mock HTTP 202]
    K --> M[Propagar erro para Workflow]
    L --> N[Fim: Ação concluída com sucesso]
```
