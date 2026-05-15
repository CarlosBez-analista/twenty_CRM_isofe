# Ecossistema de Serviços e Produtos — Instituto ISOFÉ
### Versão Corrigida · Lógica ERP → CRM

> **Nota de revisão:** Este documento corrige a lógica de negócios do original. O princípio central é que **o ERP é o sistema de registro mestre** (cadastros, gestão de negócios, financeiro, estoque) e **o CRM serve ao ERP** — sendo a camada de relacionamento que reflete as ações do ERP com foco em interação com beneficiários, famílias e parceiros. O CRM **não cria dados mestres de forma autônoma**; ele consome, reflete e enriquece os dados originados no ERP.

---

## 1. Objetivo do Documento

Este documento detalha o ecossistema de serviços e produtos do Instituto ISOFÉ, com foco em transformar a visão institucional em componentes operacionais claros para implantação no ERP, no CRM e nos canais digitais.

O objetivo é permitir que a equipe do ISOFÉ, voluntários, parceiros e gestores compreendam:

- Quais serviços serão ofertados à comunidade;
- Quais produtos físicos, digitais ou sociais sustentam esses serviços;
- Como cada serviço será **cadastrado no ERP**, ofertado, agendado, executado e acompanhado pelo CRM;
- Quais dados pertencem ao ERP (registros mestres, financeiro, estoque) e quais pertencem ao CRM (relacionamento, agendamentos, atendimentos, impacto);
- Como organizar os componentes em tabelas de banco de dados para gestão operacional, prestação de contas e medição de impacto social.

---

## 2. Visão Geral do Ecossistema

O Instituto ISOFÉ atua como uma ponte entre famílias em situação de vulnerabilidade e uma rede de serviços sociais, parceiros, voluntários técnicos e financiadores.

A operação será organizada em cinco pilares principais:

1. Saúde e Atenção Básica;
2. Suporte Jurídico Gratuito e Cidadania;
3. Segurança Alimentar e Assistência Social;
4. Educação e Capacitação Profissionalizante;
5. Esporte e Inclusão.

Todos os serviços devem estar integrados ao Ecossistema Digital ISOFÉ, permitindo cadastro guiado, triagem, agendamento, execução, registro de atendimento, acompanhamento e geração de indicadores.

Um princípio operacional essencial é que toda pessoa responsável por executar um atendimento, entrega, aula, oficina ou atividade também deve registrar a execução no sistema. Esse registro poderá ser feito pelo WhatsApp, por meio de um fluxo guiado simples, ou diretamente pelo CRM, conforme o perfil do usuário, sua atribuição e o nível de acesso permitido.

---

## 3. Princípio Arquitetural: ERP como Sistema de Registro Mestre

### 3.1 Hierarquia Fundamental

```
┌─────────────────────────────────────────────────────┐
│                   ERP  (Sistema Mestre)             │
│                                                     │
│  Cadastros mestres:                                 │
│  • Beneficiários / Famílias                         │
│  • Parceiros / Doadores / Financiadores             │
│  • Catálogo de Produtos e Serviços                  │
│  • Programas Institucionais                         │
│                                                     │
│  Gestão de negócios:                                │
│  • Estoque / Inventário / Lotes                     │
│  • Doações / Entradas / Saídas                      │
│  • Centros de Custo / Orçamento                     │
│  • Prestação de contas financeira                   │
└────────────────────┬────────────────────────────────┘
                     │  fornece dados mestres para
                     ▼
┌─────────────────────────────────────────────────────┐
│                   CRM  (Camada de Relacionamento)   │
│                   *** serve ao ERP ***              │
│                                                     │
│  Reflexo das ações do ERP com foco em               │
│  relacionamento:                                    │
│  • Agendamentos (baseados em serviços do ERP)       │
│  • Atendimentos (registros de interação)            │
│  • Casos (acompanhamento contínuo)                  │
│  • Histórico de relacionamento familiar             │
│  • Indicadores de impacto social                    │
└────────────────────┬────────────────────────────────┘
                     │  dispara movimentações de volta
                     ▼
┌─────────────────────────────────────────────────────┐
│         ERP  (movimentações disparadas pelo CRM)    │
│  • Baixa de estoque após entrega confirmada no CRM  │
│  • Registro de hora voluntária após atendimento     │
│  • Consumo de vaga/recurso vinculado a programa     │
└─────────────────────────────────────────────────────┘
```

### 3.2 Regra de Origem dos Dados

| Tipo de dado | Onde nasce | Onde é refletido |
|---|---|---|
| Cadastro de beneficiário | ERP | CRM (visão relacional) |
| Cadastro de família | ERP | CRM (visão relacional) |
| Cadastro de parceiro | ERP | CRM (relacionamento) |
| Catálogo de serviços | ERP | CRM (execução e agenda) |
| Catálogo de produtos | ERP | CRM (referência em atendimento) |
| Programas institucionais | ERP | CRM (vinculação de serviços) |
| Estoque / lote / validade | ERP | — |
| Doações / entradas | ERP | CRM (informativo) |
| Agendamento | CRM | — |
| Atendimento / presença | CRM | ERP (movimentação de estoque, se houver produto) |
| Caso jurídico / social | CRM | — |
| Indicadores de impacto | CRM + ERP | Relatórios consolidados |
| Prestação de contas financeira | ERP | — |

### 3.3 O CRM não cria dados mestres

O CRM **não cria** beneficiários, famílias, parceiros, serviços, produtos ou programas de forma autônoma. Esses registros são **criados e gerenciados no ERP**. O CRM os **consome por integração** e adiciona a camada de relacionamento: agenda, atendimento, caso, histórico e indicador social.

Quando um atendimento via WhatsApp ou IA inicia o cadastro de um novo beneficiário, esse cadastro deve ser **confirmado e consolidado no ERP** antes de ser operacionalizado no CRM.

---

## 4. Conceitos Operacionais: Produto, Serviço, Programa e Atendimento

Para evitar confusão entre áreas sociais, tecnologia e gestão, este documento adota quatro conceitos principais.

### 4.1 Programa

