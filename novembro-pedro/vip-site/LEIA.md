# LP de captura do Grupo VIP 11/11 — vip.vermefree.com.br

- Hospedagem: Vercel, equipe VermeFreeBrasil, projeto `vip-vermefree` (prj_QNLKXGb8fZj4p2sZ4LJJLA2Rjses), deploy de 30/10 (dpl_38Ncq4gw4Qs1yhvsj33WUHCYBv9c). Arquivo único: `index.html` (esta pasta).
- Domínio `vip.vermefree.com.br` NO AR desde 30/10 ~14h (CNAME vip → cname.vercel-dns.com na Cloudflare, nuvem cinza). HTTPS ok.
- Os links *.vercel.app pedem login da Vercel (proteção padrão); o domínio próprio fica público.
- Mídias: todas nos Arquivos da Shopify (cdn vermefree.com.br), incluindo os prints vf-depoimento-04..07 (copiados em 30/10).
- Rastreio: Meta (2239781696850189, 867430254699991) PageView + Lead no clique; Google Ads AW-18193701893 e GA4 G-W0NZM1LHSN (page_view + generate_lead no clique); Utmify (pixel + UTMs). Rótulo de conversão do Google Ads: variável ADS_LABEL (vazia até receber).
- Botões: https://sndflw.com/i/vermefree11-11 · contagem até 11/11 00h.
- Para atualizar: editar index.html e fazer novo deploy no mesmo projeto (target production).

## Pop-up de cadastro (30/10)
- Os botões abrem um pop-up com nome, e-mail e WhatsApp (máscara BR). No envio: Lead (Meta), generate_lead (GA4), POST /api/lead e redireciona ao grupo (no máx. 2,5 s de espera).
- `api/lead.js` (função da Vercel) cria/atualiza o contato no ActiveCampaign com a tag `grupo-vip-1111` (id 60) e o telefone +55.
- Variáveis na Vercel: AC_TAG_ID=60 (configurada); **AC_API_URL e AC_API_KEY: o Pedro adiciona** (Settings → Environment Variables, Production) e depois é preciso um novo deploy para valerem. AC_LIST_ID opcional.
- Enquanto a chave não existir, cada cadastro fica registrado no log da Vercel com o prefixo LEAD_SEM_AC (Logs do projeto), para importar depois.
- Deploy atual: dpl_C4t9i2aNLoCFMSe9j4oDh46XWmq7.

## Lead no clique (01/11, pedido do Otávio)
- Diagnóstico do Otávio: desde 30/10, milhares de PageView e só 1 Lead; a campanha [Leads] otimiza para Lead e ficou sem sinal (pausada).
- Causa: o Lead só disparava no envio do pop-up, e quase ninguém envia.
- Agora: clique em "Quero entrar no Grupo VIP" → `trackSingle` Lead só no pixel VermeFree 2239781696850189 (uma vez por visita) e abre o pop-up; envio do pop-up → `trackSingle` CompleteRegistration (mesmo pixel). O pixel 867430254699991 (100 Verme) só recebe PageView.
- Deploy: dpl_9BK7qeZxL92z7cR8XQwvtXpx7Bsf (01/11). Testado localmente: Lead sai 1 vez no clique.

## Leads no ActiveCampaign via n8n (01/11)
- Lista no AC: "Grupo VIP 11/11 · VermeFree 2026" (id 15) + tag grupo-vip-1111 (id 60).
- Sem AC_API_URL/AC_API_KEY na Vercel, `api/lead.js` manda cada cadastro para o fluxo do n8n "VF · Lead LP VIP 11/11 → ActiveCampaign" (https://n8n.vermefree.com.br/workflow/eafD9osIZ1zWlqcc, webhook /webhook/vf-vip-1111-lead, credencial "ActiveCampaign - VermeFree"), que cria/atualiza o contato, põe na lista 15 e na tag 60. Se o n8n falhar, o log da Vercel mostra LEAD_ERRO_N8N (retenção de só 1 hora no plano Hobby).
- Deploy: dpl_7FYrmHCtzteG63BWT2N4GZrG4fRU. Leads recuperados à mão em 01/11: 3 (vindos do disparo dos grupos antigos das 10h). Cadastros de 30/10 até 01/11 ~11h40 se perderam (log expirado).
