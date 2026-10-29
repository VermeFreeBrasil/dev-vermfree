# Plano de execução — novembro 2026 (Pedro Lage)

> **REGRA Nº 1: só VermeFree neste chat. Itens de Revita e Botanika neste plano NÃO são executados aqui.**

Fonte: exportação do Alliance OS de 29/10 (`fontes/`) + fichas de oferta aprovadas + Planejamento 2.0.
Total: **117 tarefas abertas** (67 VermeFree, 47 Revita/Derma, 3 Botanika). Das VermeFree, 10 estão atrasadas.

## 1. O diagnóstico em uma frase

A semana **30/10 a 06/11 é o gargalo do mês**. Nela vencem, somando as três marcas, cerca de **100 vídeos para editar, 85 estáticos, 3 landing pages e 6 configurações de Shopify**, além das 4 notas fiscais. Depois de 11/11 o ritmo cai para um padrão que se repete a cada campanha: criativos de Dia D, Shopify e virada de site.

Isso não cabe em uma pessoa trabalhando peça por peça. Por isso o plano tem duas partes: **(a)** a ordem de prioridade e **(b)** um jeito de produzir em lote (seção 4). Em paralelo, vale levar ao Vitor o volume de vídeos (ver `04-decisoes-e-pendencias.md`).

## 2. Regra de prioridade (o que vem primeiro quando tudo é urgente)

1. **O que trava outra pessoa com hora marcada.** Otávio programa tráfego; Sarah monta mensagens automáticas; Poly usa o cupom. Atraso aqui vira atraso de campanha.
2. **O que entra no ar sozinho num Dia D.** Oferta, tema, brindes e virada de site, sempre **3 dias antes** (regra do Vitor).
3. **Prazo fixo externo.** Nota fiscal (dia 06), sorteio (13/11 e 02/12).
4. **Melhorias de site (Growth/SEO/CRO).** São importantes, mas não têm hora de campanha. Vão para as janelas mais vazias, com datas novas combinadas com o Vitor.
5. **Acompanhamento sem prazo** (Ações de Recompra). Entram nos indicadores da reunião de KPI de quinta, não como produção.

## 3. Marcos do mês

| Marco | Data limite | O que precisa estar pronto | Por que |
|---|---|---|---|
| **M0 · Captação no ar** | **SEX 30/10 12h–18h** | LP + 10 estáticos de captação (VF, atrasados; Revita; Botanika) · 15 estáticos universais Revita e Botanika · Esquenta Revita (cashback, oferta, tema) · 20 vídeos Revita | Tráfego de captação e Esquenta Revita começam no fim de semana |
| **M1 · VF trancado para captação** | **SÁB 31/10 23h** | Site VF virando LP às 00h de 01/11 (agendado e testado) | Ficha do 11/11 |
| **M2 · Criativos do mês com o Otávio** | **QUI 05/11 18h** | 50 vídeos + 30 estáticos universais VF · 30 vídeos + 15 estáticos Revita | Otávio programa a conversão do 11/11 em 06/11 |
| **M3 · 11/11 montado** | **SEX 06/11 18h** | Criativos de Dia D (VF e Revita) · oferta, tema, brindes, cashback e sorteio do 11/11 · 4 notas fiscais | 3 dias antes do Dia D |
| **M4 · Pós 11/11 engatilhado** | **SEG 09/11 18h** | Cupom do Recovery (VF e Revita) · Verme November e Derma November configuradas | Entram em 12/11 00h |
| **D-Day 11/11** | QUA 11/11 | Revisão 08h30, acompanhar 00h/07h/20h/23h59 | 56% da meta do mês |
| **M5 · Sorteio 11/11 + 1ª renovação** | SEX 13/11 18h | Sorteio gravado e ganhador avisado · 10 vídeos + 10 estáticos novos | — |
| **M6 · Semana temática + Friday** | TER 17/11 → QUI 19/11 | Verme Week e Revita Week configuradas (17/11) · criativos de Dia D da Verme Friday e Revita Friday (19/11 12h) · banner VIP da Revita Friday (19/11) | 3 dias antes |
| **M7 · Black Friday montada** | SEG 23/11 → TER 24/11 | Fechamento do site VF (23/11) · oferta, tema, brindes e sorteio da Verme Friday e Revita Friday (24/11) | — |
| **M8 · Segunda-feira de encerramento** | QUA 25/11 → SEX 27/11 | Criativos Free Monday e Derma Monday (25/11) · banners VIP (26/11) · oferta/tema/brindes + volta das regras normais em 01/12 (27/11) | — |
| **M9 · Fechamento do mês** | QUA 02/12 | Sorteio da Verme Friday · fechar tarefas-mãe de Site e Shopify | — |

