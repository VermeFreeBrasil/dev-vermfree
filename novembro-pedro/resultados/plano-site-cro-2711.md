# Plano de Site/CRO · VermeFree (27/11/2026)

Base: números da Shopify (set–nov), 4.041 mensagens do atendimento (04–27/11), avaliações Judge.me, funil do quiz, formas de pagamento e auditoria mobile (Playwright) do tema da Black e do ★ PADRÃO.

## Diagnóstico
- 80% entram pela home (7,9% adicionam ao carrinho). PDP do Adulto como entrada: 4,6%.
- Checkout: set–out só 34% de quem chega termina; nov 45%. Carrinhos abandonados têm ticket maior (R$ 575) que os concluídos (R$ 490): família abandona mais.
- 59% dos pedidos têm 1 item (amostra de out).
- Atendimento: idade/dose/qual serve ~32% · como tomar ~15% · cupom/brinde ~13% · preço p/ várias pessoas ~13% · prazo ~13% · quando começar/lua ~10% · segurança ~9%. 1º motivo de reembolso: idade errada.
- FAQ: 26 visualizações (home 3.942). Selo Judge.me com data-average-rating 0.00 no HTML.
- Pagamento: cartão ~72%, Pix ~25%, sem boleto (rodapé mostra boleto). Parcelas: PDP "3x", carrinho do PADRÃO "10x". Frete grátis: barra e resumo calculam diferente (R$ 52 x R$ 114,46).
- Celular: tema da Black com CLS 1,0 (barra AO VIVO entra por JS); PDP da Black abre com "5 unidades" marcado; carrinho com "Finalizar" abaixo da dobra; PADRÃO com quiz em tela cheia depois do "comprar".

## 4 apostas
1. "Quem vai tomar?" com idade exata montando o carrinho (no lugar do quiz pós-carrinho em tela cheia).
2. Carrinho que fecha: botão fixo, upsell de 1 toque abaixo do botão, prazo por CEP ligado à lua nova, uma regra só de frete e parcelas, brinde como item visível.
3. PDP que responde antes de perguntar: para quem/idade, preço 3x + Pix, prazo, garantia e farmacêutica acima da dobra; tabela de ml por idade; "o que esperar nos primeiros dias"; quem não pode tomar; estrelas corrigidas.
4. Pós-compra no app: corrigir o login (código do e-mail não chega), link no obrigado/entregue, fim de ciclo → recompra.

## Ganho de referência
Cada +1 ponto no fechamento do checkout ≈ +23 pedidos/mês ≈ +R$ 11 mil/mês (base set–out: ~2.270 checkouts/mês, ticket ~R$ 500).
