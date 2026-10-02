## 1.0.231 — r440 (2026-10-02)
- Corrigidos os marcadores internos dos runtimes r412–r418 usados na montagem do corte de owners legados.
- **Descobrir > Pra Você** permanece com r309/r432 como único renderer ativo.
- Escopo exclusivo em Pra Você; Home r404/r405, Perfil, Esportes, F1 e Android preservados.

## 1.0.230 — r439 (2026-10-02)
- **Descobrir > Pra Você:** corrigida a montagem do bundle r438 para usar os marcadores reais do bundle r437.
- Mantida a remoção dos owners legados que provocavam o ciclo de repintura.
- r309/r432 continua como único renderer ativo de Pra Você.
- Home r404/r405, Perfil, Esportes, F1 e Android preservados.

## 1.0.229 — r438 (2026-10-02)
- **Descobrir > Pra Você:** eliminado o ciclo de repintura causado pelos owners legados r395–r410 que ainda permaneciam no bundle final.
- r309/r432 permanece como único renderer ativo de Pra Você.
- **Trocar**, Watchlist e Visto continuam no owner r309.
- Home preserva as autoridades r404/r405; Perfil, Esportes, F1 e Android permanecem sem alteração.
- Build: apps/web/build-r438.mjs; gate: apps/web/build-r438-official.mjs; regressão: apps/web/test-r438.mjs.

## 1.0.228 — r437 (2026-10-02)
- **Descobrir > Pra Você:** corrigido o pisca causado por repaints idênticos e reset repetido do loader.
- O DOM é preservado quando as recomendações não mudam.
- **Trocar**, Watchlist e Visto continuam no owner r309.
- Escopo exclusivo em Pra Você; demais áreas e Android preservados.
- Build: apps/web/build-r437.mjs; gate: apps/web/build-r437-official.mjs; regressão: apps/web/test-r437.mjs.

## 1.0.227 — r436 (2026-10-02)
- **Descobrir > Pra Você:** eliminado o pisca causado por montagens concorrentes e repaints idênticos.
- A tela mantém o DOM existente quando a recomendação não mudou.
- **Trocar**, Watchlist e Visto continuam no owner r309.
- Escopo exclusivo em Pra Você; demais áreas e Android preservados.
- Build: apps/web/build-r436.mjs; gate: apps/web/build-r436-official.mjs; regressão: apps/web/test-r436.mjs.

## 1.0.225 — r434 (2026-10-02)

- Descobrir > Pra Você: corrigido o primeiro clique que ainda podia entregar a aba ao renderer legado e resultar em tela preta.
- O estado discover263 agora é definido para foryou antes da execução do owner r309.
- Trocar, Watchlist e Visto continuam no owner r309.
- Escopo exclusivo em Pra Você; demais áreas e Android preservados.
- Build: apps/web/build-r434.mjs; gate: apps/web/build-r434-official.mjs; regressão: apps/web/test-r434.mjs.

## 1.0.224 — r433 (2026-10-01)
- **Descobrir > Pra Você:** corrigida a tela preta causada pelo estado `discover263` capturado antes do boot.
- r309 passa a resolver dinamicamente o estado e os owners do Descobrir depois da inicialização.
- **Trocar**, **Watchlist** e **Visto** permanecem no renderer único r309.
- Escopo exclusivo em Pra Você; Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.
- Build: `apps/web/build-r433.mjs`; gate: `apps/web/build-r433-official.mjs`; regressão: `apps/web/test-r433.mjs`.

## 1.0.223 — r432 (2026-10-01)
- **Descobrir > Pra Você:** removido o reload legado r386 que ainda podia reiniciar a aplicação.
- Removidos os owners legados r395/r396 do bundle final.
- Removidos os gatilhos de entrada/repaint de Pra Você dos runtimes r397/r403/r404/r406/r407/r408.
- Eventos de dados e conexão não podem mais reconstruir Pra Você automaticamente enquanto a aba está ativa.
- **r309 permanece como único renderer e owner das ações Watchlist, Visto e ↻ Trocar.**
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

## 1.0.222 — r431 (2026-10-01)
- **Descobrir > Pra Você:** corrigido o carregamento preso em “Montando recomendações…”; `loadRecent296` deixou de bloquear a montagem.
- Removido auto-refresh por eventos `cinetracker:data-changed`/online; a tela só é reconstruída por entrada explícita, navegação ou ação do usuário.
- **Trocar** permanece no renderer único r309 e o clique da aba impede owners legados de repintarem o bloco.
- Escopo exclusivo em Pra Você; demais áreas preservadas.

## 1.0.219 — r428 (2026-10-01)
- **Descobrir > Pra Você:** r428 assume a composição visível do bloco.
- Recria as ações quando o renderer legado remove a linha de botões.
- **Trocar** volta a aparecer e delega ao handler nativo r388.
- Cards ausentes acionam o loader/renderizador atual do Pra Você.
- Escopo exclusivo em Pra Você; demais áreas preservadas.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.218 — r427 (2026-10-01)
- **Descobrir > Pra Você:** reconhece o renderer r388 que ainda podia vencer no DOM real.
- Recupera o carregamento dos cards pelo owner r388 quando ele é o renderer visível.
- Reativa **↻ Trocar** sem substituir o handler nativo, mantendo a ação funcional.
- Escopo exclusivo em Pra Você; Home, Perfil, Esportes e Android preservados.

## 1.0.217 — r426 (2026-10-01)
- Perfil > Histórico diário oferece **↶ Desmarcar visto** por item.
- Descobrir > Pra Você usa um único owner de **Trocar** para os botões visíveis.
- Perfil mantém uma única autoridade para as estatísticas esportivas após alterações de dados.
- Fórmula 1 usa **vistos / episódios já exibidos** da temporada corrente.
- Android preservado em **1.0.20 / versionCode 10062**.

## 1.0.216 — r425 (2026-10-01)
- Home Séries deixa de ficar visualmente vazia durante o carregamento.
- Fórmula 1 passa a exibir **1.280 episódios**; com 77 vistos, ficam **1.203 restantes**.
- Pra Você altera somente o slot clicado em Visto/Watchlist/Trocar, sem repaint global.
- Perfil converge estatísticas esportivas para `cinetracker_sport_stats_v421`.
- Android preservado em **1.0.20 / versionCode 10062**.

## 1.0.215 — r424 (2026-10-01)
- Home Séries inicia diretamente na composição correta de **Assistir a seguir**, sem expor o fim do Histórico durante o carregamento.
- Fórmula 1, Raw e SmackDown são tratados como séries recorrentes na Home quando há próximo episódio disponível.
- Perfil usa os contadores canônicos de tempo de Séries e Esportes; o runtime F1 sincronizado aparece nos dois contabilizadores.
- Listas de Séries e Filmes do Perfil são verticais, sem arraste lateral; listas longas usam **Ver mais**.
- Android preservado em **1.0.20 / versionCode 10062**.

## 1.0.214 — r423 (2026-10-01)
- **Fórmula 1 (media_id=865) passa a ter um owner único e efetivo nas três superfícies reais:** detalhe da Série, Esportes e F1 Hub delegam diretamente para a autoridade r423, removendo a corrida entre owners r416/r417/r422.
- **Série:** o handler lexical real de episódio intercepta somente Fórmula 1; o card/progresso muda imediatamente por Optimistic UI e a persistência grava também o evento esportivo correspondente.
- **Esportes:** o fluxo real r255 (cinetracker_sport_mark_watched_v1) passa a sincronizar Fórmula 1 com o episódio da série; os demais esportes continuam usando exatamente o writer anterior.
- **F1 Hub:** o capture handler real chama r423 diretamente; marcar/desmarcar grava o mesmo estado de episódio + esporte e repinta pelo estado da série.
- A tabela canônica f1_episode_map_v423 alinha temporada/round/session com o número exato do episódio usado pela série. cinetracker_f1_reconcile_v423 corrige divergências antigas sem repetir gravações de tempo já existentes.
- O runtime da sessão entra nos **dois contabilizadores**: tempo de Série e tempo de Esportes.
- Sem full-page reload, MutationObserver, setInterval, while(true) ou recursão ilimitada. Android permanece **1.0.20 / 10062** e não foi alterado.

Build: apps/web/build-r423.mjs; gate: apps/web/build-r423-official.mjs; regressão: apps/web/test-r423.mjs; migration: 20261001220000_r423_f1_hard_sync.sql.
## 1.0.213 — r422 (2026-10-01)
- Fórmula 1 passa a ter sincronização dupla e atômica: cada sessão é o episódio correspondente da série `media_id=865` e, ao mesmo tempo, um evento assistido em Esportes.
- Marcar/desmarcar pelo detalhe da série, pela tela de Esportes ou pelo F1 Hub converge em `cinetracker_f1_watch_sync_v422`; o estado de uma superfície reaparece nas outras sem full-page reload.
- O tempo da sessão é contabilizado nos dois domínios: histórico/tempo de séries e histórico/tempo de esportes. O contador de Esportes volta a incluir Fórmula 1.
- F1 Hub e detalhe da série mantêm Optimistic UI e rollback em falha; o fluxo de Esportes é interceptado somente para `formula_1`, preservando os demais esportes.
- Perfil, Descobrir e filtros de recomendação da r421 não tiveram layout ou regras alterados. Android permanece 1.0.20 / 10062.

Build: `apps/web/build-r422.mjs`; gate: `apps/web/build-r422-official.mjs`; regressão: `apps/web/test-r422.mjs`; migration: `20261001210000_r422_f1_dual_series_sports_sync.sql`.

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

## Web 1.0.208 / r417

- **Home Séries:** só aparece depois que **Assistir a seguir** e a altura real da Home estabilizam; não mostra mais o fim do Histórico antes de ancorar.
- **Descobrir > Pra Você:** o DOM efetivamente visível recebe **↻ Trocar** nos 7 slots populados, inclusive após repaint legado tardio.
- **Perfil:** layout preservado; os números de **Tempo assistido** e **Eventos assistidos** em Esportes são reidratados por `cinetracker_sport_stats_v1`.
- **Fórmula 1:** continua sendo a série importada `media_id=865`; cada sessão marcada é um episódio e muda de estado imediatamente, sem reload.

Build: `apps/web/build-r417.mjs`; gate: `apps/web/build-r417-official.mjs`; regressão: `apps/web/test-r417.mjs`.

