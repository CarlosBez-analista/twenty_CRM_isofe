# ADR 0002: Otimização de Resolução de Papéis (Roles) com DataLoader

**Data:** 2026-05-11 (Data retroativa extraída do histórico Git)
**Status:** Aceito

## Contexto
O GraphQL e o modelo de APIs internas permitiam requisições profundas no grafo de relacionamentos do CRM. Durante a verificação de segurança, a extração dos perfis de acesso (`roles`) e verificação das permissões (como em verificações de `api-key`) estavam criando problemas graves de **N+1 queries**, o que sobrecarregava o banco de dados e degradava o tempo de resposta geral.

## Decisão
A equipe implementou e adotou o padrão `DataLoader` (ou similar adaptado para o NestJS) no fluxo de resolução de perfis de usuário (`role resolution`). Em vez de o sistema emitir uma nova consulta de banco para cada nó no grafo tentando descobrir a permissão de quem o solicitou, as requisições de resolução são atrasadas por milissegundos e agrupadas em lote (`batching`).

## Alternativas Consideradas
1. **Ignorar as restrições granulares na camada do objeto (GraphQL) e fazer só na raiz:**
   *Problema:* Vulnerabilidade. Em APIs GraphQL, é imperativo validar o acesso não só no Root Query, mas ao navegar por nós filhos sensíveis.
2. **Caches distribuídos na borda (Redis):** Fazer a resolução apenas contra cache.
   *Problema:* O N+1 continua se existirem cache misses altos; `DataLoader` resolve na raiz da requisição por per-request memory cache.

## Consequências
- **Positivas:** Drástica redução no volume de consultas desnecessárias ao banco de dados; menor tempo de resposta da API nas requisições que envolvem listas grandes.
- **Negativas:** Menos clareza no debug para quem não está acostumado com os resolvers batched (promises empilhadas no event loop), adicionando uma pequena complexidade à curva de aprendizado do backend.

> Referência Git: `d583984bf0 fix(api-key): batch role resolution with DataLoader to fix N+1 (#19590)`
