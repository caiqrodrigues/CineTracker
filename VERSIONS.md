## 1.0.224 / r433
- Pra Você: corrige tela preta causada por captura de `discover263` antes do boot.
- Estado do Descobrir e owners auxiliares passam a ser resolvidos dinamicamente.
- Ações Watchlist/Visto/Trocar continuam no r309.
- Escopo exclusivo: Pra Você; Android permanece **1.0.20 / 10062**.

- **1.0.222 / r431** — Descobrir > Pra Você: remove bloqueio por `loadRecent296`, elimina auto-refresh por `data-changed/online` e mantém r309 como renderer/owner único de Trocar.
- **1.0.221 / r430** — Descobrir > Pra Você passa a usar exclusivamente o renderer r309; r411/r427/r428/r429 removidos do bundle final; ações Watchlist/Visto/Trocar preservadas no renderer único.
- **1.0.220 / r429** — Descobrir > Pra Você isolado no owner r411; recovery r427/r428 removido do build; ciclo de atualização/repaint removido.
## 1.0.219 — r428 (2026-10-01)
- Pra Você: owner visível da composição, cards + ações reconstruídos quando necessário.
- Trocar: ação nativa r388 preservada por slot.
- Sem reload, MutationObserver, setInterval ou loop ilimitado.
- Android permanece 1.0.20 / 10062.

## 1.0.216 — r425 (2026-10-01)
- Home sem tela vazia durante carregamento.
- F1 media_id=865: total 1.280 sessões/episódios importados de 2015-2026.
- Pra Você usa mutação otimista por slot, sem repaint global.
- Perfil usa uma única fonte para estatísticas esportivas.
- Android permanece 1.0.20 / 10062.

## 1.0.215 — r424 (2026-10-01)
- Home Séries usa cinetracker_home_series_v424 para tratar Fórmula 1, Raw e SmackDown como séries recorrentes quando existe próximo episódio.
- Entrada da Home Séries é protegida contra o primeiro paint do Histórico; a tela só é revelada após o payload atual e o alinhamento de Assistir a seguir.
- Perfil repinta tempos pelos RPCs canônicos de Séries e Esportes, incluindo o runtime das sessões F1 nos dois contabilizadores.
- Séries/Filmes do Perfil passam a ser listas verticais sem arraste horizontal, com **Ver mais** para listas longas.
- Android permanece 1.0.20 / 10062.

## 1.0.214 — r423 (2026-10-01)
- Fórmula 1 usa um owner direto nas três superfícies reais: Série, Esportes e F1 Hub.
- f1_episode_map_v423 é a autoridade de correspondência sessão ↔ episódio; o writer r423 grava estado de série e esporte na mesma ação.
- O fluxo r255 de Esportes para formula_1 agora converge para o mesmo writer; os demais esportes permanecem inalterados.
- Reconciliação da temporada atual corrige divergências anteriores sem duplicar marcações já sincronizadas.
- Tempo de cada sessão entra nos contadores de Séries e Esportes.
- Android permanece 1.0.20 / 10062.
## 1.0.213 — r422 (2026-10-01)
- Fórmula 1 passa a ter sincronização dupla e atômica: cada sessão é o episódio correspondente da série `media_id=865` e, ao mesmo tempo, um evento assistido em Esportes.
- Marcar/desmarcar pelo detalhe da série, pela tela de Esportes ou pelo F1 Hub converge em `cinetracker_f1_watch_sync_v422`; o estado de uma superfície reaparece nas outras sem full-page reload.
- O tempo da sessão é contabilizado nos dois domínios: histórico/tempo de séries e histórico/tempo de esportes. O contador de Esportes volta a incluir Fórmula 1.
- F1 Hub e detalhe da série mantêm Optimistic UI e rollback em falha; o fluxo de Esportes é interceptado somente para `formula_1`, preservando os demais esportes.
- Perfil, Descobrir e filtros de recomendação da r421 não tiveram layout ou regras alterados. Android permanece 1.0.20 / 10062.

