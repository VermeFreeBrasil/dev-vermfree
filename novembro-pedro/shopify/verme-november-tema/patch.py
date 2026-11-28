"""Aplica a regra da Verme November (10% 1+ · 12% 3+ · 15% 5+ · frete grátis ≥ R$ 299) nas cópias locais do tema.
Uso: python3 -I patch.py <pasta-do-tema> <pasta-de-saida>"""
import json, os, re, shutil, sys
SRC, OUT = sys.argv[1], sys.argv[2]
changed = {}

def get(p):
    return changed.get(p) or open(os.path.join(SRC, p), encoding='utf-8').read()

def rep(p, old, new, count=1):
    s = get(p)
    n = s.count(old)
    assert n == count, f'{p}: esperava {count}x, achou {n}x: {old[:70]!r}'
    changed[p] = s.replace(old, new)

# ---------- layout: faixa da campanha + banner na home ----------
rep('layout/theme.liquid', "    {% section 'vf-announcement-bar' %}\n    {% section 'header' %}\n",
    "    {%- render 'vf-verme-november', parte: 'barra' -%}\n    {% section 'vf-announcement-bar' %}\n    {% section 'header' %}\n    {%- if template.name == 'index' -%}{%- render 'vf-verme-november', parte: 'home' -%}{%- endif -%}\n")

# ---------- faixa do topo (estados do carrinho) ----------
A = 'sections/vf-announcement-bar.liquid'
rep(A, "section.settings.free_shipping_min | default: 399", "section.settings.free_shipping_min | default: 299")
rep(A, "parseInt(bar.dataset.threshold, 10) || 39900", "parseInt(bar.dataset.threshold, 10) || 29900")
s = get(A)
i = s.index('    if (kits < 2) {'); j = s.index("'<b>10% OFF ✓</b>'] };", i) + len("'<b>10% OFF ✓</b>'] };")
novo = """    if (kits < 3) {
      return { icon: 'gift', href: '/cart', pct: kits / 5 * 100, t: [
        '<b>Frete grátis + 10% OFF ✓</b> · com 3 kits, <b>12%</b> · com 5, <b>15%</b>',
        '<b>10% OFF ✓</b> · com 3 kits, <b>12% OFF</b>',
        '<b>10% OFF ✓</b> · 3 kits = <b>12%</b>',
        '3 kits = <b>12% OFF</b>'
      ] };
    }
    if (kits < 5) {
      return { icon: 'gift', href: '/cart', pct: kits / 5 * 100, t: [
        '<b>Frete grátis + 12% OFF ✓</b> · com 5 kits, <b>15% OFF</b>',
        '<b>12% OFF ✓</b> · com 5 kits, <b>15%</b>',
        '<b>12% OFF ✓</b> · 5 kits = <b>15%</b>',
        '5 kits = <b>15% OFF</b>'
      ] };
    }
    var lib = '<b>Frete grátis + 15% OFF</b>';
    return { icon: 'gift', href: '/cart', pct: 100, t: [lib + ' liberados', lib, '<b>Frete + 15% OFF ✓</b>', '<b>15% OFF ✓</b>'] };"""
changed[A] = s[:i] + novo + s[j:]
rep(A, '"default": 399 }', '"default": 299 }')

# ---------- PDP: bloco de compra (1, 3 ou 5 kits) ----------
B = 'snippets/vf-pdp-buy-c.liquid'
rep(B, 'data-threshold="39900"', 'data-threshold="29900"')
liq_old = """        assign d = 0
        if q == 2
          assign d = 5
        elsif q == 3
          assign d = 10
        endif"""
liq_new = """        assign q = qs | plus: 0
        assign d = 10
        if q == 3
          assign d = 12
        elsif q == 5
          assign d = 15
        endif"""
rep(B, "    {%- for q in (1..3) -%}\n      {%- liquid\n" + liq_old, "    {%- assign vfc_qs = '1,3,5' | split: ',' -%}\n    {%- for qs in vfc_qs -%}\n      {%- liquid\n" + liq_new)
rep(B, "{%- if q == 3 -%}<span class=\"vfc__tg\">Mais escolhido</span>", "{%- if q == 5 -%}<span class=\"vfc__tg\">Maior desconto</span>")
rep(B, "{%- if d > 0 -%}<i>−{{ d }}%</i>{%- else -%}<i class=\"z\">preço cheio</i>{%- endif -%}", "<i>−{{ d }}%</i>")
liq_old2 = """          assign d = 0
          if q == 2
            assign d = 5
          elsif q == 3
            assign d = 10
          endif"""
liq_new2 = """          assign q = qs | plus: 0
          assign d = 10
          if q == 3
            assign d = 12
          elsif q == 5
            assign d = 15
          endif"""
