# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.52** | `r261-official-1.0.52` | ground truth dos vídeos: Raw/SmackDown, F1/Super Bowl como séries, Descobrir e detalhes |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r261 |
| Backend | produção compartilhada | Supabase | progresso importado + `cinetracker_imported_series_state_v1` |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.52 / r261

A r261 usa os dois vídeos reais como autoridade: o vídeo do CineTracker mostrou Raw ainda preso ao backlog histórico, cards do Descobrir comprimidos e o detalhe do SmackDown vazio; o vídeo de referência mostrou Formula 1 e NFL Super Bowl tratados como séries com temporadas, episódios e progresso.

- **Raw / SmackDown:** buracos históricos anteriores à maior fronteira realmente assistida deixam de virar `Faltam` ou próximo episódio. Antes da auditoria terminar, o estado histórico é neutralizado para não piscar `S01E14`/`S01E01`; depois, somente episódios já exibidos e posteriores à fronteira atual entram em `Assistir a seguir`.
- **Formula 1 como série:** a mídia importada `Formula 1` permanece `tv/series`, com temporadas anuais desde 1950. Treinos, Sprint/Sprint Qualifying, classificação e corrida viram episódios sequenciais da temporada; o progresso já importado é preservado e nenhum episódio histórico é marcado artificialmente.
- **NFL Super Bowl como série:** a mídia importada permanece `tv/series`, com Temporada 1 contendo a sequência de Super Bowls desde 1967 e progresso real `60/62`; a segunda temporada representa Halftime Shows, preservando o histórico importado.
- **Backend:** `cinetracker_imported_series_state_v1(p_media_id)` lê progresso de séries importadas sem identidade TMDB segura diretamente por `media_id`. Formula 1 e Super Bowl continuam sem associação TMDB inventada.
- **Descobrir:** além do card externo, o próprio `<button>` interno recebe reset de altura/layout. Desktop usa 176×264 de poster e mobile 154×231, sempre 2:3, com título/metadados visíveis. Abas e trilhos são armados para scroll horizontal nativo e drag de mouse/caneta.
- **Detalhes:** o cache TMDB passa a incluir os parâmetros da chamada na chave. Uma consulta simples da Home para `/tv/1549` não pode mais contaminar a consulta rica da tela de detalhes com credits/recommendations/seasons.
- **Home rápida:** a primeira página compacta também possui cache visual em `localStorage`, além do cache da sessão, e é revalidada pelo payload canônico em segundo plano.
- **Escopo preservado:** Esportes/F1 Hub, Perfil e Configurações não são reconstruídos pela r261. Android permanece inalterado.
- **Validação:** Chromium mobile e desktop reproduz Raw/SmackDown com backlog S01, abre F1/Super Bowl como séries, mede o botão/poster/copy real do Descobrir, executa drag horizontal e comprova a separação do cache TMDB do detalhe.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
- Formula 1 e NFL Super Bowl importados tratados como séries, sem perder a área esportiva/F1 Hub;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker e F1 Hub;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
