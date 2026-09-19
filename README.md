# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.108** | `r317-official-1.0.108` | Perfil estável e canônico, Descobrir com 9 abas/filtro estrito/cache e F1 com detalhes por GP |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r313 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.108 / r317

A r317 corrige especificamente o clique de `Filmes Watchlist` no Perfil.

- `Filmes Watchlist` e `Séries Watchlist` agora são reconhecidos pelo próprio rótulo no primeiro listener de captura, sem depender de datasets que runtimes anteriores possam remover.
- O clique abre a lista completa correspondente usando a fonte `cinetracker_watchlist_full_v119`.
- Corrige também a ordem do card `Tempo de filme em Watchlist`, aceitando a forma singular exibida no Perfil e mantendo as dez estatísticas na ordem aprovada.
- Android preservado em `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r317-official.mjs`; runtime: `apps/web/runtime-r317-profile-watchlist-click.js`.

## Web 1.0.107 / r316

A r316 corrige os dois regressos restantes observados no vídeo enviado.

- **Perfil / ordem das estatísticas:** volta exatamente à geometria aprovada do r237: quatro colunas no desktop e os cards `Tempo total de tela` e `Tempo total em Watchlist` ocupam duas colunas.
- **Séries Watchlist / Filmes Watchlist:** voltam a ser botões clicáveis e abrem a lista completa correspondente. O bloqueio introduzido na r315 foi removido.
- **Esportes no Perfil:** preserva tempo assistido ao vivo, histórico de eventos, Jogos no Estádio e o recolher unificado com Estatísticas.
- **F1 Hub:** mantém apenas Visão geral, Calendário, Classificações e Circuitos; remove o painel legado; quando a agenda recebida está incompleta, não informa mais falsamente `Temporada encerrada` e mostra `Agenda ainda não sincronizada`.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r316-official.mjs`; runtime: `apps/web/runtime-r316-profile-f1-final.js`.

## Web 1.0.106 / r315

A r315 corrige regressões introduzidas na r314 sem redesenhar áreas que já estavam aprovadas.

- **Pra você:** volta ao renderer r309 e recupera os controles aprovados de Watchlist, Visto e Trocar nos blocos Indicação do Dia, Da sua Watchlist e 100% novos.
- **Top 10:** volta à autoridade r288: todos os streamings disponíveis permanecem selecionáveis e cada streaming exibe separadamente **Top 10 Séries** e **Top 10 Filmes**.
- **Demais abas do Descobrir:** Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados aplicam a barreira canônica de vistos + Watchlist + identidade visual antes do HTML e mantêm as ações Watchlist + Visto.
- **F1 Hub:** remove definitivamente o rail legado `Seu registro / Fórmula 1 assistida`; o modal/drawer de GP e a marcação individual de sessões permanecem preservados.
- **Perfil:** restaura a ordem de estatísticas r238 e consulta `cinetracker_sport_stats_v1` junto do payload do Perfil, evitando zerar o tempo esportivo. Eventos assistidos e Jogos no Estádio voltam a abrir seus históricos.
- **Recolher:** o mesmo controle volta a recolher/expandir em conjunto Estatísticas e Esportes assistidos.
- **Watchlist no Perfil:** os contadores Séries Watchlist e Filmes Watchlist continuam estáticos, sem chevron e sem modal, conforme regra aprovada.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r315-official.mjs`; runtime: `apps/web/runtime-r315-regression-restore.js`; regressões: `apps/web/test-r315.mjs` e `apps/web/test-r315-browser.mjs`.

## Web 1.0.105 / r314

A r314 corrige diretamente as regressões reproduzidas no vídeo de 18/09/2026 e substitui a r313 como autoridade Web final, preservando o Android.

