# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.71** | `r280-official-1.0.71` | Home com `✓` minimalista para marcar episódios/filmes, abas Séries/Filmes fixas, Histórico acima da viewport e sidebar desktop fixa |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r280 |
| Backend | produção compartilhada | Supabase | Home no payload r6 limitado; `cinetracker_home_series_watch_state_v1` consolida progresso por TMDB efetivo |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.71 / r280

A r280 refina visualmente o controle de **Marcar como assistido** criado na r279, sem alterar o writer canônico nem a lógica de episódios/filmes.

- **Check minimalista:** o botão deixa de exibir o texto `Marcar` e passa a mostrar apenas `✓`, em um controle 40×40 px no mesmo padrão compacto das ações do Histórico.
- **Estado apagado por padrão:** borda e fundo ficam discretos e o check usa opacidade reduzida enquanto o item ainda não foi marcado.
- **Feedback verde ao clicar:** no instante do clique o próprio botão ganha o estado ativo verde, com fundo/borda/check destacados durante a gravação.
- **Writer preservado:** episódios continuam sendo gravados com temporada/episódio corretos e filmes continuam usando o mesmo fluxo canônico `cinetracker_mark_watch_v0994` da r279.
- **TMDB efetivo preservado:** cards cujo `tmdb_id` direto é vazio/zero continuam usando a identidade efetiva/fallback de `data-media`.
- **Séries / Filmes permanentemente no topo:** a barra da Home continua `fixed` e não acompanha o scroll vertical.
- **Escopo preservado:** Histórico acima da viewport inicial, cards ricos de episódios, deduplicação por TMDB, Reassistir `2x/3x/4x...`, sidebar fixa, Descobrir, detalhes, Sports/F1 e Android permanecem preservados.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, acessível acima da viewport inicial, com Reassistir e desfazer marcação de visto;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto com consolidação por TMDB efetivo;
- próximo episódio anunciado para séries em dia;
- metadados ricos de episódios e filmes nos cards da Home;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r280 herda integralmente a r279 e altera somente a apresentação/feedback do controle de assistido.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