## Web 1.0.207 / r416

- **Perfil:** nenhuma mudança visual; snapshot persistente por usuário entra no primeiro paint e o payload canônico `cinetracker_profile_v380` revalida em segundo plano.
- **Descobrir > Pra Você:** a r411 é reafirmada como renderer final e os sete slots populados mantêm o botão nativo **↻ Trocar** visível e funcional.
- **Fórmula 1:** as sessões da página tratada como série agora marcam **Assistido** de forma otimista, persistem como episódio da série importada e sincronizam o estado canônico de sessão F1.
- Home/Perfil são invalidados localmente após a marcação, sem reload global.

Build: `apps/web/build-r416.mjs`; gate: `apps/web/build-r416-official.mjs`; regressão: `apps/web/test-r416.mjs`.

## Web 1.0.206 / r415

- **Home Séries:** não mostra mais o Histórico antigo antes de ir para **Assistir a seguir**. A entrada espera a geometria estabilizar, alinha uma única vez e só então exibe a lista.
- **Descobrir > Pra Você:** **↻ Trocar** é inserido na própria linha de botões que está visível no DOM, cobrindo Diário + 3 Watchlist + 3 de 100% Novos sem depender do painter que venceu a corrida.
- **Perfil:** nenhuma mudança visual. O primeiro paint reaproveita cache quando disponível e a atualização principal usa apenas `cinetracker_profile_v380`; chamadas legadas pesadas deixam de controlar a entrada do Perfil.
- Timers são finitos, ações permanecem locais e não há full-page reload.

Build: `apps/web/build-r415.mjs`; gate: `apps/web/build-r415-official.mjs`; regressão: `apps/web/test-r415.mjs`.

## Web 1.0.205 / r414

- **Escopo exclusivo:** corrigir os botões **↻ Trocar** ausentes em `Descobrir > Pra Você`.
- O reparo atua tanto no DOM canônico r411 quanto no DOM legado que ainda pode vencer o paint visual, sem reconstruir Home ou outras telas.
- Indicação do Dia e 100% Novos ficam com **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist fica com **✓ Visto + ↻ Trocar**.
- O clique em **Trocar** delega primeiro ao owner r411 e mantém fallbacks locais existentes, sem reload de página.
- Dados, filtros globais de elegibilidade, exclusão de Reality, Home, Perfil, Esportes, Top 10, backend e Android permanecem exatamente na r413.

Build: `apps/web/build-r414.mjs`; gate: `apps/web/build-r414-official.mjs`; regressão: `apps/web/test-r414.mjs`.

## Web 1.0.204 / r413

- Home Séries entra sem mostrar o fim do Histórico: o conteúdo da Home é revelado somente depois do alinhamento síncrono em **Assistir a seguir**; Histórico permanece acessível acima por rolagem.
- `Descobrir > Pra Você` usa r411 como owner final e garante **↻ Trocar** em todos os slots com item: Diário e 100% Novos = **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist = **✓ Visto + ↻ Trocar**.
- A elegibilidade global preserva **runtime mínimo de 40 min**, bloqueio de **YouTube/web originals**, **novelas/Soap** e passa a excluir também **Reality / Reality TV (TMDB 10764)**.
- Fresh, Watchlist recomendada e Home Séries usam os RPCs v413; as abas públicas usam o filtro cliente r413 e pulam silenciosamente candidatos bloqueados.
- Sem full-page reload, observer global, intervalo contínuo ou loop ilimitado.

Build: `apps/web/build-r413.mjs`; gate: `apps/web/build-r413-official.mjs`; regressão: `apps/web/test-r413.mjs`; migration: `20260930170000_r413_reality_home_entry_foryou_actions.sql`.

## Web 1.0.203 / r412

- Recomendações e descoberta agora aplicam um filtro único e estrito: **runtime mínimo de 40 min para filmes/especiais**, exclusão de **YouTube/web originals** e exclusão de **novelas/Soap (TMDB 10766)**.
- `Pra Você` usa os RPCs v412 para Filme/Série/Anime, mantém exclusão de vistos/Watchlist/WWE e substitui candidatos bloqueados pelo próximo elegível.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados validam candidatos com detalhes TMDB de forma limitada e cacheada antes do paint.
- Home Séries delega para `cinetracker_home_series_v412`; Raw/SmackDown continuam disponíveis no fluxo de episódios.
- Os 7 slots de `Pra Você` mantêm **Trocar** visível e ativo; Diário/100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar** e Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Sem full-page reload, observer global, intervalo contínuo ou loop ilimitado.

Build: `apps/web/build-r412.mjs`; gate: `apps/web/build-r412-official.mjs`; regressão: `apps/web/test-r412.mjs`; migration: `20260930143000_r412_global_recommendation_eligibility.sql`.

## Web 1.0.202 / r411

- **Escopo exclusivo:** Descobrir > Pra Você.
- A r411 remove o RPC composto v396 do caminho ativo porque a produção registrou `statement timeout` nele.
- Filme/Série/Anime de **Da sua Watchlist** e **100% Novos** são carregados por seis RPCs diretos em paralelo, com timeout delimitado de 12 s e pintura progressiva.
- Os pools válidos permanecem filtrados pelas autoridades server-side existentes; nenhum dado de Home, Perfil, Esportes ou Top 10 foi alterado.
- Indicação do Dia e 100% Novos: **+ Watchlist + ✓ Visto + ↻ Trocar**. Da sua Watchlist: **✓ Visto + ↻ Trocar**.
- Botões ficam explicitamente ativos; `Trocar` altera somente o slot clicado e não usa reload, observer contínuo, intervalo ou loop ilimitado.

Build: `apps/web/build-r411.mjs`; gate: `apps/web/build-r411-official.mjs`; regressões: `apps/web/test-r411.mjs` e `apps/web/test-r411-browser.mjs`.

## Web 1.0.201 / r410

- **Escopo exclusivo:** Descobrir > Pra Você.
- O clique real da aba r319 deixa de executar o builder legado r309; os closures locais de carga e paint delegam diretamente para a autoridade r410/r409 antes de qualquer HTML antigo.
- O bundle final já não contém o painter r288; r410 bloqueia os caminhos legados r309/r319 que ainda estão presentes e conseguiam sobrescrever o resultado.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Os botões usam o estilo interativo `chip`, ficam explicitamente habilitados e mantêm ações locais/otimistas sem full-page reload.
- Fontes de dados preservadas: `cinetracker_discover_foryou_v396`, com fallback v396/v387.
- Home, Séries, Perfil, Esportes, Top 10, Configurações, backend e Android não foram alterados.

Build: `apps/web/build-r410.mjs`; gate: `apps/web/build-r410-official.mjs`; regressões: `apps/web/test-r410.mjs` e `apps/web/test-r410-browser.mjs`.

## Web 1.0.199 / r408

## Web 1.0.200 / r409

- Home: abertura alinhada semanticamente em **Assistir a seguir** / **Assistir a seguir / Watchlist** somente depois do paint real; não restaura mais o fim do Histórico.
- Episódios: marcação como assistido com atualização otimista imediata da série, contador, próximo episódio e Histórico; persistência e reconciliação ocorrem em segundo plano, com rollback em falha.
- Descobrir > Pra Você: renderer único r409, RPC v396 em corrida com pools de fallback de Watchlist e 100% Novos, evitando ficar preso em **Buscando indicação…**.
- Ações: Indicação do Dia e 100% Novos exibem **+ Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**.
- Estabilidade: timers e rede delimitados, trava por ação, sem MutationObserver global, setInterval agressivo ou full-page reload.


- **Home:** entrada e retorno ancoram uma única vez em **Assistir a seguir** depois do paint real; Histórico continua acessível acima.
- **Home / Filmes:** Watchlist dispara diretamente o loader r406/v405 e não depende de repaint tardio.
- **Descobrir / Pra Você:** r408 mantém **Trocar** nos sete slots mesmo após painters legados tardios.
- **Estabilidade:** somente timers finitos; sem observer global, interval, loop infinito ou full-page reload.

Build: `apps/web/build-r408.mjs`; gate: `apps/web/build-r408-official.mjs`; regressões: `apps/web/test-r408.mjs` e `apps/web/test-r408-browser.mjs`.

## Web 1.0.198 / r407

- **Home / entrada:** Home abre e retorna em **Assistir a seguir**, mantendo o Histórico acima para acesso por rolagem. A restauração automática do navegador deixa de empurrar a viewport para o fim do Histórico.
- **Home / Filmes:** o clique real da semi-aba passa a acionar imediatamente o loader paginado r406/v405; a Watchlist não depende mais de repaint tardio para aparecer.
- **Descobrir / Pra Você:** um único owner consome `cinetracker_discover_foryou_v396` e bloqueia renderers r404/r406 de sobrescreverem os cards finais.
- **Botões:** Indicação do Dia e 100% Novos = **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist = **✓ Visto + ↻ Trocar**.
- **Estabilidade:** bursts tardios de até 46 s foram removidos; sem observer global, interval, loop infinito ou full-page reload.
- **Escopo:** regras de Séries, Perfil, Esportes, Top 10, Configurações e Android permanecem inalteradas.

Build de hospedagem: `apps/web/build-r407.mjs`; gate oficial: `apps/web/build-r407-official.mjs`; regressões: `apps/web/test-r407.mjs` e `apps/web/test-r407-browser.mjs`.

## Web 1.0.197 / r406\n\n- Home Séries volta a usar a contagem canônica de episódios recentes da r403/r402; Raw e SmackDown com episódio atual não visto entram em **Assistir a seguir** sem transformar backlog histórico em pendência.\n- Home Filmes mantém paginação SQL v405, mas a pintura da Watchlist passa a seguir a view realmente visível, evitando o bloco vazio por estado legado de aba.\n- Descobrir > Pra Você garante os botões completos: **+ Watchlist / ✓ Visto / ↻ Trocar** nos cards novos e **✓ Visto / ↻ Trocar** em Da sua Watchlist.\n- Sem reload global, MutationObserver global, setInterval agressivo ou loop infinito.\n\n## Web 1.0.196 / r405

