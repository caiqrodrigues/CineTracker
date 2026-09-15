# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.86** | `r295-official-1.0.86` | Descobrir com exclusão canônica de vistos/Watchlist, Calendário combinável e Indicação do Dia corrigida |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r295 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.86 / r295

A r295 corrige o **Descobrir** usando uma autoridade pessoal unificada e mantém integralmente a baseline Android.

- **Em alta / Populares / Novidades / Mais Aguardados / Mais bem avaliados:** não exibem títulos já vistos nem presentes na Watchlist.
- **Ações dos cards:** cada card dessas cinco áreas mantém `+ Playlist` e recebe `✓ Visto`; ao concluir a ação, o título sai imediatamente da seleção atual.
- **Autoridade pessoal:** a Web une recomendações, painel do Perfil e snapshot da biblioteca para evitar vazamentos quando uma fonte isolada estiver incompleta.
- **Calendário:** `Todos / Filmes / Séries` formam um eixo exclusivo e `Watchlist` funciona como filtro independente; combinações como `Séries + Watchlist` são suportadas.
- **Calendário/Watchlist:** a Watchlist é aplicada depois da coleta do calendário, sem ser descartada prematuramente pela exclusão geral do Descobrir.
- **Pra Você / 100% Novos:** candidatos são novamente filtrados contra a união canônica de vistos + Watchlist antes de cada pintura.
- **Indicação do Dia:** passa a sair apenas do pool válido de `100% Novos`, de forma determinística por dia, e remove blur/filtros herdados do card/imagem.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v295.js` / `app-v295.css`; build: `apps/web/build-r295-official.mjs`; runtime: `apps/web/runtime-r295-discover-personal-calendar-daily.js`.

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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r295 herda a geometria/densidade da r294 e adiciona uma autoridade tardia para regras pessoais do Descobrir, filtros combináveis do Calendário e a recomendação diária, sem alterar o Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
