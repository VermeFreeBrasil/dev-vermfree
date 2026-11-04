# Sorteio 11.11 · 300 primeiros pedidos (preparado em 04/11)

## Regulamento
- A página está criada como **rascunho** na Shopify: /pages/regulamento-sorteio-11-11 (gid://shopify/Page/167495794907). **Não publicada.**
- Prêmio usado no texto: Kit Família (o Pedro confirma). Resultado divulgado no grupo VIP e no Instagram (o Pedro confirma).
- Publicar **antes de 11/11 00h** e colocar o link no tema Eclipse (faixa "Sorteio de um kit entre os 300 primeiros") e no rodapé, se o Pedro quiser.
- ⚠️ Atenção legal: no Brasil, sorteio ligado a compra costuma exigir autorização da SPA/Ministério da Fazenda (Lei 5.768/71). O sorteio de agosto foi feito sem autorização. Decisão do Vitor ou do jurídico.

## No dia 13/11 (Claude, com o ok do Pedro)
1. Listar pela API os pedidos criados de 11/11 00h00 a 23h59 (Brasília), pagos, não cancelados e sem pedidos de teste, em ordem de criação, e pegar os 300 primeiros. É a mesma lista base do cashback, que usa os 100 primeiros.
2. Salvar a lista (só os números dos pedidos) **fora do repositório** e mostrar ao Pedro o total, o primeiro e o último pedido.
3. Rodar `python3 sortear.py lista.csv`. O resultado pode ser conferido: a semente é o hash da lista.
4. Mandar ao Pedro o número do pedido sorteado, o nome e o contato, e o texto abaixo para a Sarah.

## Mensagem para o ganhador (WhatsApp)
> Oi, {nome}! Aqui é da VermeFree 🎉 Seu pedido {nº} do 11/11 foi **sorteado** entre os 300 primeiros e você ganhou um **Kit Família VermeFree**!
> Para enviarmos, confirma pra gente o endereço de entrega? Você tem até {data + 7 dias} para responder.

## Anúncio no grupo VIP
> 🎉 Sorteio do 11.11: entre os 300 primeiros pedidos, o sorteado foi o pedido **{nº}** ({primeiro nome}, {cidade/UF}). Já entramos em contato. Obrigado a todo mundo que fez parte do maior 11.11 da história da VermeFree!
