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
| Web | **1.0.171** | `r380-official-1.0.171` | Home estável + Fresh estrito + Perfil quick-first |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r313 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.166 / r375\n\n- **Correção baseada no vídeo:** o reset absoluto para `0` foi removido porque expunha `Histórico recente`/`Filmes vistos`.\n- **Início semântico:** Séries abre em `Assistir a seguir`; Filmes abre em `Assistir a seguir / Watchlist`.\n- **Histórico preservado:** continua renderizado acima do ponto inicial e aparece somente ao rolar para cima.\n- **Container-aware:** alinha o bloco principal tanto em scroll da janela quanto em container interno.\n- **Teste:** ambos os sentidos de troca partem do rodapé e terminam no bloco principal, com Histórico comprovadamente acima do viewport.\n- Android permanece `1.0.20 / versionCode 10062`.\n\nBuild oficial: `apps/web/build-r375-official.mjs`; runtime: `apps/web/runtime-r375-home-semantic-start.js`.\n\n## Web 1.0.165 / r374

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
