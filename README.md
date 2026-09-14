# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.69** | `r278-official-1.0.69` | Home com ação de assistido por TMDB efetivo, abas Séries/Filmes sticky, Histórico acima da viewport e sidebar desktop fixa |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r278 |
| Backend | produção compartilhada | Supabase | Home no payload r6 limitado; `cinetracker_home_series_watch_state_v1` consolida progresso por TMDB efetivo |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.69 / r278

A r278 corrige o caso real mostrado em vídeo no qual o card tinha identidade TMDB válida para navegação, mas `tmdb_id` direto vinha vazio/zero e impedia a criação do `✓` de **Marcar como assistido**.

- **Marcar como assistido:** episódios de `Assistir a seguir` e `Juntando poeira` passam a usar a mesma identidade TMDB efetiva usada pelo card (`ct275Tmdb/mediaTmdb`). Se o atributo enriquecido ainda estiver vazio, o runtime usa `data-media="tv:<id>"` como fallback. Filmes em `Assistir a seguir / Watchlist` usam a mesma regra efetiva.
- **Ação sempre visível:** o `✓` permanece dentro do próprio card, com host relativo e posicionamento explícito à direita; `display`, `visibility` e `opacity` são protegidos contra regras legadas.
- **Séries / Filmes sempre acessíveis:** a barra de abas da Home usa `position: sticky; top: 0`, permanecendo no topo enquanto o conteúdo é rolado para cima ou para baixo.
- **Sidebar desktop fixa:** logo, navegação, usuário e Sair continuam presos à viewport inteira; somente a coluna de conteúdo rola.
- **Histórico:** permanece renderizado acima do ponto inicial da Home, sem botão de abrir/fechar; ao subir a página ele aparece naturalmente.
- **Cards de séries:** `Continuar assistindo`, `Juntando poeira` e `Em dia` preservam metadados ricos de episódio da r276.
- **Escopo preservado:** deduplicação por TMDB, Reassistir `2x/3x/4x...`, Descobrir, detalhes, Sports/F1 e Android permanecem preservados.

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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r278 herda r277/r276 e corrige a identidade usada pela ação de assistido sem reconstruir as demais superfícies.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
