# Fluxograma: CreateCompanyAndPersonService.createCompaniesAndPeople

```mermaid
procedure-flow
title: Fluxo de Ingestão de Contatos Profissionais
start
:Receber lista de contatos (handle/email);
:Filtrar membros do próprio workspace;
:Remover duplicatas da lista de entrada;
:Buscar pessoas existentes no DB por e-mail;
:Categorizar: Create, Restore ou Skip;
if (Contatos com e-mail de trabalho?) then (Sim)
  :Agrupar domínios únicos;
  :Chamar CreateCompanyService;
  :Obter Mapa de Companies [domain -> id];
endif
fork
  :Format People to Create;
  :Extrair nomes do handle;
  :Vincular CompanyId do mapa;
  :Gerar UUIDs;
fork again
  :Format People to Restore;
  :Vincular CompanyId (se domínio mudou);
end fork
:createPersonService.createPeople;
:createPersonService.restorePeople;
:Retornar lista consolidada;
stop
```
