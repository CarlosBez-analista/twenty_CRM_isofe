# Impacto no Legado (Legacy Impact)

> Identificador: `003-erp-social`
> Data: `2026-05-15`

| Arquivo afetado | Componente | Tipo | Severidade | Justificativa |
|-----------------|------------|------|------------|---------------|
| `001-base-social.sql` | Database | `regra-alterada` | HIGH | Extensão da tabela genérica `person` com campos sociais e encriptação AES-256 no CPF. |
| `001-base-social.sql` | Database | `componente-novo` | LOW | Criação das tabelas auxiliares `family`, `program`, `service_catalog`. |
| `002-inventory.sql` | Database | `componente-novo` | LOW | Criação das tabelas de gestão de estoque social e doações. |
| `003-crm-social.sql` | Database | `componente-novo` | LOW | Criação das tabelas de CRM social (agendamentos, atendimentos, checklist). |
| `004-indicators.sql` | Database | `componente-novo` | LOW | Criação da tabela de métricas de impacto e anonimização. |
| `*.service.ts` (14 arquivos) | Core ERP Social | `componente-novo` | LOW | Implementação dos controladores e lógicas de negócio dos módulos sociais. |
| `rbac-social.spec.ts` | Auth/RBAC | `componente-novo` | LOW | Specs para validar acesso cruzado de voluntários. |
| `attendance-to-stock.ts`, etc | Integração | `componente-novo` | LOW | Workflows que amarram o atendimento com estoque e doações. |
| `social-rbac.guard.ts`, `minors-protection.middleware.ts` | Auth/RBAC | `regra-nova` | HIGH | Implementação dos guards e middlewares rígidos para acesso social cruzado e LGPD de menores. |
| `lgpd-hard-delete.job.ts`, `lgpd-audit.service.ts` | LGPD | `regra-nova` | HIGH | Rotinas de log de consentimento e hard delete para conformidade LGPD da entidade Person. |

## Diff Conceitual
A base de dados original de pessoas do CRM foi mantida, mas agora estendida com os campos específicos de assistência social (`cpf`, `birth_date`, `person_type`, `consent_status`). Foram anexadas as árvores relacionais inteiras de famílias, doações e serviços prestados sem quebrar a integridade do modelo existente. Todas as lógicas do núcleo social foram adicionadas em serviços independentes no `nattivus-social`. Adicionamos forte integração cross-module (Atendimento -> Estoque/Doação) e as travas de segurança e LGPD foram completamente implementadas (hard-delete, auditoria de consentimento, proteção de menores).

## Preservadas
- Relacionamento original de `Person` e suas sub-entidades (emails, fones).
- Integridade do UUID original do TwentyCRM.

## Modificadas
- Esquema de `person` agora possui dependência de checagem para LGPD (`consent_status`) em rotinas de consumo downstream, e é submetido à rotina de Hard Delete.
- O RBAC agora intercepta chamadas baseadas no pilar social.
