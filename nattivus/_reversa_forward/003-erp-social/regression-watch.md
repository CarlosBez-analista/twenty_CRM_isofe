# Watch de Regressão (Regression Watch)

> Identificador: `003-erp-social`

| ID | Origem (arquivo, seção) | Regra esperada após mudança | Tipo de verificação | Sinal de violação |
|----|-------------------------|-----------------------------|---------------------|-------------------|
| W001 | `001-base-social.sql` | O campo `cpf` deve estar criptografado em repouso. | presença | CPF gravado em plain-text no banco. |
| W002 | `001-base-social.sql` | O campo `consent_status` deve influenciar relatórios. | redação | Relatórios processando pessoas com `consent_status = PENDING`. |
| W003 | `003-erp-social`, Auth | O RBAC do legado é estendido por interceptadores (guards) que bloqueiam acesso a pilares cruzados. | presença | Usuário visualiza dados de um programa social no qual não atua. |
| W004 | `003-erp-social`, LGPD | A rotina de Hard Delete purga definitivamente registros da entidade `person` se o `consent_status` foi revogado. | presença | `person` revogada continua existindo no banco de dados. |

## Histórico de re-extrações

### Re-extração 2026-05-15 16:03

| ID | Veredito | Observação |
|----|----------|------------|
| W001 | 🟢 verde | regra confirmada no esquema SQL atualizado |
| W002 | 🟢 verde | regra de consentimento mapeada nos relatórios |
| W003 | 🟡 amarelo | guard verificado, mas requer teste end-to-end de pilar cruzado (aguarda julgamento) |
| W004 | 🟡 amarelo | rotina hard-delete mapeada, pendente validação do purgo efetivo (aguarda julgamento) |

## Arquivadas
*(vazio)*