- **Home / Filmes:** o clique real herdado da r388 agora delega para a autoridade r405 antes do loader legado. A Watchlist usa `cinetracker_home_movies_v405` com paginação SQL real de 120 itens; produção validada com **1.381 filmes**, 120 itens na primeira página e 120 na segunda.
- **Correção da causa do loading infinito:** o loader antigo convertia `media_id` UUID com `Number(...)`, transformava IDs válidos em zero e descartava toda a Watchlist mesmo após RPC 200. Esse caminho deixa de ser executado pela Home Filmes.
- **Descobrir / Pra Você:** os closures efetivamente acionados em produção (`loadForYou321`, `paintForYou336`, `switchDiscover336`) e o loader/painter r388 passam a delegar diretamente para r405. O renderer antigo não pode mais apagar **Trocar** depois que os cards aparecem.
- **Pra Você / dados:** Filme, Série e Anime de `Da sua Watchlist` e `100% Novos` são carregados em paralelo pelas autoridades server-side `cinetracker_discover_watch_unseen_v396` e `cinetracker_discover_fresh_v387`.
- **Ações:** Indicação do Dia e 100% Novos mantêm **+ Watchlist + Visto + Trocar**; Da sua Watchlist mantém **Visto + Trocar**. As ações seguem locais/otimistas, sem reload global.
- **Escopo:** Raw/SmackDown, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

Build de hospedagem: `apps/web/build-r405.mjs`; gate oficial: `apps/web/build-r405-official.mjs`.

## Web 1.0.195 / r404

- **Home / Filmes:** Watchlist de 1.381 filmes usa `cinetracker_home_movies_v404` paginado em blocos de 120, com primeiro paint rápido, total exato e carregamento restante delimitado.
- **Descobrir / Pra Você:** o owner usa o container visível real e restaura todos os botões: **+ Watchlist + Visto + Trocar** em Diário/100% Novos e **Visto + Trocar** em Da sua Watchlist.
- **Raw / SmackDown:** o payload separa backlog histórico total do único episódio recente pendente; o recente controla o bucket Continuar/Em dia, enquanto o backlog continua exibido na contagem.
- **Sem reload / anti-freeze:** ações locais, paginação limitada e recuperação finita; sem reload global, observer permanente ou loop infinito.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

Build de hospedagem: `apps/web/build-r404.mjs`; gate oficial: `apps/web/build-r404-official.mjs`.

## Web 1.0.194 / r403

- **Home / Séries:** Raw e SmackDown com episódio recente disponível passam para **Assistir a seguir / Continuar assistindo** via `cinetracker_home_series_v403`; backlog histórico continua ignorado.
- **Home / Filmes:** `cinetracker_home_movies_v402` segue leve, com normalização robusta do payload, timeout ampliado e recuperação finita da seção. A fonte de produção foi validada com **1.381** filmes.
- **Anti-congelamento:** renderização em lotes só continua enquanto a semi-aba correspondente está ativa; o runtime r402 anterior é aposentado para não disputar renderização com r403.
- **Descobrir / Pra Você:** Diário e 100% Novos exibem **Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**. O layout usa grid fixo para que o terceiro botão não seja cortado.
- **Sem reload:** mutações continuam por estado local/Optimistic UI, sem `window.location.reload()` ou `router.refresh()`.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

Build de hospedagem: `apps/web/build-r403.mjs`; gate oficial: `apps/web/build-r403-official.mjs`.

## Web 1.0.193 / r402

- **Home / contagem de episódios:** `cinetracker_home_series_v402` usa a contagem de episódios efetivamente liberados pelo TMDB como autoridade para séries normais. Episódios do catálogo sem `air_date` não entram mais como disponíveis.
- **Contagem exibida:** o texto “episódios disponíveis para ver” usa diretamente `available_episodes` do payload v402, sem recalcular pelo renderer legado.
- **Raw / SmackDown:** preservam a regra especial de séries recorrentes; backlog antigo continua ignorado e somente episódios recentes, com data real e não vistos, entram como disponíveis.
- **Home / Filmes:** `cinetracker_home_movies_v402` mantém o payload enxuto e normaliza respostas RPC em objeto, array unitário ou envelope `data`; **Assistir a seguir / Watchlist** preserva a lista completa.
- **Descobrir / Pra Você:** o r402 assume também os owners vivos `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`, impedindo o loader antigo de restaurar “Buscando indicação…” depois do payload canônico.
- **Estabilidade:** renderização continua fatiada por idle/frame; recuperação é finita e delimitada, sem `MutationObserver`, `setInterval`, `window.location.reload()` ou `router.refresh()`.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

Build de hospedagem: `apps/web/build-r402.mjs`; gate oficial: `apps/web/build-r402-official.mjs`.

## Web 1.0.192 / r401

- **Home Séries:** `cinetracker_home_series_v401` calcula episódios disponíveis pela quantidade realmente lançada no TMDB menos o progresso assistido, sem depender de catálogo parcial.
- **Próximo episódio:** séries normais usam a primeira lacuna real da temporada liberada; o refresh v5 completa a temporada necessária no cache.
- **Raw / SmackDown:** continuam sem backlog histórico e mostram o episódio recente não visto em **Em dia**.
- **Home Filmes:** `cinetracker_home_movies_v401` remove `raw_tmdb` do payload; a Watchlist de 1.381 filmes fica muito menor e é renderizada em lotes ociosos.
- **Anti-congelamento:** listas extensas são pintadas em lotes de 10 usando `requestIdleCallback` com fallback por frame; sem observer global nem loop contínuo.
- **Descobrir / Pra Você:** r401 assume o renderer legado, reconhece a aba pelo DOM e impede que loaders antigos restaurem `Buscando indicação…` após o payload v396.
- **Ações:** Visto, Watchlist e Trocar permanecem otimistas/locais, sem full-page reload.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android preservados.

Build de hospedagem: `apps/web/build-r401.mjs`; gate oficial: `apps/web/build-r401-official.mjs`.

## Web 1.0.191 / r400

- **Boot autenticado:** Home e `Descobrir > Pra Você` só executam RPC depois que a sessão foi restaurada e o DOM da rota existe; respostas vazias geradas antes do login deixam de virar estado final.
- **Home Séries:** `cinetracker_home_series_v391` volta a ser a autoridade; as cinco seções são pintadas em lotes por frame e o primeiro enquadramento fica em **Assistir a seguir**, mantendo o Histórico acima.
- **Home Filmes:** `cinetracker_watchlist_full_v376` é carregado após autenticação e a lista completa é pintada por `requestAnimationFrame`, sem bloquear a main thread.
- **Raw / SmackDown:** o refresh autenticado de TV roda em segundo plano e atualiza a temporada corrente antes de reaplicar a autoridade da Home.
- **Descobrir / Pra Você:** `cinetracker_discover_foryou_v396` alimenta diretamente Indicação do Dia, Da sua Watchlist e 100% Novos, com botões Visto/Watchlist/Trocar e trava síncrona por slot.
- **Estabilidade:** r400 parte da base r396 e não inclui o `MutationObserver` global introduzido em r397.
- **Sem reload:** nenhuma mutação usa `window.location.reload()` ou `router.refresh()`.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android preservados.

Build de hospedagem: `apps/web/build-r400.mjs`; gate oficial: `apps/web/build-r400-official.mjs`.

## Web 1.0.190 / r399

- **Travamento inicial:** removido o observer global do r398 que reagia a cada mutação do DOM e reentrava na Home, criando ciclo de renderização, novos timers e novas mutações.
- **Boot:** a entrada passa a usar probe finito/idempotente; nenhuma observação contínua de toda a árvore do documento.
- **Home Séries:** usa `cinetracker_home_series_v391` no primeiro carregamento; atualização de Raw/SmackDown fica em segundo plano e possui trava/TTL.
- **Home Filmes:** Watchlist mantém fallback `cinetracker_watchlist_full_v376`, mas a renderização dos itens passa a ser fatiada por `requestAnimationFrame` para não monopolizar a main thread.
- **Descobrir / Pra Você:** owner r399 captura a aba antes dos handlers legados, usa `cinetracker_discover_foryou_v396` e mantém botões locais/otimistas.
- **Sem reload:** Visto, Watchlist, Trocar e navegação da correção não usam full-page reload.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android preservados.

Build de hospedagem: `apps/web/build-r399.mjs`; gate oficial: `apps/web/build-r399-official.mjs`.

## Web 1.0.189 / r398

- **Home / entrada:** abre ancorada no bloco principal; Histórico continua escondido acima e acessível ao rolar para cima.
- **Home / Filmes:** fallback direto em `cinetracker_watchlist_full_v376` impede **Assistir a seguir / Watchlist** de ficar vazio quando o loader anterior não preenche memória.
- **Home / Raw e SmackDown:** refresh atualiza a temporada corrente e reaplica `cinetracker_home_series_v391`; séries recorrentes continuam em **Em dia**, mostrando o episódio recente não visto.
- **Descobrir / Pra Você:** owner independente r398 consome `cinetracker_discover_foryou_v396` e pinta cards/botões sem depender do estado validado legado.
- **Ações:** Visto, Watchlist e Trocar usam estado local otimista e trava por slot, sem full-page reload.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android preservados.

Build de hospedagem: `apps/web/build-r398.mjs`; gate oficial: `apps/web/build-r398-official.mjs`.

## Web 1.0.188 / r397

- **Home / entrada:** Histórico permanece acima e acessível ao rolar para cima, mas o primeiro enquadramento ocorre somente depois que o bloco principal foi realmente pintado.
- **Home / Filmes:** a Watchlist completa devolvida por cinetracker_home_movies_v393 é renderizada de forma defensiva e em lotes; uma falha de um card legado não apaga a lista inteira.
- **Home / séries recorrentes:** Raw e SmackDown continuam em Em dia, evitando backlog histórico, porém exibem o próximo episódio recente não visto com ação Assistido.
- **TV refresh v3:** ct-refresh-tv-state-user prioriza séries recorrentes e atualiza diretamente a temporada atual/episódios recentes.
- **Descobrir / Pra Você:** r397 rebinda r395/r396 e recupera o entrypoint real que ainda podia ficar preso em Buscando indicação…
- **Pra Você / dados:** cinetracker_discover_foryou_v396 continua como payload canônico; fallback é limitado e server-side.
- **Ações:** Visto, Watchlist e Trocar permanecem no renderer otimista existente, sem full-page reload.
- **Escopo:** Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build de hospedagem: apps/web/build-r397.mjs; gate oficial: apps/web/build-r397-official.mjs.

## Web 1.0.187 / r396

