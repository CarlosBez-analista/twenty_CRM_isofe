# ERP × CRM × Stakeholders — Instituto ISOFÉ
### Mapa Completo de Relacionamento, Fluxos Lógicos e Estrutura Necessária

> **Contexto:** Este documento parte de dois insumos: o Ecossistema de Serviços e Produtos (lógica ERP→CRM) e o Resumo Executivo de Stakeholders. O objetivo é detalhar como cada ator — interno ou externo — se relaciona com o ERP e o CRM, quais fluxos percorre, quais dados produz ou consome, e qual estrutura técnica é necessária para atendê-lo.

---

## 1. Premissas de Arquitetura (Síntese)

Três premissas fundamentam todo o mapeamento:

**1.1 ERP é o sistema de registro mestre.** Todas as entidades canônicas nascem no ERP: pessoas (beneficiários, voluntários, colaboradores), famílias, parceiros, produtos, serviços, programas, estoque e financeiro. Nenhum stakeholder cria dados mestres diretamente no CRM.

**1.2 O CRM serve ao ERP como camada de relacionamento.** O CRM consome os cadastros do ERP e adiciona a camada de interação: agendamentos, atendimentos, casos, histórico e indicadores de impacto. Quando um atendimento envolve produto físico, o CRM dispara movimentação de estoque no ERP.

**1.3 Acesso por camadas, não por sistema completo.** Nenhum stakeholder acessa o ERP ou o CRM integralmente. Cada ator acessa apenas a camada correspondente ao seu papel, pelo canal mais adequado ao seu perfil digital.

```
CAMADAS DE ACESSO
─────────────────────────────────────────────────────────────
Canal externo (beneficiário)
  └─ WhatsApp + IA → API do CRM → API do ERP (leitura)

Canal voluntário/técnico (acesso restrito)
  └─ Portal simplificado → CRM (módulo específico)

Canal equipe interna (operacional)
  └─ CRM completo + módulos ERP permitidos

Canal gestão/governança (consolidado)
  └─ Dashboard gerencial ← ERP + CRM (dados agregados)

Canal parceiro/financiador (transparência)
  └─ Portal de transparência ← ERP + CRM (anonimizado)
─────────────────────────────────────────────────────────────
```

---

## 2. Mapa de Stakeholders

O Instituto ISOFÉ opera com **cinco grupos** e **dezesseis perfis de stakeholders**:

```
┌─────────────────────────────────────────────────────────────────┐
│               MAPA DE STAKEHOLDERS — INSTITUTO ISOFÉ           │
├───────────────────┬─────────────────────────────────────────────┤
│ GRUPO             │ PERFIS                                       │
├───────────────────┼─────────────────────────────────────────────┤
│ 1. BENEFICIÁRIOS  │ 1.1 Beneficiário direto (adulto)            │
│                   │ 1.2 Responsável familiar                     │
│                   │ 1.3 Criança/Adolescente (via responsável)    │
├───────────────────┼─────────────────────────────────────────────┤
│ 2. EQUIPE INTERNA │ 2.1 Atendente                               │
│                   │ 2.2 Assistente Social                        │
│                   │ 2.3 Coordenador de Programa                  │
│                   │ 2.4 Gestor de Estoque                        │
│                   │ 2.5 Gestor Financeiro                        │
├───────────────────┼─────────────────────────────────────────────┤
│ 3. CORPO TÉCNICO  │ 3.1 Profissional de Saúde (voluntário)      │
│    E VOLUNTARIADO │ 3.2 Advogado Voluntário (pro bono)          │
│                   │ 3.3 Professor / Educador                     │
│                   │ 3.4 Instrutor Esportivo                      │
├───────────────────┼─────────────────────────────────────────────┤
│ 4. GESTÃO E       │ 4.1 Diretoria Executiva                     │
│    GOVERNANÇA     │ 4.2 Conselho Fiscal / Auditor                │
│                   │ 4.3 DPO (Encarregado de Dados)              │
├───────────────────┼─────────────────────────────────────────────┤
│ 5. PARCEIROS E    │ 5.1 Parceiro Doador / Assistencial          │
│    FINANCIADORES  │ 5.2 Financiador ESG / Patrocinador          │
│                   │ 5.3 Parceiro Executor (CETAM, SEMTEPI etc.)  │
│                   │ 5.4 Órgão Público (Prefeitura, SESC etc.)   │
│                   │ [+] Agente de IA (ator sistêmico)            │
└───────────────────┴─────────────────────────────────────────────┘
```

---

## 3. Detalhamento por Stakeholder

---

### 3.1 Grupo 1 — Beneficiários e Famílias

Os beneficiários **não acessam o ERP nem o CRM diretamente**. Toda interação ocorre por canais externos (WhatsApp/IA, site, presencial), que por sua vez chamam APIs do CRM e do ERP.

---

#### Perfil 1.1 — Beneficiário Direto (adulto)

**Persona de referência:** Maria, 42 anos, mãe, baixa escolaridade, sem familiaridade digital.

**Canal de interação:** WhatsApp (agente de IA), site (widget), atendimento presencial assistido, totem.

**O que o sistema precisa fornecer a ele:**
- Cadastro guiado simples (via IA ou atendente);
- Confirmação de agendamento com QR code;
- Lembretes de atendimento;
- Histórico dos seus atendimentos (via atendente).

**O que ele fornece ao sistema:**
- Dados pessoais (nome, CPF, telefone, endereço);
- Consentimento LGPD explícito;
- Demanda declarada (saúde, jurídico, social, educação, esporte);
- Comparecimento (via QR code ou confirmação presencial).

**Fluxo no ERP/CRM:**

```
BENEFICIÁRIO (WhatsApp)
        │
        ▼
[IA coleta dados + consentimento]
        │
        ├─► ERP: cria/atualiza person (cadastro mestre)
        │          └─ family (se responsável familiar)
        │
        └─► CRM: cria service_appointment
                   └─ envia QR code de inscrição

No dia do atendimento:
[QR code lido pela equipe]
        │
        └─► CRM: check-in → service_attendance
                   └─ (se produto físico) dispara ERP: stock_movement
```

