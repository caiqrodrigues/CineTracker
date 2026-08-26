# CineTracker Web — 0.0.99

**Package:** `0.0.99`  
**Cache:** `ct-web-0.0.99`

A Web compartilha conta, biblioteca, progresso, Perfil, descoberta, configurações, backup e histórico persistente com Android por meio do Supabase.

## Runtime

A 0.0.99 preserva a pilha 0.0.98 de navegação/Descobrir/Configurações e adiciona `patch-v091-v099-profile-lru.js` como camada final do Perfil.

Ordem final relevante:

- `patch-v088-v098-nav-pre.js`;
- stack estável v95 + HOTFIX15/16;
- `patch-v089-v098.js`;
- `patch-v090-v098-compat.js`;
- `patch-v091-v099-profile-lru.js`.

## Perfil 0.0.99

Logo abaixo das estatísticas principais existem quatro carrosséis horizontais:

- Séries;
- Séries favoritas;
- Filmes;
- Filmes favoritos.

Cards usam proporção 2:3, cantos arredondados, pôster, título, progresso, badge `♥` e última atividade. O clique abre detalhes TMDB quando existe ID oficial positivo; surrogate negativo abre detalhe local seguro.

## LRU e atualização reativa

A ordenação usa `last_watched_at DESC`. A RPC `cinetracker_profile_media_dashboard()` consolida timestamps de `watch_history`, `episode_progress` e `AlreadySeen` de filmes.

Depois de alterações em histórico, progresso ou overrides, o Perfil refaz a leitura do Supabase. Eventos `cinetracker:data-changed`, retorno de foco/visibilidade e reconciliação periódica mantêm a tela alinhada ao estado central.

## Subtelas

**Séries ›**: Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia e Concluídas.  
**Filmes ›**: Assistir a seguir / Watchlist e Já vistos.  
**Séries favoritas › / Filmes favoritos ›**: grids completos, 3 colunas em telas maiores e 2 em telas pequenas.

## Backend relacionado

- migration `20260826234500_v099_profile_media_lru_dashboard.sql`;
- RPC `cinetracker_profile_media_dashboard()` com `SECURITY INVOKER` e `auth.uid()`.

A RPC expõe progresso, `last_watched_at`, plays, favorito, AddedToWatchlist, WatchLater, InProgress, UpToDate, Completed, não iniciada e já vista.

## Recursos preservados

- navegação Home / Descobrir / Perfil / Configurações;
- Histórico sem aba própria;
- Descobrir com ordem e filtros 0.0.98;
- Backup ZIP/CSV com Exportar/Importar;
- Limpar Cache e Atualizar Metadados;
- importação Bingers HOTFIX16.

## Build e deploy

- Verify final da 0.0.99: run `33021058624`, **success**;
- build Web também foi reexecutado com sucesso dentro do pipeline Android `33021058734`;
- status Vercel do commit funcional `f4261cb944b60c15c01b41989645e8c64468e4ef`: **success — Deployment has completed**.

Smoke autenticado/visual da produção continua separado e não foi marcado como executado.

## Rodapé

**`CineTracker • v0.0.99`**.

Release: `docs/releases/0.0.99.md`.  
Validação: `docs/validation/0.0.99.md`.
