# Anexo, Design Técnico

> Especificação técnica de como o módulo de Anexos é construído no Twenty CRM.

## Interface

### Entidades (Workspace Entities)

| Entidade | Descrição | Principais Campos |
|----------|-----------|-------------------|
| `Attachment` | Registro do metadado do arquivo | `name`, `fullPath`, `size`, `type`, `extension`, `targetId`, `targetEntityType` |

### Hooks e Componentes Principais

| Símbolo | Função | Observação |
|---------|--------|------------|
| `useUploadAttachmentFile` | Realiza o POST do arquivo para o servidor | Lida com multipart/form-data |
| `DocumentViewer` | Renderiza o preview do arquivo | Suporta PDF, imagens, texto e CSV |
| `downloadFile` | Utilitário para disparar download | Cria um link temporário no DOM |

## Fluxo de Upload
1. O usuário interage com `DropZone` ou seleciona um arquivo.
2. `useUploadAttachmentFile` captura o arquivo e o `targetId`/`targetEntityType`. 🟢
3. O frontend envia o arquivo para o endpoint de upload.
4. O backend armazena o arquivo (localmente ou S3) e cria o registro em `Attachment` com o `fullPath`. 🟡
5. O frontend atualiza a `AttachmentList` via cache (Apollo/Recoil). 🟢

## Visualização e Preview
- O sistema utiliza `getFileType.ts` para determinar como renderizar o arquivo. 🟢
- Extensões suportadas para preview estão em `previewable-extensions.const.ts`. 🟢
- Para arquivos CSV, o sistema pode realizar um fetch parcial para preview via `fetchCsvPreview.ts`. 🟢

## Dependências
- `ConnectedAccount`: Pode ser usado se o anexo vier de uma integração (ex: anexo de e-mail). 🟡
- Provedor de Storage (S3, Minio ou Local): Onde os arquivos físicos residem. 🔴
- `Apollo Client`: Para gestão de estado e sincronização da listagem de arquivos. 🟢

## Decisões de Design Identificadas

| Decisão | Evidência no código | Confiança |
|---------|---------------------|-----------|
| Polimorfismo via targetId/targetEntityType | `attachment.workspace-entity.ts` | 🟢 |
| Gestão de preview baseada em extensão | `previewable-extensions.const.ts` | 🟢 |
| Componentização de UI para tipos de arquivo | `AttachmentRow.tsx` | 🟢 |

## Estado Interno
- O progresso do upload é mantido localmente no hook `useUploadAttachmentFile`. 🟢
- A lista de anexos é filtrada no frontend via `filterAttachmentsWithFile.ts`. 🟢

## Riscos e Lacunas
- 🔴 Lógica de limpeza de arquivos físicos após exclusão do registro no banco (orphan cleanup).
- 🔴 Configuração de CORS e limites de tamanho de payload no servidor NestJS.
- 🟡 Suporte a versionamento de arquivos com o mesmo nome para o mesmo registro.