Programa é uma frente institucional de impacto social, ligada a um pilar estratégico. **Cadastrado e gerido no ERP.**

Exemplos:
- Programa Saúde na Comunidade;
- Programa Direito e Cidadania;
- Programa Mesa Solidária ISOFÉ;
- Programa Futuro Profissional;
- Programa Esporte e Inclusão.

Um programa pode conter vários serviços e produtos.

### 4.2 Serviço

Serviço é uma atividade prestada ao beneficiário, com execução humana, técnica, social, educacional ou assistencial. O **catálogo de serviços é configurado no ERP**. A **execução e o agendamento são registrados no CRM**.

Exemplos:
- Consulta de enfermagem preventiva;
- Aconselhamento jurídico civil;
- Triagem jurídica familiar;
- Atendimento social familiar;
- Aula de reforço escolar de matemática;
- Aula de futebol infantil.

O serviço pode ser gratuito, agendado, recorrente, presencial, remoto ou híbrido.

### 4.3 Produto

Produto é um item, recurso, benefício ou entrega concreta associada a um serviço ou programa. **Cadastrado no ERP, com controle de estoque no ERP.** O CRM registra a entrega ao beneficiário como um atendimento.

Exemplos:
- Cesta de alimentos;
- Kit escolar;
- Cartilha de direitos do cidadão;
- Vaga em curso profissionalizante;
- Relatório de impacto para financiador;
- Declaração de participação em oficina.

### 4.4 Atendimento

Atendimento é cada ocorrência concreta de prestação de serviço a um beneficiário, família, grupo ou comunidade. **Registrado no CRM.** Quando envolve produto físico, **dispara movimentação de estoque no ERP**.

Exemplos:
- Maria compareceu em 12/05/2026 para triagem jurídica;
- Família Silva recebeu cesta alimentar em maio de 2026;
- João participou da aula de reforço de matemática.

O atendimento é o registro transacional mais importante para gerar histórico, impacto e prestação de contas. O CRM consolida os atendimentos e os apresenta como indicadores de relacionamento e impacto social. O ERP consolida os atendimentos que envolvem recursos financeiros, produtos físicos ou horas voluntárias.

---

## 5. Catálogo Inicial de Serviços e Produtos

## 5.1 Pilar 1 — Saúde e Atenção Básica

### Serviço 1: Triagem de Saúde Comunitária

**Descrição:** Atendimento inicial para identificar demandas básicas de saúde, orientar encaminhamentos e registrar vulnerabilidades relacionadas a saúde preventiva.

**Exemplo real:** Uma mãe entra em contato com o ISOFÉ pelo WhatsApp após ver um anúncio de uma ação social marcada para 01/05/2026. O agente de IA apresenta os serviços, realiza o pré-cadastro da mãe e do filho (que é **validado e consolidado no ERP**), inscreve o filho para a consulta pediátrica no CRM, e a mãe recebe comprovante e QR code.

**Tipo:** Serviço social e preventivo.

**Canal de entrada:** WhatsApp, site, atendimento presencial.

**Executor:** Atendente, assistente social, técnico de enfermagem ou voluntário de saúde autorizado.

**Produtos relacionados (cadastrados no ERP):**
- Registro de triagem de saúde;
- Encaminhamento para unidade pública;
- Cartilha de orientação preventiva;
- Lembrete de retorno ou vacinação.

**Dados mínimos no ERP (cadastro mestre):**
- Beneficiário (registro canônico);
- Família vinculada (registro canônico);
- Profissional responsável (usuário do sistema).

**Dados mínimos no CRM (relacionamento):**
- Queixa ou demanda declarada;
- Classificação de prioridade;
- Data da triagem;
- Encaminhamento realizado;
- Status do acompanhamento.

### Serviço 2: Ação de Saúde Preventiva

**Descrição:** Mutirões ou campanhas periódicas com aferição de pressão, orientação nutricional, vacinação em parceria ou palestras educativas.

**Exemplo real:** O ISOFÉ realiza uma manhã de saúde na Colônia Antônio Aleixo com aferição de pressão, orientação nutricional e cadastro de famílias para acompanhamento.

**Tipo:** Serviço coletivo/evento.

**Executor:** Equipe interna, voluntários técnicos e parceiros públicos.

**Produtos relacionados (cadastrados no ERP):**
- Ficha de participação;
- Registro de indicadores básicos;
- Material educativo;
- Lista de encaminhamentos.

### Serviço 3: Teleorientação Assistida

**Descrição:** Agendamento e facilitação de atendimento remoto orientativo, sem emissão de diagnóstico pela IA.

**Produtos relacionados:**
- Link ou sala de atendimento (gerado no CRM);
- Registro de comparecimento (CRM);
- Encaminhamento pós-atendimento (CRM);
- Plano de retorno (CRM).

---

## 5.2 Pilar 2 — Suporte Jurídico Gratuito e Cidadania

### Serviço 1: Triagem Jurídica Inicial

**Descrição:** Identificação da demanda jurídica do beneficiário, classificação do tema e encaminhamento para atendimento pro bono ou órgão competente.

**Exemplo real:** Maria, 42 anos, busca apoio para pensão alimentícia. A IA coleta informações básicas, lista documentos necessários e agenda atendimento com advogado voluntário.

**Tipo:** Serviço jurídico-social.

**Canal de entrada:** WhatsApp, site, presencial.

**Executor:** Atendente, assistente social, advogado voluntário.

**Dados mínimos no ERP (cadastro mestre):**
- Beneficiário (registro canônico);
- Advogado voluntário (perfil de usuário).

**Dados mínimos no CRM (relacionamento e caso):**
- Tipo de demanda jurídica;
- Resumo operacional do caso;
- Documentos pendentes;
- Data do atendimento;
- Status do caso;
- Encaminhamentos.

### Serviço 2: Atendimento Jurídico Pro Bono

**Descrição:** Atendimento gratuito prestado por advogado voluntário para orientação jurídica básica e encaminhamento responsável.

