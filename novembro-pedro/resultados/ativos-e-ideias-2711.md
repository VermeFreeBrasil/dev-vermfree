# VermeFree · ativos de cliente e ideias (27/11/2026)

Levantamento só leitura (Shopify, tema, Vercel, Supabase, Unnichat, ActiveCampaign, SendFlow, Creator Club, n8n). Sem dados pessoais.

## O que existe e quase não é usado
- App app.vermefree.com.br (PWA, Vercel + Supabase): login pelo e-mail da compra, perfis por pessoa da casa (adulto/kids), cronograma pela lua nova, checklist diário de doses, lembretes só via .ics, guia de alimentos, rastreio do pedido, quiz de fim de ciclo com cupom. Uso: 15 clientes (de 6.509), 23 perfis, 35 checks, 0 respostas de fim de ciclo. Seção do app na home do ★ PADRÃO está desativada; nenhum fluxo manda o link.
- Unnichat: 15 automações ativas (compra, pix, carrinho, entrega, "Recompra" e "Recompra | Ciclo da Lua" por tags de dias 13/17).
- ActiveCampaign: listas grandes sem nutrição (Alunos Dr. William 16,8 mil, 100verme leads 14,8 mil, VermeFree 8,9 mil, A Nova Saúde compradores 5,9 mil, VIP 11/11 4,4 mil, 100verme clientes 4,3 mil); 3 automações prontas e nunca ativadas (saiu para entrega, entregue, pop-up 5OFF).
- Quiz/teste infantil: 101 leads, 1 pedido ligado. Texto com "diagnóstico" (risco Anvisa).
- Pesquisa/NPS: 0 respostas. Creator Club: 12 de 47 venderam em nov, 0 clientes novas, UGC 0/9; 1 creator ≈ 57% das vendas com cupom.
- Sem assinatura, sem cashback permanente.
- ⚠️ Segurança: tabela app_config do Supabase guarda chaves da Shopify, token CAPI e senhas em texto (RLS ligada) → mover para cofre de segredos.

## Ideias (ver mensagem ao Pedro de 27/11)
1. O app vira parte do produto (QR na caixa, link no "compra aprovada" e no "entregue").
2. Perfis sem protocolo no app viram o upsell da família.
3. Coach de doses pelo WhatsApp a partir do checklist.
4. Fim de ciclo = depoimento + recompra.
5. Recompra pelo calendário de cada cliente (assinatura sem app de assinatura).
6. Calendário grátis para leads e para a base adormecida do ActiveCampaign.
