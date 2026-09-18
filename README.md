# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.102** | `r311-official-1.0.102` | Perfil unificado, F1 clicável/assistível e Descobrir público estável |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r311 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r311 herda a r310 e consolida autoridades finais para Perfil, F1 e as cinco abas públicas do Descobrir, mantendo o Android intacto.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
