# Brinde do Free Monday: 1 kit adulto nos pedidos acima de R$ 1.000

Ficha v2 (Vitor): "Compras acima de R$ 1.000: 1 kit adulto". Vale em 30/11 (00h → 23h59).
Flow **"Free Monday · brinde kit adulto (> R$ 1.000)"**, duplicado do da Verme Week e ativado pelo Pedro em 17/11 (conferido pelos prints):
- Gatilho: Order created.
- Condição (AND): order.createdAt ≥ 30/11/2026 00:00 · order.createdAt < 01/12/2026 00:00 · order.currentSubtotalPriceSet.shopMoney.amount > 1000.
- Verdadeiro → tag `brinde-fm-kit-adulto` → nota "🎁 BRINDE FREE MONDAY: enviar 1 kit adulto junto com este pedido. {{order.note}}".
Conferência: 01/12 de manhã (só leitura) — pedidos de 30/11 acima de R$ 1.000 com a tag.
