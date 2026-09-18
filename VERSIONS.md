# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-18

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.103** | revision `r312-official-1.0.103`, package `1.0.103` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r312 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `shown_recommendations` + histórico esportivo com presença em estádio | produção compartilhada |
| Windows | — | — | não lançado |

## Web 1.0.103 / r312

- Descobrir: shell persistente, cinco abas públicas filtradas antes do HTML, ações estáveis e `Pra Você` compacto.
- Sessão: refresh + retry único para REST/TMDB após JWT expirado.
- Perfil: `Jogos no Estádio` garantido como botão e Atores Favoritos lidos diretamente de `favorite_actors`.
- Esportes: filtros dinâmicos dentro de `Próximos` e `Anteriores`, usando `payload.sports`.
- F1: calendário real r255 ligado ao detalhe r311.
- Android permanece `1.0.20 / versionCode 10062`.

Assets: `app-v312.js` / `app-v312.css`; build: `apps/web/build-r312-official.mjs`; runtime: `apps/web/runtime-r312-single-owner.js`.

## Web 1.0.102 / r311

- Perfil: quatro controles clicáveis de estatísticas usam uma única versão visual baseada em `Eventos assistidos`.
- F1: Calendário abre cada GP; detalhe inclui fim de semana, Grid de Largada, Resultado de Chegada e marcação por sessão.
- Descobrir: as cinco abas públicas excluem vistos + Watchlist antes do paint e exibem `+ Watchlist` + `✓ Visto` em faixa estável abaixo do card.
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v311.js` / `app-v311.css`; build: `apps/web/build-r311-official.mjs`; runtime: `apps/web/runtime-r311-profile-f1-discover.js`; regressões: `apps/web/test-r311.mjs` e `apps/web/test-r311-browser.mjs`.

## Web 1.0.101 / r310

A r310 corrige as divergências visíveis no vídeo real enviado após a r309.

- remove na fonte os produtores tardios r252/r300/r293 que recriavam abas e ações antigas;
- usa a Watchlist completa `cinetracker_watchlist_full_v119` na exclusão final das abas públicas;
- mantém Watchlist + `✓ Visto` com estado coerente nos cards;
- usa `cinetracker_sports_watch_history_v296` para o total canônico de eventos assistidos no primeiro paint do Perfil;
- posiciona uma única scrollbar dos atores explicitamente abaixo dos cards;
- normaliza eventos esportivos antigos presos em status `live`;
- corrige o rodapé para `v1.0.101 / r310-official-1.0.101`;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v310.js` / `app-v310.css`; build: `apps/web/build-r310-official.mjs`; runtime: `apps/web/runtime-r310-video-truth.js`; regressões: `apps/web/test-r310.mjs` e `apps/web/test-r310-browser.mjs`.

## Web 1.0.100 / r309

A r309 é a correção orientada pelos dois vídeos reais enviados em 18/09/2026.

