# Como editar vídeos do Google Drive com o Claude

## 1. Configuração do ambiente (uma vez só)

Em **Editar ambiente** (clique no nome do ambiente no topo do chat):

**Acesso à rede → Personalizado → domínios permitidos** (um por linha, mantendo a lista padrão):

```
drive.google.com
drive.usercontent.google.com
huggingface.co
cas-server.xethub.hf.co
us.aws.cdn.hf.co
cdn-lfs.huggingface.co
cdn-lfs-us-1.hf.co
cas-bridge.xethub.hf.co
```

**Script de configuração** (instala a transcrição em toda sessão nova):

```bash
#!/bin/bash
pip install -q faster-whisper || true
```

Salve as alterações.

## 2. Compartilhar a pasta do Drive

Na pasta: **Compartilhar → Acesso geral → Qualquer pessoa com o link → Leitor**.

## 3. Abrir o chat

Novo chat no repositório `dev-vermfree`, ambiente **Default**, e cole:

```
/editar-videos-drive <LINK DA PASTA DO DRIVE>

Referência: edicao-de-video/referencias/ref-pinterest-01 (ou "sem referência")
Formato: vertical 9:16, 1080x1920, para Reels/TikTok
Marca: Vermfree

Meus comandos para estes vídeos:
- <cole aqui seus comandos, por exemplo: cortar silêncios, legenda com destaque, CTA no final...>

Autorizo editar e renderizar todos sem aprovação prévia. Me envie os MP4 finais.
```

## 4. Subir para o Drive (opcional, configuração única)

O Claude devolve os MP4 numa pasta do Drive por um Web App do Google Apps Script, que roda na sua conta. O conector do Drive não serve para isso porque não aceita arquivos grandes.

1. Abra https://script.google.com → **Novo projeto** e cole o conteúdo de [`apps-script/upload-drive.gs`](apps-script/upload-drive.gs).
2. Troque `TROQUE-POR-UMA-SENHA-LONGA` por uma senha longa sua e salve.
3. **Implantar → Nova implantação → App da Web**:
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
   Autorize o acesso quando pedir. Na tela "app não verificado", clique em *Avançado → continuar*.
4. Copie a **URL do app da Web** (termina em `/exec`).
5. Em **Editar ambiente**:
   - **Variáveis de ambiente:** `GAS_UPLOAD_URL=<URL /exec>` e `GAS_UPLOAD_TOKEN=<sua senha>`
   - **Acesso à rede:** adicione
     ```
     script.google.com
     script.googleusercontent.com
     ```

Depois, basta pedir: "sobe os MP4 finais para <link da pasta>". Quem tiver a URL e a senha consegue gravar no seu Drive: não as compartilhe. Se mudar o código do script, faça **Gerenciar implantações → Editar → Nova versão** para a URL continuar a mesma.

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| "403" ou "BLOQUEADO" ao baixar | domínio fora da lista de rede | adicionar o domínio no passo 1 |
| Download vem como HTML | pasta não compartilhada | passo 2 |
| Transcrição falha ao baixar o modelo | domínios do Hugging Face faltando | conferir todos os `hf.co` do passo 1 |
| `pip install` falha (pypi bloqueado) | "permitir gerenciadores de pacotes" desmarcado | marcar essa opção em Acesso à rede |
| "Faltam GAS_UPLOAD_URL..." ao subir | variáveis não configuradas | passo 4 |
| "token inválido" ao subir | senha diferente da do script | conferir `GAS_UPLOAD_TOKEN` e o `TOKEN` do script |
| Resposta em HTML ao subir | implantação não está como "Qualquer pessoa" ou a URL não é a `/exec` | refazer o passo 3 |
