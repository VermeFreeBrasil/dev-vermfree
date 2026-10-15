---
name: editar-videos-drive
description: Edite em lote vídeos verticais que estão numa pasta ou link do Google Drive, aplicando as skills cp-* e os comandos do usuário, e entregue os MP4 finais. Use quando o usuário enviar um link de pasta ou arquivo do Drive e pedir para editar os vídeos.
---

# Editar vídeos do Drive

Fluxo de ponta a ponta: listar → baixar → transcrever → planejar → renderizar → entregar. Trabalhe na pasta de rascunho da sessão (scratchpad), nunca no repositório. Não faça commit de vídeos.

## 1. Pré-requisitos (confira antes de começar)

Teste a rede e as ferramentas com um comando só:

```bash
for u in https://drive.usercontent.google.com https://huggingface.co https://cas-server.xethub.hf.co https://us.aws.cdn.hf.co; do printf "%s " $u; curl -s -o /dev/null -w "%{http_code}\n" -m 10 $u || echo BLOQUEADO; done
python3 -c "import faster_whisper" && which ffmpeg
```

- `BLOQUEADO` (código 000) significa que a rede do ambiente não libera o domínio. Peça ao usuário para adicioná-lo em **Editar ambiente → Acesso à rede → Personalizado → domínios permitidos**, com a lista de [COMO-USAR](../../../edicao-de-video/COMO-USAR.md). A mudança vale na hora, sem novo chat.
- Sem `faster_whisper`, rode `pip install -q faster-whisper`.

## 2. Listar e baixar

1. Extraia o ID do link (`/folders/<ID>` ou `/file/d/<ID>`).
2. Para uma pasta, liste com o conector do Drive: `search_files` com `parentId = '<ID>'` e `excludeContentSnippets: true`. Siga o `nextPageToken` até acabar. Filtre `mimeType` de vídeo.
3. Baixe com `scripts/baixar-drive.sh <destino> <id>:<nome> ...`. O conector não baixa arquivos acima de 10 MB; não tente.
4. Se um arquivo falhar com HTML ou 403, peça ao usuário para compartilhar a pasta como **Qualquer pessoa com o link → Leitor**.

## 3. Preparar cada vídeo

- `ffprobe` para duração, resolução, FPS e rotação. Converta para H.264, 30 fps CFR, 1080×1920 antes de editar.
- Transcreva com `python3 scripts/transcrever.py <video> <saida.json>`. Use a transcrição como fonte da fala; marque palavras com `p < 0.5` como incertas.
- Gere uma folha de contato (ffmpeg `fps=1,tile`) para ver enquadramento e gestos.

## 4. Planejar a edição

- Comece pelos comandos do usuário. Eles prevalecem sobre as skills e a referência.
- Se houver referência salva, siga `edicao-de-video/referencias/<id>/prompt-de-recriacao.txt` e a receita.
- Use as skills cp-* conforme a necessidade: `cp-estilo-por-referencia` (aplicar a referência), `cp-direcao-de-edicao` (sequência e foco), `cp-lettering-com-hierarquia` (textos), `cp-apresentador-em-cena` (enquadramento), `cp-motion-explicativo` (explicações), `cp-variacoes-controladas` (versões de gancho e CTA).
- Identidade Vermfree: leia as cores em `src/` (variáveis `--primary` e `--accent` do CSS) e use fontes de `@fontsource` (npm). Não use b-roll, músicas ou marcas de terceiros sem autorização.
- Em lote, defina um plano-base e aplique o mesmo sistema visual a todos os vídeos. Valide primeiro um vídeo (amostra interna) e depois replique.

## 5. Renderizar

- Remotion 4 com Chromium local: `--browser-executable=/opt/pw-browsers/chromium`. Anime por frames, sem CSS animation.
- Saída: MP4 H.264, 1080×1920, 30 fps, áudio AAC, sem cortar a fala.
- Confira cada render: folha de contato do resultado, duração igual à planejada, áudio presente e textos legíveis.

## 6. Entregar

- Envie cada MP4 ao usuário com `SendUserFile` e informe o caminho absoluto completo.
- Se o usuário pedir os arquivos no Drive, suba com `python3 -I scripts/subir-drive.py <id-ou-link-da-pasta> <arquivo> ...` (Web App do Apps Script em `edicao-de-video/apps-script/upload-drive.gs`; envia em pedaços de 8 MB, sem limite de tamanho, e pula nomes que já existem na pasta). Ele precisa de `GAS_UPLOAD_URL` e `GAS_UPLOAD_TOKEN` no ambiente e da rede liberando `script.google.com` e `script.googleusercontent.com`. Se o usuário colar a URL e a senha no chat, passe-as só como variáveis no comando. Se faltar algo, diga exatamente o quê e aponte a seção **Subir para o Drive** de [COMO-USAR](../../../edicao-de-video/COMO-USAR.md); entregue pelo chat enquanto isso. Não use o conector para vídeos: ele só aceita o conteúdo embutido na chamada.
- Termine com uma nota curta por vídeo: regras aplicadas, adaptações e limites (palavras incertas da transcrição, trechos sem imagem de apoio).
