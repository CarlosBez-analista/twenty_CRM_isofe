# Requisitos: Linha do Tempo (Timeline)

O módulo de Linha do Tempo é responsável por centralizar e exibir um histórico cronológico de interações, mudanças de estado e atividades relacionadas a registros específicos no CRM (como Pessoas, Empresas, Oportunidades, etc.).

## 🎯 Escopo

### Must Have
- **Centralização de Eventos**: Consolidar eventos de diferentes fontes (Notas, Tarefas, Mudanças de Campo) em um único fluxo cronológico. 🟢
- **Rastreabilidade de Vínculos**: Manter a relação entre a atividade e os objetos alvo (ex: uma nota vinculada a uma pessoa e uma empresa). 🟢
- **Identificação de Autor**: Registrar qual membro do workspace realizou a ação (`workspaceMemberId`). 🟢
- **Data da Ocorrência**: Registrar o momento exato da atividade (`happensAt`). 🟢

### Should Have
- **Cache de Nomes**: Armazenar o nome do registro vinculado no momento da criação para exibição rápida (`linkedRecordCachedName`). 🟢
- **Suporte a Objetos Customizados**: Permitir que entidades personalizadas também tenham linha do tempo. 🟢

### Could Have
- **Agrupamento de Eventos**: Agrupar eventos similares ocorridos em curto intervalo. 🟡
- **Filtros Avançados**: Filtrar por tipo de atividade ou autor na interface. 🟡

## 🛠️ Requisitos Não Funcionais

- **Performance de Escrita**: O processo de `upsert` de eventos não deve bloquear a transação principal do registro original. 🟡 (Inferido pelo uso de processamento de eventos/jobs).
- **Integridade Referencial**: Embora use IDs de metadados (`linkedObjectMetadataId`), deve garantir que o vínculo persista mesmo se o registro original for renomeado (via cache). 🟢

## ✅ Critérios de Aceitação

### Cenário 1: Criação de Nota gera evento na Timeline
**Dado** que uma nova Nota é criada vinculada a uma Pessoa
**Quando** o sistema processa o evento de criação
**Então** um registro de `TimelineActivity` deve ser criado com `targetPersonId` preenchido e `happensAt` igual à data de criação da nota. 🟢

### Cenário 2: Mudança de Proprietário de Tarefa
**Dado** que uma Tarefa existente tem seu proprietário alterado
**Quando** o evento de atualização é disparado
**Então** a Linha do Tempo deve refletir a mudança, indicando quem realizou a alteração e o novo valor. 🟢

## 📊 MoSCoW

- **Must**: Registro de atividades de Nota, Tarefa e Mudanças de Campo; Vínculo com objetos padrão (Pessoa, Empresa).
- **Should**: Suporte a Objetos Customizados; Cache de nomes para performance.
- **Could**: Filtros por tipo de evento na UI.
- **Won't**: Edição manual de registros de timeline (deve ser imutável/auditável).
