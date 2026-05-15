# Pessoa (Person), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] O modelo de `Company` deve estar funcional para permitir o vínculo opcional (`companyId`).
- [ ] O sistema de metadados para `FullName`, `Emails`, `Phones` e `Links` deve estar implementado no core.
- [ ] Infraestrutura para upload de arquivos (`avatarFile`) deve estar configurada.

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir o Standard Object Metadata para `Person`
  - Origem no legado: `person.workspace-entity.ts`.
  - Critério de pronto: Metadados da entidade `Person` declarados, incluindo campos estruturados (`emails`, `phones`) e relacionamentos.
  - Confiança: 🟢

- [ ] T-02, Implementar Service de Criação (`createPeople`)
  - Origem no legado: `create-person.service.ts`.
  - Critério de pronto: Lógica de inserção em lote com cálculo automático de `position` implementada e funcional.
  - Confiança: 🟢

- [ ] T-03, Implementar Lógica de Restauração (`restorePeople`)
  - Origem no legado: `create-person.service.ts`.
  - Critério de pronto: Possibilidade de reativar contatos definindo `deletedAt` como nulo via API.
  - Confiança: 🟢

- [ ] T-04, Configurar Vetor de Busca (`searchVector`)
  - Origem no legado: `SEARCH_FIELDS_FOR_PERSON` em `person.workspace-entity.ts`.
  - Critério de pronto: Gatilhos de atualização do vetor de busca cobrindo nome, e-mails e telefones.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Teste de criação com metadados: Validar se campos de e-mail e telefone são persistidos corretamente como JSON estruturado.
- [ ] TT-02, Teste de auto-posicionamento: Criar 3 pessoas e verificar se a `position` segue a sequência 0, 1, 2.
- [ ] TT-03, Teste de vínculo: Criar uma pessoa associada a um `companyId` existente e validar o relacionamento.
- [ ] TT-04, Teste de busca: Realizar uma busca textual que retorne uma pessoa através de um dos seus e-mails secundários.

## Ordem Sugerida
1. T-01 (Metadata definition).
2. T-02 (Creation logic) e T-04 (Search vector).
3. T-03 (Restoration logic).
4. TT-01 a TT-04 (Testes).

## Lacunas Pendentes (🔴)
- **Normalização de Nomes:** Verificar se o utilitário `get-first-name-and-last-name-from-handle-and-display-name.util.ts` deve ser integrado obrigatoriamente no hook de criação ou se é opcional.
- **Migração de Avatar:** Decidir se o campo deprecado `avatarUrl` será mantido como read-only para compatibilidade ou removido totalmente.
