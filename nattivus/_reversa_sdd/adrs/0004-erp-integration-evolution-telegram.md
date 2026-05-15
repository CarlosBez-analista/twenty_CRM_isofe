# ADR-0004: Integração ERP via Workflow HTTP_REQUEST (Evolution GO + Telegram)

- **Status:** Aceito
- **Data:** 2026-05-13
- **Confiança:** 🟢 CONFIRMADO (Decisão de Projeto)

## Contexto

O fork Twenty CRM+ERP necessita de integrações de mensageria para:
- Notificações de emissão fiscal ao cliente (WhatsApp via Evolution GO)
- Alertas internos para equipes (Telegram)
- Confirmação de pedidos e status de entrega

A plataforma Twenty possui um motor de Workflow nativo com suporte a ações `HTTP_REQUEST`, que permite chamadas REST arbitrárias com headers e payloads customizados.

## Decisão

Utilizar exclusivamente a ação `HTTP_REQUEST` do motor de Workflows do Twenty para conectar com:
1. **Evolution GO** (API WhatsApp Business) — envio de mensagens, templates e mídia
2. **Telegram Bot API** — envio de alertas e comandos para grupos/canais

**Não utilizar** o pacote `twenty-zapier` nem qualquer integração Zapier.

## Alternativas Consideradas

1. **Zapier (legado)**: Rejeitado — custo recorrente, dependência externa, latência adicional, código legado no monorepo
2. **Custom NestJS modules com SDK**: Rejeitado — viola o princípio de simplicidade; o `HTTP_REQUEST` já resolve o caso de uso sem código adicional
3. **n8n como orquestrador externo**: Considerado para cenários avançados, mas adiado — o workflow nativo é suficiente para MVP

## Consequências

- **Positivas**: Zero dependência de terceiros pagos. Configuração visual no editor de workflows. Flag `HTTP_REQUEST_TOOL` já controla permissões. Auditoria nativa via `WorkflowRun`.
- **Negativas**: Sem retry automático sofisticado (limitado ao que o WorkflowRunner oferece). Sem templates de mensagem pré-prontos — devem ser definidos como payloads JSON no step do workflow.
- **Flag de Permissão**: Quem configura os workflows de integração precisa da flag `HTTP_REQUEST_TOOL` + `WORKFLOWS`.
