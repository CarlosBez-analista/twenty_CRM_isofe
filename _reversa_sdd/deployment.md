# Infraestrutura e Deployment

## Ambiente de Containerização
O sistema suporta deploy via Docker, como evidenciado pela presença do repositório/pasta de configurações Docker.

```mermaid
graph TD
    subgraph Docker_Compose [Docker Compose Environment]
        A[Nginx Proxy / Gateway]
        B[Twenty Server Container]
        C[Twenty Frontend / Static Host]
        D[Worker Container]
        E[(PostgreSQL)]
        F[(Redis)]
        G[(ClickHouse)]
    end
    
    Internet -->|HTTPS| A
    A -->|API Request| B
    A -->|Serve Assets| C
    B --> E
    B --> F
    B --> G
    D --> E
    D --> F
    D --> G
```

## Considerações
- O `packages/twenty-docker/docker-compose.yml` orquestra a dependência entre os serviços.
- Variáveis de ambiente secretas (OAuth, Database URLs, chaves de API) devem ser fornecidas ao `twenty-server` e workers.
- Bancos de dados persistem estado em volumes dedicados.
> Confiança: 🟢 CONFIRMADO
