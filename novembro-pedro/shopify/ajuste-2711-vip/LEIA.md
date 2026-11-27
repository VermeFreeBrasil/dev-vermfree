# 27/11 · Free Monday: links do grupo VIP liberam a madrugada

Causa: na Verme Friday a mensagem do grupo às 00h05 foi sem `acesso=vip` e ninguém comprou de 00h a 07h. A mensagem agendada da Free Monday (30/11 00h05) tem o mesmo link.

Ajuste no tema 4 · Free Monday (169093464283, não publicado): a trava aceita `utm_content=grupo_vip_1111` (todos os links do grupo) além de `?acesso=vip`.
- antes 46c4f723 · depois 34a51807 (conferido no tema).
- Teste da lógica (relógio simulado): grupo 30/11 03h abre; sem link 03h fechado; acesso=vip 03h abre; grupo 29/11 15h fechado (correto, VIP só a partir de 00h de 30/11); sem link 08h abre.
