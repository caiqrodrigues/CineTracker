# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.41** | `r250-official-1.0.41` | release determinística da UI atual; promoção ao `main` exige CI, Chromium e smoke público |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r250 |
| Backend | produção compartilhada | Supabase | produção; compatibilidade RPC esportiva restaurada |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.41 / r250

A r250 passa a ser a autoridade final determinística das telas corrigidas e desliga os ciclos de reconciliação herdados da r249. O objetivo é evitar que renderizadores antigos retomem Home, Descobrir, Esportes/F1 e Perfil depois de a tela correta já ter sido pintada.

- **Home:** o estado de acompanhamento usa somente a fronteira realmente assistida. Episódios históricos anteriores a essa fronteira continuam não assistidos, mas não entram no contador atual de faltantes. Um episódio lançado depois da fronteira sempre vence e volta para `Assistir a seguir`. A mesma regra cobre séries regulares, Raw/SmackDown e a ponte F1/Super Bowl. Cards de Home recebem avaliação TMDB em nota + percentual e proporções alinhadas ao Descobrir.
- **Descobrir:** clique de aba/tipo tem dono único, geração própria e bloqueio de resposta atrasada. O filtro final elimina vistos, em andamento, Watchlist e `NotInterested`, remove slots `Sem item elegível` e mantém dimensões/rolagem estáveis.
- **Esportes:** a Web usa diretamente `cinetracker_sports_payload_v1`; as quatro abas públicas continuam sendo `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`. `Próximos` mostra somente o futuro de hoje; `Anteriores`, D-1 a D-3; favoritos e assistidos usam os respectivos estados canônicos. Marcar/desmarcar assistido usa `cinetracker_sport_mark_watched_v1` e anima o botão.
- **Compatibilidade Supabase:** `cinetracker_sports_events_v0997` voltou apenas como wrapper compatível para bundles antigos ainda em cache. A r250 não chama esse RPC legado.
- **F1 Hub:** somente um Hub permanece montado; as seis áreas da r248 são preservadas e minimizar/expandir é persistido como decisão do usuário sem reabertura automática.
- **Perfil:** estatísticas esportivas são movidas para o mesmo grid de `Estatísticas`; o painel separado é removido e o conjunto passa a minimizar/expandir junto.
- **Rolagem:** não existe overflow horizontal global; a página mantém rolagem vertical e temporadas, gráficos, relacionados/semelhantes, Descobrir, F1 e outros conteúdos largos usam somente trilhos horizontais locais.
- **Validação:** a r250 possui cenário de Chromium que cobre backlog histórico, novo episódio, corrida assíncrona no Descobrir, quatro filtros esportivos, RPC de assistido, F1 duplicado/minimizado, Perfil unificado e overflow local/global.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, elenco e pessoas;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker;
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
