# Roadmap: Módulos Funcionais de CRM

> Identificador: `002-modulos-crm`
> Data: `2026-05-14`

## 1. Resumo da abordagem

O Marco 002 inicia a construção dos primeiros módulos funcionais (Company, Person e Opportunity) sobre a fundação NattivusECO. O objetivo é estabelecer o padrão de desenvolvimento de módulos de negócios como plug-ins independentes usando o pacote `@nattivus/sdk`. 
Este marco introduzirá entidades estendendo a `BaseEntity`, migrações locais aos módulos, controladores REST/GraphQL, e o relacionamento dinâmico entre módulos (ex: Person referenciando Company).

## 2. Decisões técnicas pendentes

| ID | Decisão | Opções | Status |
|----|---------|--------|--------|
| D-01 | Referência entre módulos independentes (FKs) | 1. Foreign Keys virtuais sem integridade referencial dura (permite módulos independentes).<br>2. Definir dependência estrita (`dependsOn`) no manifesto e usar FKs físicas. | 🔴 LACUNA (Em Análise) |
| D-02 | Exposição de API (REST vs GraphQL) | 1. Implementar apenas REST inicialmente.<br>2. Implementar apenas GraphQL (semelhante ao legado).<br>3. Abordagem híbrida (REST para integrações rápidas, GraphQL para UI). | 🔴 LACUNA (Em Análise) |

## 3. Escopo de Módulos

### Módulo: Company
- Entidade `Company` com campos baseados no `standard-objects/company.workspace-entity.ts` legado.
- Controlador com utilitários extraídos de `extract-domain-from-link` e `get-company-name-from-domain-name`.

### Módulo: Person
- Entidade `Person` com parsing inteligente de Display Name / First Name / Last Name.
- Controle de vínculo com o módulo `Company`.

### Módulo: Opportunity
- Entidade base para a gestão de pipeline (Deals).
- Definição das fases do funil e associação com `Person`/`Company`.

## 4. CI/CD e UI
- Pipeline de validação via Github Actions para o monorepo Nx.
- Design tokens em `nattivus-ui` expostos como variáveis CSS dinâmicas injetáveis via frontend.
