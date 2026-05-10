# Análise Técnica do Código — Legado

## Visão Geral dos Módulos

Esta seção detalha a análise profunda dos módulos do sistema legado, extraída via engenharia reversa.

---

## Módulo: Company
**Status:** 🟢 ANALISADO
**Complexidade:** Média
**Responsabilidade:** Gestão de entidades organizacionais (Empresas/Contas).

### Arquitetura e Fluxo de Controle
O módulo `company` no backend é definido como um `standard-object` (Workspace Entity), o que indica que ele segue a arquitetura de persistência dinâmica do Twenty CRM. A lógica de negócio específica para criação está centralizada no `contact-creation-manager`.

No frontend, o módulo é representado por tipos TypeScript que espelham a estrutura do GraphQL gerada pelo backend.

### Algoritmos e Lógicas Principais
1. **Criação e Restauração Automatizada:** Implementada em `CreateCompanyService.createOrRestoreCompanies`. O algoritmo verifica a existência da empresa pelo `domainName` (normalizado), restaurando registros deletados (soft-delete) ou criando novos.
2. **Enriquecimento de Dados Externos:** O sistema tenta buscar informações como `name` e `city` de uma API externa (`TWENTY_COMPANIES_BASE_URL`) baseando-se no domínio.
3. **Ordenação Dinâmica:** Utiliza um campo `position` para controle de ordenação manual ou de criação na interface.

### Estruturas de Dados
A entidade central é a `CompanyWorkspaceEntity`, que utiliza tipos complexos compartilhados (`twenty-shared`):
- **Address:** Estrutura completa de logradouro, cidade, país e geolocalização.
- **Links:** Estrutura para URLs com suporte a labels (Domain, LinkedIn, X).
- **Currency:** Suporte a valores monetários em micros.
- **Actor:** Rastreabilidade de quem criou/editou o registro.

### Metadados e Configurações
- **Search Vector:** Campo `searchVector` utilizado para busca textual performática no PostgreSQL.
- **Campos de Busca:** `name` (TEXT) e `domainName` (LINKS) são os campos indexados para busca rápida.

---

## Módulo: Person
**Status:** 🟢 ANALISADO
**Complexidade:** Média
**Responsabilidade:** Gestão de contatos e indivíduos.

### Arquitetura e Fluxo de Controle
Assim como o módulo de empresas, `person` é um `standard-object`. Ele serve como o nó central para interações humanas no CRM. A lógica de ingestão está fortemente acoplada ao `contact-creation-manager`, que lida com a descoberta automática de empresas baseada em domínios de e-mail.

### Algoritmos e Lógicas Principais
1. **Deduplicação por E-mail:** O sistema utiliza o campo `emails` (especificamente o `primaryEmail`) para identificar duplicatas antes da criação ou restauração.
2. **Auto-vínculo de Empresa:** Através da lógica em `CreateCompanyAndPersonService`, o sistema identifica se um contato possui e-mail profissional e, caso positivo, extrai o domínio para vincular (ou criar) a respectiva `Company`.
3. **Parsing de Nome:** Algoritmo heurístico que tenta separar nome e sobrenome a partir do "handle" (e-mail) ou do nome de exibição fornecido por provedores externos (Google, Microsoft).

### Estruturas de Dados
A entidade `PersonWorkspaceEntity` utiliza:
- **FullName:** Estrutura para `firstName` e `lastName`.
- **Emails:** Suporte a e-mail primário e lista de e-mails adicionais.
- **Phones:** Suporte a múltiplos números de telefone (substituindo o campo `phone` legado).
- **Avatar:** Integrado ao sistema de arquivos do Twenty (`FileOutput`).

### Metadados e Configurações
- **Campos de Busca:** `name` (FULL_NAME), `emails` (EMAILS), `phones` (PHONES) e `jobTitle` (TEXT) são indexados para o `searchVector`.
- **Soft-Delete:** Suporte total a restauração de registros deletados.

---

## Módulo: Opportunity
**Status:** 🟢 ANALISADO
**Complexidade:** Baixa
**Responsabilidade:** Gestão de oportunidades de negócio e pipeline de vendas.