## 1.0.212 — r421 (2026-10-01)
- Descobrir bloqueia stand-up em duas camadas: elegibilidade SQL v421 e validação de detalhes TMDB antes do paint no Pra Você, abas públicas e Top 10. Curtas <40 min, YouTube/web, novelas, Reality, WWE, vistos e Watchlist continuam bloqueados pelas regras existentes.
- Fórmula 1 passa a usar exclusivamente a série `media_id=865` no F1 Hub: o estado visual é lido do progresso de episódios e a escrita usa `cinetracker_f1_episode_watch_set_v421`; o histórico esportivo genérico deixa de pintar as sessões.
- Perfil mantém o layout existente e corrige os três tempos de Watchlist por rótulo semântico, usando `cinetracker_profile_watchlist_runtime_v421`. Trilhos de Séries/Filmes exibem todos os cards retornados e permitem alcançar o último card sem corte.
- Sem full-page reload, MutationObserver novo, setInterval ou loop ilimitado. Android permanece 1.0.20 / 10062.

## 1.0.211 — r420 (2026-10-01)
- Descobrir passa a excluir stand-up em todas as autoridades atuais: elegibilidade SQL v420, pools do Pra Você v420 e barreira client-side; regras anteriores de curtas <40 min, YouTube/web, novelas, Reality, WWE e biblioteca pessoal permanecem.
- Fórmula 1 corrige o owner lexical r311: o clique real do F1 Hub delega ao writer de episódios da série media_id 865, sem espelhar a sessão como evento esportivo genérico; estado do modal vem do progresso da série.
- Perfil recebe tempos reais da Watchlist (séries, filmes e total) pelo RPC v420 e os contadores de esportes passam a excluir Fórmula 1, que pertence à série.
- Listas Séries/Filmes do Perfil deixam de cortar em 10 cards e renderizam todos os cards retornados, com trilho horizontal completo e último card alcançável.
- Android permanece 1.0.20 / 10062.

## 1.0.210 — r419 (2026-10-01)
- Hotfix final de Fórmula 1: o owner legado r311 que captura os cliques do F1 Hub agora delega diretamente ao writer r418 da série Fórmula 1 (media_id 865), impedindo a persistência como evento esportivo genérico.
- Mantém integralmente as correções r418 de entrada da Home, botões Trocar do Pra Você e contadores esportivos do Perfil.
- Android permanece 1.0.20 / 10062.

## 1.0.209 — r418 (2026-10-01)
- Home Séries arma a proteção antes do boot e só revela a tela já ancorada em **Assistir a seguir**, eliminando o flash/salto pelo fim do Histórico.
- Descobrir > Pra Você repara os botões **Trocar** diretamente nas linhas de ação visíveis; Indicação do Dia e 100% Novos ficam com Watchlist + Visto + Trocar, e Da sua Watchlist com Visto + Trocar.
- Perfil preserva integralmente o layout e passa a ler Tempo/Eventos assistidos pela autoridade relacional `cinetracker_sport_stats_v418`.
- F1 Hub passa a persistir cada sessão como episódio da série Fórmula 1 (media_id 865), com Optimistic UI e espelho da sessão F1.
- Sem full-page reload, MutationObserver global, setInterval ou loop infinito. Android permanece 1.0.20 / 10062.

## r417 — Web 1.0.208
- Home Séries mantém o canvas oculto até a geometria final de **Assistir a seguir** estabilizar.
- Pra Você garante **7 botões Trocar** nos sete slots populados do DOM realmente visível.
- Perfil preserva layout e restaura os contadores reais de Esportes via `cinetracker_sport_stats_v1`.
- Fórmula 1 usa exclusivamente a autoridade de série `media_id=865` para marcar sessões como episódios.
- Android permanece 1.0.20 / 10062.

## r416 — Web 1.0.207
- Perfil preserva o visual e ganha first paint por snapshot persistente + refresh canônico v380.
- Pra Você usa a r411 como owner final e mantém **7 botões Trocar** quando os sete slots possuem item.
- Fórmula 1 persiste sessão como episódio da série importada com Optimistic UI e espelho no estado canônico F1.
- Android permanece 1.0.20 / 10062.

