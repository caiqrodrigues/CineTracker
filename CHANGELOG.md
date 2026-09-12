# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.48 — 2026-09-12 — Web r257

### Ground truth do vídeo / sequência real de episódios
- O vídeo posterior à r256 confirmou que a geometria da Home melhorou, mas a semântica de séries longas ainda misturava backlog histórico com a sequência atual: SmackDown podia mostrar corretamente um episódio recente no card e, ao mesmo tempo, apontar `S01E01` de 1999 como próximo episódio.
- A r257 usa `cinetracker_series_episode_state_v1` para obter o conjunto exato de episódios assistidos e define a fronteira pela maior posição realmente vista. O próximo episódio passa a ser o primeiro episódio já exibido, não assistido e estritamente posterior a essa fronteira.
- Buracos históricos anteriores à fronteira permanecem intactos e não são marcados automaticamente como vistos, mas deixam de inflar o próximo episódio e a contagem corrente de `Faltam`.
- A mesma regra cobre Lioness, Stuart e demais séries iniciadas: episódio realmente liberado depois da fronteira coloca a série em `Continue assistindo`; ausência de pendência posterior mantém `Em dia`/`Concluída` conforme o status.
- `next_episode_to_air` continua proibido como evidência de episódio já lançado.

### Descobrir / exclusões pessoais e pools completos
- O vídeo comprovou que o tamanho dos cards estava correto, mas `Pra você` ainda podia exibir títulos já vistos, na Watchlist ou atualmente acompanhados, e abas públicas ficavam com poucos cards depois da filtragem.
- A r257 valida dashboard pessoal + Watchlist completa antes de pintar recomendações. Vistos, concluídos, em andamento, em dia, Watchlist e `NotInterested` formam o conjunto de exclusão pessoal.
- `Pra você` mantém os critérios estritos de recomendação — nota, ano, poster, gêneros e antirrepetição — e o bloco `Da sua Watchlist` usa somente itens elegíveis da própria Watchlist que ainda não foram vistos/concluídos/acompanhados.
- Se dashboard ou Watchlist não puderem ser validados, o Descobrir falha fechado em vez de recomendar conteúdo potencialmente proibido.
- As abas públicas consultam múltiplas páginas do TMDB, deduplicam e aplicam somente as exclusões pessoais. Elas não herdam os cortes de nota/ano do `Pra você`, evitando trilhos com apenas um ou poucos cards.

### Scroll horizontal / gesto real no celular
- O vídeo e os prints mostraram temporadas/episódios, gráfico, relacionados e cards/abas do Descobrir visivelmente ultrapassando a largura sem responder ao arrasto lateral.
- A r257 mantém `overflow-x:auto` local e adiciona fallback de `pointer-drag`: o componente altera `scrollLeft` quando o movimento horizontal domina o vertical, preservando a rolagem vertical normal da página.
- A autoridade cobre abas e cards do Descobrir, temporadas/episódios, gráficos, relacionados/semelhantes, atores/elenco, filtros esportivos e trilhos/tabelas do F1.
- O observer permanece restrito a `childList` e marca também componentes criados tardiamente; o documento continua sem overflow horizontal global.

### F1 / próximo fim de semana e grid anterior
- As seis áreas aprovadas do F1 Hub permanecem: `Visão geral`, `Calendário`, `Classificações`, `Pilotos`, `Equipes` e `Circuitos`.
- `Visão geral` passa a exibir as sessões disponíveis do próximo fim de semana em horário de `America/Sao_Paulo` — treinos, Sprint quando houver, classificação e corrida.
- Depois que a classificação estiver disponível, o Hub mostra as 20 posições do grid provisório do próximo GP; antes disso, informa explicitamente que o grid ainda não foi definido.
- O GP anterior passa a mostrar as 20 posições de largada e a posição final de cada piloto, com status e tempo/pontos, permitindo comparar `largou P… → chegou P…`.

### Build / validação
- Web atualizada para `1.0.48 / r257-official-1.0.48`; Android permanece `1.0.20 / versionCode 10062`.
- Não existe migration de schema na r257; os RPCs atuais do Supabase já fornecem o estado necessário.
- Build oficial: `apps/web/build-r257-official.mjs`; runtime: `apps/web/runtime-r257-sequence-scroll-discover-f1-grid.js`.
- `test-r257-browser.mjs` reproduz SmackDown com buraco histórico S01 e sequência S28, exige próximo recente, valida Lioness/Stuart, bloqueia vistos/Watchlist/acompanhando no Descobrir, exige pelo menos 20 cards em `Em alta`, executa arrasto horizontal real em abas/cards e trilhos tardios e valida 20 posições no próximo grid e 20 no grid anterior.
- `scripts/test-r257-exact-bundle-browser.mjs` carrega o `app-v257.js` final, captura `error`/`unhandledrejection`, exige os markers r257 e aplicação não vazia.
- `verify.yml` exige versão, sintaxe, build, regras, algoritmos, Chromium guiado pelo vídeo, bundle final, identidade final, Android inalterado e `production_smoke` público da 1.0.48/r257 após merge em `main`.

## 1.0.47 — 2026-09-12 — Web r256

### Ground truth do vídeo / Home
- O vídeo posterior à r255 confirma que a Home está estruturalmente correta, mas Lioness e Stuart continuam no bucket errado: os próprios cards exibem episódios faltantes e ação de marcar assistido enquanto aparecem em `Em dia`.
- A causa é uma contradição possível no payload: `is_caught_up=true` pode coexistir com `history_missing_episodes>0` ou com uma fronteira liberada posterior à assistida. Na r256, para séries normais, a pendência comprovável vence esse flag contraditório.
- A auditoria viva compara `last_episode_to_air` diretamente com a fronteira realmente assistida. `next_episode_to_air` continua fora do universo de lançamentos.
- Raw, SmackDown, Fórmula 1 e Super Bowl preservam a exceção de acompanhamento: backlog histórico continua não assistido, mas não cria pendência atual quando a fronteira efetivamente exibida já foi acompanhada.
- O retorno para Home usa snapshot/cache recente e stale-while-revalidate: abrir uma série e voltar não desmonta a Home, não mostra novamente `Sincronizando Home...` e não repete o RPC canônico enquanto o estado ainda está fresco.

### Scroll horizontal local em detalhes
- A r255 deixava o observer de trilhos expirar depois de aproximadamente cinco segundos; detalhes criados mais tarde perdiam a classe de overflow local.
- A r256 usa um observer permanente e estreito de `childList`, sem polling e sem reexecutar renderizadores.
- Episódios da temporada, temporadas, gráficos de temporadas/episódios, filmes e séries relacionados/semelhantes e atores/elenco recebem `.ct256-local-x` quando aparecem no DOM, inclusive após renderização assíncrona tardia.
- O documento continua com overflow horizontal global bloqueado; somente o componente largo recebe rolagem horizontal por mouse/toque e scrollbar própria.

### Descobrir / geometria visual
- A r255 já possuía markup de poster/título/metadados, mas o vídeo prova que estilos herdados comprimiam os cards carregados em faixas horizontais, tornando impossível identificar o conteúdo.
- A r256 preserva a autoridade de dados e os nove filtros da r255, mas protege explicitamente a geometria final: poster completo 2:3, área de título/metadados e largura fixa do trilho.
- O teste de regressão deixa de apenas contar elementos e passa a carregar o CSS final em Chromium e medir altura real do card, do poster e da área de metadados.