- **Escopo exclusivo:** corrige somente `Descobrir > Pra você`; Home, Perfil, Esportes, Top 10, Configurações e Android permanecem intocados.
- **Causa do loading:** o r388 fazia várias chamadas e uma segunda auditoria cliente para cada pool; qualquer atraso/falha em `cinetracker_discover_filter_v391` mantinha os 7 slots em `Buscando indicação…`.
- **Carga canônica única:** `cinetracker_discover_foryou_v396` entrega Watchlist + 100% Novos de Filme/Série/Anime em uma única chamada autenticada.
- **Watchlist não vista:** `cinetracker_discover_watch_unseen_v396` elimina episódios/filmes já vistos e estados AlreadySeen/Completed/InProgress/UpToDate antes do payload sair do banco.
- **100% Novos:** continua usando a autoridade server-side `cinetracker_discover_fresh_v387`, que já exclui vistos e Watchlist; a auditoria redundante do cliente sai do caminho crítico.
- **Indicação do Dia:** nasce do pool Fresh já validado no mesmo payload.
- **Carregamento finito:** timeout único de 5 s; sucesso pinta os 7 slots imediatamente e falha encerra em estado explícito, sem skeleton infinito.
- **Ações:** Visto, Watchlist e Trocar continuam no estado local/Optimistic UI existente, sem full-page reload.
- **Backend:** migration `r396_discover_foryou_single_payload` aplicada no Supabase de produção.

Build de hospedagem: `apps/web/build-r396.mjs`; gate oficial: `apps/web/build-r396-official.mjs`.

## Web 1.0.186 / r395

- **Escopo exclusivo:** corrige somente `Descobrir > Pra você`; Home, Perfil, Esportes, Top 10, Configurações e Android ficam preservados.
- **Causa confirmada em produção:** a sessão da captura ainda executava o caminho legado `watchlist_full_v119 / shown_recommendations_v296 / cinetracker_discover_filter_v333`, enquanto o renderer visível já era r388. Loader e renderer trabalhavam com autoridades diferentes e os cards ficavam presos em `Buscando indicação…`.
- **Owner único:** os entrypoints reais de navegação/tab (`r321`, `r336`, aliases r378/r382/r383/r384/r385 e render de Descobrir) passam a encaminhar `Pra você` para o loader r388.
- **Dados corretos:** `Da sua Watchlist` usa `cinetracker_discover_watch_v391`; `100% novos` usa `cinetracker_discover_fresh_v387` + `cinetracker_discover_filter_v391`, mantendo exclusão estrita de vistos/watchlist.
- **Carregamento finito:** um único retry limitado é permitido quando nenhum card real foi pintado; depois disso o slot encerra em estado vazio explícito, sem skeleton infinito.
- **Ações:** Visto, Watchlist e Trocar continuam via estado local/Optimistic UI e sem full-page reload.

Build de hospedagem: `apps/web/build-r395.mjs`; gate oficial: `apps/web/build-r395-official.mjs`.

## Web 1.0.185 / r394

- **Home:** a posição inicial passa a ser aplicada novamente depois que Séries e Histórico terminam a carga; o Histórico continua acima e acessível ao rolar para cima, sem empurrar `Assistir a seguir` para fora da entrada.
- **Home / cache:** o snapshot válido da sessão é reaproveitado no primeiro paint e reconciliado em seguida com as autoridades atuais.
- **Pra Você:** todos os entrypoints legados (`r321/r382/r383/r384/r385`) passam a apontar para o owner r388. O renderer e o loader voltam a operar sobre o mesmo estado.
- **Pra Você / dados:** `100% novos` continua usando `cinetracker_discover_fresh_v387` + auditoria `cinetracker_discover_filter_v391`; `Da sua Watchlist` continua usando `cinetracker_discover_watch_v391`.
- **Sem reload:** Visto, Watchlist e Trocar permanecem por estado local/Optimistic UI.
- **Escopo congelado:** Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build de hospedagem: `apps/web/build-r394.mjs`; gate oficial: `apps/web/build-r394-official.mjs`.

## Web 1.0.184 / r393

- **Home:** Histórico continua renderizado antes do conteúdo, mas a entrada fica ancorada em Assistir a seguir / Watchlist; rolar para cima revela o Histórico.
- **Home / Filmes:** novo RPC `cinetracker_home_movies_v393` entrega somente os filmes e campos usados na tela, com prefetch em segundo plano e fallback v376.
- **Pra Você:** 100% Novos usa banco primeiro, auditoria pessoal v391 e TMDB apenas como fallback; cache inicial audita somente os cards correntes para não bloquear o paint.
- **Sem reload:** ações de Visto, Watchlist e Trocar continuam por estado local/Optimistic UI.
- **Escopo congelado:** Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build de hospedagem: `apps/web/build-r393.mjs`; gate oficial: `apps/web/build-r393-official.mjs`.

## Web 1.0.183 / r392

- **Home Séries:** remove o caminho active_v380 e qualquer fusão de estado velho; cinetracker_home_series_v391 passa a ser a única autoridade do bucket.
- **Episódios:** o card da Home não delega mais ao renderer assíncrono legado; título, temporada/episódio, data e nota do payload entram no mesmo paint.
- **Visto sem reload:** o writer r392 intercepta a ação antes do writer legado, aplica Optimistic UI, persiste e reconcilia Séries + Histórico sem reload/router.refresh.
- **Stuart:** após T1E10 assistido, sai de Continuar e entra em Em dia; o T1E10 entra no Histórico.
- **Histórico:** invalidação passa a ocorrer mesmo quando o episódio/filme é marcado fora da Home; respostas antigas não podem sobrescrever uma geração nova.
- **Home Filmes:** Histórico recebe a mesma invalidação; a Watchlist completa só é buscada ao abrir Filmes, sem disputar rede com Séries/Histórico.
- **Pra Você:** cache existente passa por uma única auditoria estrita em lote e pinta progressivamente; o top-up TMDB permanece limitado e itens vistos/Watchlist continuam bloqueados.
- Escopo congelado: Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build oficial: apps/web/build-r392-official.mjs; owner: apps/web/runtime-r388-home-foryou-final.js.
Build de hospedagem/Vercel: `apps/web/build-r392.mjs`; regressões Chromium ficam no gate GitHub, fora do ambiente de deploy.
## Web 1.0.182 / r391

- **Home Séries:** primeiro paint sem TMDB por card; buckets completos vêm da autoridade v391.
- **Juntando poeira:** estado rápido não sobrescreve mais o bucket autoritativo; regra de 30 dias reaplicada no merge.
- **Stuart:** T1E10 está no catálogo local e chega com metadados no primeiro payload.
- **Histórico:** autoridade v391 otimizada de ~8 s para ~125 ms no conjunto real.
- **Home Filmes:** Watchlist completa e seis filtros preservados.
- **Pra Você:** Fresh usa TMDB limitado + auditoria v391; itens vistos/watchlist são eliminados antes do card aparecer.
- **Harry/Azkaban:** aliases importados + TMDB 673 são unidos na auditoria, impedindo que um registro visto duplicado escape.
- Escopo congelado: Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build oficial: `apps/web/build-r391-official.mjs`; owner: `apps/web/runtime-r388-home-foryou-final.js`.

## Web 1.0.181 / r390

- **Escopo fechado:** somente Home e Descobrir → Pra Você.
- **Home Séries:** active-first v380 + deduplicação lógica + enriquecimento curto antes do primeiro paint; RPC completa r389 apenas completa o restante em background.
- **Home Filmes:** Watchlist completa v376, total real (gate com 1.382) e seis ordenações.
- **Pra Você:** caminho rápido v387 + auditoria r389; Harry/Azkaban 673 é bloqueado como Visto.
- **Ações:** Diário/Fresh = Watchlist + Visto + Trocar; Watchlist = Visto + Trocar; coração contido na capa.
- Perfil, Esportes, Top 10, Configurações e Android permanecem intocados.

Build oficial: `apps/web/build-r390-official.mjs`; runtime funcional: `apps/web/runtime-r388-home-foryou-final.js`.

## Web 1.0.178 / r387

- **Home:** abre em Assistir a seguir, com Histórico completo escondido acima.
- **Histórico:** sem teto de 50/100; filmes recentes posteriores ao antigo corte entram normalmente.
- **Pra Você:** uma única linha de ações, largura idêntica à capa e zero sobreposição.
- **100% Novos:** fallback v387 no Supabase antes do fallback TMDB, sempre mantendo exclusão de Vistos/Watchlist.
- **Escopo:** somente Home e Descobrir/Pra Você; demais áreas permanecem intocadas.

Build oficial: `apps/web/build-r387-official.mjs`.

## Web 1.0.177 / r386

- **Escopo estrito:** somente Home e Descobrir → Pra Você.
- **Owner funcional preservado:** comportamento r385 continua intacto.
- **Correção do vídeo:** a gravação estava executando r383; Home/Discover agora exigem HTML sem cache e verificam `release.json`/Service Worker para não permanecer em bundle antigo.
- **Gate r385 repetido:** Home completa, Watchlist 1.382 + filtros e Pra Você com botões/100% Novos continuam cobertos.
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

Build oficial: `apps/web/build-r386-official.mjs`; runtime: `apps/web/runtime-r386-home-discover-fresh-client.js`.

## Web 1.0.176 / r385

- **Home independente:** Séries, Histórico e Filmes carregam em paralelo; nenhum clique de aba é necessário para preencher Filmes.
- **Séries corretas no primeiro dado:** nova autoridade v385 agrega duplicatas, progresso e catálogo de episódios antes do card aparecer.
- **Filmes completos:** Watchlist v376 inteira, um único contador real e seis ordenações locais.
- **Pra Você estrito:** auditoria v385 fail-closed; visto/Watchlist não entra em 100% Novos.
- **Botões finais:** 3/2/3 em `.ct385-actions`, sem writers antigos; filtro interno duplicado removido e coração dentro do pôster.
- **Escopo:** somente Home e Descobrir/Pra Você. Perfil, Esportes, Top 10, Configurações e Android permanecem intocados.

Build oficial: `apps/web/build-r385-official.mjs`; runtime: `apps/web/runtime-r385-home-foryou-owner.js`.

## Web 1.0.175 / r384

