# Anexo, Tarefas de Implementação

> Lista de tarefas para reconstrução do módulo de Anexos com base nas evidências do sistema legado.

## Pré-requisitos
- [ ] Serviço de Storage configurado (Local/S3).
- [ ] Middleware para tratamento de `multipart/form-data` disponível no backend.

## Tarefas

- [ ] T-01, Implementar Entidade Attachment
  - Origem no legado: `packages/twenty-server/src/modules/attachment/standard-objects/attachment.workspace-entity.ts`
  - Critério de pronto: Tabela criada com campos para metadados (nome, tamanho, tipo) e campos de alvo polimórfico.
  - Confiança: 🟢

- [ ] T-02, Implementar Endpoint de Upload
  - Origem no legado: Inferido do uso em `useUploadAttachmentFile.tsx`
  - Critério de pronto: API aceita arquivos, armazena fisicamente e retorna o registro de metadados.
  - Confiança: 🟡

- [ ] T-03, Implementar Componente de Upload (DropZone)
  - Origem no legado: `packages/twenty-front/src/modules/activities/files/components/DropZone.tsx`
  - Critério de pronto: Interface permite arrastar arquivos e mostra feedback de progresso.
  - Confiança: 🟢

- [ ] T-04, Implementar Visualizador de Documentos
  - Origem no legado: `packages/twenty-front/src/modules/activities/files/components/DocumentViewer.tsx`
  - Critério de pronto: PDFs e Imagens podem ser visualizados em um modal/overlay sem download.
  - Confiança: 🟢

- [ ] T-05, Implementar Utilitário de Download
  - Origem no legado: `packages/twenty-front/src/modules/activities/files/utils/downloadFile.ts`
  - Critério de pronto: Clicar em baixar inicia a transferência do arquivo original.
  - Confiança: 🟢

## Tarefas de Teste

- [ ] TT-01, Validar upload de arquivos com caracteres especiais no nome.
- [ ] TT-02, Testar restrição de tipos de arquivo (ex: bloquear executáveis se houver regra).
- [ ] TT-03, Verificar se anexos de uma Oportunidade não são visíveis em outra Oportunidade (isolamento de targetId).

## Ordem Sugerida
1. **Infra (T-01, T-02)**: Configurar armazenamento e API de upload.
2. **Frontend Base (T-03, T-05)**: Permitir envio e recebimento simples.
3. **UX/Avançado (T-04)**: Implementar a camada de visualização rica.

## Lacunas Pendentes (🔴)
- Definir a estratégia de nomenclatura de arquivos no storage (GUID vs Nome Original) para evitar colisões.
- Especificar as chaves de API / permissões necessárias para o provedor de storage em nuvem.
