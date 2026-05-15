# Perguntas para Validação — Core (Empresa, Pessoa, Oportunidade, Tarefa)

> Gerado pelo Revisor em 2026-05-11
> Responda cada pergunta e me avise quando terminar.

---

## Pergunta 1: Empresa — Desduplicação
**Contexto:** Módulo `company` — `_reversa_sdd/empresa/design.md`
**Spec afetada:** [`_reversa_sdd/empresa/design.md`]
**Pergunta:** O sistema impede proativamente a criação de empresas com o mesmo `domainName` (Restrição UNIQUE)?
**Impacto:** Se houver trava UNIQUE, a spec de design deve refletir a constraint no banco.

**Resposta:** <!-- Eu quero cada projeto tenha um de acordo com o cliente. Por Exemplo - meuprojeto.com ou o cliente pode configurar o domainName que for planejado no momento da criação do projeto. O domainName deve ser único por projeto, e pode ter mais de um domainName por cliente, mas nunca pode se repetir em outro projeto. -->

---

## Pergunta 2: Empresa — Regra de Exclusão
**Contexto:** Módulo `company` — `_reversa_sdd/empresa/requirements.md`
**Spec afetada:** [`_reversa_sdd/empresa/requirements.md`]
**Pergunta:** Existe alguma regra de negócio que impeça uma empresa de ser excluída se ela tiver oportunidades em andamento (abertas)?
**Impacto:** Define regras de integridade referencial na spec de requisitos.

**Resposta:** <!-- sim, por padrão, não pode excluir empresa com oportunidade em andamento -->

---

## Pergunta 3: Empresa — Campo Position
**Contexto:** Módulo `company` — `_reversa_sdd/empresa/requirements.md`
**Spec afetada:** [`_reversa_sdd/empresa/requirements.md`]
**Pergunta:** O campo `position` (ordem de exibição) é atualizado automaticamente ao arrastar itens na interface ou segue apenas uma lógica sequencial de criação?
**Impacto:** Determina a complexidade da lógica de reordenação na spec.

**Resposta:** <!-- segue apenas uma lógica sequencial de criação, ou seja quando exclui um item, ele não reorganiza a ordem dos itens seguintes, mas em breve quero que seja assim, o usuário vai poder arrastar os itens na interface e reordenar, e a posição deve ser atualizada automaticamente, isso deve ser feito na especificação técnica -->

---

## Pergunta 4: Pessoa — Armazenamento de Avatares
**Contexto:** Módulo `person` — `_reversa_sdd/pessoa/design.md`
**Spec afetada:** [`_reversa_sdd/pessoa/design.md`]
**Pergunta:** O tratamento de Avatares utiliza S3 local ou um provedor externo dedicado?
**Impacto:** Define a infraestrutura de storage na spec de design.

**Resposta:** <!-- local e externo, mas por padrão é local. Pode usar cloudnary, backblaze, bun.ai, google cloud e s3, por padrão ele usa local, pode configurar no .env para usar outro ->

---

## Pergunta 5: Pessoa — Normalização de Telefone
**Contexto:** Módulo `person` — `_reversa_sdd/pessoa/design.md`
**Spec afetada:** [`_reversa_sdd/pessoa/design.md`]
**Pergunta:** Existe lógica de normalização de telefone (padrão E.164) antes da persistência no banco?
**Impacto:** Define hooks de pré-processamento de dados na spec.

**Resposta:** <!-- “Implementar máscara de telefone com formatação automática em tempo real. O campo deve aceitar apenas números e formatar dinamicamente no padrão (DD) 99999-9999, aplicando parênteses, espaço e hífen conforme o usuário digita, sem permitir caracteres especiais.” -->

---

## Pergunta 6: Pessoa — Desduplicação de E-mail
**Contexto:** Módulo `person` — `_reversa_sdd/pessoa/requirements.md`
**Spec afetada:** [`_reversa_sdd/pessoa/requirements.md`]
**Pergunta:** Como o sistema lida com a desduplicação se o mesmo e-mail for inserido em duas pessoas diferentes?
**Impacto:** Define regras de validação e unicidade.

**Resposta:** <!-- em caso de duplicidade, o sistema deve mostrar um alerta ao usuário, deve permitir devido o fato que umas pessoas são humildes e pedem ajuda de terceiros para resolverem problemas. "Não permite criar um lead em duplicidade por email, mas caso o usuário deseje criar mesmo assim deve clicar em criar apesar do aviso. Este item não será obrigatório."-->

---

## Pergunta 7: Pessoa — Escopo do Campo Position
**Contexto:** Módulo `person` — `_reversa_sdd/pessoa/requirements.md`
**Spec afetada:** [`_reversa_sdd/pessoa/requirements.md`]
**Pergunta:** O campo `position` é global por workspace ou filtrado por alguma visualização específica (ex: pastas ou favoritos)?
**Impacto:** Determina o escopo da ordenação.

**Resposta:** <!-- Momentaneamente será por Pasta / Categoria, mas na verdade deveria ser global por workspace, mas não tem lógica de ordenação na interface nem no banco de dados, então pra agora não tem utilidade nenhuma, mas em breve quero implementar a ordenação por arrastar e soltar na interface, ou seja ele deve ser global por workspace, mas estou em duvida do que implementar preciso que seja o mais pratico e funcional para desenvolvedor, usuário, ou talvez o contrário, então preciso que avalie a melhor forma de implementar e me diga como devo fazer. Exemplo: deve ter uma função ou método que recebe um array de IDs e atualiza a posição de cada um, então o que preciso é que você me diga como devo fazer isso da melhor forma. O foco principale deve ser, implementação, facilidade para usuário e manutenção, ordem padrão deve ser crescente. -->

