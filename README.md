# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.82** | `r291-official-1.0.82` | Descobrir com ações no footer, favorito por coração e carrosséis horizontais locais |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r291 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.82 / r291

A r291 refina a experiência da aba **Descobrir** sem alterar a baseline Android.

- **Ações sem sobreposição:** nos blocos `Da sua Watchlist` e `100% Novos`, `+ Playlist` / `✓ Salvo` ficam no footer, ao lado de `↻ Trocar`, em linha e sem ocupar a área de título/metadados.
- **Texto limpo:** título e metadados ficam isolados dos controles, com uma linha, `line-clamp-1` e truncamento por reticências.
- **Favorito no pôster:** cada mídia recebe coração minimalista sobre a capa, com estado inativo em contorno e ativo preenchido em rosa, além de feedback otimista imediato.
- **Persistência canônica:** favoritos usam `media_overrides.state = 'Liked'`; filmes aparecem em Favoritos de Filmes e itens `tv` em Favoritos de Séries pelo mesmo dashboard canônico do Perfil.
- **Scroll horizontal local:** `Em Alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados`, Top 10 e blocos do Pra Você usam carrosséis locais com `overflow-x:auto`, snap, gesto `pan-x` e arraste por ponteiro, sem criar scroll horizontal na janela.
- **Classes de carrossel:** os trilhos recebem `flex overflow-x-auto scrollbar-thin space-x-4 pb-4 snap-x touch-pan-x` e retenção de overscroll no próprio componente.
- **Geometria preservada:** os pôsteres continuam no padrão da Indicação do Dia definido pela r290.
- **Android preservado:** continua em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v291.js` / `app-v291.css`; build: `apps/web/build-r291-official.mjs`; runtime: `apps/web/runtime-r291-discover-actions-favorites-scroll.js`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto com consolidação por TMDB efetivo e exceção de fronteira atual para séries recorrentes antigas;
- contagem fresca de todos os episódios já lançados ainda disponíveis para ver;
- próximo episódio anunciado para séries em dia;
- metadados ricos de episódios e filmes;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- favoritos de filmes e séries sincronizados por estado `Liked`, com ação direta pelo coração no Descobrir;
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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r291 herda integralmente a r290 e acrescenta uma autoridade específica do Descobrir para footers de ação, favoritos por coração e carrosséis horizontais locais, sem alterar a baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