- Descobrir fica com oito abas canônicas, sem `Lançamentos` nem rail duplicado; autoridade pessoal e TMDB carregam em paralelo.
- `Pra Você` exige Filme + Série + Anime tanto na Watchlist quanto em `100% novos`, com Indicação do Dia e trocas independentes.
- A deduplicação final também usa tipo+título+ano, eliminando duplicatas visuais.
- Cards do Descobrir mantêm Watchlist e `✓ Visto` sempre visíveis; `Trocar` fica abaixo deles.
- F1 nasce com quatro abas; a autoridade r257 que repintava seis abas depois da navegação é desativada.
- Perfil deixa de exibir cache/quick antes do payload completo, recebe estádio no primeiro paint, não mostra chevrons de Watchlist e mantém a scrollbar dos atores no rail real dos cards.
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v309.js` / `app-v309.css`; build: `apps/web/build-r309-official.mjs`; runtime: `apps/web/runtime-r309-video-truth.js`; regressões: `apps/web/test-r309.mjs` e `apps/web/test-r309-browser.mjs`.

## Web 1.0.99 / r308

A r308 corrige as divergências reproduzidas no vídeo real de 17/09–18/09/2026 sem alterar o Android.

- `Pra Você` passa a ser composto por pools separados: Indicação do Dia com troca real, `Da sua Watchlist` com Filme + Série + Anime e `100% novos` com Filme + Série + Anime; uma categoria não ocupa a vaga de outra;
- autoridade pessoal, memória recente e primeiros pools TMDB começam em paralelo, e uma composição válida é reutilizada por três minutos para reduzir o loading ao revisitar a aba;
- ações de Watchlist/Visto usam o `chip` visual canônico do sistema;
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` recebem a barreira final de vistos + Watchlist antes do paint; `Calendário`, `Pra Você` e `Top 10` ficam fora dessa regra geral;
- F1 Hub fica somente com `Visão geral`, `Calendário`, `Classificações` e `Circuitos`; o clique de corrida passa a usar o `data-event-id` real para abrir a rodada correta com Grid de Largada e Resultado de Chegada;
- o Perfil recebe acabamento final por rótulo semântico e remove o sinal visual de clique de `Séries Watchlist` e `Filmes Watchlist`, preservando a área clicável;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v308.js` / `app-v308.css`; build: `apps/web/build-r308-official.mjs`; runtime: `apps/web/runtime-r308-discover-f1-profile.js`; regressões: `apps/web/test-r308.mjs` e `apps/web/test-r308-browser.mjs`.

## Web 1.0.91 / r300

A r300 corrige as divergências observadas no vídeo real de 16/09/2026 em Perfil, Descobrir e Esportes, sem alterar o Android.

- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual clicável usado em `Eventos assistidos` e `Jogos no Estádio`, preservando suas ações existentes;
- Esportes passa a exibir exatamente quatro abas, na ordem `Próximos`, `Anteriores`, `Assistidos` e `Favoritos`; a aba `Ao vivo` é removida do DOM efetivamente renderizado pela r255 e também bloqueada por CSS caso um repaint legado tente recriá-la;
- se uma sessão antiga estiver parada em `Ao vivo`, a r300 volta para `Próximos`, impedindo que eventos antigos — como jogos de 12/09 vistos no vídeo em 16/09 — permaneçam apresentados como conteúdo atual;
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` ganham recuperação finita: se a autoridade herdada ficar presa em `Carregando títulos…`, a r300 busca candidatos pelo TMDB, respeita filtro Filme/Série e exclusões pessoais e pinta pelo renderer real r288;
- a recuperação do Descobrir é limitada e não usa `setInterval` nem observer perpétuo; `Pra Você` 1+3+3 e `Top 10` mantêm suas autoridades específicas;
- adiciona regressão Chromium reproduzindo o cenário do vídeo: Watchlist com estilo clicável, cinco abas herdadas reduzidas a quatro na ordem aprovada e detecção do loading persistente do Descobrir;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v300.js` / `app-v300.css`; build: `apps/web/build-r300-official.mjs`; runtime: `apps/web/runtime-r300-discover-sports-profile-watchlist.js`; regressões: `apps/web/test-r300.mjs` e `apps/web/test-r300-browser.mjs`.

## Web 1.0.90 / r299

A r299 simplifica a presença presencial em Esportes e torna o histórico esportivo do Perfil navegável, sem alterar o Android.

- `Eventos assistidos`, dentro de `Esportes assistidos`, passa a ser clicável e abre o histórico retornado por `cinetracker_sports_watch_history_v296`;
- `Jogos no Estádio` também passa a ser clicável e abre somente os registros com `attended_in_person = true`;
- as listas mostram evento, competição e data quando disponíveis e não exibem `stadium_name`;
- a marcação de evento mantém somente `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`, sem formulário para informar local;
- `Fui ao Estádio` persiste diretamente com `p_attended_in_person = true` e `p_stadium_name = null`;
- o campo legado da r298 fica oculto no bundle r299 e o handler r299 é registrado antes da captura r298, impedindo que o formulário antigo assuma o clique real;
- badges presenciais mostram apenas `🏟️ No Estádio`, sem o nome do local;
- `Pra Você` 1+3+3 e as demais correções da r298 permanecem preservadas;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v299.js` / `app-v299.css`; build: `apps/web/build-r299-official.mjs`; runtime: `apps/web/runtime-r299-profile-sports-history.js`; regressões: `apps/web/test-r299.mjs` e `apps/web/test-r299-browser.mjs`.

## Web 1.0.89 / r298