**Produtos relacionados:**
- Registro de atendimento jurídico (CRM);
- Orientação documentada (CRM);
- Encaminhamento externo (CRM);
- Plano de acompanhamento (CRM).

### Serviço 3: Oficina de Educação em Direitos

**Descrição:** Palestras ou oficinas coletivas sobre direitos fundamentais, cidadania, documentação civil, previdência e proteção familiar.

**Produtos relacionados:**
- Lista de presença (CRM);
- Material educativo (produto cadastrado no ERP);
- Certificado ou declaração de participação (produto digital, ERP);
- Indicador de pessoas capacitadas (CRM).

---

## 5.3 Pilar 3 — Segurança Alimentar e Assistência Social

### Serviço 1: Cadastro e Avaliação Sociofamiliar

**Descrição:** Cadastro estruturado da família, identificação de vulnerabilidades, composição familiar, renda, moradia, alimentação e necessidades prioritárias.

**Tipo:** Serviço social base. **O cadastro familiar é gerado no ERP como registro mestre.**

**Executor:** Assistente social, atendente capacitado ou coordenador de programa.

**Dados mínimos no ERP (cadastro mestre):**
- Família (registro canônico);
- Responsável familiar;
- Endereço/bairro;
- Número de membros;
- Faixa de renda;
- Situação de moradia;
- Programas elegíveis.

**Dados mínimos no CRM (acompanhamento social):**
- Situação alimentar (atualizada a cada atendimento);
- Prioridade social (calculada a partir do índice ERP);
- Plano de acompanhamento;
- Histórico de atendimentos.

### Serviço 2: Distribuição de Cesta de Alimentos

**Descrição:** Entrega controlada de alimentos a famílias elegíveis, com rastreio de origem, lote, data, responsável e vínculo com parceiro doador.

**Tipo:** Serviço assistencial com produto físico.

**Fluxo correto ERP → CRM → ERP:**
1. ERP registra entrada do produto (doação, lote, validade, parceiro);
2. CRM identifica famílias elegíveis (consumindo dados do ERP);
3. CRM registra o atendimento de entrega;
4. CRM **dispara movimentação de saída** no ERP (baixa de estoque);
5. ERP gera relatório de distribuição para o parceiro.

**Dados mínimos no ERP:**
- Produto físico (catálogo);
- Estoque disponível;
- Entrada por doação;
- Lote e validade;
- Origem/parceiro;
- Saída por entrega social (disparada pelo CRM).

**Dados mínimos no CRM:**
- Família beneficiada;
- Benefício recebido (referência ao produto do ERP);
- Data da entrega;
- Responsável pela entrega;
- Assinatura/confirmação;
- Próxima previsão de atendimento.

### Serviço 3: Acompanhamento Social Familiar

**Descrição:** Monitoramento contínuo da evolução de vulnerabilidade familiar e conexão com múltiplos serviços do ISOFÉ.

**Produtos relacionados:**
- Plano familiar de acompanhamento (CRM);
- Histórico de atendimentos (CRM);
- Encaminhamento entre programas (CRM → ERP para recursos);
- Indicador de evolução social (CRM).

---

## 5.4 Pilar 4 — Educação e Capacitação Profissionalizante

### Serviço 1: Reforço Escolar no Contraturno

**Descrição:** Apoio pedagógico para crianças e adolescentes em português, matemática, leitura e atividades socioeducativas.

**Tipo:** Serviço educacional recorrente.

**Dados mínimos no ERP:**
- Turma (recurso configurado);
- Parceiro/escola de origem;
- Kit escolar (produto físico, estoque).

**Dados mínimos no CRM:**
- Aluno/beneficiário (referência ao cadastro do ERP);
- Responsável familiar;
- Frequência;
- Desempenho inicial e evolução;
- Encaminhamentos.

### Serviço 2: Curso de Capacitação Profissional

**Descrição:** Cursos gratuitos em parceria com instituições como CETAM e SEMTEPI, voltados à empregabilidade, empreendedorismo e geração de renda.

**Tipo:** Serviço educacional/profissionalizante.

**Dados mínimos no ERP:**
- Parceiro executor (cadastro mestre);
- Vagas disponíveis (produto social, com controle);
- Certificado (produto digital).

**Dados mínimos no CRM:**
- Aluno (referência ao ERP);
- Frequência;
- Status de conclusão;
- Resultado pós-curso.

### Serviço 3: Oficina de Educação Financeira e Empreendedorismo

**Descrição:** Oficinas práticas sobre orçamento familiar, finanças pessoais, pequenos negócios e acesso a oportunidades.

**Produtos relacionados:**
- Oficina realizada (evento registrado no ERP);
- Apostila digital ou impressa (produto no ERP);
- Declaração de participação (produto digital, ERP);
- Plano simples de negócio (CRM).

---

## 5.5 Pilar 5 — Esporte e Inclusão

### Serviço 1: Escolinha de Futebol Comunitária

**Descrição:** Atividade esportiva regular para crianças e adolescentes, com foco em inclusão, disciplina, convivência e desenvolvimento cidadão.

**Tipo:** Serviço esportivo recorrente.

**Dados mínimos no ERP:**
- Turma e modalidade (recurso configurado);
- Uniforme/colete (produto físico, estoque).

**Dados mínimos no CRM:**
- Beneficiário (referência ao ERP);
- Responsável;
- Frequência;
- Avaliação comportamental;
- Observações de inclusão;
- Encaminhamentos sociais.

### Serviço 2: Ginástica e Movimento para Idosos

**Descrição:** Atividades físicas leves para idosos, com foco em convivência, mobilidade, saúde preventiva e bem-estar.

**Produtos relacionados:**
- Vaga em grupo (ERP);
- Registro de presença (CRM);
- Avaliação simples de participação (CRM);
- Encaminhamento para saúde, quando necessário (CRM).

### Serviço 3: Festival Esportivo e Comunitário

**Descrição:** Evento coletivo de integração comunitária, com jogos, atividades culturais, ações de saúde e orientação social.

