# Briefing para o chat de dezembro · VermeFree

Escrito em 26/11/2026, a partir de tudo o que foi feito em novembro no chat do Pedro Lage (Marketing/CRO). Quem abrir o chat de dezembro lê este arquivo primeiro, inteiro, antes de qualquer tarefa.

O acompanhamento de novembro continua no chat antigo até 30/11. A partir de 01/12, este chat novo assume todas as tarefas de dezembro da VermeFree.

---

## 1. Regras fixas (valem desde o primeiro minuto)

1. **Responder sempre em português do Brasil**, com frases curtas e tabelas quando ajudarem.
2. **SÓ VermeFree.** Nunca Revita, nunca Botanika, nem como sugestão. Se o Pedro citar Revita ou Botanika, **parar na hora, avisar e não fazer nada**. Se ele mandar um print que mistura marcas, responder só a parte da VermeFree.
3. **Nada é executado sem o ok do Pedro no chat:** Shopify (temas, descontos, metaobjetos), Alliance OS (status, comentários), disparos, publicações e subidas no Drive. Preparar, mostrar e testar em prévia pode. Aplicar só depois do "pode".
4. **"Não inventa moda se não tiver lá":** toda copy, card e claim tem que estar na ficha da oferta ou num material já aprovado. Sem sintomas, sem promessa médica, sem médico como aval.
5. **Escopo:** em novembro foi só promoções e cronograma, sem Growth (SEO, CRO, LP comparativa, ManyChat, artigos) e sem pesquisa de indicação. **Para dezembro, confirmar com o Pedro no primeiro dia se o escopo continua assim.**
6. **Repositório ligado ao Lovable:** nunca force-push, rebase ou amend em commit já enviado. Commit e push só na branch indicada pela sessão.
7. **Segredos:** `DRIVE_UPLOAD_TOKEN` só em variável de ambiente (ou num arquivo na pasta temporária do chat), nunca no repositório nem no chat. O token da Meta CAPI fica só na Vercel. **Sem dado pessoal de cliente no repositório**: nada de nome, e-mail, telefone ou endereço. Lista de pedidos só com número do pedido, e fora do repositório.
8. **Rodapé de commit:** usar as linhas de atribuição que a sessão indicar.

---

## 2. Como o Pedro trabalha (padrões que ele cobra)

- **Uma tarefa por vez.** Ele pergunta "qual a próxima tarefa?" o tempo todo. A resposta é curta: o que vence, o que depende de quem, e uma sugestão de ordem.
- **Mostrar antes de executar:** prévia, print ou tabela do antes e depois, e então "posso aplicar?".
- **Vídeos:** editar **1**, mandar no chat, esperar a aprovação e só depois editar o resto. Todo vídeo vai pro chat antes de subir. Depois de aprovado, sobe na pasta que ele indicar.
  - Ele quer cortes, falas e efeitos "caprichados ao máximo".
  - **Tamanho:** o receptor do Drive aceita ~35 MB e o conector do Drive, 10 MB. Comprimir pra ~25–27 MB (1080×1920) **antes** de prometer a subida. Ele disse que falha de upload por tamanho é "inadmissível".
- **Estáticos:** fundo preto com vermelho e branco, produto real e só mãos (sem rosto).
  - **Sem preço total.** No máximo a parcela "3x de R$ … sem juros", arredondada pra baixo igual ao site, e em novembro as últimas peças saíram sem preço nenhum. Kit Família sem preço ("ganha brinde").
  - Falar **"protocolo"**, não "kit". O nome de produto (Kit Família) fica.
  - Gatilhos que ele pede: urgência, desejo, benefício e dor latente (dor só do que já foi aprovado em roteiro).
- **Nomes no Drive:** a equipe renomeia os criativos pro padrão do tráfego (ex.: `AD152_01_LOJA_VID_LUA-NOVA_N.mp4`). Numa versão corrigida, manter o código e acrescentar um sufixo (ex.: `_SEM5`) e dizer quais antigos apagar, numa tabela APAGAR/MANTER.
- **Mensagens prontas:** quando termina uma entrega, ele quer o texto pronto pra mandar pro Otávio (tráfego), a Sarah (CRM) ou a Poly (atendimento). Tom direto, com link da pasta e lista do que mudou.
- **Alliance:** comentar e marcar como feito só com o ok dele. O MCP do Alliance está na conta do Vitor, então começar os comentários com "(Pedro)". Uma tarefa-mãe não fecha com subtarefa aberta.

