# Brinde da Verme November: 1 kit adulto nos pedidos acima de R$ 1.000

Montado em 09/11 (tarefa do Alliance "VERME NOVEMBER — Configurar a entrega dos brindes", prazo 09/11 18h).
Fonte: ficha da oferta v2 (aprovada pelo Vitor em 28/10): "Compras acima de R$ 1.000: 1 kit adulto". Vale de 12/11 00h a 19/11 23h59.

## Regra usada
- **Acima de R$ 1.000** = subtotal dos produtos **depois dos descontos**, sem o frete (o que o cliente paga pelos produtos).
- 1 kit adulto (Protocolo Adulto) por pedido, não importa se o pedido passa de R$ 2.000.
- Só pedidos feitos entre **12/11 00h00 e 19/11 23h59** (Brasília).

## Estoque
A Shopify não serve para conferir: o Protocolo Adulto está com **−738** e vende mesmo sem saldo. Decisão do Pedro (09/11): estoque não é com a gente; nossa parte é executar a tarefa (marcação e aviso no site).

Estimativa de volume, para o Vitor ter uma ideia: um pedido acima de R$ 1.000 na Verme November é, por exemplo, 4 Adultos (R$ 1.221,44 com 12%) ou 1 Kit Família. No 11/11 o volume é maior, mas a Verme November tem desconto menor.

## Como o pedido fica marcado: Shopify Flow (montado pelo Pedro em 09/11, com o Claude conferindo pelos prints)
Fluxo **"Verme November · brinde kit adulto (> R$ 1.000)"**:
- Gatilho: **Order created**.
- Condição (AND): `order.createdAt` **maior ou igual a** 12 de nov. de 2026 00:00 · `order.createdAt` **menor que** 20 de nov. de 2026 00:00 · `order.currentSubtotalPriceSet.shopMoney.amount` **maior que** 1000.
- Verdadeiro → **Add order tags**: `brinde-vn-kit-adulto` → **Update order note**: `🎁 BRINDE VERME NOVEMBER: enviar 1 kit adulto junto com este pedido. {{order.note}}` (a ação substitui a nota; o `{{order.note}}` mantém o que o cliente escreveu).
- Falso → nada.

Como achar cada coisa na tela (para repetir em outra campanha): operador na caixa "Igual a" (opções: Maior ou igual a, Menor que, Maior que…); data pelo ícone de **calendário** (o `</>` é para escolher variável, não para digitar); "Adicionar critérios" → **AND**; na variável, buscar `subtotal` e escolher `order/currentSubtotalPriceSet/shopMoney/amount`; a tag só vale depois de **Enter** (vira etiqueta); a ação da nota se chama **Update order note**. Ações entram pela abinha cinza embaixo de "✓ Verdadeiro" → **Ação** → busca.

Conferência: em 12/11 de manhã o Claude confere pela API se todo pedido acima de R$ 1.000 desde 00h tem a tag e a nota (só leitura; se faltar algum, avisa o Pedro).

## Rotina durante a campanha (12 a 19/11)
- **Expedição** (quem separa os pedidos; não é a Poly, que é suporte/atendimento e já sabe da promo): vê a tag `brinde-vn-kit-adulto` e o aviso na nota do pedido.
- **Claude, de manhã:** confere pela API (só leitura) se os pedidos acima de R$ 1.000 saíram marcados pelo Flow e avisa o Pedro se faltar algum.
- **24/11 (tarefa da Poly "Acompanhar com a expedição o envio dos brindes"):** a mesma lista serve para conferir com a expedição.

## No site
O tema Verme November **ainda não fala do brinde**. Sugestão: incluir "🎁 Kit adulto de presente acima de R$ 1.000" na barra de benefícios da PDP e do "Monte o pedido da casa", e no FAQ. Depende do ok do Pedro.