**Produtos relacionados:**
- Evento cadastrado (ERP — planejamento de recurso);
- Lista de participantes (CRM);
- Relatório de impacto (CRM + ERP);
- Registro fotográfico autorizado (ERP — controle de ativo);
- Prestação de contas para financiador (ERP — financeiro + CRM — impacto).

---

## 6. Matriz de Serviços × Produtos × Sistema Responsável

> **Legenda:** ERP (primário) = dado mestre ou movimentação financeira/estoque. CRM (primário) = registro de relacionamento/interação. CRM→ERP = atendimento no CRM dispara movimentação no ERP.

| Pilar | Serviço | Produto/Entrega | Tipo | Sistema Responsável |
|---|---|---|---|---|
| Saúde | Triagem de saúde | Beneficiário cadastrado | Registro mestre | **ERP** (cadastro) → CRM (triagem) |
| Saúde | Triagem de saúde | Registro de triagem | Digital/social | **CRM** |
| Saúde | Ação preventiva | Material educativo | Físico/digital | **ERP** (produto) → CRM (distribuição) |
| Saúde | Teleorientação assistida | Agendamento remoto | Digital | **CRM** |
| Jurídico | Triagem jurídica | Beneficiário cadastrado | Registro mestre | **ERP** (cadastro) → CRM (caso) |
| Jurídico | Triagem jurídica | Checklist de documentos | Digital | **CRM** |
| Jurídico | Atendimento pro bono | Registro do caso | Digital/social | **CRM** |
| Jurídico | Oficina de direitos | Cartilha de direitos | Físico/digital | **ERP** (produto) → CRM (entrega) |
| Assistência Social | Avaliação sociofamiliar | Família cadastrada | Registro mestre | **ERP** (cadastro) → CRM (plano) |
| Assistência Social | Avaliação sociofamiliar | Plano familiar | Digital/social | **CRM** |
| Assistência Social | Distribuição alimentar | Cesta de alimentos | Físico | **ERP** (estoque/entrada/saída) |
| Assistência Social | Distribuição alimentar | Registro de entrega | Social | **CRM** → dispara baixa no ERP |
| Assistência Social | Acompanhamento familiar | Histórico social | Digital/social | **CRM** |
| Educação | Reforço escolar | Kit escolar | Físico | **ERP** (estoque) |
| Educação | Reforço escolar | Vaga em turma | Social/digital | **ERP** (recurso) → CRM (inscrição) |
| Educação | Curso profissionalizante | Vaga no curso | Social | **ERP** (recurso/parceiro) → CRM (frequência) |
| Educação | Curso profissionalizante | Certificado | Digital/físico | **ERP** (produto/emissão) |
| Educação | Oficina financeira | Apostila | Físico/digital | **ERP** (produto) |
| Esporte | Futebol comunitário | Uniforme/colete | Físico | **ERP** (estoque) |
| Esporte | Futebol comunitário | Vaga esportiva | Social | **ERP** (recurso) → CRM (frequência) |
| Esporte | Ginástica para idosos | Grupo recorrente | Social | **CRM** |
| Esporte | Festival comunitário | Planejamento do evento | Institucional | **ERP** |
| Esporte | Festival comunitário | Relatório de evento | Digital/institucional | **CRM** + ERP |
| Todos | Qualquer serviço | Hora voluntária | Social/financeiro | **ERP** (registro SROI) |

---

## 7. Arquitetura de Dados — ERP como Fundação

A modelagem separa claramente os dados institucionais, operacionais, sociais, financeiros e de impacto. A hierarquia é:

**O ERP é o sistema de registro mestre.** Nele vivem os dados canônicos: pessoas (beneficiários, voluntários, colaboradores), famílias, parceiros, produtos, serviços, programas, estoque, financeiro e configurações.

**O CRM é a camada de relacionamento que serve ao ERP.** O CRM não possui os dados mestres — ele os consome via integração e adiciona interações: agendamentos, atendimentos, casos, histórico e indicadores de impacto.

---

## 8. Entidades Centrais do ERP (Fundação / Dados Mestres)

### 8.1 person (pessoa — entidade unificada)

Entidade mestra de toda pessoa que interage com o ISOFÉ: beneficiários, responsáveis familiares, voluntários, colaboradores internos.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador único |
| full_name | texto | Nome completo |
| preferred_name | texto | Nome social ou de preferência |
| birth_date | data | Data de nascimento |
| cpf | texto criptografado | CPF |
| phone | texto | Telefone principal |
| whatsapp | texto | Número de WhatsApp |
| gender | enum | Gênero |
| disability_status | boolean | Pessoa com deficiência |
| disability_type | texto | Tipo de deficiência |
| address_id | UUID | Endereço vinculado |
| person_type | enum | Beneficiário, voluntário, colaborador, parceiro-pessoa |
| consent_status | enum | Consentimento LGPD |
| created_at | datetime | Data de criação |
| updated_at | datetime | Última atualização |

### 8.2 family (família — cadastro mestre no ERP)

Representa o núcleo familiar. **Cadastrado e gerido no ERP.** O CRM consome esse registro para registrar atendimentos e acompanhamento.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador da família |
| responsible_person_id | UUID | Responsável familiar (FK → person) |
| household_size | inteiro | Número de pessoas na casa |
| income_range | enum | Faixa de renda |
| housing_status | enum | Própria, alugada, cedida, ocupação, rua etc. |
| food_insecurity_level | enum | Baixa, moderada, alta, crítica |
| vulnerability_score | decimal | Índice calculado de vulnerabilidade |
| territory | texto | Bairro/comunidade |
| active | boolean | Família ativa |
| created_at | datetime | Data de criação |

### 8.3 partner (parceiro — cadastro mestre no ERP)

Cadastro de parceiros institucionais, doadores, financiadores e executores. **Entidade mestra do ERP.** O CRM mantém apenas a visão de relacionamento sobre esse registro.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| name | texto | Nome do parceiro |
| partner_type | enum | Doador, financiador, executor, público, privado, voluntariado |
| document_number | texto | CNPJ ou identificação |
| contact_name | texto | Pessoa de contato |
| contact_email | texto | E-mail |
| contact_phone | texto | Telefone |
| relationship_status | enum | Prospect, ativo, inativo, encerrado |
| reporting_requirements | texto | Exigências de prestação de contas |