## r415 — Web 1.0.206
- Home Séries só é revelada depois que **Assistir a seguir** e o Histórico estabilizam, sem flash/jump inicial.
- Pra Você repara as linhas de ação realmente visíveis e garante **7 botões Trocar** quando os 7 slots têm item.
- Perfil mantém o layout aprovado e usa owner cache-first + `cinetracker_profile_v380` como única carga principal.
- Android permanece 1.0.20 / 10062.

## r413 — Web 1.0.204
- Home entra diretamente em **Assistir a seguir**, sem flash do fim do Histórico.
- Pra Você reafirma o owner r411 e garante os botões **Trocar** nos sete slots quando há item.
- Elegibilidade v413 preserva curta <40 min, YouTube/web, novelas/Soap e adiciona exclusão de **Reality / TMDB 10764**.
- Android permanece 1.0.20 / 10062.

## r412 — Web 1.0.203
- Filtro global de recomendação/descoberta: filmes/especiais abaixo de 40 min, YouTube/web originals e novelas/Soap são inelegíveis.
- Novos RPCs v412 para Fresh, Watchlist recomendada e Home Séries; exclusões pessoais/WWE preservadas.
- Pra Você mantém 7 botões **Trocar** e substituição local delimitada.
- Android permanece 1.0.20 / 10062.

## r411 — Web 1.0.202
- Escopo exclusivo: Descobrir > Pra Você.
- Seis pools diretos v396/v387 em paralelo; RPC composto v396 removido do caminho ativo após timeout real de produção.
- Timeout delimitado de 12 s por pool, paint progressivo e **7 botões Trocar** quando os sete slots possuem item.
- Home, Séries, Perfil, Esportes, Top 10, Configurações, backend e Android intactos.

## r410 — Web 1.0.201
- Escopo exclusivo: Descobrir > Pra Você.
- Owners locais r319/r309 delegados antes do paint legado; r288 já não está presente no bundle final.
- 7 botões **Trocar** e ações completas com estilo ativo `chip`.
- Fontes v396/v387 preservadas; demais áreas e Android intactos.

## r409 — Web 1.0.200
- Home start sem restauração do fim do Histórico.
- Episódio assistido com transição otimista instantânea de Home/Histórico/próximo episódio.
- Pra Você com owner único, fallbacks paralelos delimitados e ações completas incluindo Trocar.
- Sem full-page reload, MutationObserver global ou setInterval agressivo.

# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-10-01

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.213** | revision `r422-official-1.0.213`, package `1.0.213` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r313 |
| Backend / Supabase | produção compartilhada | elegibilidade/Pra Você v421 + sincronização F1 dupla `cinetracker_f1_watch_sync_v422` | produção compartilhada |
| Windows | — | — | não lançado |

## Web 1.0.199 / r408

- Home ancora uma única vez **Assistir a seguir** após o paint real e não retorna ao final do Histórico.
- Filmes dispara diretamente o loader paginado v405.
- Pra Você usa owner final r408 e recupera os botões completos após repaint legado tardio.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v408.js / app-v408.css; build: apps/web/build-r408-official.mjs; regressões: apps/web/test-r408.mjs e apps/web/test-r408-browser.mjs.

## Web 1.0.198 / r407

- Home abre e retorna em **Assistir a seguir**, com Histórico preservado acima; owners de scroll antigos delegam ao r407.
- O clique Séries/Filmes da r374 passa a acionar o owner vivo; Filmes entra no loader paginado r406/v405 imediatamente.
- Pra Você usa `cinetracker_discover_foryou_v396` em um único owner e mantém **Trocar** nos sete slots.
- Timers tardios de ownership foram reduzidos; nenhum observer/interval/full-page reload foi adicionado.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v407.js / app-v407.css; build: apps/web/build-r407-official.mjs; regressões: apps/web/test-r407.mjs e apps/web/test-r407-browser.mjs.

## Web 1.0.196 / r405

