# Brinde da Verme Friday: guia de alimentos + manual da desparasitação (digitais) · preparado em 18/11

Ficha VF v3: "Guia de alimentos antiparasitários + manual da desparasitação, digitais, enviados automaticamente para quem comprar em 27 ou 28/11".
Tarefa do Alliance (24/11 18h): "vão por link no e-mail de confirmação e na mensagem pós-compra, que já foram montados no 11/11: aqui é só reativar com as datas da Black".
Falta: os 2 links (Sarah) → trocar LINK_DO_GUIA e LINK_DO_MANUAL abaixo.

## 1) E-mail de confirmação do pedido (Shopify · Pedro cola, 2 min)
Shopify admin › Configurações › Notificações › Notificações de clientes › **Confirmação do pedido** › Editar código.
Colar o bloco abaixo logo depois do texto de agradecimento (antes da lista de produtos). Ele só aparece em pedidos criados de 27/11 00h a 28/11 23h59 (Brasília); fora disso o e-mail fica igual. Salvar e usar "Enviar e-mail de teste" (o teste usa a data de hoje, então não mostra o bloco: normal).

```liquid
{%- assign vf_ts = created_at | date: '%s' | plus: 0 -%}
{%- if vf_ts >= 1795748400 and vf_ts < 1795921200 -%}
<table class="row" style="width:100%;margin:20px 0;border:2px solid #e01e26;border-radius:10px"><tr><td style="padding:18px 20px;font-family:Arial,sans-serif">
  <p style="margin:0 0 8px;font-size:16px;font-weight:bold;color:#111">🎁 Seu presente da Verme Friday</p>
  <p style="margin:0 0 14px;font-size:14px;color:#333;line-height:1.5">Como você comprou na Verme Friday, ganhou o <b>guia de alimentos antiparasitários</b> e o <b>manual da desparasitação</b>. É só baixar:</p>
  <p style="margin:0 0 8px"><a href="LINK_DO_GUIA" style="display:inline-block;background:#e01e26;color:#fff;text-decoration:none;font-weight:bold;padding:10px 16px;border-radius:6px">Baixar o guia de alimentos</a></p>
  <p style="margin:0"><a href="LINK_DO_MANUAL" style="display:inline-block;background:#111;color:#fff;text-decoration:none;font-weight:bold;padding:10px 16px;border-radius:6px">Baixar o manual da desparasitação</a></p>
</td></tr></table>
{%- endif -%}
```
(1795748400 = 27/11/2026 00:00 de Brasília · 1795921200 = 29/11/2026 00:00 de Brasília. Depois de 28/11 o bloco some sozinho.)

## 2) Mensagem pós-compra no WhatsApp (Sarah reativa a automação do 11/11)
Janela: pedidos de 27/11 00h a 28/11 23h59. Texto:
> Oi, {primeiro nome}! Seu pedido da Verme Friday foi confirmado 💚
> Como prometido, aqui estão seus presentes:
> 📗 Guia de alimentos antiparasitários: LINK_DO_GUIA
> 📘 Manual da desparasitação: LINK_DO_MANUAL
> Qualquer dúvida, é só responder por aqui.

## 3) Flow de controle (opcional, recomendado)
Flow "Verme Friday · guia e manual (27–28/11)": gatilho Order created → condição order.createdAt ≥ 27/11/2026 00:00 e < 29/11/2026 00:00 → tag `brinde-vf-guia-manual`. Serve para a Poly/Sarah filtrarem quem tem direito e reenviarem os links se alguém pedir. (Duplicar o Flow do brinde do Free Monday, trocar datas e tag, tirar a condição de valor e a nota.)

## Conferência
- Antes: Pedro manda print do e-mail de confirmação editado; Claude confere datas e links.
- 27/11 de manhã (só leitura): pedidos desde 00h com a tag; Sarah confirma que a mensagem saiu.
