# ADR-0006: Prioridade de Roadmap — ISOFÉ Primeiro, Adapters Fiscais Depois

- **Status:** Aceito
- **Data:** 2026-05-14
- **Confiança:** 🟢 CONFIRMADO (Decisão de Produto)
- **Decisor:** Bez (proprietário do projeto NattivusECO)
- **Relacionado:** [[0005-fiscal-multi-provider-adapter]]

## Contexto

A plataforma NattivusECO atende dois perfis de cliente:

1. **Perfil Social** — instituições beneficentes, ONGs, fundações. Não vendem produtos. Trabalham com doações, beneficiários, voluntários, programas e serviços sociais. **Primeiro cliente real: ISOFÉ.**
2. **Perfil Empresarial** — comércio, indústria, prestação de serviço. Vendem produtos/serviços e emitem documentos fiscais (NF-e, NFS-e).

Sem essa ordem de prioridade explícita, o time tende a construir o módulo fiscal primeiro porque é mais "visível" e tem cobertura ampla de documentação. Isso já aconteceu uma vez: o `001-spike-tecnico-erp/` antecipou implementação de Focus NF-e antes da fundação modular estar pronta, criando dívida técnica (vide ADR-0005).

## Decisão

O roadmap NattivusECO segue **ordem de prioridade estrita**:

| Ordem | Bloco | Status | Cliente alvo |
|---|---|---|---|
| 1 | `001-fundacao-modular` | 🟡 em execução (~26%) | Plataforma toda |
| 2 | `002-crm-core` (Company, Person, Opportunity, Task) | ⚪ pendente requirements | Todos os perfis |
| 3 | Features sociais (ISOFÉ-first): Beneficiário, Família, Programa, Atendimento, Doação, SROI, ImpactIndicator | ⚪ pendente requirements | Perfil Social |
| 4 | Features empresariais: Pedido, Estoque, Financeiro | ⚪ pendente requirements | Perfil Empresarial |
| 5 | `00N-fiscal-emissor` (camada fiscal multi-provedor) | ⚪ pendente, depende de 4 | Perfil Empresarial |
| 6 | Adapters fiscais adicionais (Tecnospeed, NFe.io, prefeituras específicas) | ⚪ contínuo | Sob demanda |

### Por que o fiscal vai por último

- ISOFÉ não precisa de fiscal em V1 (usa `NullFiscalAdapter` por ADR-0005). Bloquear ISOFÉ para construir fiscal seria absurdo.
- Construir fiscal antes do módulo empresarial significa abstrair sobre o que ainda não existe. O `Pedido`, `NotaFiscalReferencia`, fluxo de cancelamento dependem do módulo de vendas estar definido.
- Fiscal é integração com terceiros (provedor + SEFAZ/prefeitura). Cada adapter exige sandbox + certificado + teste contra ambiente real. Custo de tempo alto que não retorna valor enquanto o ERP não tem o que faturar.

### Por que social vem antes de empresarial

- Primeiro cliente real é ISOFÉ (Perfil Social). Construir Perfil Empresarial primeiro deixa o primeiro cliente esperando.
- Perfil Social tem complexidade fiscal **menor** (zero NF-e), o que reduz superfície de risco em V1.
- Modelagem social (Beneficiário, Família, Doação) reusa Company/Person do CRM core sem precisar do ERP de vendas. Caminho mais curto até cliente real produzindo.

## Alternativas Consideradas

1. **Fiscal junto com módulo empresarial**: Rejeitado — mistura escopo de domínio (vendas) com escopo de integração externa (provedor + SEFAZ). Aumenta superfície de mudança e atrasa entrega do ERP empresarial puro.
2. **Empresarial antes de social**: Rejeitado — contradiz ordem de cliente real. ISOFÉ é o primeiro, não pode ficar atrás de feature que não vai usar.
3. **Paralelizar tudo**: Rejeitado — equipe pequena. Paralelismo sem foco vira meia entrega em toda frente.

## Consequências

### Positivas

- ISOFÉ entra em produção sem depender de nenhuma feature fiscal.
- Equipe foca em um cliente real antes de generalizar para clientes hipotéticos.
- Adapters fiscais são construídos quando há demanda concreta (cliente empresarial assinando), não especulativamente.
- ADR-0005 (multi-provedor) só vira código quando primeiro cliente empresarial chegar.

### Negativas

- Plataforma fica "parecendo incompleta" para prospects empresariais até feature 5 entrar — risco comercial.
- Adapters fiscais ficam dependendo de domínio empresarial estar pronto antes de poder ser planejados em detalhe.
- Pré-comprometimento do spike a Focus NF-e fica como dívida no repositório (vide DEBT.md do spike) — visível para qualquer um que abrir o código, exige nota de "código provisório".

## Política de "decisões em outro chat"

**Esta ordem só vale se for respeitada na execução.** Já houve incidente onde a decisão D1 foi adiada em uma conversa, mas o spike implementou Focus NF-e direto sem ADR. Para evitar repetição:

1. Toda decisão de produto ou arquitetura precisa virar ADR em `_reversa_sdd/adrs/` **na mesma sessão em que foi tomada**.
2. Mudança de prioridade no roadmap atualiza este ADR (revisão numerada) ou cria um novo que supersede.
3. Antes de iniciar feature nova, ler ADRs vigentes — não confiar em memória de chat anterior.
4. `state.json.next_session_agenda.blocked_by` é fonte verificável; quando uma decisão é tomada, esse campo precisa ser limpo na mesma sessão.

## Rastreabilidade

- Supersede ordenação implícita em `_reversa_sdd/evolution/evolution_roadmap.md` (que tinha NF-e como bloqueante de Fase 1)
- Bloqueia: feature `00N-fiscal-emissor` até features 1-4 da tabela acima estarem concluídas
- Relacionado: [[0005-fiscal-multi-provider-adapter]] (define COMO o fiscal será construído quando chegar a hora)
