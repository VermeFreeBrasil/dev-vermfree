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

Para o Claude devolver os MP4 direto numa pasta do Drive, ele usa `scripts/subir-drive.sh`, que fala com a API do Drive em seu nome. Configure uma vez:

1. **Projeto e API:** em https://console.cloud.google.com crie (ou escolha) um projeto e ative a **Google Drive API** (APIs e serviços → Biblioteca).
2. **Tela de consentimento:** APIs e serviços → Tela de consentimento OAuth → tipo **Externo**, preencha nome e e-mail e adicione sua conta em *Usuários de teste*. Depois clique em **Publicar app** (status *Em produção*). Em modo *Teste* o token expira em 7 dias. O aviso "app não verificado" é esperado; para uso próprio, clique em *Avançado → continuar*.
3. **Credencial:** APIs e serviços → Credenciais → Criar credenciais → **ID do cliente OAuth** → tipo **App para computador**. Anote o *ID do cliente* e a *chave secreta*.
4. **Refresh token:** no seu computador (com Python 3), na pasta do repositório:
   ```
   python3 .claude/skills/editar-videos-drive/scripts/autorizar-drive.py <ID_DO_CLIENTE> <CHAVE_SECRETA>
   ```
   Entre com a conta dona da pasta e autorize. O terminal imprime as três linhas `GDRIVE_...`.
5. **Ambiente:** em **Editar ambiente → Variáveis de ambiente**, cole as três linhas (`GDRIVE_CLIENT_ID`, `GDRIVE_CLIENT_SECRET`, `GDRIVE_REFRESH_TOKEN`). Em **Acesso à rede**, adicione também:
   ```
   oauth2.googleapis.com
   www.googleapis.com
   ```

Depois disso, basta pedir no chat: "sobe os MP4 finais para <link da pasta>". O token dá acesso total ao seu Drive: não o compartilhe e, se vazar, revogue em https://myaccount.google.com/permissions.

## Problemas comuns

| Sintoma | Causa | Solução |
|---|---|---|
| "403" ou "BLOQUEADO" ao baixar | domínio fora da lista de rede | adicionar o domínio no passo 1 |
| Download vem como HTML | pasta não compartilhada | passo 2 |
| Transcrição falha ao baixar o modelo | domínios do Hugging Face faltando | conferir todos os `hf.co` do passo 1 |
| `pip install` falha (pypi bloqueado) | "permitir gerenciadores de pacotes" desmarcado | marcar essa opção em Acesso à rede |
| "Falta a variável GDRIVE_..." ao subir | segredos não configurados | passo 4 |
| `invalid_grant` ao subir | token expirou (app em modo Teste) ou foi revogado | publicar o app e gerar de novo com `autorizar-drive.py` |