### Esportes / F1
- O vídeo confirma que a ordem da r255 está invertida em relação à regra aprovada.
- A r256 coloca o F1 Hub como primeiro bloco da tela. Somente abaixo dele aparecem os cinco filtros globais `Próximos`, `Ao vivo`, `Anteriores`, `Favoritos`, `Assistidos`, depois os filtros por modalidade e então o feed de eventos.
- A correção é estrutural no DOM e é reaplicada após repaints de filtros; não depende de `position`, margem ou deslocamento visual.

### Perfil / recolhimento único
- O botão já existente `Recolher/Expandir` do painel `Estatísticas` passa a controlar também o painel `Esportes assistidos`.
- Estatísticas de filmes/séries e estatísticas esportivas se comportam como uma única seção lógica sem alterar os valores canônicos de 48 eventos e 6.300 minutos (105h00).

### Navegação / cache / validação
- Home, Descobrir, Esportes e Perfil preservam snapshots recentes do DOM para retorno imediato entre telas. Mudanças de dados invalidam os snapshots; atualização vencida acontece em segundo plano sem apagar conteúdo pronto.
- Web atualizada para `1.0.47 / r256-official-1.0.47`; Android permanece `1.0.20 / versionCode 10062`.
- Build oficial: `apps/web/build-r256-official.mjs`; runtime: `apps/web/runtime-r256-video-ground-truth-scroll-cache.js`.
- `test-r256-algorithms.mjs` cobre Lioness/Stuart com `is_caught_up` contraditório, série realmente atrasada e backlog histórico de Raw/SmackDown.
- `test-r256-browser.mjs` mede os cards do Descobrir, exige F1 fisicamente antes dos filtros, recolhimento único no Perfil, retorno Home sem segundo RPC e cria episódios/gráfico/relacionados/elenco somente após 5,3 segundos para provar que o scroll local continua ativo.
- `scripts/test-r256-exact-bundle-browser.mjs` carrega o `app-v256.js` final, captura `error`/`unhandledrejection` e exige aplicação não vazia e observer r256 ativo.
- `verify.yml` exige build, regras, algoritmos, Chromium guiado pelo vídeo, identidade final, Android inalterado e `production_smoke` público da 1.0.47/r256 após merge em `main`.

## 1.0.46 — 2026-09-11 — Web r255

### Descobrir / cards e Watchlist completa
- O vídeo posterior à r254 comprovou que as abas do Descobrir mudavam, mas o conteúdo permanecia visualmente quebrado: poucos itens, blocos comprimidos de texto, sem poster e sem a composição aprovada dos cards.
- A r255 torna o Descobrir a prioridade desta release e passa a renderizar os resultados com card explícito contendo poster 2:3, título, ano, até três gêneros e nota, com trilho horizontal local.
- Permanecem nove abas: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`.
- `Da sua Watchlist` deixa de depender do dashboard resumido e passa a consultar `cinetracker_watchlist_full_v119`, usando a Watchlist integral do usuário.
- A janela de `shown_recommendations` continua protegendo recomendações pessoais, mas deixa de eliminar resultados das abas públicas do Descobrir.
- Ao trocar de aba, o conteúdo anterior permanece visível até o novo resultado estar pronto; respostas atrasadas são descartadas e apenas a geração mais recente pode substituir o DOM.

### Home / Em dia / Continue assistindo
- `Em dia` volta a ser preservado como bucket separado. Uma série não pode ser empurrada para `Continue assistindo` apenas porque a fronteira assistida recuperada por uma camada secundária está incompleta.
- O payload canônico continua sendo a primeira autoridade; uma série só sai de `Em dia` quando a auditoria viva comprova que `last_episode_to_air` avançou além do último episódio realmente acompanhado.
- Raw, SmackDown, Fórmula 1 e Super Bowl continuam ignorando backlog histórico e nunca usam `next_episode_to_air` como pendência atual.
- Lioness, Stuart e demais séries normais continuam retornando a `Continue assistindo` quando existe episódio realmente exibido posterior à fronteira assistida.

### Home / filmes ricos
- Cards de filmes na Home passam a exibir poster, nome, ano, gêneros, nota e duração.
- Metadados ausentes são hidratados pelo TMDB de forma assíncrona, sem bloquear o primeiro paint nem desmontar a geometria do card.

### Esportes / F1
- A navegação de Esportes passa a ter cinco filtros públicos: `Próximos`, `Ao vivo`, `Anteriores`, `Favoritos` e `Assistidos`.
- O visual volta ao padrão escuro/azulado do CineTracker; os filtros ficam acima do F1 Hub e deixam de usar a aparência cinza regressiva observada no vídeo.
- Eventos assistidos continuam vindo do `watch_history` canônico de `cinetracker_sports_payload_v1`; marcar/desmarcar usa `cinetracker_sport_mark_watched_v1` e favoritos usam `cinetracker_sport_toggle_favorite_v1`.
- O F1 Hub fica abaixo dos filtros esportivos e passa a expor exatamente `Visão geral`, `Calendário`, `Classificações`, `Pilotos`, `Equipes` e `Circuitos`, no mesmo padrão escuro/azulado.

### Perfil / estatísticas esportivas
- O Perfil não é redesenhado.
- A atualização esportiva deixa de depender de um painel específico e passa a localizar os cards de estatística já renderizados, atualizando contagem e tempo pela resposta de `cinetracker_sport_stats_v1`.
- A fonte canônica confirmada contém 48 eventos assistidos e 6.300 minutos, equivalentes a 105h00.

### Scroll / build / validação
- Overflow horizontal global continua bloqueado; temporadas, gráficos, relacionados/semelhantes, Descobrir e F1 mantêm scroll horizontal apenas dentro do próprio componente.
- Web atualizada para `1.0.46 / r255-official-1.0.46`; Android permanece `1.0.20 / versionCode 10062`.
- Build oficial: `apps/web/build-r255-official.mjs`; runtime: `apps/web/runtime-r255-discover-cards-home-sports-profile.js`.
- `test-r255-browser.mjs` exige posters reais no Descobrir, Watchlist completa, abas públicas povoadas, `Em dia` preservado, cinco filtros esportivos, seis abas F1 corretas e Perfil em 48/105h.
- `scripts/test-r255-exact-bundle-browser.mjs` carrega o `app-v255.js` final inteiro e falha em qualquer `error`, `unhandledrejection` ou app vazio.
- `verify.yml` exige build, regras, algoritmos, Chromium guiado pelo vídeo, bundle final, Android inalterado e `production_smoke` da 1.0.46/r255 após merge em `main`.

## 1.0.45 — 2026-09-11 — Web r254

### Ground truth do vídeo / causa raiz
- O vídeo posterior à r253 passou a ser a regressão principal desta release. Ele comprovou quatro falhas que a suíte anterior não cobria: ausência de scroll horizontal em conteúdos criados depois da navegação, Home com fronteira de episódios desatualizada, Descobrir apagando o conteúdo e ficando em `Carregando títulos...`, e F1 Hub sendo inserido antes da sidebar no grid externo de Esportes.
- A r254 não importa a composição r253. O build volta diretamente à r252, último baseline visual alinhado, e injeta uma autoridade final específica para as falhas observadas.
- Os observers permanentes r239 e r247 e os wrappers r252 que reclassificavam Home pela idade são removidos do bundle final. A r254 mantém somente um observer estreito de `childList` para marcar trilhos horizontais e garantir a posição interna do F1 Hub; ele não reexecuta renderizadores.

### Home / Lioness / Stuart / Raw / SmackDown
- `renderHome` pinta primeiro `cinetracker_home_live_v0997_r3`, sem bloquear a tela, e em seguida audita em paralelo séries normais iniciadas contra o TMDB atual.
- Para séries normais, somente `last_episode_to_air` é considerado episódio realmente exibido. Se essa fronteira avançou além do último episódio assistido, a série muda para `Assistir a seguir`; isso cobre Lioness e Stuart mesmo quando o metadata persistido no banco está atrasado.
- `next_episode_to_air` nunca é tratado como episódio já lançado. Essa diferença corrige o caso real do SmackDown em que o backend via S28E37 datado para o dia atual, embora o TMDB ainda o classificasse como próximo episódio, enquanto S28E36 já estava assistido.
- Raw, SmackDown, Fórmula 1 e Super Bowl preservam semântica de acompanhamento: backlog histórico continua não visto, mas não força `Assistir a seguir`. Uma decisão canônica `Em dia` não é anulada por totais históricos.
- Séries normais realmente atrasadas continuam em `Juntando Poeira`/`Assistir a seguir`; a correção não marca episódios antigos artificialmente como vistos.

### Descobrir
- Permanecem as nove abas: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`.
- O dashboard de estados pessoais/exclusões deixa de ser recarregado a cada troca de aba; ele é obtido uma vez e reutilizado em memória.
- Ao clicar em outra aba, o conteúdo atual permanece visível enquanto a nova resposta é carregada. O DOM só é substituído quando o novo resultado está pronto, evitando a tela vazia/`Carregando títulos...` vista no vídeo.
- Cada carga conserva geração própria e descarta respostas atrasadas. Consultas de usuário/TMDB passam a ter limites de tempo para não deixar a tela bloqueada indefinidamente.
- `Pra você` preserva os três blocos, antirrepetição, filtros pessoais e `shown_recommendations`; gravação do histórico de recomendações não bloqueia o paint.

