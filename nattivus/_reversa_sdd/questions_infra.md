# Perguntas para Validação — Infra (Anexo, Nota, Workflow, Dashboard, Membro, Timeline)

> Gerado pelo Revisor em 2026-05-11
> Responda cada pergunta e me avise quando terminar.

---

## Pergunta 1: Anexo — Provedor de Storage
**Contexto:** Módulo `attachment` — `_reversa_sdd/anexo/design.md`
**Spec afetada:** [`_reversa_sdd/anexo/design.md`]
**Pergunta:** Onde os arquivos físicos residem por padrão? (S3, Minio ou local)?
**Impacto:** Define dependências de infraestrutura.

**Resposta:** <!-- Local e deve ser possível configurar para possibilidade de uso de storage externo, como Backblaze, Cloudnary, etc. -->

---

## Pergunta 2: Anexo — Limpeza de Órfãos
**Contexto:** Módulo `attachment` — `_reversa_sdd/anexo/design.md`
**Spec afetada:** [`_reversa_sdd/anexo/design.md`]
**Pergunta:** Existe lógica de limpeza de arquivos físicos após exclusão do registro no banco (orphan cleanup)?
**Impacto:** Define requisitos de manutenção de storage.

**Resposta:** <!-- Não tenho certeza, mas acredito que não, precisa ser avaliado -->

---

## Pergunta 3: Anexo — Restrições de Payload
**Contexto:** Módulo `attachment` — `_reversa_sdd/anexo/design.md`
**Spec afetada:** [`_reversa_sdd/anexo/design.md`]
**Pergunta:** Quais são as configurações de CORS e limites de tamanho de payload no servidor NestJS?
**Impacto:** Define restrições técnicas de upload.

**Resposta:** <!-- O twenty tem limite de 50mb por arquivo, mas isso é passivel de configuração. O cors também é possível de configurar.  -->

---

## Pergunta 4: Anexo — Colisão de Nomes
**Contexto:** Módulo `attachment` — `_reversa_sdd/anexo/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/anexo/edge-cases.md`]
**Pergunta:** Como o sistema lida com o upload de dois arquivos com o mesmo nome para o mesmo registro?
**Impacto:** Define a política de versionamento ou renomeação.

**Resposta:** <!-- Creio deve sugerir um novo nome para o arquivo, mas não tenho certeza, precisa ser avaliado.  -->

---

## Pergunta 5: Nota — Limite de Conteúdo
**Contexto:** Módulo `note` — `_reversa_sdd/nota/design.md`
**Spec afetada:** [`_reversa_sdd/nota/design.md`]
**Pergunta:** Qual o limite de caracteres para o conteúdo da nota (especialmente para grandes quantidades de HTML)?
**Impacto:** Define limites de armazenamento em banco.

**Resposta:** <!-- Não imagino que deva existir um limite de caracteres, mas sim um limite de tamanho de arquivo, que é o que foi discutido no anexo.  -->

---

## Pergunta 6: Nota — Indexação de Busca
**Contexto:** Módulo `note` — `_reversa_sdd/nota/design.md`
**Spec afetada:** [`_reversa_sdd/nota/design.md`]
**Pergunta:** Existe lógica de indexação para busca textual dentro do conteúdo das notas?
**Impacto:** Define requisitos de infra de busca (ex: Postgres Full Text Search).

**Resposta:** <!-- ID do registo de notas e numero de nota, que é sequencial por tipo. Não tenho certeza se esta informação é suficiente, mas é o que eu tenho até agora. -->

---

## Pergunta 7: Nota — Concorrência
**Contexto:** Módulo `note` — `_reversa_sdd/nota/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/nota/edge-cases.md`]
**Pergunta:** Existe algum mecanismo de WebSocket para edição colaborativa ou trava de edição simultânea?
**Impacto:** Define a complexidade da sincronização em tempo real.

**Resposta:** <!-- Creio que o Twenty tem o WebSocket pronto para uso, só precisa ser configurado e ativado, mas não tenho certeza disso.  -->

---

## Pergunta 8: Workflow — Sandbox de Execução
**Contexto:** Módulo `workflow` — `_reversa_sdd/fluxo-de-trabalho/design.md`
**Spec afetada:** [`_reversa_sdd/fluxo-de-trabalho/design.md`]
**Pergunta:** As ações (`WorkflowAction`) são executadas em um ambiente isolado (sandbox) ou têm acesso direto às APIs do servidor?
**Impacto:** Define o modelo de segurança da engine de workflows.

**Resposta:** <!-- Não tenho certeza, mas acredito que sim, estão isoladas em uma queue de jobs, mas não tenho certeza disso.  -->

---

## Pergunta 9: Workflow — Resolução de Variáveis
**Contexto:** Módulo `workflow` — `_reversa_sdd/fluxo-de-trabalho/design.md`
**Spec afetada:** [`_reversa_sdd/fluxo-de-trabalho/design.md`]
**Pergunta:** Como é feita a resolução de variáveis dinâmicas entre os passos (ex: usar output do passo 1 como input do passo 2)?
**Impacto:** Define a lógica de processamento de dados do motor.

