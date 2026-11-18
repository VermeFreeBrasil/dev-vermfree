# Sorteio Verme Friday · 300 primeiros pedidos (preparado em 18/11)

## Regulamento
- PUBLICADO em 18/11 (ok do Pedro): https://vermefree.com.br/pages/regulamento-sorteio-verme-friday (gid://shopify/Page/168107966683).
- Prêmio: 1 protocolo à escolha (Adulto, Kids 2 a 4 ou Kids 5 a 9). Sorteio em 02/12. Resultado no grupo VIP e no Instagram.
- Link no tema 3 (Verme Friday): FAQ "E o sorteio?" → "O sorteio é em 02/12: veja o regulamento" (vf-1111-promo md5 3bce86d9).

## No dia 02/12 (Claude, com o ok do Pedro)
1. Listar pela API os pedidos criados de 27/11 00h00 a 28/11 23h59 (Brasília), pagos, não cancelados nem reembolsados, sem pedidos de teste, em ordem de criação, e pegar os 300 primeiros.
2. Salvar a lista (só os números dos pedidos) **fora do repositório** e mostrar ao Pedro o total, o primeiro e o último pedido.
3. Rodar `python3 sortear.py lista.csv`. O resultado pode ser conferido: a semente é o hash da lista.
4. Mandar ao Pedro o número do pedido sorteado, o nome e o contato, e os textos abaixo para a Sarah.

## Mensagem para o ganhador (WhatsApp)
> Oi, {nome}! Aqui é da VermeFree 🎉 Seu pedido {nº} da Verme Friday foi **sorteado** entre os 300 primeiros e você ganhou **1 protocolo VermeFree à sua escolha** (Adulto, Kids 2 a 4 anos ou Kids 5 a 9 anos)!
> Me conta qual você quer e confirma o endereço de entrega? Você tem até {02/12 + 7 dias = 09/12} para responder.

## Anúncio no grupo VIP
> 🎉 Sorteio da Verme Friday: entre os 300 primeiros pedidos, o sorteado foi o pedido **{nº}** ({primeiro nome}, {cidade/UF}). Já entramos em contato. Obrigado a todo mundo que fez parte da Verme Friday!