A r298 corrige as divergências observadas em vídeo após a r297, usando o DOM efetivamente servido como ground truth.

- o botão real de Esportes (`data-ct255-watch`) passa a ser interceptado antes do handler legado e abre a escolha `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`;
- a opção presencial persiste por `cinetracker_sports_watch_set_v296`, incluindo `attended_in_person` e `stadium_name`, e registros presenciais recebem `🏟️ No Estádio`;
- `Jogos no Estádio` deixa de ser injetado na primeira grade genérica do Perfil e passa a existir somente dentro do painel semântico `Esportes assistidos`;
- `Pra Você` recebe pipeline finito próprio sobre os donos r288: aguarda autoridade pessoal e memória de 7 dias, hidrata Watchlist, busca pools suficientes e monta `Indicação do Dia` (1 Filme), `Da sua Watchlist` (Filme + Série + Anime) e `100% Novos` (Filme + Série + Anime), sem duplicações;
- se uma categoria realmente não possuir candidato elegível, a interface mostra estado explícito em vez de permanecer indefinidamente em `Carregando…`;
- preserva TMDB >= 7,5, ano > 1990, exclusões de Drama/Documentário-only, WWE e biblioteca pessoal, além do anti-repeat de 7 dias;
- adiciona regressões Chromium específicas para o botão esportivo real, posicionamento da métrica no Perfil e composição 1+3+3 do `Pra Você` sem spinner residual;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v298.js` / `app-v298.css`; build: `apps/web/build-r298-official.mjs`; runtime: `apps/web/runtime-r298-stadium-foryou-completion.js`; regressões: `apps/web/test-r298-foryou-browser.mjs` e `apps/web/test-r298-browser.mjs`.

## Web 1.0.88 / r297

A r297 é um hotfix exclusivamente Web para recuperar o boot público da r296 e reconectar as autoridades do Descobrir aos renderers que realmente estão ativos desde a r288. O escopo funcional da r296 permanece inalterado e o Android continua intocado.

- corrige a tela preta/vazia causada pelo `runtime-r295-browse-actions-self-scope-fix.js`, que podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`, interrompendo a aplicação com `#app` vazio;
- corrige a causa arquitetural encontrada na validação do bundle final: desde a r288 os donos vivos do Descobrir são `window.__ctR288PaintBrowse`, `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`, enquanto patches r295/r296 ainda tentavam interceptar nomes legados;
- a r297 liga explicitamente as exclusões pessoais, ações de cards, Calendário e regras rígidas do `Pra Você` aos donos reais r288, mantendo fallback compatível para as regressões históricas;
- o bridge r297 garante filtragem de vistos/Watchlist nas abas públicas, composição rígida do `Pra Você` e carregamento autorizado sem reconstruir a página inteira;
- adiciona regressão Chromium específica usando os mesmos nomes `window.__ctR288...` do bundle oficial, além do teste do bundle final completo `app-v297.js`;
- o teste de bundle exige passagem por `boot()`, `#app` renderizado, ausência de page error e os três hooks r297 efetivamente conectados aos donos r288;
- mantém integralmente as regras da r296 para TMDB >= 7,5, ano > 1990, bloqueio WWE, anti-repetição de 7 dias, três blocos de recomendações, quatro abas de Esportes, presença no estádio e polimento Web;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v297.js` / `app-v297.css`; build: `apps/web/build-r297-official.mjs`; bridge: `apps/web/runtime-r297-live-discover-owner-bridge.js`; regressões: `apps/web/test-r297-discover-live-browser.mjs` e `apps/web/test-r297-browser.mjs`.

## Web 1.0.87 / r296

A r296 altera somente a Web e o backend compartilhado necessário para persistência dos novos metadados; o Android permanece intocado.

- `Pra Você` exige TMDB >= 7,5 e ano > 1990, exclui títulos exclusivamente Drama/Documentário e bloqueia WWE/Raw/SmackDown/NXT e eventos WWE relacionados;
- recomendações exibidas ficam bloqueadas por 7 dias por usuário via `shown_recommendations`, com fallback local, e não podem se repetir na mesma tela;
- a composição aprovada fica em `Indicação do Dia` (1 Filme), `Da sua Watchlist` (Filme + Série + Anime) e `100% Novos` (Filme + Série + Anime);
- Esportes fica com exatamente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; próximos = hoje, anteriores = últimas 72h;
- histórico esportivo recebe `attended_in_person` e `stadium_name`, com fluxo TV/Tela ou Estádio, badge `🏟️ No Estádio` e métrica `Jogos no Estádio` no Perfil;
- Home, Perfil, Configurações e sidebar recebem polimento visual restrito à Web;
- a r295 permanece como base para exclusões canônicas, ações Playlist/Visto e filtros combináveis do Calendário.

Assets oficiais: `app-v296.js` / `app-v296.css`; build: `apps/web/build-r296-official.mjs`; runtime: `apps/web/runtime-r296-recommendations-sports-stadium.js`; migration: `supabase/migrations/20260915183834_r296_recommendations_sports_stadium.sql`.

## Web 1.0.80 / r289

A r289 altera somente o layout dos cards do Descobrir na Web. Toda a lógica funcional da r288 permanece preservada.

- os cards do Descobrir voltam ao padrão aprovado: **154×231 px no mobile** e **176×264 px no desktop**, sempre em **2:3**;
- `Da sua Watchlist` e `100% novos` deixam de esticar Filme/Série/Anime para ocupar um terço inteiro da página no desktop;
- os três slots usam largura fixa de card e, quando necessário, rolagem horizontal somente dentro do componente;
- cards de `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` usam o mesmo padrão 154/176;
- `Top 10` segue o mesmo padrão de tamanho;
- `Ver mais` pode quebrar em várias linhas, mas mantém cada card no tamanho aprovado em vez de esticá-lo para preencher a largura disponível;
- as nove abas, troca de conteúdo sem reconstruir a tela, Top 10 por streaming, filtros, Calendário e as ações da r288 permanecem intactos;
- Android permanece inalterado em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v289.js` / `app-v289.css`; build: `apps/web/build-r289-official.mjs`; runtime: `apps/web/runtime-r289-discover-standard-card-size.js`.