---

## Pergunta 8: Oportunidade — Gatilhos de Estágio
**Contexto:** Módulo `opportunity` — `_reversa_sdd/oportunidade/design.md`
**Spec afetada:** [`_reversa_sdd/oportunidade/design.md`]
**Pergunta:** Existe algum gatilho automático para mudar o estágio de "PROPOSAL" para "CUSTOMER" ao fechar um contrato externo?
**Impacto:** Define automações de workflow na spec.

**Resposta:** <!-- pra agora não, mas em breve quero que seja assim, quando o usuário fechar um contrato, o estágio da oportunidade deve ser atualizado para "CUSTOMER". -->

---

## Pergunta 9: Oportunidade — Multi-moeda
**Contexto:** Módulo `opportunity` — `_reversa_sdd/oportunidade/design.md`
**Spec afetada:** [`_reversa_sdd/oportunidade/design.md`]
**Pergunta:** Como o sistema lida com diferentes moedas no mesmo pipeline ao calcular o total por estágio?
**Impacto:** Define lógica de conversão ou agregação na spec.

**Resposta:** <!-- O sistema não lida com diferentes moedas no mesmo pipeline ao calcular o total por estágio. Usamos o real moeda brasileira.   -->

---

## Pergunta 10: Oportunidade — Validação de Data de Fechamento
**Contexto:** Módulo `opportunity` — `_reversa_sdd/oportunidade/requirements.md`
**Spec afetada:** [`_reversa_sdd/oportunidade/requirements.md`]
**Pergunta:** Existe alguma validação que impeça a `closeDate` de ser preenchida com uma data no passado?
**Impacto:** Define restrições de entrada de dados.

**Resposta:** <!-- Creio que não, não tenho certeza, deveria ter, mas não tem, até porque pode acontecer situações em que você tenha que fazer ajustes em oportunidades antigas, ou seja, não impede a inserção de datas no passado.-->

---

## Pergunta 11: Oportunidade — Probabilidade
**Contexto:** Módulo `opportunity` — `_reversa_sdd/oportunidade/requirements.md`
**Spec afetada:** [`_reversa_sdd/oportunidade/requirements.md`]
**Pergunta:** A probabilidade (`probability`) parece ter sido deprecada no código. Qual campo ou lógica a substituiu para cálculos de previsão (forecast)?
**Impacto:** Define campos de cálculo de valor ponderado.

**Resposta:** <!-- Não sei dizer. Não imagino a importancia desse campo, pois a melhor forma de prever é justamente não colocar probabilidade, mas sim colocar o valor real que você tem certeza que irá receber, ou seja, não ter pressa para fechar oportunidades e analisar com calma, então não imagino a importância desse campo.->

---

## Pergunta 12: Tarefa — Cascata de Exclusão
**Contexto:** Módulo `task` — `_reversa_sdd/tarefa/design.md`
**Spec afetada:** [`_reversa_sdd/tarefa/design.md`]
**Pergunta:** Existe alguma regra de cascata onde a exclusão de uma Oportunidade remove automaticamente suas Tarefas vinculadas?
**Impacto:** Define integridade referencial.

**Resposta:** <!-- Sim. Se apagar a oportunidade, apaga as tarefas -->

---

## Pergunta 13: Tarefa — Customização de Status
**Contexto:** Módulo `task` — `_reversa_sdd/tarefa/design.md`
**Spec afetada:** [`_reversa_sdd/tarefa/design.md`]
**Pergunta:** O campo `status` é um enum fixo do sistema ou pode ser customizado por workspace?
**Impacto:** Define flexibilidade do schema de metadados.

**Resposta:** <!-- É customizado por workspace -->

---

## Pergunta 14: Tarefa — Lembretes e Notificações
**Contexto:** Módulo `task` — `_reversa_sdd/tarefa/requirements.md`
**Spec afetada:** [`_reversa_sdd/tarefa/requirements.md`]
**Pergunta:** O sistema suporta lembretes ou notificações automáticas baseadas no campo `dueAt`?
**Impacto:** Define requisitos de background jobs.

**Resposta:** <!-- Se isso for útil, sim, senão não. Se o twenty já possui um sistema de notificações, então sim, senão não. O problema é que eu não sei se o twenty já possui um sistema de notificações. -->

---

## Pergunta 15: Tarefa — Recorrência
**Contexto:** Módulo `task` — `_reversa_sdd/tarefa/requirements.md`
**Spec afetada:** [`_reversa_sdd/tarefa/requirements.md`]
**Pergunta:** Existe alguma lógica de "tarefas recorrentes" (ex: toda segunda-feira) no legado ou apenas tarefas pontuais?
**Impacto:** Define complexidade do modelo de agendamento.

**Resposta:** <!-- Sim. Se for nativo do twenty ótimo, senão tem que ser implementado no futuro como regra de negócio, pois é muito importante ter isso para não ter que ficar criando tarefas manualmente todo dia. Não neste momento, mas no futuro.  -->
