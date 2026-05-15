# Nattivus CRM+ERP

Este é o repositório principal do **Nattivus**, a plataforma dual-perfil (Empresarial e Social/Educacional) construída sobre a engine legada do Twenty CRM.

## Estrutura do Projeto

Este repositório é completamente autossuficiente e carrega consigo o **Framework Reversa** para guiar a evolução arquitetural de maneira segura:

- `packages/` — Código-fonte principal (monorepo Nx). Aqui vivem os pacotes estendidos como `nattivus-social`.
- `_reversa_sdd/` — Base de conhecimento fundacional extraída do legado (Twenty). Contém todo o mapeamento arquitetural, glossário, C4, e o design do novo produto (`evolution/`).
- `_reversa_forward/` — Histórico de execução de novas features (e.g., `003-erp-social`), contendo decisões técnicas, impacto no legado e travas de segurança (regression watch).
- `.reversa/` — Cérebro e estado dos agentes locais de IA que ajudam a orquestrar e validar o código.

## Documentação Chave

- [Handoff de Evolução](./_reversa_sdd/evolution/handoff.md) — Leia primeiro antes de alterar arquitetura.
- [Impacto no Legado](./_reversa_forward/003-erp-social/legacy-impact.md) — Exemplo da implementação do ERP Social.

## Como Contribuir

Utilize os comandos de IA para garantir que qualquer expansão na plataforma continue sendo rigorosamente mapeada através do Framework Reversa.
