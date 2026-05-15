# ADR-0003: Migração de Webhooks para v2 como Entidade de Metadado

- **Status:** Aceito
- **Data:** Inferido do commit `bc7791871f` — `Introduce webhook v2 (#17456)`
- **Confiança:** 🟢 CONFIRMADO

## Contexto

Webhooks eram gerenciados como entidades do `core-modules` (banco core), acoplados à lógica legada do Zapier. Isso gerava:
- Dependência cruzada entre o sistema de core e o módulo de metadados
- Dificuldade em aplicar migrations e validações consistentes
- Impossibilidade de usar o padrão `FlatEntity` / `UniversalFlatEntity` para caching e workspace isolation

## Decisão

Migrar webhooks inteiramente para `metadata-modules`:
- Nova entidade em `engine/metadata-modules/webhook/entities/webhook.entity.ts`
- Novo resolver em `engine/metadata-modules/webhook/webhook.resolver.ts`
- Novo service em `engine/metadata-modules/webhook/webhook.service.ts` (224 linhas)
- DTOs `CreateWebhookInput` / `UpdateWebhookInput` / `WebhookDto`
- Suporte a `universalIdentifier` e `applicationId`
- `FlatWebhook` com cache dedicado (`WorkspaceFlatWebhookMapCacheService`)

## Alternativas Consideradas

1. **Manter na core e adicionar ponte**: Rejeitado — aumentava complexidade e não resolvia o problema de cache
2. **Webhook como Standard Object**: Rejeitado — webhooks são infraestrutura, não objetos de negócio do CRM

## Consequências

- **Positivas**: Webhooks agora participam do sistema de migrations de workspace, cache distribuído e validação unificada. Desacoplamento total do módulo Zapier legado.
- **Negativas**: Migration complexa (2 scripts: `addUniversalToWebhook` + `addUniversalIdentifierAndApplicationIdNotNull`). 83 arquivos alterados no commit.
- **Para o ERP**: O módulo ERP pode registrar webhooks via a API v2 para receber callbacks de status fiscal (SEFAZ/Focus NFe) sem depender do Zapier.