---

## 3. Rotina diária (gatilho às 08h37)

Em novembro havia uma rotina agendada que disparava todo dia às 08h37 (horário de Brasília). **Criar a mesma para dezembro** (com o ok do Pedro), apontando para `dezembro-vermefree/`:

1. **Fechar o dia anterior:** `git pull`, escrever `diario/<ontem>.md` (feito, pela metade, travado e com quem, decisões, o que fica pra hoje), atualizar `03-status.md`, `para-marcar-no-alliance.md` e `04-decisoes-e-pendencias.md`, ajustar `02-calendario.md` se algum prazo mudou, e fazer commit e push.
2. **Abrir o dia:** mensagem curta com (a) ontem em 3 linhas, (b) o que vence hoje e nos próximos 2 dias, com horário, (c) o que esperar de quem e quem cobrar, (d) atrasados, (e) o que já dá pra marcar no Alliance, (f) a ordem sugerida, (g) as reuniões. Terminar pedindo o ok pra primeira tarefa.
3. **Conferências de campanha (só leitura)** em todo dia de virada: tema virou MAIN? descontos ACTIVE/EXPIRED? carrinho com 1/3/5 itens? tela de site fechado e link do VIP? Agendar com `send_later` 5 minutos depois de cada virada e avisar o Pedro em 2 ou 3 linhas.

---

## 4. Estrutura de pastas (copiar a de novembro)

| Arquivo | Para que serve |
|---|---|
| `00-LEIA-PRIMEIRO.md` | Contexto fixo do mês: campanhas, fichas, metas, quem é quem, regras |
| `01-plano-de-execucao.md` | Prioridades e o jeito de fazer cada tipo de tarefa |
| `02-calendario.md` | Dia a dia: o que vence, o que chega dos outros, viradas |
| `03-status.md` | Placar tarefa por tarefa (✅ 🟡 ⬜), com prazo, id do Alliance e link da entrega |
| `04-decisoes-e-pendencias.md` | Perguntas abertas (P1, P2…) com dono e prazo, e decisões com data |
| `para-marcar-no-alliance.md` | O que foi concluído aqui e precisa ser marcado no Alliance |
| `diario/AAAA-MM-DD.md` | Registro do dia |
| `shopify/<assunto>/LEIA.md` + `antes/` e `depois/` | Toda mudança de tema guarda o arquivo de antes (pra voltar) e o de depois, com md5 |
| `criativos/<campanha>/` | Geradores, copy.md, provas e PNGs |

O modelo completo está em `novembro-pedro/` (ler `00-LEIA-PRIMEIRO.md`, `02-calendario.md` e um diário de dia de virada, ex.: `diario/2026-11-20.md`).

---

## 5. Como montar o mês (primeira semana de dezembro)

1. **Alliance OS:** `listar_campanhas` e `obter_ficha_oferta` de cada campanha de dezembro da VermeFree. A ficha é a fonte oficial de preço, cupom, datas, frete e brinde: usar os valores dela, não os da descrição da tarefa. Depois `buscar_tarefas` (marca VermeFree, responsável Pedro Lage, o mês inteiro) e `listar_agenda`.
2. Montar `02-calendario.md` e `03-status.md` com todas as tarefas, prazos e ids.
3. Listar no `04-decisoes-e-pendencias.md` o que está ambíguo na ficha e levar pro Pedro ou pro Vitor.
4. Abrir o plano: o que é Shopify (tema, desconto, brinde), o que é criativo (vídeo, estático) e o que é CRM ou mensagem.

---

## 6. Ferramentas e receitas que funcionaram

