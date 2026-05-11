# Requirements: Pessoa (Person)

> Identificador: `002-pessoa`
> Data: 2026-05-11
> Pasta da extração reversa: `_reversa_sdd/`
> Confidência: 🟢 CONFIRMADO, 🟡 INFERIDO, 🔴 LACUNA / DÚVIDA

## 1. Resumo executivo

O módulo de Pessoa gerencia os contatos individuais (leads, clientes, parceiros) dentro do CRM. Ele permite o armazenamento de dados pessoais como nome completo, e-mails, telefones, cargo e links sociais (LinkedIn, X). Cada pessoa pode estar vinculada a uma Empresa e atuar como ponto de contato em Oportunidades, além de ser alvo de Tarefas, Notas e Atividades da Linha do Tempo.

## 2. Contexto a partir do legado

| Fonte | Trecho relevante | Confidência |
|-------|------------------|-------------|
| `_reversa_sdd/person/legacy-mapping.md` | Mapeamento de arquivos do servidor e front para a entidade Person. | 🟢 |
| `packages/twenty-server/src/modules/person/standard-objects/person.workspace-entity.ts` | Definição de campos: emails, phones, jobTitle, linkedinLink, avatarFile, searchVector. | 🟢 |
| `packages/twenty-server/src/modules/contact-creation-manager/services/create-person.service.ts` | Lógica de criação com auto-posicionamento (`position`) e restauração de soft-delete. | 🟢 |

## 3. Personas e cenários de uso

| Persona | Objetivo | Cenário-chave |
|---------|----------|---------------|
| Membro do Workspace (Vendedor) | Cadastrar contatos | Criar uma nova pessoa a partir de um lead, capturando e-mail e LinkedIn. |
| Membro do Workspace (SDR) | Qualificar contatos | Vincular uma pessoa a uma empresa e definir seu cargo (`jobTitle`). |
| Gestor de Conta | Centralizar comunicação | Visualizar o histórico de mensagens e atividades vinculadas a uma pessoa específica. |

## 4. Regras de negócio novas ou alteradas

1. **RN-01:** Auto-posicionamento. Novas pessoas recebem automaticamente a última posição disponível na lista (`lastPosition + index`). 🟢
   - Origem no legado: `create-person.service.ts#getLastPersonPosition`
   - Tipo: confirmada
2. **RN-02:** Soft-Delete e Restauração. Pessoas excluídas logicamente podem ser restauradas, limpando o campo `deletedAt`. 🟢
   - Origem no legado: `create-person.service.ts#restorePeople`
   - Tipo: confirmada
3. **RN-03:** Unicidade de E-mail. (Inferida) O sistema deve evitar duplicidade de contatos baseada nos e-mails primários. 🟡
   - Origem no legado: Inferido de práticas de CRM.
   - Tipo: inferida

## 5. Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de aceite | Confidência |
|----|-----------|------------|--------------------|-------------|
| RF-01 | Gestão de Nome Completo | Must | Suportar primeiro nome e sobrenome de forma estruturada. | 🟢 |
| RF-02 | Múltiplos Canais de Contato | Must | Permitir múltiplos e-mails e telefones para uma mesma pessoa. | 🟢 |
| RF-03 | Vínculo com Empresa | Should | Permitir associar uma pessoa a uma organização (Company). | 🟢 |
| RF-04 | Gestão de Avatar | Could | Permitir upload de arquivo de imagem para o perfil do contato. | 🟢 |
| RF-05 | Busca por Atributos | Must | Permitir busca rápida por nome, e-mail ou telefone via vetor de busca. | 🟢 |

## 6. Requisitos Não Funcionais

| Tipo | Requisito | Evidência ou justificativa | Confidência |
|------|-----------|----------------------------|-------------|
| Desempenho | Busca Multicampo | Uso de `SEARCH_FIELDS_FOR_PERSON` com FULL_NAME, EMAILS e PHONES. | 🟢 |
| Segurança | Controle de Acesso | Bypass opcional de permissões em serviços internos de criação de contatos. | 🟢 |
| Portabilidade | Campos Deprecados | Transição de `avatarUrl` para `avatarFile` e `phone` para `phones`. | 🟢 |

## 7. Critérios de Aceitação

```gherkin
Cenário: Criação de pessoa com múltiplos e-mails
  Dado que estou na tela de criação de contato
  Quando eu insiro o nome "João Silva" e os e-mails "joao@exemplo.com" e "joao.trabalho@exemplo.com"
  Então o sistema deve salvar ambos os e-mails na estrutura de metadados da Pessoa

Cenário: Restauração de contato removido
  Dado que uma pessoa com ID "XYZ" foi excluída anteriormente
  Quando eu executo a ação de restaurar para o ID "XYZ"
  Então o campo deletedAt deve se tornar nulo
  E a pessoa deve voltar a ser visível no sistema
```

## 8. Prioridade MoSCoW

| Item | MoSCoW | Justificativa |
|------|--------|---------------|
| RF-01 | Must | Identificação básica do contato. |
| RF-02 | Must | Essencial para comunicação e desduplicação. |
| RF-05 | Must | Necessário para usabilidade em bases grandes. |
| RF-03 | Should | Importante para CRM B2B, mas permite operação isolada. |
| RF-04 | Could | Estético/UX, não bloqueia o fluxo de negócio. |

## 9. Esclarecimentos

> Nenhuma sessão de dúvidas registrada ainda. Rode `/reversa-clarify` quando houver `[DÚVIDA]` pendente.

## 10. Lacunas

- 🔴 [DÚVIDA] Como o sistema lida com a desduplicação se o mesmo e-mail for inserido em duas pessoas diferentes?
- 🔴 [DÚVIDA] O campo `position` é global por workspace ou filtrado por alguma visualização?

## 11. Histórico de alterações

| Data | Alteração | Autor |
|------|-----------|-------|
| 2026-05-11 | Versão inicial gerada por `/reversa-writer` | reversa-writer |