**Dados acessíveis (nunca direto, sempre mediado):**
- Via IA: apenas seus próprios dados básicos e agendamentos;
- Via atendente: histórico de atendimentos próprios;
- Nunca: dados de outras famílias ou beneficiários.

---

#### Perfil 1.2 — Responsável Familiar

**Interações adicionais ao 1.1:**
- Cadastra dependentes (filhos, idosos) como beneficiários vinculados;
- Autoriza participação de menores em programas esportivos e educacionais;
- Recebe lembretes e confirmações para toda a família.

**Fluxo adicional no ERP:**
```
ERP: family.responsible_person_id = responsável familiar
ERP: person (filho/dependente) com family_id vinculado
CRM: service_appointment pode ser para qualquer membro da família
```

---

#### Perfil 1.3 — Criança / Adolescente (via responsável)

**Sem interação direta com os sistemas.** Todo cadastro, agendamento e consentimento é feito pelo responsável. O sistema deve:
- Marcar o registro como menor (`birth_date < 18 anos`) para aplicar restrições de privacidade adicionais;
- Exigir `authorization_by_responsible = true` em serviços esportivos e educacionais;
- Bloquear acesso de voluntários a dados pessoais do menor além do mínimo necessário.

---

### 3.2 Grupo 2 — Equipe Interna e Operacional

A equipe interna é o **principal operador do CRM** e tem acesso a módulos específicos do ERP conforme sua função.

---

#### Perfil 2.1 — Atendente

**Persona de referência:** Colaborador que realiza o primeiro contato, cadastra e agenda.

**Canal:** CRM (desktop ou tablet no polo), WhatsApp (gerenciamento de chats escalonados pela IA).

**O que acessa no ERP:**
- Criar e atualizar `person` (beneficiário);
- Criar e atualizar `family`;
- Ler `service_catalog` (para informar disponibilidade);
- Ler `partner` (para encaminhamentos).

**O que acessa no CRM:**
- Criar e atualizar `service_appointment`;
- Criar `document_checklist`;
- Ler e atualizar status de atendimentos próprios;
- Gerenciar chats escalonados pela IA.

**O que NÃO acessa:**
- Dados sensíveis de saúde, jurídicos ou sociais detalhados;
- Estoque, financeiro e doações (ERP);
- Casos de outros atendentes.

**Fluxo típico:**

```
[Beneficiário chega ao polo ou chama WhatsApp]
        │
ATENDENTE
        ├─► ERP: verifica se person existe → cria se não
        ├─► ERP: verifica/cria family
        ├─► CRM: cria service_appointment
        ├─► CRM: gera QR code de inscrição
        └─► CRM: registra document_checklist (documentos pendentes)
```

---

#### Perfil 2.2 — Assistente Social

**Persona de referência:** Ana, Coordenadora de projetos sociais, visão holística das famílias.

**Canal:** CRM (desktop).

**O que acessa no ERP:**
- Ler e atualizar `family` (incluindo vulnerability_score, housing_status, food_insecurity_level);
- Ler `service_catalog` e `program`;
- Ler registros de `donation_record` relacionados a programas que acompanha.

**O que acessa no CRM:**
- Criar, ler e atualizar `case_record` (jurídico, social, saúde);
- Criar, ler e atualizar `service_attendance` (todos os tipos que acompanha);
- Criar e atualizar planos de acompanhamento familiar;
- Ler histórico completo de atendimentos de famílias sob sua gestão;
- Ler e atualizar `document_checklist`.

**O que NÃO acessa:**
- Detalhes clínicos de saúde (restritos ao profissional de saúde);
- Financeiro e estoque do ERP;
- Dados de famílias não atribuídas a ela.

**Fluxo típico:**

```
[Família identificada com insegurança alimentar alta]
        │
ASSISTENTE SOCIAL
        ├─► ERP: atualiza family.food_insecurity_level
        ├─► ERP: atualiza family.vulnerability_score
        ├─► CRM: abre case_record (tipo: social)
        ├─► CRM: cria plano de acompanhamento
        ├─► CRM: encaminha para serviço de distribuição alimentar
        │         └─ appointment criado
        └─► CRM: agenda revisão de acompanhamento
```

---

#### Perfil 2.3 — Coordenador de Programa

**Canal:** CRM (visão consolidada do programa) + ERP (módulo de programa e custo).

**O que acessa no ERP:**
- Ler e gerenciar `program` (seus programas);
- Ler `cost_center` do seu programa;
- Ler `service_catalog` do seu programa;
- Ler `donation_record` vinculado ao seu programa;
- Ler `inventory_item` vinculado ao seu programa.

**O que acessa no CRM:**
- Ler todos os `service_attendance` do seu programa;
- Revisar e aprovar registros que requerem validação;
- Ler todos os `case_record` do seu programa;
- Ler e gerar `impact_indicator` do seu programa;
- Gerenciar agenda de voluntários do seu programa;
- Gerar relatórios consolidados de impacto.

**O que NÃO acessa:**
- Programas de outros coordenadores (sem atribuição);
- Dados pessoais sensíveis dos beneficiários além do resumo operacional;
- Financeiro global (ERP).

**Fluxo típico:**

```
[Revisão mensal do programa]
        │
COORDENADOR
        ├─► CRM: revisa service_attendance com requires_review = true
        ├─► CRM: valida indicadores do período
        ├─► ERP: consulta orçamento vs. gasto do cost_center
        ├─► CRM: gera relatório de impacto do programa
        └─► ERP: confirma dados para prestação de contas ao financiador
```

---

#### Perfil 2.4 — Gestor de Estoque

**Canal:** ERP (módulo de estoque e produtos).

**O que acessa no ERP:**
- CRUD completo em `inventory_item`;
- CRUD completo em `stock_movement`;
- Ler e atualizar `product_catalog`;
- Ler `donation_record` (entradas de doação com produto);
- Receber alertas de baixa de estoque disparados pelo CRM.

