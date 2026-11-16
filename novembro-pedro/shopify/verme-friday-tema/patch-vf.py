# Adapta os snippets do Eclipse 11.11 para a Verme Friday (27 e 28/11).
# Entrada: ../snippets/vf-1111-*.liquid (cópia do Eclipse). Saída: arquivos/.
import pathlib, sys
B = pathlib.Path(__file__).resolve().parent
S = B.parent / 'snippets'
O = B / 'arquivos'

def patch(nome, trocas):
    t = (S / nome).read_text()
    for a, b, *n in trocas:
        k = t.count(a)
        esp = n[0] if n else None
        if k == 0 or (esp is not None and k != esp):
            sys.exit(f'{nome}: "{a[:70]}" aparece {k}x (esperado {esp or ">=1"})')
        t = t.replace(a, b)
    (O / nome).write_text(t)
    print(nome, len(t), 'caracteres')

P18 = 'times: 0.82 | floor'
promo = [
 ('vf-1111-promo · "Eclipse 11.11" (Dia D VermeFree). Liga sozinho em 11/11 00h–23h59 (Brasília); teste com ?vf_diad=on / off.',
  'vf-1111-promo · Verme Friday (27 e 28/11, VermeFree). Liga sozinho em 27/11 00h até 28/11 23h59 (Brasília); teste com ?vf_black=on / off. Base: Eclipse 11.11.', 1),
 ("<b>11.11</b> · <b>20% OFF</b> + 5º grátis + frete grátis · só hoje", "<b>Verme Friday</b> · <b>18% OFF</b> + 5º grátis + frete grátis · só 27 e 28/11", 1),
 ("Date.parse('2026-11-11T00:00:00-03:00'), FIM = Date.parse('2026-11-11T23:59:59-03:00')",
  "Date.parse('2026-11-27T00:00:00-03:00'), FIM = Date.parse('2026-11-28T23:59:59-03:00')", 1),
 ("'vf_diad'", "'vf_black'"),
 ('// na simulação, o "dia" é o dia de hoje em Brasília', '// na simulação, as 48h começam hoje 00h em Brasília'),
 ('window.vfDiaD = sim || (agora >= INI && agora <= FIM);', 'window.vfDiaD = sim || agora <= FIM; // 16/11 (Pedro): sem trava de início (o tema só vai ao ar no dia); some sozinho depois do fim', 1),
 ('if (sim && (agora < INI || agora > FIM))', 'if (agora < INI || (sim && agora > FIM))', 1),
 ('fim = ini + 86399e3;', 'fim = ini + 172799e3;', 1),
 ('u = h >= 23 ? 2 : h >= 20 ? 1 : 0', 'u = h >= 47 ? 2 : h >= 44 ? 1 : 0', 1),
 ("'<b>🚨 Última hora</b> · o maior desconto do ano acaba à meia-noite' : u === 1 ? '<b>⏰ Últimas horas</b> · 20% OFF + 5º grátis acaba à meia-noite'",
  "'<b>🚨 Última hora</b> · a Verme Friday acaba à meia-noite' : u === 1 ? '<b>⏰ Última chance</b> · 18% OFF + 5º grátis acaba hoje às 23h59'", 1),
 ("t = Math.round(c * 0.8); el.innerHTML = '<b>' + brl(t) + '</b> hoje · 20% OFF <small>",
  "t = Math.floor(c * 0.82); el.innerHTML = '<b>' + brl(t) + '</b> · 18% OFF <small>", 1),
 # hero
 ('<p class="ve-kick"><span>11.11</span> <i data-ve-urg style="font-style:normal">só hoje · última lua nova de 2026</i></p>',
  '<p class="ve-kick"><span>Verme Friday</span> <i data-ve-urg style="font-style:normal">só 48h · 27 e 28/11</i></p>', 1),
 ('<h1 class="cap">Comece 2027 sem parasitas. <em>Só hoje, 20% OFF + o 5º grátis.</em></h1>',
  '<h1 class="cap">O maior desconto do ano voltou. <em>18% OFF + o 5º grátis.</em></h1>', 1),
 ('<p class="ve-sub">O maior desconto da história da VermeFree: <b>20% OFF em tudo</b>, <b>compre 4 e leve 5</b>, frete grátis sem mínimo e 3x sem juros. Pedindo hoje, você faz o protocolo na <b>última lua nova do ano (09/12)</b>. À meia-noite, acaba.</p>',
  '<p class="ve-sub">Só no site, só em 27 e 28/11: <b>18% OFF em tudo</b>, <b>compre 4 e leve 5</b>, frete grátis sem mínimo e 3x sem juros. Quem compra ganha o <b>guia de alimentos e o manual da desparasitação</b>. Dois dias. Depois, acabou.</p>', 1),
 ('<div class="ve-n">11.11</div>', '<div class="ve-n">48h</div>', 1),
 ('quando a lua fechar, o desconto acaba', 'quando a sombra fechar, o desconto acaba', 1),
 ('<span data-ve-f>0%</span> do 11/11 já passou', '<span data-ve-f>0%</span> da Verme Friday já passou', 1),
 # montador
 ('<h2 class="cap">Leve 5, pague 4. <em>E ainda 20% OFF em tudo.</em></h2>', '<h2 class="cap">Leve 5, pague 4. <em>E ainda 18% OFF em tudo.</em></h2>', 1),
 ('<p>Monte o pedido da casa. Tudo com 20% OFF; com 4, ganha um Kit Kids de 2 a 4 anos; com 5, o de menor valor sai grátis. Desconto automático, só hoje.</p>',
  '<p>Monte o pedido da casa. Tudo com 18% OFF; com 5, o de menor valor sai grátis. Desconto automático, só em 27 e 28/11.</p>', 1),
 ('{%- assign por = v.price | times: 0.8 -%}', '{%- assign por = v.price | ' + P18 + ' -%}', 1),
 ('<i>-20%</i>', '<i>-18%</i>', 1),
 ('aria-label="Benefícios do 11/11"', 'aria-label="Benefícios da Verme Friday"', 1),
 ('<li data-ve-lad="4"><span>🎁</span><b>Kit Kids</b><small>com 4</small></li>', '<li data-ve-lad="4"><span>📘</span><b>Guia e manual</b><small>em todo pedido</small></li>', 1),
 ('Garantia de 7 dias · Só no 11/11', 'Garantia de 7 dias · Só em 27 e 28/11', 1),
 ('<div class="ve-trilho"><span>20% OFF em tudo</span><span>Compre 4, leve 5</span><span>Frete grátis sem mínimo</span><span>15% de cashback nos 100 primeiros</span><span><a href="/pages/regulamento-sorteio-11-11" style="color:inherit">Sorteio de um kit entre os 300 primeiros</a></span></div>',
  '<div class="ve-trilho"><span>18% OFF em tudo</span><span>Compre 4, leve 5</span><span>Frete grátis sem mínimo</span><span>Guia e manual digitais</span><span>Sorteio de um kit entre os 300 primeiros</span></div>', 1),
 # FAQ
 ('Perguntas <em>do 11/11.</em></h2><p>Tudo o que vale hoje, sem letra miúda.</p>', 'Perguntas <em>da Verme Friday.</em></h2><p>Tudo o que vale em 27 e 28/11, sem letra miúda.</p>', 1),
 ('soma com os 20% OFF.</p></details>', 'soma com os 18% OFF.</p></details>', 1),
 ('      <details><summary>Como ganho o Kit Kids de 2 a 4 anos?</summary><p>Na compra de 4 protocolos, um Kit Kids de 2 a 4 anos vai de presente no seu pedido.</p></details>\n', '', 1),
 ('      <details><summary>O que é o cashback de 15%?</summary><p>Os 100 primeiros pedidos do dia ganham 15% do valor pago em crédito para a próxima compra. O crédito fica disponível em até 3 dias e vale até 30/11 às 23h59.</p></details>\n',
  '      <details><summary>Como recebo o guia e o manual?</summary><p>Quem compra em 27 ou 28/11 recebe o guia de alimentos antiparasitários e o manual da desparasitação, digitais, no e-mail.</p></details>\n', 1),
 ('<p>Os 300 primeiros pedidos do 11/11 concorrem a um Kit Família VermeFree. O resultado sai no dia 13/11. <a href="/pages/regulamento-sorteio-11-11" style="color:inherit;text-decoration:underline">Ver o regulamento</a>.</p>',
  '<p>Os 300 primeiros pedidos da Verme Friday concorrem a um kit VermeFree à sua escolha. Quem está no grupo VIP compra a partir da meia-noite de 27/11 e sai na frente.</p>', 1),
 ('<p>Sim. Hoje o frete é grátis para todos os pedidos, sem valor mínimo.</p>', '<p>Sim. Em 27 e 28/11 o frete é grátis para todos os pedidos, sem valor mínimo.</p>', 1),
 ('<details><summary>Por que comprar hoje?</summary><p>Porque o desconto acaba às 23h59 e porque quem pede hoje recebe a tempo de fazer a preparação e começar o protocolo na última lua nova de 2026, em 09/12. Entra em 2027 com a desparasitação feita.</p></details>',
  '<details><summary>Até quando vale?</summary><p>Até 28/11 às 23h59 (horário de Brasília). Depois disso, os preços voltam ao normal.</p></details>', 1),
 ('<p>Depois da meia-noite, os preços voltam e a última lua nova de 2026 passa sem você. Comece 2027 sem parasitas.</p>',
  '<p>Em 28/11 às 23h59 os preços voltam ao normal. Dois dias. Depois, acabou.</p>', 1),
 ('Só no dia 11/11, até 23h59 (horário de Brasília).', 'Só em 27 e 28/11, até 28/11 às 23h59 (horário de Brasília).', 1),
 ('paga: Math.round((cheio - gratis) * 0.8)', 'paga: Math.floor((cheio - gratis) * 0.82)', 1),
 ("mt.querySelector('[data-ve-lad=\"4\"]').classList.toggle('on', n >= 4);", "mt.querySelector('[data-ve-lad=\"4\"]').classList.toggle('on', n >= 1);", 1),
 ("n === 0 ? 'Todo pedido no 11/11 tem <b>frete grátis</b>.' : n < 4 ? 'Mais <b>' + (4 - n) + (4 - n === 1 ? ' protocolo' : ' protocolos') + '</b> e ganhe o <b>Kit Kids</b> de presente' : n === 4 ? '<b>Kit Kids garantido.</b> Mais 1 e o <b>5º sai grátis</b>' : '🎉 <b>Frete, Kit Kids e o 5º grátis</b> liberados'",
  "n === 0 ? 'Todo pedido na Verme Friday tem <b>frete grátis</b>.' : n < 4 ? 'Mais <b>' + (5 - n) + ' protocolos</b> e o <b>5º sai grátis</b>' : n === 4 ? 'Mais 1 e o <b>5º sai grátis</b>, pelo preço de 4' : '🎉 <b>Frete grátis e o 5º grátis</b> liberados'", 1),
 # PDP
 ('<span class="off">−20% hoje</span>', '<span class="off">−18% OFF</span>', 1),
 ('<p class="ve-kick"><span>11.11</span> só hoje · acaba em <b data-ve-t>--</b></p>', '<p class="ve-kick"><span>Verme Friday</span> só 48h · acaba em <b data-ve-t>--</b></p>', 1),
 ('<p class="desc" style="color:#fff;font-weight:700">🌑 Última lua nova de 2026: peça hoje e comece 2027 sem parasitas.</p>',
  '<p class="desc" style="color:#fff;font-weight:700">⚫ O maior desconto do ano voltou: só em 27 e 28/11.</p>', 1),
 ('times: 0.8 | money', P18 + ' | money'),
 ('times: 0.8 | divided_by: 3', P18 + ' | divided_by: 3'),
 ('<small>só hoje · amanhã volta para <b>{{ v.price | money }}</b></small>', '<small>só até 28/11 · depois volta para <b>{{ v.price | money }}</b></small>', 1),
 ('Aproveite o 11.11 nos protocolos: 20% OFF, o 5º grátis e frete grátis.', 'Aproveite a Verme Friday nos protocolos: 18% OFF, o 5º grátis e frete grátis.', 1),
 ('Ver os protocolos com 20% OFF →', 'Ver os protocolos com 18% OFF →', 1),
 ('        <li><b>15% de cashback</b>nos 100 primeiros pedidos</li>\n', '', 1),
 ('<li><a href="/pages/regulamento-sorteio-11-11" style="color:inherit"><b>Sorteio de um kit</b>entre os 300 primeiros</a></li>', '<li><b>Sorteio de um kit</b>entre os 300 primeiros</li>', 1),
 ('<p>Última lua nova de 2026: comece 2027 sem parasitas. À meia-noite o {{ titulo }} volta para {{ v.price | money }}. Hoje sai por',
  '<p>Em 28/11 às 23h59 o {{ titulo }} volta para {{ v.price | money }}. Na Verme Friday sai por', 1),
 ('<small>20% OFF acaba em <b data-ve-t>--</b></small>', '<small>18% OFF acaba em <b data-ve-t>--</b></small>', 1),
 # visual Black: lua branca/cinza (sem verde), ícone do 5º grátis
 ('background:radial-gradient(circle at 38% 35%,#fbf8ea 0,#e9efd9 35%,#c0de96 75%,#93b874 100%);box-shadow:0 0 80px #c0de9640,0 0 200px #c0de9622,inset -20px -30px 60px #6f8f5555}',
  'background:radial-gradient(circle at 38% 35%,#ffffff 0,#ececec 35%,#bdbdbd 75%,#8a8a8a 100%);box-shadow:0 0 80px #e0262f40,0 0 200px #e0262f22,inset -20px -30px 60px #00000055}', 1),
 ('#a7c08a55 0 7%', '#9a9a9a55 0 7%', 1), ('#a7c08a44 0 5%', '#9a9a9a44 0 5%', 1), ('#a7c08a44 0 9%', '#9a9a9a44 0 9%', 1),
 ('--lime:#c0de96', '--lime:#ff4a52', 1), ('color:#c0de96!important', 'color:#ff4a52!important', 1),
 ('<li data-ve-lad="5"><span>🌑</span>', '<li data-ve-lad="5"><span>🏆</span>', 1),
]
kits = [
 ('seletor de kits da PDP no 11/11', 'seletor de kits da PDP na Verme Friday (27 e 28/11)', 1),
 ('{%- assign kk = true -%}', '{%- assign kk = false -%}', 1),
 ('{%- assign p80 = v.price | times: 0.8 -%}', '{%- assign p80 = v.price | ' + P18 + ' -%}', 1),
 ('<em>−36%</em></b><small>20% OFF + o 5º grátis</small>', '<em>−34%</em></b><small>18% OFF + o 5º grátis</small>', 1),
 ('<em>−20%</em>', '<em>−18%</em>', 1),
 ('  <p class="ve-lua">🌑 Chega a tempo de começar na <b>última lua nova de 2026 (09/12)</b></p>\n', '  <p class="ve-lua">📘 Guia de alimentos + manual da desparasitação <b>digitais, no seu e-mail</b></p>\n', 1),
 ('#c0de96', '#ff4a52'), ('color:#0c2219', 'color:#fff', 1),
 ('Math.round(preco * 0.8 * (k - gratis(k)))', 'Math.floor(preco * 0.82 * (k - gratis(k)))', 1),
 ("{ q: 1, i: '🌑', b: '20% OFF', s: '+ frete grátis' }", "{ q: 1, i: '⚫', b: '18% OFF', s: '+ frete grátis' }", 1),
 ("'🎉 <b>Tudo liberado:</b> 20% OFF, '", "'🎉 <b>Tudo liberado:</b> 18% OFF, '", 1),
]
cart = [
 ('carrinho no 11/11 (tema Eclipse). Só aparece com html.ve-on (dia 11 ou prévia ?vf_diad=on).', 'carrinho na Verme Friday (27 e 28/11). Só aparece com html.ve-on (27–28/11 ou prévia ?vf_black=on).', 1),
 ('{%- assign kk = true -%}', '{%- assign kk = false -%}', 1),
 ('background:#c0de96', 'background:#fff', 2),
 ('<span>🌑 11.11 · descontos aplicados</span>', '<span>⚫ Verme Friday · descontos aplicados</span>', 1),
 ('<b>20% OFF em tudo</b>, já no preço', '<b>18% OFF em tudo</b>, já no preço', 1),
 ('    <li><i>✓</i><span><b>15% de cashback</b> nos 100 primeiros pedidos</span></li>\n', '    <li><i>✓</i><span><b>Guia e manual digitais</b> no seu e-mail</span></li>\n', 1),
]
O.mkdir(exist_ok=True)
patch('vf-1111-promo.liquid', promo)
patch('vf-1111-kits.liquid', kits)
patch('vf-1111-cart.liquid', cart)
for n in ['vf-1111-promo.liquid','vf-1111-kits.liquid','vf-1111-cart.liquid']:
    t = (O/n).read_text()
    for w in ['11.11','11/11','0.8 ','0.8)','20%','cashback','Kit Kids','lua nova','2027','vf_diad','regulamento']:
        if w in t: print('  sobrou', repr(w), 'em', n, t.count(w))
