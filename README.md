# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.99** | `r308-official-1.0.99` | Descobrir 1+3+3, filtros pessoais, F1 Calendário e Perfil estabilizados no renderer real |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r308 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.99 / r308

A r308 corrige diretamente as áreas reproduzidas no vídeo de validação e mantém a proteção de progresso introduzida na r307.

- **Descobrir / Pra Você:** `Indicação do Dia` com troca real, `Da sua Watchlist` com Filme + Série + Anime e `100% novos` com Filme + Série + Anime. Cada categoria mantém seu próprio pool; uma categoria não preenche a vaga de outra.
- **Desempenho:** autoridade pessoal, memória semanal e pools iniciais do TMDB são iniciados em paralelo; a Watchlist hidrata somente o necessário para identificar Filme/Série/Anime e a composição recente é reutilizada por três minutos.
- **Ações:** Watchlist e `✓ Visto` usam os controles `chip` do sistema, sem paleta paralela; os cards mantêm geometria compacta de 158 px e as ações permanecem contidas no card.
- **Exclusões pessoais:** `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` recebem uma barreira final contra assistidos e Watchlist imediatamente antes do paint. `Calendário`, `Pra Você` e `Top 10` são exceções explícitas.
- **F1 Hub:** somente `Visão geral`, `Calendário`, `Classificações` e `Circuitos`; `Pilotos` e `Equipes` não aparecem como abas redundantes. O clique do Calendário usa o `data-event-id` real e abre a rodada correta no modal com `Grid de Largada` e `Resultado de Chegada`.
- **Perfil:** acabamento final pelo rótulo semântico das estatísticas, sem depender da posição do card. `Séries Watchlist` e `Filmes Watchlist` continuam clicáveis, mas sem `Abrir`, seta ou pseudo-ícone visível.
- **Home preservada:** a r307 continua impedindo que o botão de um episódio do Raw/SmackDown seja convertido em marcação da série inteira e mantém a regra de fronteira para séries recorrentes antigas.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r308-official.mjs`; runtime: `apps/web/runtime-r308-discover-f1-profile.js`; regressões: `apps/web/test-r308.mjs` e `apps/web/test-r308-browser.mjs`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r308 herda a r307, aposenta as autoridades atrasadas que ainda brigavam pelo DOM e conecta uma autoridade final aos renderers vivos de Descobrir, F1 e Perfil, mantendo o Android intacto.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