### 8.4 program (programa institucional — configurado no ERP)

Representa um programa institucional. **Configurado no ERP como unidade de custo e gestão.** O CRM vincula serviços executados a programas para fins de impacto.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do programa |
| name | texto | Nome do programa |
| pillar | enum | Saúde, Jurídico, Assistência Social, Educação, Esporte |
| description | texto | Descrição institucional |
| funding_source_id | UUID | Fonte de financiamento (FK → partner) |
| coordinator_person_id | UUID | Coordenador responsável (FK → person) |
| start_date | data | Início |
| end_date | data | Fim, se houver |
| status | enum | Planejado, ativo, pausado, encerrado |

### 8.5 service_catalog (catálogo de serviços — configurado no ERP)

Tabela principal do catálogo de serviços. **Configurada no ERP.** O CRM a consome para criar agendamentos e registrar atendimentos.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do serviço |
| program_id | UUID | Programa vinculado (FK → program) |
| name | texto | Nome do serviço |
| pillar | enum | Pilar estratégico |
| service_type | enum | Individual, coletivo, recorrente, evento, remoto, híbrido |
| description | texto | Descrição operacional |
| eligibility_rules | texto | Critérios de elegibilidade |
| requires_schedule | boolean | Exige agendamento |
| requires_documents | boolean | Exige documentos |
| default_duration_minutes | inteiro | Duração padrão |
| delivery_channel | enum | Presencial, WhatsApp, site, telefone, híbrido |
| lgpd_sensitivity | enum | Baixa, média, alta, sensível |
| active | boolean | Serviço ativo |

### 8.6 product_catalog (catálogo de produtos — cadastrado no ERP)

Catálogo de produtos físicos, digitais, sociais ou institucionais. **Cadastrado e gerido exclusivamente no ERP.**

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do produto |
| name | texto | Nome do produto |
| product_type | enum | Físico, digital, social, institucional |
| category | enum | Alimento, material educativo, kit, certificado, relatório, vaga, benefício |
| description | texto | Descrição |
| unit_of_measure | enum | Unidade, kg, pacote, vaga, kit, arquivo |
| requires_stock_control | boolean | Controla estoque |
| estimated_unit_cost | decimal | Custo estimado |
| active | boolean | Produto ativo |

### 8.7 inventory_item (estoque — exclusivamente no ERP)

Representa itens físicos em estoque. **Exclusivamente no ERP.**

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| product_id | UUID | Produto (FK → product_catalog) |
| warehouse_id | UUID | Local de armazenamento |
| batch_number | texto | Lote |
| expiration_date | data | Validade |
| quantity_available | decimal | Quantidade disponível |
| quantity_reserved | decimal | Quantidade reservada |
| source_partner_id | UUID | Parceiro doador ou fornecedor (FK → partner) |
| acquisition_type | enum | Doação, compra, parceria, transferência |

### 8.8 stock_movement (movimentações de estoque — exclusivamente no ERP)

Registra entradas e saídas de estoque. **Exclusivamente no ERP.** Saídas podem ser disparadas por atendimentos registrados no CRM.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| product_id | UUID | Produto movimentado |
| inventory_item_id | UUID | Item/lote |
| movement_type | enum | Entrada, saída, ajuste, perda, transferência |
| quantity | decimal | Quantidade |
| movement_date | datetime | Data da movimentação |
| triggered_by_crm_attendance_id | UUID | ID do atendimento no CRM que disparou a saída |
| related_partner_id | UUID | Parceiro relacionado |
| cost_center_id | UUID | Centro de custo |
| notes | texto | Observações |

### 8.9 donation_record (doações — exclusivamente no ERP)

Registra doações recebidas. **Exclusivamente no ERP.**

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| partner_id | UUID | Doador/parceiro (FK → partner) |
| donation_type | enum | Produto, dinheiro, serviço, hora voluntária |
| product_id | UUID | Produto, quando aplicável |
| quantity | decimal | Quantidade |
| estimated_value | decimal | Valor estimado |
| received_at | datetime | Data de recebimento |
| restricted_use | boolean | Uso vinculado a programa específico |
| program_id | UUID | Programa vinculado |
| receipt_document | texto | Recibo ou comprovante |

### 8.10 cost_center (centros de custo — exclusivamente no ERP)

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| name | texto | Nome do centro de custo |
| program_id | UUID | Programa relacionado |
| funding_source_id | UUID | Fonte de recurso (FK → partner) |
| budget_amount | decimal | Orçamento aprovado |
| spent_amount | decimal | Valor gasto |
| status | enum | Ativo, encerrado, bloqueado |

---

## 9. Entidades Centrais do CRM (Camada de Relacionamento — Serve ao ERP)

> Todas as entidades do CRM abaixo **referenciam entidades do ERP** por chave estrangeira. O CRM não possui cópias dos dados mestres — ele mantém apenas ponteiros (IDs) e os dados específicos de relacionamento/interação.

### 9.1 service_appointment (agendamento — CRM)

Representa um agendamento de serviço. Consome `service_catalog` e `person`/`family` do ERP.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do agendamento |
| service_id | UUID | Serviço agendado (FK → ERP service_catalog) |
| beneficiary_person_id | UUID | Beneficiário (FK → ERP person) |
| family_id | UUID | Família (FK → ERP family) |
| scheduled_start | datetime | Início previsto |
| scheduled_end | datetime | Fim previsto |
| location_id | UUID | Local de atendimento |
| assigned_person_id | UUID | Responsável (FK → ERP person) |
| status | enum | Solicitado, confirmado, remarcado, concluído, faltou, cancelado |
| source_channel | enum | WhatsApp, site, presencial, telefone |
| created_by_ai | boolean | Criado pela IA |
| reminder_sent | boolean | Lembrete enviado |
| check_in_qr_code | texto | Token de QR code |
| checked_in_at | datetime | Data e hora do comparecimento |
| checked_in_by_person_id | UUID | Usuário que confirmou a presença |