rep(B, "      {%- for q in (1..3) -%}\n        {%- liquid\n" + liq_old2, "      {%- for qs in vfc_qs -%}\n        {%- liquid\n" + liq_new2)
rep(B, "{% if q > 1 %}{% if total >= 39900 and vf_frete_ok != true %}Frete grátis + {% assign vf_frete_ok = true %}{% endif %}{{ d }}% OFF{% else %}preço cheio{% endif %}",
       "{% if total >= 29900 and vf_frete_ok != true %}Frete grátis + {% assign vf_frete_ok = true %}{% endif %}{{ d }}% OFF")
rep(B, "parseInt(root.getAttribute('data-threshold'), 10) || 39900", "parseInt(root.getAttribute('data-threshold'), 10) || 29900")
rep(B, "'Frete grátis acima de R$ 399'", "'Frete grátis acima de R$ 299'")
# barra de benefícios: próximos degraus pela ordem dos botões (1 → 3 → 5), não q+1
rep(B, """      var max = opts.length, cur = perks(q), nx = perks(q + 1), msg;
      $('[data-vfc-fill]').style.width = ((q - 1) / (max - 1) * 100) + '%';""",
"""      var qs = opts.map(function (o) { return +o.dataset.q; }), i = qs.indexOf(q), max = opts.length, cur = perks(q), nx = i > -1 && i < max - 1 ? perks(qs[i + 1]) : null, msg;
      $('[data-vfc-fill]').style.width = (Math.max(i, 0) / (max - 1) * 100) + '%';""")
rep(B, "msg = 'Leve <b>+1 kit</b> e ganhe <b>' + g.join(' + ') + '</b>';", "msg = 'Leve <b>' + qs[i + 1] + ' kits</b> e ganhe <b>' + g.join(' + ') + '</b>';")

# ---------- PDP: cartões escondidos (definem a quantidade) ----------
P2 = 'snippets/vf-pdp-main-p2.liquid'
rep(P2, "assign kit_proto_qtys = '1,2,3'", "assign kit_proto_qtys = '1,3,5'")
rep(P2, "assign kit_proto_discs = '0,5,10'", "assign kit_proto_discs = '10,12,15'")
rep(P2, "assign kit_proto_titles = '1 Kit,2 Kits,3 Kits'", "assign kit_proto_titles = '1 Kit,3 Kits,5 Kits'")
rep(P2, "{%- if t_qty == 3 -%}\n                      {%- assign t_badge1 = 'Mais vantajoso' -%}", "{%- if t_qty == 5 -%}\n                      {%- assign t_badge1 = 'Mais vantajoso' -%}")
rep(P2, "{%- elsif t_qty == 2 -%}\n                      {%- assign t_badge2 = 'Frete grátis' -%}", "{%- elsif t_qty == 3 -%}\n                      {%- assign t_badge2 = 'Frete grátis' -%}")

# ---------- PDP: JS de preço e barra de kits ----------
P6 = 'snippets/vf-pdp-main-p6.liquid'
rep(P6, "      if (qty >= 3) return 10;\n      if (qty >= 2) return 5;", "      if (qty >= 5) return 15;\n      if (qty >= 3) return 12;\n      if (qty >= 1) return 10;")
rep(P6, "var FRETE_GRATIS_THRESHOLD = 39900; // R$ 399 em centavos", "var FRETE_GRATIS_THRESHOLD = 29900; // R$ 299 em centavos (Verme November)")
rep(P6, "'🎉 Vantagem máxima: 10% OFF + frete grátis desbloqueados'", "'🎉 Vantagem máxima: 15% OFF + frete grátis desbloqueados'")
rep(P6, "'🎉 5% OFF + frete grátis · leve 3 Kits e ganhe 10% OFF'", "'🎉 12% OFF + frete grátis · leve 5 Kits e ganhe 15% OFF'")
rep(P6, "'Leve 2 e ganhe 5% OFF · leve 3 e ganhe 10% OFF'", "'10% OFF já aplicado · leve 3 e ganhe 12% · leve 5 e ganhe 15%'")

