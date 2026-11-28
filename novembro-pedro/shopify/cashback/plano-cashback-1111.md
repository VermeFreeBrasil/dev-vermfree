# Cashback 11/11 VermeFree — plano (para aprovação do Pedro)

Tarefa: `mcp-1793231782749-4-43158` · prazo 05/11 18h · bloqueia a tarefa da Sarah (mensagens automáticas, 06/11).
Ficha v2 (aprovada): 15% de cashback para os 100 primeiros pedidos do 11/11 · disponível em até 3 dias · usar até 30/11 23h59 (expira na virada para 01/12).

## O que a loja já tem (conferido em 30/10)
- Plano Grow, **novas contas de cliente** ativas, login opcional no checkout → o **crédito na loja nativo da Shopify** funciona: o saldo aparece na conta do cliente e é usado no checkout quando ele entra com o e-mail.
- Sem custo de app → não precisa do ok do Vitor (a tarefa só pede ok se tiver custo).

## Opção recomendada: crédito na loja nativo, lançado em lote
1. **Contagem:** pedidos criados a partir de 11/11 00h (horário de Brasília), em ordem de criação, **pagos** (Pix/cartão aprovados), sem cancelados nem pedidos de teste. Os 100 primeiros que cumprirem isso levam o cashback. Pedido não pago sai e entra o próximo.
2. **Valor:** 15% do valor dos produtos já com os descontos (subtotal após 20% e compre 4 leve 5), sem frete (o frete é grátis) — a confirmar.
3. **Liberação:** lançamento em lote via API no **dia 12/11 até as 18h** (dentro dos 3 dias), depois de conferir os pagamentos. Cada crédito vai com **validade 01/12/2026 00h00 (Brasília)**.
4. **Registro:** planilha com pedido, cliente, valor da compra, valor do crédito e data, salva aqui.
5. **Mensagem (Sarah):** "seu cashback de R$ X já está na sua conta VermeFree; para usar, entre com o e-mail da compra na hora de pagar; vale até 30/11".

Por que em lote e não automático (Flow): o Flow não sabe contar "os 100 primeiros pagos" com segurança; o lote garante o número exato e deixa conferir antes de lançar.

## Opção B: app de cashback (pago)
- Automatiza contagem e mensagens, mas tem mensalidade, instalação e teste novos a 6 dias do 11/11; precisa do ok do Vitor pelo custo.

## Teste antes de 05/11 (precisa do ok do Pedro)
- Lançar **R$ 1,00** de crédito numa conta de cliente interna (e-mail a definir), com validade curta, e conferir: aparece na conta, entra no checkout com login, some na validade. Depois zerar o saldo.

## Pendências
- Base do 15%: subtotal após descontos (proposta) ou total pago?
- E-mail da conta de cliente interna para o teste.

## Atualização 30/10 (decisões do Pedro + teste)
- **Base: 15% do TOTAL PAGO** do pedido (ex.: R$ 100 → R$ 15; R$ 1.000 → R$ 150).
- Teste de R$ 1,00 autorizado na conta "Lage Pedro" (pedrogustavolage@gmail.com, gid://shopify/Customer/9799711555803).
- **Bloqueio:** a conexão do Claude com a Shopify não tem a permissão `write_store_credit_account_transactions` (nem a de leitura de crédito). Não consigo lançar crédito pela API daqui.

## Caminho escolhido: Shopify Flow faz o crédito, Claude escolhe os 100 pedidos
1. Em 12/11 de manhã, o Claude lista os pedidos de 11/11 (00h a 23h59, Brasília), pagos, não cancelados, em ordem de criação, e marca os 100 primeiros com a tag `cashback-1111` (com o ok do Pedro). Planilha salva aqui.
2. Um fluxo do Shopify Flow (criado pelo Pedro no admin, o Flow é grátis no plano Grow):
   - **Gatilho:** Order tags added.
   - **Condição:** a tag adicionada é `cashback-1111`.
   - **Ação:** Send Admin API request → `storeCreditAccountCredit`, com:
     ```
     {
       "id": "{{ order.customer.id }}",
       "creditInput": {
         "creditAmount": { "amount": "{{ order.currentTotalPriceSet.shopMoney.amount | times: 0.15 | round: 2 }}", "currencyCode": "BRL" },
         "expiresAt": "2026-12-01T02:59:59Z",
         "notify": true
       }
     }
     ```
     (02:59:59Z = 30/11 23h59 em Brasília.)
3. Teste antes de 05/11: mesmo fluxo com a tag `cashback-teste` e valor fixo de R$ 1,00, aplicada num pedido antigo da conta interna; conferir que o saldo aparece na conta e no checkout com login; depois remover.

Alternativa sem Flow: lançar os 100 créditos à mão no admin (Clientes → cliente → Crédito na loja → Emitir crédito), com a planilha que o Claude gera. Leva ~1h.