**O que acessa no CRM:**
- Ler (somente) os atendimentos que dispararam movimentações de estoque (`erp_stock_movement_id` preenchido);
- Confirmar ou corrigir movimentações de saída.

**Fluxo típico:**

```
[Doação recebida do parceiro]
        │
GESTOR DE ESTOQUE
        ├─► ERP: cria donation_record
        ├─► ERP: cria inventory_item (lote, validade, quantidade)
        ├─► ERP: registra stock_movement (entrada)
        │
[CRM registra entrega de cesta]
        │
        ├─► ERP recebe disparo do CRM:
        │     stock_movement (saída, triggered_by_crm_attendance_id)
        └─► Gestor valida saída e fecha movimentação
```

---

#### Perfil 2.5 — Gestor Financeiro

**Canal:** ERP (módulo financeiro).

**O que acessa no ERP:**
- CRUD em `cost_center`;
- CRUD em `donation_record` (valor financeiro);
- Relatórios financeiros consolidados;
- Ler `partner` (financiadores);
- Gerar prestação de contas por programa.

**O que acessa no CRM:**
- Ler (somente) indicadores de impacto para contextualizar relatórios financeiros;
- Ler volume de atendimentos por programa (para custo por atendimento).

---

### 3.3 Grupo 3 — Corpo Técnico e Voluntariado

Os voluntários técnicos têm o **perfil de menor acesso** ao sistema. Acessam apenas o mínimo necessário para executar e registrar seu serviço. Jamais acessam o banco de dados central de beneficiários.

---

#### Perfil 3.1 — Profissional de Saúde (voluntário)

**Persona de referência:** Médico, enfermeiro, dentista ou técnico de saúde que doa horas.

**Canal:** WhatsApp (fluxo guiado) ou portal simplificado de voluntário.

**O que acessa no CRM:**
- Ler sua própria agenda: somente os `service_appointment` atribuídos a ele, com nome do beneficiário, data, local e contexto operacional mínimo (queixa declarada, sem histórico clínico completo);
- Criar `service_attendance` para seus próprios atendimentos: presença, procedimento realizado, orientação geral, encaminhamento;
- Não vê outros voluntários, outras agendas ou outros casos.

**O que acessa no ERP:**
- Nenhum acesso direto ao ERP.

**O que NÃO acessa:**
- Dados pessoais completos do beneficiário (CPF, endereço, renda);
- Dados jurídicos ou sociais;
- Dados de outros atendimentos do mesmo beneficiário fora da saúde;
- Agenda de outros profissionais.

**Fluxo típico:**

```
[Ação de saúde — dia do evento]
        │
PROFISSIONAL DE SAÚDE
        ├─► WhatsApp/Portal: visualiza lista de agendados
        ├─► Realiza atendimento
        └─► WhatsApp/Portal: registra service_attendance:
              - attendance_status = realizado
              - summary = "consulta realizada, orientação X"
              - outcome = encaminhado / resolvido
              - next_step = retorno / encaminhamento UBS
              [CRM salva; coordenador pode revisar]
```

**Disparo automático no ERP:**
- Após registro de atendimento, o CRM registra horas voluntárias no ERP como `donation_record` (donation_type = hora_voluntaria) para fins de SROI.

---

#### Perfil 3.2 — Advogado Voluntário (pro bono)

**Persona de referência:** Carlos, advogado que doa horas para atendimento pro bono.

**Canal:** WhatsApp (fluxo guiado) ou portal simplificado.

**O que acessa no CRM:**
- Ler sua própria agenda: somente os `case_record` e `service_appointment` atribuídos a ele, com nome, data, tipo de demanda jurídica e documentos pendentes (sem detalhes pessoais além do necessário);
- Criar/atualizar `service_attendance` para seus atendimentos: tema geral tratado, encaminhamento, próximo passo;
- Atualizar status do `case_record` (em análise, encaminhado, acompanhado, encerrado).

**O que NÃO acessa:**
- CPF, endereço, renda ou dados sociais do beneficiário;
- Dados de saúde;
- Casos jurídicos de outros advogados;
- Qualquer dado do ERP.

---

#### Perfil 3.3 — Professor / Educador

**Canal:** WhatsApp (fluxo guiado).

**O que acessa no CRM:**
- Ler sua turma e lista de alunos inscritos (nome, turma, nível — básico/intermediário);
- Registrar `service_attendance` por aula: presença por aluno, conteúdo aplicado, observação de evolução.

**O que NÃO acessa:**
- Dados familiares ou socioeconômicos dos alunos;
- Outros programas ou turmas;
- Qualquer dado do ERP.

---

#### Perfil 3.4 — Instrutor Esportivo

**Canal:** WhatsApp (fluxo guiado).

**O que acessa no CRM:**
- Ler sua turma e modalidade;
- Registrar `service_attendance` por aula: presença, atividade realizada, observações comportamentais, intercorrências.

**Restrição especial:** Para turmas com menores, o sistema não deve exibir dados pessoais além do nome e da turma. Observações comportamentais ficam restritas ao coordenador do programa de esporte.

---

### 3.4 Grupo 4 — Gestão e Governança

---

#### Perfil 4.1 — Diretoria Executiva

**Canal:** Dashboard gerencial (portal web, leitura apenas).

**O que visualiza (dados sempre agregados e anonimizados):**

| Dimensão | Fonte | Indicador |
|---|---|---|
| Impacto social | CRM | Atendimentos por pilar, por período, por bairro |
| Eficiência operacional | CRM + ERP | Custo por atendimento, taxa de comparecimento |
| Sustentabilidade | ERP | Doações recebidas, orçamento vs. gasto por programa |
| Vulnerabilidade | ERP (family) | Mapa de calor de vulnerabilidade por território |
| Voluntariado | ERP (donation_record) + CRM | Horas doadas, SROI estimado |
| Capacitação | CRM | Pessoas capacitadas, taxa de conclusão de cursos |

**O que NÃO acessa:**
- Dados individuais de beneficiários;
- Detalhes transacionais do CRM;
- Logs de auditoria (responsabilidade do DPO).