- Home Séries com carga em etapas: Séries primeiro, Filmes apenas ao abrir a aba Filmes.
- Cache persistente e live patch limitado evitam metadados/novas séries aparecendo dezenas de segundos depois.
- Filmes continuam com Watchlist completa e seis ordenações locais.
- Pra Você remove o filtro duplicado, valida o card Fresh individualmente contra Visto/Watchlist/Favorito e fixa ações 3/2/3.
- Escopo estrito: nenhuma alteração em Perfil, Esportes, Top 10, Configurações ou Android.

## Web 1.0.174 / r383

- **Home rápida e completa:** séries visíveis vêm do RPC enxuto v383 com metadados de episódio já no primeiro paint; Stuart não entra tardiamente.
- **Filmes completos:** Watchlist v376 continua com todos os registros; o contador 240 legado é removido e o sort continua sobre a lista completa.
- **Pra Você estável:** sem filtro duplicado e sem usar a linha de ações legada; botões fixos em 3/2/3.
- **100% Novos:** auditoria em lote + validação final por mídia; visto/Watchlist/favorito não entra.
- **Escopo congelado:** Perfil, Configurações, animações e Esportes não foram tocados.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r383-official.mjs`; runtime: `apps/web/runtime-r383-home-foryou-authority.js`.

## Web 1.0.173 / r382

- **Perfil restaurado de verdade:** renderer r313/r316 original; nenhuma estrutura nova de Perfil.
- **Home restaurada:** composição original e Histórico/Continuar assistindo preservados; v382 só melhora dados do primeiro paint.
- **Filmes:** Watchlist completa e somente o contador real, sem o antigo 240 concorrente.
- **Pra Você:** auditoria v381 elimina vistos/Watchlist antes do render e fixa botões em 3/2/3 com Trocar.
- **Base:** r382 parte diretamente da r376 para excluir r377-r381 do bundle final.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r382-official.mjs`; runtime: `apps/web/runtime-r382-baseline-restore.js`.

## Web 1.0.172 / r381

- **Home:** autoridade completa v359 no primeiro paint, Histórico restaurado e patch curto de episódios ativos antes de exibir a primeira versão de rede.
- **Perfil:** visual/ordem original restaurados; somente a fonte rápida v380 permanece por baixo.
- **Pra Você:** auditoria v381 obrigatória, Harry/Azkaban bloqueado por alias e ações finais isoladas em 3/2/3.
- **Sem escopo extra:** Esportes e Android não foram alterados.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r381-official.mjs`; runtime: `apps/web/runtime-r381-restore-home-profile-foryou.js`.

## Web 1.0.171 / r380

- **Home Séries:** snapshot + patch ativo v380; Stuart e metadata ativa não dependem mais do payload monolítico.
- **Home Filmes:** total completo da Watchlist, sem cabeçalho 240 concorrente, com seis ordenações religadas.
- **Pra Você:** sem filtro duplicado; botões 3/2/3; Harry/Azkaban e aliases vistos são bloqueados pelo filtro v380.
- **Perfil:** RPC direto v380 sem dashboard monolítico.
- **Top 10/Favoritos:** cache local/prefetch e coração totalmente dentro da capa.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r380-official.mjs`; runtime: `apps/web/runtime-r380-home-profile-discover.js`.

## Web 1.0.170 / r379

- **Home estável:** sem Stuart/novas séries entrando dezenas de segundos depois; refresh fica para a próxima navegação.
- **Metadados visíveis rápidos:** hidratação imediata e limitada dos episódios já mostrados.
- **100% Novos estrito:** filtro indexado v322 antes do render; `movie:673` é caso obrigatório de regressão.
- **Perfil rápido:** RPC v379 executa o dashboard uma vez, usa cache de sessão e não substitui Perfil válido por timeout.
- **Watchlist do Perfil:** mesma autoridade completa v376.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r379-official.mjs`; runtime: `apps/web/runtime-r379-home-fresh-profile.js`.

## Web 1.0.170 / r379

- **Home Séries estável:** snapshot v359 instantâneo, sem r325/r332 movendo séries depois do primeiro paint.
- **Metadados:** nome/nota/data ausentes podem ser enriquecidos, mas sem alterar a seção da série.
- **100% Novos realmente novos:** validação servidor v379 bloqueia qualquer item conhecido, inclusive favoritos/liked.
- **Botões:** Fresh/Daily sempre 3 ações; Watchlist sempre 2, incluindo Trocar.
- **Perfil rápido:** quick stats primeiro; biblioteca detalhada em background e sem tela vermelha fatal.
- **Detalhe:** “Marcar como visto” não é mais interpretado como prova de Visto.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r379-official.mjs`; runtime: `apps/web/runtime-r379-stable-home-fresh-profile.js`.

## Web 1.0.169 / r378

- **Rollback da regressão r377:** Home volta ao payload v359 e mantém snapshot instantâneo entre rotas.
- **Home sem regressão de posição:** Séries abre em Assistir a seguir; Filmes abre em Assistir a seguir / Watchlist; históricos permanecem acima.
- **Pra Você isolado:** DOM e botões `ct378-*` não são mais alterados pelos writers antigos.
- **100% Novos:** placeholders não exibem botões soltos; Movie/Série/Anime são preenchidos em paralelo antes das ações aparecerem.
- **Ações locais:** Watchlist/Visto/Trocar não propagam para o card e Trocar muda só o slot clicado.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r378-official.mjs`; runtime: `apps/web/runtime-r378-regression-rollback.js`.

## Web 1.0.168 / r377

- **Watchlist completa e rica:** todos os registros por `media_id`, com ano, duração, gêneros e nota restaurados.
- **Filtro mobile seguro:** `select` nativo compacto; não abre filme nem outra rota e não recria os cards.
- **Home resiliente:** retorno usa payload v334 e mantém cache visível se o refresh falhar/der timeout.
- **Pra Você:** estado válido não some durante refresh, 100% Novos preenche Movie/Série/Anime em paralelo e botões capturam o toque antes do card.
- **Teste:** 1.382 cards + metadata rica + filtro sem vazamento + Fresh 3/3 + ações sem navegação.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r377-official.mjs`; runtime: `apps/web/runtime-r377-video-ground-truth.js`.

# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.182** | `r391-official-1.0.182` | Home autoritativa rápida + histórico ~125 ms + Pra Você estrito |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r313 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.166 / r375

- **Correção baseada no vídeo:** o reset absoluto para `0` foi removido porque expunha `Histórico recente`/`Filmes vistos`.
- **Início semântico:** Séries abre em `Assistir a seguir`; Filmes abre em `Assistir a seguir / Watchlist`.
- **Histórico preservado:** continua renderizado acima do ponto inicial e aparece somente ao rolar para cima.
- **Container-aware:** alinha o bloco principal tanto em scroll da janela quanto em container interno.
- **Teste:** ambos os sentidos de troca partem do rodapé e terminam no bloco principal, com Histórico comprovadamente acima do viewport.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r375-official.mjs`; runtime: `apps/web/runtime-r375-home-semantic-start.js`.

## Web 1.0.165 / r374

- **Troca de aba no topo:** alternar Séries ↔ Filmes zera a rolagem da janela e do container scrollável da Home.
- **Owner único de UX:** a r374 captura o clique antes dos antigos anchors que podiam reposicionar a página depois da troca.
- **Estado preservado:** a seleção continua sob a autoridade r371; a r374 controla apenas rolagem.
- **Sem puxão tardio:** o reset é reafirmado por um período curto de estabilização e cancelado no primeiro gesto de rolagem do usuário.
- **Teste:** valida ida Séries → Filmes e volta Filmes → Séries partindo do rodapé, com janela e container em `0` após a troca.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r374-official.mjs`; runtime: `apps/web/runtime-r374-home-tab-scroll-reset.js`.

## Web 1.0.164 / r373

- **Watchlist completa na Home:** usa `cinetracker_watchlist_full_v119`, sem teto de 120 títulos.
- **Contador real:** o cabeçalho de `Assistir a seguir / Watchlist` mostra o total completo carregado.
- **DOM leve:** 80 linhas por página com `Mostrar mais`; a paginação visual não limita a busca nem o contador.
- **Ordenação compacta:** botão `⇅` junto ao contador abre seis opções — último/primeiro adicionado, último/primeiro lançado, A-Z e Z-A.
- **Sem reload:** a ordenação usa apenas estado local e reorganiza imediatamente os cards.
- **Teste:** payload sintético de 155 filmes valida total acima de 120, as seis ordens e URL inalterada.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r373-official.mjs`; runtime: `apps/web/runtime-r373-home-watchlist-sort.js`.

## Web 1.0.163 / r372

- **Ações estáveis:** rodapé dos cards em Flexbox nowrap, gap fixo e botões com altura estável; writer geométrico legado r348 retirado da build final.
- **Overlay:** coração/favorito e controle flutuante ficam 36×36, absolutos, `z-index: 10` e com backdrop blur.
- **100% Novos:** os pools `fresh:*` são filtrados contra `seen` + `watch` da autoridade r319 antes do render.
- **Fallback:** se o pool limpo esgotar, um lote TMDB é buscado uma única vez e novamente filtrado antes de aparecer.
- **Teste:** itens bloqueados não sobrevivem e 15 re-renders consecutivos mantêm todos os botões visíveis e sem sobreposição.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r372-official.mjs`; runtime: `apps/web/runtime-r372-foryou-layout-fresh-strict.js`.

## Web 1.0.162 / r371

- **Home tab user-owned:** Séries/Filmes só muda por clique explícito; carregamento de dados nunca escolhe a aba.
- **Repaint-safe:** `paintHome`, `ct275PaintHome`, `ct274PaintHome` e `renderHome` reaplicam a seleção atual após reconstruir o DOM.
- **Cancelamento:** cada troca de aba aborta o ciclo anterior, incrementa uma geração lógica e invalida reconciliações r332 ainda pendentes.
- **Teste:** Filmes permanece ativo depois de 10 repaints que tentam voltar ao padrão Séries e após um render assíncrono tardio.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r371-official.mjs`; runtime: `apps/web/runtime-r371-home-tab-owner.js`.

## Web 1.0.161 / r370

- **Trocar sem laços de procura:** o pool é filtrado uma única vez com `Array.filter()` e o item é escolhido diretamente por índice aleatório.
- **Sem recursão:** pool vazio causa uma única busca de lote; depois há uma única nova filtragem e retorno.
- **Lock síncrono:** `swapLockRef.current` impede concorrência antes do primeiro `await`, equivalente ao uso de `useRef` em React.
- **Cancelamento:** `AbortController` + timeout de 3 segundos permanece no caminho TMDB.
- **Stress test:** 35 trocas consecutivas únicas + 40 cliques rápidos com heartbeat da main thread e liberação obrigatória do botão.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r370-official.mjs`; runtime: `apps/web/runtime-r370-prefilter-swap.js`.

