# CineTracker Web — 0.99.2

**Package:** `0.99.2`  
**Cache:** `ct-web-0.99.2`  
**Patch final:** `patch-v093-v0992.js`

A Web compartilha conta, biblioteca, progresso, Perfil, Descobrir, configurações, backup e histórico persistente com Android por meio do Supabase.

## Runtime final

Ordem relevante:
- `patch-v088-v098-nav-pre.js`;
- stack estável v95 + HOTFIX15/16;
- `patch-v089-v098.js`;
- `patch-v090-v098-compat.js`;
- `patch-v091-v099-profile-lru.js`;
- `patch-v092-v0991.js`;
- `patch-v093-v0992.js`.

A camada 0.99.2 assume a Home; Perfil, Descobrir e Configurações continuam preservados pelas camadas 0.99.1/0.98.

## Home — Séries

- viewport vertical contínuo;
- histórico de episódios oculto acima do ponto inicial e revelado por Pull-to-Reveal/scroll;
- Assistir a seguir (pendência + <=30 dias);
- Juntando poeira (>30 dias);
- Em dia;
- Não Iniciadas / Watchlist;
- Concluídas.

Cards usam layout em linha, pôster 2:3, título, próximo S/E, progresso assistidos/lançados, faltantes, nome/nota do próximo episódio e ação ✓.

Quick mark grava `watch_history`, sincroniza `episode_progress`, atualiza detalhes, LRU e estatísticas por meio de `cinetracker:data-changed`.

## Release sync

Uma checagem diária atualiza metadados TMDB de séries Em dia/Em andamento. Se um novo episódio já lançou (`air_date <= hoje`) e ainda está pendente, a série vai para Assistir a seguir, recebe InProgress system e badge Novo Episódio. O Calendário força nova checagem.

## Home — Filmes

- histórico Vistos oculto acima do topo;
- Escolha para Hoje: nota >=8.0, nunca visto, 1 por dia, sem repetição;
- Assistir a seguir / Watchlist em cards de linha;
- quick mark grava histórico e `AlreadySeen`.

A escolha diária é persistida em `daily_movie_recommendations_v0992`.

## Backend

- migration `20260827004500_v0992_home_series_movies.sql`;
- RPC `cinetracker_profile_home_dashboard_v0992()`;
- tabela RLS `daily_movie_recommendations_v0992`.

## Reatividade pós-importação

Abrir Home, alternar Séries/Filmes, receber `cinetracker:data-changed`, voltar à aba/janela ou concluir uma importação invalida o cache e refaz a leitura central.

## Recursos preservados

- Perfil 0.99.1 com timeline, filtros/layouts, favoritos e métricas extras;
- Pra Você com 7 posições e Calendário por último;
- episódios ricos e marcação inteligente;
- cinegrafia do ator;
- Backup Exportar/Importar, Cache, Metadados e Bingers resiliente;
- overlay global v97 continua desativada.

## Rodapé

**`CineTracker • v0.99.2`**.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
