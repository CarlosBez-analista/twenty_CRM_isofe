# Perguntas para Validação — Integrações (Calendário, Conta Conectada, Mensagens)

> Gerado pelo Revisor em 2026-05-11
> Responda cada pergunta e me avise quando terminar.

---

## Pergunta 1: Calendário — Sincronização e Concorrência
**Contexto:** Módulo `calendar` — `_reversa_sdd/calendario/design.md`
**Spec afetada:** [`_reversa_sdd/calendario/design.md`]
**Pergunta:** Como o `syncCursor` é atualizado para evitar duplicidade ou perda de eventos em falhas parciais de sincronização?
**Impacto:** Define a resiliência do motor de sincronização.

**Resposta:** <!-- Não tenho clareza disso, precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro.  -->

---

## Pergunta 2: Calendário — Suporte a Outlook
**Contexto:** Módulo `calendar` — `_reversa_sdd/calendario/design.md`
**Spec afetada:** [`_reversa_sdd/calendario/design.md`]
**Pergunta:** Há detalhes específicos da integração com Microsoft Outlook? (A maioria das evidências lidas foca em padrões genéricos ou Google).
**Impacto:** Define a cobertura multi-provedor da spec.

**Resposta:** <!-- Penso que deva ser uma possibilicade e não regra, o usuário deve poder escolher qual provedor deseja usar, mas por padrão, deve ser google. Mas não tenho certeza, precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro.  -->

---

## Pergunta 3: Calendário — Recorrência e Exceções
**Contexto:** Módulo `calendar` — `_reversa_sdd/calendario/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/calendario/edge-cases.md`]
**Pergunta:** Como o sistema trata exceções em eventos recorrentes (ex: alterar apenas uma ocorrência de uma série)?
**Impacto:** Define o modelo de dados de recorrência (identificador vinculado vs instâncias independentes).

**Resposta:** <!-- Não sei como fazer isso de forma nativa no twenty. Tem que pesquisar e avaliar, mas não tenho clareza disso, precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro.  -->

---

## Pergunta 4: Conta Conectada — Expiração de Refresh Token
**Contexto:** Módulo `connected-account` — `_reversa_sdd/conta-conectada/design.md`
**Spec afetada:** [`_reversa_sdd/conta-conectada/design.md`]
**Pergunta:** Qual a lógica de expiração do `refreshToken` para provedores que exigem re-login periódico?
**Impacto:** Define requisitos de UX para re-autenticação.

**Resposta:** <!-- O utilizado por padrão é o que vem nativo do twenty, mas não tenho certeza se é o ideal, precisa ser avaliado, mas por padrão, deve ser global por workspace. Se não for nativo do twenty, tem que ser implementado no futuro. Se não for nativo do twenty.  -->

---

## Pergunta 5: Conta Conectada — Segurança de Segredos
**Contexto:** Módulo `connected-account` — `_reversa_sdd/conta-conectada/design.md`
**Spec afetada:** [`_reversa_sdd/conta-conectada/design.md`]
**Pergunta:** Como são armazenados os segredos de cliente (Client ID/Secret) no multi-tenant? São globais ou por workspace?
**Impacto:** Define o modelo de segurança e isolamento de dados.

**Resposta:** <!-- Por workspace, mas não tenho certeza se é o ideal.  -->

---

## Pergunta 6: Conta Conectada — Upgrade de Escopo
**Contexto:** Módulo `connected-account` — `_reversa_sdd/conta-conectada/edge-cases.md`
**Spec afetada:** [`_reversa_sdd/conta-conectada/edge-cases.md`]
**Pergunta:** Existe lógica para detectar gaps de escopo (permissões insuficientes) e disparar um fluxo de upgrade?
**Impacto:** Define a inteligência do tratamento de erros de OAuth.

**Resposta:** <!-- Não se existe de forna nativa no twenty, mas é uma possibilidade que precisa ser avaliada a importancia e ser implementado no futuro.  -->

---

## Pergunta 7: Mensagens — Chat Interno
**Contexto:** Módulo `messaging` — `_reversa_sdd/mensagens/design.md`
**Spec afetada:** [`_reversa_sdd/mensagens/design.md`]
**Pergunta:** Existe suporte para mensagens internas (chat) ou o módulo focado exclusivamente em e-mails externos?
**Impacto:** Define a abrangência do sistema de comunicação.

**Resposta:** <!-- Não tenho certeza se existe de forma nativa. Se não tiver, não será avaliado agora.  -->

---

## Pergunta 8: Mensagens — Privacidade de E-mails
**Contexto:** Módulo `messaging` — `_reversa_sdd/mensagens/design.md`
**Spec afetada:** [`_reversa_sdd/mensagens/design.md`]
**Pergunta:** Como o sistema lida com a privacidade de e-mails em um workspace compartilhado (quem pode ler e-mails de outros membros)?
**Impacto:** Define regras de visibilidade e permissão granular.

**Resposta:** <!-- Não tenho certeza se existe de forma nativa. Se não tiver, não será avaliado agora. -->

---

## Pergunta 9: Mensagens — Formato do Corpo
**Contexto:** Módulo `messaging` — `_reversa_sdd/mensagens/requirements.md`
**Spec afetada:** [`_reversa_sdd/mensagens/requirements.md`]
**Pergunta:** O sistema armazena o corpo do e-mail em HTML completo ou apenas texto puro (`text`)?
**Impacto:** Define requisitos de renderização e armazenamento.

**Resposta:** <!-- Não tenho certeza se existe de forma nativa. Se não tiver, não será avaliado agora. -->

---

## Pergunta 10: Mensagens — Anexos Pesados
**Contexto:** Módulo `messaging` — `_reversa_sdd/mensagens/requirements.md`
**Spec afetada:** [`_reversa_sdd/mensagens/requirements.md`]
**Pergunta:** Como são tratados anexos pesados dentro das mensagens? São migrados para o módulo de `Attachment` global?
**Impacto:** Define a integração entre os módulos de Mensagens e Anexos.

**Resposta:** <!-- Não tenho certeza se existe de forma nativa. Se não tiver, não será avaliado agora.


Observação: Se o Twenty não possuir não tiver tratamentos ou gerenciamentos de email. Isso não competirá a este projeto. Dessa forma o CRM e ERP não terão tratamentos ou gerenciamentos de email.  a não ser do cadastro do email para envio de notificações do sistema e lembretes, por exemplo: de compromissos, tarefas do coolaborador.
Resumindo se não for nativo do twenty, não será avaliado agora.  -->