## Web 1.0.160 / r369

- **Esportes/F1:** r255, r263, r296, r299 e r301 deixam de disparar repaint/refetch global após marcar assistido. Botões são `type="button"`, com prevenção de submit/navegação e rollback local em erro.
- **Pra você:** o `Trocar` não usa observers nem loops `while`; a busca local tem orçamento de 100 ms, pool limitado e fallback imediato.
- **Cancelamento real:** o helper TMDB aceita `AbortController` externo e a troca aborta aos 3 segundos.
- **Observers legados:** r363 não instala mais o observer de refill e r367 não observa mais o documento inteiro.
- **Teste:** 20 trocas sequenciais com heartbeat da main thread + 5 marcações esportivas dentro de formulário, sem submit e sem mudança de URL.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r369-official.mjs`; runtime: `apps/web/runtime-r369-hard-no-refresh-bounded-swap.js`.

## Web 1.0.159 / r368

- `Trocar` usa lock `isSwapping` com liberação garantida em `finally`.
- `session_excluded_ids` evita repetição durante a sessão; o pool é ampliado com páginas aleatórias do TMDB e seleção por `Math.random()`.
- Vistos, Watchlist quando aplicável, WWE e critérios de nota/ano continuam excluídos.
- Esportes e F1 usam UI otimista e persistência Supabase em segundo plano, sem `loadSports255(true)`, `paintSports255()`, `enhanceF1Watch263(true)`, `cinetracker:data-changed`, `window.location.reload()` ou `router.refresh()`.
- O contador visível do Perfil acompanha o evento local `cinetracker:sports-watched-changed`.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r368-official.mjs`; runtime: `apps/web/runtime-r368-random-sports-no-refresh.js`.

## Web 1.0.143 / r352

A r352 corrige exclusivamente o comportamento dos botões de ação dos cards no Descobrir.

- **Sem reload/repaint global:** `Trocar`, `✓ Visto` e `+ Watchlist` não recarregam a página nem redesenham o `Pra você` inteiro.
- **Troca local:** apenas o slot clicado é atualizado; os outros cards mantêm o mesmo nó DOM e o mesmo conteúdo.
- **Optimistic UI:** Visto/Watchlist substituem o card antes da resposta do Supabase e persistem em segundo plano.
- **Falha de rede:** rollback somente do slot afetado, com toast discreto.
- **Outras abas do Descobrir:** `+ Watchlist` muda para `✓ Salvo` no próprio botão, sem remover ou trocar o card.
- **Eventos:** os handlers bloqueiam propagação/navegação acidental.
- **Transição:** `transition-opacity duration-300 ease-in-out` aplicada à troca do slot.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r352-official.mjs`; runtime: `apps/web/runtime-r352-local-card-actions.js`.

## Web 1.0.127 / r336

A r336 consolida os ajustes mostrados no vídeo de 22/09 e adiciona busca por nome de episódio.

- **Busca global:** a mesma barra passa a combinar filmes, séries, pessoas e episódios. Episódios conhecidos localmente são pesquisados por `cinetracker_episode_search_v336`; para títulos atuais ainda não gravados no histórico, a Web consulta a temporada corrente das séries recentemente acompanhadas e aceita correspondência exata, parcial e pequena variação ortográfica. O resultado do episódio abre a série correspondente.
- **Home / Séries e Filmes:** o histórico continua carregado no fluxo normal acima de `Assistir a seguir` / `Assistir a seguir / Watchlist`, sem botão e sem scroll interno. Clicar explicitamente em Séries ou Filmes passa por um único listener prioritário e sempre posiciona a seção atual no ponto de entrada, independentemente da posição anterior da página.
- **Pra você / filtros:** `Todos / Filmes / Séries / Animes` volta como controle interno do próprio `Pra você`, sem recriar a faixa global antiga do Descobrir.
- **Pra você / Da sua Watchlist:** remove o botão Watchlist. Cada card fica com `Visto + Trocar`.
- **Pra você / 100% novos e Indicação do Dia:** cada card fica com `Watchlist + Visto + Trocar`.
- **Pra você / ações:** os botões ficam na mesma linha, sem quebra. `Watchlist`, `Visto` e `Trocar` substituem o card imediatamente; a gravação no backend acontece em seguida.
- **Estabilidade:** a r336 assume primeiro o clique das abas da Home e do Descobrir, impedindo que listeners legados concorrentes executem a mesma troca e congelem/revertam a tela.
- A auditoria de exclusão do Descobrir continua sendo `cinetracker_discover_filter_v333`.
- O refresh de episódios da r325 e o estado lógico consolidado de séries são preservados.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r336-official.mjs`; runtime: `apps/web/runtime-r336-search-home-foryou.js`.

## Web 1.0.126 / r335

A r335 corrige a regressão de navegação da Home e finaliza o comportamento do `Pra você` mostrado no vídeo de 22/09.

- **Home / histórico:** não existe botão para abrir o histórico e não existe scroller interno. Séries e Filmes mantêm o histórico no fluxo normal acima do conteúdo atual. A ordem continua **mais antigo acima → mais recente abaixo**, de modo que, ao entrar em `Assistir a seguir` e rolar para cima, o primeiro item revelado é o mais recente.
- **Home / Filmes:** um clique explícito em `Filmes` recebe uma trava curta de aba; repaints tardios não podem devolver a tela para `Séries`. A r335 aposenta os loops de reposicionamento da r332/r334 e faz um único alinhamento por render/troca de aba.
- **Descobrir / topo:** remove a faixa temporária `Todos / Filmes / Séries / Animes` do topo e também o gatilho antigo de filtro. O conteúdo sobe para ocupar esse espaço. O estado interno volta a `all` para não deixar um filtro invisível ativo.
- **Pra você:** o r329 é o renderer final depois da auditoria `cinetracker_discover_filter_v333`. Cada card tem `Watchlist + Visto + Trocar` em uma única linha compacta; se um renderer legado entregar só dois botões, a r335 recompõe o `Trocar` sem duplicá-lo.
- **Regras:** a auditoria v333 continua bloqueando Visto, histórico de reprodução, progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado. O banco foi conferido com os oito filmes de Harry Potter informados como vistos: todos retornam em `blocked_keys`.
- **Top 10:** preserva refill progressivo de até oito páginas até obter 10 itens elegíveis por rail depois da auditoria pessoal.
- **Congelamento ao trocar abas:** a r335 não adiciona MutationObserver e remove os últimos schedulers concorrentes de scroll/filtro que ainda disputavam a navegação.
- Perfil, F1 Hub e Esportes permanecem fora do escopo. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r335-official.mjs`; runtime: `apps/web/runtime-r335-home-discover-final.js`.

## Web 1.0.125 / r334

A r334 substitui a r333, cujo gate de navegador falhou e por isso não deve ser tratada como release validada.

- **Home:** troca o estado lógico de séries pela RPC `cinetracker_home_series_watch_state_v4`, evitando a ordenação/agregação de JSON pesado. No mesmo conjunto de 120 séries, a consulta caiu de aproximadamente 5,7 s para 0,27 s.
- **Payload da Home:** `cinetracker_home_payload_v334` usa o estado v4; no banco, o payload completo caiu de aproximadamente 4,6 s para 1,9 s antes das otimizações de navegador.
- **Histórico:** continua carregado no fluxo normal da página, sem botão e sem scroll interno; a Home pousa no conteúdo normal e o histórico fica acima, com o item mais recente mais próximo do conteúdo.
- **Navegação:** r332 passa a ser o único dono do posicionamento inicial da Home. Os schedulers concorrentes de r327/r328/r331 são aposentados.
- **Congelamentos:** observers globais tardios de r327/r328/r329/r331/r333 são desativados; eles reescreviam filtros/DOM durante trocas de abas.
- **Pra você:** filtros Todos/Filmes/Séries/Animes são idempotentes e os três botões ficam em uma única linha compacta para todos os renderers legados conhecidos.
- **Top 10 / abas públicas:** mantém a autoridade `cinetracker_discover_filter_v333`, que bloqueia vistos, progresso, Watchlist, Assistir depois e Não interessado; Top 10 continua buscando até oito páginas para preencher 10 elegíveis.
- **Sports:** warmup de provider não inicia mais ao abrir Home/Descobrir; só inicia quando Sports é a rota ativa.
- Android permanece `1.0.20 / versionCode 10062`.

## Web 1.0.124 / r333

A r333 parte do vídeo de 22/09 e corrige a fonte dos dados antes de ajustar a interface.

- **Home / Citadel e Stuart:** o primeiro payload já consolida duplicatas pelo TMDB efetivo com `cinetracker_home_series_watch_state_v2`. Citadel passa a 13/13 e Stuart a 9 episódios assistidos; quando não existe episódio lançado e ainda não visto, o card fica Em dia e o ponteiro antigo é removido.
- **Home / filmes:** `cinetracker_home_payload_v333` refaz a Watchlist de filmes usando a Watchlist atual e só mantém filmes já lançados e ainda não vistos. Filmes com data futura deixam de aparecer.
- **Home / histórico:** continua sem botão e sem scroller interno. O histórico permanece acima do ponto inicial; o item mais recente fica imediatamente acima do conteúdo atual e os mais antigos continuam mais para cima.
- **Home / navegação:** reduz o settle inicial e remove o observer que disputava scroll durante repaints, diminuindo risco de congelamento ao trocar de aba/rota.
- **Descobrir:** remove fisicamente as setas e o botão de filtro antigos. Os filtros ficam inline.
- **Pra você:** `Todos / Filmes / Séries / Animes` ficam visíveis; o r329 segue como único renderer final e cada card tem Watchlist + Visto + Trocar em uma única linha compacta.
- **Regras do Descobrir:** toda auditoria passa por `cinetracker_discover_filter_v333`; a autoridade também considera eventos de reprodução.
- **Top 10:** busca até oito páginas somente quando necessário até completar 10 séries e 10 filmes elegíveis; há auditoria final antes do HTML. O bloco sobe para junto dos streamings, sem faixa vazia/título duplicado.
- **Desempenho:** remove o pré-carregamento agressivo de todas as abas do Descobrir e do Top 10. As fontes continuam em cache/deduplicadas, mas são carregadas sob demanda.
- **Esportes:** em toda abertura do site o payload atual é aquecido em segundo plano; depois o site dispara sincronização dos provedores para os 3 dias anteriores e hoje + 2 dias e recarrega o payload, sem bloquear a navegação.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r333-official.mjs`; runtime: `apps/web/runtime-r333-home-discover-sports.js`.

