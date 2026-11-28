# 17/11 (Pedro): "kit" -> "protocolo" no texto que o cliente lê + alinhamento com a ficha do Alliance.
# Não mexe em nome de produto (Kit Família, Kit Kids), handles, variáveis nem regras de desconto/brinde.
# Gera ajuste-protocolo-1711/<tema>/<caminho> a partir dos arquivos que estão no ar (cópias locais conferidas por md5).
import pathlib, hashlib, sys
B = pathlib.Path(__file__).resolve().parent; S = B.parent
SC = pathlib.Path('/tmp/claude-0/-home-user-dev-vermfree/83365de7-8ce8-545d-a122-722ac23fa884/scratchpad/theme')
KA = [('KIT ADULTO', 'PROTOCOLO ADULTO'), ('Kit adulto', 'Protocolo adulto'), ('kit adulto', 'protocolo adulto')]
FAQ = [('Um kit serve para quantas pessoas?', 'Um protocolo serve para quantas pessoas?'),
       ('Cada kit é para <strong>uma pessoa</strong>. Se mais alguém da casa for fazer, cada um precisa do seu kit.',
        'Cada protocolo é para <strong>uma pessoa</strong>. Se mais alguém da casa for fazer, cada um precisa do seu protocolo.'),
       ('enviado junto com o kit escolhido', 'enviado junto com o protocolo escolhido')]
SEL = [('Escolha seu kit', 'Escolha seu protocolo')]
SORT = [('Sorteio de um kit', 'Sorteio de um protocolo'), ('SORTEIO DE UM KIT', 'SORTEIO DE UM PROTOCOLO'),
        ('concorrem a um kit VermeFree', 'concorrem a um protocolo VermeFree'), ('a um kit VermeFree', 'a um protocolo VermeFree')]
ANO = [('O maior desconto do ano voltou. <em>18% OFF + o 5º grátis.</em>', 'A Verme Friday chegou. <em>18% OFF + o 5º grátis.</em>'),
       ('⚫ O maior desconto do ano voltou: só em 27 e 28/11.', '⚫ Verme Friday: só em 27 e 28/11.'),
       ('O maior desconto do ano <em>abre à meia-noite.</em>', 'A Verme Friday <em>abre à meia-noite.</em>')]
J = [
 ('vw', 'snippets/vf-verme-november.liquid', S/'verme-week-tema/arquivos/snippets/vf-verme-november.liquid', '518d0bf1', KA),
 ('vw', 'snippets/vf-verme-november-pdp.liquid', S/'verme-week-tema/arquivos/snippets/vf-verme-november-pdp.liquid', 'b9acfb5a', KA + SEL),
 ('vw', 'templates/index.json', S/'verme-november-tema/arquivos/templates/index.json', '00a78cc4', FAQ),
 ('vw', 'templates/product.json', S/'verme-november-tema/arquivos/templates/product.json', 'd5f41444', FAQ),
 ('vw', 'templates/product.kids-2-4.json', S/'verme-november-tema/arquivos/templates/product.kids-2-4.json', '732a6957', FAQ),
 ('vw', 'templates/product.kids-5-9.json', S/'verme-november-tema/arquivos/templates/product.kids-5-9.json', '4116b890', FAQ),
 ('vf', 'snippets/vf-1111-kits.liquid', S/'verme-friday-tema/arquivos/vf-1111-kits.liquid', '3d0a9919', SEL + SORT),
 ('vf', 'snippets/vf-1111-promo.liquid', S/'verme-friday-tema/arquivos/vf-1111-promo.liquid', 'd98dcd82', SORT + ANO),
 ('vf', 'snippets/vf-trava-1111.liquid', S/'verme-friday-tema/arquivos/vf-trava-1111.liquid', '58de47e3', SORT + ANO),
 ('fm', 'snippets/vf-1111-kits.liquid', S/'free-monday-tema/arquivos/vf-1111-kits.liquid', '9fe43461', SEL + KA),
 ('fm', 'snippets/vf-1111-promo.liquid', S/'free-monday-tema/arquivos/vf-1111-promo.liquid', '033e781e', KA),
 ('fm', 'snippets/vf-1111-cart.liquid', S/'free-monday-tema/arquivos/vf-1111-cart.liquid', '76252cda', KA),
 ('fm', 'snippets/vf-trava-1111.liquid', S/'free-monday-tema/arquivos/vf-trava-1111.liquid', '6509a4b5', KA),
]
for tema in ('vf', 'fm'):
    J += [(tema, 'templates/index.json', SC/'templates/index.json', 'ed3ceb56', FAQ),
          (tema, 'templates/product.json', SC/'templates/product.json', '205dae07', FAQ),
          (tema, 'templates/product.kids-2-4.json', SC/'templates/product.kids-2-4.json', '6fb7d0ee', FAQ)]
for tema, rel, src, md5, reps in J:
    t = src.read_bytes()
    assert hashlib.md5(t).hexdigest().startswith(md5), (src, hashlib.md5(t).hexdigest())
    s = t.decode('utf-8'); n0 = s
    hits = []
    for a, b in reps:
        c = s.count(a)
        if c: hits.append(f'{a[:28]}×{c}'); s = s.replace(a, b)
    out = B/tema/rel; out.parent.mkdir(parents=True, exist_ok=True); out.write_text(s, encoding='utf-8')
    print(tema, rel, 'mudou' if s != n0 else 'IGUAL', hashlib.md5(s.encode()).hexdigest()[:8], '|', '; '.join(hits))
