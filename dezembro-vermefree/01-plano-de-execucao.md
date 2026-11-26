# Plano de execução · dezembro 2026 (Pedro Lage · VermeFree)

Fonte: Alliance OS em 26/11 (3 campanhas, 3 fichas e 46 tarefas do Pedro com prazo em dezembro, mais a tarefa de regras do mês, que vence em 27/11).

## 1. O mês em uma frase

São 3 campanhas curtas, todas no mesmo molde: **criativos, depois Shopify (tema, oferta e frete, brindes), depois a virada, depois a volta ao perpétuo.** Cada frente fica pronta 3 dias antes da execução, que é a regra do Vitor. O ponto mais apertado é **08 a 11/12**: Dia D e Lua Nova se sobrepõem, com 30 vídeos, 15 estáticos e 2 configurações completas de Shopify.

## 2. Regra de prioridade

1. **O que trava alguém com hora marcada:** os criativos (o Otávio programa o tráfego), os brindes (a Poly e a Sarah) e a virada do site.
2. **O que entra no ar sozinho:** desconto agendado, tema no Supreme e Flow de brinde, sempre 3 dias antes.
3. **A volta ao perpétuo** no dia seguinte a cada campanha, até as 12h.
4. **Rotina** (UGCs, estáticos do perpétuo, nota fiscal), só a parte VermeFree.
5. **Growth/SEO:** só se o Pedro confirmar que entra no escopo (P1).

## 3. Marcos

| Marco | Data limite | O que precisa estar pronto |
|---|---|---|
| **M0 · Dezembro abre limpo** | ter 01/12 12h | Regras de novembro fora e regras de dezembro dentro (influenciadora a 5%, roleta, 1ª compra, Nova Saúde) · ★ PADRÃO no ar · 29 cupons de influenciadora de 2% para 5% (na mão, 00h05) |
| **M1 · Sorteio Verme Friday** | qua 02/12 18h | Sorteio feito e ganhador avisado (ver P7) |
| **M2 · Criativos do Dia D** | ter 08/12 18h | 10 vídeos + 5 estáticos ➡️ Otávio |
| **M3 · Dia D montado** | qua 09/12 18h | Tema, desconto de 12% + frete grátis agendados (12/12 03:00Z → 14/12 02:59Z) · Flow do óleo de alho (100 primeiros) · regra de cupons da campanha |
| **M4 · Criativos da Lua Nova** | qui 10/12 18h | 20 vídeos + 10 estáticos ➡️ Otávio |
| **M5 · Lua Nova montada** | sex 11/12 18h | Tema, 10% + frete grátis acima de R$ 299 agendados (15/12 03:00Z → 22/12 02:59Z) · brinde do manual acima de R$ 500 |
| **D · Dia D** | sáb 12 → dom 13/12 | Conferência na virada (00h05), última chance às 20h, fim às 23h59 |
| **M6 · Volta do Dia D** | seg 14/12 12h | Perpétuo, cupons de volta a 5%, conferido |
| **D · Lua Nova** | ter 15 → seg 21/12 | Conferência na virada, última chance seg 21/12 às 20h |
| **M7 · Natal montado** | seg 21/12 12h–18h | 10 vídeos + 5 estáticos (12h) · tema, 12% + frete grátis, Flow do óleo de alho (18h) |
| **M8 · Volta da Lua Nova** | ter 22/12 12h | Perpétuo conferido |
| **D · Natal Relâmpago** | qui 24 → sex 25/12 | Conferência na virada |
| **M9 · Volta do Natal** | sáb 26/12 12h | Perpétuo conferido |
| **M10 · Janeiro programado** | ter 29/12 18h | Regras do mês para janeiro (se não houver planejamento, manter as de dezembro e registrar) |

## 4. Como fazer cada tipo de tarefa

> Tudo abaixo é proposta. Antes de aplicar, mostro a prévia e espero o "pode".

### Shopify · oferta e frete
- Desconto automático ORDER de 12% (ou 10%) em todo o site, com `startsAt`/`endsAt` em UTC (00h de Brasília = 03:00Z).
- Frete grátis como desconto de frete: sem mínimo no Dia D e no Natal, mínimo de R$ 299 na Lua Nova.
- **Regra de cupons da campanha:** conferir `combinesWith` de cada cupom.
  - Influenciadora: PRODUCT a 2%, soma com o ORDER. Muda pra 2% na entrada e volta a 5% na saída (a % não agenda: fazer na mão, com ok).
  - 1ª compra, Nova Saúde, roleta e recompra: não podem somar. Pausar ou ajustar `combinesWith` durante a janela.
- Ler com `discountNodes`. Desativar sem apagar com `discountAutomaticDeactivate`.

### Shopify · tema
- Duplicar o ★ PADRÃO (169143533787) → "N · Campanha · início a fim". Barra, banner, PDPs, carrinho, FAQ e letra miúda, só com o que está na ficha.
- Guardar `antes/` e `depois/` com md5 em `shopify/<campanha>/`.
- Prévia com Playwright (390×844 e desktop), com os handles certos dos produtos (ver o briefing).
- O Pedro agenda a publicação no Supreme e manda um print pra conferir.

### Shopify · brindes
- **Óleo de alho nos 100 primeiros (Dia D e Natal):** Flow com tag no pedido e um contador. Como contar está em aberto (P5).
- **Manual da Lua Nova acima de R$ 500:** tag por valor no Flow, e o envio fica com a Sarah se for PDF (P6).

### Criativos
- **Vídeos:** editar 1, mandar no chat, esperar a aprovação, fazer o resto. Comprimir pra ~25–27 MB antes de subir. Pipeline em `novembro-pedro/ferramentas/video/`.
- **Estáticos:** gerador neon (`novembro-pedro/criativos/verme-friday/gerar8-sem5.cjs`), fundo preto com vermelho e branco, produto real e só mãos. Sem preço total, falar "protocolo" e 4:5 + 9:16.
- Quando chegar o bruto, guardar no diário os ids do Drive.

### Viradas
- Conferência só de leitura 5 min depois de cada virada (`send_later`): tema MAIN? descontos ACTIVE/EXPIRED? carrinho com 1/3/5 itens? frete? brinde?