### Esportes / F1
- A tela mantém somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, usando `cinetracker_sports_payload_v1`; Assistidos usa o `watch_history` canônico completo e marcar/desmarcar continua em `cinetracker_sport_mark_watched_v1`.
- A causa estrutural do vídeo foi localizada no F1 r248: `sportRoot()` podia resolver o `.app[data-page="sports"]` externo e `renderF1()` inseria o Hub como primeiro filho, antes da sidebar. Como `.app` é um grid de duas colunas, isso deslocava sidebar/main e tornava Esportes praticamente inutilizável.
- A r254 deixa o componente F1 aprovado ser criado, mas o reloca imediatamente para dentro de `[data-ct254-sports]`, antes do próximo paint. Reexecuções internas do próprio Hub encontram a mesma instância já no local correto.
- O card-resumo antigo de quantidade/status não é recriado pela autoridade r254.

### Perfil / dados vivos
- O Perfil mantém a composição visual aprovada.
- `cinetracker_profile_payload_v0997_r2` atualiza o backing data e `cinetracker_sport_stats_v1` atualiza somente os valores do painel `Esportes assistidos`.
- A investigação no backend confirmou 48 registros canônicos em `user_sport_watch_history`; a r254 continua usando essa fonte para evitar a contagem obsoleta mostrada anteriormente.

### Scroll horizontal local
- A r252 havia neutralizado os observers r248 que originalmente marcavam trilhos criados após navegação; por isso temporada/gráfico aberto posteriormente podia não receber nenhuma classe de overflow local.
- A r254 reintroduz apenas a parte segura: um observer de `childList` identifica temporadas, relacionados/semelhantes, gráficos de episódio, trilhos de Descobrir e F1 assim que entram no DOM e aplica `.ct254-xrail`.
- O documento inteiro continua com overflow horizontal bloqueado. Somente o componente largo recebe `overflow-x:auto`, scrollbar local, `-webkit-overflow-scrolling:touch` e `touch-action:pan-x pan-y`.

### Build / validação
- Web atualizada para `1.0.45 / r254-official-1.0.45`; Android permanece `1.0.20 / versionCode 10062`.
- `package.json`, `apps/web/package.json`, `README.md` e `VERSIONS.md` foram alinhados à r254.
- Build oficial: `apps/web/build-r254-official.mjs`; runtime: `apps/web/runtime-r254-video-ground-truth.js`.
- `test-r254-algorithms.mjs` cobre Raw/SmackDown, backlog, 48 assistidos e filtros de recomendação.
- `test-r254-browser.mjs` reproduz Lioness/Stuart com metadata persistido atrasado, SmackDown com `next_episode_to_air` futuro, F1 tentando nascer antes da sidebar, Descobrir com resposta lenta/race e temporadas/gráficos inseridos somente depois da navegação.
- `scripts/test-r254-exact-bundle-browser.mjs` carrega o `app-v254.js` final inteiro, captura `error`/`unhandledrejection` e exige conteúdo real no `#app`.
- `verify.yml` exige build, regras, Chromium guiado pelo vídeo, boot do bundle final, identidade final, Android inalterado e `production_smoke` 1.0.45/r254 após merge em `main`.

## 1.0.44 — 2026-09-11 — Web r253

### Causa raiz / autoridade única
- O vídeo posterior à r252 comprovou que a tela de Esportes estava sendo produzida por duas autoridades ao mesmo tempo: as quatro abas r248 apareciam junto da navegação antiga (`Hoje`, `Ao vivo`, `Calendário` etc.). A r253 substitui esse empilhamento por um único renderer final.
- O `MutationObserver` permanente da r239, que reaplicava autoridades antigas após mutações do `#app`, é removido do bundle r253. Isso encerra a troca visual de “versão certa para versão antiga” após o paint.
- Os wrappers da r252 que reclassificavam Home pelo tempo desde o último episódio são neutralizados. A Home volta a usar o estado canônico do payload vivo e uma normalização apenas para contradições comprováveis.

### Home / Histórico / Juntando Poeira
- `renderHome` busca `cinetracker_home_live_v0997_r3` novamente ao entrar na tela e preserva o renderer visual aprovado.
- Uma série `is_caught_up`, sem episódios realmente faltantes ou já no último episódio liberado não entra em `Juntando Poeira` apenas porque a última reprodução ocorreu há mais de 30 dias.
- Séries encerradas e em dia ficam em `Concluídas`; séries em dia aguardando nova temporada permanecem em `Em dia`.
- `Juntando Poeira` fica reservado a séries iniciadas que possuem pendência real e continuam atrasadas.
- Raw, SmackDown, Fórmula 1 e Super Bowl continuam tratando backlog histórico como histórico, sem transformar episódios antigos em pendência atual nem marcá-los artificialmente como vistos.
- `history_episodes` e `history_movies` vêm do payload vivo, preservando registros recentes posteriores aos itens que apareciam como último histórico na UI obsoleta.

