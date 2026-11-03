# Cashback 11/11: passo a passo no Shopify Flow

Feito em 03/11 para o Pedro montar no admin. A tarefa vence em 05/11 às 18h. O plano completo está em `plano-cashback-1111.md`.

**Como funciona:** em 12/11, o Claude marca os 100 primeiros pedidos pagos do 11/11 com a tag `cashback-1111`. O Flow vê a tag e lança 15% do total pago como crédito na loja da cliente, com validade até 30/11 às 23h59.

Você monta **dois fluxos**: o de **teste** (R$ 1,00) e o **real**. O teste vem primeiro.

---

## Parte 1 · Fluxo de TESTE (R$ 1,00)

1. Admin da Shopify → **Apps** → **Shopify Flow**. Se o Flow não estiver instalado, instale: é grátis.
2. **Criar fluxo** → **Selecionar um gatilho** → busque **"Order tags added"** (Tags do pedido adicionadas).
3. Clique no **+** depois do gatilho → **Condição**:
   - Clique em **Adicionar critério** → escolha **tags** (as tags que acabaram de ser adicionadas).
   - Regra: **pelo menos um** item → **igual a** → `cashback-teste`.
   - Clique em **Adicionar critério** de novo, ligado com **E** → **Order / Customer / id** → **não está vazio**. Isso pula pedidos sem cliente.
4. No caminho **Então** (verdadeiro) → **+** → **Ação** → busque **"Send Admin API request"** (Enviar solicitação da API do Admin).
   - **Mutation:** `storeCreditAccountCredit`
   - **Mutation inputs:** apague o que vier no campo e cole isto:

```
{
  "id": "{{ order.customer.id }}",
  "creditInput": {
    "creditAmount": { "amount": "1.00", "currencyCode": "BRL" },
    "expiresAt": "2026-11-07T02:59:59Z",
    "notify": false
  }
}
```

5. No topo, dê o nome **"Cashback 11/11 · TESTE"** → **Ativar**.
6. Se o Flow pedir permissão para a ação da API (ler/gravar crédito na loja), **aceite**.
7. Me avise: "fluxo de teste ativo". Eu coloco a tag `cashback-teste` num pedido antigo da sua conta (Lage Pedro). **Isso precisa do seu ok na hora.**
8. Para conferir: Admin → **Clientes** → Lage Pedro → bloco **Crédito na loja**. Tem que aparecer **R$ 1,00**, com validade até 06/11.
9. Se der certo:
   - Desative o fluxo de teste.
   - Zere o saldo: no mesmo bloco, **Ajustar** → remova R$ 1,00. Ou espere vencer.
   - Se der erro, abra o fluxo → aba **Execuções** → me mande um print da mensagem de erro.

---

## Parte 2 · Fluxo REAL (15% do total pago)

Repita os passos 1 a 6 com estas diferenças:

- **Condição:** a tag é `cashback-1111`.
- **Mutation inputs:**

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

- **Nome:** "Cashback 11/11 · 15% (100 primeiros)".
- **Ativar** e deixar ligado até 12/11.

Notas:
- `02:59:59Z` corresponde a **30/11 às 23h59 em Brasília**. Às 00h de 01/12 o saldo expira.
- `notify: true` faz a Shopify mandar um e-mail para a cliente avisando do crédito. A mensagem da Sarah no WhatsApp complementa.
- Ninguém recebe crédito antes de 12/11, porque o fluxo só age quando a tag `cashback-1111` aparece, e só eu coloco essa tag, com o seu ok.

---

## Parte 3 · Dia 12/11 (o que eu faço)

1. Listo os pedidos de 11/11, das 00h às 23h59 de Brasília, que estejam pagos e não cancelados, em ordem de criação, e pego os 100 primeiros. A lista vai para `cashback-1111-lista.csv` (fora do repositório, porque tem dados de clientes).
2. Mostro a você o total de crédito e os 3 primeiros e os 3 últimos pedidos da lista. **Só aplico as tags com o seu ok.**
3. Aplico a tag `cashback-1111` nos 100 pedidos, e o Flow lança os créditos.
4. Confiro uma amostra no admin e aviso a Sarah para disparar a mensagem.

**Plano B:** se o Flow falhar, você lança à mão em Clientes → Crédito na loja → Emitir crédito, usando a lista que eu entrego. Leva cerca de 1 hora.

---

## Texto para a Sarah (WhatsApp, 12/11 depois dos créditos)

> Oi, {nome}! Você foi um dos 100 primeiros pedidos do 11/11 da VermeFree 🎉
> Seu cashback de **R$ {valor}** já está na sua conta VermeFree.
> Para usar, é só entrar com o e-mail da compra na hora de pagar no site. O saldo aparece no checkout.
> Vale até **30/11 às 23h59**. Depois disso ele expira.