# ---------- carrinho: aviso da escada e barra de frete ----------
K = 'snippets/vf-kits-desconto-aviso.liquid'
s = get(K)
i = s.index("  {%- if kits_qty >= 8 -%}"); j = s.index("  {%- endif -%}\n\n{%- endif -%}", i)
ok = lambda pct, extra: f"""    <div class="vf-kits-aviso vf-kits-aviso--ok">
      <span class="vf-kits-aviso__ic" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12l5 5 9-11"/></svg>
      </span>
      <div class="vf-kits-aviso__txt">
        <strong>Verme November: {pct}% OFF ativado</strong>
        <span>Você economiza {{{{ eco | money }}}}.{extra}</span>
      </div>
    </div>
"""
novo = ("  {%- if kits_qty >= 5 -%}\n    {%- assign eco = kits_subtotal | times: 15 | divided_by: 85 -%}\n" + ok(15, " O maior desconto da campanha. 🎉") +
        "\n  {%- elsif kits_qty >= 3 -%}\n    {%- assign falta = 5 | minus: kits_qty -%}\n    {%- assign eco = kits_subtotal | times: 12 | divided_by: 88 -%}\n" +
        ok(12, " Adicione mais {{ falta }} protocolo{% if falta > 1 %}s{% endif %} e leve <b>15% OFF</b>.") +
        "\n  {%- else -%}\n    {%- assign falta = 3 | minus: kits_qty -%}\n    {%- assign eco = kits_subtotal | times: 10 | divided_by: 90 -%}\n" +
        ok(10, " Com {{ falta }} protocolo{% if falta > 1 %}s{% endif %} a mais, vira <b>12% OFF</b> · com 5, <b>15%</b>."))
changed[K] = s[:i] + novo + s[j:]
rep('snippets/vf-frete-progress.liquid', "{%- assign FRETE_META = 39900 -%}", "{%- assign FRETE_META = 29900 -%}")

# ---------- pop-up do carrinho (quiz) ----------
Q = 'snippets/vf-quiz-carrinho.liquid'
rep(Q, "freteMin: 399,", "freteMin: 299,")
rep(Q, "function tier(n){return n>=8?.20:n>=5?.15:n>=3?.10:0}", "function tier(n){return n>=5?.15:n>=3?.12:n>=1?.10:0}")
s = get(Q)
i = s.index("    if(n2>=3){var t=tier(n2);"); j = s.index("    return {pct:0,txt:''};", i)
changed[Q] = s[:i] + "    if(n2>=1){var t=tier(n2);return {pct:t,todos:true,txt:'💚 Verme November: '+Math.round(t*100)+'% OFF em todos os kits'};}\n" + s[j:]
rep(Q, "'<p class=\"vfq__dica\">Com 3 kits: 📘 Manual + 10% em tudo.</p>'", "'<p class=\"vfq__dica\">Com 3 kits: 12% OFF em tudo · com 5, 15%.</p>'")

# ---------- textos de frete ----------
rep('sections/vf-lp-oleo-alho.liquid', "Frete grátis acima de R$399.", "Frete grátis acima de R$299.", count=2)

# ---------- configurações (JSON) ----------
def edit_json(p, fn):
    s = get(p)
    m = re.match(r'(\s*/\*.*?\*/\s*)', s, re.S)
    head = m.group(1) if m else ''
    data = json.loads(s[len(head):])
    fn(data)
    changed[p] = head + json.dumps(data, ensure_ascii=False, indent=2)

def settings(d):
    sec = d['current']['sections']['vf-announcement-bar']['settings']
    sec['free_shipping_min'] = 299
    sec['coupon_code'] = ''  # 5OFF está pausado em novembro
edit_json('config/settings_data.json', settings)

def walk(o, fn):
    if isinstance(o, dict):
        fn(o)
        for v in o.values(): walk(v, fn)
    elif isinstance(o, list):
        for v in o: walk(v, fn)

def fix_texts(o):
    for k, v in list(o.items()):
        if isinstance(v, str):
            v2 = v.replace('R$ 399', 'R$ 299').replace('R$399', 'R$299')
            if k == 'ship_threshold': pass
            if v2 != v: o[k] = v2
    if o.get('type') == 'vf-montador' or 'tiers' in o.get('settings', {}):
        st = o.get('settings', {})
        if 'tiers' in st: st['tiers'] = '1:10,3:12,5:15'
        if 'ship_threshold' in st: st['ship_threshold'] = 299
    if 'price_text' in o.get('settings', {}) and '3x de R$ 90,00' in o['settings']['price_text']:
        o['settings']['price_text'] = o['settings']['price_text'].replace('3x de R$ 90,00', '3x de R$ 81,00') + ' · 10% OFF'
for p in ['templates/index.json', 'templates/product.json', 'templates/product.kids-2-4.json', 'templates/product.kids-5-9.json']:
    edit_json(p, lambda d: walk(d, fix_texts))

os.makedirs(OUT, exist_ok=True)
for p, s in changed.items():
    dst = os.path.join(OUT, p); os.makedirs(os.path.dirname(dst), exist_ok=True)
    open(dst, 'w', encoding='utf-8').write(s)
    print(f'{len(s):>7}  {p}')