## 4. Como resolver cada tipo de tarefa da forma mais eficiente

> Tudo abaixo é **proposta**. Antes de mexer em qualquer coisa, eu mostro o passo a passo e espero o seu ok.

### 4.1 Estáticos (≈ 120 no mês, somando as marcas)

- **Um molde por marca, uma vez só**: feed 4:5 e story 9:16, com área segura (texto fora dos 14% de cima e dos 35% de baixo).
- **Copy em lote:** eu gero 30 headlines por ângulo (dor, prova social, praticidade, família, natural, "maior desconto da história") já dentro das regras (sem promessa de cura, sem médico como aval, sem cupom além de 2%). Você escolhe e cola no molde.
- **Variações por troca de elemento**, não peça do zero: 5 ângulos × 3 imagens × 2 formatos = 30 universais.
- Os de **Dia D** reaproveitam o molde universal, trocando só a faixa da oferta.
- Ferramenta: Canva (criação em lote com planilha) ou Higgsfield para imagem de produto. Escolha sua.

### 4.2 Vídeos (≈ 100 edições até 05/11, depois 10 por semana + 5 por Dia D)

- O repositório já tem a skill **`editar-videos-drive`**: edita em lote vídeos verticais de uma pasta do Drive (legenda, cortes, CTA) e devolve MP4. **Pré-requisito:** liberar o domínio `cdn-lfs.huggingface.co` na rede do ambiente e instalar o faster-whisper (o aviso apareceu na abertura da sessão).
- Fluxo proposto: Mafe sobe o bruto nomeado por roteiro e gancho → rodo o lote → você revisa e ajusta só o que precisar.
- Universais: sem data, % ou campanha. Dia D: oferta na tela, conferida contra a ficha.
- **Se a automação não ficar pronta até 02/11**, o volume é inviável à mão e precisa ir ao Vitor (pendência P1).

### 4.3 Shopify: oferta, frete, cupons (5 campanhas VF + 6 Revita)

- **Um "dia de Shopify" por marca**, criando de uma vez os descontos automáticos de todas as campanhas do mês com início e fim agendados. Os descontos aceitam data de início e fim nativamente, então não fica dependendo de alguém virar à meia-noite.
- **Escada por quantidade:** 3 descontos automáticos (1, 3 e 5 unidades), ou um app de desconto por volume se a combinação nativa não segurar. Testar no carrinho com 1, 3 e 5 itens.
- **Compre 4 leve 5 somando com o %:** desconto "Compre X leve Y" + desconto percentual com **combinação liberada** entre descontos de produto. Testar se o grátis é o de menor valor.
- **Cupons de influenciadora em 2%:** edição em massa no dia 1 (e volta para 5% agendada para 01/12).
- **Acesso antecipado do VIP (00h–07h):** coleção oculta ou link de checkout com o desconto, ativo à 00h. O site só abre às 07h.
- Sempre fechar com **pedido de teste** e print no Alliance OS (as tarefas exigem).

### 4.4 Tema do site (banner, tarja com timer, aviso no produto) e sites fechados

- Em vez de publicar um tema por campanha à meia-noite, montar **um tema só com os blocos de todas as campanhas, cada um aparecendo pela data** (seção controlada por data e hora). Entra e sai sozinho, que é o que a ficha pede. Testar o cache.
- **Site trancado (VF 01–11/11; banners VIP em 26/11 e 29/11):** duas opções para decidir juntos:
  - (a) página de senha da Shopify personalizada como LP, com o VIP recebendo o link de acesso;
  - (b) template que mostra a LP em todas as páginas.

  Conferir se o pixel da Meta dispara na página escolhida, porque o tráfego de captação depende disso.
