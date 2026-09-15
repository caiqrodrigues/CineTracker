# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.85** | `r294-official-1.0.85` | Descobrir mais compacto, Top 10 com 10 cards na referência desktop e ações acima do scroll |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r294 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.85 / r294

A r294 corrige a densidade visual do **Descobrir** observada em vídeo, sem alterar a baseline Android.

- **Cards desktop:** passam de 176x264 para 158x237; mobile Web preserva 154x231.
- **Top 10:** a referência desktop de 1920px passa a comportar os 10 cards completos na linha; em larguras menores o scroll continua local ao trilho.
- **Texto compacto:** o bloco de título/metadados cai de 80px para 52px no desktop, mantendo uma linha e reticências.
- **Ações antes do scroll:** Playlist/Trocar ficam contidos na altura efetiva do card/slot e aparecem antes da barra horizontal, sem vazamento para baixo.
- **Controles menores:** rodapé de 28px, gap de 4px e margem superior de 2px.
- **Trilhos mais densos:** gap horizontal de 8px e padding inferior de 6px, aproximando texto, ações e scrollbar.
- **Relacionados/semelhantes:** a faixa de Watchlist/Visto recebe a mesma compactação sem alterar a autoridade de clique/ID consolidada até a r293.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v294.js` / `app-v294.css`; build: `apps/web/build-r294-official.mjs`; runtime: `apps/web/runtime-r294-discover-density-scroll-order.js`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto e tratamento específico para séries recorrentes antigas;
- Descobrir/Pra Você, Top 10, tendências, novidades, mais aguardados, mais bem avaliados e calendário;
- favoritos de filmes e séries sincronizados por estado `Liked`, com ação direta pelo coração no Descobrir;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações, elenco e títulos relacionados;
- Formula 1 e NFL Super Bowl importados tratados como séries, sem perder a área esportiva/F1 Hub;
- Perfil com estatísticas, favoritos, atividade e tempos;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r294 herda toda a autoridade funcional da r293 e altera somente a geometria/densidade do Descobrir Web, mantendo navegação, recomendações, ações e baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