### Esportes / F1
- Existe um único conjunto público de abas: `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; seletores r253 próprios impedem handlers herdados de reabrirem a navegação antiga.
- `Próximos` mostra somente eventos futuros do dia atual; `Anteriores`, somente as 72 horas anteriores; `Favoritos`, somente eventos ligados aos favoritos; `Assistidos`, o `watch_history` canônico completo retornado por `cinetracker_sports_payload_v1`.
- Contagem e tempo assistido usam `cinetracker_sport_stats_v1`, eliminando números congelados como 43 quando o backend já possui 48 registros.
- Marcar/desmarcar assistido usa `cinetracker_sport_mark_watched_v1` e força recarga do payload canônico depois da gravação.
- O F1 Hub continua sendo a implementação escura r248 com seis áreas e estado persistente de minimizar/expandir; a r253 garante uma única instância após cada paint de Esportes.

### Descobrir
- A tela passa a ter um único renderer r253 com seletores exclusivos, sem reutilizar os handlers legados `data-discover-tab` que chamavam o render global e deixavam o conteúdo preso em `Carregando títulos...`.
- Permanecem nove abas: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`.
- A aba ativa muda imediatamente; cada carregamento possui geração própria e respostas de uma aba anterior são descartadas antes de tocar no DOM.
- Pools TMDB passam a consultar uma página por fonte em paralelo no primeiro carregamento, reduzindo a espera que ocorria com múltiplas páginas por categoria.
- `Pra você` mantém cards nativos e exatamente três blocos: `Indicação do Dia`, `Da sua Watchlist` e `100% Novos`.
- Permanecem TMDB >= 7,5, ano > 1990, exclusão de Drama/Documentário puro, vistos, em andamento, `NotInterested`, WWE e Watchlist fora do bloco próprio, além da janela de sete dias de `shown_recommendations`.
- `Trocar` utiliza o mesmo pipeline r253 e não recarrega o shell nem a página inteira.

### Perfil / dados atuais
- O Perfil não é redesenhado. A ordem física e a composição aprovadas da r238 permanecem como produtor visual.
- Depois do paint, `cinetracker_profile_payload_v0997_r2` atualiza o backing data das estatísticas existentes sem mudar sua ordem.
- O painel `Esportes assistidos` recebe somente os valores atuais de `cinetracker_sport_stats_v1`, preservando o layout e corrigindo contagem/tempo obsoletos.

### Build / validação
- Web atualizada para `1.0.44 / r253-official-1.0.44`; Android permanece `1.0.20 / versionCode 10062`.
- `package.json` raiz e `apps/web/package.json` alinhados em `1.0.44`.
- Build oficial: `apps/web/build-r253-official.mjs`; runtime: `apps/web/runtime-r253-single-authority-live-data.js`.
- `test-r253.mjs` bloqueia retorno do observer r239, dos classificadores Home r252 e dos seletores antigos nas autoridades r253.
- `test-r253-algorithms.mjs` cobre série em dia antiga que não deve juntar poeira, pendência real que deve permanecer em poeira, backlog legado, janela esportiva de 72h, 48 itens no histórico canônico e filtros de recomendação.
- `test-r253-browser.mjs` valida em Chromium quatro abas esportivas sem a navegação antiga, uma instância do F1 Hub, 48 assistidos, nove abas do Descobrir clicáveis, proteção contra corrida assíncrona, Perfil com ordem preservada e valor esportivo atualizado, Home sem poeira falsa e Histórico recente posterior a Black Mirror.
- `verify.yml` exige build, testes estáticos, algoritmos, Chromium, identidade final do bundle, Android inalterado e `production_smoke` da r253 após merge em `main`.

## 1.0.43 — 2026-09-11 — Web r252

### Recuperação da interface
- A r252 remove a r251 como autoridade visual e volta a construir diretamente sobre a `r248-official-1.0.39`, último baseline com a estrutura aprovada antes da reconstrução de Home, Descobrir, F1 Hub e Perfil.
- As camadas `build-r249.mjs`, `build-r250.mjs` e `build-r251.mjs` não são importadas pela cadeia r252; regras novas são aplicadas por `runtime-r252-source-ui-recovery.js` sem substituir os renderizadores principais de Home, Esportes ou Perfil.
- O Histórico escondido de filmes/séries, tamanhos e proporções dos cards, composição escura do F1 Hub e ordem estabelecida do Perfil voltam a ser requisitos explícitos de regressão.
- Os dois `MutationObserver` permanentes herdados da r248 são neutralizados no bundle final para impedir reconstruções concorrentes, custo contínuo de DOM e lentidão entre abas.

### Home / séries
- Série nunca iniciada permanece em `Não iniciada`.
- Série iniciada sem episódio assistido há 30 dias entra em `Juntando Poeira`.
- Episódio recente liberado e não visto tem prioridade sobre a regra de 30 dias e coloca a série em `Continue assistindo`.
- WWE Raw, WWE SmackDown, Fórmula 1 e Super Bowl tratam backlog antigo como histórico legado: episódios antigos continuam não vistos no banco, mas não tiram a mídia de `Em dia` quando todos os lançamentos atuais foram assistidos.
- Nenhum episódio antigo é marcado automaticamente como visto para produzir o estado `Em dia`.
- A ponte esportiva da Home deixa de usar `cinetracker_sports_events_v0997` e passa a receber eventos pelo payload canônico `cinetracker_sports_payload_v1`, com cache curto para evitar consultas repetidas durante navegação.