- Home Filmes passa pelo closure real da r388 e usa `cinetracker_home_movies_v405` com paginação SQL verdadeira de 120 itens; produção validada em 1.381 filmes.
- Pra Você toma posse dos closures reais r321/r336/r388; o renderer legado deixa de apagar os botões **Trocar**.
- Watchlist/Fresh de Filme, Série e Anime são carregados em paralelo pelas autoridades v396/v387, preservando exclusões de vistos e Watchlist.
- Raw/SmackDown e demais áreas permanecem inalterados.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v405.js / app-v405.css; build: apps/web/build-r405-official.mjs; regressões: apps/web/test-r405.mjs e apps/web/test-r405-browser.mjs.

## Web 1.0.195 / r404

- Home Filmes usa paginação server-side de 120 itens, preservando o total real de 1.381 e evitando o loading permanente.
- Pra Você usa o container visível como owner e mantém todos os botões Trocar nos sete slots.
- Raw/SmackDown separam backlog total não visto do episódio recente pendente; somente o recente define Continuar versus Em dia.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v404.js / app-v404.css; build: apps/web/build-r404-official.mjs; regressões: apps/web/test-r404.mjs e apps/web/test-r404-browser.mjs.

## Web 1.0.185 / r394

- Home ancora o primeiro bloco principal somente depois que o Histórico assíncrono estabiliza, mantendo o Histórico acima para scroll.
- Home reaproveita cache válido da sessão no primeiro paint e reconcilia com as autoridades atuais.
- Pra Você unifica os entrypoints r321/r382/r383/r384/r385 no loader r388, eliminando placeholders permanentes causados por estado divergente.
- Fresh/Watchlist continuam em v387/v391 com auditoria pessoal estrita; ações seguem sem reload.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v394.js / app-v394.css; build: apps/web/build-r394-official.mjs; regressões: apps/web/test-r394.mjs e apps/web/test-r394-browser.mjs.

## Web 1.0.184 / r393

- Home restaura a entrada sem Histórico ocupando a viewport, preservando o Histórico acima para acesso por scroll.
- Watchlist de Filmes usa RPC dedicado e leve `cinetracker_home_movies_v393`.
- Pra Você usa Fresh do banco como caminho principal, auditado pelo filtro pessoal v391, com TMDB limitado como fallback.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v393.js / app-v393.css; build: apps/web/build-r393-official.mjs; regressões: apps/web/test-r393.mjs e apps/web/test-r393-browser.mjs.

## Web 1.0.183 / r392

- Home usa apenas a autoridade de séries v391; caches/duplicatas antigos não reintroduzem próximos episódios já assistidos.
- Writer r392 de Visto é otimista e não executa reload global; mutações em detalhe invalidam Home/Histórico antes da próxima entrada.
- Cards de episódio da Home usam metadados do payload direto, sem renderer assíncrono legado.
- Pra Você faz auditoria estrita em lote do cache antes do paint e top-up bounded.
- Android permanece 1.0.20 / 10062.

Assets oficiais: app-v392.js / app-v392.css; build: apps/web/build-r392-official.mjs; regressões: apps/web/test-r392.mjs e apps/web/test-r392-browser.mjs.
## Web 1.0.104 / r313

- Descobrir volta ao card padrão `ct288Card`; o filtro Todos/Filmes/Séries fica oculto por padrão atrás do `☷`.
- As cinco abas públicas continuam excluindo vistos e Watchlist antes do HTML, com ações pequenas abaixo do card.
- Próximos/Anteriores produzem o filtro de todos os esportes diretamente em `paintSports255`.
- Perfil usa somente `renderProfile313`, com um paint final e quatro cards de estatística no mesmo padrão.
- JWT, F1 r311 e Android `1.0.20 / 10062` permanecem preservados.

Assets oficiais: `app-v313.js` / `app-v313.css`; build: `apps/web/build-r313-official.mjs`; runtime: `apps/web/runtime-r313-discover-sports-profile.js`; regressões: `apps/web/test-r313.mjs` e `apps/web/test-r313-browser.mjs`.

## Web 1.0.103 / r312

