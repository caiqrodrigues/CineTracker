# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-15

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.87** | revision `r296-official-1.0.87`, package `1.0.87` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r296 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `shown_recommendations` + histórico esportivo com presença em estádio | produção compartilhada |
| Windows | — | — | não lançado |

## Web 1.0.87 / r296

A r296 altera somente a Web e o backend compartilhado necessário para persistência dos novos metadados; o Android permanece intocado.

- `Pra Você` exige TMDB >= 7,5, ano > 1990, exclui títulos exclusivamente Drama/Documentário e bloqueia WWE/Raw/SmackDown/NXT e eventos WWE relacionados;
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

A r296 não altera Android. A identidade preservada é:

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
