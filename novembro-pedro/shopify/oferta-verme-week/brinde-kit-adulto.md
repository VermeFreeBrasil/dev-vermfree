# Brinde da Verme Week: 1 kit adulto nos pedidos acima de R$ 1.000

Ficha da oferta v3 (Vitor, 28/10): "Compras acima de R$ 1.000: 1 kit adulto". Vale de 20/11 00h a 26/11 23h59.
Mesmo modelo do brinde da Verme November (ver ../oferta-verme-november/brinde-kit-adulto.md).

Flow **"Verme Week · brinde kit adulto (> R$ 1.000)"**, montado e ativado pelo Pedro em 09/11:
- Gatilho: Order created.
- Condição (AND): order.createdAt ≥ 20/11/2026 00:00 · order.createdAt < 27/11/2026 00:00 · Shop money amount > 1000 (deve ser order/currentSubtotalPriceSet/shopMoney/amount; conferir pelo print).
- Verdadeiro → Add order tags `brinde-vw-kit-adulto` → Update order note "🎁 BRINDE VERME WEEK: enviar 1 kit adulto junto com este pedido. {{order.note}}".
- Falso → nada.

Rotina de 20 a 27/11: de manhã o Claude confere pela API (só leitura) se os pedidos acima de R$ 1.000 saíram com a tag e avisa o Pedro se faltar algum.
