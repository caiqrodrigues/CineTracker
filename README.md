# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.66** | `r275-official-1.0.66` | Histórico retrátil, Reassistir com multiplicador, próximo episódio e deduplicação canônica |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r275 |
| Backend | produção compartilhada | Supabase | Home continua no payload r6 limitado; `cinetracker_home_series_watch_state_v1` consolida progresso por TMDB efetivo |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.66 / r275

A r275 corrige as regressões reais vistas na Home sem reintroduzir o `statement timeout` eliminado na r274.

- **Histórico retrátil e no lugar correto:** `Histórico recente` e `Filmes vistos` permanecem acima de `Assistir a seguir`, mas iniciam recolhidos. `Ver Histórico ˅` / `Ocultar Histórico ^` alterna o conteúdo com transição suave de altura/opacidade e preserva o estado aberto durante Reassistir/Desfazer.
- **Reassistir com multiplicador:** os itens do Histórico continuam com `↻` e `↶`; ao registrar nova visualização, um badge animado passa a mostrar `2x`, `3x`, `4x...`. Os handlers de Reassistir dos detalhes também são decorados com o mesmo multiplicador após a ação.
- **Deduplicação estrita de séries:** a Home agrupa por TMDB efetivo antes de construir os buckets. Registros internos duplicados do mesmo título não geram cards repetidos; o novo RPC consolida os episódios vistos entre todos os `media_id` equivalentes e seleciona um `canonical_media_id`.
- **Detecção fresca de episódios novos:** para séries ativas (`Assistir a seguir`, `Juntando poeira`, `Em dia`), a Web consulta o TMDB com cache e concorrência limitada, cruza a temporada atual com as chaves canônicas de episódios vistos e encontra o primeiro episódio já lançado que ainda não foi assistido. Uma série marcada como `Em dia` que ganhou episódio novo é promovida para `Assistir a seguir`.
- **Caso Lioness:** o estado canônico une o progresso existente e detecta o primeiro episódio lançado não visto da 3ª temporada, impedindo que a série permaneça falsamente em `Em dia`.
- **Séries Em Dia:** quando não existe episódio lançado pendente, o card exibe o próximo episódio anunciado pelo TMDB no formato `Próximo: SXXEYY - Nome • DD/MM/AAAA`.
- **Caso Reacher:** IDs internos diferentes com o mesmo TMDB são consolidados antes da renderização; o progresso não é descartado e apenas um card canônico é exibido por seção.
- **Botões de Assistido:** `✓` continua como ação fixa à extrema direita dos cards de filmes/episódios em `Assistir a seguir`, preservando o layout `flex-row nowrap` da r274.
- **Performance preservada:** o payload principal continua `cinetracker_profile_home_payload_v0997_r6` com limites 20/120/120. A reconciliação nova usa uma única RPC compacta de estado e chamadas TMDB em concorrência limitada, sem voltar a varrer todo o histórico.
- **Escopo preservado:** Descobrir, Sports/F1 e Android permanecem congelados. Detalhes mantêm o renderer anterior, recebendo somente o badge de multiplicador depois da ação de Reassistir.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, retrátil, com Reassistir e opção de desfazer marcação de visto;
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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r275 herda o payload r6 limitado da r274 e adiciona uma camada finita de reconciliação por TMDB efetivo, sem `MutationObserver` permanente na Home.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
