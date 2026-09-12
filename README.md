# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.49** | `r258-official-1.0.49` | Home orientada ao estado real da conta, Pra você resiliente e scroll horizontal nativo |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r258 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist e progresso canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.49 / r258

A r258 usa o vídeo real posterior à r257 como ground truth e congela **Esportes, Perfil e Configurações**, que o usuário confirmou estarem corretos. O escopo é Home, Descobrir/Pra você e rolagem horizontal.

- **Home / Stuart e Lioness:** a própria diferença `released_episodes - watched_episodes` passa a ser aplicada antes do primeiro paint. Se já há episódio liberado e a linha veio contraditoriamente como `Em dia`, ela vai imediatamente para `Assistir a seguir`/`Juntando poeira`, sem esperar uma auditoria remota em fila.
- **Home / Raw e SmackDown:** backlog histórico deixa de participar da pendência corrente. A auditoria prioritária usa o conjunto exato de episódios assistidos de `cinetracker_series_episode_state_v1`, encontra a maior fronteira realmente vista e procura somente episódios já exibidos depois dela. Assim, S01E14/S01E01 não podem reaparecer como “próximo” quando a sequência acompanhada está em S34/S28. A contagem visível de `Faltam` também representa somente pendências posteriores à fronteira atual; episódios antigos continuam preservados como não vistos no banco.
- **Descobrir / Pra você:** uma falha individual de hidratação TMDB deixa de derrubar toda a página. Cada item da Watchlist é enriquecido isoladamente; um `TMDB 404` é descartado e os demais blocos continuam renderizando. `Pra você` mantém `Indicação do Dia`, `Da sua Watchlist` e `100% Novos`.
- **Descobrir / exclusões pessoais:** dashboard, Watchlist completa e `NotInterested` formam a autoridade pessoal antes de recomendar. Vistos/concluídos, em andamento, em dia, Watchlist e não interessados ficam fora das recomendações; Watchlist é permitida somente dentro do bloco próprio. As abas públicas também aplicam exclusões pessoais e usam pools amplos para não ficarem vazias.
- **Scroll horizontal no mobile:** o navegador volta a ser a autoridade do gesto de toque com `overflow-x:auto`, `-webkit-overflow-scrolling:touch` e `touch-action:pan-x pan-y`. A captura manual de pointer da r257 é desativada para `pointerType=touch`; mouse/pen continuam com fallback de drag. Isso vale para abas/cards do Descobrir e para temporadas, episódios, gráficos, relacionados e elenco criados posteriormente.
- **Áreas aprovadas congeladas:** a r258 não substitui `renderSports`, `renderProfile` nem `renderConfigs`; o F1 r257 permanece no bundle sem alteração funcional.
- **Validação:** o Chromium reproduz os dados visíveis no vídeo: Raw começando em S01E14/1495 faltantes e terminando em S34E36/1 pendente, SmackDown S01E01 → S28E37, Stuart/Lioness saindo de `Em dia`, Watchlist com um item que lança `TMDB 404` sem quebrar `Pra você`, pelo menos 20 cards em `Em alta`, `pan-x` nativo e trilhos tardios de detalhes.

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