### Shopify (MCP · Admin GraphQL)
- **Descontos:** ler com `discountNodes` (não `codeDiscountNodes`). Criar e agendar com `startsAt` e `endsAt` em UTC (00h de Brasília = 03:00Z). Desativar sem apagar com `discountAutomaticDeactivate`, que deixa EXPIRED e pode ser religado. Conferir `combinesWith` e `discountClasses`: dois descontos ORDER não somam e a loja aplica o maior; cupom de influenciadora (PRODUCT) soma com o desconto ORDER.
- **Arquivos de tema** (só em tema não publicado; o MAIN é bloqueado): `stagedUploadsCreate` (FILE, PUT), depois `curl -X PUT --data-binary @arquivo`, depois `fileCreate`, depois pegar a `url` do GenericFile, depois `themeFilesUpsert` com `body {type: URL}`, e por fim **conferir o `checksumMd5`** com o md5 local.
- **Prévia de tema:** `https://vermefree.com.br/?preview_theme_id=<ID>` com Playwright (390×844 pro celular). Parâmetros dos temas de campanha: `vf_fechado=on/off` e `vf_hora=03:00` simulam a tela de site fechado, e `?acesso=vip` libera o VIP no site real.
- **Handles certos dos produtos:** `protocolo-desparasitacao-adulto-vermefree`, `antiparasitario-infantil-natural-vermefree-kids-2-a-4-anos`, `antiparasitario-infantil-natural-vermefree-kids-5-a-9-anos`, `kit-familia-vermefree-2-adultos-2-criancas`, `oleo-de-alho-desodorizado-500mg`. Com handle errado, a página cai e o teste "passa" sem testar nada, como aconteceu em 24/11.
- **Temas de campanha:** cada campanha tem seu tema com nome "N · Campanha · início a fim". **O Pedro agenda a publicação no app Supreme Theme Scheduler**, ao qual o Claude não tem acesso, então pedir print pra conferir. O tema padrão de 01/12 é "★ PADRÃO · site normal" (169143533787).
- **Brinde por valor:** Shopify Flow marca a tag no pedido (ex.: `brinde-vw-kit-adulto` acima de R$ 1.000). Conferir toda manhã só lendo: pedidos acima do valor têm a tag?

### Google Drive
- **Subir arquivos:** skill `subir-no-drive` (`bash .claude/skills/subir-no-drive/scripts/sobe-drive.sh --folder <ID> arquivos`). Grava como operacional.vermfree, até ~35 MB por arquivo. Não apaga nem renomeia nada no drive compartilhado da VermeFree, porque não tem permissão: quem apaga é o Pedro.
- **Criar pasta:** conector do Drive, `create_file` com `contentMimeType: application/vnd.google-apps.folder` e `parentId`.
- **Listar pasta:** `search_files` com `parentId = '<ID>'`.

### Vídeo (pipeline usado em novembro)
Ferramentas copiadas para `novembro-pedro/ferramentas/video/`. As artes usadas pelos cards estão em `novembro-pedro/ferramentas/art/`. Com o plano dentro de `ferramentas/video/planos-vf/`, o `ART` do `editar-vf.js` já aponta pra lá; outras artes (fotos de produto recortadas) podem precisar ser copiadas de novo.

1. Baixar do Drive: `.claude/skills/editar-videos-drive/scripts/baixar-drive.sh <pasta> <id>:<nome> …`, rodando **um download por vez**. Dois downloads ao mesmo tempo corrompem os arquivos.
2. Transcrever: `transcrever_onnx.py`, o Whisper ONNX que roda local. Em janela longa ele inventa frases repetidas, então conferir em janelas de ~15 s.
3. Achar as falas: `chunks.py <video> <saida>`.
4. Plano JSON por vídeo: `segs` (de, até, legenda, zoom, fx: tarja/botão), `cards` (tipo e momento de entrada) e `legFim`. Exemplos em `ferramentas/video/planos-vf/`.
5. Renderizar: `node editar-<campanha>.js planos/<id>.json`. É Playwright pra camada gráfica com ffmpeg, e leva ~10 min por vídeo de 40 s.
6. Conferir: folha de contato (`ffmpeg -vf "fps=1/2,scale=144:256,tile=9x3"`) e o último quadro. Olhar a imagem antes de mandar.
7. Comprimir pra ~27 MB: `-b:v $((27*8192/duração - 200))k`, aac 160k, `+faststart`.
8. Usar sempre `ffmpeg -nostdin` dentro de loops e caminho absoluto em `rm`.
9. Rodar renders longos com `run_in_background` e acompanhar com `Monitor` no log.

**Universais** (vídeos e estáticos do mês) não citam data, % nem nome de campanha. Quem leva a oferta é a copy do anúncio.

