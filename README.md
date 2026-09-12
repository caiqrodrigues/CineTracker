# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.50** | `r259-official-1.0.50` | recuperação de Home/Descobrir e remoção dos gargalos observados no vídeo real |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r259 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist, progresso e estado de recomendação canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.50 / r259

A r259 parte do vídeo real posterior à r258, que comprovou três regressões: Home lenta e corrompida durante a reconciliação, Descobrir terminando em `Não foi possível validar sua biblioteca pessoal` e navegação geral mais pesada. A r259 não compõe sobre a r258; volta à r257 e aplica uma autoridade pequena somente para Home/Descobrir e desempenho. **Esportes, Perfil, Configurações e F1 permanecem congelados.**

- **Home sem reparo de DOM:** a r259 não move cards já renderizados entre seções nem reescreve a árvore da Home. O primeiro estado vem de `cinetracker_profile_home_payload_v0997_r5`, é normalizado em memória e é pintado uma única vez.
- **Raw/SmackDown sem flash histórico:** antes do primeiro paint, backlog S01 é neutralizado visualmente e a série fica provisoriamente `Em dia`. Em segundo plano somente Raw/SmackDown consultam o conjunto exato assistido e o TMDB atual; apenas episódios já exibidos depois da maior fronteira assistida podem virar pendência. Séries normais não fazem auditoria TMDB individual.
- **Lioness/Stuart e séries normais:** quando o próprio payload já comprova episódios liberados faltantes, a classificação `Continue assistindo`/`Juntando poeira` é calculada antes do primeiro paint, sem esperar rede adicional.
- **Descobrir rápido:** o caminho crítico deixa de chamar `cinetracker_profile_media_dashboard_v0991` + `cinetracker_watchlist_full_v119`. O novo `cinetracker_recommendation_state_v108` retorna somente exclusões necessárias e candidatos úteis da Watchlist; no diagnóstico da conta real, sua execução no banco ficou em aproximadamente 33 ms.
- **Pra você em etapas:** `Indicação do Dia`, `Da sua Watchlist` e `100% Novos` aparecem imediatamente. Estado pessoal e primeira página dos pools públicos carregam em paralelo. Um erro externo não apaga mais toda a tela; existe fallback dentro dos próprios blocos e botão de recarga.
- **Menos trabalho contínuo:** os `MutationObserver` permanentes herdados das r256/r257 ficam desativados no bundle r259. Temporadas, episódios, gráficos, relacionados, elenco e Descobrir recebem `overflow-x:auto` e `pan-x pan-y` diretamente por CSS, sem varrer o `#app` a cada mutação. Touch não é capturado pelo drag JavaScript herdado.
- **Validação guiada pelo vídeo:** Chromium exige Home sem `S01E14/S01E01` nem no primeiro frame, Raw → S34E36 e SmackDown → S28E37 após a auditoria prioritária, exatamente duas consultas de estado de episódio, zero auditoria TMDB por Lioness/Stuart/série já em dia, `Pra você` com três blocos imediatos, abas públicas povoadas e scroll horizontal nativo sem observer.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
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

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