### 9.2 service_attendance (atendimento — CRM, dispara ERP)

Representa o atendimento efetivamente realizado. Quando envolve produto físico, **dispara stock_movement no ERP**.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do atendimento |
| appointment_id | UUID | Agendamento relacionado (FK → service_appointment) |
| service_id | UUID | Serviço prestado (FK → ERP service_catalog) |
| beneficiary_person_id | UUID | Beneficiário (FK → ERP person) |
| family_id | UUID | Família (FK → ERP family) |
| attended_at | datetime | Data/hora do atendimento |
| attendance_status | enum | Realizado, parcial, não compareceu |
| professional_person_id | UUID | Executor (FK → ERP person) |
| summary | texto restrito | Resumo operacional |
| outcome | enum | Resolvido, encaminhado, em acompanhamento, sem elegibilidade |
| next_step | texto | Próximo passo |
| follow_up_date | data | Data de retorno |
| privacy_level | enum | Operacional, restrito, sensível |
| registration_channel | enum | WhatsApp, CRM, tablet, totem, importação |
| registered_by_person_id | UUID | Pessoa que registrou |
| registered_by_role | enum | Atendente, voluntário, profissional de saúde, advogado, professor, instrutor, assistente social, coordenador |
| requires_review | boolean | Registro precisa de revisão |
| reviewed_by_person_id | UUID | Coordenador que revisou |
| reviewed_at | datetime | Data da revisão |
| erp_stock_movement_id | UUID | ID da movimentação de estoque disparada no ERP (quando houver produto físico) |

### 9.3 case_record (caso — CRM)

Tabela para casos que exigem acompanhamento contínuo — especialmente jurídico, social ou saúde. Referencia dados mestres do ERP.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador do caso |
| beneficiary_person_id | UUID | Beneficiário principal (FK → ERP person) |
| family_id | UUID | Família relacionada (FK → ERP family) |
| case_type | enum | Jurídico, social, saúde, educação, esporte |
| title | texto | Título resumido |
| description | texto restrito | Descrição do caso |
| priority | enum | Baixa, média, alta, urgente |
| status | enum | Aberto, em análise, encaminhado, acompanhado, encerrado |
| assigned_team_id | UUID | Equipe responsável |
| opened_at | datetime | Abertura |
| closed_at | datetime | Encerramento |
| closure_reason | texto | Motivo de encerramento |

### 9.4 document_checklist (checklist de documentos — CRM)

Controla documentos necessários por serviço ou caso.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| service_id | UUID | Serviço relacionado (FK → ERP service_catalog) |
| case_id | UUID | Caso relacionado (FK → case_record) |
| beneficiary_person_id | UUID | Beneficiário (FK → ERP person) |
| document_type | enum | RG, CPF, certidão, comprovante, laudo, outros |
| required | boolean | Obrigatório |
| received | boolean | Recebido |
| received_at | datetime | Data de recebimento |
| storage_reference | texto | Referência segura do arquivo |
| sensitivity_level | enum | Baixa, média, alta, sensível |

### 9.5 volunteer_profile (perfil de voluntário — CRM, referencia ERP)

Cadastro operacional do voluntário no CRM. **O registro mestre da pessoa está no ERP** (`person`). Este registro adiciona informações de voluntariado.

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| person_id | UUID | Pessoa vinculada (FK → ERP person) |
| professional_area | enum | Direito, saúde, educação, esporte, assistência, administrativo |
| license_number | texto | Registro profissional |
| availability_notes | texto | Disponibilidade geral |
| active | boolean | Voluntário ativo |
| background_checked | boolean | Validação realizada |
| access_profile | enum | Agenda, atendimento restrito, coordenação |

### 9.6 impact_indicator (indicadores de impacto — CRM, consolida ERP)

Tabela de indicadores de impacto social. Consolida dados do CRM (atendimentos, casos) e do ERP (custos, doações, horas voluntárias).

| Campo | Tipo | Descrição |
|---|---|---|
| id | UUID | Identificador |
| program_id | UUID | Programa relacionado (FK → ERP program) |
| service_id | UUID | Serviço relacionado (FK → ERP service_catalog) |
| indicator_name | texto | Nome do indicador |
| indicator_type | enum | Quantitativo, qualitativo, financeiro, SROI |
| measurement_period | texto | Mês, trimestre, ano |
| value | decimal | Valor apurado |
| target_value | decimal | Meta |
| data_source | texto | CRM, ERP ou ambos |
| anonymized | boolean | Indicador anonimizado |

---

## 10. Pontos de Integração ERP ↔ CRM

A integração ocorre nos seguintes pontos críticos. O sentido do fluxo reflete a hierarquia: **ERP fornece, CRM consome e eventualmente dispara de volta ao ERP**.

| Evento | Origem | Destino | O que ocorre |
|---|---|---|---|
| Novo beneficiário cadastrado | ERP (cadastro mestre) | CRM (sincronização) | CRM cria registro relacional referenciando o ID do ERP |
| Nova família cadastrada | ERP | CRM | CRM cria visão de acompanhamento familiar |
| Novo parceiro cadastrado | ERP | CRM | CRM exibe parceiro para vinculação em casos e atendimentos |
| Novo serviço publicado no catálogo | ERP | CRM | CRM disponibiliza serviço para agendamento |
| Agendamento criado | CRM | — | CRM gerencia internamente |
| Atendimento realizado (sem produto físico) | CRM | — | CRM registra internamente; consolida indicadores |
| Atendimento realizado (com produto físico) | CRM | ERP | CRM dispara saída de estoque no ERP |
| Entrada de doação | ERP | CRM (informativo) | CRM exibe doação para fins de relacionamento com doador |
| Distribuição de alimentos | CRM (atendimento) → ERP (baixa) | Ambos | CRM registra família atendida; ERP registra saída de produto |
| Curso com vagas limitadas | ERP (vagas) → CRM (inscrição) | Ambos | ERP controla recurso; CRM registra inscrição e frequência |
| Hora voluntária registrada | CRM (atendimento) → ERP | ERP | ERP registra hora voluntária para SROI |
| Relatório para financiador | CRM (impacto) + ERP (custos) | Relatório consolidado | Ambos alimentam o relatório |