---

#### Perfil 4.2 — Conselho Fiscal / Auditor

> **Lacuna corrigida:** O documento original identificou a ausência de definição do papel do Conselho Fiscal no sistema. Este documento corrige essa lacuna.

**Canal:** Portal de auditoria financeira (ERP — somente leitura) + relatórios de impacto (CRM — somente leitura).

**O que acessa no ERP (somente leitura):**
- Relatórios financeiros consolidados por período;
- `donation_record` (volume, origem, destinação);
- `cost_center` (orçamento aprovado vs. gasto);
- `stock_movement` (comprovação de distribuição de produtos);
- Trilha de auditoria de movimentações financeiras.

**O que acessa no CRM (somente leitura, dados anonimizados):**
- Relatórios de atendimento por programa (volume, datas, status);
- `impact_indicator` por programa;
- Confirmação de que os atendimentos registrados correspondem aos recursos gastos no ERP.

**O que NÃO acessa:**
- Dados pessoais de beneficiários;
- Detalhes de casos individuais;
- Logs de consentimento LGPD (responsabilidade do DPO).

**Fluxo de auditoria:**

```
CONSELHO FISCAL
        │
        ├─► ERP: consulta cost_center.spent_amount vs. budget_amount
        ├─► ERP: cruza donation_record (entradas) com stock_movement (saídas)
        ├─► CRM: confirma volume de atendimentos (comprovação de execução)
        └─► Emite parecer: recursos aplicados conforme programas declarados?
```

---

#### Perfil 4.3 — DPO (Encarregado de Dados)

**Canal:** Interface de auditoria de dados (ERP + CRM — leitura de metadados e logs).

**O que acessa:**
- Logs de acesso de todos os usuários em ambos os sistemas;
- Registros de `consent_status` (ERP — person);
- Histórico de consentimento, revogação e revalidação;
- Registros de incidentes de segurança;
- Relatório de titulares de dados por categoria de sensibilidade;
- Solicitações de acesso, correção ou exclusão de dados (LGPD, Art. 18).

**O que NÃO acessa:**
- Conteúdo dos atendimentos (não é avaliador de serviço);
- Financeiro ou estoque.

**Responsabilidades sistêmicas do DPO:**

```
DPO
├─► Audita: quem acessou dados sensíveis e quando (ERP + CRM logs)
├─► Monitora: consentimentos vencidos ou não renovados
├─► Responde: solicitações LGPD de titulares (exclusão, portabilidade)
├─► Reporta: incidentes de segurança à ANPD e aos titulares
└─► Valida: que voluntários não acessam dados além de suas permissões
```

---

### 3.5 Grupo 5 — Parceiros Institucionais e Financiadores

---

#### Perfil 5.1 — Parceiro Doador / Assistencial

**Exemplo:** Mesa Brasil SESC, banco de alimentos, empresa doadora de kits escolares.

**Canal:** Portal de transparência (leitura) ou relatório enviado por e-mail pelo gestor financeiro.

**O que acessa:**
- Relatório de impacto da sua doação específica: quantidade distribuída, número de famílias beneficiadas, período;
- Confirmação de que os itens doados foram movimentados (ERP: stock_movement de saída rastreado ao seu donation_record);
- Indicadores de impacto social relacionados ao programa que sua doação financia.

**O que NÃO acessa:**
- Dados pessoais dos beneficiários;
- Outros parceiros ou doações;
- Estoque total (só o relativo à sua doação).

**Fluxo:**

```
PARCEIRO DOADOR
        │
        ├─► [Faz doação] → ERP: donation_record criado com partner_id
        ├─► [ISOFÉ distribui] → ERP: stock_movement rastreado ao lote
        │
        └─► [Relatório automático mensal]
              ERP: (volume distribuído, lote, data) +
              CRM: (famílias atendidas, bairros, perfil anonimizado)
              → Portal de transparência ou PDF enviado
```

---

#### Perfil 5.2 — Financiador ESG / Patrocinador

**Persona de referência:** Rafael, representante de empresa do Polo Industrial de Manaus, busca justificar investimento ESG.

**Canal:** Portal de transparência (dashboard interativo) + relatório SROI periódico.

**O que acessa:**
- Dashboard com indicadores de impacto do(s) programa(s) que financia;
- SROI estimado (retorno social por real investido);
- Mapa de calor de vulnerabilidade e atendimento por território;
- Volume de beneficiários impactados, famílias cadastradas, atendimentos por pilar;
- Certificação de conformidade com LGPD (DPO).

**O que NÃO acessa:**
- Dados individuais de beneficiários;
- Detalhes operacionais ou transacionais;
- Estoque ou financeiro interno.

**Cálculo SROI (estrutura no ERP):**

```
SROI = (valor_social_gerado) / (investimento_total)

Onde:
valor_social_gerado =
  ∑ (atendimentos × valor_estimado_por_tipo_de_serviço)    [CRM]
  + ∑ (produtos_distribuídos × valor_estimado_por_produto) [ERP]
  + ∑ (horas_voluntárias × valor_hora_referência)          [ERP]

investimento_total =
  ∑ donation_record.estimated_value (do parceiro)           [ERP]
```

---

#### Perfil 5.3 — Parceiro Executor (CETAM, SEMTEPI, etc.)

**Canal:** Portal de parceiro executor (CRM — módulo restrito) ou relatório periódico.

**O que acessa no ERP:**
- Ler o `service_catalog` dos serviços que executa em parceria;
- Ler o `program` vinculado à parceria.

**O que acessa no CRM:**
- Ler a lista de inscritos nos cursos/serviços que executa (`service_appointment`);
- Registrar frequência e conclusão (`service_attendance`);
- Ler indicadores de seu programa específico.

**O que NÃO acessa:**
- Dados socioeconômicos dos inscritos;
- Outros programas ou parceiros;
- Financeiro ou estoque do ISOFÉ.

**Fluxo:**

