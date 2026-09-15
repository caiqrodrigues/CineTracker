# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.83** | `r292-official-1.0.83` | Relacionados com ações próprias, Pra Você canônico e cards compactos |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r292 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.83 / r292

A r292 fecha os fluxos de **Títulos Relacionados/Semelhantes** e **Descobrir > Pra Você** sem alterar a baseline Android.

- **Relacionados/semelhantes:** pôster e título abrem a mídia correta; Watchlist usa o ID/tipo do próprio card, é assíncrona e não fecha o modal.
- **Da sua Watchlist:** candidatos vêm do estado canônico do Supabase e itens já vistos são removidos antes da renderização.
- **100% Novos:** pools independentes para Filme, Série e Anime respeitam TMDB >= 7.5, ano > 1990, sem WWE/Raw/SmackDown, fora da Watchlist e sem repetição semanal.
- **Trocar seguro:** cada categoria troca apenas dentro do próprio pool válido, com índice normalizado para impedir slots cinzas por posição inválida.
- **Cards compactos:** título/metadados em uma linha com truncamento; ações de 30px; coração continua sobre o pôster; pôsteres permanecem em 154x231 mobile e 176x264 desktop.
- **Scroll:** somente trilhos próprios podem rolar horizontalmente; documento continua travado no eixo X.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v292.js` / `app-v292.css`; build: `apps/web/build-r292-official.mjs`; runtime: `apps/web/runtime-r292-related-foryou-compact.js`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto e tratamento específico para séries recorrentes antigas;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r292 herda r291 e acrescenta autoridade específica para relacionados e para os pools do Pra Você, mantendo a baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