---

## 11. Registro Operacional por Perfil

Cada serviço, atividade ou entrega precisa gerar um registro de execução. O registro não deve depender apenas da equipe administrativa. Quem executa o serviço deve confirmar o atendimento ou entrega, dentro de um fluxo simples e compatível com sua função.

### 11.1 Canais de registro

| Canal | Quando usar | Exemplo |
|---|---|---|
| WhatsApp com fluxo guiado | Para voluntários, instrutores, entregadores, professores e equipes em campo | Advogado confirma atendimento realizado e informa encaminhamento básico |
| CRM completo | Para equipe interna, assistente social, coordenação e gestão | Coordenador revisa atendimentos da ação e consolida indicadores |
| Tablet ou computador no polo | Para check-in presencial e apoio em mutirões | Atendente lê QR code da inscrição no dia da ação |
| Totem ou ponto assistido | Para beneficiários com baixa familiaridade digital | Equipe auxilia cadastro e inscrição no local |

### 11.2 Responsabilidade por tipo de serviço

| Tipo de atividade | Quem registra | Canal recomendado | Dados registrados |
|---|---|---|---|
| Consulta pediátrica | Profissional de saúde ou apoio autorizado | WhatsApp ou CRM restrito | Presença, atendimento realizado, orientação geral, encaminhamento |
| Consulta oftalmológica | Profissional de saúde ou equipe da ação | WhatsApp ou CRM restrito | Presença, atendimento realizado, necessidade de retorno |
| Consulta odontológica | Dentista ou auxiliar autorizado | WhatsApp ou CRM restrito | Presença, procedimento realizado, orientação preventiva |
| Limpeza odontológica | Dentista ou auxiliar autorizado | WhatsApp ou CRM restrito | Procedimento realizado, retorno sugerido |
| Aplicação de flúor | Dentista ou auxiliar autorizado | WhatsApp ou CRM restrito | Procedimento realizado, lote/material se necessário |
| Aconselhamento jurídico civil | Advogado voluntário | WhatsApp ou CRM restrito | Atendimento realizado, tema geral, encaminhamento, próximo passo |
| Triagem jurídica familiar | Atendente, assistente social ou advogado | WhatsApp ou CRM | Tipo de demanda, documentos pendentes, prioridade, encaminhamento |
| Auxílio a cadastro em programas sociais | Assistente social ou atendente | CRM ou WhatsApp | Programa solicitado, status do auxílio, pendências documentais |
| Entrega de cesta de alimentos | Equipe de entrega ou assistente social | WhatsApp ou CRM | Beneficiário/família, item entregue, quantidade, confirmação → **dispara baixa no ERP** |
| Reforço de matemática | Professor ou monitor | WhatsApp ou CRM | Presença, turma, conteúdo aplicado, observação de evolução |
| Reforço de língua portuguesa | Professor ou monitor | WhatsApp ou CRM | Presença, nível básico/intermediário, conteúdo aplicado |
| Futebol infantil/adolescente | Instrutor esportivo | WhatsApp ou CRM | Presença, turma, atividade realizada, observações comportamentais |
| Zumba | Instrutor | WhatsApp ou CRM | Presença, turma, atividade realizada |
| Cross-fit comunitário | Instrutor | WhatsApp ou CRM | Presença, turma, atividade realizada, intercorrências |
| Vôlei | Instrutor | WhatsApp ou CRM | Presença, turma, atividade realizada |

### 11.3 Regras de registro

1. Todo atendimento, entrega ou atividade deve ter status final: realizado, não compareceu, cancelado, remarcado ou encaminhado.
2. O executor deve registrar apenas informações operacionais necessárias para comprovar a execução e orientar o próximo passo.
3. Dados sensíveis de saúde, jurídicos ou sociais devem ficar restritos aos perfis autorizados.
4. Registros feitos via WhatsApp podem entrar como rascunho ou registro pendente de validação.
5. O coordenador da ação deve ter visão consolidada dos registros do dia, com possibilidade de revisar inconsistências.
6. O QR code da inscrição deve permitir check-in rápido, evitando duplicidade.
7. A ausência de registro deve aparecer como pendência operacional para o responsável ou coordenador.
8. **Nenhum atendimento no CRM cria dados mestres autônomos.** Beneficiários e famílias não cadastrados no ERP devem ser registrados primeiramente no ERP antes de receberem atendimento no CRM.

---

## 12. Fluxo Completo — Distribuição de Cesta de Alimentos (corrigido)

```
ERP                              CRM                           ERP
─────────────────────────────────────────────────────────────────────
1. Parceiro doa 100 cestas
   ERP registra entrada:
   - donation_record
   - inventory_item (lote)
   - stock_movement (entrada)

2. ERP calcula estoque
   disponível

                                 3. CRM consulta famílias
                                    elegíveis (dados do ERP)
                                    com food_insecurity_level = alta

                                 4. CRM gera lista e envia
                                    convite via WhatsApp

                                 5. Família comparece ao polo
                                    CRM faz check-in via QR code

                                 6. CRM registra atendimento:
                                    service_attendance
                                    (família + produto entregue)

                                 7. CRM dispara integração:
                                    "baixar 1 cesta da família X"
                                                                    8. ERP registra saída:
                                                                       stock_movement
                                                                       (triggered_by_crm_attendance_id)

                                 9. CRM atualiza histórico
                                    da família

                                10. Relatório final:
                                    CRM = impacto (famílias)
                                    ERP = prestação de contas
                                          (produto, custo, parceiro)
```

---

## 13. Fluxo Completo — Atendimento Jurídico Pro Bono (corrigido)

