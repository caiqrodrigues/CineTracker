# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.44** | `r253-official-1.0.44` | autoridade única nas telas críticas + dados vivos do Supabase |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r253 |
| Backend | produção compartilhada | Supabase | produção; histórico canônico e persistência `shown_recommendations` com RLS |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.44 / r253

A r253 corrige a regressão observada em vídeo após a r252. O problema não era apenas cache: múltiplas autoridades herdadas continuavam redesenhando partes da mesma tela. A r253 estabelece um único produtor final para Home, Descobrir e Esportes, preserva o Perfil aprovado e volta a buscar o estado atual diretamente das fontes canônicas.

- **Home:** recarrega `cinetracker_home_live_v0997_r3` ao entrar e mantém o renderer visual já aprovado. `Juntando Poeira` não é mais criado somente porque a última reprodução tem mais de 30 dias: uma série `is_caught_up`, sem episódios realmente faltantes, encerrada ou já no último episódio liberado permanece em `Em dia`/`Concluída`. Raw, SmackDown, Fórmula 1 e Super Bowl continuam sem transformar backlog histórico em pendência atual. O Histórico recente usa o payload vivo e preserva registros novos.
- **Esportes:** deixa de combinar a navegação r248 com a navegação antiga. Existe um único renderer com exatamente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`. `Assistidos` vem de `watch_history` do `cinetracker_sports_payload_v1`, e a contagem/tempo usam `cinetracker_sport_stats_v1`; marcar/desmarcar usa `cinetracker_sport_mark_watched_v1`. O F1 Hub continua sendo o componente escuro da r248, com uma única instância.
- **Descobrir:** as nove abas passam a usar seletores próprios da r253 e troca de conteúdo local, sem chamar o render global herdado. A aba ativa muda imediatamente, cada request recebe uma geração e respostas antigas são descartadas. `Pra você` usa pools de uma página em paralelo, cards nativos, três blocos obrigatórios, filtros TMDB/ano/gênero/WWE/estado pessoal e `shown_recommendations` de 7 dias.
- **Perfil:** nenhuma reorganização visual é feita. A ordem física aprovada da r238 é mantida; depois do paint, o payload `cinetracker_profile_payload_v0997_r2` atualiza as estatísticas existentes e `cinetracker_sport_stats_v1` atualiza apenas os valores do painel `Esportes assistidos`.
- **Conflitos legados:** o `MutationObserver` permanente da r239 é retirado do bundle final. Também são neutralizados os dois wrappers da r252 que reclassificavam Home pelo tempo desde o último episódio e podiam colocar séries em dia em `Juntando Poeira`.
- **Validação:** build, invariantes estáticos, algoritmos e Chromium cobrem a regressão do vídeo: somente quatro abas esportivas, 48 itens simulados no histórico canônico, uma única instância do F1 Hub, nove abas do Descobrir clicáveis, corrida assíncrona entre abas, Perfil sem mudança de ordem, Home sem poeira falsa e Histórico recente posterior a Black Mirror.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
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
