# Web 1.0.89 / r298

Data: 2026-09-15

Esta release corrige as divergências observadas em produção após r297, usando o vídeo/DOM real como ground truth.

## Esportes — presença no estádio

- O botão real `data-ct255-watch` é capturado antes do handler legado.
- Ao marcar um evento como assistido, o usuário escolhe `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`.
- A opção presencial aceita `Nome do Estádio (opcional)` e persiste por `cinetracker_sports_watch_set_v296` em `attended_in_person` e `stadium_name`.
- Eventos presenciais recebem badge `🏟️ No Estádio`.

## Perfil

- A métrica `Jogos no Estádio` é removida de qualquer grade genérica em que tenha sido injetada por r296.
- A r298 localiza semanticamente o painel `Esportes assistidos` e insere a métrica somente dentro dele.

## Descobrir — Pra Você

- Pipeline finito e autoritativo sobre os donos r288.
- `Indicação do Dia`: 1 Filme.
- `Da sua Watchlist`: 1 Filme + 1 Série + 1 Anime.
- `100% Novos`: 1 Filme + 1 Série + 1 Anime.
- Zero duplicatas.
- Mantidos TMDB >= 7,5, ano > 1990, exclusões Drama/Documentário-only, WWE, biblioteca pessoal e anti-repeat de 7 dias.
- Caso não exista candidato elegível para alguma categoria após as tentativas limitadas, a tela exibe estado explícito; não permanece em loading infinito.

## Validação

- regressões herdadas r286/r293/r294/r295/r296/r297;
- Chromium específico para composição 1+3+3 do Pra Você, sem duplicações/WWE/spinner;
- Chromium do bundle final com clique real `data-ct255-watch` abrindo TV/Estádio;
- Chromium validando `Jogos no Estádio` dentro de `Esportes assistidos` e fora das métricas de Séries;
- contrato da migration r296;
- Android preservado em `1.0.20 / versionCode 10062`.
