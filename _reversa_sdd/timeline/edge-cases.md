# Casos de Borda: Linha do Tempo (Timeline)

Este documento detalha situações excepcionais e como o sistema deve tratá-las para garantir a integridade da Linha do Tempo.

## ⚠️ Casos Identificados

### 1. Objeto Alvo Deletado
- **Situação**: Uma nota é criada para uma Pessoa, gerando um evento na Timeline. Posteriormente, a Pessoa é deletada.
- **Tratamento Esperado**: Se a relação for `ON DELETE CASCADE`, o evento da Timeline pode sumir (comportamento padrão de integridade). No entanto, o `linkedRecordCachedName` permite manter o rastro histórico mesmo se o registro original for removido, desde que o registro da `TimelineActivity` em si seja preservado (Soft Delete ou desvinculação). 🔴 (LACUNA: Requer validação da estratégia de deleção global do sistema).

### 2. Edição de Título de Atividade Retroativa
- **Situação**: O título de uma Nota é alterado.
- **Tratamento Esperado**: O método `upsertTimelineActivities` deve atualizar o `linkedRecordCachedName` em todos os registros de timeline que referenciam aquela Nota (`linkedRecordId`), garantindo que a visualização reflita o título atual. 🟢 (Confirmado pela lógica de `upsert` no serviço).

### 3. Falha no Processamento de Eventos (Job Timeout)
- **Situação**: O processamento em lote de eventos falha ou expira.
- **Tratamento Esperado**: O sistema deve possuir mecanismo de retry ou persistência de eventos não processados para evitar "buracos" na linha do tempo. 🟡 (Inferido pela estrutura de `jobs` presente no módulo).

### 4. Mudança de Metadados de Objeto Customizado
- **Situação**: Um objeto customizado é renomeado ou tem seu ID de metadado alterado.
- **Tratamento Esperado**: Como a Timeline usa `linkedObjectMetadataId`, ela é resiliente a mudanças de nome de classe, mas sensível a mudanças de ID de esquema. O sistema deve garantir que o mapeamento de metadados seja estável. 🟢

### 5. Atividade vinculada a múltiplos alvos (Fan-out)
- **Situação**: Uma única tarefa é vinculada a 50 pessoas simultaneamente.
- **Tratamento Esperado**: O `TimelineActivityService` deve ser capaz de gerar 50 payloads distintos sem estourar memória ou timeout de transação, preferencialmente usando inserção em lote (`bulk insert`). 🟢 (Confirmado pelo uso de Repositório com método `upsertTimelineActivities` em lote).
