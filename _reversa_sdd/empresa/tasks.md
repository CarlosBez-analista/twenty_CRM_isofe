# Empresa (Company), Tarefas de Implementação

> Foca em uma sequência de tarefas executáveis para reimplementar a unit a partir do legado, com rastreabilidade ao código original.

## Pré-requisitos
- [ ] O core de "Standard Objects" e definições de Object Metadata do Workspace deve estar instanciado e funcional.
- [ ] O modelo de `WorkspaceMember` deve estar criado para possibilitar o relacionamento `accountOwnerId`.
- [ ] Infraestrutura de PostgreSQL habilitada para busca com `tsvector` (para o `searchVector`).

## Tarefas

> Cada tarefa referencia o arquivo do legado de onde o comportamento foi extraído.

- [ ] T-01, Definir o Standard Object Metadata para `Company`
  - Origem no legado: Definições de Core Standard Objects do Twenty CRM.
  - Critério de pronto: O Object Metadata para a entidade `Company` está declarado, permitindo que a camada de persistência e GraphQL reconheçam os campos (`name`, `domainName`, `accountOwnerId`, etc).
  - Confiança: 🟢

- [ ] T-02, Implementar mecanismo de geração do `searchVector`
  - Origem no legado: `domain.md` e metadados de coluna `tsvector`.
  - Critério de pronto: Sempre que uma empresa for criada ou seu `name`/`domainName` for atualizado, o `searchVector` no banco de dados deve ser atualizado adequadamente, via Trigger SQL ou no código backend.
  - Confiança: 🟢

- [ ] T-03, Garantir tratamento do Soft-Delete (`deletedAt`)
  - Origem no legado: Comportamento global para "Soft-Delete", listado no `domain.md`.
  - Critério de pronto: O endpoint ou resolver genérico de `deleteCompany` apenas preenche o timestamp em `deletedAt`. Queries normais filtram registros onde `deletedAt IS NULL`.
  - Confiança: 🟢

- [ ] T-04, Tratar relacionamento `accountOwnerId`
  - Origem no legado: Schema de relações (`data-dictionary.md`).
  - Critério de pronto: A API impede a atribuição de uma empresa a um `accountOwnerId` que não exista ou que não pertença ao mesmo workspace ativo do contexto atual.
  - Confiança: 🟡

## Tarefas de Teste

- [ ] TT-01, Teste do happy path do fluxo principal de criação: Deve criar uma Company válida retornando o ID e as timestamps populadas.
- [ ] TT-02, Teste de validação: Deve retornar erro 4xx ou equivalente no GraphQL ao tentar criar Company sem o campo `name`.
- [ ] TT-03, Teste de deleção: Excluir a Company logicamente. A query subseqüente não deve retornar a Company excluída.
- [ ] TT-04, Teste do vetor de busca: Validar se a empresa recém-criada pode ser encontrada pesquisando por uma sub-string parcial do nome ou domínio.

## Ordem Sugerida
1. T-01 (Metadata definition), pois todas as APIs dependem disso para funcionar.
2. T-03 (Soft Delete) e T-04 (Account Owner), para alinhar as regras de persistência.
3. T-02 (SearchVector), podendo requerer acesso a DB native features.
4. TT-01 a TT-04 (Testes de integração).

## Lacunas Pendentes (🔴)
- **Desduplicação de Domain:** Necessidade de verificar com a área de produto ou no código-fonte original (controllers) se devemos bloquear a criação de duas empresas no mesmo workspace com o mesmo `domainName`.
