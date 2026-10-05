# Referência de edição — REF-PIN-01

## 1. Fonte e escopo
- Arquivo: `Pinterest (1).mp4` (não incluído no repositório, conteúdo de terceiros), sha256 `25b93f93…27e8`.
- 720×1280 (9:16), 30 fps constante, 40.867 s, H.264 + AAC estéreo 44.1 kHz.
- Tempos em segundos a partir do início do arquivo. Vídeo inteiro analisado.

## 2. Cobertura
- **Visual: completa.** Folha de contato a 2 fps de 0–40.87 s, detecção de cena e revisão a 10 fps nas transições críticas.
- **Áudio: indisponível.** Só medições: som contínuo, sem silêncio ≥0.3 s, -15.2 LUFS integrado. Não foi possível ouvir nem separar voz/música/SFX.
- **Transcrição: indisponível.** O texto na tela **não** foi tratado como fala.

## 3. Mapa interpretado
Formato: vídeo de especialista falando para a câmera (plano fixo) intercalado com telas de tipografia, cards com b-roll e animações 3D, e end card de perfil.

| ID | Unidade | Tempo | Foco | Saída |
|---|---|---|---|---|
| R01 | U1 | 00:00.000–00:00.870 | apresentador falando | corte para fundo preto com texto em motion blur horizontal |
| R02 | U1 | 00:00.870–00:01.400 | palavra-chave em movimento | texto atravessa a tela com blur e dá lugar ao card |
| R03 | U1 | 00:01.400–00:02.300 | b-roll 3D (vaso sanguíneo) | card sai deslizando para a direita com blur; fundo clareia |
| R04 | U1 | 00:02.300–00:03.730 | tipografia cinética pura | corte seco para o apresentador (detectado em 3.73) |
| R05 | U2 | 00:03.730–00:05.000 | apresentador falando | vídeo encolhe em card arredondado com sombra sobre fundo branco (~4.9–5.1) |
| R06 | U2 | 00:05.000–00:05.900 | pergunta-gancho | card e texto saem para a direita com blur |
| R07 | U2 | 00:05.900–00:07.400 | resposta em imagem de apoio | card sobe e o próximo card entra por baixo (vertical, com blur); fundo passa a preto |
| R08 | U2 | 00:07.400–00:08.970 | b-roll de hábito (pular corda) | corte para o apresentador (8.97) |
| R09 | U2 | 00:08.970–00:10.170 | apresentador falando | corte para fundo branco com card |
| R10 | U3 | 00:10.170–00:14.730 | lista que acumula (3 hábitos) | corte para o apresentador (14.73) |
| R11 | U3 | 00:14.730–00:18.670 | apresentador falando | corte para preto (18.67) |
| R12 | U4 | 00:18.670–00:19.770 | palavra de alerta | corte para o apresentador |
| R13 | U4 | 00:19.770–00:21.000 | apresentador falando | corte para branco com card |
| R14 | U4 | 00:21.000–00:22.400 | b-roll (tomar comprimido) | card e texto deslizam para a esquerda com blur |
| R15 | U4 | 00:22.400–00:23.000 | apresentador em card | card cresce até tela cheia (~22.9–23.1) |
| R16 | U4 | 00:23.000–00:24.100 | apresentador falando | corte para branco (24.1) |
| R17 | U5 | 00:24.100–00:27.000 | frase espalhada pela tela | corte para o apresentador (27.0) |
| R18 | U5 | 00:27.000–00:30.730 | apresentador falando | corte para animação 3D (30.73) |
| R19 | U6 | 00:30.730–00:32.030 | consequência 1 (artéria) | corte (32.03) |
| R20 | U6 | 00:32.030–00:32.630 | consequência 2 (cérebro/vasos) | corte (32.63) |
| R21 | U6 | 00:32.630–00:33.700 | consequência 3 (rins) | corte (33.7) |
| R22 | U7 | 00:33.700–00:38.630 | fechamento + recomendação | corte para end card (38.63) |
| R23 | U8 | 00:38.630–00:40.867 | end card de perfil | fim do arquivo |

Unidades: U1 gancho com o tema · U2 pergunta e resposta · U3 lista de hábitos · U4 alerta + recomendação · U5 tratamento · U6 consequências · U7 fechamento · U8 end card.

## 4. Fala
Não verificada (ver Cobertura). Nenhuma transcrição produzida.