- Descobrir usa shell persistente, barreira vistos+Watchlist antes do HTML, cards próprios com ações estáveis e `Pra Você` compacto.
- Sessão expirada é renovada automaticamente por refresh token antes de uma única repetição da chamada.
- Perfil garante `Jogos no Estádio` e atualiza Atores Favoritos pela tabela viva `favorite_actors`.
- `Próximos` e `Anteriores` exibem filtros inline gerados de todos os esportes em `payload.sports`.
- F1 r311 permanece preservado e validado.
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v312.js` / `app-v312.css`; build: `apps/web/build-r312-official.mjs`; regressões: `apps/web/test-r312.mjs` e `apps/web/test-r312-browser.mjs`.

## Web 1.0.102 / r311

- Perfil: quatro controles clicáveis de estatísticas usam uma única versão visual baseada em `Eventos assistidos`.
- F1: Calendário abre cada GP; detalhe inclui fim de semana, Grid de Largada, Resultado de Chegada e marcação por sessão.
- Descobrir: as cinco abas públicas excluem vistos + Watchlist antes do paint e exibem `+ Watchlist` + `✓ Visto` em faixa estável abaixo do card.
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v311.js` / `app-v311.css`; build: `apps/web/build-r311-official.mjs`; runtime: `apps/web/runtime-r311-profile-f1-discover.js`; regressões: `apps/web/test-r311.mjs` e `apps/web/test-r311-browser.mjs`.

## Web 1.0.101 / r310

A r310 corrige as divergências visíveis no vídeo real enviado após a r309.

- remove na fonte os produtores tardios r252/r300/r293 que recriavam abas e ações antigas;
- usa a Watchlist completa `cinetracker_watchlist_full_v119` na exclusão final das abas públicas;
- mantém Watchlist + `✓ Visto` com estado coerente nos cards;
- usa `cinetracker_sports_watch_history_v296` para o total canônico de eventos assistidos no primeiro paint do Perfil;
- posiciona uma única scrollbar dos atores explicitamente abaixo dos cards;
- normaliza eventos esportivos antigos presos em status `live`;
- corrige o rodapé para `v1.0.101 / r310-official-1.0.101`;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v310.js` / `app-v310.css`; build: `apps/web/build-r310-official.mjs`; runtime: `apps/web/runtime-r310-video-truth.js`; regressões: `apps/web/test-r310.mjs` e `apps/web/test-r310-browser.mjs`.

## Web 1.0.100 / r309

A r309 é a correção orientada pelos dois vídeos reais enviados em 18/09/2026.

- Descobrir fica com oito abas canônicas, sem `Lançamentos` nem rail duplicado; autoridade pessoal e TMDB carregam em paralelo.
- `Pra Você` exige Filme + Série + Anime tanto na Watchlist quanto em `100% novos`, com Indicação do Dia e trocas independentes.
- A deduplicação final também usa tipo+título+ano, eliminando duplicatas visuais.
- Cards do Descobrir mantêm Watchlist e `✓ Visto` sempre visíveis; `Trocar` fica abaixo deles.
- F1 nasce com quatro abas; a autoridade r257 que repintava seis abas depois da navegação é desativada.
- Perfil deixa de exibir cache/quick antes do payload completo, recebe estádio no primeiro paint, não mostra chevrons de Watchlist e mantém a scrollbar dos atores no rail real dos cards.
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v309.js` / `app-v309.css`; build: `apps/web/build-r309-official.mjs`; runtime: `apps/web/runtime-r309-video-truth.js`; regressões: `apps/web/test-r309.mjs` e `apps/web/test-r309-browser.mjs`.

## Web 1.0.99 / r308

A r308 corrige as divergências reproduzidas no vídeo real de 17/09–18/09/2026 sem alterar o Android.

