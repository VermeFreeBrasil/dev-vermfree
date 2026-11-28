# 17/11 · "kit" → "protocolo" nos temas 2 (VW), 3 (VF) e 4 (FM) + conferência com as fichas do Alliance

Pedido do Pedro: trocar "kit" por "protocolo" (briefing das criadoras) e deixar os temas 100% alinhados com a oferta do Alliance.
Script: ajuste.py (parte das cópias locais conferidas por md5 com o que estava no ar). 19 arquivos subidos e conferidos por md5.

| Tema | Arquivos | md5 novos |
|---|---|---|
| 2 · Verme Week 168791179483 | snippets/vf-verme-november(.liquid, -pdp) · templates/index, product, product.kids-2-4, product.kids-5-9 | c6e842de, 99bf2e3f · 8bb1d6b2, 488e0e44, 2e815b4b, daf902ed |
| 3 · Verme Friday 169018949851 | snippets/vf-1111-kits, -promo, vf-trava-1111 · templates/index, product, product.kids-2-4 | 2dc3f5fe, e96b2ba0, 06c12a96 · 1e146832, b5c465ea, 9a7af551 |
| 4 · Free Monday 169093464283 | snippets/vf-1111-cart, -kits, -promo, vf-trava-1111 · templates/index, product, product.kids-2-4 | 2001a224, d887ef77, 2f351875, a83190ce · 1e146832, b5c465ea, 9a7af551 |

Trocas: "Escolha seu kit" → protocolo; "kit adulto" (brinde) → "protocolo adulto"; sorteio "de um kit" → "de um protocolo"; FAQ "Um kit serve para quantas pessoas?" → protocolo; "enviado junto com o kit escolhido" → protocolo.
VF: tirado "O maior desconto do ano" (não está na ficha e o 11/11 teve 20%): hero "A Verme Friday chegou. 18% OFF + o 5º grátis.", PDP "⚫ Verme Friday: só em 27 e 28/11.", trava "A Verme Friday abre à meia-noite."
Ficou como está: nomes de produto (Kit Família, Kit Desparasitação Família), rótulos dos vídeos de clientes ("Jessika abre o kit"), "4 protocolos do kit". VF/FM product.kids-5-9 não foi mexido (sem cópia local): sobra "enviado junto com o kit escolhido" numa resposta de FAQ.
Atenção: os patch-vf.py / patch-fm.py / patch-vw.py geram a versão anterior; se rodar de novo, rodar este ajuste.py depois.
