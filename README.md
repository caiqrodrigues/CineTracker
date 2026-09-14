# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.72** | `r281-official-1.0.72` | Home com `✓` isolado do clique do card, atualização canônica única e layout estável após marcar assistido |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r281 |
| Backend | produção compartilhada | Supabase | Home no payload r6 limitado; `cinetracker_home_series_watch_state_v1` consolida progresso por TMDB efetivo |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.72 / r281

A r281 corrige o comportamento reproduzido no vídeo após tocar no `✓` de Lioness: o clique de **Marcar como assistido** não pode mais cair no handler genérico do card, abrir `/series/...` nem disparar repaints concorrentes da Home.

- **Clique isolado antes do card:** o `✓` é interceptado no `window` em capture phase, antes do listener genérico de `data-media` no `document`. O evento é consumido exclusivamente pela ação de assistido e não navega para detalhes.
- **Atualização canônica única:** após gravar episódio/filme, a Home usa apenas `ct275ReloadHome`/payload r6 e não emite o broadcast legado `cinetracker:data-changed`, eliminando a troca entre produtores antigos e novos que fazia a tela pular/tremular.
- **Layout estável:** qualquer card ativo que precise do `✓` recebe host flex em linha, inclusive fallback `.media-row` legado; controles antigos `data-ct266-watch` duplicados são removidos e o check fica 40×40 px na extrema direita, sem cair para a linha de baixo.
- **Reconciliação finita e idempotente:** a correção mantém somente uma janela curta de reconciliação sem `MutationObserver` persistente e sem reescrever controles já corretos.
- **Writer preservado:** episódios e filmes continuam usando `cinetracker_mark_watch_v0994`, TMDB efetivo e temporada/episódio corretos.
- **Escopo preservado:** check minimalista da r280, abas Séries/Filmes fixas, sidebar fixa, Histórico acima da viewport, metadados ricos, deduplicação, Reassistir, Descobrir, detalhes, Sports/F1 e Android permanecem preservados.

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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r281 herda a r280 e corrige exclusivamente o ownership do clique/refresh do controle de assistido e sua estabilidade de layout.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