- `Pra Você` passa a ser composto por pools separados: Indicação do Dia com troca real, `Da sua Watchlist` com Filme + Série + Anime e `100% novos` com Filme + Série + Anime; uma categoria não ocupa a vaga de outra;
- autoridade pessoal, memória recente e primeiros pools TMDB começam em paralelo, e uma composição válida é reutilizada por três minutos para reduzir o loading ao revisitar a aba;
- ações de Watchlist/Visto usam o `chip` visual canônico do sistema;
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` recebem a barreira final de vistos + Watchlist antes do paint; `Calendário`, `Pra Você` e `Top 10` ficam fora dessa regra geral;
- F1 Hub fica somente com `Visão geral`, `Calendário`, `Classificações` e `Circuitos`; o clique de corrida passa a usar o `data-event-id` real para abrir a rodada correta com Grid de Largada e Resultado de Chegada;
- o Perfil recebe acabamento final por rótulo semântico e remove o sinal visual de clique de `Séries Watchlist` e `Filmes Watchlist`, preservando a área clicável;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v308.js` / `app-v308.css`; build: `apps/web/build-r308-official.mjs`; runtime: `apps/web/runtime-r308-discover-f1-profile.js`; regressões: `apps/web/test-r308.mjs` e `apps/web/test-r308-browser.mjs`.

## Web 1.0.91 / r300

A r300 corrige as divergências observadas no vídeo real de 16/09/2026 em Perfil, Descobrir e Esportes, sem alterar o Android.

- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual clicável usado em `Eventos assistidos` e `Jogos no Estádio`, preservando suas ações existentes;
- Esportes passa a exibir exatamente quatro abas, na ordem `Próximos`, `Anteriores`, `Assistidos` e `Favoritos`; a aba `Ao vivo` é removida do DOM efetivamente renderizado pela r255 e também bloqueada por CSS caso um repaint legado tente recriá-la;
- se uma sessão antiga estiver parada em `Ao vivo`, a r300 volta para `Próximos`, impedindo que eventos antigos — como jogos de 12/09 vistos no vídeo em 16/09 — permaneçam apresentados como conteúdo atual;
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` ganham recuperação finita: se a autoridade herdada ficar presa em `Carregando títulos…`, a r300 busca candidatos pelo TMDB, respeita filtro Filme/Série e exclusões pessoais e pinta pelo renderer real r288;
- a recuperação do Descobrir é limitada e não usa `setInterval` nem observer perpétuo; `Pra Você` 1+3+3 e `Top 10` mantêm suas autoridades específicas;
- adiciona regressão Chromium reproduzindo o cenário do vídeo: Watchlist com estilo clicável, cinco abas herdadas reduzidas a quatro na ordem aprovada e detecção do loading persistente do Descobrir;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v300.js` / `app-v300.css`; build: `apps/web/build-r300-official.mjs`; runtime: `apps/web/runtime-r300-discover-sports-profile-watchlist.js`; regressões: `apps/web/test-r300.mjs` e `apps/web/test-r300-browser.mjs`.

## Web 1.0.90 / r299

A r299 simplifica a presença presencial em Esportes e torna o histórico esportivo do Perfil navegável, sem alterar o Android.

- `Eventos assistidos`, dentro de `Esportes assistidos`, passa a ser clicável e abre o histórico retornado por `cinetracker_sports_watch_history_v296`;
- `Jogos no Estádio` também passa a ser clicável e abre somente os registros com `attended_in_person = true`;
- as listas mostram evento, competição e data quando disponíveis e não exibem `stadium_name`;
- a marcação de evento mantém somente `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`, sem formulário para informar local;
- `Fui ao Estádio` persiste diretamente com `p_attended_in_person = true` e `p_stadium_name = null`;
- o campo legado da r298 fica oculto no bundle r299 e o handler r299 é registrado antes da captura r298, impedindo que o formulário antigo assuma o clique real;
- badges presenciais mostram apenas `🏟️ No Estádio`, sem o nome do local;
- `Pra Você` 1+3+3 e as demais correções da r298 permanecem preservadas;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v299.js` / `app-v299.css`; build: `apps/web/build-r299-official.mjs`; runtime: `apps/web/runtime-r299-profile-sports-history.js`; regressões: `apps/web/test-r299.mjs` e `apps/web/test-r299-browser.mjs`.

## Web 1.0.89 / r298

A r298 corrige as divergências observadas em vídeo após a r297, usando o DOM efetivamente servido como ground truth.

- o botão real de Esportes (`data-ct255-watch`) passa a ser interceptado antes do handler legado e abre a escolha `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`;
- a opção presencial persiste por `cinetracker_sports_watch_set_v296`, incluindo `attended_in_person` e `stadium_name`, e registros presenciais recebem `🏟️ No Estádio`;
- `Jogos no Estádio` deixa de ser injetado na primeira grade genérica do Perfil e passa a existir somente dentro do painel semântico `Esportes assistidos`;
- `Pra Você` recebe pipeline finito próprio sobre os donos r288: aguarda autoridade pessoal e memória de 7 dias, hidrata Watchlist, busca pools suficientes e monta `Indicação do Dia` (1 Filme), `Da sua Watchlist` (Filme + Série + Anime) e `100% Novos` (Filme + Série + Anime), sem duplicações;
- se uma categoria realmente não possuir candidato elegível, a interface mostra estado explícito em vez de permanecer indefinidamente em `Carregando…`;
- preserva TMDB >= 7,5, ano > 1990, exclusões de Drama/Documentário-only, WWE e biblioteca pessoal, além do anti-repeat de 7 dias;
- adiciona regressões Chromium específicas para o botão esportivo real, posicionamento da métrica no Perfil e composição 1+3+3 do `Pra Você` sem spinner residual;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v298.js` / `app-v298.css`; build: `apps/web/build-r298-official.mjs`; runtime: `apps/web/runtime-r298-stadium-foryou-completion.js`; regressões: `apps/web/test-r298-foryou-browser.mjs` e `apps/web/test-r298-browser.mjs`.

