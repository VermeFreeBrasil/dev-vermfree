# 24/11 (Pedro): sai o "compre 4, leve 5" da Verme Friday. Fica: 18% OFF em tudo, frete grátis sem mínimo, guia + manual, sorteio dos 300.
import pathlib, sys
A = pathlib.Path('antes'); B = pathlib.Path('depois')
R = {
'vf-1111-promo.liquid': [
 ('<b>18% OFF</b> + 5º grátis + frete grátis · só 27 e 28/11', '<b>18% OFF</b> em tudo + frete grátis · só 27 e 28/11'),
 ("18% OFF + 5º grátis acaba hoje às 23h59", "18% OFF + frete grátis acaba hoje às 23h59"),
 ('<em>18% OFF + o 5º grátis.</em>', '<em>18% OFF em tudo.</em>'),
 ('<b>18% OFF em tudo</b>, <b>compre 4 e leve 5</b>, frete grátis sem mínimo e 3x sem juros.', '<b>18% OFF em tudo</b>, <b>frete grátis sem mínimo</b> e 3x sem juros.'),
 ('<h2 class="cap">Leve 5, pague 4. <em>E ainda 18% OFF em tudo.</em></h2>', '<h2 class="cap">Monte o pedido da casa. <em>Tudo com 18% OFF.</em></h2>'),
 ('<p>Monte o pedido da casa. Tudo com 18% OFF; com 5, o de menor valor sai grátis. Desconto automático, só em 27 e 28/11.</p>', '<p>Cada um no seu protocolo, num pedido só, com frete grátis. Desconto automático, só em 27 e 28/11.</p>'),
 ('<li data-ve-lad="5"><span>🏆</span><b>5º grátis</b><small>com 5</small></li>', '<li data-ve-lad="5"><span>🏆</span><b>Sorteio</b><small>300 primeiros</small></li>'),
 ('<span>Compre 4, leve 5</span>', ''),
 ('var gratis = 0; for (var i = 0; i < Math.floor(precos.length / 5); i++) gratis += precos[i];', 'var gratis = 0;'),
 ("mt.querySelector('[data-ve-lad=\"5\"]').classList.toggle('on', n >= 5);", "mt.querySelector('[data-ve-lad=\"5\"]').classList.toggle('on', n >= 1);"),
 ("n < 4 ? 'Mais <b>' + (5 - n) + ' protocolos</b> e o <b>5º sai grátis</b>' : n === 4 ? 'Mais 1 e o <b>5º sai grátis</b>, pelo preço de 4' : '🎉 <b>Frete grátis e o 5º grátis</b> liberados'", "'🎉 <b>18% OFF e frete grátis</b> no seu pedido'"),
 ('<details open><summary>Como funciona o compre 4, leve 5?</summary><p>Coloque 5 protocolos no carrinho: o de menor valor sai grátis. Vale para qualquer combinação e soma com os 18% OFF.</p></details>', '<details open><summary>Como funciona o desconto?</summary><p>Os 18% OFF valem para todos os protocolos e já aparecem no carrinho, sem cupom. O frete é grátis em qualquer pedido.</p></details>'),
 (' No compre 4 leve 5, sai grátis o item de menor valor.', ''),
 ('Quer misturar protocolos? Monte seus 5 →', 'Quer misturar protocolos? Monte o pedido da casa →'),
 (', e o 5º é por nossa conta.', ', com frete grátis.'),
],
'vf-1111-kits.liquid': [
 ("{%- if kn == 5 -%}{%- assign tot = p80 | times: 4 -%}{%- else -%}{%- assign tot = p80 | times: kn -%}{%- endif -%}", "{%- assign tot = p80 | times: kn -%}"),
 ("{%- if kn == 5 -%}<b>5 unidades, pague 4</b><small>18% OFF + o 5º grátis</small>{%- if kk -%}<small class=\"g\">+ Kit Kids 2 a 4 anos de presente</small>{%- endif -%}\n          {%- else -%}", ""),
 ("{%- endif -%}\n        </span>", "\n        </span>"),
 ("var gratis = function (k) { return Math.floor(k / 5); };", "var gratis = function (k) { return 0; };"),
 ("ms.push({ q: 5, i: '🏆', b: '5º grátis', s: 'leve 5, pague 4' });", "ms.push({ q: 1, i: '📘', b: 'Guia + manual', s: 'de presente' });"),
 ("if (n === 4) txt = 'Mais <b>1 unidade</b> e o 5º sai grátis: <b>pelo mesmo preço de 4</b>';\n      else if (falta) txt = 'Mais <b>' + un(falta.q - n) + '</b> e você ganha <b>' + (falta.q === 5 ? 'o 5º grátis' : 'o Kit Kids de 2 a 4 anos') + '</b>';\n      else if (n % 5) txt = '🎉 <b>' + un(g) + ' grátis</b> no seu pedido. Mais ' + un(5 - n % 5) + ' e ganha <b>outro grátis</b>';\n      else txt = '🎉 <b>Tudo liberado:</b> 18% OFF, ' + (g === 1 ? 'o 5º grátis' : g + ' unidades grátis') + (kk ? ' e o Kit Kids' : '') + ' + frete grátis';",
  "if (falta) txt = 'Mais <b>' + un(falta.q - n) + '</b> e você ganha <b>o Kit Kids de 2 a 4 anos</b>';\n      else txt = '🎉 <b>Tudo liberado:</b> 18% OFF + frete grátis + guia e manual de presente';"),
],
'vf-1111-cart.liquid': [
 ("{%- assign gr = q | divided_by: 5 -%}", "{%- assign gr = 0 -%}"),
 ("{%- assign sobra = q | modulo: 5 -%}", "{%- assign sobra = 0 -%}"),
 ("    {%- if gr > 0 and sobra != 4 -%}<li><i>✓</i><span><b>{{ gr }} {% if gr == 1 %}unidade grátis{% else %}unidades grátis{% endif %}</b> (compre 4, leve 5)</span></li>{%- endif -%}\n", ""),
 ("    {%- if sobra == 4 -%}<li class=\"no\"><i>🏆</i><span>Coloque <em>mais 1 unidade</em>: ela sai <b>grátis</b>, pelo mesmo preço de agora</span></li>{%- assign add5 = true -%}\n    {%- elsif gr == 0 -%}{%- assign f = 5 | minus: q -%}<li class=\"no\"><i>🏆</i><span>Com mais <em>{{ f }} {% if f == 1 %}unidade{% else %}unidades{% endif %}</em>, a 5ª sai <b>grátis</b></span></li>{%- endif -%}\n", ""),
 ("  {%- if add5 and bid != 0 -%}<button type=\"button\" class=\"add5\" data-ve-add5=\"{{ bid }}\">🎁 Adicionar o 5º grátis</button>{%- endif -%}\n", ""),
],
'vf-trava-1111.liquid': [
 ("<li><b>Compre 4</b>leve 5</li>", "<li><b>Sorteio</b>300 primeiros</li>"),
],
}
ok = True
for fn, subs in R.items():
    s = (A / fn).read_text()
    for o, n in subs:
        c = s.count(o)
        if c != 1: print('FALHOU', fn, c, o[:70]); ok = False; continue
        s = s.replace(o, n)
    (B / fn).write_text(s)
sys.exit(0 if ok else 1)
