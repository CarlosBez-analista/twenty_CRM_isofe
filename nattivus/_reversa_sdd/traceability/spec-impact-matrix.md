# Spec Impact Matrix

Esta matriz demonstra qual módulo/componente do backend ou do domínio gera impacto em outro em caso de alteração.

| Componente Modificado | Impactos Diretos | Motivo do Impacto | Confiança |
|-----------------------|------------------|-------------------|-----------|
| **Auth / RBAC** | Todos os módulos | Mudanças nas roles afetam a visibilidade em `Company`, `Person`, etc. | 🟢 CONFIRMADO |
| **Workspace Member** | Atribuições (Owner) | A remoção de um membro afeta tarefas atribuídas e oportunidades. | 🟢 CONFIRMADO |
| **Standard Objects** | GraphQL API, Webhooks | Modificar schemas de objetos padrão (ex: `Task`, `Opportunity`) afeta diretamente a API exportada. | 🟢 CONFIRMADO |
| **Connected Account** | Sync (Email/Calendar) | Tokens OAuth revogados ou expirados quebram o workflow assíncrono. | 🟢 CONFIRMADO |
| **Workflow Engine** | BullMQ / Redis | Alterar as versões de fluxo afeta o agendamento de eventos e a resiliência da fila. | 🟢 CONFIRMADO |
