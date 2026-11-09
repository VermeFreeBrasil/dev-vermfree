# Brinde da Verme November: 1 kit adulto nos pedidos acima de R$ 1.000

Montado em 09/11 (tarefa do Alliance "VERME NOVEMBER — Configurar a entrega dos brindes", prazo 09/11 18h).
Fonte: ficha da oferta v2 (aprovada pelo Vitor em 28/10): "Compras acima de R$ 1.000: 1 kit adulto". Vale de 12/11 00h a 19/11 23h59.

## Regra usada
- **Acima de R$ 1.000** = subtotal dos produtos **depois dos descontos**, sem o frete (o que o cliente paga pelos produtos).
- 1 kit adulto (Protocolo Adulto) por pedido, não importa se o pedido passa de R$ 2.000.
- Só pedidos feitos entre **12/11 00h00 e 19/11 23h59** (Brasília).

## Estoque
A Shopify não serve para conferir: o Protocolo Adulto está com **−738** e vende mesmo sem saldo. **Quem confirma o estoque é o Vitor ou a expedição.** A tarefa pede para avisar o Vitor se não houver kit suficiente.

Estimativa de volume, para o Vitor ter uma ideia: um pedido acima de R$ 1.000 na Verme November é, por exemplo, 4 Adultos (R$ 1.221,44 com 12%) ou 1 Kit Família. No 11/11 o volume é maior, mas a Verme November tem desconto menor.

## Como o pedido fica marcado: pela API (decisão do Pedro em 09/11)
O Flow não foi usado (a API não cria Flow e a tela confundiu). De 12 a 20/11, de manhã, o Claude levanta os pedidos novos acima de R$ 1.000, mostra a lista ao Pedro e marca **depois do ok dele no chat**.

Passos:
1. Consulta: `orders(query:"created_at:>=2026-11-12T03:00:00Z created_at:<2026-11-20T03:00:00Z")`, ler `name`, `tags`, `note`, `currentSubtotalPriceSet.shopMoney.amount`.
2. Para cada pedido com subtotal **> 1000** e sem a tag: `tagsAdd(id, ["brinde-vn-kit-adulto"])` e `orderUpdate(input:{id, note: "<nota atual>\n🎁 BRINDE VERME NOVEMBER: enviar 1 kit adulto junto com este pedido."})` (sem apagar a nota que já existe).
3. Registrar no diário só os números dos pedidos (sem dados pessoais) e avisar o Pedro na mensagem do dia.
4. Em 20/11, última passada (pega os pedidos de 19/11).

Consulta testada em 09/11: a API devolve subtotal com desconto, tags e nota.

## Rotina durante a campanha (12 a 19/11)
- **Poly (expedição/atendimento):** filtrar na Shopify → Pedidos → tag `brinde-vn-kit-adulto` e separar 1 kit adulto em cada um.
- **Claude, de manhã:** mostra ao Pedro os pedidos novos acima de R$ 1.000 e, com o ok, marca pela API (tag + nota) antes da expedição separar.
- **24/11 (tarefa da Poly "Acompanhar com a expedição o envio dos brindes"):** a mesma lista serve para conferir com a expedição.

## No site
O tema Verme November **ainda não fala do brinde**. Sugestão: incluir "🎁 Kit adulto de presente acima de R$ 1.000" na barra de benefícios da PDP e do "Monte o pedido da casa", e no FAQ. Depende do ok do Pedro.
