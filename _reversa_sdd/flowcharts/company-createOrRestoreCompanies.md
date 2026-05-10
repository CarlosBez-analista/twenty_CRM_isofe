# Fluxograma: CreateCompanyService.createOrRestoreCompanies

```mermaid
procedure-flow
title: Fluxo de Criação ou Restauração de Empresas
start
:Receber lista de empresas (domainName);
:Obter authContext do Workspace;
:Executar em contexto de Workspace;
if (Lista vazia?) then (Sim)
  :Retornar {};
  stop
endif
:Normalizar URLs (remover trailing slashes);
:Remover duplicatas por domainName;
:Consultar repositório (incluindo deletados);
:Mapear empresas existentes;
:Filtrar novas vs para restaurar;
if (Nada novo e nada para restaurar?) then (Sim)
  :Retornar IDs existentes;
  stop
endif
:Obter maior 'position' atual;
fork
  :Preparar dados para novas;
  :getCompanyInfoFromDomainName (Axios);
  :computeDisplayName do criador;
  :Salvar no repositório;
fork again
  :Restaurar deletadas (updateMany);
end fork
:Consolidar mapa final [domainName -> id];
:Retornar mapa;
stop
```
