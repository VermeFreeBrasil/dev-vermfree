# Espelho do tema "VermFree — Judge.me (21/09)" (165246271707)

É cópia do "VermFree - Tema Padrão", que em 21/09 **virou o tema publicado
(MAIN)** — por isso o Judge.me é o draft de trabalho agora. As diferenças do
Judge.me (widgets de avaliação) estão nas templates de produto, então aqui é
sempre injeção, nunca sobrescrita.

Começou só com as templates: seções e snippets eram idênticos ao Padrão,
conferidos por checksum. Em 23/09 passaram a divergir e o espelho ganhou os
dois arquivos que mudaram — `sections/vf-pdp-main.liquid` e
`snippets/vf-stories-rail.liquid`. O resto continua igual ao Padrão e não
está espelhado aqui.

## Os 13 vídeos de 22/09

Não são clipes soltos: são segmentos de **dois roteiros**, pelos nomes de
edição (HOOK, RABBIT HOLE, FECHAMENTO EMOCIONAL, CTA FALADO). Por isso a
maior parte foi para as **réguas de stories**, que tocam em sequência com
barra de progresso e auto-avanço — é o formato que existe pra isso. O
carrossel, onde cada card é um toque avulso, ficou com os 3 que fecham
sozinhos.

Nenhum vídeo foi assistido: a curadoria e a ordem saem dos nomes dos
arquivos e da duração medida pela Admin API.

## 23/09 — uma régua só por PDP, embaralhada

As PDPs tinham **duas** réguas empilhadas (a de dúvidas e a do roteiro de
22/09). Viraram uma, com o título "Histórias e dúvidas".

A régua cabia 8 vídeos e o material somado passa disso, então em vez de
cortar conteúdo do cliente os espaços foram de 8 para **16**: `story9_*` a
`story16_*` no schema do bloco `stories` e os laços `(1..8)` → `(1..16)` no
snippet. Fica em 12 vídeos no Adulto e 15 nas outras três.

A ordem não é aleatória. O roteiro fica **contíguo e na ordem de edição**:
na tela cheia os stories se auto-avançam, e picotar a narrativa entre
perguntas soltas faria "capítulo 1 → dúvida → capítulo 2". Então abre com um
vídeo de cliente, vem o roteiro inteiro, e só na cauda os `VF-DR-*` (Dr.
William) entram intercalados com os demais — nenhum deles nos 3 primeiros
círculos e nenhum colado no outro, que era o pedido de diluir a presença
dele.

`only_handles` do bloco em `product.json` ficou preso ao handle do Adulto:
essa template também serve o Óleo de Alho, que não deve herdar a régua.
