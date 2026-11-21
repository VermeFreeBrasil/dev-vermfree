"""Converte as cópias do tema Verme November (10% 1+ · 12% 3+ · 15% 5+, 12–19/11) para a Verme Week
(12% 1+ · 15% 3+ · 17% 5+, 20–26/11). Frete grátis ≥ R$ 299 e brinde kit adulto > R$ 1.000 continuam iguais.
Uso: python3 -I patch-vw.py <pasta-arquivos-VN> <pasta-saida>"""
import os, re, sys
SRC, OUT = sys.argv[1], sys.argv[2]
changed = {}

def get(p):
    if p not in changed:
        changed[p] = open(os.path.join(SRC, p), encoding='utf-8').read()
    return changed[p]

def rep(p, old, new, count=1):
    s = get(p)
    n = s.count(old)
    assert n == count, f'{p}: esperava {count}x, achou {n}x: {old[:80]!r}'
    changed[p] = s.replace(old, new)

PMAP = {'15': '17', '12': '15', '10': '12'}
def pct(p, expect):
    """Troca 10%/12%/15% (campanha) por 12%/15%/17% em todo o arquivo, de uma vez só."""
    s = get(p)
    rx = re.compile(r'(?<![\d.,\-])(15|12|10)(\s?%)')
    n = len(rx.findall(s))
    assert n == expect, f'{p}: esperava {expect} porcentagens, achou {n}'
    changed[p] = rx.sub(lambda m: PMAP[m.group(1)] + m.group(2), s)

# ---------- snippet principal (barra, home, montador, FAQ) ----------
M = 'snippets/vf-verme-november.liquid'
rep(M, "Date.parse('2026-11-12T00:00:00-03:00')", "Date.parse('2026-11-20T00:00:00-03:00')")
rep(M, "Date.parse('2026-11-19T23:59:59-03:00')", "Date.parse('2026-11-26T23:59:59-03:00')")
rep(M, "Math.min(8, Math.max(1,", "Math.min(7, Math.max(1,")
rep(M, "</b> de 8", "</b> de 7", count=2)
rep(M, "São só 8 dias.", "São só 7 dias.")
rep(M, "<p>os 8 dias do Verme November</p>", "<p>os 7 dias da Verme Week</p>")
rep(M, "{%- for d in (12..19) -%}", "{%- for d in (20..26) -%}", count=2)
rep(M, "<span>Verme November</span> 12 a 19/11", "<span>Verme Week</span> 20 a 26/11")
rep(M, '<span class="tg">Verme November</span>', '<span class="tg">Verme Week</span>')
rep(M, "Perguntas <em>do Verme November.</em></h2><p>Tudo o que vale de 12 a 19/11,", "Perguntas <em>da Verme Week.</em></h2><p>Tudo o que vale de 20 a 26/11,")
rep(M, "já com desconto, de 12 a 19/11)", "já com desconto, de 20 a 26/11)")
rep(M, "Até 19/11 às 23h59", "Até 26/11 às 23h59")
rep(M, "Até 19/11</p>", "Até 26/11</p>")
rep(M, "O Verme November termina em", "A Verme Week termina em")
rep(M, "<p>Depois disso, o desconto de 15% para a casa toda só no ano que vem.</p>", "<p>Depois disso, os preços voltam ao normal.</p>")
rep(M, "De 12/11 00h a 19/11 23h59", "De 20/11 00h a 26/11 23h59")
rep(M, "{%- assign por = v.price | times: 0.9 -%}", "{%- assign por = v.price | times: 0.88 -%}")
rep(M, "t = Math.round(c * 0.9);", "t = Math.round(c * 0.88);")
rep(M, "<i>-10%</i>", "<i>-12%</i>")
rep(M, "return n >= 5 ? 15 : n >= 3 ? 12 : n >= 1 ? 10 : 0;", "return n >= 5 ? 17 : n >= 3 ? 15 : n >= 1 ? 12 : 0;")
pct(M, None or len(re.findall(r'(?<![\d.,\-])(15|12|10)(\s?%)', get(M))))

# ---------- PDP da campanha ----------
P = 'snippets/vf-verme-november-pdp.liquid'
rep(P, "{%- assign p10 = v.price | times: 0.9 -%}", "{%- assign p10 = v.price | times: 0.88 -%}")
rep(P, "'0.9,0.88,0.85' | split: ','", "'0.88,0.85,0.83' | split: ','")
rep(P, "'10,12,15' | split: ','", "'12,15,17' | split: ','")
rep(P, "times: 0.85 | money", "times: 0.83 | money")
rep(P, "return k >= 5 ? 15 : k >= 3 ? 12 : 10;", "return k >= 5 ? 17 : k >= 3 ? 15 : 12;")
rep(P, "{%- for d in (12..19) -%}", "{%- for d in (20..26) -%}")
rep(P, "Até 19/11", "Até 26/11")
rep(P, '<span class="off">Verme November · até', '<span class="off">Verme Week · até')
rep(P, "<span>Verme November</span> termina em", "<span>Verme Week</span> termina em")
rep(P, "O Verme November termina em", "A Verme Week termina em")
pct(P, len(re.findall(r'(?<![\d.,\-])(15|12|10)(\s?%)', get(P))))