### Descobrir
- Cards e trilhos voltam a usar `mediaCard()` e a geometria nativa da interface anterior; a r252 não introduz classes `ct251-*` de card/layout.
- Permanecem nove sub-abas: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`.
- `Pra você` volta a ter exatamente três blocos: `Indicação do Dia`, `Da sua Watchlist` e `100% Novos`.
- Recomendações exigem TMDB >= 7,5 e ano > 1990; removem Drama/Documentário puro, vistos, em andamento, `NotInterested`, WWE e Watchlist fora do bloco próprio; obras de gênero misto continuam elegíveis.
- `shown_recommendations` é lido junto do histórico local para bloquear repetições por sete dias em todos os três blocos.
- `Trocar` substitui a indicação elegível sem reload global e sem reconstruir o shell da página.
- `100% Novos` usa a janela real dos últimos 30 dias também para Anime, em vez de recorrer a um pool genérico antigo.

### Navegação / Esportes / F1 / Perfil / Configurações
- Esportes preserva somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, com `Próximos` restrito ao dia atual e `Anteriores` à janela anterior de 72 horas; o feed canônico é `cinetracker_sports_payload_v1`.
- F1 Hub volta ao padrão visual escuro da r248, mantém seis áreas e preserva minimizar/expandir como decisão persistida pelo usuário, sem autoexpansão.
- Perfil volta à composição e ordem estabelecidas na autoridade r248, sem a reorganização criada pela r251.
- Configurações deixa de bloquear a navegação com `Carregando Configurações...`: a estrutura estável é renderizada imediatamente e apenas o nome opcional do perfil é preenchido em segundo plano.
- Overflow horizontal global continua bloqueado; temporadas, gráficos, trilhos e demais conteúdos largos mantêm rolagem horizontal somente no próprio componente.

### Build / validação
- Web atualizada para `1.0.43 / r252-official-1.0.43`; Android permanece `1.0.20 / versionCode 10062`.
- `package.json` raiz e `apps/web/package.json` permanecem alinhados em `1.0.43`.
- Build oficial: `apps/web/build-r252-official.mjs`; runtime de correções: `apps/web/runtime-r252-source-ui-recovery.js`.
- `test-r252.mjs` exige a source UI r248, Histórico, ordem estabelecida do Perfil, F1 Hub r248, ausência da autoridade r251 e ausência do RPC esportivo aposentado.
- `test-r252-algorithms.mjs` cobre Não iniciada, 30 dias/Juntando Poeira, prioridade de episódio novo, Raw/F1/SmackDown/Super Bowl sem backlog artificial e filtros rigorosos do Descobrir.
- `test-r252-browser.mjs` valida nove sub-abas, três blocos, cards nativos, exclusões, antirrepetição, Trocar sem reload e Configurações sem loading bloqueante em Chromium.
- `verify.yml` passa a promover somente a r252 e o smoke público do `main` exige `release.json` 1.0.43/r252, assets `app-v252`, autoridade estrutural r248 e DOM renderizado.

## 1.0.42 — 2026-09-11 — Web r251

### Autoridade direta / Home
- Home, Descobrir, Esportes/F1 e Perfil passam a assumir os renderizadores ativos antes do `boot()`, removendo a dependência da reconciliação tardia que permitiu às r249/r250 passarem no CI sem refletir corretamente a tela real.
- A Home usa a fronteira efetivamente assistida: backlog histórico permanece preservado, mas só episódio liberado depois da fronteira atual volta para `Assistir a seguir`.
- A auditoria canônica de episódios roda de forma concorrente e repinta a Home assim que o estado atual é confirmado.
- F1 e Super Bowl usam uma ponte esportiva direta na Home: evento recente não assistido entra em `Assistir a seguir`, e o próximo evento real mantém a mídia em `Em dia`, sem inventar histórico legado.
- Cards de filmes mantêm a nota TMDB visível, inclusive nas listas da Home, com título, temporada/data e ação de visto em proporções consistentes.

### Descobrir / recomendações
- Recomendações exigem TMDB >= 7,5 e ano posterior a 1990, removem Drama/Documentário puro sem eliminar obras de gênero misto, vistos, em andamento, `NotInterested`, WWE e Watchlist fora do bloco próprio.
- As nove sub-abas — `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` — permanecem clicáveis sob a mesma autoridade, com Top 10 por streaming preservado.
- `Indicação do Dia`, `Da sua Watchlist` e `100% Novos` são blocos obrigatórios com antirrepetição; a janela de 7 dias vale para todos os itens exibidos nos três blocos, e `Trocar` substitui o item elegível sem reload global.
- A migration `20260911175655_r251_shown_recommendations.sql` cria `shown_recommendations` com RLS e sustenta a janela de 7 dias sem repetir recomendações já exibidas.
- A migration complementar `20260911192843_r251_shown_recommendations_policy_hardening.sql` remove privilégios desnecessários, restringe o acesso ao papel `authenticated` e usa `(select auth.uid())` nas policies para evitar avaliação por linha.

### Esportes / F1 / Perfil / layout
- Esportes mantém somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`: futuro de hoje, janela móvel anterior de 72 horas, entidades favoritas e histórico canônico de vistos, respectivamente.
- A carga usa `cinetracker_sports_payload_v1`, reaproveita a sincronização autenticada quando o feed está vazio e marca/desmarca via `cinetracker_sport_mark_watched_v1`; o bundle r251 não chama `cinetracker_sports_events_v0997`.
- O botão de visto possui microinteração de confirmação, e o F1 Hub mantém uma única instância, seis áreas e o estado persistido de minimizar/expandir sem autoexpansão herdada.
- Perfil possui um único bloco expansível de `Estatísticas`, incluindo Esportes; Home, Perfil, Configurações e sidebar recebem polish de proporção e espaçamento.
- Overflow horizontal global permanece bloqueado; temporadas, gráficos, trilhos, Descobrir e F1 usam scroll horizontal somente no componente local.

### Build / validação
- Web atualizada para `1.0.42 / r251-official-1.0.42`; Android permanece `1.0.20 / versionCode 10062`.
- Os manifests `package.json` da raiz e de `apps/web` ficam alinhados em `1.0.42`.
- Build oficial: `apps/web/build-r251-official.mjs`; runtime final: `apps/web/runtime-r251-ground-truth.js`.
- Pipeline preserva a regressão r250 e valida invariantes, lógica, Chromium ground-truth — incluindo as nove sub-abas, histórico semanal da Watchlist e a ponte F1/Super Bowl — e identidade final do bundle r251 antes da promoção ao `main`.

## 1.0.41 — 2026-09-11 — Web r250

### Autoridade determinística / Home
- A r250 desliga os disparos recorrentes da autoridade final r249 e assume como único reconciliador final das áreas corrigidas.
- A fronteira de acompanhamento passa a considerar somente posições efetivamente vistas. Buracos históricos anteriores à fronteira permanecem não assistidos e ficam preservados para consumo futuro, mas deixam de inflar `Faltam` ou empurrar Raw/SmackDown para trás.
- Episódios já lançados depois da fronteira sempre vencem e levam a série para `Assistir a seguir`; a regra é genérica para Lioness, Stuart e demais séries iniciadas.
- Cards de Home recebem avaliação TMDB em nota + percentual e proporções alinhadas aos cards de Descobrir.

### Descobrir
- Clique de aba e tipo passa a ter ownership explícito, geração própria e bloqueio de resposta assíncrona atrasada.
- O filtro final elimina itens vistos, em andamento, Watchlist e `NotInterested`, reaplicando o estado pessoal mesmo quando o renderer herdado devolve dados sem a filtragem esperada.
- Slots `Sem item elegível` deixam de ocupar cards gigantes; trilhos e cards permanecem estáveis durante a troca de conteúdo.

