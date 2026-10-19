# Pedido de avaliação por WhatsApp (n8n)

Todo dia às 10h (horário de Brasília), o fluxo pega os pedidos **pagos e já despachados** feitos há **8 dias** e manda uma mensagem de WhatsApp pedindo a avaliação com foto ou vídeo, com o cupom **AVALIEI10** (10% na próxima compra) de incentivo.

Arquivo para importar no n8n: `workflow-avaliacao-whatsapp.json`.

## Como o fluxo funciona

```
Todo dia 10h ─┐
              ├─ Config ─ Shopify: gerar token ─ Janela de datas ─ Shopify: buscar pedidos ─ Montar mensagens ─ Uma por vez ─┐
Rodar manual ─┘                                                                                                            │
                     ┌──────────────────────────────────────────────────────────────────────────────────────────────────┘
                     └─ Enviar WhatsApp ─(deu certo)─ Shopify: marcar enviado ─ Pausa 45 a 120s ─ volta pro próximo
                                        └(falhou)──────────────────────────────┘
```

- **Quem recebe:** pedidos pagos, não cancelados e já despachados, feitos no dia de hoje menos 8 dias.
- **Quem fica de fora:**
  - pedidos ou clientes com a tag `review-whatsapp-enviado`, para não mandar duas vezes;
  - clientes com a tag `whatsapp-optout`;
  - telefones inválidos;
  - o mesmo telefone repetido no dia, que recebe só uma mensagem.
- **Telefone:** sai do endereço de entrega (ou de cobrança). O fluxo coloca o 55 na frente quando falta.
- **Produto e link:** entra o produto principal do pedido. O óleo de alho só aparece se for o único item. O link leva direto para as avaliações do produto (`#avaliacoes`) e tem UTM, para medir no Analytics.
- **Saudação:** alterna entre "Oi", "Olá" e "Oii", para as mensagens não saírem todas iguais.
- **Depois de enviar:** marca o pedido e a cliente com `review-whatsapp-enviado` na Shopify.
- **Pausa:** espera de 45 a 120 segundos (aleatório) entre uma cliente e outra, para reduzir o risco de bloqueio do número.

## Passo a passo para ligar

### 1. Importar
No n8n, vá em **Workflows → Import from file** e escolha `workflow-avaliacao-whatsapp.json`.

### 2. Criar o acesso à Shopify
1. Crie um app no **Dev Dashboard** da Shopify (dev.shopify.com), na mesma organização da loja.
2. Dê ao app as permissões `read_orders`, `write_orders`, `read_customers` e `write_customers`. O `write` é o que permite colocar as tags.
3. Instale o app na loja.
4. Copie o **Client ID** e o **Client secret** para os campos `shopify_client_id` e `shopify_client_secret` do nó **Config**.

Se vocês já têm um token fixo de app personalizado (começa com `shpat_`), coloque-o em `shopify_token_fixo` e pode deixar o client id e o secret vazios.

### 3. Configurar o WhatsApp do suporte
Preencha no **Config**:

| Campo | Evolution API | Z-API |
|---|---|---|
| `whatsapp_provedor` | `evolution` | `zapi` |
| `whatsapp_url` | `https://SEU-SERVIDOR/message/sendText/SUA-INSTANCIA` | `https://api.z-api.io/instances/ID/token/TOKEN/send-text` |
| `whatsapp_header_nome` | `apikey` | `Client-Token` |
| `whatsapp_header_valor` | a API key da instância | o Client-Token da conta |

Se o provedor for outro, ajuste o `payload` no fim do nó **Montar mensagens**. Hoje ele manda `{ number, text }`, ou `{ phone, message }` no Z-API.

### 4. Testar
1. Deixe `modo_teste` ligado (`true`) e coloque o seu celular em `telefone_teste`, com DDD.
2. Clique em **Rodar manualmente**.

No modo teste vai **só uma mensagem**, para o seu número, com `[TESTE #pedido]` no começo, e **nada é marcado** na Shopify.

Para testar um dia que teve pedidos, mude `dias_apos_compra` por um momento. Por exemplo, para olhar os pedidos de 08/10 a partir de 19/10, use `11`.

### 5. Ligar de verdade
1. Mude `modo_teste` para `false`.
2. Volte `dias_apos_compra` para `8`.
3. Ative o workflow (botão **Active**).

## Quando a cliente responder SAIR
Por enquanto é manual. Na Shopify, abra a cliente e adicione a tag `whatsapp-optout`. Ela não recebe mais.

Para automatizar depois: um segundo fluxo com Webhook recebe as respostas do provedor de WhatsApp e coloca a tag sozinho.

## Ajustes rápidos (todos no nó Config)
- `dias_apos_compra`: 7 a 10. O padrão é 8, tempo médio de entrega.
- `cupom` e `cupom_descricao`: troca o cupom e o texto da recompensa.
- `espera_min_seg` e `espera_max_seg`: o intervalo entre envios.
- **Horário:** é o gatilho **Todo dia 10h** (cron `0 10 * * *`).

## Cupom na Shopify
**AVALIEI10**: 10% em todos os produtos, uma vez por cliente, sem data para acabar. Foi criado em 19/10/2026.
