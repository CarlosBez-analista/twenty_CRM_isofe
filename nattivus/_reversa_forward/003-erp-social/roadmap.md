# Roadmap: ERP/CRM Social V1 (ISOFÉ)

> Identificador: `003-erp-social`
> Data: `2026-05-15`
> Origem: `_reversa_sdd/evolution/evolution_roadmap.md` (FASE 2)

## 1. Resumo da abordagem

Este roadmap define as entregas para a Fase 2 da Evolução NattivusECO.
O objetivo é criar o produto funcional para institutos sociais com fluxo: Beneficiário → Atendimento → Indicadores.

## 2. Entregas (Extraídas da Fase 2)

### Cadastros mestres ERP Social
- S2-01 | Extensões em Person: personType, cpf (AES-256), consentStatus, birthDate
- S2-02 | Family: CRUD + vulnerabilityScore
- S2-03 | Programa: CRUD por pilar
- S2-04 | CatalogoDeServicos: CRUD + elegibilidade + sensibilidade LGPD
- S2-05 | ProductCatalog (social): tipos físico/digital/social/institucional
- S2-06 | InventoryItem: lote, validade, parceiro doador
- S2-07 | MovimentacaoDeEstoque (extensão social): campos lote, validade, triggered_by_crm_attendance_id

### Doações
- S2-08 | DonationRecord: CRUD + tipos (produto, dinheiro, hora voluntária)
- S2-09 | Workflow: RegistroDeAtendimento por voluntário → DonationRecord (HORA_VOLUNTARIA)

### CRM Social: Agendamentos e Atendimentos
- S2-10 | AgendamentoDeServico: CRUD + QR code + check-in
- S2-11 | RegistroDeAtendimento: CRUD + privacidade + exigeRevisao
- S2-12 | Workflow: RegistroDeAtendimento com produto → MovimentacaoDeEstoque (SAIDA)
- S2-13 | CaseRecord: CRUD + tipo + status + atribuição
- S2-14 | DocumentChecklist: CRUD + sensibilidade + armazenamento seguro
- S2-15 | VolunteerProfile: CRUD + área profissional + antecedentes

### Indicadores de Impacto
- S2-16 | ImpactIndicator: CRUD + tipos + anonimização
- S2-17 | Query ClickHouse: SROI por programa e período
- S2-18 | Dashboard widgets: SROI, atendimentos por pilar, vulnerabilidade
- S2-19 | Relatório PDF anonimizado para financiadores

### RBAC Social
- S2-20 | Papéis: COORDENADOR_PROGRAMA, VOLUNTARIO_TECNICO, DPO, FINANCIADOR
- S2-21 | Filtro automático por program_id (coordenador)
- S2-22 | Filtro automático por pillar (voluntário técnico)
- S2-23 | Proteção de menores: middleware birthDate < 18
- S2-24 | Testes de acesso cruzado entre voluntários de pilares diferentes

### LGPD
- S2-25 | Fluxo de coleta e renovação de consentimento LGPD
- S2-26 | Log de auditoria de mudança de consentStatus na Timeline
- S2-27 | Endpoint de exportação de dados do titular (portabilidade LGPD)
- S2-28 | "Hard-delete LGPD": exclusão real de dados sensíveis após soft-delete