### Esportes / Supabase / F1
- A Web r250 usa diretamente `cinetracker_sports_payload_v1` para carregar eventos e `cinetracker_sport_mark_watched_v1` para marcar/desmarcar assistido.
- As únicas abas públicas são `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; `Próximos` é futuro de hoje, `Anteriores` é D-1 a D-3, favoritos usam `has_favorite` e assistidos unem eventos atuais ao histórico canônico.
- A função `cinetracker_sports_events_v0997` foi restaurada no backend somente como compatibilidade para bundles antigos/cacheados, eliminando o erro de schema-cache sem recolocar esse RPC no bundle r250.
- O F1 Hub é deduplicado para uma única instância, preserva as seis áreas existentes e respeita minimizar/expandir persistido pelo usuário sem autoexpansão.

### Perfil / rolagem / validação
- Estatísticas esportivas são movidas para o mesmo grid do grupo `Estatísticas`; o painel separado é removido e todo o conjunto passa a seguir o mesmo estado de minimização.
- A página mantém rolagem vertical, sem overflow horizontal global; temporadas, gráficos, relacionados/semelhantes, Descobrir, F1 e demais áreas largas usam scroll horizontal local.
- Web atualizada para `1.0.41 / r250-official-1.0.41`; Android permanece `1.0.20 / versionCode 10062`.
- Build oficial: `apps/web/build-r250-official.mjs`; runtime final: `apps/web/runtime-r250-source-aligned.js`.
- Chromium cobre backlog histórico, episódio novo, corrida de Descobrir, quatro filtros esportivos, RPC de assistido, F1 duplicado/minimizado, Perfil unificado e overflow local/global.

## 1.0.40 — 2026-09-11 — Web r249

### Autoridade única / estabilidade
- A camada final passa a operar como **single authority** de UI, orientada por eventos e reconciliações limitadas, em vez de manter observadores perpétuos disputando o DOM.
- Os `MutationObserver` finais da r248 para current-ui e state-binding são neutralizados no bundle r249; seus hooks úteis permanecem, mas não podem voltar a reescrever a tela indefinidamente.
- Testes de Chromium introduzem mutações atrasadas após 2 segundos para provar que a autoridade atual recupera estado correto sem polling ou guerra contínua de DOM.

### Home / episódios
- Preservada a fronteira baseada no último episódio efetivamente acompanhado: backlog histórico continua não assistido, mas não remove Raw, SmackDown ou outras séries longas do estado correto `Em dia`.
- Quando há backlog antigo e também episódio novo ao mesmo tempo, qualquer episódio liberado depois da fronteira acompanhada tem prioridade e força `Assistir a seguir`.
- Lioness, Stuart e demais séries iniciadas continuam usando a mesma regra genérica, sem hardcode de título.
- A ponte F1/Super Bowl deixa de chamar o RPC inexistente `cinetracker_sports_events_v0997` e passa a reutilizar somente o payload/estado esportivo canônico já carregado pela aplicação.

### Descobrir
- Cada carregamento assíncrono recebe geração + aba + tipo; apenas a requisição mais recente que ainda pertence à aba/tipo atual pode executar `paintDiscover`.
- Respostas atrasadas são descartadas antes de tocar no conteúdo, encerrando a regressão em que uma aba antiga voltava por cima da atual.
- Permanecem as exclusões pessoais de visto, em andamento, Watchlist e `NotInterested`, metadados/geometry estáveis e a janela estrita de 30 dias de `Novidades`.

### Esportes / F1
- A navegação permanece restrita a `Próximos`, `Anteriores`, `Favoritos` e `Assistidos` sob um único dono de estado.
- `Próximos`: apenas eventos futuros do dia atual; `Anteriores`: D-1 a D-3; `Favoritos`: favoritos; `Assistidos`: vistos.
- `Eventos/Agenda` é removido também quando reaparece por renderização atrasada.
- O bundle final não contém mais `cinetracker_sports_events_v0997`.
- O F1 Hub preserva as seis áreas e o estado minimizar/expandir como decisão persistente do usuário; reconciliação herdada não pode reabri-lo.

### Perfil / rolagem
- O Perfil permanece com um único grupo `Estatísticas`; containers separados de estatísticas esportivas que reapareçam são descartados pela autoridade r249.
- A página preserva rolagem vertical e bloqueia overflow horizontal global; temporadas, relacionados/semelhantes, gráficos, Descobrir, F1 e outros conteúdos largos usam somente scroll horizontal local.

### Build / validação
- Web atualizada para `1.0.40 / r249-official-1.0.40`.
- Android permanece `1.0.20 / versionCode 10062`, sem alteração nesta release.
- Build oficial: `apps/web/build-r249-official.mjs`; runtime final: `apps/web/runtime-r249-single-authority.js`.
- Pipeline preserva regressões r239→r248 e adiciona `test-r249.mjs`, `test-r249-authority-browser.mjs` e `test-r249-exact-bundle-browser.mjs`.
- Smoke público do `main` exige `release.json` 1.0.40/r249, assets `app-v249`, markers da single authority, ausência do RPC removido e DOM não vazio em Chromium.

## 1.0.39 — 2026-09-11 — Web r248

### Home / episódios
- Auditoria canônica ampliada para 8 workers e lote prioritário de 40 séries, com liberação de metadados secundários em 250 ms.
- A regra de acompanhamento passa a separar **episódio novo à frente do ponto atual** de buracos históricos não assistidos: episódios antigos continuam não vistos, mas não removem uma série realmente em dia do estado correto.
- Em cenários mistos, com backlog histórico e episódio novo ao mesmo tempo, qualquer episódio liberado depois da fronteira acompanhada tem prioridade e força `Assistir a seguir`.
- Raw, SmackDown e demais séries longas podem ficar `Em dia` sem marcar automaticamente episódios antigos que o usuário pretende assistir posteriormente.
- Lioness, Stuart e demais séries iniciadas continuam usando a mesma regra genérica de episódio liberado/não visto, sem hardcode por título.
- F1 e Super Bowl ganham ponte seriada baseada somente em eventos esportivos reais: evento liberado/não visto aparece como novo; próximo evento real mantém o acompanhamento atual sem inventar histórico ou resultado.

### Descobrir
- Removida a restauração de snapshots antigos de HTML e a troca de abas deixa de reconstruir o shell inteiro; somente o conteúdo da aba é atualizado, com sequência que ignora respostas atrasadas.
- Mantidas as exclusões pessoais canônicas do `Pra você` e demais faixas, evitando títulos já vistos, em andamento, na Watchlist e marcados `NotInterested`.
- Cards do Descobrir preservam metadados de ano e até três gêneros, com geometria estável durante hidratação.
- `Novidades` preserva a regra estrita de lançamentos dos últimos 30 dias.

### Esportes
- A navegação final fica restrita a `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`.
- `Próximos`: somente eventos futuros do dia atual.
- `Anteriores`: somente D-1, D-2 e D-3.
- `Favoritos`: somente jogos ligados aos favoritos.
- `Assistidos`: somente jogos vistos pelo usuário.
- Controles `Eventos/Agenda` são removidos da interface.
- O botão `Assistido` mantém feedback por animação no clique e o binding final usa o estado atual de Esportes sem reintroduzir APIs removidas.

### F1 Hub
- Hub consolidado com dados Jolpica da temporada atual.
- Seis áreas: `Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores` e `Último GP`.
- Horários formatados para `America/Sao_Paulo`, contagem regressiva do próximo GP, calendário, classificações, resultado da última corrida e grid/qualificação.
- Estado minimizar/expandir persistente em `localStorage`, sem expansão automática causada por reconciliação antiga.

### Perfil
- `Estatísticas de esporte` é incorporado ao grupo único `Estatísticas`.
- Ordem e composição permanecem estáveis entre repaints; não existem dois grupos concorrentes.

### Rolagem / layout
- `html`, `body` e shell mantêm overflow horizontal global bloqueado e rolagem vertical preservada.
- Temporadas, relacionados/semelhantes, gráficos, trilhos de Descobrir/F1 e demais áreas largas recebem scrollbar horizontal local visível.
- O gesto local preserva pan horizontal sem impedir o movimento vertical da página.

### Build / validação
- Web atualizada para `1.0.39 / r248-official-1.0.39`.
- Android permanece `1.0.20 / versionCode 10062`, sem alteração nesta release.
- Build oficial: `apps/web/build-r248-official.mjs`.
- Runtime final: `runtime-r248-current-following-ui.js` + `runtime-r248-state-binding.js` + `runtime-r248-following-sports-series.js` + `runtime-r248-discover-final.js`.
- Chromium completo cobre backlog histórico, episódio novo posterior, cenário misto, F1/Super Bowl seriados, Descobrir sem render global, metadados dos cards, quatro abas esportivas, F1 persistente, Perfil único e trilhos locais.
- Boot exato do bundle: `scripts/test-r248-exact-bundle-browser.mjs`.
- Pipeline preserva regressões r239→r247, valida r248 e exige smoke público após promoção ao `main`.

## 1.0.38 — 2026-09-11 — Web r247

### Correção crítica de boot
- Reproduzida a tela preta da r246 carregando o bundle final `app-v246.js` inteiro em Chromium: `#app` permanecia vazio e o navegador registrava `ReferenceError: sportsTabs is not defined` antes de `boot()`.
- A causa era a injeção de `runtime-r240-sports-four-tabs.js`, que atribuía diretamente `sportsTabs = ...` em modo estrito embora esse identificador já não existisse no baseline atual.
- A r247 volta a compor a release sobre a r245 estável e remove completamente essa injeção incompatível.
- A autoridade esportiva final passa a usar somente hooks existentes no runtime atual, protegidos por `typeof sportsPayload === 'function'` e `typeof sportsFiltered === 'function'`; nenhuma função removida é criada por atribuição direta.

