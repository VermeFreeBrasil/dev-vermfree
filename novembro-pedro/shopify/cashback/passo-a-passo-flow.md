# Cashback 11/11: Shopify Flow (VALIDADO em 03/11)

Tarefa vence em 05/11 às 18h. O plano completo está em `plano-cashback-1111.md`.

## Como funciona

A Shopify não tem um gatilho nativo "Order tags added" (só existe em apps de terceiros). Por isso o fluxo usa o gatilho **Customer tags added**, e **o valor do crédito vai dentro da tag**, em centavos:

- `cashback-1111-4560` → o Flow credita **R$ 45,60** na conta da cliente, com validade até 30/11 às 23h59.
- Em 12/11, o Claude calcula 15% do total pago de cada um dos 100 primeiros pedidos e coloca a tag no cliente. Só faz isso com o ok do Pedro.

## Testes feitos em 03/11 (conta Lage Pedro)

| Teste | Tag | Resultado |
|---|---|---|
| 1 · valor fixo | `cashback-teste` | ✅ R$ 1,00 creditado, validade 06/11 23h59 |
| 2 · valor pela tag | `cashback-teste-150` | ✅ R$ 1,50 creditado (saldo total R$ 2,50) |

As tags de teste já foram removidas. O saldo de teste expira sozinho em 06/11.

Atenção: se a condição ficar como "é igual a", nada é creditado, porque `cashback-teste-150` não é igual a `cashback-teste-`. O operador certo é **Começa com**.

---

## Fluxo REAL: o que o Pedro monta

1. No Flow, abra **Cashback 11/11 · TESTE** → **Mais ações** → **Duplicar**. Se não tiver essa opção, crie um fluxo novo igual: gatilho **Customer tags added** → **Condition** → ação **Send Admin API request** / `storeCreditAccountCredit`.
2. **Nome:** `Cashback 11/11 · 15% (100 primeiros)`
3. **Condição:** `tags_item` → **Começa com** → `cashback-1111-`
4. **Entradas da mutação:** apague tudo e cole:

```
{
  "id": "{{ customer.id }}",
  "creditInput": {
    "creditAmount": { "amount": "{%- for t in tags -%}{%- if t contains 'cashback-1111-' -%}{{ t | remove: 'cashback-1111-' | divided_by: 100.0 }}{%- endif -%}{%- endfor -%}", "currencyCode": "BRL" },
    "expiresAt": "2026-12-01T02:59:59Z",
    "notify": true
  }
}
```

5. Clique em **Ativar** e deixe ligado até 12/11. Ninguém recebe nada antes, porque só o Claude coloca as tags `cashback-1111-...`.
6. **Desative** o fluxo de TESTE. Pode apagar.

Notas:
- `2026-12-01T02:59:59Z` corresponde a 30/11 às 23h59 em Brasília.
- `notify: true` faz a Shopify mandar um e-mail para a cliente avisando do crédito.

---

## Dia 12/11 (Claude)

1. Listar os pedidos de 11/11, das 00h às 23h59 de Brasília, que estejam pagos e não cancelados, em ordem de criação, e pegar os 100 primeiros.
2. Calcular 15% do total pago de cada um, em centavos com arredondamento normal. Se um cliente tiver 2 pedidos entre os 100, somar numa tag só. A lista fica fora do repositório, porque tem dados de clientes.
3. Mostrar ao Pedro o total de crédito, a quantidade de clientes e uma amostra. **Só aplicar com o ok dele.**
4. Aplicar a tag `cashback-1111-<centavos>` em cada cliente. Conferir as execuções no Flow e alguns saldos no admin.
5. Avisar a Sarah para disparar a mensagem.

**Plano B:** se o Flow falhar, o Pedro lança à mão em Clientes → Crédito na loja, usando a lista. Leva cerca de 1 hora.

---

## Texto para a Sarah (WhatsApp, 12/11 depois dos créditos)

> Oi, {nome}! Você foi um dos 100 primeiros pedidos do 11/11 da VermeFree 🎉
> Seu cashback de **R$ {valor}** já está na sua conta VermeFree.
> Para usar, é só entrar com o e-mail da compra na hora de pagar no site. O saldo aparece no checkout.
> Vale até **30/11 às 23h59**. Depois disso ele expira.
