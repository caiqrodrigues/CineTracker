# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-16

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.90** | revision `r299-official-1.0.90`, package `1.0.90` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r299 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `shown_recommendations` + histórico esportivo com presença em estádio | produção compartilhada |
| Windows | — | — | não lançado |

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

- corrige a tela preta/vazia causada pelo `runtime-r295-browse-actions-self-scope-fix.js`, que podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`;
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

A r299 não altera Android. A identidade preservada é:

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