# ---------- faixa do topo (estados do carrinho): só o bloco da escada ----------
A = 'sections/vf-announcement-bar.liquid'
s = get(A); i = s.index("    if (kits < 3) {"); j = s.index("'<b>15% OFF ✓</b>'] };", i) + len("'<b>15% OFF ✓</b>'] };")
bloco = re.sub(r'(?<![\d.,])(15|12|10)%', lambda m: PMAP[m.group(1)] + '%', s[i:j])
changed[A] = s[:i] + bloco + s[j:]

# ---------- PDP padrão: bloco de compra 1/3/5 ----------
B = 'snippets/vf-pdp-buy-c.liquid'
rep(B, "assign d = 10\n        if q == 3\n          assign d = 12\n        elsif q == 5\n          assign d = 15",
       "assign d = 12\n        if q == 3\n          assign d = 15\n        elsif q == 5\n          assign d = 17")
rep(B, "assign d = 10\n          if q == 3\n            assign d = 12\n          elsif q == 5\n            assign d = 15",
       "assign d = 12\n          if q == 3\n            assign d = 15\n          elsif q == 5\n            assign d = 17")

# ---------- PDP padrão: cartões escondidos + JS ----------
rep('snippets/vf-pdp-main-p2.liquid', "assign kit_proto_discs = '10,12,15'", "assign kit_proto_discs = '12,15,17'")
P6 = 'snippets/vf-pdp-main-p6.liquid'
rep(P6, "      if (qty >= 5) return 15;\n      if (qty >= 3) return 12;\n      if (qty >= 1) return 10;", "      if (qty >= 5) return 17;\n      if (qty >= 3) return 15;\n      if (qty >= 1) return 12;")
rep(P6, "(Verme November)", "(Verme Week)")
rep(P6, "'🎉 Vantagem máxima: 15% OFF + frete grátis desbloqueados'", "'🎉 Vantagem máxima: 17% OFF + frete grátis desbloqueados'")
rep(P6, "'🎉 12% OFF + frete grátis · leve 5 Kits e ganhe 15% OFF'", "'🎉 15% OFF + frete grátis · leve 5 Kits e ganhe 17% OFF'")
rep(P6, "'10% OFF já aplicado · leve 3 e ganhe 12% · leve 5 e ganhe 15%'", "'12% OFF já aplicado · leve 3 e ganhe 15% · leve 5 e ganhe 17%'")

# ---------- carrinho: aviso da escada ----------
K = 'snippets/vf-kits-desconto-aviso.liquid'
rep(K, "times: 15 | divided_by: 85", "times: 17 | divided_by: 83")
rep(K, "times: 12 | divided_by: 88", "times: 15 | divided_by: 85")
rep(K, "times: 10 | divided_by: 90", "times: 12 | divided_by: 88")
rep(K, "<strong>Verme November: 15% OFF ativado</strong>", "<strong>Verme Week: 17% OFF ativado</strong>")
rep(K, "<strong>Verme November: 12% OFF ativado</strong>", "<strong>Verme Week: 15% OFF ativado</strong>")
rep(K, "<strong>Verme November: 10% OFF ativado</strong>", "<strong>Verme Week: 12% OFF ativado</strong>")
rep(K, "e leve <b>15% OFF</b>.", "e leve <b>17% OFF</b>.")
rep(K, "vira <b>12% OFF</b> · com 5, <b>15%</b>.", "vira <b>15% OFF</b> · com 5, <b>17%</b>.")

# ---------- pop-up do carrinho (quiz) ----------
Q = 'snippets/vf-quiz-carrinho.liquid'
rep(Q, "function tier(n){return n>=5?.15:n>=3?.12:n>=1?.10:0}", "function tier(n){return n>=5?.17:n>=3?.15:n>=1?.12:0}")
rep(Q, "'💚 Verme November: '", "'💚 Verme Week: '")
rep(Q, "Com 3 kits: 12% OFF em tudo · com 5, 15%.", "Com 3 kits: 15% OFF em tudo · com 5, 17%.")

# ---------- home (JSON) ----------
I = 'templates/index.json'
rep(I, "A partir de <b>3x de R$ 81,00</b> sem juros · 10% OFF", "A partir de <b>3x de R$ 79,20</b> sem juros · 12% OFF")
rep(I, '"tiers": "1:10,3:12,5:15"', '"tiers": "1:12,3:15,5:17"')

for p, s in changed.items():
    d = os.path.join(OUT, p); os.makedirs(os.path.dirname(d), exist_ok=True)
    open(d, 'w', encoding='utf-8').write(s)
    print('ok', p, len(s))
