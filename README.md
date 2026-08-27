# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, Descobrir, configurações e backup por meio do Supabase.

## Versão atual

| Sistema | Versão | Estado nesta branch |
|---|---:|---|
| Web | **0.99.2** | package `0.99.2`, cache `ct-web-0.99.2`; aguardando CI/merge/deploy final |
| Android | **0.99.2** | `versionName 0.99.2`, `versionCode 9912`; aguardando pipeline/release final |
| Backend lógico | **0.99.2** | migration/RPC Home 0.99.2 aplicadas no Supabase |
| Windows | — | não lançado |

## Home 0.99.2 — Séries

A Home agora possui uma aba **Séries** com lista vertical contínua. O ponto inicial visível é **Assistir a seguir**; acima dele existe um histórico oculto de episódios, revelado quando o usuário puxa/rola a lista para baixo no topo.

Ordem das seções:
1. **Assistir a seguir** — séries iniciadas com episódios já lançados pendentes e última atividade em até 30 dias, mais séries recém-saídas de Em dia por novo episódio;
2. **Juntando poeira** — pendências com mais de 30 dias sem reprodução;
3. **Em dia** — todos os episódios já lançados foram vistos;
4. **Não Iniciadas / Watchlist** — progresso zero;
5. **Concluídas** — séries finalizadas pelo usuário.

Cards são em linha, com pôster 2:3 à esquerda, título, `Sxx Exx`, progresso assistidos/lançados, faltantes, nome/nota do próximo episódio e botão circular ✓. O quick mark grava `watch_history`, sincroniza `episode_progress`, move a série para o topo por `last_watched_at DESC` e, ao zerar pendências, move para **Em dia**.

### Sincronização de novos episódios

A camada `patch-v093-v0992.js` executa uma checagem diária de metadados para séries em andamento/em dia, além de forçar nova checagem quando o Calendário é atualizado. Se um episódio com `air_date <= hoje` estiver disponível e ainda não visto, a série sai de **Em dia**, entra em **Assistir a seguir**, recebe badge **Novo Episódio** e sobe na fila.

## Home 0.99.2 — Filmes

A aba **Filmes** começa em **Escolha para Hoje** e possui o histórico **Vistos** escondido acima do ponto inicial.

- **Escolha para Hoje:** 1 filme por data, nota >= 8.0, nunca visto e sem repetição de títulos já recomendados ao perfil.
- **Assistir a seguir / Watchlist:** filmes ainda não vistos com pôster, ano, duração, sinopse curta e ação ✓.
- O quick mark de filme grava histórico e estado `AlreadySeen` com timestamp atual.

A recomendação diária é persistida em `daily_movie_recommendations_v0992`, protegida por RLS e com unicidade por perfil/TMDB.

## Reatividade pós-importação

A Home sempre refaz a leitura central ao ser aberta e ao alternar Séries/Filmes. Eventos `cinetracker:data-changed`, retorno de visibilidade e detecção de importação concluída invalidam o cache da Home, evitando refresh manual após Bingers/importações.

## Backend 0.99.2

Migration: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.

RPC: `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, escopo `auth.uid()`, consolida mídia, estados, último episódio assistido, `last_watched_at`, plays e metadados necessários à Home.

Tabela: `daily_movie_recommendations_v0992` — RLS por `profile_id = auth.uid()`, uma recomendação por dia e sem repetição de TMDB por perfil.

## Recursos preservados

A 0.99.2 preserva o core estável v95/v98 e toda a camada 0.99.1: Perfil com timeline de 7 dias, filtros/layouts, favoritos, métricas extras, Pra Você com 7 posições, Calendário como última sub-aba, episódios ricos, marcação inteligente de episódios anteriores, cinegrafia do ator, Backup/Importar Dados e Bingers resiliente. A overlay global v97 continua desativada.

## Versionamento

- Web/package: `0.99.2`
- Service Worker: `ct-web-0.99.2`
- Android: `versionName 0.99.2`, `versionCode 9912`
- Rodapé: `CineTracker • v0.99.2`
- Runtime final: `patch-v093-v0992.js`
- Android bundle marker: `v0.99.2-home-series-movies-v95-core-inline-authoritative`

## Documentação canônica

- `PROJECT_STATE.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/releases/0.99.2.md`
- `docs/validation/0.99.2.md`

**Regra permanente:** toda atualização/mudança recebe nova versão e registro integral no GitHub. Source, build, deploy, publicação e teste físico são estados distintos.
