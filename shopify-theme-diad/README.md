# Espelho do tema "Dia D — OFICIAL" (164868030683)

Só as templates, e só o que foi tocado. O tema de trabalho é a
"Copy of Semana do Cliente" (165155438811), espelhada em `shopify-theme/`.

O Dia D é outra linhagem: a `sections/vf-pdp-main.liquid` dele tem 16KB
contra 94KB da cópia, com o schema minificado numa linha e a página montada
por snippets (`vf-pdp-galeria`, `vf-pdp-buybox`, `vf-pdp-kits`,
`vf-pdp-extras`, `vf-pdp-main-js`). Por isso:

- **não tem** o botão "Comprar agora" pra remover;
- o seletor de kits é outro mecanismo (tiers 1/3/5/8) e está desligado
  (`kits_enabled` default false, "REVERTIDO — nao renderiza mais");
- **não recebeu** o bloco de stories: a seção não tem esse tipo de bloco e
  a área do CTA mora dentro de `vf-pdp-buybox`, fora deste arquivo.

O que foi aplicado: o carrossel UGC comprável (home e as 4 PDPs, logo abaixo
da faixa `vf_diad_faixa`) e os 9 prescritores. As seções e os snippets são os
mesmos de `shopify-theme/`.

Backups dos originais ficaram no próprio tema, em `assets/zz-backup-*.txt`.