### Estáticos
O gerador aprovado é o visual "neon": `novembro-pedro/criativos/verme-friday/gerar8-sem5.cjs`, com as cenas reais de produto em `cenas6/`, geradas no Higgsfield a partir das fotos reais. Gera 4:5 e 9:16 de cada peça. Conferir montando uma folha de prova com ffmpeg `hstack`/`vstack` e olhando a imagem antes de mandar.

### Alliance OS (MCP)
`buscar_tarefas`, `obter_tarefa` (mostra subtarefas e travas de conclusão), `comentar_tarefa`, `atualizar_tarefa` (status "feito"), `listar_agenda` e `obter_ficha_oferta`. Se uma escrita der erro de conexão, **ler a tarefa antes de tentar de novo**.

### Agendamentos
- `send_later` para conferências pontuais.
- A rotina diária é um scheduled task na própria sessão.
- Se a oferta mudar, **atualizar o texto das conferências já agendadas** (em 25/11 elas ainda testavam o "5º grátis", que tinha saído da oferta).

---

## 7. Lições de novembro (não repetir)

- **Mudança de oferta em cima da hora** (24/11: saiu o "compre 4, leve 5" da Verme Friday). Varrer tudo de uma vez: desconto na Shopify, tema inteiro (barra, banner, seletor de quantidade, carrinho, FAQ, letra miúda, tela de site fechado), vídeos, estáticos, copy dos anúncios e conferências agendadas. Avisar o Pedro do que está fora do chat (estáticos já no tráfego, copy do Otávio).
- **Upload que falhou por tamanho:** ver o tamanho do arquivo antes de prometer subir.
- **Brutos apagados da pasta temporária:** pra refazer vídeo é preciso baixar de novo. Guardar os ids do Drive dos brutos no diário.
- **Prévia com handle errado:** a página cai e parece estar tudo certo. Confirmar que o elemento testado existe na página.
- **Card cobrindo texto:** depois de mudar um card, olhar o quadro em tamanho grande, não só a folha de contato.
- **Reativar cupom pra uma venda:** confirmar o código exato (a Poly pediu "RECOVERY11" e o certo era "RECOVERY1111"). Explicar se soma ou não com a campanha no ar, e reativar com fim no mesmo dia, pra expirar sozinho.

---

## 8. Quem é quem

| Pessoa | Papel | O que costuma pedir ou entregar |
|---|---|---|
| Vitor Gutierrez | Coordena campanhas, aprova fichas e custos | Decide oferta, descontos de kit, cupons e regras |
| Gabriel Ferreira | Sócio · oferta e preço | Grava vídeos com a Mafe |
| Otávio Saldanha | Tráfego | Recebe todos os criativos e precisa saber quando algo muda |
| Sarah Brito | CRM: grupo VIP, disparos, e-mails | Link do grupo VIP; envia guia e manual pra lista de compradores |
| Mafe (Maria Fernanda) | Gravação | Manda os brutos dos vídeos |
| Ítalo Neves | Roteiros | Roteiros dos vídeos |
| Polyana (Poly) | Atendimento | Pede cupons pontuais pra fechar venda |

Reuniões fixas: daily VermeFree de seg a sex às 09h40, reunião de KPI na quinta às 10h35 e reunião de CRO/Site na terça às 13h. Conferir em `listar_agenda`.

---

## 9. O que fica de novembro para o começo de dezembro

| Quando | O quê | Onde ver |
|---|---|---|
| 01/12 00h | O tema ★ PADRÃO entra pelo Supreme e os 12 cupons pausados voltam sozinhos (agendados) | `novembro-pedro/shopify/volta-0112/lista.md` |
| 01/12 00h05 | 29 cupons de influenciadora de 2% pra 5% (a % não agenda: fazer na mão, com ok) | mesmo arquivo |
| 01/12 | Decisão do Vitor: os descontos de kit (5/10/15/20%) voltam? O ★ PADRÃO mostra "5% 1ª compra" e preço com 10%, o que só vale se voltarem (P46/P49) | `novembro-pedro/04-decisoes-e-pendencias.md` |
| 02/12 18h | Sorteio da Verme Friday (300 primeiros pedidos pagos de 27–28/11) e fechar as 2 tarefas do sorteio no Alliance | `novembro-pedro/shopify/sorteio-verme-friday/como-sortear.md` |

O chat de novembro fecha o resto até 30/11 e escreve o último diário. Se alguma coisa de cima ficar pendente, ela aparece no diário de 30/11.