```
PARCEIRO EXECUTOR (ex.: CETAM)
        │
        ├─► ERP: ISOFÉ cadastra parceiro (partner) e serviço (service_catalog)
        │
        ├─► CRM: ISOFÉ gerencia inscrições (service_appointment)
        │
        ├─► Parceiro acessa portal:
        │     └─ visualiza lista de inscritos no seu curso
        │     └─ registra frequência por aula (service_attendance)
        │     └─ registra conclusão → ERP: gera certificado (product_catalog)
        │
        └─► CRM gera relatório de frequência e conclusão para o ISOFÉ
```

---

#### Perfil 5.4 — Órgão Público (Prefeitura, SESC, Secretarias)

**Canal:** Relatório formal enviado pelo ISOFÉ (PDF gerado pelo sistema) ou acesso a portal de transparência.

**O que recebe:**
- Relatórios de impacto territorial (atendimentos por bairro, por tipo);
- Dados para articulação de políticas públicas complementares;
- Confirmação de execução de programas financiados com recursos públicos.

**Fluxo:**
```
ÓRGÃO PÚBLICO
        └─► Recebe relatório periódico:
              CRM: indicadores de atendimento + impacto
              ERP: comprovação de aplicação de recursos públicos
              → Relatório assinado pela Diretoria e validado pelo DPO
```

---

#### Ator Sistêmico — Agente de IA (WhatsApp)

O agente de IA não é um stakeholder humano, mas é o **ator de maior volume de interações** no sistema e precisa de uma estrutura técnica própria.

**O que a IA acessa (via API):**

| Sistema | Módulo | Tipo de acesso |
|---|---|---|
| ERP | `service_catalog` | Leitura (para informar serviços disponíveis) |
| ERP | `person` | Leitura + Criação (pré-cadastro, validado depois) |
| ERP | `family` | Leitura + Criação (pré-cadastro, validado depois) |
| CRM | `service_appointment` | Criação + Atualização |
| CRM | `document_checklist` | Criação |
| CRM | `case_record` (pré-caso) | Criação (rascunho, requer validação humana) |

**O que a IA NUNCA acessa:**
- Dados sensíveis de saúde (ICD, prontuário, etc.);
- Dados jurídicos detalhados;
- Estoque, financeiro, doações;
- Dados de outros beneficiários que não o do chat ativo.

**Fluxo da IA:**

```
BENEFICIÁRIO (WhatsApp)
        │ "quero me cadastrar na consulta pediátrica"
        ▼
AGENTE IA
        ├─► ERP API: GET /service_catalog?active=true&pillar=saude
        │     └─ retorna serviços disponíveis
        │
        ├─► ERP API: GET /person?phone={numero}
        │     ├─ [existe] → usa person_id existente
        │     └─ [não existe] → POST /person (pré-cadastro rascunho)
        │         └─ status = pendente_validacao
        │
        ├─► Solicita consentimento LGPD
        │     └─ ERP API: PATCH /person → consent_status = concedido
        │
        ├─► CRM API: POST /service_appointment
        │     └─ service_id, beneficiary_person_id, scheduled_start
        │
        └─► CRM API: GET /service_appointment/{id}/qr_code
              └─ envia QR code ao beneficiário via WhatsApp
```

---

## 4. Matriz RBAC Completa — ERP e CRM

### 4.1 Legenda

- **C** = Create (criar)
- **R** = Read (ler)
- **U** = Update (atualizar)
- **D** = Delete (excluir/desativar)
- **—** = Sem acesso
- **R*** = Leitura apenas de registros próprios ou do programa atribuído
- **R°** = Leitura apenas de dados agregados/anonimizados

### 4.2 Matriz ERP

| Entidade ERP | Atendente | Assist. Social | Coordenador | Gest. Estoque | Gest. Financeiro | Diretoria | C. Fiscal | DPO | IA (API) |
|---|---|---|---|---|---|---|---|---|---|
| `person` | C, R, U | R, U* | R* | — | — | R° | — | R (logs) | C, R |
| `family` | C, R, U | R, U* | R* | — | — | R° | — | R (logs) | C, R |
| `partner` | R | R | R | R | C, R, U | R | R | — | — |
| `program` | R | R | R, U* | R | R | R° | R | — | — |
| `service_catalog` | R | R | R, U* | — | — | R° | — | — | R |
| `product_catalog` | — | — | R* | C, R, U | R | R° | R | — | — |
| `inventory_item` | — | — | R* | C, R, U, D | R | R° | R | — | — |
| `stock_movement` | — | — | R* | C, R, U | R | R° | R | — | — |
| `donation_record` | — | — | R* | R | C, R, U | R° | R | — | — |
| `cost_center` | — | — | R* | — | C, R, U | R° | R | — | — |

### 4.3 Matriz CRM

| Entidade CRM | Atendente | Assist. Social | Coordenador | Prof. Saúde | Advogado | Professor | Instrutor | Diretoria | C. Fiscal | DPO | Parceiro Exec. | IA (API) |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| `service_appointment` | C, R, U | R, U* | R, U* | R* | R* | R* | R* | R° | — | — | R* | C, R, U |
| `service_attendance` | R* | C, R, U* | C, R, U* | C, R* | C, R* | C, R* | C, R* | R° | R° | — | C, R* | — |
| `case_record` | — | C, R, U* | R, U* | — | R, U* | — | — | R° | R° | — | — | C (rascunho) |
| `document_checklist` | C, R, U | R, U* | R* | — | R* | — | — | — | — | — | — | C, R |
| `volunteer_profile` | — | — | R, U* | R* | R* | R* | R* | R° | — | — | — | — |
| `impact_indicator` | — | — | C, R, U* | — | — | — | — | R° | R° | — | R* | — |

### 4.4 Regras Críticas de Segregação

1. **Voluntários de áreas diferentes não se cruzam:** Um advogado voluntário não vê nada relacionado a serviços de saúde e vice-versa. O perfil filtra por `service_catalog.pillar`.

2. **Coordenador vê apenas seu programa:** O campo `program_id` é vinculado ao `user_id` do coordenador. Toda query é filtrada automaticamente.

