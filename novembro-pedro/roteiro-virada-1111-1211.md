# Roteiro da virada · 11/11 (Dia D) e 12/11 (Verme November)

Montado em 05/11. Tudo o que é **automático** já está agendado na Shopify. O que é **manual** só acontece com o ok do Pedro: publicar tema, aplicar tag de cashback e sortear.
Horários em Brasília.

## Antes (até 10/11)
| Quando | O quê | Quem | Status |
|---|---|---|---|
| até 06/11 | Vitor confirma o brinde Kit Kids na compra de 4. Se **não** sair, o Claude tira a promessa do tema Eclipse (faixa, PDP e FAQ) | Vitor → Claude | ⏳ |
| até 09/11 | Sarah/Otávio conferem o **link do grupo VIP** que vai às 00h: `https://vermefree.com.br/?acesso=vip`. Só esse link abre o site antes das 07h. Pode levar UTMs: `?acesso=vip&utm_source=...` | Sarah, Otávio | ⏳ |
| ✅ 05/11 (publicado) | **LP do VIP (vip.vermefree.com.br) entre 00h e 07h do dia 11:** quem não está no grupo cai nela até as 07h, mas o relógio dela zera às 00h. Ajustar o texto para esse intervalo ("a oferta já começou no grupo, o site abre para todos às 7h") e depois das 07h mandar direto para o site | Claude (com ok) | ⏳ decidir |
| 10/11 manhã | Revisão D-1, rodando de novo a conferência de 05/11: descontos agendados, temas iguais aos aprovados, cupons em 2%, sem erro no preview | Claude | ⏳ |
| 10/11 | Renomear o Eclipse para "🌑 11/11 Eclipse · PUBLICAR 00h" (só o nome) | Claude | ⏳ |
| 10/11 23h59 | Descontos de kits atuais (5%/10%/15%/20%) **terminam sozinhos** | automático | ✅ agendado |

## 11/11 · Dia D
| Hora | O quê | Como conferir | Status |
|---|---|---|---|
| 00h00 | Descontos do 11/11 começam: 20% OFF + compre 4 leve 5 + frete grátis sem mínimo | carrinho de teste | ✅ agendado |
| 00h00 | **Publicar o tema Eclipse** (manual, com ok do Pedro; o Claude publica pela API ou o Pedro em Temas → Publicar) | o site com `?acesso=vip` mostra a lua e a faixa AO VIVO | ⏳ manual |
| 00h05 | Teste completo: abrir pelo link do grupo, montar 5 itens, ver no checkout 20% + o item mais barato grátis + frete 0. **Não finalizar** | prints | ⏳ |
| 00h05 | Teste sem o link: deve cair na LP do VIP | | ⏳ |
| 07h00 | A trava **abre sozinha** para todos. Conferir o site sem parâmetro | | ✅ automático |
| 07h00 | **Otávio:** trocar o destino dos anúncios que ainda apontam para a LP vip para o site. A LP já redireciona sozinha a partir das 07h, levando os UTMs e o fbclid, mas o link direto evita esse passo a mais | Otávio | ⏳ |
| ao longo do dia | Acompanhar pedidos (Shopify): quando passar de 100 pedidos fecha o cashback, de 300 fecha o sorteio | contagem | ⏳ |
| 23h59 | Descontos do 11/11 **terminam sozinhos**. O tema Eclipse esconde a promoção sozinho depois das 23h59 | | ✅ agendado |

## 12/11 · Verme November
| Hora | O quê | Status |
|---|---|---|
| 00h00 | Descontos da Verme November começam: 10% (1) · 12% (3+) · 15% (5+) + frete grátis ≥ R$ 299. Recovery (RECOVERY1111 + FRETE1111) começa, só pelo suporte | ✅ agendado |
| 00h00 | **Publicar o tema Verme November** (manual, com ok). Se atrasar alguns minutos, o site fica com o Eclipse sem promoção, sem quebrar nada | ⏳ manual |
| 00h05 | Teste: 1, 3 e 5 itens no carrinho → 10/12/15% e frete a partir de R$ 299 | ⏳ |
| manhã | **Cashback:** listar os 100 primeiros pedidos pagos do 11/11, calcular 15% do total pago e aplicar as tags `cashback-1111-<centavos>`. O Flow credita e manda o e-mail. Avisar a Sarah (texto em shopify/cashback/passo-a-passo-flow.md) | ⏳ com ok |
| manhã | Brindes, se confirmados: lista dos pedidos com 4 ou mais itens para o Kit Kids, para a expedição/Poly | ⏳ |

## 13/11
- Sorteio: lista dos 300 primeiros pedidos pagos do 11/11, `sortear.py`, resultado ao Pedro e textos para a Sarah (shopify/sorteio-1111/como-sortear.md). Depois, fechar no Alliance "Organizar o sorteio" e "Fazer o sorteio".
- Pendente legal: autorização do sorteio (Vitor/jurídico).

## Plano B
- **Desconto não entrou na hora:** ativar na mão (Shopify → Descontos, ou o Claude pela API). IDs em shopify/oferta-1111/descontos-1111.md e oferta-verme-november/descontos.md.
- **Tema com problema depois de publicar:** republicar o tema anterior ("🚀 NO AR + Google liberado na trava", 168585756891). A trava e os descontos continuam funcionando, só sem o visual da campanha.
- **Trava travando cliente do grupo:** o link certo é `?acesso=vip`. Para a equipe: `?vf_trava=off`.
- **Checkout/carrinho com valor errado:** tirar print, pausar o anúncio (Otávio) e chamar o Claude para corrigir os descontos.

## Depois
- 19/11 23h59: Verme November termina sozinha.
- 01/12: reverter cupons pausados e cupons de influenciadora para 5% (lista em shopify/oferta-1111/cupons-novembro.md).
