# Anexo, Casos de Borda (Edge Cases)

> Documentação de comportamentos extremos e exceções identificados no módulo de Anexos.

## 1. Upload Interrompido
- **Cenário:** A conexão do usuário cai durante o upload de um arquivo grande (ex: 50MB).
- **Comportamento Esperado:** O sistema deve garantir que registros parciais não fiquem no banco de dados. O frontend deve permitir a tentativa de reenvio. 🟡

## 2. Nomes de Arquivos Duplicados
- **Cenário:** Usuário faz upload de dois arquivos chamados `proposta.pdf` para o mesmo registro.
- **Comportamento Esperado:** O sistema deve renomear o arquivo no storage (ex: `proposta_1.pdf`) ou tratar como versões diferentes, preservando ambos os registros no banco com metadados distintos. 🔴 (Requer validação da política de nomenclatura).

## 3. Arquivos de Tamanho Zero
- **Cenário:** Usuário tenta anexar um arquivo vazio.
- **Comportamento Esperado:** O sistema deve validar o tamanho e impedir o upload, emitindo um erro amigável ao usuário. 🟢

## 4. Preview de Arquivos Corrompidos
- **Cenário:** O registro existe no banco, mas o arquivo físico no storage está inacessível ou corrompido.
- **Comportamento Esperado:** O `DocumentViewer` deve exibir uma mensagem de erro ("Não foi possível carregar o preview") em vez de quebrar a interface. 🟢