```
ERP                              CRM
─────────────────────────────────────────────────────────
1. Beneficiário já cadastrado
   no ERP (person)
   Advogado cadastrado no ERP
   (person + volunteer_profile
   no CRM)

                                 2. WhatsApp: IA identifica
                                    demanda jurídica

                                 3. IA consulta service_catalog
                                    (via ERP) para serviço
                                    de triagem jurídica

                                 4. CRM cria pré-caso:
                                    case_record (rascunho)
                                    referenciando person do ERP

                                 5. Atendente valida elegibilidade

                                 6. CRM cria agendamento:
                                    service_appointment
                                    (service do ERP +
                                     person do ERP +
                                     advogado do ERP)

                                 7. Advogado visualiza agenda
                                    e contexto mínimo

                                 8. Atendimento realizado:
                                    service_attendance

                                 9. CRM registra resumo
                                    operacional e encaminhamento

                                10. Caso permanece em
                                    acompanhamento ou encerrado
```

*Nota: horas voluntárias do advogado são registradas no ERP como `donation_record` (donation_type = hora_voluntaria) para fins de SROI.*

---

## 14. Fluxo Completo — Curso Profissionalizante (corrigido)

```
ERP                              CRM
─────────────────────────────────────────────────────────
1. Parceiro (executora do curso)
   cadastrado no ERP (partner)

2. Serviço cadastrado no ERP:
   service_catalog
   (30 vagas, parceiro vinculado)

3. Produto cadastrado no ERP:
   product_catalog
   (certificado digital)

                                 4. CRM disponibiliza serviço
                                    para inscrição via WhatsApp

                                 5. Beneficiários se inscrevem:
                                    service_appointment

                                 6. CRM gera lista de espera
                                    e confirma selecionados

                                 7. Frequência registrada
                                    por aula: service_attendance

                                 8. Conclusão registrada no CRM:
                                    attendance_status = concluído

9. ERP emite certificado:
   referenciando service_attendance
   do CRM + product_catalog

                                10. CRM consolida indicadores
                                    de empregabilidade e
                                    capacitação
```

---

## 15. Regras de LGPD e Permissões

A modelagem deve seguir minimização de dados e controle por perfil.

### Perfis sugeridos

| Perfil | Acesso permitido |
|---|---|
| Atendente | Cadastro básico (ERP), agendamentos (CRM), status operacional |
| Assistente social | Dados familiares (ERP), vulnerabilidade, plano social (CRM) |
| Coordenador | Programas (ERP), serviços, indicadores e equipe |
| Voluntário técnico | Agenda (CRM) e resumo mínimo do atendimento |
| Advogado voluntário | Apenas casos jurídicos atribuídos (CRM) |
| Profissional de saúde | Apenas atendimentos de saúde atribuídos (CRM) |
| Gestor de estoque | Produtos, estoque e movimentações (ERP) |
| Gestor financeiro | Doações, custos, centros de custo (ERP) |
| DPO | Logs, consentimentos, auditoria e incidentes (ambos) |
| Diretoria | Indicadores consolidados e anonimizados (CRM + ERP) |
| Parceiro financiador | Relatórios consolidados, sem dados pessoais (ERP + CRM) |

### Dados sensíveis

Devem ter acesso restrito:
- Informações de saúde;
- Dados jurídicos;
- Dados de crianças e adolescentes;
- Situação socioeconômica detalhada;
- Documentos pessoais;
- Laudos;
- Relatos de violência ou violações de direitos.

---

## 16. Componentes para MVP

Para a primeira versão operacional, recomenda-se priorizar:

**ERP (fundação — deve estar pronto primeiro):**
1. Cadastro de pessoas (beneficiários, voluntários, colaboradores);
2. Cadastro de famílias;
3. Cadastro de parceiros;
4. Catálogo de produtos;
5. Catálogo de serviços;
6. Programas institucionais;
7. Estoque básico;
8. Registro de doações.

**CRM (sobre a fundação do ERP):**
9. Agendamentos (consumindo catálogo de serviços do ERP);
10. Registro de atendimento (consumindo beneficiários e serviços do ERP);
11. Casos (jurídico, social);
12. Indicadores simples de impacto.

**Integração ERP ↔ CRM:**
13. Sincronização de cadastros (ERP → CRM);
14. Disparo de movimentação de estoque (CRM → ERP) para entregas físicas.

---

## 17. Indicadores Iniciais

| Indicador | Fonte primária | Uso |
|---|---|---|
| Número de famílias cadastradas | ERP (family) | Gestão social |
| Número de atendimentos por pilar | CRM (service_attendance) | Relatório de impacto |
| Número de cestas entregues | ERP (stock_movement) confirmado pelo CRM | Prestação de contas |
| Pessoas capacitadas | CRM (service_attendance) | Educação e empregabilidade |
| Atendimentos jurídicos realizados | CRM (case_record + attendance) | Cidadania |
| Frequência em atividades esportivas | CRM (service_attendance) | Inclusão |
| Valor estimado de doações | ERP (donation_record) | Transparência |
| Horas voluntárias doadas | ERP (donation_record tipo hora) | SROI |
| Custo por atendimento | ERP (cost_center) ÷ CRM (attendance count) | Eficiência operacional |

---

## 18. Próximos Passos Técnicos

1. Validar a hierarquia ERP → CRM com a diretoria e equipe técnica;
2. Confirmar os serviços prioritários para o MVP, respeitando a ordem: ERP antes do CRM;
3. Definir quais tabelas do ERP serão implementadas no sistema escolhido (ex.: ERPNext, Odoo);
4. Definir quais entidades do CRM serão implementadas no Twenty CRM ou similar;
5. Mapear a integração técnica entre ERP e CRM (API REST, webhooks ou ETL);
6. Criar matriz RBAC detalhada por perfil — distinguindo permissões no ERP e no CRM;
7. Criar dicionário de dados técnico;
8. Criar protótipo do catálogo de serviços no ERP;
9. Criar fluxo de integração ERP → CRM para distribuição alimentar (prioridade MVP);
10. Validar exigências de relatórios para parceiros e financiadores;
11. Definir políticas de retenção, anonimização e auditoria de dados.

---

*Documento revisado por Claude — Instituto ISOFÉ · Versão corrigida em 2026-05-11*
*Princípio central: ERP é o sistema de registro mestre. CRM serve ao ERP como camada de relacionamento.*
