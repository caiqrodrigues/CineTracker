# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-26

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado nesta branch |
|---|---:|---|---|
| Web | **0.99.2** | package `0.99.2`, cache `ct-web-0.99.2`, patch final `patch-v093-v0992.js` | source pronto; aguardando CI/merge/deploy final |
| Android | **0.99.2** | `versionName 0.99.2`, `versionCode 9912`, bundle `v0.99.2-home-series-movies-v95-core-inline-authoritative` | source/workflow prontos; aguardando build/release final |
| Backend / Supabase | **0.99.2** | RPC `cinetracker_profile_home_dashboard_v0992`, tabela `daily_movie_recommendations_v0992` | migration aplicada em produção |
| Windows | — | — | não lançado |

## Identidade 0.99.2

### Web
- package: `0.99.2`;
- Service Worker: `ct-web-0.99.2`;
- camada autoritativa final: `apps/web/patch-v093-v0992.js`;
- rodapé: `CineTracker • v0.99.2`;
- Home de Séries/Filmes reativa e vertical;
- Perfil/Descobrir/Configurações continuam providos pelas camadas 0.99.1/0.98 preservadas.

### Android
- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle: `v0.99.2-home-series-movies-v95-core-inline-authoritative`;
- workflow: `.github/workflows/build-android-v0992.yml`;
- release planejada: `android-v0.99.2`;
- APK planejado: `cinetracker-android-0.99.2-debug.apk`.

## Backend 0.99.2

Migration: `20260827004500_v0992_home_series_movies.sql`.

`cinetracker_profile_home_dashboard_v0992()` é `SECURITY INVOKER`, usa `auth.uid()` e entrega dados de Home incluindo último S/E assistido, LRU, plays, estados e `raw_tmdb`.

`daily_movie_recommendations_v0992`:
- RLS habilitado;
- leitura/inserção apenas para `profile_id = auth.uid()`;
- uma escolha por perfil/dia;
- `unique(profile_id, tmdb_id)` para não repetir títulos já recomendados.

## Conteúdo funcional da 0.99.2

### Séries
- histórico oculto Pull-to-Reveal no topo;
- Assistir a seguir <=30 dias;
- Juntando poeira >30 dias;
- Em dia;
- Não Iniciadas / Watchlist;
- Concluídas;
- cards em linha 2:3 com próximo episódio, nota, progresso e faltantes;
- quick mark com histórico + `episode_progress` + LRU;
- sincronização diária de novos episódios e badge Novo Episódio.

### Filmes
- Vistos ocultos Pull-to-Reveal;
- Escolha para Hoje com rating >=8.0, nunca visto e sem repetição;
- Assistir a seguir / Watchlist;
- quick mark com `watch_history` + `AlreadySeen`.

### Reatividade
- Home recarrega ao abrir e alternar Séries/Filmes;
- reage a `cinetracker:data-changed`, retorno de visibilidade e conclusão visual de importação;
- atualizar Calendário força checagem de episódios lançados.

## Linha recente

- **0.0.98** — navegação, Histórico absorvido pelo Perfil, backup CSV/ZIP e Descobrir reformulado;
- **0.0.99** — biblioteca pessoal do Perfil com favoritos e LRU;
- **0.99.1** — estabilização do Perfil, timeline de 7 dias, Pra Você 7 cards, favoritos/detalhes, filtros e Bingers em Importar Dados;
- **0.99.2** — Home de Séries/Filmes vertical, Pull-to-Reveal, quick mark, release sync e Escolha para Hoje persistente.

## Regra obrigatória

Toda nova unidade lógica de mudança recebe nova versão e registro no GitHub. Source, validação automatizada, deploy Web, publicação APK e teste em aparelho real são estados separados.

Release atual: `docs/releases/0.99.2.md`.  
Validação atual: `docs/validation/0.99.2.md`.
