"""Sorteio 11.11 VermeFree: sorteia 1 entre os 300 primeiros pedidos pagos de 11/11.
Uso: python3 sortear.py lista.csv   (lista.csv: uma linha por pedido, na ordem de criação: numero_pedido)
A semente é o hash SHA-256 da própria lista. Qualquer pessoa com a mesma lista chega ao mesmo ganhador,
e ninguém consegue escolher o resultado sem mudar a lista (que fica registrada antes do sorteio).
A lista com dados de clientes NÃO vai para o repositório."""
import csv, hashlib, random, sys
pedidos = [l[0].strip() for l in csv.reader(open(sys.argv[1], encoding='utf-8')) if l and l[0].strip()]
assert len(pedidos) <= 300, 'mais de 300 pedidos na lista'
semente = hashlib.sha256('\n'.join(pedidos).encode()).hexdigest()
n = random.Random(semente).randrange(len(pedidos))
print(f'{len(pedidos)} pedidos · semente {semente[:16]}… · sorteado o nº {n + 1}: pedido {pedidos[n]}')
