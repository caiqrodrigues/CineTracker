# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.46** | `r255-official-1.0.46` | correção guiada pelo vídeo: Descobrir, Home, Esportes/F1 e Perfil |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r255 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist e estatísticas canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.46 / r255

A r255 corrige as regressões ainda visíveis no vídeo posterior à r254, com prioridade máxima para o Descobrir. A release mantém o layout aprovado onde ele já estava correto e substitui somente as autoridades que continuavam produzindo conteúdo ou estados incorretos.

- **Descobrir:** as nove abas permanecem, mas os resultados passam por um renderer explícito de cards com poster 2:3, título, ano, até três gêneros e nota. `Da sua Watchlist` usa `cinetracker_watchlist_full_v119`, não o dashboard resumido, e portanto trabalha com a Watchlist completa. A troca de aba é atômica: o conteúdo atual continua visível até o novo conjunto estar pronto, respostas atrasadas são descartadas e `shown_recommendations` não elimina indevidamente as abas públicas.
- **Home / séries:** `Em dia` volta a ser um estado separado e preservado. O backend canônico continua sendo a primeira autoridade; uma série só sai de `Em dia` quando a auditoria viva comprova que `last_episode_to_air` avançou além da fronteira realmente assistida. Raw/SmackDown/F1/Super Bowl ignoram backlog histórico e nunca usam `next_episode_to_air` como lançamento atual.
- **Home / filmes:** cards de filmes recebem poster, nome, ano, gêneros, nota e duração. Metadados ausentes são hidratados pelo TMDB sem bloquear o primeiro paint da Home.
- **Esportes:** a navegação pública passa a ter cinco filtros: `Próximos`, `Ao vivo`, `Anteriores`, `Favoritos` e `Assistidos`, com visual escuro/azulado integrado ao CineTracker. Eventos vistos vêm do histórico canônico completo; favorito e assistido usam os RPCs oficiais.
- **F1 Hub:** fica abaixo dos filtros de Esportes e possui seis áreas: `Visão geral`, `Calendário`, `Classificações`, `Pilotos`, `Equipes` e `Circuitos`, com o mesmo padrão escuro/azulado e estado local de navegação.
- **Perfil:** nenhum redesenho. `cinetracker_sport_stats_v1` passa a atualizar os cards de estatísticas esportivas independentemente da estrutura exata em que foram renderizados, corrigindo o valor congelado em 43 para a fonte canônica de 48 eventos e 6.300 minutos (105h00).
- **Scroll horizontal local:** temporadas, gráficos, relacionados/semelhantes, trilhos do Descobrir e F1 continuam rolando somente dentro do próprio componente; o documento permanece sem overflow horizontal global.
- **Validação:** a suíte r255 cobre cards do Descobrir com poster real, Watchlist completa, nove abas povoáveis, preservação de `Em dia`, metadados ricos de filmes na Home, cinco filtros esportivos, seis abas F1 corretas, 48/105h no Perfil e boot do bundle final `app-v255.js` em Chromium.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
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