## 5. Achados por dimensão
- **F01** · `enquadramento` · *observado* — Apresentador em plano médio fixo 9:16, mesa e braçadeira de pressão sempre em primeiro plano; mesma tomada base em todo o vídeo. Evidência: E01, E05, E11, E22.
- **F02** · `crop_zoom_tracking` · *observado* — O vídeo do apresentador alterna entre tela cheia e card arredondado com sombra sobre fundo branco; a transição é uma mudança de escala contínua (tela cheia→card em ~4.9–5.1 s; card→tela cheia em ~22.9–23.1 s). Evidência: E05, E06, E15, E16. Limite: medido a 10 fps; curva de easing exata não verificável.
- **F03** · `crop_zoom_tracking` · *inferido* — R09 aparenta enquadramento mais fechado (punch-in) que os demais planos do apresentador. Evidência: E09. Limite: pode ser outra tomada ou crop digital; não separável.
- **F04** · `tipografia_hierarquia` · *observado* — Hierarquia em 2–3 níveis: palavras de ligação pequenas em sans bold; uma palavra-chave por frase muito grande, alternando sans black e serif de alto contraste (às vezes condensada); palavras-chave às vezes com preenchimento translúcido ou cor de destaque. Evidência: E01, E08, E09, E16, E17, E19. Limite: família tipográfica exata não identificada.
- **F05** · `tipografia_hierarquia` · *observado* — Composição espalhada: palavras pequenas distribuídas em escada/zigue-zague pela tela enquanto a frase se acumula; palavras-chave gigantes ancoram a composição. Evidência: E06, E08, E17.
- **F06** · `cor_luz` · *observado* — Três fundos de apoio alternados: off-white (cards e texto preto), preto (texto branco/vermelho) e b-roll; cor de destaque usada em poucas palavras (verde-azulado, vermelho texturizado, ciano sobre vermelho, dourado claro). Evidência: E03, E04, E12, E13, E19. Limite: valores de cor amostrados de vídeo comprimido.
- **F07** · `legendas` · *observado* — Não há legenda contínua: só 1–4 palavras visíveis por vez, posicionadas no centro do peito do apresentador, trocando por grupo de palavras. Evidência: E05, E11, E22. Limite: sincronismo com a fala não verificado: áudio não foi ouvido.
- **F08** · `elementos_insercoes` · *observado* — Inserções em cards arredondados com sombra (b-roll de hábitos, comprimido, trecho de filme) e b-roll 3D médico em tela cheia; listas viram cards empilhados que entram um a um. Evidência: E03, E07, E10, E14, E19, E20, E21. Limite: origem e licença dos b-rolls desconhecidas; trecho de filme é conteúdo de terceiros.
- **F09** · `transicoes` · *observado* — Transições predominantes: deslize horizontal/vertical com motion blur forte; escala tela cheia↔card; cortes secos entre apresentador e telas de texto. Evidência: E02, E03, E06, E07, E14, E05, E15. Limite: preset ou plugin não identificável.
- **F10** · `composicao_camadas` · *observado* — Texto grande frequentemente cruza a borda do card (fica à frente); cards projetam sombra suave sobre fundo branco criando profundidade. Evidência: E03, E06, E07, E14.
- **F11** · `alfa_3d` · *nao_verificavel* — Não foi observada oclusão de texto atrás do apresentador; o texto fica sempre à frente. Animações 3D médicas parecem material pronto de banco, não gerado na edição. Limite: sem projeto original; origem dos 3D não comprovada.
- **F12** · `ritmo_pausas` · *observado* — Troca visual em média a cada ~1.2 s; planos do apresentador duram 1–5 s; inserções de texto/b-roll 0.5–1.6 s; lista de consequências com cortes que encurtam (1.3 → 0.6 → 1.1 s). Evidência: E19, E20, E21, E11, E22. Limite: duração medida por detecção de cena + 2 fps; precisão ~±0.25 s em fronteiras aproximadas.
- **F13** · `audio_musica_sfx` · *nao_verificavel* — Há faixa AAC estéreo 44.1 kHz, audível de forma contínua (nenhum silêncio ≥0.3 s abaixo de -35 dB; loudness integrado medido -15.2 LUFS). Voz, música e SFX não puderam ser distinguidos. Limite: sem escuta nem transcrição neste ambiente.
- **F14** · `fala_movimento` · *inferido* — O texto na tela parece acompanhar a fala palavra-chave por palavra-chave, e as inserções ilustram literalmente o substantivo destacado (hábito citado → b-roll do hábito; órgão citado → 3D do órgão). Evidência: E10, E19, E20, E21. Limite: sincronismo não verificado sem áudio; inferido pela correspondência texto↔imagem.
- **F15** · `elementos_insercoes` · *observado* — Encerramento com end card animado de perfil de rede social (avatar, nome, selo, botão seguir que muda de estado). Evidência: E23. Limite: identidade do perfil é de terceiros.