- Toda virada: **teste no celular**.

### 4.5 Brindes (kit kids, kit adulto, guia e manual)

- Kit entrando sozinho no pedido: a Shopify nativa não adiciona brinde sozinha. Precisa de um app de brinde automático ou de uma regra de compre X leve Y com o kit. Conferir o que a loja já tem antes de instalar algo novo.
- Guia e manual digitais: um link único (Drive ou arquivo da Shopify) entregue à Sarah, reaproveitado no 11/11 e na Verme Friday.
- Conferir o **estoque** de kit kids e kit adulto antes de cada campanha e avisar o Vitor.

### 4.6 Cashback (15% para os 100 primeiros, libera em até 3 dias, expira 30/11 23h59)

- Primeira opção, sem custo: **crédito de loja nativo da Shopify + Shopify Flow** (pedido criado no 11/11 → se estiver entre os 100 primeiros → espera → crédito de 15% com validade até 30/11). Precisa confirmar se a loja tem crédito de loja e Flow disponíveis.
- Se não tiver, usar um app de cashback, **com ok do Vitor se tiver custo** (a tarefa exige).
- A Revita tem cashback em todas as campanhas: vale montar a mesma solução nas duas lojas de uma vez.

### 4.7 Sorteio (300 primeiros pedidos)

- Um regulamento-modelo usado no 11/11 e na Verme Friday.
- Marcação dos 300 primeiros: Flow com tag, ou exportação dos pedidos do período ordenados por horário. A segunda é mais simples e auditável.
- Sorteio gravado; a Sarah anuncia e a Poly avisa o ganhador.

### 4.8 Landing pages de captação (3 marcas)

- **Um molde, três versões**: headline do Dia D sem abrir a oferta, benefícios de estar no grupo (recebe antes, mais chance no cashback e no sorteio), botão com o link rastreado da Sarah.
- Checklist: publicada · botão testado no celular · link com UTM · enviada ao Otávio.

### 4.9 Growth (SEO e CRO): 10 subtarefas atrasadas

Proposta para replanejar com o Vitor:

| Bloco | Quando | Por quê |
|---|---|---|
| 301 dos links antigos + teste dos 3 botões (os 3 links já foram trocados) · indexação dos 10 artigos no Search Console | **30/10–31/10, 1h no total** | Custam venda e são rápidos |
| Snippet do Judge.me + dados estruturados (juntos) | 03/11 (antes da reunião de CRO) ou 12–13/11 | Melhor antes de o site trancar, ou logo depois de destrancar |
| Página Kids, rodapé, "VermeFree funciona?", quiz | 12/11–18/11 | O site fica trancado de 01 a 11/11, então não adianta publicar antes |
| Manifesto e LP comparativa | Texto até 16/11 → Vitor/Sintonia → publicar depois do ok | Dependem de validação dos sócios e de regras da Anvisa e do Conar |

### 4.10 Captação de leads

- **Copy do ManyChat** (atrasada): rascunho comigo em uma sessão. Uso palavras-chave provisórias até o Ítalo fechar o plano de Instagram (que está pendente). Entregar à Sarah até 02/11.
- **40 artigos**: a checklist está toda marcada, mas o status está "a fazer". Confirmar se já foram escritos (pendência P5).

### 4.11 Pesquisa de indicação (vence 02/11)

As subtarefas do Pedro são: extrair a lista RFM de Campeões e Fiéis, montar o formulário, escrever a copy de envio e lembrete, e passar tudo para a Poly. Faço o formulário e a copy com você em uma sessão. Precisa confirmar o que já está pronto (pendência P6).

### 4.12 Nota fiscal

4 notas (VermeFree, Revita, Botanika, Shoty) **até sexta 06/11**, enviadas à Vanessa. Concluir no sistema só depois da confirmação do financeiro.
