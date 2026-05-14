# Dívida Técnica do Spike 001-spike-tecnico-erp

> **Criado em:** 2026-05-14
> **Motivo:** registrar artefatos que foram implementados durante o spike **antes** das decisões arquiteturais formais (ADR-0005 e ADR-0006). Esses artefatos ficam em código mas precisam ser refatorados antes da feature `00N-fiscal-emissor`.

## Contexto

O spike implementou integração direta com Focus NF-e (T007, T008, T009) sem que existisse ADR formalizando essa escolha. A decisão real só foi tomada em 2026-05-14 e segue caminho diferente: **camada multi-provedor via Adapter Pattern** (ADR-0005), com fiscal entrando no roadmap somente depois das features sociais ISOFÉ e empresariais (ADR-0006).

Os arquivos abaixo violam ADR-0005 porque acoplam o ERP a um provedor fiscal específico em vez de programar contra a interface `IFiscalProvider`.

## Artefatos Provisórios

| Task | Arquivo | Status atual | Refatoração obrigatória |
| --- | --- | --- | --- |
| T007 | `packages/twenty-erp/src/lib/services/focus-nfe-http.service.ts` | `[X]` implementado | Mover para `packages/twenty-erp/src/lib/fiscal/adapters/focus-nfe/focus-nfe.adapter.ts`. Implementar `IFiscalProvider`. Adicionar `capabilities()`. |
| T008 | `packages/twenty-erp/src/lib/actions/emissor-fiscal.workflow-action.ts` | `[X]` implementado | Refatorar para consumir `IFiscalProvider` via DI, **não** `FocusNfeHttpService` direto. Adapter é resolvido por `workspaceConfig.fiscalProvider`. |
| T009 | `packages/twenty-server/src/engine/workflow/workflow.module.ts` (registro) | `[X]` implementado | Mantém-se; é o único ponto de acoplamento legítimo com o core (decisão D-04 do spike). Apenas atualizar quando a Action mudar de assinatura. |
| T010 | `packages/twenty-erp/src/lib/services/focus-nfe-http.service.ts` (auditoria HTTP) | `[X]` implementado | Mover interceptor para nível do `fiscal.module.ts` para que TODOS os adapters herdem auditoria, não só Focus NF-e. |

## Restrições durante a refatoração

1. **Não apagar** o código atual em `packages/twenty-erp/src/lib/`. Migrá-lo para a nova estrutura preservando histórico git.
2. **Não introduzir dependência** do `EmissorFiscalWorkflowAction` em código fora de `packages/twenty-erp/`. Hoje o registro em `workflow.module.ts` é o único ponto autorizado.
3. **Adicionar `NullFiscalAdapter`** como primeira coisa na refatoração — ISOFÉ vai precisar dele antes de qualquer outro adapter.
4. **Não testar contra produção do Focus NF-e** até que haja contrato comercial. Usar sandbox de homologação durante toda a refatoração.

## Quando essa dívida é paga

A refatoração ocorre **na feature `00N-fiscal-emissor`**, que está na ordem 5 do roadmap (ADR-0006). Antes dela é proibido:

- Adicionar novos consumidores de `FocusNfeHttpService` no código.
- Estender `EmissorFiscalWorkflowAction` com novas funcionalidades fiscais.
- Configurar Focus NF-e em ambiente de cliente real (mesmo para teste).

## Por que isso aconteceu

A decisão de adiar D1 foi tomada em sessão de chat anterior mas não foi formalizada como ADR nem atualizada em `state.json`. O agente que executou o spike leu o `handoff.md` original (que mandava escolher Focus NF-e ou Nuvem Fiscal) e seguiu o que estava escrito. **Lição registrada na "Política de decisões em outro chat" do ADR-0006.**

## Rastreabilidade

- Cria dívida: `actions.md` linhas T007-T010
- Resolve dívida: feature futura `00N-fiscal-emissor`
- Justificado por: [[../../_reversa_sdd/adrs/0005-fiscal-multi-provider-adapter]]
- Ordem de pagamento definida em: [[../../_reversa_sdd/adrs/0006-prioridade-isofe-primeiro]]