### Home e Descobrir
- Preservada a auditoria canônica da r245 com 6 workers, lote prioritário de 24 séries e liberação de metadados secundários de filmes em 500 ms.
- Mantida a regra genérica de episódio liberado e não assistido para séries acompanhadas/caught-up/manualmente em andamento.
- A regressão herdada continua cobrindo Lioness, Stuart e séries iniciadas genéricas retornando a `Assistir a seguir` quando há episódio pendente.
- Descobrir mantém as exclusões pessoais e a troca atômica da autoridade semântica r240, sem reintroduzir o runtime esportivo incompatível.
- Cards e trilhos permanecem estáveis durante hidratação assíncrona.

### Esportes e F1 Hub
- Mantidas somente as abas `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`.
- `Próximos` filtra somente eventos futuros do dia atual; `Anteriores`, os três dias anteriores; `Favoritos`, somente favoritos; `Assistidos`, o feed canônico legado.
- A ação `Eventos/Agenda` continua removida e o botão `Assistido` mantém animação de confirmação.
- O F1 Hub mantém seis abas (`Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores`, `Último GP`) e persiste minimizar/expandir entre repaints.

### Perfil e rolagem
- Estatísticas esportivas permanecem incorporadas ao grupo único `Estatísticas`.
- A página preserva rolagem vertical e bloqueia overflow horizontal global.
- Temporadas, títulos relacionados/semelhantes, gráficos e demais trilhos largos mantêm scrollbar horizontal local visível.

### Build e validação
- Web atualizada para `1.0.38 / r247`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Build oficial: `apps/web/build-r247.mjs`.
- Invariantes: `apps/web/test-r247.mjs`.
- Teste esportivo Chromium: `scripts/test-r247-sports-browser.mjs`.
- Novo teste obrigatório `scripts/test-r247-exact-bundle-browser.mjs` carrega o bundle final completo, captura `error`/`unhandledrejection` e falha se o app não renderizar conteúdo.
- O smoke de produção do `main` também abre `mycinetracker.vercel.app` em Chrome headless e exige DOM renderizado, não apenas presença de `release.json` e assets.

## 1.0.37 — 2026-09-10 — Web r246

### Home
- A autoridade canônica de episódios da r245 passa de 4 para 6 auditorias concorrentes e amplia o lote prioritário de 12 para 24 séries acompanhadas.
- O fallback que liberava metadados secundários de filmes cai de 1400 ms para 500 ms, reduzindo a espera sem bloquear a verificação de episódios.
- Entrada na Home, retorno de visibilidade e `pageshow` forçam nova auditoria; estados `Em dia`/`Concluída` não ficam congelados após a liberação de um episódio.
- Séries acompanhadas marcadas como caught-up ou manualmente em andamento entram na mesma regra genérica de episódio liberado e não assistido, sem hardcode por título; isso cobre também séries/eventos acompanhados como F1 e Super Bowl quando presentes no universo de séries do usuário.
- Cards com informação de episódio ainda em hidratação deixam de ser escondidos, evitando o atraso visual em branco.

### Descobrir
- Mantidas como autoridade de negócio as exclusões canônicas da r240 e as três seções reais de `Pra você` da r239.
- Geometria dos cards e trilhos passa a ser estável durante hidratação assíncrona, removendo transformações/animações concorrentes responsáveis por tremores e pulos.
- Trilhos do Descobrir recebem scroll horizontal próprio, preservando a página sem overflow lateral global.

### Esportes e F1 Hub
- Restabelecida a autoridade de quatro abas da r240: `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`.
- `Próximos` continua restrito aos eventos futuros do dia atual; `Anteriores`, aos três dias anteriores; `Favoritos`, somente aos favoritos; `Assistidos`, ao feed canônico de vistos.
- A ação `Eventos/Agenda` é removida dos cards; o botão `Assistido` permanece único e recebe animação de confirmação ao clique.
- O F1 Hub mantém exatamente seis abas (`Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores`, `Último GP`).
- O estado minimizar/expandir fica persistente e é reaplicado após repaints de Esportes, impedindo expansão automática.

### Perfil
- O painel separado `Estatísticas de esporte` é incorporado ao grid principal `Estatísticas`.
- Preservada a ordem 4+4+2 da autoridade r239 para mídia; estatísticas esportivas passam a coexistir no mesmo grupo sem trocar de posição entre repaints.

### Rolagem e layout
- A página mantém rolagem vertical e bloqueia overflow horizontal global.
- Temporadas, títulos relacionados/semelhantes, gráficos de episódios e demais trilhos largos de detalhes/Descobrir recebem scrollbar horizontal visível e interação local por mouse/toque.
- O gesto local aceita pan horizontal sem bloquear o pan vertical da página.

### Build e validação
- Web atualizada para `1.0.37 / r246`; Android permanece `1.0.20 / versionCode 10062` sem alterações.
- Build oficial: `apps/web/build-r246.mjs`.
- Invariantes: `apps/web/test-r246.mjs`.
- Teste comportamental Chromium: `scripts/test-r246-complete-ui-browser.mjs`.
- `verify.yml` exige regressões herdadas, bundle final r246, Chromium e smoke de produção antes de considerar a release válida.

## 1.0.26 — 2026-09-09 — Web r234

### Regressões reais corrigidas
- A r234 deixa de usar a r233 como autoridade visual genérica e volta ao último baseline comprovado de cada área.
- Descobrir é limitado às seções que realmente precisavam de correção; Top 10 permanece explicitamente fora do alcance da r234.
- Esportes volta ao layout canônico r123 em vez de reconstruir uma nova zona visual de ações.
- Home deixa de aguardar validação remota para pintar a tela e passa a revalidar episódios em background.
- Watchlist e Perfil passam a usar o mesmo universo lógico completo para contagem e modal.

### Home / episódios
- O estado já conhecido do payload é aplicado imediatamente antes do paint.
- Séries com episódio liberado pendente são movidas de `Em dia` para `Assistir a seguir` assim que o payload já comprova atraso.
- A revalidação TMDB é executada em background com uma consulta de série, sem bloquear `renderHome`.
- Neutralizado o hidratador legado r172 que fazia a cascata temporada → série e contribuía para carregamentos de dezenas de segundos.
- Metadados do último episódio lançado, contagem liberada e `is_caught_up` são atualizados sem travar a primeira renderização.

### Descobrir
- Mantido o baseline visual r232/r229 que já tinha Top 10 aprovado.
- A autoridade r234 só agenda pós-processamento para `Indicação do dia`, `Da sua Watchlist` e `100% novos`.
- Top 10 não recebe normalização genérica da r234.
- A correção continua vinculada ao ciclo real de renderização, sem novo polling contínuo.

### Esportes
- Reutilizado o canonicalizador visual r123 para manter o padrão de posição, dimensões e composição dos botões.
- A execução é agendada apenas após `paintSports`/`renderSports`.
- Não é criado novo layout concorrente sobre os cards esportivos.