3. **Menores têm proteção adicional:** Qualquer `person` com `birth_date` indicando menor de 18 anos aciona regras adicionais: requer `authorization_by_responsible`, dados pessoais ocultos para voluntários, `privacy_level = sensível` em qualquer `service_attendance`.

4. **Dados sensíveis (saúde, jurídico) têm dupla restrição:** `lgpd_sensitivity = sensível` em `service_catalog` aciona restrição de acesso mesmo para perfis que normalmente teriam acesso a outros atendimentos.

5. **A IA não persiste dados sensíveis:** O agente de IA não armazena histórico da conversa em banco de dados — apenas dispara chamadas de API e recebe respostas. O histórico transacional fica no CRM e ERP.

---

## 5. Fluxos Lógicos por Processo

### 5.1 Fluxo: Primeiro Acesso de um Novo Beneficiário

```
BENEFICIÁRIO
    │
    ▼ (WhatsApp)
AGENTE IA
    │
    ├─ 1. Apresenta serviços disponíveis
    │       ERP ← GET service_catalog (ativo)
    │
    ├─ 2. Coleta dados básicos
    │
    ├─ 3. Verifica se beneficiário já existe
    │       ERP ← GET person?phone=...
    │
    │  [Novo]
    ├─ 4. Coleta consentimento LGPD
    │       ERP ← POST person (status: pendente_validacao)
    │       ERP ← PATCH person.consent_status = concedido
    │
    ├─ 5. Coleta dados da família (se responsável)
    │       ERP ← POST family
    │
    ├─ 6. Identifica demanda e inscreve no serviço
    │       CRM ← POST service_appointment
    │
    ├─ 7. Envia comprovante e QR code
    │
    └─ 8. [Atendente valida cadastro no ERP]
              ERP ← PATCH person.status = ativo
              (rascunho vira cadastro confirmado)
```

### 5.2 Fluxo: Ação Social (Mutirão de Saúde)

```
COORDENADOR (antes do evento)
    ├─► ERP: confirma service_catalog com vagas e local
    ├─► CRM: gera lista de inscritos com QR codes
    └─► CRM: notifica profissionais de saúde via portal/WhatsApp

EQUIPE NO DIA
    ├─► CRM (tablet): lê QR code → check-in → service_appointment.checked_in_at

PROFISSIONAL DE SAÚDE (durante)
    ├─► CRM/WhatsApp: visualiza próximo da fila (nome + queixa declarada)
    └─► Realiza atendimento

PROFISSIONAL (após atendimento)
    └─► CRM/WhatsApp: registra service_attendance
          - attendance_status
          - summary (mínimo necessário)
          - outcome
          - next_step

COORDENADOR (após evento)
    ├─► CRM: revisa registros com requires_review = true
    ├─► CRM: consolida impact_indicator do evento
    └─► ERP: gera relatório de horas voluntárias (donation_record)

FINANCIADOR (relatório automático)
    └─► Portal: indicadores anonimizados do evento
```

### 5.3 Fluxo: Distribuição de Cesta de Alimentos

```
PARCEIRO DOADOR                  ERP                    CRM
        │                         │                       │
        ├──[doa 100 cestas]──────►│                       │
        │                         ├─ donation_record      │
        │                         ├─ inventory_item       │
        │                         └─ stock_movement(+)    │
        │                                                  │
        │                   ASSISTENTE SOCIAL              │
        │                         │                       │
        │                         │◄──[consulta famílias]─┤
        │                         │   family.food_         │
        │                         │   insecurity = alta   │
        │                         │                       │
        │                         │                ┌──────┘
        │                         │                │ CRM: service_appointment
        │                         │                │ (família + serviço cesta)
        │                         │                │
        │             EQUIPE DE ENTREGA             │
        │                         │                │
        │                         │         ┌──────┘
        │                         │         │ CRM: check-in + service_attendance
        │                         │         │ (família confirmada, item entregue)
        │                         │         │
        │                         │◄────────┘
        │                 ERP: stock_movement(-)
        │                 (triggered_by_crm_attendance_id)
        │                         │
        └──[relatório de impacto]─┘──────────────────────►
                (donation rastreado → saída comprovada → famílias atendidas)
```

### 5.4 Fluxo: Atendimento Jurídico Pro Bono

```
BENEFICIÁRIO (WhatsApp)
    │
    ├─ IA: identifica demanda jurídica
    ├─ IA: informa documentos necessários (document_checklist)
    ├─ CRM: cria case_record (rascunho)
    │
ATENDENTE
    ├─ CRM: valida elegibilidade
    ├─ CRM: confirma case_record (status: aberto)
    ├─ CRM: cria service_appointment com advogado voluntário
    │
ADVOGADO VOLUNTÁRIO
    ├─ Portal: visualiza agenda (nome, data, tipo de demanda)
    ├─ Realiza atendimento
    └─ Portal/WhatsApp: atualiza service_attendance + case_record
          - tema tratado
          - encaminhamento
          - status do caso
          - próximo passo
    │
ASSISTENTE SOCIAL (se necessário)
    └─ CRM: acompanha caso com visão social integrada

COORDENADOR (revisão)
    └─ CRM: revisa e consolida indicadores de cidadania
```

### 5.5 Fluxo: Curso Profissionalizante (parceiro executor)

```
ERP                          CRM                    PARCEIRO EXECUTOR
  │                            │                           │
  ├─ partner (CETAM)           │                           │
  ├─ service_catalog           │                           │
  │  (30 vagas, parceiro_id)   │                           │
  │                            │                           │
  │                   IA / ATENDENTE                       │
  │                            │                           │
  │                       inscrições ──────────────────────►
  │                       service_appointment              │
  │                            │                           │
  │                            │                   [registra frequência]
  │                            │◄── service_attendance ────┤
  │                            │                           │
  │                   COORDENADOR                          │
  │                            │                           │
  │                    consolida frequência                 │
  │                    e emite indicadores                  │
  │                            │                           │
  ├─ product_catalog            │                           │
  │  (certificado digital)      │                           │
  ├─ [gera certificado]─────────┤                           │
  │   por aluno concluinte      │                           │
  │                            │                           │
  └─ donation_record           │                           │
     (horas de instrução        │                           │
      do parceiro → SROI)       │                           │
```