## Web 1.0.88 / r297

A r297 é um hotfix exclusivamente Web para recuperar o boot público da r296 e reconectar as autoridades do Descobrir aos renderers que realmente estão ativos desde a r288. O escopo funcional da r296 permanece inalterado e o Android continua intocado.

- corrige a tela preta/vazia causada pelo `runtime-r295-browse-actions-self-scope-fix.js`, que podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`, interrompendo a aplicação com `#app` vazio;
- corrige a causa arquitetural encontrada na validação do bundle final: desde a r288 os donos vivos do Descobrir são `window.__ctR288PaintBrowse`, `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`, enquanto patches r295/r296 ainda tentavam interceptar nomes legados;
- a r297 liga explicitamente as exclusões pessoais, ações de cards, Calendário e regras rígidas do `Pra Você` aos donos reais r288, mantendo fallback compatível para as regressões históricas;
- o bridge r297 garante filtragem de vistos/Watchlist nas abas públicas, composição rígida do `Pra Você` e carregamento autorizado sem reconstruir a página inteira;
- adiciona regressão Chromium específica usando os mesmos nomes `window.__ctR288...` do bundle oficial, além do teste do bundle final completo `app-v297.js`;
- o teste de bundle exige passagem por `boot()`, `#app` renderizado, ausência de page error e os três hooks r297 efetivamente conectados aos donos r288;
- mantém integralmente as regras da r296 para TMDB >= 7,5, ano > 1990, bloqueio WWE, anti-repetição de 7 dias, três blocos de recomendações, quatro abas de Esportes, presença no estádio e polimento Web;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v297.js` / `app-v297.css`; build: `apps/web/build-r297-official.mjs`; bridge: `apps/web/runtime-r297-live-discover-owner-bridge.js`; regressões: `apps/web/test-r297-discover-live-browser.mjs` e `apps/web/test-r297-browser.mjs`.

## Web 1.0.87 / r296

A r296 altera somente a Web e o backend compartilhado necessário para persistência dos novos metadados; o Android permanece intocado.

- `Pra Você` exige TMDB >= 7,5 e ano > 1990, exclui títulos exclusivamente Drama/Documentário e bloqueia WWE/Raw/SmackDown/NXT e eventos WWE relacionados;
- recomendações exibidas ficam bloqueadas por 7 dias por usuário via `shown_recommendations`, com fallback local, e não podem se repetir na mesma tela;
- a composição aprovada fica em `Indicação do Dia` (1 Filme), `Da sua Watchlist` (Filme + Série + Anime) e `100% Novos` (Filme + Série + Anime);
- Esportes fica com exatamente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; próximos = hoje, anteriores = últimas 72h;
- histórico esportivo recebe `attended_in_person` e `stadium_name`, com fluxo TV/Tela ou Estádio, badge `🏟️ No Estádio` e métrica `Jogos no Estádio` no Perfil;
- Home, Perfil, Configurações e sidebar recebem polimento visual restrito à Web;
- a r295 permanece como base para exclusões canônicas, ações Playlist/Visto e filtros combináveis do Calendário.

Assets oficiais: `app-v296.js` / `app-v296.css`; build: `apps/web/build-r296-official.mjs`; runtime: `apps/web/runtime-r296-recommendations-sports-stadium.js`; migration: `supabase/migrations/20260915183834_r296_recommendations_sports_stadium.sql`.

## Web 1.0.80 / r289

A r289 altera somente o layout dos cards do Descobrir na Web. Toda a lógica funcional da r288 permanece preservada.

- os cards do Descobrir voltam ao padrão aprovado: **154×231 px no mobile** e **176×264 px no desktop**, sempre em **2:3**;
- `Da sua Watchlist` e `100% novos` deixam de esticar Filme/Série/Anime para ocupar um terço inteiro da página no desktop;
- os três slots usam largura fixa de card e, quando necessário, rolagem horizontal somente dentro do componente;
- cards de `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` usam o mesmo padrão 154/176;
- `Top 10` segue o mesmo padrão de tamanho;
- `Ver mais` pode quebrar em várias linhas, mas mantém cada card no tamanho aprovado em vez de esticá-lo para preencher a largura disponível;
- as nove abas, troca de conteúdo sem reconstruir a tela, Top 10 por streaming, filtros, Calendário e as ações da r288 permanecem intactos;
- Android permanece inalterado em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v289.js` / `app-v289.css`; build: `apps/web/build-r289-official.mjs`; runtime: `apps/web/runtime-r289-discover-standard-card-size.js`.

