# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.40 — 2026-09-11 — Web r249

### Autoridade única / estabilidade
- A camada final passa a operar como **single authority** de UI, orientada por eventos e reconciliações limitadas, em vez de manter observadores perpétuos disputando o DOM.
- Os `MutationObserver` finais da r248 para current-ui e state-binding são neutralizados no bundle r249; seus hooks úteis permanecem, mas não podem voltar a reescrever a tela indefinidamente.
- Testes de Chromium introduzem mutações atrasadas após 2 segundos para provar que a autoridade atual recupera estado correto sem polling ou guerra contínua de DOM.

### Home / episódios
- Preservada a fronteira baseada no último episódio efetivamente acompanhado: backlog histórico continua não assistido, mas não remove Raw, SmackDown ou outras séries longas do estado `Em dia`.
- Quando há backlog antigo e também episódio realmente lançado depois da fronteira, o episódio novo continua vencendo e força `Assistir a seguir`.
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

### Build e validação
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