## 6. Regras adaptáveis
### RU1 (recorrente)
- **Gatilho:** Cada frase falada tem uma ideia central
- **Ação:** Mostrar 1–4 palavras por vez sobre o apresentador; a palavra-chave gigante (sans black ou serif), as demais pequenas
- **Permanência:** Enquanto a frase é dita
- **Saída:** Troca no próximo grupo de palavras
- **Preservar:** Rosto livre; texto no centro do peito · **Evitar:** Legenda contínua palavra por palavra; mais de uma palavra gigante ao mesmo tempo
- **Teste:** Palavra-chave legível em 1 frame pausado; rosto nunca coberto
- **Adaptação:** Ajustar as duas famílias tipográficas à identidade da marca (achados: F04, F07)

### RU2 (recorrente)
- **Gatilho:** A fala faz uma pergunta ou muda de assunto
- **Ação:** Encolher o vídeo do apresentador em card arredondado com sombra sobre fundo claro e abrir espaço para texto ou inserto; voltar a tela cheia por escala inversa
- **Permanência:** 0.6–1 s (referência)
- **Saída:** Escala de volta para tela cheia ou deslize com blur
- **Preservar:** Continuidade da fala; card nunca corta o rosto · **Evitar:** Usar em toda frase; perde força
- **Teste:** Transição sem salto de enquadramento
- **Adaptação:** Se não houver fundo claro na marca, usar cor sólida da marca (achados: F02, F09)

### RU3 (recorrente)
- **Gatilho:** A fala cita um objeto, hábito ou consequência concreta
- **Ação:** Mostrar b-roll literal daquilo dentro de card ou em tela cheia, com a palavra sobreposta
- **Permanência:** ~0.6–1.6 s por item (referência)
- **Saída:** Corte ou deslize com blur
- **Preservar:** Relação literal palavra↔imagem · **Evitar:** Imagem genérica sem relação; trechos de filme de terceiros
- **Teste:** Cada inserto explicável pela palavra que acompanha
- **Adaptação:** Sem b-roll: usar tela só-tipografia (RU5) (achados: F08, F14)

### RU4 (pontual)
- **Gatilho:** A fala enumera 3 itens
- **Ação:** Empilhar cards que entram um a um e permanecem até a lista completar
- **Permanência:** Até o último item
- **Saída:** Corte de volta ao apresentador
- **Preservar:** Ordem da fala · **Evitar:** Mostrar todos de uma vez
- **Teste:** Lista legível ao final
- **Adaptação:** Funciona também com ícones/fotos de produto (achados: F08, F12)

### RU5 (recorrente)
- **Gatilho:** Frase-chave que merece ênfase sem imagem
- **Ação:** Tela só-texto (fundo branco ou preto) com palavras espalhadas e 1–2 palavras gigantes
- **Permanência:** 1–3 s
- **Saída:** Corte seco
- **Preservar:** Contraste alto; poucas palavras grandes · **Evitar:** Blocos de texto longos
- **Teste:** Leitura completa antes do corte
- **Adaptação:** Cor de destaque da marca em 1 palavra (achados: F05, F06)

### RU6 (recorrente)
- **Gatilho:** Passagem entre insertos
- **Ação:** Deslize rápido horizontal ou vertical com motion blur forte
- **Permanência:** ~0.2–0.3 s
- **Saída:** Próximo elemento já no lugar
- **Preservar:** Direção consistente · **Evitar:** Transições variadas demais
- **Teste:** Sem frames vazios longos
- **Adaptação:** Teste de amostra antes de repetir (achados: F09)

### RU7 (proposta_condicional)
- **Gatilho:** Sequência de consequências ou riscos
- **Ação:** Encurtar progressivamente os planos para dar sensação de acúmulo
- **Permanência:** Itens de 0.6–1.3 s (referência)
- **Saída:** Volta ao apresentador
- **Preservar:** Clareza de cada item · **Evitar:** Cortes tão curtos que o texto não seja lido
- **Teste:** Cada palavra legível a 1x
- **Adaptação:** Depende de testar leitura no vídeo destino (achados: F12)

### RU8 (proposta_condicional)
- **Gatilho:** Fim do vídeo
- **Ação:** End card com o perfil/marca do usuário e CTA animado
- **Permanência:** ~2 s
- **Saída:** Fim
- **Preservar:** Identidade própria · **Evitar:** Copiar o perfil ou layout da referência
- **Teste:** Nome e CTA legíveis
- **Adaptação:** Pode virar CTA de compra em vez de seguir (achados: F15)

## 7. Aplicação e limites
- **Transferível:** hierarquia tipográfica de palavra-chave, alternância tela cheia↔card, telas só-texto, insertos literais em cards, deslizes com blur, end card próprio.
- **Precisa de material próprio:** b-rolls (hábitos, produto, 3D), identidade tipográfica e cores, end card com o perfil da marca.
- **Não transferir:** fala, tema, trecho de filme, animações 3D e perfil da referência.
- **A testar:** ritmo de cortes curtos (RU7) e legibilidade das palavras translúcidas no vídeo destino.
- **Skills para depois:** ver `routing` em `receita-visual.json`.