**Resposta:** <!-- Não tenho certeza, mas acredito que sim.  -->

---

## Pergunta 10: Workflow — Condicionais e Loops
**Contexto:** Módulo `workflow` — `_reversa_sdd/fluxo-de-trabalho/requirements.md`
**Spec afetada:** [`_reversa_sdd/fluxo-de-trabalho/requirements.md`]
**Pergunta:** Existe suporte para condicionais (if/else) ou loops (foreach) dentro da lista de `steps`?
**Impacto:** Define a expressividade da linguagem de workflow.

**Resposta:** <!-- Não tenho certeza, mas acredito que sim.  -->

---

## Pergunta 11: Workflow — Re-play
**Contexto:** Módulo `workflow` — `_reversa_sdd/fluxo-de-trabalho/requirements.md`
**Spec afetada:** [`_reversa_sdd/fluxo-de-trabalho/requirements.md`]
**Pergunta:** O sistema permite "re-play" de uma execução que falhou preservando o estado anterior?
**Impacto:** Define requisitos de idempotência e resiliência.

**Resposta:** <!-- Não tenho certeza, mas acredito que sim, por padrão ele tenta reenviar a ação que falhou.  -->

---

## Pergunta 12: Dashboard — Resiliência na Duplicação
**Contexto:** Módulo `dashboard` — `_reversa_sdd/dashboard/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/dashboard/edge-cases.md`]
**Pergunta:** O processo de duplicação de dashboard ignora widgets órfãos ou quebra a transação?
**Impacto:** Define a robustez do `DashboardDuplicationService`.

**Resposta:** <!-- Não tenho certeza de como funciona por padrão no Twenty, mas acredito que ignore os widgets órfãos, mas não tenho certeza disso. -->

---

## Pergunta 13: Membro — Conflito Multi-Workspace
**Contexto:** Módulo `workspace-member` — `_reversa_sdd/membro-do-workspace/design.md`
**Spec afetada:** [`_reversa_sdd/membro-do-workspace/design.md`]
**Pergunta:** Como o sistema resolve conflitos quando um usuário pertence a múltiplos workspaces com preferências diferentes?
**Impacto:** Define o modelo de hierarquia de settings (User vs Member).

**Resposta:** <!-- Por padrão, o Twenty não suporta múltiplos workspaces. Cada usuário está vinculado a um único workspace. As configurações são específicas do workspace, e não do usuário individualmente. Se um usuário precisasse pertencer a múltiplos workspaces, seria necessário implementar uma estrutura de tabela separada para associar usuários a workspaces, e as configurações teriam que ser duplicadas ou referenciadas por workspace.  -->

---

## Pergunta 14: Membro — Convites
**Contexto:** Módulo `workspace-member` — `_reversa_sdd/membro-do-workspace/design.md`
**Spec afetada:** [`_reversa_sdd/membro-do-workspace/design.md`]
**Pergunta:** Qual a lógica de expiração e segurança dos links de convite (`WorkspaceInvitation`)?
**Impacto:** Define requisitos de segurança de acesso.

**Resposta:** <!-- Se isso for para uso interno da equipe de coladoradores, não preciso me preocupar com isso, mas se for para uso externo, então é importante pensar nisso, mas por padrão, o Twenty tem um campo de expiração e um campo de token de convite que são utilizados para isso. Somente colaboradores e equipe usarão o sistema, então, a princípio, não preciso me preocupar com isso.  -->

---

## Pergunta 15: Membro — Validação de Admins
**Contexto:** Módulo `workspace-member` — `_reversa_sdd/membro-do-workspace/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/membro-do-workspace/edge-cases.md`]
**Pergunta:** Existe validação que impeça um workspace de ficar sem administradores ativos?
**Impacto:** Define travas críticas de segurança e governança.

**Resposta:** <!-- Não deve extistir workspace sem nenhum admin ativo, mas não tenho certeza se o Twenty tem isso nativo, precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro.  -->

---

## Pergunta 16: Membro — Sincronização de E-mail
**Contexto:** Módulo `workspace-member` — `_reversa_sdd/membro-do-workspace/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/membro-do-workspace/edge-cases.md`]
**Pergunta:** O e-mail do `WorkspaceMember` é sincronizado automaticamente com o `User` ou são campos independentes?
**Impacto:** Define a integridade de dados entre as tabelas.

**Resposta:** <!-- Campos independentes. Se o usuário for deletado, o workspace não será deletado, apenas o usuário. -->

---

## Pergunta 17: Timeline — Deleção Histórica
**Contexto:** Módulo `timeline` — `_reversa_sdd/timeline/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/timeline/edge-cases.md`]
**Pergunta:** Qual a estratégia de deleção global? O rastro histórico (`TimelineActivity`) é mantido se o registro original for removido?
**Impacto:** Define a política de preservação de auditoria histórica.

**Resposta:** <!-- Não tenho certeza, mas acredito que sim, o rastro histórico é mantido se o registro original for removido. Precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro.  -->