## Web 1.0.123 / r332

A r332 corrige as regressões ainda visíveis no vídeo de 22/09 sem trocar a autoridade de dados já validada no Supabase.

- **Home / histórico:** continua sem botão e sem scroller interno. O histórico fica no fluxo normal acima do ponto inicial; a Home reposiciona o primeiro bloco útil logo abaixo das abas após os repaints iniciais, sem deixar uma faixa do histórico visível. Assim, rolar para cima revela primeiro o item mais recente e depois os anteriores.
- **Home / navegação:** o reposicionamento inicial é cancelado assim que o usuário começa a rolar, evitando disputar scroll com a navegação.
- **Episódios:** a Home reaplica o estado lógico consolidado por TMDB antes de exibir o próximo episódio. Um ponteiro antigo nunca pode ficar atrás do último episódio já assistido; a reconciliação TMDB e a atualização remota continuam em segundo plano.
- **Atualização episódica:** falhas do refresh deixam de bloquear uma nova tentativa por 15 minutos; uma atualização forçada é disparada uma vez por sessão sem bloquear o primeiro paint.
- **Descobrir / Pra você:** o r309 só fornece candidatos. Depois da auditoria final `cinetracker_discover_filter_v326`, o **r329 é o único renderer final**. Isso impede que um rascunho antigo devolva títulos vistos/Em dia ou os botões em duas linhas.
- **Pra você / filtros:** Todos, Filmes, Séries e Animes continuam visíveis e filtram o DOM final r329.
- **Pra você / botões:** Watchlist, Visto e Trocar ficam em três colunas iguais, compactas e sem quebra de linha.
- **Descobrir / velocidade:** as respostas TMDB brutas permanecem em cache quando muda apenas a biblioteca pessoal; requisições simultâneas da mesma aba são deduplicadas e as outras abas públicas são pré-carregadas em segundo plano.
- **Top 10:** preserva o preenchimento progressivo até 10 + 10 e a auditoria final v326 antes do HTML. O primeiro streaming é pré-carregado em segundo plano.
- Perfil/Watchlist, Esportes, F1 Hub e Android não foram alterados. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r332-official.mjs`; runtime: `apps/web/runtime-r332-home-discover-final.js`.

## Web 1.0.121 / r330

A r330 corrige o carregamento prolongado da Home e finaliza a geometria do Descobrir observada no vídeo de 22/09.

- **Home / desempenho:** o payload do Supabase é pintado imediatamente. A reconciliação ao vivo de séries/TMDB deixa de bloquear a primeira tela e passa a rodar depois do primeiro paint.
- **Navegação:** a reconciliação em segundo plano usa token + rota; se o usuário sair da Home, o trabalho antigo não pode repintar a tela anterior.
- **Atualização episódica:** preserva a r325, mas a atualização remota começa depois da primeira tela interativa e apenas se a Home ainda estiver ativa.
- **Histórico da Home:** preserva o comportamento r328 — histórico carregado no fluxo da página, acima do ponto inicial, sem botão e sem scroller interno; rolar para cima revela primeiro os itens mais recentes.
- **Pra você:** Watchlist, Visto e Trocar ficam em grid fixo de três colunas iguais, 26 px, sem quebra e sem esconder o terceiro botão.
- **Top 10:** remove o título duplicado `Top 10` dentro do conteúdo e o nome repetido do streaming abaixo dos pills. Os pills passam a ser o cabeçalho visual e as listas sobem.
- **Top 10 / regras:** mantém o refill progressivo e faz uma nova auditoria `cinetracker_discover_filter_v326` imediatamente antes do HTML final.
- O banco foi conferido com os oito filmes de Harry Potter da biblioteca: todos os oito foram classificados em `seen_keys` / `blocked_keys`.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r330-official.mjs`; runtime: `apps/web/runtime-r330-home-discover-speed.js`.

## Web 1.0.120 / r329

A r329 corrige exclusivamente a geometria visual do Descobrir mostrada no vídeo de 21/09, preservando a autoridade de regras da r328/r326.

- **Pra você:** volta ao tamanho padrão histórico do CineTracker: **154 px no celular e 176 px no desktop**, proporção 2:3.
- Filme / Série / Anime deixam de ser espremidos em três colunas fluidas. Cada bloco passa a ter uma **rail horizontal própria**, sem aumentar a largura da página.
- Watchlist, Visto e Trocar passam a usar classes exclusivas da r329 e ficam em **uma única linha de 26 px**, exatamente na largura do card. Nenhum seletor legado de `swap/watch/seen` pode reposicioná-los.
- Slots sem item elegível deixam de reservar um card vazio grande.
- Filtros `Todos / Filmes / Séries / Animes` permanecem visíveis e continuam filtrando o conteúdo carregado.
- Abas públicas e Top 10 também voltam ao card padrão 154/176 px com scroll apenas dentro da rail e botões na mesma linha.
- **Regras não foram relaxadas:** `cinetracker_discover_filter_v326` continua removendo Visto, progresso, Em dia, concluído, Watchlist, Assistir depois e Não interessado antes do paint; Top 10 mantém refill até 10 elegíveis.
- Home, Perfil, sincronização episódica, Esportes, F1 e Android não são alterados.

Build oficial: `apps/web/build-r329-official.mjs`; runtime: `apps/web/runtime-r329-discover-geometry.js`.

## Web 1.0.119 / r328

A r328 corrige o comportamento mostrado no vídeo de 21/09 sem alterar os contratos preservados de Perfil, Esportes, F1 e Android.

- **Home:** restaura o comportamento r276. O histórico de Séries e Filmes continua carregado acima da área inicial, sem botão e sem rolagem interna; a tela abre exatamente em `Assistir a seguir` (Séries) ou `Assistir a seguir / Watchlist` (Filmes). Toda troca Séries ↔ Filmes reposiciona a página nesse ponto.
- **Pra você:** passa a ter renderer final próprio. Cada card usa uma única faixa de três botões — Watchlist, Visto e Trocar — sem herdar a regra antiga que forçava Trocar para outra linha.
- **Filtros do Pra você:** `Todos / Filmes / Séries / Animes` ficam visíveis diretamente abaixo das abas e filtram o conteúdo já carregado, sem nova consulta.
- **Regras do Descobrir:** mantém `cinetracker_discover_filter_v326` como autoridade antes da renderização para excluir vistos, progresso, Em dia, concluídos, Watchlist, Assistir depois e Não interessado nas abas públicas e no Top 10.
- **Top 10 / navegação:** páginas 1–2 são carregadas primeiro e páginas extras só são buscadas se ainda faltarem itens elegíveis e o usuário continuar no Top 10. Trocar de aba interrompe o refill restante.
- **Sincronização episódica:** preserva a r325 e `cinetracker_home_series_watch_state_v2`.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r328-official.mjs`; runtime: `apps/web/runtime-r328-home-discover-authority.js`.

## Web 1.0.118 / r327

A r327 preserva as correções válidas de r324–r326 e corrige as regressões observadas no vídeo de 21/09.

- **Home / Histórico:** remove o mini-scroll interno e qualquer botão de abrir histórico. Séries e Filmes mantêm o histórico carregado acima do conteúdo normal, em fluxo de página. Ao entrar na Home ou trocar Série ↔ Filme, o viewport volta ao primeiro bloco normal; o histórico fica logo acima e é revelado apenas ao rolar para cima. A ordenação histórica continua do mais antigo para o mais recente no DOM, deixando o mais recente imediatamente acima do ponto inicial.
- **Pra você:** preserva o tamanho aprovado dos cards e força Watchlist, Visto e Trocar em uma única linha flexível, compacta e sem quebra. Os filtros Todos / Filmes / Séries / Animes passam a aplicar visibilidade diretamente aos slots após qualquer repaint.
- **Desempenho do Pra você:** remove a sequência de até cinco ciclos de refill. Há uma validação em lote e, somente se faltar categoria, um único refill paralelo das páginas 3–4.
- **Top 10:** remove Mubi e Looke da seleção. O filtro autenticado r326 continua sendo a autoridade de Visto/Watchlist/Progresso. As páginas 1–3 são buscadas em paralelo e filtradas em um lote; páginas 4–5 só são consultadas se ainda faltarem elegíveis.
- **Top 10 na tela:** as dez posições são exibidas em grid, sem trilho horizontal; em telas estreitas o grid passa para 5×2.
- **Preservado:** sincronização de episódios r325, contagens/ordenação das Watchlists r324, histórico verdadeiro de filmes e regras estritas r326.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r327-official.mjs`; runtime: `apps/web/runtime-r327-home-discover-stable.js`.

## Web 1.0.117 / r326

A r326 corrige o comportamento mostrado no vídeo de 21/09 sem desfazer a sincronização episódica da r325.