- **Perfil / estatísticas:** o Perfil usa somente o payload atual de `cinetracker_profile_payload_v0997` no paint final, sem reaproveitar cache antigo como fonte de números. Os painéis de estatísticas gerais e esportivas são estabilizados no topo.
- **Perfil / Watchlist:** `Séries Watchlist` e `Filmes Watchlist` são contadores estáticos: sem `>`, `›`, `Abrir`, `data-watchlist-kind`, modal ou cursor de ação.
- **Perfil / Atores Favoritos:** cards e imagens ficam com dimensões idênticas; o overflow horizontal e a scrollbar pertencem somente ao rail real de atores.
- **Descobrir / nove abas:** restaura `Lançamentos` e fixa a sequência `Pra você | Top 10 | Em alta | Populares | Novidades | Lançamentos | Mais Aguardados | Mais bem avaliados | Calendário`.
- **Descobrir / exclusão estrita:** `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados` e `Mais bem avaliados` removem títulos vistos e da Watchlist antes do HTML, incluindo aliases canônicos. `Pra você` e o Calendário preservam as exceções autorizadas.
- **Descobrir / ações e performance:** cards públicos recebem o `+` minimalista da Watchlist. As fontes TMDB usam stale-time de 5 minutos, revalidação em segundo plano e prefetch das abas para troca imediata quando o cache está quente.
- **Pra Você:** os três slots Filme/Série/Anime de `Da sua Watchlist` e `100% novos` ficam compactos e padronizados em 2:3.
- **F1 Hub:** Calendário e GPs anteriores da Visão Geral abrem drawer do GP. O detalhe consulta a classificação real e o resultado da corrida, exibindo Grid de Largada, Q1/Q2/Q3, chegada, Δ de posições, DNF e volta mais rápida.
- **F1 / assistidos:** treino, sprint, classificação e corrida usam IDs `f1:temporada:etapa:sessão` e persistência própria por usuário em `user_f1_session_watch`, com RLS e RPCs `SECURITY INVOKER`.
- **Backend / segurança:** o writer F1 `SECURITY DEFINER` criado na tentativa anterior foi removido; o contrato r314 fica restrito ao usuário autenticado.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r314-official.mjs`; runtime: `apps/web/runtime-r314-urgent-fixes.js.gz.b64`; regressões: `apps/web/test-r314.mjs` e `apps/web/test-r314-browser.mjs`.

## Web 1.0.104 / r313

A r313 corrige regressões visíveis no vídeo enviado após a r312, sem alterar a baseline Android.

- **Descobrir / filtro:** `Todos / Filmes / Séries` volta ao comportamento aprovado da r288: fica oculto por padrão e abre somente pelo botão compacto `☷`.
- **Descobrir / cards:** remove da fonte o card/banner próprio da r312. As cinco abas públicas voltam a usar o card padrão `ct288Card`, com `+ Watchlist` e `✓ Visto` em faixa pequena abaixo do card.
- **Descobrir / exclusão:** `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` mantêm bloqueio por visto, Watchlist e identidade tipo+título+ano antes do HTML.
- **Pra Você:** preserva a composição exata da r309 e reduz os painéis/controles sem reintroduzir o layout banner.
- **Esportes:** o filtro de `Próximos` e `Anteriores` é produzido diretamente dentro de `paintSports255`, ao lado do título. As opções vêm de todos os esportes presentes em `payload.sports`.
- **Perfil:** a r313 substitui a cadeia final de `renderProfile` por um único renderer canônico. Há um estado de loading e um único paint final; `Jogos no Estádio`, Watchlists e Eventos assistidos compartilham o mesmo contrato visual.
- **Sessão/F1:** renovação de JWT e F1 clicável/assistível das r312/r311 permanecem preservados.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r313-official.mjs`; runtime: `apps/web/runtime-r313-discover-sports-profile.js`; regressões: `apps/web/test-r313.mjs` e `apps/web/test-r313-browser.mjs`.

## Web 1.0.103 / r312

A r312 parte do último vídeo real de 18/09/2026 e substitui a r311 como candidata Web, preservando o F1 clicável já validado.

- **Descobrir / shell único:** as oito abas permanecem visíveis durante carregamento e troca de aba; somente a linha de status e o conteúdo mudam.
- **Descobrir / cinco abas públicas:** `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` excluem vistos e Watchlist antes da montagem do HTML, usando Watchlist completa, dashboard e exclusões pessoais.
- **Descobrir / cards:** título e metadados deixam de ser truncados por regras legadas; `+ Watchlist` e `✓ Visto` ficam numa faixa fixa abaixo do card e participam do mesmo scroll horizontal nativo.
- **Pra Você:** mantém os pools exatos Filme/Série/Anime da r309, porém com layout r312 compacto, sem painéis ou botões gigantes.
- **Sessão:** erros de JWT expirado renovam a sessão pelo refresh token e repetem a operação uma única vez.
- **Perfil:** `Jogos no Estádio` é garantido como botão idêntico a `Eventos assistidos`. Atores favoritos são lidos diretamente de `favorite_actors`; gravações nessa tabela invalidam o Perfil e atualizam a lista.
- **Esportes:** `Próximos` e `Anteriores` recebem filtro horizontal interativo dentro do próprio cabeçalho, com `Todos` mais todos os esportes retornados por `payload.sports`; não há lista manual fixa.
- **F1:** preserva a r311: GPs clicáveis, detalhe completo, grid/resultado e marcação individual das sessões como assistidas.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r312-official.mjs`; runtime final é injetado por `runtime-r312-video-truth.js.gz.b64`; regressões: `apps/web/test-r312.mjs` e `apps/web/test-r312-browser.mjs`.

## Web 1.0.102 / r311

A r311 usa o vídeo real de 18/09/2026 como regressão para três áreas que ainda trocavam de autoridade visual ou não entregavam a interação final.

- **Perfil / Estatísticas:** `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist` passam a compartilhar exatamente a mesma versão visual; as ações existentes continuam disponíveis, mas sem classes/ícones concorrentes nem troca tardia de layout.
- **F1 Hub / Calendário:** cada GP é um botão real com `Abrir corrida`. O detalhe mostra o fim de semana completo, Grid de Largada e Resultado de Chegada.
- **F1 / assistidos:** treino, sprint/classificação quando existentes, classificação e corrida recebem identidade estável por sessão e podem ser marcados/desmarcados como assistidos por `cinetracker_sports_watch_set_v296`.
- **Descobrir:** `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` são filtrados por vistos + Watchlist antes do HTML.
- **Descobrir / ações:** o card de mídia não carrega mais o `+` legado. `+ Watchlist` e `✓ Visto` vivem em uma faixa fixa abaixo do card, com posição estática e um único renderer.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r311-official.mjs`; runtime: `apps/web/runtime-r311-profile-f1-discover.js`; regressões: `apps/web/test-r311.mjs` e `apps/web/test-r311-browser.mjs`.