### Watchlist / Perfil
- Estatística e modal usam o mesmo retorno integral de `cinetracker_watchlist_full_v119`.
- Mantidos registros importados ainda sem TMDB, evitando que o modal mostre apenas o subconjunto já enriquecido.
- Linhas locais sem poster recebem placeholder com geometria estável para não quebrar altura/alinhamento.
- Enriquecimento de capas é disparado progressivamente para itens visíveis, em vez de bloquear a abertura do modal com centenas de consultas.
- Navegação para detalhes continua disponível assim que o TMDB é resolvido.

### Backend / enriquecimento
- `ct-enrich-media-user` passa a tentar resolver séries importadas por TVDB → TMDB antes do fallback por título.
- A resposta da Edge Function passa a informar `resolved_external` para contabilizar resoluções por identificador externo.
- Edge Function publicada em produção como versão 7.

### Build / validação
- Web atualizada para `1.0.26`.
- Build oficial: `apps/web/build-r234.mjs`.
- Teste de regressão: `apps/web/test-r234.mjs`.
- `verify.yml` atualizado para executar a validação da Web 1.0.26/r234 no pipeline corrente.

## 1.0.25 — 2026-09-09 — Web r233

### Estabilidade de runtime
- Criada a autoridade final `r233-official-1.0.25` sobre a Web 1.0.24/r232.
- Eliminado o polling esportivo concorrente de `700ms` introduzido pela autoridade r229.
- Neutralizados MutationObservers e polls legados de r223/r225/r226/r227/r228/r228b/r228c/r228d/r229/r232 que continuavam reescrevendo Descobrir, Esportes ou contagens da Watchlist depois do paint final.
- A r233 não cria novo `MutationObserver` nem `setInterval`; normalizações finais são acionadas pelos próprios eventos de render/paint e por `cinetracker:data-changed`.
- Padronizado um normalizador final compartilhado pela r233 para classificação de ações e textos.

### Home / episódios
- Séries classificadas como `Em dia` passam por revalidação ao vivo do TMDB após o carregamento da Home.
- A posição do último episódio efetivamente lançado (`last_episode_to_air`) é comparada com a última posição assistida.
- O total liberado é recalculado pelas temporadas anteriores mais os episódios já lançados da temporada atual.
- Se houver episódio novo já lançado, `is_caught_up` é corrigido e o item sai de `Em dia` para `Assistir a seguir` sem depender de metadado persistido desatualizado.

### Descobrir
- Removidos observadores conflitantes que repintavam cards e ações de forma assíncrona depois da navegação.
- A normalização final de cards, Watchlist e `Trocar` ocorre somente após render/paint real.
- Mantida a camada de metadados consolidada da 1.0.24, agora chamada de forma determinística e sem polling contínuo.

### Esportes
- Mantida a semântica visual da autoridade v123: uma zona final de ações com `Eventos` e `Assistido/Desmarcar`.
- A canonicalização dos cards passa a ser acionada somente após `paintSports`/`renderSports`, sem loop de 700ms.
- Normalizadores esportivos legados que disputavam o mesmo DOM deixam de ser disparados automaticamente.

### Watchlist / Perfil
- A contagem e o modal passam a usar todas as linhas retornadas por `cinetracker_watchlist_full_v119`.
- Removido o filtro que descartava entradas sem TMDB id válido antes da contagem.
- Registros locais sem TMDB continuam visíveis no modal; itens com TMDB id mantêm navegação para os detalhes.
- Contagem exibida e quantidade de linhas do modal passam a usar exatamente a mesma fonte.

### Build e validação
- Web package e package raiz atualizados para `1.0.25`.
- Build oficial passa a ser `apps/web/build-r233.mjs` e gera `app-v233.js`, cache `ct-web-1.0.25-r233` e `release.json` da 1.0.25.
- Adicionado `test-r233.mjs` para bloquear regressões de polling/observers e validar as quatro autoridades finais: Home, Descobrir, Esportes e Watchlist.
- `verify.yml` atualizado para validar a Web 1.0.25 e manter a baseline Android atual separada.

## 1.0.0 — 2026-09-04 — OFICIAL

### Release
- Web e Android passam a compartilhar a identidade pública **1.0.0**.
- Web: package `1.0.0`, revision `r204-official-1.0.0` e assets `app-v204`.
- Android: `versionName 1.0.0`, `versionCode 10042`, APK `CineTracker-1.0.0.apk`.
- Backend Supabase permanece o production compartilhado; nenhuma migration artificial foi criada apenas para renumerar a aplicação.

### Versão visível
- Rodapé da Web alterado para `CineTracker • v1.0.0`.
- Runtime embarcado no Android alterado para `CineTracker • v1.0.0`.
- `window.__ctWebBuild` e `window.__ctOfficialVersion` passam a `1.0.0`.
- Android também publica `window.__ctAndroidOfficialVersion='1.0.0'`.
- Snapshots/backup exportados passam a declarar `version:'1.0.0'`.
- `release.json` Web passa a declarar `version:1.0.0`, revision `r204-official-1.0.0` e `status:official`.

### Android — último bloqueador encerrado
- A 1.0.0 usa como base funcional exatamente a **0.99.7.71/r243**, validada no aparelho pelo usuário.
- Corrigida a divergência que fazia `Da sua Watchlist` renderizar a partir de `wmPool/wsPool/waPool`, enquanto o botão `Trocar` reconstruía outro pool e podia terminar sem candidato.
- `pool237('watchlist:*')` passa a consumir exatamente o pool selecionado pelo renderer ativo `ct186`.
- `r237` permanece a única autoridade de `pointerup/click`; não existe novo handler concorrente.
- Teste de regressão executa a cadeia real do clique e exige Watchlist `11 → 14` mantendo `100% novos` em `21 → 21`.
- O usuário confirmou no aparelho que o `Trocar` da Watchlist funciona.

### Android — Top 10/streamings
- Preservado o scroll horizontal nativo do WebView para Top 10, streamings e trilhos de cards.
- Não é reintroduzido controlador manual de `touchmove`.
- O usuário confirmou no aparelho que o scroll lateral funciona.

### Web
- A r204 importa integralmente a r203; não há reescrita funcional nesta promoção.
- Preservados filtro do Descobrir à direita da busca, limpeza de filtro duplicado em Sports, rewatch persistente `2x/3x/4x...`, Ver mais para filme/série/pessoa e demais comportamentos consolidados.

### Documentação/CI
- `README.md`, `PROJECT_STATE.md`, `VERSIONS.md`, READMEs de Web/Android e documentos de release/validação passam a apontar 1.0.0.
- Criado `.github/workflows/release-v1.yml` como pipeline oficial conjunto Web + Android.
- `verify.yml` deixa de validar r203/Android .64 e passa a validar a baseline 1.0.0.

## Linha 0.99.7 — consolidação pré-1.0

Principais marcos preservados pela 1.0.0:

- Home com progresso e interação otimista;
- Descobrir/Pra Você, filtros, Watchlist e 100% novos;
- exclusões pessoais para evitar recomendar itens vistos, em andamento ou na Watchlist;
- detalhes ricos, temporadas, episódios, avaliações e elenco;
- Perfil, favoritos, atividade e estatísticas;
- Sports integrado;
- importação, sincronização, manutenção e backup;
- rewatch persistente;
- múltiplas iterações Android de composição mobile e interação física;
- 0.99.7.71 como última pré-release, encerrando o bug do `Trocar` da Watchlist.

## Histórico anterior

As releases 0.0.x, 0.99.1–0.99.7 e hotfixes continuam disponíveis no histórico Git e em `docs/releases/`. Elas são históricas e não devem ser usadas como baseline para novas alterações depois da 1.0.0.
