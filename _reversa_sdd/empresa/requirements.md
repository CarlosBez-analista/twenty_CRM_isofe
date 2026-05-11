# Requirements: Empresa (Company)

> Identificador: `001-empresa`
> Data: 2026-05-10
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Empresa gerencia contas B2B, organizações e clientes empresariais dentro do CRM. Ele permite o cadastro centralizado de dados como domínio, funcionários, receita recorrente, endereço e perfil de cliente ideal (ICP). Atua como a entidade central à qual pessoas, oportunidades, tarefas e notas são vinculadas.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/domain.md#Glossário` | Uma conta B2B, organização ou empresa gerenciada no CRM. | 🟢 |
| `_reversa_sdd/domain.md#Regras de Negócio Implícitas` | Atribuição Universal (Ownership) a um WorkspaceMember. | 🟡 |
| `_reversa_sdd/data-dictionary.md#Módulo: Company` | Estrutura de dados completa da empresa, incluindo links, ICP e métricas financeiras. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Membro do Workspace (Vendedor/SDR) | Gerenciar contas | Criar, editar e acompanhar o ciclo de vida de uma empresa prospectada. |
| Membro do Workspace (Gestor) | Analisar a carteira | Visualizar as empresas vinculadas aos membros da equipe para acompanhamento de pipeline. |

## 4. Regras de negócio implícitas

1. **RN-01:** Soft-Delete Global. A exclusão de uma empresa é lógica (via `deletedAt`), mantendo os dados para auditoria. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#Regras de Negócio Implícitas`
   - Tipo: confirmada
2. **RN-02:** Atribuição (Ownership). Toda empresa pode ser atribuída a um membro do workspace (`accountOwner`). 🟡
   - Origem no legado: `_reversa_sdd/domain.md#Regras de Negócio Implícitas`
   - Tipo: inferida
3. **RN-03:** Busca full-text. As empresas devem ser indexadas vetorialmente (`searchVector`) para permitir busca otimizada. 🟢
   - Origem no legado: `_reversa_sdd/domain.md#Regras de Negócio Implícitas`
   - Tipo: confirmada

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | CRUD de Empresa | Must | O sistema deve permitir criar, visualizar, editar e excluir (logicamente) uma empresa. | 🟢 |
| RF-02 | Associação de Contatos | Must | O sistema deve permitir vincular múltiplos contatos (Person) a uma empresa. | 🟢 |
| RF-03 | Atribuição de Dono | Must | O sistema deve permitir definir um membro do workspace como dono (`accountOwner`) da empresa. | 🟢 |
| RF-04 | Rastreio de ICP | Should | O sistema deve permitir marcar se a empresa atende ao perfil de cliente ideal (`idealCustomerProfile`). | 🟢 |
| RF-05 | Gestão de Links e Redes | Should | O sistema deve suportar armazenamento estruturado para domínio, LinkedIn e X (Twitter). | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Busca Textual | Uso de `searchVector` / `TSVECTOR` no Postgres indica necessidade de busca rápida. | 🟢 |
| Escalabilidade | Campos flexíveis | Uso de campos `jsonb` (LINKS, ADDRESS, CURRENCY) para permitir estruturação flexível de dados. | 🟢 |
| Segurança | Exclusão Lógica | Uso de `deletedAt` impede a perda acidental de histórico de contas B2B. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Criação de uma nova empresa B2B
  Dado que sou um membro autenticado do workspace
  Quando eu crio uma empresa com nome, domínio e marco como ICP
  Então a empresa deve ser salva e o campo idealCustomerProfile deve estar verdadeiro

Cenário: Soft-delete de uma empresa
  Dado que existe uma empresa registrada no meu workspace
  Quando eu solicito a exclusão da empresa
  Então o registro deve receber uma data em deletedAt
  E a empresa não deve mais aparecer nas listagens principais
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Operação básica e essencial para um CRM B2B. |
| RF-02 | Must | Relacionamento crítico para a operação do funil de vendas. |
| RF-03 | Must | Necessário para gestão de carteira de clientes e métricas individuais. |
| RF-04 | Should | Relevante para qualificação, mas não impede a operação básica. |
| RF-05 | Should | Enriquecimento de dados padrão em CRMs modernos. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] Existe alguma regra de negócio que impeça uma empresa de ser excluída se ela tiver oportunidades em andamento (abertas)?
- 🔴 [DÚVIDA] O campo `position` (ordem de exibição) é atualizado automaticamente ao arrastar itens na interface ou apenas sequencial?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-10 | Versão inicial gerada por `/reversa-requirements` | reversa-writer |
