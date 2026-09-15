# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.86** | `r295-official-1.0.86` | Descobrir com 8 abas canônicas, renderer único e troca cache-first sem reconstrução no meio da sessão |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r295 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.86 / r295

A r295 corrige a lentidão e a troca de estrutura do **Descobrir** observadas no vídeo, preservando a geometria aprovada na r294 e sem alterar o Android.

- **Oito abas canônicas:** `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` passam a ser a única fonte de navegação.
- **Lançamentos removido na fonte:** a definição histórica `releases / Lançamentos` é retirada do `DTABS263`, do mapa de labels e do source legado; não depende mais de esconder/remover a aba depois que outro renderer a recria.
- **Renderer único:** `renderDiscover` final mantém o shell existente durante a sessão e não permite que repaints assíncronos antigos reconstruam a navegação no meio do uso.
- **Troca cache-first:** ao voltar a uma aba já carregada, o conteúdo é restaurado imediatamente por snapshot/cache de sessão, sem zerar o painel para `Carregando títulos…`.
- **Pra Você mais leve:** o refresh forçado 180 ms após cada clique é retirado; a autoridade r293 passa a atualizar em idle, coalescida e no máximo uma vez por janela de cinco minutos.
- **Menos chamadas pesadas:** pools de Filme/Série/Anime da autoridade r293 passam de cinco para três páginas TMDB por categoria na atualização de fundo.
- **Observer global aposentado:** o `MutationObserver` da r293 que acompanhava toda alteração do documento deixa de ser conectado, reduzindo trabalho em Home, Descobrir, Esportes e Perfil.
- **Visual r294 preservado:** cards desktop 158x237, Top 10 com 10 cards na referência 1920px e ações acima da barra horizontal continuam intactos.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v295.js` / `app-v295.css`; build: `apps/web/build-r295-official.mjs`; runtime: `apps/web/runtime-r295-discover-single-owner-fast-tabs.js`.

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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r295 herda a autoridade funcional da r294, elimina a concorrência de renderers do Descobrir e reduz trabalho reativo/global sem alterar a baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