## Web 1.0.79 / r288

A r288 altera somente a Web e usa como ground truth o comportamento funcional do Descobrir Android 1.0.20 mostrado no vídeo de referência.

- o Descobrir mantém as nove abas aprovadas em um trilho horizontal estável: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`;
- trocar de aba atualiza somente a área de conteúdo, sem reconstruir o shell inteiro da tela;
- `Pra você` volta a exibir `Da sua Watchlist` e `100% novos` em três slots independentes — Filme, Série e Anime — cada um com seu próprio `Trocar`;
- `Top 10` volta a ser calculado por streaming disponível no Brasil e possui trilhos separados de `Top 10 Séries` e `Top 10 Filmes`;
- as abas públicas usam cards 2:3 em trilhos horizontais locais, ação de Watchlist e `Ver mais` sem liberar scroll horizontal no documento;
- o filtro `Todos / Filmes / Séries` fica recolhido atrás do controle compacto e não aparece em `Pra você`/`Top 10`;
- `Calendário` agrupa os títulos por data de lançamento;
- a implementação Web reutiliza as autoridades canônicas já existentes para biblioteca, TMDB, streaming e abertura de detalhes; hacks de toque específicos do WebView Android não foram copiados;
- Home r287, ações de relacionados r286, detalhes, Sports/F1 e demais áreas permanecem preservados;
- Android permanece inalterado em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v288.js` / `app-v288.css`; build: `apps/web/build-r288-official.mjs`; runtime: `apps/web/runtime-r288-discover-android-parity.js`.

## Android 1.0.20

A r300 não altera Android. A identidade preservada é:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.20`;
- `versionCode`: `10062`.

## Regra de versionamento

- correção compatível: `1.0.x`;
- funcionalidade compatível: `1.x.0`;
- quebra deliberada de contrato/arquitetura: próxima major;
- `versionCode` Android sempre aumenta quando houver nova release Android, independentemente do `versionName`.

## Regra de validação

CI verde não substitui teste real. O fluxo oficial da Web exige testes de comportamento em Chromium, boot do bundle final exato e `production_smoke` do domínio público após a promoção ao `main`. Quando vídeo/aparelho divergir do teste sintético, o vídeo/aparelho é o ground truth para a próxima correção.