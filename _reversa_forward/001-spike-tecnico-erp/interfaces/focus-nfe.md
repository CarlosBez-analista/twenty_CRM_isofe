# Contrato de Integração: Focus NF-e

Este documento especifica a interface de comunicação do módulo `twenty-erp` com a API do provedor fiscal Focus NF-e para o Spike Técnico (V1).

## 1. Visão Geral
A integração será HTTP/REST via API oficial do provedor. A comunicação se dá predominantemente no sentido Twenty -> Focus (criação de NFe) e de forma assíncrona ou webhook no sentido Focus -> Twenty (atualização de status da NFe, rejeições ou aprovação).

- **URL Base (Produção):** `https://api.focusnfe.com.br/`
- **URL Base (Homologação):** `https://homologacao.focusnfe.com.br/`
- **Autenticação:** HTTP Basic Auth enviando o Token de API do usuário no campo "username" (senha vazia).

## 2. Ações de Integração

### 2.1 Emissão de NF-e
*   **Ação ERP:** Disparada pelo motor de Workflow quando um Pedido chega no status "FATURADO".
*   **Método:** `POST /v2/nfe`
*   **Idempotência:** A chave da requisição é a referência interna do pedido (`PedidoWorkspaceEntity.codigo` + timestamp ou UUID próprio do ERP) enviado no parâmetro `ref`. O provedor Focus previne duplicidade usando essa referência.
*   **Request Básico (Payload Reduzido):**
    ```json
    {
      "natureza_operacao": "Venda de mercadoria",
      "data_emissao": "2026-05-13T10:00:00-03:00",
      "tipo_documento": "1",
      "finalidade_emissao": "1",
      "cnpj_emitente": "12345678000199",
      "nome_destinatario": "Cliente Exemplo",
      "cpf_cnpj_destinatario": "11122233344",
      "logradouro_destinatario": "Rua Exemplo",
      "numero_destinatario": "123",
      "bairro_destinatario": "Centro",
      "municipio_destinatario": "São Paulo",
      "uf_destinatario": "SP",
      "cep_destinatario": "01000000",
      "itens": [
        {
          "numero_item": "1",
          "codigo_produto": "PROD-001",
          "descricao": "Produto de Teste",
          "cfop": "5102",
          "unidade_comercial": "UN",
          "quantidade_comercial": "1.00",
          "valor_unitario_comercial": "1500.00",
          "valor_bruto": "1500.00",
          "icms_origem": "0",
          "icms_situacao_tributaria": "102"
        }
      ]
    }
    ```
*   **Respostas Esperadas:**
    *   `202 Accepted` - O lote foi recebido para processamento. Retorna a referência da NFe.
    *   `400 Bad Request` - Erro de formatação do JSON ou validação básica do Focus.

### 2.2 Consulta de Retorno (Webhook / Polling)
O processamento na Sefaz é assíncrono.
*   O ERP receberá o status via webhook (recomendado pelo provedor).
*   Se webhook não for usado no Spike, será via consulta `GET /v2/nfe/{ref}`.
*   Status chave: `autorizado`, `erro_autorizacao`, `denegado`.

## 3. Riscos de Transição
- O preenchimento da NFe possui uma vasta árvore de campos de impostos dependendo de ICMS, PIS, COFINS e regime tributário.
- No Spike, o payload de teste será mocando para uma NFe válida simples apenas para provar o disparo e o recebimento de callback do status.