## Web 1.0.101 / r310

A r310 parte do vídeo real enviado em 18/09/2026 após a r309 e aposenta autoridades históricas que ainda conseguiam sobrescrever a interface alguns segundos depois.

- **Descobrir:** desativa na fonte o injetor r252 que recriava `Top 10` e `Lançamentos`, o recovery r300 de 2,2 s e o repaint atrasado r293.
- **Watchlist canônica:** `cinetracker_watchlist_full_v119` passa a participar da exclusão final antes do paint das abas públicas; um item que já está na Watchlist não pode aparecer ali com `+ Watchlist`.
- **Ações dos cards:** Watchlist e `✓ Visto` permanecem lado a lado; o estado salvo mostra `✓ Watchlist` em vez de um `+` enganoso.
- **Perfil / Esportes:** o primeiro paint conta eventos assistidos pelo histórico canônico `cinetracker_sports_watch_history_v296`, evitando divergências como 59 no Perfil contra 68 na aba Esportes.
- **Atores Favoritos:** as barras nativas antigas ficam ocultas e uma única barra sincronizada é posicionada explicitamente abaixo do rail dos cards.
- **Esportes:** eventos antigos que chegam do provider ainda marcados como `live` deixam de aparecer como `AO VIVO` após a janela plausível do evento.
- **Rodapé:** a versão visível deixa de ficar congelada em `v1.0.57` e passa a acompanhar `v1.0.101 / r310`.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r310-official.mjs`; runtime: `apps/web/runtime-r310-video-truth.js`; regressões: `apps/web/test-r310.mjs` e `apps/web/test-r310-browser.mjs`.

## Web 1.0.100 / r309

A r309 usa os dois vídeos de validação enviados em 18/09/2026 como fonte de verdade e corrige as autoridades que ainda repintavam a interface depois do primeiro frame.

- **Descobrir / navegação:** remove `Lançamentos` de todos os produtores privados ainda embarcados e elimina rails herdados/duplicados; a sequência canônica passa a ser somente `Pra você | Top 10 | Em alta | Populares | Novidades | Mais Aguardados | Mais bem avaliados | Calendário`.
- **Descobrir / carregamento:** estado pessoal e catálogo TMDB começam juntos, em paralelo, em vez de uma chamada aguardar a outra. As respostas de browse ficam em cache curto e a composição do `Pra Você` reutiliza um estado válido por três minutos.
- **Descobrir / Pra Você:** combina `cinetracker_recommendation_state_v108` com `cinetracker_watchlist_full_v119`, hidrata a Watchlist até identificar Filme, Série e Anime e mantém pools separados para `Da sua Watchlist` e `100% novos`. A Indicação do Dia usa pool próprio e possui troca real.
- **Descobrir / cards:** deduplicação final usa identidade TMDB e também identidade visual tipo+título+ano, cobrindo o duplicado `Next Time` mostrado no vídeo. Watchlist e `✓ Visto` ficam sempre visíveis em dois controles `chip`; `Trocar` ocupa uma linha própria.
- **F1 Hub:** neutraliza a autoridade r257 que ainda repintava o Hub em 0/180/700/1800 ms. `Pilotos` e `Equipes` são removidos do produtor antes do primeiro paint; o Hub nasce diretamente com quatro abas.
- **Perfil:** elimina o fluxo visível cache → quick stats → full payload. O Perfil mantém um único estado de carregamento e só pinta quando o payload canônico, estatísticas esportivas e resumo de estádio foram resolvidos ou atingiram timeout controlado.
- **Perfil / Watchlist:** o chevron é removido no próprio produtor, portanto não aparece nem por um frame; os cards continuam clicáveis.
- **Perfil / atores:** somente o pai real dos cards recebe `overflow-x:auto`; wrappers externos perdem autoridade horizontal, mantendo a scrollbar abaixo dos cards.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r309-official.mjs`; runtime: `apps/web/runtime-r309-video-truth.js`; regressões: `apps/web/test-r309.mjs` e `apps/web/test-r309-browser.mjs`.

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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r314 herda a baseline r313, assume a autoridade final de Perfil, Descobrir e detalhe da F1, e mantém o Android intacto.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