---

## 6. Estrutura Técnica Necessária

### 6.1 Sistemas e Plataformas

| Componente | Responsabilidade | Tecnologia Sugerida |
|---|---|---|
| ERP | Sistema de registro mestre: cadastros, estoque, financeiro, parceiros, programas | ERPNext / Odoo (open source) |
| CRM | Camada de relacionamento: agendamentos, atendimentos, casos, indicadores | Twenty CRM (customizado) |
| API Gateway | Integração entre ERP, CRM, IA e canais externos | Node.js / FastAPI |
| Agente de IA | Atendimento via WhatsApp, cadastro guiado, agendamento | LLM + WhatsApp Business API |
| Portal de Voluntário | Interface simplificada para corpo técnico | Web responsivo (acesso por token) |
| Portal de Transparência | Relatórios de impacto para parceiros e financiadores | Dashboard web (público/restrito) |
| Portal de Auditoria | Logs e relatórios para DPO e Conselho Fiscal | Interface admin restrita |
| Dashboard Gerencial | Indicadores consolidados para Diretoria | BI (Metabase / Superset) |

### 6.2 Integrações Necessárias

```
┌─────────────────────────────────────────────────────────┐
│                    API GATEWAY                          │
│                                                         │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐ │
│  │     ERP     │◄──►│     CRM     │◄──►│  Agente IA  │ │
│  │  (mestre)   │    │(rel.layer)  │    │  (WhatsApp) │ │
│  └──────┬──────┘    └──────┬──────┘    └─────────────┘ │
│         │                  │                            │
│  ┌──────▼──────┐    ┌──────▼──────┐    ┌─────────────┐ │
│  │  Portal     │    │  Portal     │    │  Portal     │ │
│  │  Auditoria  │    │  Voluntário │    │Transparência│ │
│  │ (DPO/Fisc.) │    │(técnicos)   │    │(parceiros)  │ │
│  └─────────────┘    └─────────────┘    └─────────────┘ │
│                                                         │
│  ┌──────────────────────────────────────────────────┐   │
│  │          Dashboard Gerencial (Diretoria)          │   │
│  └──────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 6.3 Pontos de Integração ERP ↔ CRM (técnico)

| Evento | Direção | Tipo | Dados trafegados |
|---|---|---|---|
| Novo beneficiário validado | ERP → CRM | Webhook/Sync | person_id, family_id, status |
| Novo parceiro cadastrado | ERP → CRM | Webhook/Sync | partner_id, name, type |
| Novo serviço publicado | ERP → CRM | Webhook/Sync | service_id, program_id, capacity |
| Atendimento com produto físico | CRM → ERP | Webhook síncrono | attendance_id, product_id, quantity |
| Hora voluntária registrada | CRM → ERP | Webhook assíncrono | volunteer_id, hours, service_date |
| Relatório de impacto | CRM + ERP | Batch (diário/mensal) | indicators, cost_centers, donations |
| Estoque crítico | ERP → CRM | Alerta | product_id, quantity_available |

### 6.4 Canais por Stakeholder (resumo)

| Stakeholder | Canal Principal | Canal Secundário | Sistema Acessado |
|---|---|---|---|
| Beneficiário | WhatsApp + IA | Site / Presencial assistido | Nenhum (via IA/API) |
| Atendente | CRM (desktop/tablet) | WhatsApp (chats escalonados) | CRM + ERP (cadastros) |
| Assistente Social | CRM (desktop) | — | CRM + ERP (família) |
| Coordenador | CRM (desktop) | ERP (relatórios) | CRM + ERP |
| Gestor de Estoque | ERP | — | ERP |
| Gestor Financeiro | ERP | CRM (leitura) | ERP + CRM (leitura) |
| Prof. Saúde / Advogado | WhatsApp guiado | Portal de voluntário | CRM (restrito) |
| Professor / Instrutor | WhatsApp guiado | Portal de voluntário | CRM (restrito) |
| Diretoria | Dashboard BI | — | Agregado (ERP + CRM) |
| Conselho Fiscal | Portal de auditoria | Relatório PDF | ERP + CRM (leitura, anonimizado) |
| DPO | Interface de auditoria | — | Logs ERP + CRM |
| Parceiro Doador | Portal transparência | Relatório PDF | Agregado (anonimizado) |
| Financiador ESG | Portal transparência | Dashboard SROI | Agregado (anonimizado) |
| Parceiro Executor | Portal de parceiro | — | CRM (restrito, seu programa) |
| Órgão Público | Relatório formal | — | Agregado (anonimizado) |

---

## 7. Análise de Riscos e Lacunas (Gap Analysis Expandido)

### 7.1 Riscos Identificados e Mitigações

| # | Risco | Origem | Impacto | Mitigação |
|---|---|---|---|---|
| R1 | Falha na segregação de dados entre voluntários de áreas diferentes | Baixa granularidade RBAC | Alto — violação LGPD | RBAC filtrado por `service_catalog.pillar` + testes automatizados de acesso cruzado |
| R2 | Voluntário acessa mais do que deveria via portal | Interface mal projetada | Alto | Portal de voluntário exibe SOMENTE agenda atribuída, sem navegação livre |
| R3 | IA cria cadastro incompleto ou duplicado | Erro de validação | Médio | Cadastro via IA tem status "pendente_validacao" até revisão humana |
| R4 | Atendimento registrado sem movimentação de estoque correspondente | Falha na integração CRM→ERP | Médio | Webhook síncrono obrigatório para atendimentos com produto físico; alerta se falhar |
| R5 | Conselho Fiscal sem acesso formal definido | Lacuna de governança | Alto (auditoria comprometida) | Portal de auditoria financeira dedicado (corrigido neste documento) |
| R6 | Baixa literacia digital de voluntários | Adoção do sistema | Alto (subregistro) | Canal WhatsApp como principal — fluxo guiado com no máximo 5 passos |
| R7 | Dados de menores expostos a voluntários | Falta de restrição por faixa etária | Crítico — LGPD + ECA | Flag automático para `person.birth_date < 18`: oculta dados pessoais, exige autorização do responsável |
| R8 | SROI calculado sem base de dados padronizada | Inconsistência metodológica | Médio — credibilidade com financiadores | Tabela `impact_indicator` com campo `data_source` e metodologia documentada no ERP |
| R9 | Auditor do Conselho Fiscal acessa dados pessoais | Ausência de restrição de privacidade no relatório | Alto — LGPD | Todos os relatórios do Conselho Fiscal são gerados com dados agregados e anonimizados |
| R10 | Parceiro executor registra frequência de forma inconsistente | Falta de treinamento + interface complexa | Médio | Interface de parceiro executor com formulário simplificado + validação de presença automática |

### 7.2 Lacunas Corrigidas neste Documento

**Lacuna 1 — Conselho Fiscal sem acesso definido (identificada no Resumo Executivo original):**
Corrigida. O Conselho Fiscal tem agora um "Portal de Auditoria" dedicado com acesso somente-leitura a relatórios financeiros do ERP e indicadores de impacto do CRM, todos anonimizados. O fluxo de auditoria está documentado na seção 4.2.

**Lacuna 2 — Não havia distinção entre canais do voluntário:**
Corrigida. O canal principal de voluntários técnicos é o **WhatsApp com fluxo guiado** (máxima simplicidade, mínimo dado exibido). O portal de voluntário serve como canal secundário para quem tem maior familiaridade digital.

**Lacuna 3 — SROI sem estrutura de cálculo definida:**
Corrigida. A fórmula e as fontes de dados para cálculo do SROI estão descritas na seção 3.5 (Perfil 5.2), com rastreabilidade entre `donation_record` (ERP), `service_attendance` (CRM) e `donation_record` (horas voluntárias, ERP).

**Lacuna 4 — Parceiro executor sem fluxo definido:**
Corrigida. O Perfil 5.3 define o fluxo completo entre CETAM/SEMTEPI e o sistema: o ERP gerencia o parceiro e o serviço, o CRM gerencia inscrições e frequência, e o parceiro acessa um portal restrito ao seu programa.

---

## 8. Checklist de Implementação por Fase

### Fase 1 — Fundação (ERP)

- [ ] Configurar entidades mestras: `person`, `family`, `partner`, `program`, `service_catalog`;
- [ ] Configurar `product_catalog`, `inventory_item`, `stock_movement`;
- [ ] Configurar `donation_record`, `cost_center`;
- [ ] Implementar RBAC do ERP (perfis: Atendente, Assistente Social, Coordenador, Gestor Estoque, Gestor Financeiro);
- [ ] Habilitar logs de auditoria no ERP.

### Fase 2 — Relacionamento (CRM)

- [ ] Configurar `service_appointment`, `service_attendance`, `case_record`;
- [ ] Configurar `document_checklist`, `volunteer_profile`, `impact_indicator`;
- [ ] Implementar RBAC do CRM (incluindo perfis de voluntários técnicos por pilar);
- [ ] Configurar filtros automáticos: por `program_id` (coordenador), por `pillar` (voluntário técnico);
- [ ] Implementar proteção de menores (`birth_date < 18`).

### Fase 3 — Integração

- [ ] Implementar API Gateway (ERP ↔ CRM ↔ IA);
- [ ] Webhook ERP → CRM: sincronização de cadastros;
- [ ] Webhook CRM → ERP: movimentação de estoque após entrega confirmada;
- [ ] Webhook CRM → ERP: registro de horas voluntárias;
- [ ] Testar segregação de acesso entre voluntários de áreas diferentes.

### Fase 4 — Canais e Portais

- [ ] Configurar WhatsApp Business API + Agente de IA;
- [ ] Desenvolver Portal de Voluntário (simplificado, acesso por token);
- [ ] Desenvolver Portal de Transparência (parceiros e financiadores);
- [ ] Desenvolver Portal de Auditoria (DPO e Conselho Fiscal);
- [ ] Configurar Dashboard Gerencial (Diretoria — Metabase ou Superset).

### Fase 5 — Validação e Conformidade

- [ ] Realizar workshop de alinhamento com a diretoria e parceiros-chave;
- [ ] Testar RBAC com cada perfil de usuário (incluindo tentativas de acesso cruzado);
- [ ] Validar fluxo LGPD: consentimento, revogação, portabilidade, exclusão;
- [ ] Validar cálculo SROI com metodologia acordada com financiadores;
- [ ] Treinar equipe interna no CRM;
- [ ] Treinar voluntários no fluxo de registro via WhatsApp.

---

## 9. Próximos Passos Imediatos

1. **Validar mapa de stakeholders com a Diretoria:** Confirmar se há secretarias municipais, parceiros ou perfis de acesso omitidos.
2. **Definir ERP:** Escolher entre ERPNext, Odoo ou solução customizada — impacta diretamente o custo e prazo da Fase 1.
3. **Formalizar acesso do Conselho Fiscal:** Registrar em ata que o Conselho Fiscal acessa apenas dados agregados e anonimizados — requisito de governança.
4. **Prototipar o Portal do Voluntário:** Validar com um médico voluntário e um advogado voluntário antes de desenvolver — literacia digital e usabilidade são críticas.
5. **Definir metodologia SROI:** Acordar com o primeiro financiador ESG como o retorno social será calculado e apresentado — isso define os campos obrigatórios em `impact_indicator`.

---

*Documento gerado por Claude — Instituto ISOFÉ · 2026-05-11*
*Insumos: Ecossistema de Serviços e Produtos (versão corrigida) + Resumo Executivo de Stakeholders*
*Princípio: ERP é o sistema de registro mestre. CRM serve ao ERP. Cada stakeholder acessa apenas o que seu papel exige.*