### Arquitetura e Fluxo de Controle
O módulo `opportunity` é implementado como um `standard-object`. Ele não possui serviços ou resolvers dedicados na camada de módulos do servidor, utilizando a infraestrutura genérica do `twenty-orm` e o `metadata-engine` para operações de CRUD e visualização.

A interface de usuário utiliza visualizações (Views) baseadas em metadados, com destaque para a visão de Kanban que agrupa registros por estágio.

### Algoritmos e Lógicas Principais
1. **Agregação Financeira:** O sistema realiza automaticamente a soma (`SUM`) do campo `amount` nas colunas do Kanban, permitindo a visualização do valor total do pipeline por estágio.
2. **Ordenação por Estágio:** Os estágios (`NEW`, `SCREENING`, `MEETING`, `PROPOSAL`, `CUSTOMER`) possuem posições fixas definidas nos metadados, garantindo a sequência lógica do funil de vendas.
3. **Indexação de Busca:** Utiliza um vetor de busca textual (`searchVector`) focado no campo `name`.

### Estruturas de Dados
A entidade central é a `OpportunityWorkspaceEntity`:
- **Currency:** O campo `amount` utiliza metadados de moeda (valor em micros + código da moeda).
- **Enums/Select:** O campo `stage` é um dropdown com opções coloridas e posicionadas.
- **Relacionamentos:** Vínculos fortes com `Company` (Empresa), `Person` (Ponto de Contato) e `WorkspaceMember` (Dono da Oportunidade).

### Metadados e Configurações
- **Campo Depreciado:** O campo `probability` está presente na entidade mas marcado como `@deprecated`.
- **Configuração de Estágio:** Cada estágio possui um ID de metadados fixo, rótulo internacionalizado e cor específica (ex: `NEW` é `red`, `CUSTOMER` é `yellow`).

---

## Módulo: Task
**Status:** 🟢 ANALISADO
**Complexidade:** Média
**Responsabilidade:** Gestão de tarefas, lembretes e acompanhamentos.

### Arquitetura e Fluxo de Controle
O módulo `task` segue o padrão de `standard-object` do Twenty CRM. Ele é projetado para ser um módulo transversal, conectando-se a quase todos os outros objetos principais (Company, Person, Opportunity) através de uma entidade de ligação polimórfica chamada `TaskTarget`.

A lógica de manipulação de dados utiliza `query-hooks` para garantir a integridade em operações de deleção e restauração em massa.

### Algoritmos e Lógicas Principais
1. **Relacionamento Polimórfico (Targeting):** Diferente de um vínculo direto, o sistema utiliza `TaskTarget` para permitir que uma única tarefa seja associada a múltiplos objetos de diferentes tipos simultaneamente.
2. **Máquina de Estados Simples:** O campo `status` utiliza um enum (`TODO`, `IN_PROGRESS`, `DONE`) para controlar o ciclo de vida da tarefa.
3. **Gerenciamento de Posição:** Utiliza o campo `position` para permitir a reordenação manual de tarefas em listas e quadros Kanban.
4. **Indexação de Busca:** O `searchVector` é gerado a partir do `title` (peso alto) e do `bodyV2` (conteúdo rico).

### Estruturas de Dados
A entidade central é a `TaskWorkspaceEntity`:
- **Rich Text:** O campo `bodyV2` armazena o conteúdo da tarefa em formato estruturado (RichTextMetadata).
- **DateTime:** O campo `dueAt` armazena a data de vencimento.
- **Relacionamento com Usuário:** Vincula-se a `WorkspaceMember` através do campo `assignee`.
- **Anexos:** Relacionamento direto com o módulo de `attachment`.

### Metadados e Configurações
- **Visões Padrão:** O sistema gera automaticamente visões de "Todas as Tarefas", "Por Status" (Kanban) e "Atribuídas a Mim".
- **Configuração de Status:** Cada status possui uma cor associada (`TODO`: sky, `IN_PROGRESS`: purple, `DONE`: green).
- **Segurança:** Utiliza metadados de `Actor` para rastrear criação e última modificação.

---