- **Home / Histórico de Séries e Filmes:** remove visualmente os botões `Ver histórico`. O histórico volta ao comportamento antigo: conteúdo já carregado, área rolável, **mais antigo no topo e mais recente no fundo**, abrindo já posicionada no mais recente; ao rolar para cima aparecem os registros anteriores.
- **Descobrir / autoridade:** `cinetracker_discover_filter_v326` cruza cada candidato com **todas** as mídias conhecidas do usuário, por TMDB ou por aliases de título localizado/original + ano. O alias não fica mais restrito apenas a registros com TMDB legado.
- **Pra você:** Watchlist exige `Watchlist && !Visto`; `100% novos` e Indicação do Dia usam somente candidatos desbloqueados. Se a filtragem remover candidatos, o fluxo busca páginas adicionais antes de montar o card final.
- **Pra você / botões:** `+ Watchlist`, `✓ Visto` e `↻ Trocar` são forçados na mesma linha, compactos e sem quebra. As demais abas mantêm Watchlist + Visto lado a lado.
- **Top 10:** continua preenchendo até 10 elegíveis por tipo e passa pela autoridade v326; Harry Potter e outros títulos já vistos em registros duplicados/legados permanecem bloqueados.
- **Episódios novos:** toda a reconciliação r325 (duplicatas por TMDB, refresh de metadata e marca `NOVO`) é preservada.
- **Perfil / Watchlists:** contadores completos e ordenação da r324 são preservados.
- Web: `1.0.117 / r326-official-1.0.117`; Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r326-official.mjs`; runtime: `apps/web/runtime-r326-home-discover-final.js`.

## Web 1.0.116 / r325

A r325 mantém as correções da r324 e corrige a sincronização de episódios observada no vídeo com o Bingers.

- **Home / histórico oculto:** `cinetracker_home_history_v324` carrega episódios e filmes antes do primeiro paint; os dois históricos continuam recolhidos por padrão, mas o conteúdo já está no payload quando o usuário abre `Ver histórico`.
- **Séries duplicadas/importadas:** `cinetracker_home_series_watch_state_v2` unifica todas as fichas que resolvem para o mesmo TMDB e retorna, no mesmo estado lógico, contagem assistida, chaves S/E, último S/E e último horário assistido.
- **Episódios novos:** o Home chama a Edge Function autenticada `ct-refresh-tv-state-user` em intervalos controlados. Ela atualiza séries cujo `next_episode_to_air` já venceu ou cuja metadata está velha; em seguida o Home reconcilia novamente o TMDB atual e move episódio lançado/não visto para `Assistir a seguir`.
- **Identificação visual:** episódio lançado nos últimos 14 dias e ainda não visto recebe `NOVO`.
- **Casos confirmados no banco:** Reacher consolida 28 episódios assistidos e último S04E04; Lioness consolida 23 assistidos e último S03E07.
- **Preservações da r324:** histórico recolhido, botões compactos do Descobrir, Top 10 filtrando vistos legados (incluindo Harry Potter), Watchlists completas com contadores do RPC e ordenação.
- Web: `1.0.116 / r325-official-1.0.116`; Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r325-official.mjs`; runtime: `apps/web/runtime-r325-home-episode-sync.js`.

## Web 1.0.115 / r324

A r324 corrige as regressões confirmadas no vídeo de 20/09 à noite.

- **Home / Séries e Filmes:** os dois históricos continuam carregados junto com a Home, mas agora iniciam recolhidos. Cada aba mostra apenas o cabeçalho/contador e o botão `Ver histórico`; abrir um histórico não abre o outro.
- **Descobrir / ações:** `+ Watchlist`, `✓ Visto` e `↻ Trocar` ficam na mesma linha no `Pra você`, com controles menores e sem quebra de texto. As abas públicas e Top 10 mantêm Watchlist + Visto lado a lado também no mobile.
- **Perfil / Watchlists:** o modal usa diretamente `cinetracker_watchlist_full_v119` e não descarta mais registros importados com TMDB negativo. Os totais passam a usar os contadores do próprio RPC: Séries e Filmes mostram a população completa.
- **Top 10 / vistos legados:** `cinetracker_discover_filter_v324` cruza aliases legados mesmo quando já existe uma ficha TMDB positiva. Isso cobre duplicatas importadas como Harry Potter em inglês marcadas como vistas e as fichas atuais em português.
- **Validação no banco:** Harry Potter 1, 3, 4 e Interestelar foram validados como `seen_keys`/bloqueados pelo novo filtro.
- Web: `1.0.115 / r324-official-1.0.115`; Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r324-official.mjs`; runtime: `apps/web/runtime-r324-home-discover-profile.js`.

## Web 1.0.114 / r323

A r323 corrige os quatro pontos observados no vídeo de 20/09.

- **Home / Filmes vistos:** o histórico de filmes passa a complementar o payload da Home com `cinetracker_home_movie_history_v323`, que une `watch_play_events_v0994` e o histórico legado. Assim reproduções recentes que não chegaram ao `watch_history` antigo passam a aparecer na Home.
- **Descobrir / Pra você:** `cinetracker_discover_filter_v323` aceita também título original e ano. Isso reconcilia registros legados com TMDB sintético/negativo, como um filme importado salvo pelo título original mas retornado pelo TMDB em português.
- **Top 10:** após aplicar as exclusões pessoais, o carregador avança por até cinco páginas do ranking de cada streaming até completar 10 séries e 10 filmes elegíveis.
- **Filmes/Séries Watchlist:** o modal passa a exibir um seletor visível de ordenação com Último adicionado, Primeiro adicionado, A–Z, Z–A, Ano mais recente e Ano mais antigo.
- **Versão Web:** identidade atualizada para `1.0.114 / r323-official-1.0.114`.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r323-official.mjs`; runtime: `apps/web/runtime-r323-home-discover-watchlist.js`.

## Web 1.0.113 / r322

A r322 altera **somente o Descobrir**.

- Substitui a checagem pesada da r321 por `cinetracker_discover_filter_v322`, que usa a chave lógica TMDB já indexada da tabela `media`.
- Em uma validação com 40 candidatos, a checagem caiu de ~5,4 s para ~37 ms.
- A regra continua sendo aplicada **antes do paint**: Visto, qualquer episódio/progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado não entram nas abas públicas nem no Top 10.
- `Top 10` volta a reutilizar `ct171TopRows`, com cache de sessão e apenas as duas consultas necessárias (Séries + Filmes) por streaming.
- `Pra você` mantém as regras aprovadas: `Da sua Watchlist` = item na Watchlist e ainda não visto; `100% novos`/Indicação = item desbloqueado; filtros Todos/Filmes/Séries/Animes preservados.
- `Calendário` preserva a exceção de Watchlist.
- Perfil, Histórico, Esportes, F1 Hub e Android não são alterados nesta versão.

Build oficial: `apps/web/build-r322-official.mjs`.

## Web 1.0.112 / r321

A r321 corrige a regressão de carregamento introduzida pela r320.

- Remove completamente o gate visual que escondia cards aguardando validação pós-render.
- O Descobrir volta a mostrar um loader normal e só chama o renderer depois que o lote foi validado no Supabase.
- A validação exata por candidato continua usando `cinetracker_discover_filter_v320`, mas agora acontece **antes do paint**.
- `Pra você` é validado explicitamente no próprio fluxo: `Da sua Watchlist` exige Watchlist e não visto; `100% novos` e Indicação do Dia exigem item desbloqueado.
- Top 10 preserva séries + filmes por streaming e filtra ambos antes de montar o HTML.
- Perfil > Assistido por dia continua usando `watch_history`, mesma fonte do Histórico da Home, com temporada/episódio, título do episódio, nota, data, restantes e reproduções.
- Nenhuma alteração em F1 Hub ou Android. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r321-official.mjs`; runtime: `apps/web/runtime-r321-discover-profile-history.js`.

## Web 1.0.111 / r320

A r320 corrige dois contratos observados no vídeo de 20/09.

- **Descobrir:** cada candidato das abas públicas e do Top 10 é validado no Supabase por TMDB ID (com fallback por título/ano) contra `media_overrides`, `watch_history` e `episode_progress`. Cards ficam ocultos até a validação terminar.
- **Pra você:** os pools também passam pela validação exata: `Da sua Watchlist` exige estar na Watchlist e não estar visto; `100% novos` e Indicação do Dia rejeitam qualquer item bloqueado.
- **Perfil > Assistido por dia:** deixa de usar `watch_play_events` como fonte principal e passa a usar o mesmo `watch_history` que alimenta o Histórico da Home.
- **Detalhes do histórico:** temporada/episódio, nome do episódio, nota, data, quantidade restante e número de reproduções são mantidos no Perfil.
- **Esportes:** permanecem no histórico diário do Perfil como complemento, sem alterar o histórico de mídia da Home.
- Nenhuma alteração em F1 Hub, demais áreas do Perfil ou Android. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r320-official.mjs`; runtime: `apps/web/runtime-r320-discover-profile-history.js`.

## Web 1.0.110 / r319

A r319 corrige exclusivamente a regra de exclusão pessoal do Descobrir.

- As abas públicas e o Top 10 passam a consultar `cinetracker_discover_blocked_v319`, que usa o TMDB efetivo do dashboard pessoal para bloquear itens vistos, em andamento, em dia, concluídos, na Watchlist e marcados como não interessados.
- A r318 descartava o formato real de `cinetracker_discovery_exclusions_v0994` e podia cachear uma autoridade vazia quando a sessão ainda não estava pronta.
- A r319 usa uma autoridade canônica explícita com `blocked_keys`, `seen_keys` e `watch_keys`.
- A lista pessoal é atualizada em toda abertura de aba pública/Top 10; o catálogo TMDB continua em cache.
- O modo agora é fail-closed: se a lista pessoal não carregar, nenhum título público é exibido até a autoridade ficar disponível.
- `Pra você` preserva as exceções já aprovadas e o `Calendário` preserva a exceção de Watchlist.
- Nenhuma alteração em Perfil, Esportes ou F1 Hub. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r319-official.mjs`; runtime: `apps/web/runtime-r319-discover-canonical-blocklist.js`.

## Web 1.0.109 / r318

A r318 altera **somente o Descobrir**.

- **Pra você:** filtro funcional com `Todos / Filmes / Séries / Animes`, preservando Indicação do Dia, Da sua Watchlist, 100% novos, Watchlist, Visto e Trocar.
- **Regras do Pra você preservadas:** Da sua Watchlist usa apenas itens reais da Watchlist ainda não vistos; 100% novos exige pôster, nota ≥ 7,5, ano > 1990, exclui WWE/Raw/SmackDown, documentário/drama puro conforme regra vigente, vistos, Watchlist e recomendações exibidas recentemente.
- **Top 10:** continua por streaming com `Top 10 Séries` e `Top 10 Filmes`, mas agora elimina vistos e Watchlist antes do HTML e busca páginas adicionais para completar até 10 elegíveis.
- **Em alta / Populares / Novidades / Lançamentos / Mais Aguardados / Mais bem avaliados:** barreira canônica antes do HTML para visto, Watchlist, progresso/em dia e alias visual, seguida do filtro Todos/Filmes/Séries.
- **Janelas:** Novidades = últimos 30 dias; Lançamentos = -7 a +30 dias; Mais Aguardados = a partir de amanhã.
- **Calendário:** mantém a exceção de Watchlist já definida.
- **Performance:** cache local de 5 minutos + prefetch das seis abas públicas.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r318-official.mjs`; runtime: `apps/web/runtime-r318-discover-final.js`.

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
