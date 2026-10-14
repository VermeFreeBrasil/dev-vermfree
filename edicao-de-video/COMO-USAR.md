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

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| "403" ou "BLOQUEADO" ao baixar | domínio fora da lista de rede | adicionar o domínio no passo 1 |
| Download vem como HTML | pasta não compartilhada | passo 2 |
| Transcrição falha ao baixar o modelo | domínios do Hugging Face faltando | conferir todos os `hf.co` do passo 1 |
