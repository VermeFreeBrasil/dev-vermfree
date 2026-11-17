# Adapta os snippets do Eclipse 11.11 para o Free Monday (30/11): escada 10% (1 un) · 12% (3+) · 15% (5+),
# frete grátis a partir de R$ 299, 1 kit adulto de brinde acima de R$ 1.000, "última chance de desparasitar no ano".
# Sem trava de início (pedido do Pedro, 16/11): a campanha aparece sempre e some sozinha depois de 30/11 23h59.
# Entrada: ../snippets/vf-1111-*.liquid (cópia do Eclipse). Saída: arquivos/.
import pathlib, sys
B = pathlib.Path(__file__).resolve().parent
S = B.parent / 'snippets'
O = B / 'arquivos'

def patch(nome, trocas):
    t = (S / nome).read_text()
    for a, b, *n in trocas:
        k = t.count(a); esp = n[0] if n else None
        if k == 0 or (esp is not None and k != esp):
            sys.exit(f'{nome}: "{a[:70]}" aparece {k}x (esperado {esp or ">=1"})')
        t = t.replace(a, b)
    (O / nome).write_text(t); print(nome, len(t), 'caracteres')

P90 = 'times: 0.9'
promo = [
 ('vf-1111-promo · "Eclipse 11.11" (Dia D VermeFree). Liga sozinho em 11/11 00h–23h59 (Brasília); teste com ?vf_diad=on / off.',
  'vf-1111-promo · Free Monday (30/11, VermeFree). Sem trava de início (o tema só vai ao ar no dia); some sozinho depois de 30/11 23h59. Base: Eclipse 11.11.', 1),
 ("<b>11.11</b> · <b>20% OFF</b> + 5º grátis + frete grátis · só hoje", "<b>Free Monday</b> · até <b>15% OFF</b> + frete grátis acima de R$ 299 · só hoje", 1),
 ("Date.parse('2026-11-11T00:00:00-03:00'), FIM = Date.parse('2026-11-11T23:59:59-03:00')",
  "Date.parse('2026-11-30T00:00:00-03:00'), FIM = Date.parse('2026-11-30T23:59:59-03:00')", 1),
 ("'vf_diad'", "'vf_fm'"),
 ('window.vfDiaD = sim || (agora >= INI && agora <= FIM);', 'window.vfDiaD = sim || agora <= FIM;', 1),
 ('if (sim && (agora < INI || agora > FIM))', 'if (agora < INI || (sim && agora > FIM))', 1),
 ("'<b>🚨 Última hora</b> · o maior desconto do ano acaba à meia-noite' : u === 1 ? '<b>⏰ Últimas horas</b> · 20% OFF + 5º grátis acaba à meia-noite'",
  "'<b>🚨 Última hora</b> · a última oferta do mês acaba à meia-noite' : u === 1 ? '<b>⏰ Última chance</b> · até 15% OFF acaba à meia-noite'", 1),
 ("t = Math.round(c * 0.8); el.innerHTML = '<b>' + brl(t) + '</b> hoje · 20% OFF <small>",
  "t = Math.round(c * 0.9); el.innerHTML = '<b>' + brl(t) + '</b> hoje · 10% OFF · <small>até 15% levando 5 · ", 1),
 # visual preto/vermelho/branco (igual à Verme Friday): lua branca, verde do Eclipse vira vermelho
 ('background:radial-gradient(circle at 38% 35%,#fbf8ea 0,#e9efd9 35%,#c0de96 75%,#93b874 100%);box-shadow:0 0 80px #c0de9640,0 0 200px #c0de9622,inset -20px -30px 60px #6f8f5555}',
  'background:radial-gradient(circle at 38% 35%,#ffffff 0,#ececec 35%,#bdbdbd 75%,#8a8a8a 100%);box-shadow:0 0 80px #e0262f40,0 0 200px #e0262f22,inset -20px -30px 60px #00000055}', 1),
 ('#a7c08a55 0 7%', '#9a9a9a55 0 7%', 1), ('#a7c08a44 0 5%', '#9a9a9a44 0 5%', 1), ('#a7c08a44 0 9%', '#9a9a9a44 0 9%', 1),
 ('--lime:#c0de96', '--lime:#ff4a52', 1), ('color:#c0de96!important', 'color:#ff4a52!important', 1),
 # hero
 ('<p class="ve-kick"><span>11.11</span> <i data-ve-urg style="font-style:normal">só hoje · última lua nova de 2026</i></p>',
  '<p class="ve-kick"><span>Free Monday</span> <i data-ve-urg style="font-style:normal">só hoje · última lua nova de 2026</i></p>', 1),
 ('<h1 class="cap">Comece 2027 sem parasitas. <em>Só hoje, 20% OFF + o 5º grátis.</em></h1>',
  '<h1 class="cap">Última chance de desparasitar no ano. <em>Só hoje, até 15% OFF.</em></h1>', 1),
 ('<p class="ve-sub">O maior desconto da história da VermeFree: <b>20% OFF em tudo</b>, <b>compre 4 e leve 5</b>, frete grátis sem mínimo e 3x sem juros. Pedindo hoje, você faz o protocolo na <b>última lua nova do ano (09/12)</b>. À meia-noite, acaba.</p>',
  '<p class="ve-sub">A última oferta de novembro: <b>10% OFF</b> em 1 unidade, <b>12%</b> em 3 e <b>15%</b> em 5, frete grátis acima de R$ 299 e <b>1 kit adulto de brinde</b> nas compras acima de R$ 1.000. Pedindo hoje, você recebe a tempo da <b>última lua nova do ano</b>. À meia-noite, acaba.</p>', 1),
 ('<div class="ve-n">11.11</div>', '<div class="ve-n">30.11</div>', 1),
 ('<span data-ve-f>0%</span> do 11/11 já passou', '<span data-ve-f>0%</span> do Free Monday já passou', 1),
 # montador
 ('<h2 class="cap">Leve 5, pague 4. <em>E ainda 20% OFF em tudo.</em></h2>', '<h2 class="cap">Quanto mais, <em>maior o desconto.</em></h2>', 1),
 ('<p>Monte o pedido da casa. Tudo com 20% OFF; com 4, ganha um Kit Kids de 2 a 4 anos; com 5, o de menor valor sai grátis. Desconto automático, só hoje.</p>',
  '<p>Monte o pedido da casa: 10% OFF em 1, 12% em 3 e 15% em 5 ou mais. Acima de R$ 1.000, 1 kit adulto de brinde. Desconto automático, só hoje.</p>', 1),
 ('{%- assign por = v.price | times: 0.8 -%}', '{%- assign por = v.price | ' + P90 + ' -%}', 1),
 ('<i>-20%</i>', '<i>-10%</i>', 1),
 ('aria-label="Benefícios do 11/11"', 'aria-label="Benefícios do Free Monday"', 1),
 ('<li data-ve-lad="1"><span>🚚</span><b>Frete grátis</b><small>sem mínimo</small></li>', '<li data-ve-lad="1"><span>🌑</span><b>10% OFF</b><small>com 1</small></li>', 1),
 ('<li data-ve-lad="4"><span>🎁</span><b>Kit Kids</b><small>com 4</small></li>', '<li data-ve-lad="4"><span>⬆️</span><b>12% OFF</b><small>com 3</small></li>', 1),
 ('<li data-ve-lad="5"><span>🌑</span><b>5º grátis</b><small>com 5</small></li>', '<li data-ve-lad="5"><span>🏆</span><b>15% OFF</b><small>com 5</small></li>', 1),
 ('Garantia de 7 dias · Só no 11/11', 'Garantia de 7 dias · Só hoje, 30/11', 1),
 ('<div class="ve-trilho"><span>20% OFF em tudo</span><span>Compre 4, leve 5</span><span>Frete grátis sem mínimo</span><span>15% de cashback nos 100 primeiros</span><span><a href="/pages/regulamento-sorteio-11-11" style="color:inherit">Sorteio de um kit entre os 300 primeiros</a></span></div>',
  '<div class="ve-trilho"><span>Até 15% OFF por quantidade</span><span>Frete grátis acima de R$ 299</span><span>Kit adulto de brinde acima de R$ 1.000</span><span>Só hoje, 30/11</span></div>', 1),
 ('<p>Depois da meia-noite, os preços voltam e a última lua nova de 2026 passa sem você. Comece 2027 sem parasitas.</p>', '<p>Depois da meia-noite, os preços voltam e a última lua nova do ano passa sem você. É a última chance de desparasitar em 2026.</p>', 1),
 # FAQ
 ('Perguntas <em>do 11/11.</em></h2>', 'Perguntas <em>do Free Monday.</em></h2>', 1),
 ('<details open><summary>Como funciona o compre 4, leve 5?</summary><p>Coloque 5 protocolos no carrinho: o de menor valor sai grátis. Vale para qualquer combinação e soma com os 20% OFF.</p></details>',
  '<details open><summary>Como funciona o desconto por quantidade?</summary><p>10% OFF em 1 unidade, 12% a partir de 3 e 15% a partir de 5, em qualquer combinação de protocolos. O desconto entra sozinho no carrinho.</p></details>', 1),
 ('<details><summary>Como ganho o Kit Kids de 2 a 4 anos?</summary><p>Na compra de 4 protocolos, um Kit Kids de 2 a 4 anos vai de presente no seu pedido.</p></details>',
  '<details><summary>Como ganho o kit adulto de brinde?</summary><p>Nas compras acima de R$ 1.000, 1 kit adulto vai de presente no seu pedido.</p></details>', 1),
 ('      <details><summary>O que é o cashback de 15%?</summary><p>Os 100 primeiros pedidos do dia ganham 15% do valor pago em crédito para a próxima compra. O crédito fica disponível em até 3 dias e vale até 30/11 às 23h59.</p></details>\n', '', 1),
 ('      <details><summary>E o sorteio?</summary><p>Os 300 primeiros pedidos do 11/11 concorrem a um Kit Família VermeFree. O resultado sai no dia 13/11. <a href="/pages/regulamento-sorteio-11-11" style="color:inherit;text-decoration:underline">Ver o regulamento</a>.</p></details>\n', '', 1),
 ('<p>Sim. Hoje o frete é grátis para todos os pedidos, sem valor mínimo.</p>', '<p>Sim, nas compras a partir de R$ 299. Um protocolo Adulto já passa desse valor.</p>', 1),
 ('<p>Porque o desconto acaba às 23h59 e porque quem pede hoje recebe a tempo de fazer a preparação e começar o protocolo na última lua nova de 2026, em 09/12. Entra em 2027 com a desparasitação feita.</p>',
  '<p>Porque o desconto acaba às 23h59 e porque quem pede hoje recebe a tempo de fazer o protocolo na última lua nova do ano. É a última chance de desparasitar em 2026.</p>', 1),
 ('Só no dia 11/11, até 23h59 (horário de Brasília). Descontos aplicados automaticamente no carrinho. No compre 4 leve 5, sai grátis o item de menor valor.',
  'Só no dia 30/11, até 23h59 (horário de Brasília). Descontos aplicados automaticamente no carrinho: 10% em 1 unidade, 12% em 3 e 15% em 5. Frete grátis acima de R$ 299. Kit adulto de brinde nas compras acima de R$ 1.000.', 1),
 # JS montador
 ("var gratis = 0; for (var i = 0; i < Math.floor(precos.length / 5); i++) gratis += precos[i];\n        return { n: precos.length, cheio: cheio, paga: Math.round((cheio - gratis) * 0.8) };",
  "var n = precos.length, pc = n >= 5 ? 15 : n >= 3 ? 12 : n >= 1 ? 10 : 0;\n        return { n: n, pc: pc, cheio: cheio, paga: Math.round(cheio * (100 - pc) / 100) };", 1),
 ("mt.querySelector('[data-ve-lad=\"4\"]').classList.toggle('on', n >= 4);", "mt.querySelector('[data-ve-lad=\"4\"]').classList.toggle('on', n >= 3);", 1),
 ("n === 0 ? 'Todo pedido no 11/11 tem <b>frete grátis</b>.' : n < 4 ? 'Mais <b>' + (4 - n) + (4 - n === 1 ? ' protocolo' : ' protocolos') + '</b> e ganhe o <b>Kit Kids</b> de presente' : n === 4 ? '<b>Kit Kids garantido.</b> Mais 1 e o <b>5º sai grátis</b>' : '🎉 <b>Frete, Kit Kids e o 5º grátis</b> liberados'",
  "(n === 0 ? 'Já no primeiro protocolo: <b>10% OFF</b>.' : n < 3 ? 'Mais <b>' + (3 - n) + (3 - n === 1 ? ' protocolo' : ' protocolos') + '</b> e o desconto sobe para <b>12%</b>' : n < 5 ? 'Mais <b>' + (5 - n) + (5 - n === 1 ? ' protocolo' : ' protocolos') + '</b> e o desconto sobe para <b>15%</b>' : '🎉 <b>15% OFF</b> liberado') + (c.paga > 100000 ? ' · 🎁 <b>kit adulto de brinde</b>' : n && c.paga >= 29900 ? ' · <b>frete grátis</b>' : '')", 1),
 # PDP
 ('<span class="off">−20% hoje</span>', '<span class="off">−10% hoje</span>', 1),
 ('<p class="ve-kick"><span>11.11</span> só hoje · acaba em <b data-ve-t>--</b></p>', '<p class="ve-kick"><span>Free Monday</span> só hoje · acaba em <b data-ve-t>--</b></p>', 1),
 ('<p class="desc" style="color:#fff;font-weight:700">🌑 Última lua nova de 2026: peça hoje e comece 2027 sem parasitas.</p>',
  '<p class="desc" style="color:#fff;font-weight:700">🌑 Última chance de desparasitar no ano: pedindo hoje, chega a tempo da última lua nova.</p>', 1),
 ('times: 0.8 | money', P90 + ' | money'),
 ('times: 0.8 | divided_by: 3', P90 + ' | divided_by: 3'),
 ('Aproveite o 11.11 nos protocolos: 20% OFF, o 5º grátis e frete grátis.', 'Aproveite o Free Monday nos protocolos: até 15% OFF e frete grátis acima de R$ 299.', 1),
 ('Ver os protocolos com 20% OFF →', 'Ver os protocolos com desconto →', 1),
 ('<li><b>Frete grátis</b>sem valor mínimo</li>', '<li><b>Frete grátis</b>acima de R$ 299</li>', 1),
 ('        <li><b>15% de cashback</b>nos 100 primeiros pedidos</li>\n', '        <li><b>Até 15% OFF</b>levando 5 unidades</li>\n', 1),
 ('<li><a href="/pages/regulamento-sorteio-11-11" style="color:inherit"><b>Sorteio de um kit</b>entre os 300 primeiros</a></li>', '<li><b>Kit adulto de brinde</b>nas compras acima de R$ 1.000</li>', 1),
 ('        <li><b>Guia e manual</b>digitais no seu e-mail</li>\n', '', 1),
 ('<a class="ve-mix" href="/#ve-monte">Quer misturar protocolos? Monte seus 5 →</a>', '<a class="ve-mix" href="/#ve-monte">Quer misturar protocolos? Monte o pedido da casa →</a>', 1),
 ('<p>Última lua nova de 2026: comece 2027 sem parasitas. À meia-noite o', '<p>Última chance de desparasitar no ano. À meia-noite o', 1),
 (', e o 5º é por nossa conta.</p>', ', e levando 5 o desconto sobe para 15%.</p>', 1),
 ('<small>20% OFF acaba em <b data-ve-t>--</b></small>', '<small>10% OFF acaba em <b data-ve-t>--</b></small>', 1),
]
kits = [
 ('seletor de kits da PDP no 11/11', 'seletor de kits da PDP no Free Monday (30/11, escada 10/12/15)', 1),
 ('{%- assign kk = true -%}', '{%- assign kk = false -%}', 1),
 ('<span class="tag">Melhor preço do ano</span>', '<span class="tag">Maior desconto do dia</span>', 1),
 ('#c0de96', '#ff4a52'), ('color:#0c2219', 'color:#fff', 1),
 ("{%- assign l1 = 'Para começar' -%}{%- assign l2 = 'Para o casal' -%}", "{%- assign l1 = 'Para começar' -%}{%- assign l2 = 'Para a casa' -%}", 1),
 ("{%- assign ks = '1,2,5' | split: ',' -%}", "{%- assign ks = '1,3,5' | split: ',' -%}", 1),
 ('{%- if kn == 5 -%}{%- assign tot = p80 | times: 4 -%}{%- else -%}{%- assign tot = p80 | times: kn -%}{%- endif -%}',
  '{%- if kn == 5 -%}{%- assign tot = v.price | times: 0.85 | times: 5 | round -%}{%- elsif kn == 3 -%}{%- assign tot = v.price | times: 0.88 | times: 3 | round -%}{%- else -%}{%- assign tot = p80 -%}{%- endif -%}', 1),
 ('{%- assign p80 = v.price | times: 0.8 -%}', '{%- assign p80 = v.price | times: 0.9 | round -%}', 1),
 ('<b>5 unidades, pague 4<em>−36%</em></b><small>20% OFF + o 5º grátis</small>', '<b>5 unidades<em>−15%</em></b><small>{% if tot > 100000 %}+ 1 kit adulto de brinde{% else %}o maior desconto do dia{% endif %}</small>', 1),
 ('<em>−20%</em></b><small>{% if kn == 1 %}', '<em>{% if kn == 3 %}−12%{% else %}−10%{% endif %}</em></b><small>{% if kn == 1 %}', 1),
 ('<small>{% if kn == 1 %}{{ l1 }}{% else %}{{ l2 }}{% endif %}</small>', '<small>{% if kn == 1 %}{{ l1 }}{% else %}{{ l2 }}{% endif %}</small>{% if tot > 100000 %}<small class="g">+ 1 kit adulto de brinde</small>{% endif %}', 1),
 ('  <p class="ve-lua">🌑 Chega a tempo de começar na <b>última lua nova de 2026 (09/12)</b></p>\n', '  <p class="ve-lua">🌑 Pedindo hoje, chega a tempo da <b>última lua nova do ano</b></p>\n', 1),
 ("var gratis = function (k) { return Math.floor(k / 5); };", "var pc = function (k) { return k >= 5 ? 15 : k >= 3 ? 12 : 10; }, gratis = function () { return 0; };", 1),
 ("Math.round(preco * 0.8 * (k - gratis(k)))", "Math.round(preco * k * (100 - pc(k)) / 100)", 1),
 ("var ms = [{ q: 1, i: '🌑', b: '20% OFF', s: '+ frete grátis' }];", "var ms = [{ q: 1, i: '🌑', b: '10% OFF', s: 'com 1' }, { q: 3, i: '⬆️', b: '12% OFF', s: 'com 3' }];", 1),
 ("ms.push({ q: 5, i: '🏆', b: '5º grátis', s: 'leve 5, pague 4' });", "ms.push({ q: 5, i: '🏆', b: '15% OFF', s: 'com 5' });", 1),
 ("if (n === 4) txt = 'Mais <b>1 unidade</b> e o 5º sai grátis: <b>pelo mesmo preço de 4</b>';\n      else if (falta) txt = 'Mais <b>' + un(falta.q - n) + '</b> e você ganha <b>' + (falta.q === 5 ? 'o 5º grátis' : 'o Kit Kids de 2 a 4 anos') + '</b>';\n      else if (n % 5) txt = '🎉 <b>' + un(g) + ' grátis</b> no seu pedido. Mais ' + un(5 - n % 5) + ' e ganha <b>outro grátis</b>';\n      else txt = '🎉 <b>Tudo liberado:</b> 20% OFF, ' + (g === 1 ? 'o 5º grátis' : g + ' unidades grátis') + (kk ? ' e o Kit Kids' : '') + ' + frete grátis';",
  "if (falta) txt = 'Mais <b>' + un(falta.q - n) + '</b> e o desconto sobe para <b>' + falta.b + '</b>';\n      else txt = '🎉 <b>15% OFF</b> liberado, o maior desconto do dia';\n      txt += t > 100000 ? ' · 🎁 <b>kit adulto de brinde</b>' : t >= 29900 ? ' · <b>frete grátis</b>' : '';", 1),
]
cart_ul_old = None
cart = [
 ('carrinho no 11/11 (tema Eclipse). Só aparece com html.ve-on (dia 11 ou prévia ?vf_diad=on).', 'carrinho no Free Monday (30/11). Aparece com html.ve-on (até 30/11 23h59).', 1),
 ('background:#c0de96', 'background:#fff', 2),
 ('<span>🌑 11.11 · descontos aplicados</span>', '<span>🌑 Free Monday · descontos aplicados</span>', 1),
]
O.mkdir(exist_ok=True)
patch('vf-1111-promo.liquid', promo)
patch('vf-1111-kits.liquid', kits)
patch('vf-1111-cart.liquid', cart)
# carrinho: troca a lista de benefícios inteira
t = (O / 'vf-1111-cart.liquid').read_text()
i, j = t.index('  <ul>\n'), t.index('  </ul>\n') + len('  </ul>\n')
novo = '''  {%- if q >= 5 -%}{%- assign pc = 15 -%}{%- elsif q >= 3 -%}{%- assign pc = 12 -%}{%- else -%}{%- assign pc = 10 -%}{%- endif -%}
  <ul>
    <li><i>✓</i><span><b>{{ pc }}% OFF</b> em tudo, já no preço</span></li>
    {%- if q < 3 -%}{%- assign f = 3 | minus: q -%}<li class="no"><i>⬆️</i><span>Mais <em>{{ f }} {% if f == 1 %}unidade{% else %}unidades{% endif %}</em> e o desconto sobe para <b>12%</b></span></li>
    {%- elsif q < 5 -%}{%- assign f = 5 | minus: q -%}<li class="no"><i>🏆</i><span>Mais <em>{{ f }} {% if f == 1 %}unidade{% else %}unidades{% endif %}</em> e o desconto sobe para <b>15%</b></span></li>{%- endif -%}
    {%- if cart.total_price >= 29900 -%}<li><i>✓</i><span><b>Frete grátis</b> (acima de R$ 299)</span></li>
    {%- else -%}{%- assign f = 29900 | minus: cart.total_price -%}<li class="no"><i>🚚</i><span>Faltam <em>{{ f | money }}</em> para o <b>frete grátis</b></span></li>{%- endif -%}
    {%- if cart.total_price > 100000 -%}<li><i>✓</i><span><b>1 kit adulto de brinde</b> no seu pedido</span></li>
    {%- else -%}{%- assign f = 100000 | minus: cart.total_price -%}<li class="no"><i>🎁</i><span>Faltam <em>{{ f | money }}</em> para ganhar <b>1 kit adulto de brinde</b></span></li>{%- endif -%}
  </ul>
'''
t = t[:i] + novo + t[j:]
t = t.replace("{%- if add5 and bid != 0 -%}<button type=\"button\" class=\"add5\" data-ve-add5=\"{{ bid }}\">🎁 Adicionar o 5º grátis</button>{%- endif -%}\n", "")
(O / 'vf-1111-cart.liquid').write_text(t); print('carrinho: lista trocada', len(t))
for n in ['vf-1111-promo.liquid','vf-1111-kits.liquid','vf-1111-cart.liquid']:
    t = (O/n).read_text()
    for w in ['11.11','11/11','0.8 ','0.8)','20%','cashback','Kit Kids','5º grátis','sorteio','vf_diad','regulamento','2027']:
        if w in t: print('  sobrou', repr(w), 'em', n, t.count(w))
