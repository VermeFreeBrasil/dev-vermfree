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