## Web 1.0.79 / r288

A r288 altera somente a Web e usa como ground truth o comportamento funcional do Descobrir Android 1.0.20 mostrado no vídeo de referência.

- o Descobrir mantém as nove abas aprovadas em um trilho horizontal estável: `Pra você`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`;
- trocar de aba atualiza somente a área de conteúdo, sem reconstruir o shell inteiro da tela;
- `Pra você` volta a exibir `Da sua Watchlist` e `100% novos` em três slots independentes — Filme, Série e Anime — cada um com seu próprio `Trocar`;
- `Top 10` volta a ser calculado por streaming disponível no Brasil e possui trilhos separados de `Top 10 Séries` e `Top 10 Filmes`;
- as abas públicas usam cards 2:3 em trilhos horizontais locais, ação de Watchlist e `Ver mais` sem liberar scroll horizontal no documento;
- o filtro `Todos / Filmes / Séries` fica recolhido atrás do controle compacto e não aparece em `Pra você`/`Top 10`;
- `Calendário` agrupa os títulos por data de lançamento;
- a implementação Web reutiliza as autoridades canônicas já existentes para biblioteca, TMDB, streaming e abertura de detalhes; hacks de toque específicos do WebView Android não foram copiados;
- Home r287, ações de relacionados r286, detalhes, Sports/F1 e demais áreas permanecem preservados;
- Android permanece inalterado em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v288.js` / `app-v288.css`; build: `apps/web/build-r288-official.mjs`; runtime: `apps/web/runtime-r288-discover-android-parity.js`.

## Android 1.0.20

A r300 não altera Android. A identidade preservada é:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.20`;
- `versionCode`: `10062`.

## Regra de versionamento

- correção compatível: `1.0.x`;
- funcionalidade compatível: `1.x.0`;
- quebra deliberada de contrato/arquitetura: próxima major;
- `versionCode` Android sempre aumenta quando houver nova release Android, independentemente do `versionName`.

## Regra de validação

CI verde não substitui teste real. O fluxo oficial da Web exige testes de comportamento em Chromium, boot do bundle final exato e `production_smoke` do domínio público após a promoção ao `main`. Quando vídeo/aparelho divergir do teste sintético, o vídeo/aparelho é o ground truth para a próxima correção.