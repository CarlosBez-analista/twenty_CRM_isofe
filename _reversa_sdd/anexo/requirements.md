# Anexo

> Requisitos funcionais e de negócio para o módulo de Anexos/Arquivos. Foca no QUE a unidade faz.

## Visão Geral
O módulo de Anexo gerencia o ciclo de vida de arquivos dentro do CRM. Ele permite que usuários façam upload de documentos, imagens e outros arquivos, vinculando-os a registros (Empresas, Pessoas, etc.) para centralizar a documentação de suporte.

## Responsabilidades
- Realizar o upload de arquivos para armazenamento persistente. 🟢
- Vincular arquivos a entidades do CRM. 🟢
- Permitir o download de arquivos anexados. 🟢
- Prover visualização prévia (preview) de documentos suportados. 🟢
- Categorizar arquivos por tipo e extensão. 🟢

## Regras de Negócio
- Um anexo deve estar vinculado a pelo menos um registro do CRM ou ser parte de uma nota/e-mail. 🟢
- O sistema deve validar extensões permitidas e tamanhos máximos de arquivo. 🟡
- A exclusão de um anexo deve remover o vínculo e, dependendo da política, o arquivo físico. 🟡
- Arquivos de imagem e PDF devem ter suporte a preview direto no navegador. 🟢

## Requisitos Funcionais

| ID | Requisito | Prioridade | Critério de Aceite |
|----|-----------|-----------|-------------------|
| RF-01 | Upload de arquivo | Must | Usuário consegue selecionar um arquivo local e enviá-lo para o servidor. |
| RF-02 | Vinculação com entidade | Must | Arquivo enviado na página de um Contato aparece listado na aba de "Arquivos" daquele contato. |
| RF-03 | Visualização prévia | Should | Clicar em uma imagem ou PDF abre o `DocumentViewer` sem necessidade de download. |
| RF-04 | Download de anexo | Must | Usuário consegue baixar o arquivo original para sua máquina. |
| RF-05 | Gestão de categorias | Could | O sistema identifica automaticamente se o arquivo é um documento, planilha, imagem, etc. |

## Requisitos Não Funcionais

| Tipo | Requisito inferido | Evidência no código | Confiança |
|------|--------------------|---------------------|-----------|
| Performance | Upload assíncrono com feedback de progresso | `useUploadAttachmentFile.tsx` | 🟢 |
| Segurança | Validação de extensões previewables | `previewable-extensions.const.ts` | 🟢 |
| UX | Suporte a drag-and-drop para uploads | `DropZone.tsx` | 🟢 |

## Critérios de Aceitação

```gherkin
Dado que um usuário está na aba de Arquivos de uma Oportunidade
Quando ele arrasta um PDF para a DropZone
Então o sistema deve processar o upload e exibir o arquivo na lista de anexos 🟢

Dado um arquivo de imagem (.png) anexado a uma Empresa
Quando o usuário clica no nome do arquivo
Então o DocumentViewer deve abrir exibindo a imagem 🟢

Dado um arquivo anexado por engano
Quando o usuário clica em "Excluir" no dropdown do anexo
Então o arquivo deve ser removido da listagem da entidade 🟢
```

## Prioridade (MoSCoW)

| Requisito | MoSCoW | Justificativa |
|-----------|--------|---------------|
| Upload / Persistência | Must | Funcionalidade base do módulo |
| Vinculação com CRM | Must | Essencial para o contexto de dados |
| Download | Must | Necessário para recuperação dos dados |
| Preview de documentos | Should | Importante para produtividade (UX) |
| Categorização automática | Could | Funcionalidade auxiliar de organização |

## Rastreabilidade de Código

| Arquivo | Função / Classe | Cobertura |
|---------|-----------------|-----------|
| `attachment.workspace-entity.ts` | `Attachment` | 🟢 |
| `useUploadAttachmentFile.tsx` | `useUploadAttachmentFile` | 🟢 |
| `AttachmentList.tsx` | `AttachmentList` component | 🟢 |
| `DocumentViewer.tsx` | `DocumentViewer` component | 🟢 |
