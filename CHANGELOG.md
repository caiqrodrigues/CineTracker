## Web 0.3.73 / r546 — entrada Home (2026-10-22)

- Corrige a guarda de estado que impedia reinicializar a âncora quando um acesso explícito à Home solicitava reset.
- Adiciona alinhamento limitado à entrada da rota ou seleção de Séries/Filmes: início em Continuar assistindo para Séries e Assistir a seguir/Watchlist para Filmes.
- Histórico continua acima, acessível por rolagem; não altera APK nem banco.

## Web 0.3.72 / r545 — Home sem reancoragem e data do UFC (2026-10-22)

- Impede que renderizações posteriores da mesma aba reiniciem o alinhamento/rolagem já realizado em Home.
- UFC utiliza `next_episode_air_date` fornecido pelo RPC autenticado v512 quando o último evento não está materializado em `events`, incluindo a data no subtítulo e critério de inserção.
- Aprimorada a leitura de datas de linhas já renderizadas para ordenação relativa.
- Mantidos os arquivos Android e a integração Supabase sem alterações.

## Web 0.3.71 / r544 — Home Filmes, Séries e UFC (2026-10-22)

- Home Filmes: renderizador antigo não permanece indefinidamente em Carregando Watchlist quando não recebe títulos; fornece repetição explícita e recuperação assíncrona via controlador existente, sem recarregar página.
- Home Séries: alinhamento de entrada não repete a rolagem após o primeiro posicionamento; Histórico permanece acima de Continuar assistindo.
- UFC: controlador especial deixa de inserir o card obrigatoriamente na primeira posição; usa timestamp verificável de evento/atividade quando disponível, exibe data do último evento e não inventa data quando ausente.
- Testes estáticos incluídos em `apps/web/test-r544.mjs`. Build `apps/web/build-r544.mjs` baseado em r543. Apenas Web alterada; APK e Supabase preservados.

## Android 1.0/r310 — Perfil séries recentes e personalização não repetitiva (2026-10-22)

- **Versão pública 1.0:** `versionCode 10110 → 10111`, identificador `com.cinetracker.app` e assinatura oficial mantidos para instalação sobre a versão 1.0 anterior.
- **Perfil — Séries:** em cada acesso ao Perfil e retorno ao app, consulta autenticada `cinetracker_profile_media_dashboard_v0991`; ordena a biblioteca por `last_watched_at` real; mantém dados recentes e contagens verificadas mesmo quando um controlador antigo repinta biblioteca desatualizada; atualiza após marcações, protege contra troca de usuário, preserva contadores, favoritos, listas e telas de detalhe. Se a chamada falhar, não elimina uma coleção previamente confirmada.
- **Descobrir — Pra Você:** troca o critério estático de primeiro item por amostragem ponderada pela afinidade de gêneros observada em episódios/filmes assistidos, Watchlist, favoritos e feedback das ações. No início de uma nova visita/dia, libera apenas a seleção fixada da visita anterior; mantém a trava contra repintura durante a mesma visita.
- **Diversidade:** registra impressões por conta para evitar repetir recomendações nas próximas visitas por até 21 dias enquanto houver alternativas elegíveis; seleção aleatória ponderada entre 12 candidatos em vez de retornar sempre o mesmo máximo determinístico. Expande em segundo plano pools novos pequenos, mantendo auditoria v525. Watchlist continua restrita estritamente às entradas reais elegíveis da conta (não inventa conteúdo).
- **Dados pessoais recentes:** revalida o dashboard de afinidade do usuário ao voltar a descobrir e após ações. Não muda o banco, o serviço TMDB ou os critérios de restrição de curtas, YouTube, stand-up, realities, WWE, itens vistos e Watchlist.
- **Escopo estrito APK:** não altera Home, Esportes, UFC, F1 Hub, Histórico, Web, SQL ou o resto do aplicativo. Nenhuma atualização global, reload ou substituição de controles existentes.

## Android 1.0/r309 — toque único confiável na Home (2026-10-22)

- Nome público **1.0** preservado. Código Android incrementado **10109 → 10110**; assinatura oficial idêntica à versão instalada anteriormente.
- O botão **✓** de marcar o próximo episódio estava registrado em um delegado de `document` depois de controladores legados. A captura agora ocorre na `window`, antes das ações antigas, com `stopImmediatePropagation` e trava síncrona por media ID: um toque dispara apenas uma operação, sem duplo clique e sem reload.
- Mantidos integralmente os recursos da r308: card UFC de tamanho uniforme, remoção de checks órfãos, Histórico de Filmes sem alternância de dados obsoletos após primeiro registro verificado e botão minimalista **Desmarcar** no Histórico de Séries e Filmes com rollback em erro.
- Mantidas as recomendações adaptativas v525/r307: afinidade de gêneros conforme assistidos, favoritos e Watchlist; feedback de Trocar; exploração e exposição persistente por usuário, sem apresentar conteúdo proibido.
- **Escopo:** apenas controlador de Home no runtime Android. Esportes, Descobrir, Perfil, Fórmula 1, Web e Supabase inalterados em r309.
- Regressões automatizadas e integridade da assinatura verificados no pipeline oficial.

## Android 1.0 / r308 — Home: ação confiável, card UFC, desfazer histórico (2026-10-21)

- Versão pública **1.0**, `versionCode 10109`, raiz `0.3.97`; assinatura e package `com.cinetracker.app` mantidos.
- **Home Séries:** botão `✓` de marcar o próximo episódio com área real de toque de 52 px, feedback instantâneo, trava síncrona contra vários toques e preservação da autoridade r176 de episódio pendente. Checks soltos sem card deixam de ser exibidos.
- **UFC:** cards de séries de Esportes na Home têm a mesma altura mínima, largura e grid dos outros cards de Séries, sem alterar a lógica esportiva.
- **Histórico de Séries e Filmes:** botão minimalista `Desmarcar` ao lado de `Reassistir`, com remoção otimista de apenas a linha escolhida, confirmação RPC autenticada (`cinetracker_unmark_episode_v1` ou `cinetracker_unmark_history_item_v426`), restauração na falha e bloqueio de clique concorrente. Caches recentes são limpos ao confirmar, evitando ressurreição de entradas removidas.
- **Filmes:** mesclagem dos registros recentes autenticados antes do primeiro paint da Home, snapshot de último resultado v542 com isolamento de conta e sinalização breve enquanto não há dados recentes verificados. Fontes antigas não substituem datas novas no DOM; o histórico permanece cronológico.
- **Escopo estrito:** somente Home do APK Android. Descobrir > Pra Você adaptativo/auditado r307, aba Esportes, F1, Perfil, Web e Supabase sem alterações. Sem reload de página inteira.

## Android 1.0 / r307 — Home visual e recomendações adaptativas (2026-10-21)

- **Escopo Android:** versão pública 1.0 mantida, versionCode 10108, package 0.3.96, certificado de assinatura anterior preservado. Sem mudança de Web, Supabase, Sports, F1 ou regras de episódios r306.
- **Home Séries:** removidas exclusivamente as barras de ✓ órfãs, sem card de série associado. Controles legítimos de marcar episódio continuam intocados.
- **Home Filmes:** proteção do DOM contra renderizações antigas que recolocavam Pokémon como último filme, comparando o card mais recente à lista confirmada por v542. Corrige apenas o histórico visível e evita loop de atualização.
- **Descobrir → Pra Você:** modelo de afinidade local por gêneros inferidos do que foi visto, adicionado à Watchlist e marcado como favorito, com peso adicional para escolhas recentes. Ações Trocar / Visto / Watchlist alimentam sinais positivos ou negativos com decaimento temporal. Uma fração das opções introduz exploração para novos gêneros.
- **Diversidade:** histórico persistido por conta e slot por até 90 dias, preferência por títulos não mostrados nos últimos 21 dias e rotação diária. Slots da Watchlist consultam exclusivamente itens daquela Watchlist; não são preenchidos por candidatos arbitrários. Trocar procura alternativas e, em categorias novas, pode expandir a busca TMDB por gêneros afins e páginas distintas, sempre passando por elegibilidade existente e auditoria autenticada v525.
- **Interação:** mantidos sete slots, controles funcionais anteriores e atualizações pontuais; sem repintura total, perda de scroll ou invalidação da Home. No aplicativo o aprendizado por interações é local ao dispositivo; histórico/Watchlist sincronizados são carregados do perfil.
- **Validação:** testes de maior afinidade por gêneros assistidos/favoritos, rotação no dia seguinte, proteção contra repetição, separação por conta, expansão auditada e remoção de barra órfã; build release, assinatura e SHA-256 exigidos antes de publicação.

## Android 1.0 / r306 — Home Séries e Filmes confiáveis (2026-10-21)

- **Regra de 30 dias:** séries iniciadas que ainda têm episódios pendentes passam para **Juntando poeira** quando o último episódio assistido está há 30 dias ou mais, mesmo se o banco envia flags antigas de InProgress/UpToDate. Séries realmente em dia permanecem em **Em dia**.
- **Episódios novos:** a posição da última temporada/episódio lançado é comparada à posição de último episódio assistido e à data real de estreia. Raw/SmackDown continuam no **Continuar assistindo** somente quando existe episódio recente de fato lançado e ainda não visto, sem confundir milhares de episódios históricos com novidades.
- **Fonte atual de séries:** em cada abertura/retorno à Home, revalida dados autenticados de `cinetracker_home_series_v527` para restabelecer classificação canônica; respostas antigas não substituem progresso mais recente.
- **Histórico de Séries:** consulta autenticada de `cinetracker_home_history_v391`, incluindo eventos de watch_history e episode_progress, concilia por mídia, temporada e episódio, preservando o horário mais recente confirmado e a ordem cronológica.
- **Histórico de Filmes:** corrigido retorno intermitente ao Pokémon. O controlador v542 da r305 agora restaura o histórico mais recente validado após **toda reconstrução antiga da Home**, sem depender de que a resposta da rede seja diferente daquela já recebida.
- **Convergência:** sessões e usuários isolados; verificações após retorno ao primeiro plano e após alterações; nenhum `window.location.reload`, `router.refresh` ou refetch síncrono de página inteira.
- **Escopo:** somente Home no APK Android. Funcionalidade esportiva r304/r305, Descobrir, Perfil, F1 Hub, Web e SQL inalterados. Versão pública permanece `1.0`, `versionCode=10107`, raiz `0.3.95`.

## Android 1.0 / r305 — botão único Esportes e Histórico Filmes sempre atual (2026-10-20)

- **Nome comercial mantido:** Android **1.0**, `applicationId com.cinetracker.app`, `versionCode 10106` para atualizar a 1.0/r304 sem desinstalar; certificado e assinatura de produção preservados.
- **Esportes:** removido somente o botão `Ver eventos` que ficava lado a lado com `Marcar/Desmarcar assistido`. A ação Assistido ocupa agora 100% da barra. Nenhuma mudança de regra, RPC, favoritos, F1 Hub, marcações, contadores ou telas de detalhes.
- **Home → Filmes → Histórico:** consulta autenticada ao RPC existente `cinetracker_home_movie_history_v542` (somente os 200 mais recentes, sem baixar novamente toda a página), ao abrir a aba, voltar ao primeiro plano e sempre que uma marcação de filme emitir o evento de dados. Enquanto a aba estiver aberta, revalidação pontual a cada dois minutos; chamadas próximas em menos de 20 segundos são coalescidas e uma consulta pendente não duplica RPC.
- **Fim do histórico preso em Pokémon:** os últimos filmes verificados passam a ter prioridade sobre resultados antigos da cadeia r271/r273/r283/r284, que ainda pode terminar depois e redesenhar dados obsoletos. A grade de histórico aceita as novas entradas sem perder as anteriores, ordenando os filmes assistidos por data, com os mais novos embaixo. Se nenhuma marcação mais recente existir no servidor, não fabrica entradas de hoje.
- **Resiliência:** erro/timeout mantém o histórico já verificado, sem tela preta, sem recarregar Home; troca de usuário zera apenas o cache desse histórico e impede que respostas anteriores vazem entre contas.
- **Regressão:** tests exercitam update tardio, nova marcação no mesmo dia, visibilidade, erro de rede, troca de conta, limite de escopo sem refetch da Home, preservação do botão Assistido e regras de F1.
- **Escopo congelado:** nenhuma alteração de Web, banco, Supabase, Descobrir, Perfil, WWE ou funcionamento de Esportes. Alterações restritas à apresentação de Esportes e à sincronização de Histórico de Filmes no APK Android.

## Android 1.0 / r304 — correção exclusiva de Esportes (2026-10-20)

- **Versão permanece 1.0:** versionName `1.0` mantida; `versionCode` incrementado de 10104 para 10105 para possibilitar atualização do APK 1.0 oficial, sem alterar pacote ou assinatura.
- **Visual de Esportes:** removido o contorno vermelho/rosa das partidas exibidas como ao vivo, substituído por borda azul neutra; o status real do jogo e a lógica de dados não foram modificados.
- **Botões consistentes:** Ver eventos e Marcar como assistido ocupam a mesma barra, com largura de 50% cada e altura fixa de 42px; os filtros Anteriores/Próximos mantêm tamanhos simétricos. Evitada a repetição de botões de assistido que renderizadores antigos deixavam em várias linhas.
- **Assistido:** consolidado um único listener de clique que chama a função autenticada `cinetracker_sport_mark_watched_v1`, valida o `event_id` e o booleano `is_watched` confirmados pelo servidor, atualiza o card otimisticamente, registra o histórico em cache e reverte em caso de falha, com mensagem explicativa. Bloqueia toques rápidos duplicados e não reconstrói toda a tela.
- **Fórmula 1 preservada:** eventos da categoria `formula_1` continuam exatamente no manipulador anterior; F1 Hub, banco, fórmula de tempo e estatísticas sem alteração.
- **Escopo:** apenas Esportes no runtime Android. Descobrir, Home, Raw/SmackDown, Perfil, Web e Supabase intocados. API esportiva existente reaproveitada, sem SQL novo.
- **Validação:** testes de marcação, desmarcação, idempotência de cliques, erros de ID, F1 intocada, bordas e dimensões; build não depurável e validação de certificado compatível com APK 1.0 anterior.

## Android 1.0 — lançamento oficial (2026-10-20)

- **CineTracker 1.0 oficial:** versão Android 1.0 (`versionName=1.0`, `versionCode=10104`), mantendo o identificador do app oficial `com.cinetracker.app`. Este é o runtime mais recente 1.0.61/r303, diferente do lançamento histórico 1.0.0 (`versionCode=10042`).
- **Congelamento funcional:** mesmo JavaScript embarcado na versão 1.0.61/r303, com mudanças somente nos metadados de versão. Teste compara o novo bundle com o APK 1.0.61 já publicado.
- **Pacote de produção:** APK release (`assembleRelease`) não depurável, assinado com uma identidade de release estável. A verificação detectou assinatura diferente da versão 1.0.61; a instalação sobre o APK anterior não é possível sem a chave original. É necessária instalação limpa para esses usuários, com possível perda de dados locais; verificar sincronização antes de desinstalar. O pipeline publica diagnóstico de compatibilidade e não oculta a diferença.
- **GitHub oficial:** tag `android-v1.0`, APK `CineTracker-Android-1.0.apk`, SHA-256 e notas. Sem APK TESTE nesta entrega.
- **Escopo:** nenhuma mudança de lógica em Descobrir, Home, Raw/SmackDown, Esportes, F1, Perfil, Web ou Supabase; versão raiz 0.3.92.

## Android 1.0.61 — r303 (2026-10-20)

- **Causa estrutural da tremedeira:** a aba autenticada `Descobrir > Pra Você` ainda atravessava uma cadeia acumulada de cerca de 26 interceptadores legados de `paintDiscover`, além do reconciliador r278. Isso permitia que callbacks antigos disputassem a montagem, produzindo alternância automática de Indicação do Dia e 100% Novos.
- **Correção arquitetural no APK:** criado um *único* adaptador direto para a renderização inicial autenticada v421/v525. Apenas na rota Pra Você, a primeira montagem recebe HTML dos sete slots pelo renderer já existente `ct186RenderForYou`, sem chamar a cadeia de renderizadores antigos. O controle r278 instala botões autenticados no mesmo turno, antes de a tela ser pintada. As demais abas mantêm o renderizador anterior.
- **Bloqueio de looping:** após completar uma grade de sete slots, callbacks passivos de rede, contexto ou renderização não podem escolher outro título ou remontar a grade. O contrato permanece válido para o mesmo usuário e DOM; nova navegação monta uma cena nova.
- **Mutações de um único slot:** marcar Visto agora seleciona o sucessor elegível apenas do card acionado e atualiza sua lista otimisticamente; sucesso e rollback não reconstroem os outros seis slots. Trocar e Watchlist continuam protegidos contra cliques repetidos, sem reload nem recomposição de página.
- **Aparência:** desativadas transições e animações dentro dos slots de Pra Você que mascaravam a estabilidade do DOM. Layout, cartões 2:3, filtros v525, exclusão de visto/Watchlist, vedações de curtas, YouTube, realities, stand-up, WWE e memória de não repetição preservados.
- **Regressões:** teste de execução do adaptador contra DOM simulado valida que três chamadas posteriores não alteram os títulos, nenhuma é encaminhada aos renderizadores legados e a navegação cria uma nova cena. Testes de sintaxe, build Android e assinatura das duas variantes.
- **Escopo:** somente Android. Web, Supabase, Home, Raw/SmackDown, Esportes e Fórmula 1 sem alterações. Versão raiz 0.3.91; Android 1.0.61/r303/code 10103.

## Android 1.0.60 — r302 (2026-10-20)

- **Causa da tremedeira de Descobrir > Pra Você:** módulos históricos sobrepostos ainda forçavam nova reconciliação dos sete cards após a primeira montagem. O r284 disparava reconciliação em microtask toda vez que ignorava uma resposta já vista e renderizava novamente uma resposta forçada; o r288 agendava outro `requestAnimationFrame(reconcile)` após cada render canônico; o protetor r293 também reconciliava toda a grade ao restaurar qualquer fragmento e reagia a cliques/eventos de dados.
- **Propriedade única das ações:** removidos esses callbacks concorrentes. O r278 faz a preparação inicial e passa a respeitar o compromisso do guardião r293, sem reagendar reconciliação após essa etapa; Trocar, Watchlist e Visto alteram apenas o estado dos cards necessários, sem reconstrução global.
- **Proteção mantida:** o r293 continua interceptando HTML legado, conserva os sete slots e corrige substituições estruturais reais de DOM. Cliques normais e eventos externos não agendam novo reparo nem seleção aleatória; bloquear uma repintura não agendará nova repintura.
- **Sem alterações funcionais:** critérios de recomendação v525, filtros por watchlist/vistos, diversidade e inteligência r300/r301, 2 abas de Esportes, Raw/SmackDown, sincronização F1 e Perfil mantidos. Nenhuma alteração na Web ou SQL.
- **Testes de regressão:** ausência dos agendamentos de r284/r288/r293, zero frames de repaint após bloqueio de HTML legado, render inicial preservado, sete cards e controles auditados, atualização de versão, compilação e assinatura das variantes Android e TESTE60.
- **Versões:** Android 1.0.60/r302/versionCode 10102; raiz 0.3.90.

## Android 1.0.59 — r301 (2026-10-20)

- **Esportes:** removida a aba Favoritos do menu superior. Permanecem somente **Anteriores** e **Próximos**. A ação de favoritar times e competições, os dados sincronizados e todo o F1 Hub continuam disponíveis e inalterados.
- **Descobrir → Pra Você — tremedeira:** eliminado o segundo bloco legado de sincronização r290 que ainda agendava repinturas 60/280/950/2600 ms após ações, eventos de dados e consultas. Mantido seu bloqueio de HTML não auditado; r278 é o único controlador de mutações e r293 protege apenas substituições estruturais reais.
- **Descobrir → Pra Você — regras:** os slots de Indicação do Dia e 100% Novos compartilham um histórico diário de títulos já exibidos, evitando repetição entre categorias; Da sua Watchlist preserva histórico próprio. O pool segue autenticado v525 com filtros para vistos/watchlist, títulos curtos, YouTube, realities, stand-up, wrestling e duplicatas. Trocar mantém o card montado durante a consulta e não volta a selecionar alternativas antigas ao esgotar o pool.
- **Raw e SmackDown na Home:** antes, o guardião r296 só restaurava linhas que já apareciam no DOM, e o sincronizador r294 não criava linhas ausentes. Agora a sincronização verifica a linha real da biblioteca do usuário na consulta v527, a data do episódio lançado (janela de 16 dias) e o estado assistido v4 antes de criar o card faltante usando `homeSeriesRow158`, incluindo o botão do episódio. O cache da verificação restaura o card em repaint posterior sem RPC síncrona da página inteira; ações de assistido invalidam o cache. Cards retidos visíveis não expiram após dez minutos de uso.
- **Segurança e escopo:** não fabrica títulos, IDs, progresso ou episódios; não reapresenta WWE já assistida; nenhuma mudança em Web, Supabase, F1, estatísticas ou navegação externa.
- **Verificação:** testes estruturais para dois tabs, isolamento r290, memória entre slots, cache e autorização dos cards WWE, build, versão e assinatura oficial e TESTE59.
- **Versões:** Android 1.0.59/r301/versionCode 10101; raiz 0.3.89.

## Android 1.0.58 — r300 (2026-10-20)

- **Esportes:** interface reduzida às três abas Anteriores, Próximos e Favoritos. Os eventos passados são ordenados do mais recente para o mais antigo e os próximos do mais próximo em diante. Mantidos os filtros esportivos, marcadores de assistido, favoritos, sincronização, histórico, tempo de Perfil e F1 Hub sem mudança nas fórmulas nem na persistência.
- **Descobrir > Pra Você:** retirada a ordem determinística de escolha do primeiro item na seleção inicial e em Trocar. Sorteio ponderado por nota e suporte de votos considera somente os itens aprovados pelo filtro autenticado v525, exclui vistos/watchlist conforme cada slot, títulos já apresentados no mesmo dia e itens exibidos em outros slots. Reposição permanece sob demanda, sem recarregar a página.
- **Home Séries:** fila canônica de próximo episódio respeita a posição mais avançada realmente assistida. Falhas cronológicas mais antigas permanecem contabilizadas e disponíveis na série, sem forçar o Home a voltar ao início. Para Raw (TMDB 4656) e SmackDown (1549), o episódio recente já lançado e não visto tem prioridade; a fila não percorre milhares de episódios antigos. O botão de marcação utiliza a mesma fila que o texto da Home.
- **Testes:** filtros esportivos com F1 preservada; escolhas sorteadas com fontes diferentes de entropia; ausência de repetição; Raw/SmackDown episódio recente sem busca histórica; fila normal após o último visto e início cronológico para série não iniciada; build e assinatura oficial/TESTE.
- **Escopo:** código apenas do APK Android. Nenhuma alteração na Web, Supabase ou fórmulas F1. Android 1.0.58/r300/versionCode 10100, raiz 0.3.88.

## Android 1.0.57 — r299 (2026-10-20)

- **Causa identificada da tremedeira:** módulo legado r292 mantinha seis chamadas tardias a `reconcile()` depois de cada Trocar, Assistido, Watchlist e conclusão de consulta (0, 100, 350, 850, 1700 e 3200 ms), concorrendo com o controlador autenticado r278. Esse mesmo módulo interferia após pesquisas de Pra Você por meio de outro wrapper de `discoverRows()`.
- **Conflito de controladores corrigido:** removidos temporizadores, listeners e wrapper assíncrono de r292 que repetiam ações; preservado somente seu bloqueio de repintura de dados antigos. r278 permanece único responsável pelo estado local de cada card.
- **Mutations menos invasivas:** a proteção estrutural r293 passa a ignorar mudanças internas de botão/pôster/card, reagindo apenas à substituição real de slots ou da raiz de Pra Você. Isso impede ciclos redundantes de restauração enquanto mantém proteção contra renderizadores antigos.
- **Trocar:** mantém histórico sem repetição da r298, seleciona apenas alternativas válidas e conserva o card atual quando acabarem opções.
- **Testes:** validação real dos MutationRecords (mudança de botão/pôster não restaura; substituição de slot ou raiz restaura), proibição de listeners e timers tardios, sintaxe embarcada, compilação e assinatura APK oficial e TESTE57.
- **Escopo:** exclusivo Android; Web, banco, Home, Perfil, F1 e WWE sem mudanças. Versão Android 1.0.57/r299/code 10099, raiz 0.3.87.

## Android 1.0.56 — r298 (2026-10-20)

- **Escopo exclusivo do APK Android:** corrigidas a tremedeira intermitente e as recomendações repetidas ao usar Trocar em Descobrir > Pra Você. Código Web, Supabase e Home intocados.
- **Correção visual:** ao iniciar ou finalizar uma ação, os controles existentes agora são habilitados/desabilitados por propriedades, sem recriar todo o HTML da barra de ações. Isso evita reflow e piscadas de botões durante toques rápidos.
- **Reconciliação estável:** prioriza o card atual ainda válido antes de selecionar outro candidato; ignora alteração de epoch de rede quando a própria raiz de Pra Você continua montada, preservando escolha, pôster e posição de scroll.
- **Trocar sem repetição:** elimina o fallback que reciclava títulos já exibidos dentro do slot. A expansão autenticada v421/v525 é tentada dentro do limite existente; sem alternativa nova, mantém o card atual e avisa o usuário. Itens atualmente visíveis em outros slots também são excluídos.
- **Teste:** casos de esgotamento do pool, exclusão de escolhas previamente mostradas, duplicidade entre slots, identidade de visualização e estabilidade dos botões durante os estados ocupado/livre; compilação e assinatura do APK oficial e TESTE56 independente.
- **Versão:** Android 1.0.56/r298/versionCode 10098; raiz 0.3.86.

## Android 1.0.55 — r297 (2026-10-20)

- **Descobrir > Pra Você (Android):** análise do vídeo: o aparelho ainda mostrava Android 1.0.52 e aproximadamente nove segundos de tela vazia `Carregando títulos...` antes dos cards.
- **Carga inicial:** reduzida a quantidade de títulos candidatos por categoria de 48/30 para 24/16, conservando reposição autenticada por slot através do Trocar. Redução do volume enviado à auditoria v525; nenhuma alteração nos filtros de itens vistos, Watchlist, origem, duração, reality, stand-up ou WWE.
- **Watchlist vazia:** resposta válida `[]` deixa de acionar consulta redundante após 300 ms. Requisições com erro têm apenas uma tentativa adicional, com espera de 150 ms e prazo finito preexistente.
- **Erro de rede / nenhum resultado:** removida a condição em que um payload não auditado era recusado pelo controlador de sete slots, mantendo indefinidamente `Carregando títulos...`; a própria região Pra Você passa a mostrar aviso e botão `Tentar novamente`, sem refazer a página ou abandonar a aba.
- **Preservação:** sete slots com controles r278, auditoria Supabase v525, proteção de estado r296, Raw/SmackDown e todas as outras áreas mantidas. Web e SQL congelados.
- **Validação:** teste de sintaxe do JavaScript embarcado, fluxos de falha/vazio, recuperação por botão e não substituição dos cards válidos, workflow Gradle com build oficial e TESTE55 paralelo.
- **Versão:** Android 1.0.55/r297/versionCode 10097; raiz 0.3.85.

## Android 1.0.54 — r296 (2026-10-20)

- **Somente APK Android:** a Web permanece congelada; nenhuma alteração em `apps/web`, Supabase ou interface Web.
- **Descobrir > Pra Você:** corrigido o fechamento prematuro do controle do renderizador com apenas uma ação presente. O bloqueio de renderizações antigas passa a ocorrer somente depois dos **sete slots** autenticados estarem montados: cada card presente precisa ter os botões válidos e uma Watchlist legitimamente vazia deve ter um placeholder explícito. Espera assíncrona limitada a 90 frames, sem loops infinitos ou reload.
- **Raw e SmackDown:** substituída a restauração de clones com validade de três minutos por preservação do próprio nó DOM já exibido, observador limitado à Home Séries, prevenção de duplicidade, retenção máxima de dez minutos e invalidação ao acionar Assistido; nenhuma criação nem modificação de episódios.
- **Testes:** validação sintática do JavaScript embarcado e casos com sete slots válidos, categorias vazias, botões faltantes, grade incompleta/duplicada, verificação dos controles WWE e compilação/assinatura de APK oficial e APK TESTE54 independente.
- **Versões:** Android 1.0.54/r296/versionCode 10096; pacote raiz 0.3.84; tag android-v1.0.54.

## Android 1.0.53 — r295 (2026-10-20)

- Corrigida a substituição tardia dos slots internos do Descobrir/Pra Você causada pela reidratação de Watchlist legada. A proteção monitora a subárvore do conteúdo autenticado e restaura somente slots substituídos por HTML sem ações r278.
- Preservação do último título legitimamente selecionado em Trocar, sem sobrescrever outras categorias nem repetir o mesmo renderizador da Watchlist.
- Watchlist e Visto continuam mutações locais assíncronas, sem renderização de página inteira.
- WWE Raw e SmackDown: recuperação temporária de cards existentes na Home após chamadas de rede/redesenhos concorrentes, evitando desaparecimentos repentinos; nenhuma criação ou alteração de episódios.
- Teste automatizado reproduz troca legítima, substituição assíncrona e retenção da escolha mais recente, além da integridade dos módulos.
- Escopo Android; Web e projeto Android nativo intactos. Versões: 1.0.53/r295/versionCode 10095 e raiz 0.3.83.

## Web 0.3.70 / r543 — correção da chamada autenticada dos novos episódios da WWE

- **Causa raiz confirmada:** a rotina Web r542 de Raw/SmackDown chamava `window.__ctCoreR471.edge()`, mas a ponte de funções r471 exportava apenas `route` e `rpc`, não `edge`. Logo, a sincronização automática não podia ser iniciada pelo browser.
- **Correção estrita:** expor o `edge()` autenticado já existente na ponte de funções, preservando a sessão e sem introduzir chaves ou chamadas não autenticadas. Raw/SmackDown continuam atualizando somente seus cards da Home com o último episódio exibido, sem recarregar a página inteira.
- **Banco compartilhado:** episódios confirmados SmackDown T28E42 (16/10/2026) e Raw T34E42 (19/10/2026) já estão no catálogo e no campo `last_episode_to_air`. O patch faz a Home conseguir solicitar a atualização na Edge Function `ct-wwe-tv-refresh` e aplicar a novidade localmente.
- **Android:** r294 / 1.0.52 mantém dono exclusivo dos sete slots autenticados de Descobrir > Pra Você; Watchlist otimista escreve apenas o item selecionado, sem refetch global. Atualização WWE via a mesma Edge Function.
- **Escopo:** Web r541 continua congelada visualmente; somente a ponte autenticada da rotina Raw/SmackDown é alterada. Não mexer em F1, UFC, Perfil, Descobrir Web nem outras séries.
- **Validação:** teste executa a chamada do `edge` exportado e verifica os metadados r543, a ausência de reload, versão e preservação do marcador r541.

## CineTracker Android 1.0.52 / r294 + Web 0.3.69 / r542 — 20/10/2026

- **Descobrir > Pra Você (Android):** corrigido o último bloqueio quando só 3 ou 4 slots têm recomendações elegíveis na Watchlist. O renderizador r293 agora assume a autoridade mesmo com Watchlist parcialmente vazia; o observador só reconcilia se um renderizador antigo realmente substituiu a DOM, evitando ciclos de renderização e retorno às indicações repetidas. **Trocar**, **Assistido** e **Watchlist** permanecem otimistas e locais, sem reload de página.
- **WWE Raw e SmackDown (Web e Android):** registrados os episódios exibidos e verificados nas datas 09/10, 12/10, 16/10 e 19/10 no catálogo compartilhado, sem alterar marcações de assistido.
- **Atualização automática:** nova Edge Function `ct-wwe-tv-refresh`, autenticada e com proteção de frequência, busca as temporadas atuais no TMDB, preserva dados verificados da WWE e consolida o último episódio exibido. Chamadas em segundo plano ao entrar/reabrir a Home nas duas plataformas.
- **Home:** somente os cards Raw/SmackDown ganham indicação local de novo episódio não visto e podem mover seu próprio elemento para **Continuar assistindo**; nenhuma página é recarregada, nem outras séries são alteradas.
- **Web:** a base visual r541 permanece byte a byte. Nova r542 altera exclusivamente a integração automática de episódios da WWE, sem mexer em Perfil, Descobrir, F1, UFC ou layout.
- **Versões:** Android 1.0.52 / r294 / versionCode 10094; Web 0.3.69 / r542; raiz 0.3.81. APK TESTE52 `com.cinetracker.app.teste52` independente.

## Android 1.0.51 — r293 (2026-10-19)

- **Descobrir > Pra Você (causa raiz):** identificadas referências antigas a `paintDiscover` no r279 que não passavam pelas proteções mais recentes, concluindo uma auditoria assíncrona cerca de cinco segundos depois e substituindo os sete cards por recomendações repetidas da Watchlist. Adicionada proteção ao próprio renderizador original r158.
- **Trocar:** preservação dos sete títulos auditados v421/v525 e das seleções locais sob respostas antigas/concorrentes; não reinstancia os botões de Watchlist/Visto/Trocar.
- **Watchlist e Visto:** impede o `renderDiscover` antigo de recriar a página inteira durante mutações; só o card afetado muda. Protege sete nós DOM originais contra atualizações imperativas legadas, sem `location.reload`, `router.refresh` ou refetch bloqueante.
- **Isolamento:** controlador instalado antes do bootstrap, sem interferir em Home, Perfil, Esportes, F1 Hub, NFL ou abas diferentes de Descobrir; reset de estado por navegação e troca de usuário.
- **Testes:** validação de JavaScript/escopo, duas chamadas assíncronas tardias, primeiro render permitido, proteção contra recriação do shell, recuperação de DOM e acesso legítimo em nova navegação. APK assinado e TESTE51 side-by-side.
- **Web:** 0.3.68/r541 preservada. Android 1.0.51/r293/versionCode 10093, package root 0.3.80.

## Android 1.0.50 — r292 (2026-10-19)

- Corrigidos os contadores históricos de UFC (793), WWE (567) e Fórmula 1 (1.166) diretamente a partir do RPC de totais históricos v540. O card não mistura mais visualizações anuais com totais de outras temporadas.
- NFL Super Bowl: contador global de 120 episódios com histórico real do usuário (jogo + show do intervalo de cada ano), sem contar dados legados de temporada 0 e sem alterar episódios.
- Fórmula 1: registro legado sem pôster oculto somente da Home; registro da série não excluído do banco e série interativa com capa preservada.
- Descobrir > Pra Você: removido refetch visual que restaurava Watchlist antiga após primeira troca; bloqueio de repaint integral para a visita após a inicialização auditada e reconciliação somente local.
- Web r541 congelada. Nenhuma alteração em Perfil, F1 Hub, Esportes, Home Filmes ou código da Web.
- Testes: contadores e filtros de registros, primeira renderização e repaint concorrente em Trocar, integridade do APK assinado e package TESTE50 independente.
- Versões: Android 1.0.50/r292/versionCode 10092; raiz 0.3.79.

## Android 1.0.49 — r291 (2026-10-19)

- **Home UFC/WWE/F1:** botão de Assistido limitado a 36 × 36 px e centralizado verticalmente na extremidade direita. O status de UFC/WWE agora distingue visualizações da temporada atual dos 793 e 567 episódios totais, respectivamente, consultando o catálogo existente.
- **NFL Super Bowl:** logo real da NFL no card e na tela da série; temporada por ano mantida de 1967 a 2026. Temporada 1 = jogo do Super Bowl; temporada 2 = show do intervalo, com capas e títulos próprios. Não cria, duplica ou altera os 120 episódios existentes nem os estados Assistido.
- **Descobrir > Pra Você:** corrige a causa de reversão para a versão antiga: nova resposta autenticada não deve repintar os sete slots durante a mesma navegação, preservando as trocas otimistas feitas pelo componente final r278. Outras telas não são recarregadas.
- **Escopo:** Web r541 congelada; Perfil, Esportes, F1 Hub, histórico completo, login e outras seções preservados.
- **Validação:** teste do ciclo de primeira renderização, dois Trocar e navegação posterior, além de checagem de metadados NFL, botão compacto, assinatura e APK TESTE49 independente.
- **Versões:** Android 1.0.49/r291/versionCode 10091; package root 0.3.78.

## Android 1.0.48 — r290 (2026-10-19)

- **Home Séries:** UFC, WWE e F1 inseridos usando o mesmo grid de dois elementos dos demais cards: pôster e progresso na esquerda e botão ✓ na extrema direita. Dados e telas existentes preservados.
- **NFL Super Bowl:** implementada página autônoma com seleção por ano (1967–2026), dois episódios existentes por ano mapeados às temporadas 1/2 e registro/desmarcação otimista usando os RPCs de episódio já existentes. Nenhuma modificação nos 120 registros já marcados.
- **Perfil:** históricos de filmes, séries, episódios e esportes ordenados do mais recente para o mais antigo; Watchlist de filmes/séries consulta v119 e oferece Último adicionado, Primeiro adicionado, A–Z e Z–A.
- **Descobrir > Pra Você:** estabilização do renderizador final auditado v421/v525, com reconciliação limitada somente quando uma renderização antiga substitui os controles.
- **Web:** 0.3.68/r541 congelada, sem alterações nativas.
- **Versões:** Android 1.0.48/r290/versionCode 10090; raiz 0.3.77; TESTE48 com package separado.
- **Validação:** teste Node para mapeamento NFL e histórico, 3 Home cards, quatro ordenações, dono de recomendações, build e assinatura de APK.

## Android 1.0.47 — r289 (2026-10-19)

- **Perfil:** restaurada a abertura dos contadores das Watchlists de Séries e Filmes via modal completo existente, e implementadas janelas de histórico por Filmes, Séries e Esportes (TV e estádio) com RPCs autenticadas.
- **F1 Hub:** classificação de pilotos e construtores com normalização do formato da resposta de standings, fallback ao Jolpica F1 e cache de temporada; ausência de dados exibida claramente com atualização manual.
- **Home UFC, WWE e Fórmula 1:** substituição da apresentação especial divergente pela estrutura `home-action-row` original e botão compacto de assistir (36×36px), preservando ordem das demais séries e último estado conhecido.
- **Descobrir — Pra Você:** proteção final contra sobrescrita de cards autorizados v421/v525 por renderizações anteriores e contra invalidação global no meio de mutações.
- **Escopo:** Web r541 congelada; nenhum componente Web, nativo Android, Perfil fora do solicitado, esporte não-F1 ou histórico de filmes v542 alterado.
- **Testes:** scripts `prepare-android-v1047.mjs` e `test-android-v1047.mjs`, CI independente `release-android-v1047.yml`, verificação de APK assinado.
- **Versões:** Android 1.0.47/r289/versionCode 10089, raiz 0.3.76, aplicativo TESTE47 instalável paralelamente.

## Android 1.0.46 — r288 (2026-10-19)

- Descobrir Pra Voce: ignora paints assincronos nao canonicos de owners antigos e preserva 7 slots v421/v525; rotacao na abertura e limite de espera das mutacoes.
- Home UFC/WWE/F1: cards inseridos diretamente como linhas, snapshot de ultimo resultado valido e placeholders navegaveis sem inventar contagem.
- Botao marcar assistido: 36x36px, evitando expansao indevida na Home.
- Verificacao automatizada: casos de sete slots, chamadas legadas atrasadas, tres especiais e perda temporaria de sincronizacao.
- Android 1.0.46 r288 versionCode 10088, raiz 0.3.75, APK TESTE46 instalavel em paralelo. Web r541 congelada.

## Android 1.0.45 — r287 (2026-10-19)

- **Erro crítico reproduzido:** APK 1.0.44 abria em tela preta, sem login, por `ReferenceError: mountSpecial263 is not defined` durante a inicialização.
- **Raiz corrigida:** script Android r286 movido para dentro do fechamento lexical da r263, único local que contém as funções das séries especiais; sem exportar estado privado globalmente.
- **Resiliência:** fronteira `try/catch` ao registrar aprimoramentos especiais, para não interromper login em eventual erro desse módulo.
- **Regressão:** navegador headless comparando login das versões 1.0.43, 1.0.44 e HTML corrigido; testes JS de escopo/sintaxe automatizados na build.
- **Preservados:** 7 slots do Pra Você r286, UFC/WWE/F1 da Home, Perfil e histórico v542. Web r541 congelada.
- **Versões:** Android 1.0.45 / r287 / versionCode 10087; versão raiz 0.3.74; pacote TESTE45 independente.

## Android 1.0.44 — r286 (2026-10-19)

- **Descobrir > Pra Você:** remove bloqueio permanente de Trocar causado pelo limite de alternativas; mantém os botões de Adicionar à Watchlist, Assistido e Trocar nos respectivos sete slots.
- **Trocar:** escolhe alternativa imediatamente de um conjunto autenticado e autorizado pelas RPCs v421/v525; quando necessário, atualiza o pool autenticado (inclusive Watchlist), em vez de recair em recomendações genéricas de TMDB e submeter cada toque a até 12 requisições TMDB.
- **Rotação:** prioriza indicações não vistas anteriormente ao reabrir Pra Você. Sem navegar/recarregar a página para ações locais.
- **Home UFC/WWE/F1:** cards especiais removidos do topo fixo da lista; ação rápida de Assistido utiliza os mesmos RPCs de registro da tela especial, atualiza otimisticamente e sincroniza do banco sem recarregar toda a Home; eventos UFC e WWE são sincronizados periodicamente na Home.
- **Escopo estrito:** Web r541 intocada, pacote Android nativo e Home regular preservados; Perfil da r285 preservado.
- **Validação:** script de preparação `scripts/prepare-android-v1044.mjs`, verificação `scripts/test-android-v1044.mjs`, workflow `release-android-v1044.yml` e assinatura de dois APKs.
- **Versões:** Android 1.0.44/r286/versionCode 10086, package root 0.3.73, aplicativo TESTE44 independente.

## Android 1.0.43 — r285 (2026-10-19)

- Correção do card desproporcional de **Indicação do Dia**: coluna dimensionada como um dos três cards da seção e pôster 2:3, respeitando altura intrínseca.
- **Adicionar à Watchlist / Marcar visto:** suprime apenas o evento genérico de refetch durante a mutação otimista em Descobrir > Pra Você; elimina a invalidação global das recomendações já verificadas e mantém os demais cards estáveis.
- **Trocar:** elimina segunda filtragem redundante depois do banco v421 e auditoria v525; preserva as alternativas reais. Sem duplicar ações nem preencher a Watchlist com títulos inventados.
- **Perfil:** substitui o carregamento sequencial/monolítico por recuperação progressiva e independente de estatísticas (`cinetracker_profile_quick_stats_v1`), biblioteca (`cinetracker_profile_summary_v489`), esportes (`cinetracker_sports_stadium_summary_v296`) e atividade (`cinetracker_activity_by_day_v517`), com cache válido por usuário e fallback limitado.
- **Preservados:** histórico de filmes v542, Home, Esportes e funcionalidades não solicitadas; Web permanece em r541. Não altera a Activity Android.
- **Validação:** `scripts/prepare-android-v1043.mjs`, `scripts/test-android-v1043.mjs`, GitHub Actions `release-android-v1043.yml` com APK oficial e TESTE43, assinatura e conferência de metadados.
- **Versão:** Android 1.0.43 / r285 / code 10085. `package.json` raiz incrementado para 0.3.72.

## Android 1.0.42 — r284 (2026-10-19)

- **Escopo:** somente Android. Web congelada em 0.3.68/r541, sem alterações em `apps/web/**`.
- **Home > Filmes > Histórico recente:** passa a recuperar todas as páginas de `cinetracker_home_movie_history_v542` (até 120 por página), mesclando-as com registros de `watch_history`, `watch_play_events_v0994`, `media_overrides.AlreadySeen` e dashboard já coletados pela r283. Mantém datas reais, reexibições distintas, registros antigos, paginação visual e posição de scroll. Falhas de página não substituem o histórico anterior por resultado parcial.
- **Descobrir > Pra Você:** troca dependência inicial dos pools TMDB por seis consultas autenticadas `cinetracker_discover_fresh_v421` e `cinetracker_discover_watch_unseen_v421`, processadas concorrentemente; verificação final de elegibilidade em `cinetracker_recommendation_filter_v525` antes da exposição dos sete slots. Somente candidatos confirmados entram em 100% novos, e candidatos realmente presentes na Watchlist entram em Da sua Watchlist.
- **Filtro Watchlist:** títulos da Watchlist não são descartados pelo corte de nota, aplicado somente aos novos; continuam valendo elegibilidade de conteúdo e auditoria v525.
- **Estabilidade:** refresh escopado, trava para requisições em voo, resultados isolados por usuário, controle de lote finito e estado local sem reload de página.
- **Android:** build `1.0.42` (`versionCode 10084`), APK normal e TESTE42 lado a lado via `release-android-v1042.yml`; teste `scripts/test-android-v1042.mjs`. Sem mudanças na Activity nativa.

## Android 1.0.41 — r283 (2026-10-19)

- **Home > Filmes > Histórico recente:** adiciona à conciliação existente de watch_history e watch_play_events os registros reais de `media_overrides.AlreadySeen` que possuam `watched_at` e os filmes vistos com `last_watched_at` em `cinetracker_profile_media_dashboard_v0991`. Preserva filmes anteriores (incluindo Pokémon) e posteriores sem inventar datas ou inserir não assistidos; identifica aliases de TMDB e elimina duplicação de um mesmo filme/visto em janela curta. Nenhuma substituição da página ou salto de scroll.
- **Descobrir > Pra Você:** o reconciliador r277 e o seletor final r268 deixam de descartar novamente candidatos aprovados pelo filtro autenticado r279/v525 por causa de contexto local incompleto. Somente `v525` verificado habilita os slots; preservados bloqueios de assistidos, Watchlist, exclusões de conteúdo, alias e diferenciação entre Indicação do Dia e 100% Novos. Nenhuma inserção artificial de itens na Watchlist.
- **Feedback real de carregamento:** placeholders exibem “Verificando indicações elegíveis…” enquanto as consultas seguem em andamento e “Buscar novamente” depois de esgotadas, sem fingir que inexistem conteúdos enquanto o servidor não respondeu.
- **Escopo:** mantém Web r541, Activity e layout Android, sports/watch, F1 Hub, home séries, perfil e suas métricas sem mudanças; otimização local/cached sem reload. Testes abrangem filmes após Pokémon, não assistidos excluídos, slots auditados e ausência de refresh.
- **APK TESTE41** com pacote independente `com.cinetracker.app.teste41`; validação funcional com dados reais do dispositivo ainda depende de teste em aparelho.

## Android 1.0.40 — r282 (2026-10-19)

- **Refinamento dos problemas reportados em vídeo:** as três consultas de recomendação continuam paralelas também na etapa autenticada v525, usando lotes isolados por categoria: série/anime lenta não bloqueia filmes. O estado visual de auditoria pendente não esconde mais cards que já passaram no filtro final.
- **Histórico sem espera de 1.200 registros antigos:** exibe as reproduções recentes reais de `watch_play_events_v0994` e o resumo v323 antes da paginação antiga, integrando as páginas restantes depois, sem substituir dados recentes nem deslocar a posição da lista.
- **Release gate:** corrigido erro de sintaxe do teste VM que estava impedindo o build de 1.0.40; regressão adicional exige concorrência verificável na auditoria.

- **Home > Filmes, Histórico recente:** elimina a trava que impedia atualizar o histórico mais de uma vez no dia. Concilia sem descartar registros antigos as três fontes autenticadas: histórico `watch_history` paginado, `cinetracker_home_movie_history_v323` e reproduções reais recentes `watch_play_events_v0994` com metadados confirmados em `media`. O histórico completo permanece no cache por usuário durante redesenhos leves da Home. Mantém ordem cronológica (mais recentes embaixo) e paginação visual já existente; sem carregar a página inteira.
- **Descobrir > Pra Você:** corrige rota antiga de `discoverRows` que invocava a seleção rápida sem percorrer o filtro autenticado final da v525; novo owner de sete slots pesquisa filmes, séries e animes com requisições TMDB independentes e delimitadas, submete os candidatos à auditoria **`cinetracker_recommendation_filter_v525`** antes de exibi-los e mostra cada categoria validada sem aguardar as demais. Uma segunda página limitada é buscada apenas quando não restam opções. As três categorias **Da sua Watchlist** continuam dependentes de Watchlist real do dashboard autenticado; sem títulos aleatórios.
- **Filtros preservados:** vistos, Watchlist, aliases, progresso, restrições AEW/luta livre, UFC/MMA, reality, stand-up, YouTube, filmes com menos de 40min, ano e nota. Corrige exclusão indevida do gênero Drama (18) no validador TMDB da versão anterior; falha temporária em consulta de detalhes não marca candidato permanentemente como proibido.
- **Layout:** Indicação do dia vazia deixa de ser coluna estreita de ~100px e mensagens duplicadas; cada categoria mantém apenas um placeholder e os controles usam a barra já existente sem sobrepor o conteúdo.
- **Escopo e verificações:** Web 0.3.68/r541, Perfil, esportes/assistido, F1 Hub, navegação, shell nativo, Home Séries e episódios intactos; proibição de page reload mantida. Testes automatizados de reprodução após Pokémon, preservação da história anterior, consulta paralela, bloqueios v525 e layout; APKs oficial e TESTE40 com SHA256; dados privados no aparelho exigem confirmação.

## Android 1.0.28 — r270 (2026-10-19)

- **Perfil:** vídeos mostram estatísticas reais mas seções de Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores vazias. Um cache/status-only de Profile era repintado com `dashboard: []`. Agora o último dashboard real é preservado por usuário (sem cruzar contas) e consultas recuperam as listas independentemente das estatísticas: `cinetracker_profile_media_dashboard_v0997_fast`, fallback `v0991` e leitura REST autenticada, com reconstrução dos estados e favoritos. Nada é inventado: quando a biblioteca realmente está vazia, continua vazia. As listas continuam 12 cards + botão Ver mais.
- **Descobrir → Pra Você:** elimina o bloqueio da primeira pintura por 18 páginas TMDB + auditorias + pools adicionais. Exibe os sete slots com dados elegíveis em cache por usuário imediatamente e consulta as três categorias em paralelo. Cada retorno passa por `ct186FreshEligible`, filtros de duração/origem/Aew/luta livre/YouTube/reality/stand-up e `audit263` da própria base; só então atualiza o slot e armazena por usuário/dia. Busca popular adicional é usada apenas para categorias realmente vazias e é limitada; Da sua Watchlist só mostra itens da Watchlist real. Outras abas de Descobrir seguem pelo renderizador original, sem regressão.
- **Home Filmes > Histórico:** o SQL r5 devolve no máximo 80 filmes do histórico; a extensão Android consulta `watch_history` do usuário autenticado com paginação limitada de até 600 registros, associa `media` para obter título/poster verdadeiros, ordena cronologicamente e preserva o scroll. Desenho inicial de 120 cartões e botão Mostrar mais 120 antigos evita carregar centenas de pôsteres de uma vez.
- **Esportes > Assistido:** substituídos os dois handlers que recriavam a tela e refaziam a requisição de toda a agenda. Mutação otimista imediata do estado e botões, trava síncrona por evento, RPC `cinetracker_sport_mark_watched_v1`, rollback caso falhe, sem repintar a tela, sem scroll ao topo e sem exigir segundo clique.
- **Validações:** testes automatizados de código embutido, recuperações de Perfil, cache de recomendações, preservação das outras abas, paginação histórica e Sport watch in-place. APK oficial e TESTE28 assinados/validados por SHA-256. Não há simulação de dados privados e o resultado real ainda deve ser validado no aparelho.
- **Escopo:** Web 0.3.68/r541, F1 Hub, tela e Activity nativa, serviços Supabase, estrutura do Perfil e regras esportivas continuam inalteradas, preservando o que já funciona.

## Android 1.0.39 — r281 (2026-10-19)

- **Perfil vazio:** a consulta total `cinetracker_profile_payload_v0997` frequentemente entrega apenas estatísticas antes de toda a biblioteca, deixando indevidamente as seções “Nenhum item”. O Android agora carrega separadamente a função já existente **`cinetracker_profile_summary_v489`** com os 12 itens de Séries, Filmes, Séries favoritas, Filmes favoritos e Atores. Ela é convertida para o contrato de cards existente sem alterar o banco ou a Web.
- **Sem estatísticas zeradas ou listas apagadas:** um repaint rápido do Perfil não pode substituir uma biblioteca preenchida por `dashboard:[]`; as estatísticas existentes permanecem. Um cache de somente 12 itens por seção é segmentado por usuário e possui expiração de 30 minutos. Erro de consulta deixa aviso explícito e botão Tentar novamente, não indica falsamente “Nenhum item”.
- **Pra Você:** preserva a auditoria final autenticada `cinetracker_recommendation_filter_v525` da 1.0.38. Primeira onda verifica até 12 candidatos de cada lista (até 8 reservas), com três lotes paralelos; se restar categoria nova vazia, uma segunda onda assíncrona verifica até 24 opções da fonte original sem reutilizar candidatos vistos, Watchlist ou sem confirmação do servidor. A interface reexibe apenas resultados elegíveis. Não mistura categorias da Watchlist com descobertas novas.
- **Performance:** evita depender da grande RPC do Perfil para mostrar os cards de biblioteca. A busca detalhada só é disparada ao entrar no Perfil, sem preload concorrente na Home; a segunda auditoria do Pra Você não bloqueia a primeira renderização verificada.
- **Escopo:** Web 0.3.68/r541, Home, histórico, Esportes, F1 Hub, telas de episódios e Activity/layout nativos inalterados. Nenhuma mutação faz `window.location.reload()` ou `router.refresh()`.
- **Testes:** confirmação da estrutura Android com versionCode 10081, teste VM da resposta real v489 (filmes, séries, favoritos, atores), validação de preservação de estatísticas, de não esvaziar biblioteca por repaint e do segundo lote auditado. APKs assinados e TESTE39 com applicationId independente `com.cinetracker.app.teste39`. Dados reais no aparelho ainda exigem validação.

## Android 1.0.38 — r280 (2026-10-19)

- **Perfil vazio:** o usuário vê imediatamente os últimos dados verificadamente carregados para sua própria conta; sem snapshot, há aviso de sincronização, resumo alternativo pela RPC existente `cinetracker_profile_screen_v495` e botão Tentar novamente sem full reload. Estatísticas desconhecidas não são convertidas em zero. O detalhe completo continua carregando pelo owner anterior e atualiza a interface quando retorna.
- **Descobrir > Pra Você vazio/lento:** corrigida a perda definitiva dos pools de candidatos quando algum lote autenticado da RPC `cinetracker_recommendation_filter_v525` falha ou expira; preservação interna por objeto + nova validação de até 16 candidatos por categoria por janela. Apenas itens **aprovados pelo servidor para a própria conta** podem aparecer. Há aviso e botão Verificar novamente em resultados parciais, com até duas retentativas delimitadas. Não preenche manualmente a Watchlist nem libera conteúdos já vistos/não elegíveis.
- **Prioridade de carregamento:** desativado o pré-carregamento global de dez ou mais consultas paralelas enquanto o usuário já navega em Home/Perfil/Descobrir/Esportes. Cada aba mantém seu carregador autoritativo e cache já validado. Sem alterar o fluxo de carregamento das demais funcionalidades.
- **Validação:** teste automatizado de falha e recuperação da v525 sem vazamento, owner isolado no cache do Perfil, assinatura/compilação do APK e integridade SHA256; validação em aparelho real ainda necessária.
- **Escopo:** Web r541, shell nativo, F1, Esportes (inclusive marcadores sem refresh), Histórico de filmes, Android 1.0.37 e operações Visto/Watchlist preservados; apenas comportamento de carregamento/recuperação das áreas reportadas. APK TESTE38 com pacote separado.

## Android 1.0.37 — r279 (2026-10-19)

- **Correção de recomendações já vistas/Watchlist:** seleção final do Pra Você agora consulta a RPC autenticada existente `cinetracker_recommendation_filter_v525`, que confere estados de Watchlist, vistos, episódios, progresso, títulos alternativos e itens ignorados. Candidatos novos só aparecem quando a consulta confirma ausência de histórico/Watchlist. "Da sua Watchlist" só recebe os que estão realmente nessa lista e ainda não foram vistos; não há fallback de candidatos aleatórios.
- **Todos os sete slots e Trocar:** valida lotes limitados por tipo, incluindo pools de reposição e novas opções solicitadas ao trocar. Respostas desconhecidas/erro não exibem uma indicação potencialmente errada. Previne exposição de cards não verificados durante a primeira pintura e no carregamento assíncrono. Mantém as regras pré-existentes de nota, data, duração, YouTube, stand-up, realities, AEW/WWE/luta livre e MMA.
- **Home Séries, UFC/WWE/F1:** removida a abertura em `pointerdown`. Gestos agora verificam movimento vertical acima de 10px, mudança de scroll, cancelamento e tempo do toque antes de abrir no `click`. Rolagem livre, ação via teclado preservada; nenhuma navegação/refresh no início do toque.
- **Estrito escopo:** não modifica o código Web r541, Activity Android, layouts nativos, Perfil, Esportes, histórico, F1 Hub, lógica WWE/F1 de episódio, ou marcação de assistido. Nenhuma mutação com reload.
- **Testes:** r278 (preexistentes) e r279 com bloqueios retornados de v525, distinção dos sete slots, candidato novo não auditado, scroll/drag/cancel/tap/teclado para UFC/WWE/F1, sintaxe, assinatura, checksum e verificação do APK.
- **Instalação:** TESTE37 paralelo (`com.cinetracker.app.teste37`), mantendo testes anteriores.

## Android 1.0.36 — r278 (2026-10-19)

- **Correção do vídeo:** o Trocar do r277 selecionava sempre `options[0]`, de modo que o card A alternava para B e imediatamente voltava a A. Agora existe lista de títulos já mostrados, por **usuário/dia/slot**, com persistência na sessão. Candidatos mostrados ficam excluídos das próximas trocas — sem circulação A-B-A — inclusive após repintura local.
- **Regras completas antes da troca:** respeita histórico/progresso e Watchlist reais, nota mínima/ano/gêneros e exclusões; cada **novo** candidato é validado com detalhes TMDB, rejeitando explicitamente AEW/WWE/luta livre/MMA, stand-up, realities, curtas de menos de 40 minutos e produções originárias do YouTube. Falha na busca de detalhe não autoriza a indicação (fail-closed).
- **Carregamento e reposição:** auditoria de até quatro detalhes em paralelo, em no máximo 12 opções por rodada; quando as alternativas locais acabam, faz apenas uma busca complementar delimitada por categoria. Se a lista da Watchlist acabar, mantém o último candidato e desabilita Trocar, sem inventar indicação nem voltar ao início.
- **Só uma ação por toque:** mantém o listener único r277, trava por slot, guarda de clique duplicado, componentes Visto e Watchlist com media ID correto, UI local sem reload ou salto de scroll. Registra a opção descartada em `cinetracker_recommendation_record_v113` em segundo plano.
- **Auditoria dos slots atuais:** os candidatos inicialmente exibidos são verificados em segundo plano; se um for proibido nos detalhes, é retirado do slot, e a seleção procura alternativa válida. Nenhum título inelegível é aceito em novas trocas.
- **Escopo protegido:** nenhuma mudança em Web 0.3.68/r541, Home Filmes/Séries, Histórico, Esportes, Perfil, F1 Hub, navegação e Activity Android.
- **Testes:** duas opções não voltam à primeira; regras de runtime, YouTube, reality, AEW e fluxo Visto/Watchlist; sintaxe do bundle, integridade e assinatura dos APKs. Validação com dados reais no dispositivo ainda pendente.
- **APK de teste:** `com.cinetracker.app.teste36` separado de TESTE35.

## Android 1.0.35 — r277 (2026-10-19)

- **Escopo único:** Descobrir > Pra Você, sem modificar Web r541, Home, Histórico, Esportes, Perfil, F1 Hub ou Activity nativa.
- **Um único renderizador de ações:** remove botões/rodapés herdados do r166/r169/r237/r274/r275 e os substitui por uma barra única com referências explícitas `movie:TMDB_ID` / `tv:TMDB_ID`, válida somente para a mídia daquele slot.
- **Sem "++":** cada controle Watchlist mostra um único `+` como texto, sem pseudo-elementos duplicados. Watchlist dispõe de Visto e Trocar; Indicação do dia e 100% Novos dispõem de Watchlist, Visto e Trocar.
- **Clique funcional:** listener único com trava contra cliques concorrentes. Watchlist chama `addWatchlist(type,id)`; Visto chama `markSeen(type,id)`; Trocar substitui o card por outro candidato do mesmo grupo. Bloqueia antigos listeners r237 e r275 SOMENTE enquanto a aba Pra Você está ativa.
- **Regras:** os sete slots respeitam autenticidade e elegibilidade pessoal: assistidos/histórico/progresso, Watchlist de verdade, tipo filme/série/anime, poster, score mínimo, período, curtas (<40 min), origem YouTube, realities, stand-up, AEW/WWE e MMA. Os três slots Da sua Watchlist nunca aceitam sugestões de fora dela; slots verdadeiramente vazios permanecem explicitamente vazios.
- **UI imediata:** mutação otimista no estado local, sem reload, sem resetar scroll e sem refetch síncrono da aba inteira. Falha restaura somente o título afetado.
- **Testes:** asserts de código-fonte, montagem segura, filtros reais, único conjunto de controles com ícones corretos, parâmetros Watchlist/Visto e inexistência de comportamento fora da aba; assinatura/verificação SHA-256 dos dois APKs.
- **APK TESTE35:** aplicativo paralelo `com.cinetracker.app.teste35`; mantém instalação anterior intacta.

## Android 1.0.34 — r276 (2026-10-18)

- **Home Séries — WWE Friday Night SmackDown e Raw:** o banco tem último episódio TMDB de 02/10 (SmackDown T28E40) e 05/10 (Raw T34E40). A versão Android busca os episódios efetivamente exibidos da temporada TMDB antes de decidir o bucket. Na falha de consulta, usa somente as transmissões verificadas: SmackDown T28E42 em 16/10/2026 e Raw T34E41 em 12/10/2026; jamais presume episódios futuros.
- **Comportamento:** se SmackDown T28E41 foi assistido e T28E42 não, SmackDown vai para Continuar assistindo. Se T28E42 for marcado, retorna a Em dia. Raw só vai para Continuar quando houver episódio realmente lançado posterior ao último marcado. Episódios anteriores não assistidos continuam contando no histórico, sem mudar a regra das séries semanais.
- **Descobrir > Pra Você:** preservado o runtime r275/1.0.33 (sete slots, auditoria completa, botões Visto/Watchlist/Trocar e grid sem sobreposição). Até seis imagens alternativas dos pools válidos são aquecidas com atraso após a primeira pintura, diminuindo a chance de pôster em branco no Trocar sem bloquear a tela.
- **Outras correções preservadas:** r271/r273 mantém marcação esportiva otimista sem rolagem e histórico cronológico completo de filmes após Pokémon.
- **Escopo:** apps/web, Activity nativa, banco, F1 e histórico não são alterados. Não há reload/refetch completo em mutações; o patch captura erros de startup.
- **Testes:** SmackDown 42 assistido/não assistido, Raw 41 assistido/42 futuro, outras séries intocadas, preservação de testes r275 e APK TESTE34 com pacote distinto com.cinetracker.app.teste34. A verificação em aparelho permanece pendente.

## Android 1.0.33 — r275 (2026-10-18)

- **Somente Descobrir → Pra Você:** substitui o runtime r274 diretamente em vez de empilhar outra camada, preservando as sete posições e todos os módulos de Home, Histórico, Esportes, F1 e Perfil.
- **Correção funcional:** o botão antigo `Na Watchlist` era desabilitado e recebeu apenas um novo texto/aria-label. Agora é substituído por uma ação real e ativa **✓ Visto**, com marcação otimista e rollback através da função existente. Os cards da Indicação do Dia e 100% Novos mostram três ações distintas: Watchlist, Visto e Trocar. Os de Da sua Watchlist mostram Visto e Trocar.
- **Trocar:** o handler legado r237 consome o evento de clique antes do reformatador r274; agora a reformatação ocorre após o clique observado por pointerdown (ou Enter/Espaço), garantindo ações funcionais mesmo depois de trocar o conteúdo.
- **Formatação:** cards 2:3, títulos truncados em linha única e rodapé de ações em grid com espaço próprio de 42px, sem sobrepor a imagem, título ou a próxima seção.
- **Regras preservadas:** filtro personalizado autenticado contra Visto, Histórico/progresso, Watchlist e Não Tenho Interesse; mínimo 7,5, 1991+, curtas (<40min), origem YouTube, stand-up, reality, documentário e AEW/WWE/MMA. Da Watchlist apresenta exclusivamente itens pertencentes à Watchlist e ainda não vistos. Auditoria TMDB de detalhes e RPC `cinetracker_recommendation_filter_v525` continuam obrigatórias.
- **Performance:** mantém busca paralela limitada de seis páginas TMDB e snapshot validado contra o contexto autenticado antes de reutilizar, sem apresentar um cache desatualizado como resultado novo.
- **Teste:** o vídeo recebido registra Android **1.0.31/r273**, não o 1.0.32/r274; testar especificamente a instalação separada TESTE33. Sem validação real de Supabase no aparelho no processo CI.
- **Escopo:** Web r541 e todas as demais abas Android intocadas; versão, README, changelog e APK de teste independente.

## Android 1.0.32 — r274 (2026-10-18)

- **Escopo exclusivamente Descobrir → Pra Você.** Nada foi alterado em Home, Histórico Filmes, Esportes, F1 Hub, Perfil, navegação, API de assistidos, Android Activity ou Web 0.3.68/r541.
- **Tempo de carregamento:** primeira seleção faz até duas páginas TMDB em paralelo por Filme/Série/Anime, depois um fallback delimitado quando realmente necessário. Mantém o filtro de recomendações Supabase v525 e a verificação detalhada TMDB dos títulos que podem ser exibidos, mas limita a primeira amostragem auditada a 12 por categoria nova e oito por categoria da Watchlist, em vez de 45/30. Contexto autenticado tem TTL de 60 segundos e notificações de mutação invalidam corretamente.
- **Retorno rápido e sem vazamento:** cache local curto do resultado previamente auditado (usuário + dia), exibido **somente depois** de confrontado novamente com histórico real e Watchlist; visto passa a não aparecer em 100% Novos/Indicação do dia, e Watchlist recebe apenas entradas reais da Watchlist. Ao marcar visto/adicionar à Watchlist o cache é invalidado. Nenhum conteúdo é inventado quando não há elegíveis.
- **Sete cards e ações:** pôsteres sempre 2:3, títulos e metadados em linha única com truncamento, altura própria de rodapé e botões independentes de +Watchlist / ✓ Visto / ↻ Trocar nas indicações novas e ✓ Visto / ↻ Trocar nas sugestões da Watchlist. Não sobrepõe texto, respeita cliques imediatos sem reload; r193 mantém API de assistidos original e otimista.
- **Segurança inicial:** patch isolado em try/catch para nunca deixar a tela preta caso haja futura divergência; testes automáticos validam login, filtragem, cache, três buscas paralelas por categoria, CSS limitado ao Pra Você, controles e proibição de reload; sem validação em aparelho real.
- **Distribuição:** APK TESTE32 usa `com.cinetracker.app.teste32` e não substitui o TESTE31.

## Android 1.0.31 — r273 (2026-10-18)

- **Correção prioritária da tela preta:** a versão 1.0.30 tentava acessar funções `fetchAllMovies271` e `paintMovieHistory271` privadas do módulo r271. A exceção `ReferenceError` ocorria antes de `boot()`, bloqueando inclusive a tela de login.
- **Inicialização:** reconstruído a partir do bootstrap da 1.0.29 (que não incluía o patch que interrompia o login); introduzida bridge explícita para funções do Histórico, sem depender de acessos livres entre IIFEs.
- **Falha isolada:** o patch r273 de Histórico usa `try/catch` e mantém o `boot()` disponível mesmo se alguma integração opcional falhar, registrando `__ctR273StartupError`.
- **Histórico:** conserva registros antigos e novos de visualizações, paginando a exibição em blocos de 120 + 100, preservando posters com carregamento preguiçoso. **Esportes:** mantém marcação otimista sem refresh/rolagem ao topo.
- **Testes adicionais de inicialização:** execução real do JavaScript isolado em VM, incluindo cenário com bridge válida e ausente; ambos precisam chegar ao `boot()` sem exceção fatal, além de testes de merge do Histórico e poster.
- **Escopo:** Web r541, código nativo Activity, navegação, login/autenticação, F1, recomendações e estado da conta intocados. TESTE31 é aplicativo separado e não apaga instalações anteriores.

## Android 1.0.30 — r272 (2026-10-18)

- **Histórico correto, sem desaparecer após Pokémon:** `watch_history` tem 948 filmes até 19/09/2026, enquanto `watch_play_events_v0994` inclui eventos reais até 13/10/2026. A versão 1.0.29 paginava apenas o histórico antigo e substituía a lista recente. Agora `cinetracker_home_movie_history_v323` é conciliada com todos os registros históricos, mantendo **filmes posteriores a Pokémon**, reassistidos e datas do banco sem fabricar dados. O Histórico começa com os 120 mais recentes, com “Carregar anteriores” em lotes de 100, sem perder a posição.
- **Pôsteres:** o observador de imagens da r270 é reativado após cada atualização do Histórico, inclusive após paginação; apenas as imagens próximas da tela requisitam a proxy do TMDB.
- **Esportes:** preservada a correção estrutural de captura antecipada da r271; clicar em Assistido atualiza o botão e cache, utiliza RPC única, confirma/volta em erro, sem `paintSports()`, `sportsPayload(true)`, reload ou saltar para o topo. Janelas de time/competição também não são remontadas.
- **Pra Você:** a r270 entrega os primeiros lotes filtrados sem aguardar reservas; a r271 prioriza afinidade. O cache rápido por usuário da r271 só é reutilizado se o contexto de histórico/watchlist está validado; caso contrário revalida antes de exibir cartões. Não relaxa exclusões de AEW/WWE, YouTube, realities, stand-up, curtas, duração e visto/watchlist.
- **Validação:** compile/syntax, regressões de data e plays de setembro/outubro, carregamento incremental do Histórico e lazy posters, regras de toque de Esportes sem re-pintura e conformidade do APK. Testes com dados autenticados no próprio dispositivo ainda são necessários.
- **Escopo:** Web r541, Android Activity, F1 Hub, Top10 e demais módulos preservados. APK TESTE30 com pacote separado `com.cinetracker.app.teste30`.

## Android 1.0.28 — r270 (2026-10-18)

- **Histórico de filmes:** diagnóstico confirmado por consultas SQL: o legado `watch_history` possui 948 registros, mas seu último filme é de 19/09/2026. A segunda tabela de eventos `watch_play_events_v0994` contém exibições em outubro (até 13/10). A Home Android descartava esses eventos por usar exclusivamente `cinetracker_home_live_v0997_r3`. Agora a tela complementa o payload com a função autenticada **existente** `cinetracker_home_movie_history_v323(p_limit=100)`, unificando as fontes, preservando título, pôster, data, quantidade de exibições e ordenação cronológica. Não altera registros nem inventa datas. Atualiza somente a lista de Histórico, mantendo a posição de rolagem.
- **Esportes — marcar assistido:** substituídos diretamente os handlers legados r159 (que aguardavam `sportsPayload(true)` e chamavam `paintSports()`) e o handler de modalidades r168. Novo fluxo de **uma única RPC**, atualização imediata do item e cache esportivo, trava síncrona contra toque duplo, confirmação no banco e rollback com erro. A página e a posição do scroll não são reconstruídas. Handler de detalhes de jogos r263 também não redesenha overlay nem dispara evento global após marcação.
- **Descobrir — Pra Você:** carregamento em duas fases: valida o contexto/histórico da conta, recupera candidatos já vistos no cache apenas após filtrá-los novamente, busca três páginas TMDB em paralelo por tipo (antes seis), pinta os sete slots e deixa a reposição extra elegível em segundo plano (limite 12 segundos). Preserva proibições e evita recomendação inventada.
- **Pôsteres/primeiro carregamento:** Home converte miniaturas fora da viewport em imagens carregadas sob demanda por `IntersectionObserver`, mantendo a mesma origem/Supabase image proxy e liberando concorrência de rede para pôsteres visíveis e RPCs. Conexão com host das imagens antecipada via preconnect.
- **Escopo:** Web 0.3.68/r541 preservada; Activity Android, layouts nativos, sincronização F1, dados de Perfil, regras de Top 10 e navegação sem alterações. Nenhuma página é recarregada.
- **Testes:** valida sintaxe da runtime final, regressão mesclando filmes de setembro/outubro, ordem e plays, marcação de esporte em uma RPC sem re-render, quantidade de páginas iniciais, filtro e poster loading. TESTE28 em instalação paralela.

## Android 1.0.29 — r271 (2026-10-17)

- **Esportes > Assistido:** elimina o repaint e a recriação do modal de detalhes pelos listeners legados. Listener de captura na janela trata os três tipos de botões esportivos com atualização otimista, lock síncrono por evento, rollback em erro, RPC única e atualização somente do botão. Mantém rolagem e posição da tela/modais intactas; não exige segundo toque.
- **Home Filmes > Histórico:** backend cinetracker_home_live_v0997_r3 retorna no máximo 80 filmes recentes. O Android busca páginas autenticadas de watch_history em blocos de 120, consulta metadados originais em media e apresenta títulos, TMDB, posters e datas verdadeiros em ordem cronológica (mais recentes abaixo), sem registros sintéticos. Atualiza exclusivamente o stack de Histórico com compensação de altura, sem refazer Home e sem saltar a rolagem. Consulta só ao abrir Filmes, com limite de páginas e retry.
- **Descobrir > Pra Você:** reaproveita por até 8 minutos o pool original, já filtrado pelo motor existente, apenas para o mesmo usuário/data; evita reconsultas completas ao alternar abas. Ao marcar visto/watchlist/trocar, invalida o cache local; regras de filtros e posições permanecem intocadas.
- **Pôsteres e prioridade:** mantém lazy loading real e preload não concorrente do r270, sem novas requisições até abrir Histórico.
- **Garantias:** Web 0.3.68/r541 congelada; MainActivity, importação/exportação, F1 Hub, Perfil, Watchlist e outras mutações preservadas. Testes com RPC simulada confirmam marcação sem full render/scroll; paginação, ordem/poster/data; cache de Pra Você. Necessária validação no aparelho com rede e dados reais.
- **Instalação:** APK TESTE29 separado com applicationId com.cinetracker.app.teste29, sem substituir os TESTEs anteriores.

## Android 1.0.28 — r270 (2026-10-17)

- **Home → Filmes, Histórico:** cache reduzido de sete dias para dois minutos. Quando o histórico backend é antigo, concilia de maneira assíncrona somente filmes confirmados como assistidos e com data válida no dashboard autenticado; mantém ordem cronológica e não altera registros no banco.
- **Home → Pôsteres:** miniaturas utilizam imagens nativas com carregamento lazy e decodificação assíncrona em vez de carregar centenas de CSS background-image fora da tela.
- **Descobrir → Pra Você:** a primeira busca filme/série/anime usa duas páginas por tipo (seis consultas totais), em vez de seis páginas por tipo e bloqueio por reservas. A reposição de elegíveis roda depois da primeira exibição, preservando sete slots, filtros de visto, Watchlist, AEW, luta livre, stand-up, reality, YouTube e curtas.
- **Top 10:** começa com duas páginas por tipo, amplia por etapas se a auditoria não encontra dez; preserva ordenação, 10+10 e cache por usuário/plataforma.
- **Primeira pintura:** cancelado o preload simultâneo não solicitado de dez seções que disputavam rede com a tela ativa e os pôsteres. A primeira visita sem cache continua dependendo de rede.
- **Escopo:** Web 0.3.68/r541 e Activity Android intactas. Recursos anteriores F1 Hub, Esportes, Perfil e Watchlist preservados. APK TESTE28 paralelo com pacote com.cinetracker.app.teste28.
- **Validação:** testes automatizados de sintaxe, exemplo de filme posterior a Pokémon, histórico ordenado, exclusão de Watchlist não vista, lazy-loading, performance e integridade do APK.

## Android 1.0.27 — r269 (2026-10-17)

- **F1 Hub:** quatro abas em uma única linha, ajuste responsivo em aparelhos estreitos, supressão da quinta aba injetada pelo runtime Android legado ("Grid de largada"). Os dados do grid e chegada permanecem acessíveis dentro do GP; Visão geral mantém os quatro quadros 2×2, com pódio/Top 3, alinhamento ajustado.
- **Descobrir → Pra Você:** mantém os sete slots e filtros de elegibilidade, mas reestrutura os três cards por linha: título e metadados em linhas individuais sem quebra, com reticências quando ultrapassarem a largura, altura reservada de 42px e os controles +Watchlist e Trocar em um rodapé estático de 42px. Os botões deixam de cobrir textos e não ficam sobre os posters.
- **Top 10:** remove a invalidação forçada da lista de streamings a cada acesso; preserva 10 filmes+10 séries quando há elegíveis, busca em 4 páginas simultâneas por tipo, ampliando de maneira limitada apenas se necessário; guarda resultado por usuário, plataforma e dia (sessão + armazenamento local), sem alterar as auditorias de vistos/watchlist/produtos inelegíveis nem fingir posições.
- **Esportes:** usa o cache real de agenda e mostra o F1 Hub imediatamente enquanto a agenda é atualizada; F1 recupera calendário local recente (até 8h) antes de acessar a rede. Não altera contagens ou regras de watch.
- **Home Séries/Filmes:** prioridade para as consultas da tela visível; posterga em 6,5 segundos o preload pesado de outros conteúdos que competia com o primeiro carregamento. Mantém o Home cache-first e os dois modos existentes, sem page reload ou refetch síncrono.
- **Garantias:** nenhuma mudança na Web 0.3.68/r541, nas Activities/menus nativos, na sincronização F1, histórico, Perfil ou recomendação de conteúdo. Testes de sintaxe, presença do cache auditado, página Top 10 10×10, CSS F1 e rodapés, APK e SHA256 no GitHub Actions. O primeiro acesso sem cache ainda depende de respostas reais dos serviços.
- **Instalação:** pacote separado com nome CineTracker TESTE 1.0.27 e `com.cinetracker.app.teste27`.

## Android 1.0.26 — r268 (2026-10-17)

- **Descobrir → Pra Você:** seleção final autoritativa dos sete slots (indicação diária, três da Watchlist, três 100% Novos), com critérios mantidos de histórico/progresso, títulos alternativos, Watchlist, idade (1991+), nota TMDB 7,5+, curtas com duração conhecida <40 min, YouTube, stand-up, realities, AEW/WWE/luta livre e MMA. Nenhum item externo entra nos três slots Da sua Watchlist.
- **Indicação do dia:** respeita o botão Trocar no próprio handler ativo, salva a nova escolha e mantém histórico recente para não repetir o mesmo filme em dias consecutivos quando há alternativas. O renderer passa a receber a contagem real da lista de filmes (antes era fixada artificialmente em 1, ocultando Trocar).
- **Slots vazios:** a consulta complementar de novos conteúdos tenta também o pool popular elegível, com limites; só atualiza cards ao encontrar candidatos válidos. Ausência real de item continua sinalizada, sem card inventado.
- **F1 Hub, Visão geral:** tela de quatro cartões pequenos (2×2), Próximo GP, Último GP apenas pódio, Top 3 Pilotos e Top 3 Construtores. Rankings completos de 20 posições permanecem nas abas Pilotos/Construtores, com calendário e detalhes de GP preservados.
- **Validações:** regressões determinísticas de troca diária/persistência/dia seguinte, top3 versus tabela completa, JS sintaxe, conteúdo e assinatura de APK; fluxo com dados reais do dispositivo ainda exige verificação.
- **Escopo:** Web 0.3.68/r541 congelada; layout Activity Android, Esportes, Perfil, F1 Hub (outras abas), Watchlist, notificações, importação/exportação e ações vistos intactos. TESTE26 instalado separadamente.

## Android 1.0.25 — r267 (2026-10-16)

- **F1 Hub:** removido diretamente do renderer Android o legado de sete abas e consolidado no mesmo owner canônico das quatro abas da Web: Visão geral, Calendário, Pilotos e Construtores. Clique no GP mantém o detalhamento de sessões, grid e resultado já implementado, sem montar um segundo Hub concorrente.
- **Descobrir > Pra Você:** o repositor anterior somente de filmes foi substituído. Consulta complementar, delimitada e independente de filmes, séries e animes, após exclusões finais (visto, Watchlist, AEW/luta livre, reality, stand-up, origem YouTube, curtas). Mantém exatamente sete posições; não inventa recomendação nem insere candidatos externos em Da sua Watchlist.
- **Perfil > Esportes assistidos:** grid de **Eventos assistidos** e **Jogos no estádio** na primeira linha (duas colunas); **Tempo assistido** ocupa sozinho toda a segunda linha. Os três valores seguem suas fontes anteriores, incluindo RPC de estádio v296.
- **Preservado:** Web 0.3.68/r541 e MainActivity/layout nativos sem modificações, navegação, Watchlist/Trocar, Visto/Desmarcar, Esportes, notificações, exportação/importação, Home e detalhes.
- **Gate:** teste do markup F1 (quatro abas, GP clicável), refill de três categorias com exclusão de vistos/Watchlist, distribuição 2+1 do Perfil, syntax check do JS, assinatura/verificação do APK. Teste real no dispositivo ainda necessário.
- **APK paralelo:** TESTE25 com package ID `com.cinetracker.app.teste25`, sem substituir as versões de teste anteriores.

## Android 1.0.24 — r266 (2026-10-16)

- **Correção a partir do vídeo enviado:** a Indicação do dia e o slot Filme de 100% Novos perdiam todos os candidatos após o filtro r265; agora há reposição delimitada com candidatos TMDB realmente elegíveis, já filtrados contra Visto, Watchlist, AEW, luta livre e outras exclusões. Quando o pool contém um único filme, procura mais um sem reaproveitar o primeiro nem inventar candidato.
- **Perfil > Esportes assistidos:** contador independente e visível de **Jogos no estádio**, consultado da RPC real e existente `cinetracker_sports_stadium_summary_v296` (a v1 de esportes não possui essa informação). Zero só é exibido se o banco confirmou zero; em falhas usa traço, não zera estatísticas já existentes.
- **Episódios de séries normais:** a tela cortada é o drawer `.ct169-drawer`, não o overlay F1/UFC/WWE. Limita a altura/rolagem do drawer à área acima da barra HTML `.ct180-mobile-nav`, mantendo a lista e o último episódio acessíveis.
- **Escopo e validação:** a Web r541 e a Activity Android permanecem intocadas. Mantidos Trocar, Watchlist, F1 Hub, Esportes, Perfil, notificações, backup e marcadores r262-r265. Testes automatizados verificam reposição de 2 filmes elegíveis, repaint, RPC de estádio, geometria do drawer e sintaxe antes de publicar o APK; a validação em aparelho real segue pendente.
- **Instalação segura:** APK TESTE24 com pacote separado `com.cinetracker.app.teste24`, sem exigir desinstalar as versões anteriores.

## Android 1.0.23 — r265 (2026-10-16)

- **F1 Hub:** Calendário passa a abrir cada GP com sessões, marcação Visto/Desmarcar, Grid de Largada e Resultado de Chegada via Jolpica. Mantém painéis de Pilotos, Construtores, Último GP, Pit Stops e Voltas.
- **Esportes:** primeira consulta com janela curta (2 dias anteriores e 5 posteriores), cache reaproveitado e tela que não depende de sincronização histórica extensa para apresentar dados recentes.
- **Android mobile:** enquadramento em 100dvh, rolagem completa da Home e espaço inferior protegido pela navegação; detalhes WWE, UFC, F1 com rolagem até o fim.
- **Descobrir > Pra Você:** excluir AEW/luta livre/wrestling/WWE, UFC/MMA, stand-up, realities, curtas abaixo de 40 minutos e originais YouTube na seleção final, além da auditoria no backend. Slots sem indicação elegível exibem mensagem e busca novamente.
- **Compatibilidade:** Web 0.3.68/r541 e código nativo mantidos; funções anteriores Android, Watchlist/Trocar, importação/exportação, notificações e navegação preservadas. Aplicativo TESTE em pacote separado `com.cinetracker.app.teste23`.
- **Validação:** testes de sintaxe, exclusões, GP e integridade do APK no GitHub Actions; validação em aparelho real ainda necessária.

## Android 1.0.22 — r264 (2026-10-16)

- **Correção efetiva do APK 1.0.21:** seletores F1/UFC/WWE usavam seções diretamente em `[data-home-view]`; no Android as seções estão dentro de `[data-home-viewport] .home-start`. As três séries são montadas na seção correta.
- **Autenticação:** sessão restaurada antes de pedir F1/UFC/WWE; navegação à Home dispara integração pós-auth.
- **Home:** âncora usa `scrollTop` do contêiner Android em vez de `window.scrollTo`; Histórico acima, Séries em Continuar e Filmes em Watchlist.
- **Descobrir/Pra Você:** após auditoria dos pools, recalcula os sete slots, sem candidatos externos na seção Da sua Watchlist.
- **Perfil:** reconcilia 12 cards e Ver mais após renderização efetiva.
- **Preservados:** Android 1.0.20/r262, Trocar, Watchlist, Visto, F1 Hub, Histórico/Desmarcar, Top 10, Esportes, importação/exportação, notificações, navegação nativa e Web r541 sem alterações.
- **Validação:** script e sintaxe do runtime, seletores/autoridades e smoke test Chromium local com RPCs simuladas (F1/UFC/WWE visíveis e Home rolada pelo contêiner correto). Teste real no aparelho ainda necessário.

### Android 1.0.21 — correção do pipeline de APK
- Corrigido somente o gate legado `prepare-android-v1019.mjs` para exigir a RPC realmente existente `cinetracker_watchlist_full_v376` em vez da referência inexistente `cinetracker_watchlist_full_v119`.
- Mantidas a Web r541 congelada e a base funcional Android 1.0.20; nenhuma mudança na lógica da Watchlist ou da aplicação.
- Manifesto raiz atualizado para versão 0.3.69 exclusivamente como registro da entrega Android (a versão Web permanece 0.3.68).

## Android 1.0.21 — r263 (2026-10-16)

### Web congelada + novidades adaptadas ao Android
- **Web congelada:** referência imutável em `43f5f0c5d87802fac80365c62388276c0b2d7255` / `r541-official-0.3.68`; a release Android falha se `apps/web/**` divergir desse ponto.
- **Base Android preservada:** mantém o runtime validado 1.0.20/r262, Watchlist/Trocar, gestos do WebView, navegação nativa, importação/exportação, notificações, F1 Hub e autoridades Android já funcionais.
- **Home:** Séries entra em Continuar assistindo e Filmes em Assistir a seguir / Watchlist, com Histórico fisicamente acima e estado de âncora independente por aba.
- **F1 / UFC / WWE Pay-Per-View:** séries especiais anuais, tela por temporada, contagens históricas v540 e writers canônicos existentes; Raw/SmackDown continuam séries normais.
- **Descobrir:** auditoria pessoal v525 aplicada aos novos pools, incluindo vistos/Watchlist/Não interessado e filtros atuais de conteúdo; Pra Você preserva a composição Android já validada.
- **Top 10:** busca delimitada até 10 Séries + 10 Filmes elegíveis por streaming e pôster 2:3.
- **Perfil:** cinco listas resumidas com exatamente 12 cards e somente Ver mais no cabeçalho; detalhe diário usa v518 e Desmarcar usa os writers r426.
- **Esportes:** detalhe de time (últimos 5 jogos em todas as competições) e liga (rodada mais recente), com writer esportivo canônico.
- Sem `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval()` ou novo `MutationObserver` no runtime r263.

## 0.3.68 — r541 (2026-10-16)

### Escopo estrito: posição inicial da Home
- **Séries:** toda entrada/seleção da aba reinicia somente a âncora de Séries e abre em **Continuar assistindo**, mantendo o Histórico fisicamente acima e fora da viewport inicial.
- **Filmes:** toda seleção da aba reinicia somente a âncora de Filmes e abre em **Assistir a seguir / Watchlist**, mantendo Filmes vistos fisicamente acima e fora da viewport inicial.
- Corrigida a causa da regressão: initialDone/finalDone era compartilhado entre Séries e Filmes. Depois de Séries concluir sua âncora, Filmes podia herdar o estado concluído e não se posicionar.
- O estado passa a ser independente por aba. Alternar Séries → Filmes → Séries sempre cria uma nova âncora daquela aba, sem reposicionar novamente depois que o usuário começa a rolar.
- Regressão Chromium valida ida e volta entre as duas abas, Histórico acima nas duas e cancelamento do realinhamento após movimento do usuário.

### Preservado
- Renderers, dados, Watchlist, F1/UFC/WWE, Descobrir, Perfil, Esportes, Raw/SmackDown e Android permanecem inalterados.
- Sem full-page reload, router.refresh(), loop infinito, timer contínuo ou observer novo.

## 0.3.67 — r540 (2026-10-16)

### Escopo estrito: F1 / UFC / WWE presos em "Contagem histórica carregando"
- Corrigida a corrida real de boot: a r539 disparava a RPC antes de a sessão autenticada estar restaurada e não repetia a leitura depois; os três cards podiam permanecer eternamente no placeholder.
- O owner r540 aguarda autenticação de forma finita e faz no máximo três tentativas delimitadas, sem loop infinito, observer ou reload.
- Nova RPC `cinetracker_special_series_counts_v540` elimina o caminho pesado `special_series_progress_v520`. Medição no perfil atual: aproximadamente **176 ms**, preservando **F1 18/1.166 GPs**, **UFC 18/793 eventos** e **WWE 50/567 eventos**.
- O texto de carregamento pode aparecer brevemente enquanto a sessão é restaurada, mas a leitura é retomada automaticamente após `authReady`; o estado não pode permanecer preso por falha da primeira chamada.
- Teste Chromium reproduz sessão inicialmente indisponível, exige zero RPC antes do auth-ready e valida a troca automática para as três contagens históricas completas.

### Preservado
- Buckets Continuar assistindo / Em dia, pendências recentes, telas anuais, writers de Assistido, Home Séries/Filmes, Descobrir, Perfil, Esportes, Raw/SmackDown e Android permanecem inalterados.

## 0.3.66 — r539 (2026-10-16)

### Escopo estrito: contagem global de F1 / UFC / WWE na Home
- Corrigida a causa real da regressão: a r528 ainda formatava os três cards com o denominador da temporada atual.
- **Fórmula 1:** Home passa a usar Grande Prêmio contra Grande Prêmio. Progresso validado: **18 / 1.166 GPs assistidos**. As 87 sessões vistas continuam preservadas no banco, mas não são misturadas com o denominador de GPs.
- **UFC:** Home passa a mostrar o progresso histórico completo validado: **18 / 793 eventos assistidos**.
- **WWE Pay-Per-View / PLE:** Home passa a mostrar o progresso histórico completo validado: **50 / 567 eventos assistidos**.
- O RPC `cinetracker_special_series_counts_v539` separa F1 race-only de sessões e mantém UFC/WWE por evento.
- Enquanto a contagem global ainda está chegando, o card mostra estado de carregamento em vez de voltar a exibir 17/23, 14/41 ou 7/7.

### Preservado
- Bucket atual (**Continuar assistindo / Em dia**), pendências recentes, seleção anual, catálogos, writers de Assistido, Home/Filmes, Descobrir, Perfil, Esportes, Raw/SmackDown e Android não foram alterados.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou novo observer.

## 0.3.65 — r538 (2026-10-16)

### Escopo estrito: somente contagens
- **Naruto:** preservado em 220 episódios.
- **Naruto Shippuuden:** corrigido de 0 para **500 episódios**; nenhuma marcação foi alterada.
- **Fórmula 1:** total global corrigido para **1.166 Grandes Prêmios** após Singapura 2026; o catálogo local parcial não reduz mais o total.
- **UFC:** total global corrigido para **793 eventos realizados** até UFC Fight Night: Allen vs. Duncan (10/10/2026).
- **WWE Pay-Per-View / PLE:** total global corrigido para **567 supercards**.
- `ct-special-series-summary` continua consultando fontes públicas para crescimento futuro, mas usa `cinetracker_special_series_counts_v538` como piso estável.
- Cache versionado para `ct538:special-summary`, impedindo retorno aos antigos 66/380/61.

### Preservado
- Nenhum layout, ordem da Home, Watchlist de Filmes, Descobrir, Perfil, Esportes, Raw/SmackDown, F1 Hub, escritores de Assistido ou Android foi alterado.
- Android permanece **1.0.20 / versionCode 10062**.

## 0.3.64 — r537 (2026-10-16)

### Escopo estrito: Home Filmes + F1/UFC/WWE
- **Home > Filmes:** desfaz exclusivamente a regressão visual da r536. **Assistir a seguir / Watchlist volta a ser 100% lista vertical**, usando o renderer canônico `ct274Row`, igual ao Histórico e às listas de Séries. O CSS e o markup `ct536-movie-rail / ct536-movie-card` são removidos do bundle final.
- **Home > Filmes:** paginação v405, ordenação e ação de Visto são preservadas; somente a apresentação volta ao contrato de lista.
- **F1 / UFC / WWE Pay-Per-View:** identificado o painter concorrente r399 que recriava as seções de Séries sem remontar os especiais. O próprio `renderSeries399` agora remonta os três cards após todo repaint e reconcilia o cache atual.
- **F1 / UFC / WWE Pay-Per-View:** o opener canônico r534 deixa de esperar `__ctR512Special.loadSeason` para abrir. Basta a tela anual r520 estar registrada; ela aparece imediatamente e o catálogo continua carregando dentro dela.
- **Raw / SmackDown:** continuam séries normais e não são interceptadas pelo owner de PPV.
- Teste Chromium r537 repinta Séries duas vezes e exige os três especiais ainda presentes; também abre F1/UFC/WWE sem `__ctR512Special` pronto e valida a Watchlist com 12 linhas verticais.

### Preservado
- Home Séries/Histórico/toolbar, Descobrir/Pra Você/Top 10, Perfil, Esportes/time/liga, títulos relacionados, writers/catálogos especiais e Android 1.0.20 / 10062 não foram alterados.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou observer novo.

## 0.3.63 — r536 (2026-10-15)

### Escopo estrito: Home Séries/Filmes + F1/UFC/WWE + Descobrir público/Top 10
- **Home Séries:** Histórico continua fisicamente acima/oculto. O primeiro alinhamento em **Continuar assistindo** não pode mais ser cancelado por um `touchmove` incidental antes da âncora inicial; depois do primeiro alinhamento, o movimento real do usuário volta a ter prioridade.
- **Home Séries:** todo repaint de Séries remonta F1, UFC e WWE Pay-Per-View e reconcilia o carregamento atual. Os três cards não podem desaparecer depois de uma resposta assíncrona da Home.
- **Home Filmes:** seleção de Filmes solicita uma nova âncora de Watchlist e mantém o lock do tab escolhido. A Watchlist usa novamente o renderer final de pôster, em um único trilho horizontal 2:3 (176×264 desktop / 154×231 mobile), preservando paginação v405 e ações existentes.
- **F1 / UFC / WWE:** a tela anual continua sendo a r520 canônica; abre imediatamente em full-screen, inicia no topo e a espera pelo catálogo/temporada é delimitada, sem deixar apenas o botão Voltar sobre a Home.
- **Descobrir > Novidades / Lançamentos / Mais Aguardados:** o TMDB continua `allSettled`/delimitado e a auditoria pessoal passa a ser feita em blocos independentes. Um bloco lento/falhando não mantém toda a aba em loading; blocos não auditados são descartados.
- **Descobrir > Top 10:** o filtro pessoal deixa de derrubar o ranking inteiro quando um bloco falha. Cada lote é auditado fail-closed e a busca continua até obter exatamente 10 Séries + 10 Filmes elegíveis; ranking parcial nunca é publicado.
- Teste Chromium exige âncora inicial mesmo após movimento incidental, rail de Filmes 2:3 sem wrap, tela especial full-screen e Top 10 10×10 após candidatos iniciais bloqueados.

### Preservado
- Pra Você, Perfil, Esportes/time/liga, F1 Hub/writers, Raw/SmackDown, Títulos Relacionados e Android 1.0.20 / 10062 não foram alterados.
- Nenhum full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou novo `MutationObserver`.

## 0.3.62 — r535 (2026-10-15)

### Escopo estrito: Home + F1/UFC/WWE + três abas públicas do Descobrir
- **Home Séries/Filmes:** Histórico continua fisicamente acima/oculto, mas a âncora inicial agora funciona já no placeholder de Continuar/Watchlist; não espera o payload terminar para tirar o Histórico da viewport.
- **Home Séries/Filmes:** repaints atrasados respeitam o tab escolhido pelo usuário. Pointerdown + click repetidos tornam-se idempotentes e não disparam duas trocas/cargas concorrentes.
- **F1 / UFC / WWE Pay-Per-View:** restaurado o CSS canônico de tela cheia (position fixed + inset 0) que foi perdido quando r519/r520 substituíram o runtime r513. O conteúdo anual volta a abrir realmente na viewport; catálogo e writers permanecem os mesmos.
- **Descobrir > Novidades / Lançamentos / Mais Aguardados:** r321 deixa de depender do Promise.all legado sem timeout. Cada perna TMDB é delimitada e o lote usa Promise.allSettled, portanto uma página travada não mantém a aba eternamente em Carregando.
- O filtro pessoal continua fail-closed via cinetracker_recommendation_filter_v525, também com prazo delimitado e retry existente.

### Preservado
- Pra Você, Top 10, Perfil, Esportes/time/liga, F1 Hub, Raw/SmackDown, Relacionados, writers F1/UFC/WWE e Android 1.0.20 / 10062 não foram alterados.
- Sem full-page reload, router.refresh(), while(true), setInterval ou novo MutationObserver.

## 0.3.61 — r534 (2026-10-15)

### Escopo estrito: abertura F1/UFC/WWE + Títulos Relacionados
- **F1 / UFC / WWE Pay-Per-View:** existe um único owner ativo de abertura. r524/r527 já permanecem aposentados desde r529 e o owner r533 é substituído em sua própria posição, sem empilhar outro listener.
- A tela anual r520 continua sendo a mesma; catálogo, seleção de temporada e writers de Assistido não foram reescritos.
- O owner abre no pointerdown, aguarda de forma limitada tanto a tela r520 quanto o catálogo r520 e bloqueia o clique genérico antes que ele possa disputar a navegação; linhas genéricas da Home usam fallback somente por título exato.
- **Raw / SmackDown:** continuam como séries normais e passam pelo clique canônico de mídia; não são capturados como WWE PPV.
- **Títulos Relacionados:** abrir filme/série volta a ser responsabilidade exclusiva do handler original `data-media` + `go()` do CineTracker. Nenhum runtime auxiliar inventa `navigate()`, `pushState` ou evento de rota.
- Os runtimes auxiliares de Relacionados tratam somente **Watchlist** e **Visto**, preservando essas ações sem bloquear a abertura do card.
- O teste Chromium r534 usa uma bridge igual à produção, deliberadamente **sem `__ctCoreR471.navigate`**, e exige F1/UFC/WWE abrindo a janela anual, Raw/SmackDown abrindo série normal e Relacionados navegando uma única vez.

### Preservado
- Home visual/dados/ordem/chrome, Descobrir/Pra Você/Top 10, Perfil, Esportes, F1/UFC/WWE catalogs e writers, Raw/SmackDown e Android 1.0.20 / 10062 permanecem fora do escopo.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou observer novo.

## 0.3.60 — r533 (2026-10-15)

### Escopo estrito: F1/UFC/WWE, títulos semelhantes e faixa fixa da Home
- **F1 / UFC / WWE Pay-Per-View:** o owner reconhece tanto os cards especiais quanto linhas genéricas recriadas pela Home pelo título exato. Raw e SmackDown não são interceptados.
- **F1 / UFC / WWE Pay-Per-View:** pointerup + click com deduplicação abre a tela anual canônica r520 imediatamente, sem reload e sem disputar com o handler genérico de mídia.
- **Títulos semelhantes:** restaura captura em pointerup com deduplicação do click; navegação continua SPA e mantém Watchlist/Visto.
- **Home:** a camada opaca passa para z-index 9000; Séries/Filmes, busca e resultados ficam explicitamente acima dela. Conteúdo normal não pode mais aparecer correndo por baixo da faixa fixa.
- O r533 substitui fisicamente os três owners r532 no bundle; não adiciona mais uma camada concorrente.

### Preservado
- Home dados/ordem/Histórico/Watchlist, Descobrir/Pra Você/Top 10, Perfil, Esportes, Raw/SmackDown, writers de visto e Android 1.0.20 / 10062 permanecem intactos.

## 0.3.59 — r532 (2026-10-15)

### Escopo estrito: abertura de especiais, títulos relacionados e chrome da Home
- **F1 / UFC / WWE Pay-Per-View:** r513 e r519 deixam de executar listeners antigos no bundle final. A tela anual r520 fica como único owner de temporada/episódios.
- **F1 / UFC / WWE Pay-Per-View:** um único owner de clique r532 captura os cards reais da Home (`data-ct512-special`, `data-ct513-open` ou `data-ct512-open`) e abre a tela anual imediatamente. O catálogo r520 pode terminar depois; a abertura da tela não fica bloqueada por corrida de inicialização.
- **Títulos Relacionados/Semelhantes:** o owner r286 antigo é substituído na própria posição do bundle. Abrir filme/série usa a bridge SPA canônica; ações **Watchlist** e **Visto** permanecem.
- **Home:** o fundo opaco dos controles fixos passa a pertencer diretamente ao `body`, fora do stacking context da página. Séries/Filmes e busca continuam fixos, mas o conteúdo deixa de aparecer correndo por baixo.
- O gate Chromium abre individualmente F1, UFC e WWE, navega por um título relacionado e valida a geometria/stacking do shield da Home.

### Preservado
- Home Séries/Filmes, Histórico/Watchlist, Descobrir/Pra Você/Top 10, Perfil, Esportes, Raw/SmackDown, writers F1/UFC/WWE e Android 1.0.20 / 10062 não recebem alteração funcional.
- Sem reload global, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver`.

## 0.3.58 — r531 (2026-10-15)

### Escopo estrito: especiais + relacionados + isolamento da toolbar da Home
- F1 / UFC / WWE Pay-Per-View: o opener deixa de depender de o owner da tela já existir no mesmo tick. O clique aguarda de forma delimitada a tela canônica r520 e abre a janela real; o teste Chromium usa a própria `__ctR513SeriesScreen`, não stub.
- Detalhes > Títulos Relacionados: o clique usa a navegação SPA canônica exposta pelo core r471. Filme abre `/movie/:id` e série abre `/series/:id` sem reload.
- Home: Séries/Filmes + busca continuam fixos, mas agora existe uma camada opaca contínua atrás de toda a faixa superior. Conteúdo que rola abaixo não fica visível entre os controles.
- Preservado: Home Séries/Filmes e seus dados/ordem, Descobrir/Pra Você/Top 10, Perfil, Esportes, Raw/SmackDown, writers de visto/F1 e Android 1.0.20 / 10062.

## 0.3.57 — r530 (2026-10-15)

### Escopo estrito: toolbar da Home + abertura F1/UFC/WWE
- Home: corrige a interpretação errada da r529. **Séries / Filmes e a busca global voltam a ficar fixos no topo** e permanecem visíveis durante todo o scroll.
- Home: Histórico continua fisicamente acima/oculto; a âncora desconta a altura do toolbar fixo, evitando esconder Continuar assistindo ou Watchlist atrás da barra.
- F1 / UFC / WWE Pay-Per-View: a tela anual canônica é criada imediatamente no clique. Se o bridge r512 ainda estiver inicializando, o loader usa diretamente o catálogo r520 em fallback delimitado em vez de retornar falso e não abrir nada.
- Regressão Chromium: rola a Home e exige busca + abas fixas; preserva a abertura individual de F1, UFC e WWE.
- Preservado: renderers/dados da Home, Descobrir/Pra Você/Top 10, Perfil, Esportes, Raw/SmackDown, writers de visto/F1 e Android 1.0.20 / 10062.

## 0.3.56 — r529 (2026-10-15)

### Escopo estrito: Home + abertura das três séries especiais
- Home Séries: remove a geometria fixed/sticky introduzida por r524/r525. Histórico continua fisicamente acima e oculto; Séries/Filmes passam para o fluxo normal entre o Histórico e o conteúdo principal. A entrada e a reconciliação tardia ancoram diretamente Continuar assistindo no início da viewport.
- Home Filmes: mesma regra da Home Séries. Filmes vistos continua fisicamente acima e oculto; a entrada ancora diretamente Assistir a seguir / Watchlist. O renderer/lista de filmes da r528 não foi alterado.
- F1 / UFC / WWE Pay-Per-View: removidos do bundle os openers duplicados r524 e r527. Um único owner r529 captura o card antes do handler genérico e abre a tela canônica r520 de temporada/episódios.
- Regressão Chromium: exige Histórico acima, controles sem position:fixed, início exato no bloco principal para Séries e Filmes e abertura individual de F1, UFC e WWE na tela de Série.
- Preservado: Descobrir/Pra Você/Top 10, Perfil, Esportes, Raw/SmackDown, writers de Visto/F1, histórico diário e Android 1.0.20 / 10062.
## 0.3.55 — r528 (2026-10-14)

### Escopo estrito: Home + contagens especiais + Top 10
- **Home Séries:** Histórico continua fisicamente acima, mas a entrada é ancorada em **Continuar assistindo** e recebe uma segunda correção única quando o Histórico termina de expandir. Qualquer movimento do usuário cancela a âncora.
- **Home Filmes:** Histórico continua fisicamente acima/oculto; **Assistir a seguir / Watchlist volta ao mesmo formato de lista vertical da Home/Histórico**, usando o renderer canônico ct274. Removidos rail/carrossel/cards-pôster desta superfície.
- **Naruto:** Home continua usando v527; cache de Séries é invalidado na r528 para não reapresentar contagem antiga. Autoridade atual validada em 90/220, 130 restantes, próximo S2E39.
- **F1 / UFC / WWE PPV:** o card da Home mostra somente **progresso da temporada atual**. O total histórico externo deixa de contaminar o denominador. F1 permanece baseado apenas em GPs/corridas; UFC/WWE usam o catálogo anual e são normalizados antes do paint.
- **Descobrir > Top 10:** cada troca de streaming cria uma nova geração, força recomputação específica daquele provider e invalida a resposta anterior. O renderer estrito existente continua exigindo 10 Séries + 10 Filmes; uma requisição lenta do streaming anterior não pode sobrescrever a seleção nova.
- **Preservado:** Perfil, Esportes geral, Raw/SmackDown, F1 writer r462, histórico diário/Desmarcar e Android 1.0.20 / 10062.

## 0.3.54 — r527 (2026-10-14)

### Escopo fechado: Home + Descobrir + séries especiais + F1 Hub
- **Raw / SmackDown:** backlog completo só é reconstruído para séries realmente encerradas/canceladas. Séries em exibição permanecem na autoridade recente v452; validadas em **Em dia** (Raw 251/251, SmackDown 237/237) sem episódio antigo inventado.
- **Naruto:** preservada a correção de série encerrada: **90/220**, 130 restantes, próximo **S2E39**.
- **Home Filmes:** o gate Chromium usa movieRow() e renderMoviesAll() reais; Histórico fica fisicamente acima, Watchlist é um único rail horizontal e cards/pôsteres são 2:3.
- **Pra Você:** regressão explícita para **A Odisseia / The Odyssey**; original_title chega ao filtro v525 e alias já visto não entra em 100% Novos.
- **Top 10:** teste comportamental bloqueia candidatos das primeiras páginas e exige busca adaptativa até renderizar exatamente **10 Séries + 10 Filmes**.
- **Fórmula 1:** Home mostra **GPs**, não sessões; total, realizados, assistidos e pendências recentes são recalculados apenas pelas corridas.
- **F1 / UFC / WWE PPV:** pointerdown dedicado abre a tela anual antes de qualquer card genérico; regressão cobre os três.
- **F1 Hub:** GP do Calendário precisa abrir modal com **Fim de semana**, **Grid de Largada** e **Resultado de Chegada**.
- **Preservado:** Perfil, Esportes geral, histórico diário/Desmarcar e Android 1.0.20 / 10062.
## 0.3.53 — r526 (2026-10-14)

### Home, Descobrir e séries especiais
- **Naruto:** duplicação por TMDB efetivo consolidada; v526 validada em 90/220 assistidos, 130 restantes e próximo S2E39.
- **Home Séries:** Histórico continua fisicamente acima/oculto; v526 é a fonte primária e o refresh de TV mantém a mesma autoridade.
- **Home Filmes:** Histórico continua acima/oculto; Watchlist é um único rail horizontal `nowrap`, com card e pôster 2:3.
- **Home toolbar:** fundo opaco contínuo evita qualquer conteúdo aparente por baixo de Séries/Filmes e busca.
- **Descobrir:** abas públicas usam owner r321 + filtro pessoal v525 fail-closed; renderer final não depende de card legado invisível.
- **Pra Você:** r321 delega diretamente ao owner auditado r464, mantendo 100% Novos livre de vistos/Watchlist e aliases já conhecidos.
- **Top 10:** mantém contrato estrito 10 Séries + 10 Filmes e usa cards finais próprios 2:3 para garantir os 20 itens visíveis.
- **Fórmula 1 como série:** episódios representam GPs/corridas, não todas as sessões do fim de semana.
- **F1 Hub:** Calendário passa pelo owner clicável r311; cada GP abre fim de semana, Grid de Largada e Resultado de Chegada.
- **UFC / WWE Pay-Per-View:** temporadas e writers preservados; Home reaproveita catálogo completo dos três especiais.
- **Preservado:** Perfil, Raw, SmackDown, Esportes geral, histórico diário/Desmarcar e Android 1.0.20 / 10062.
## 0.3.52 — r525 (2026-10-14)

### Correção orientada pelo vídeo real
- **Home Séries:** Histórico permanece fisicamente acima/oculto; entrada e repaints usam âncora finita em Continuar assistindo, sem cadeia de dezenas de RAFs. v492 usa lote compacto e v452 é fallback delimitado.
- **Home Filmes:** Filmes vistos permanece acima/oculto; entrada em Assistir a seguir / Watchlist. O owner final força um único rail horizontal de pôsteres 2:3 (176×264 desktop / 154×231 mobile).
- **Home toolbar:** Séries/Filmes e busca ficam na mesma linha fixa com espaço reservado, sem desaparecer no scroll nem cobrir conteúdo.
- **F1/UFC/WWE PPV:** a tela usa a temporada já em cache imediatamente; F1/WWE têm enriquecimento remoto limitado e UFC deixa de bloquear a abertura esperando sync externo.
- **Descobrir:** filtros pessoais antigos v517/v322 são roteados para v525, que consulta primeiro biblioteca/histórico do usuário e evita statement timeout. Aliases original/traduzido continuam valendo; A Odisseia ↔ The Odyssey foi validada como bloqueada.
- **Top 10:** mantém o contrato estrito 10 Séries + 10 Filmes e passa a usar o filtro rápido v525; entrada nova escolhe o primeiro streaming da lista em vez de estado antigo.
- **Pra Você:** retry do erro volta a funcionar e 100% Novos passa pelo filtro v525.
- **Esportes / time:** últimos 5 jogos usam IDs canônicos do mesmo time em todas as competições; Atlético-MG foi validado com Sul-Americana + Brasileirão.
- **Perfil:** não alterado. Raw/SmackDown e Android 1.0.20 / 10062 preservados.

## 0.3.51 — r524 (2026-10-14)

### Escopo estrito: Home
- F1/UFC/WWE Pay-Per-View: o card passa a mostrar **assistidos / total da temporada**, não assistidos / lançados. Com os dados canônicos atuais, F1 2026 é 85/115 sessões e UFC 2026 é 14/41 eventos; WWE usa o catálogo completo da temporada carregado pelo owner r521.
- A classificação Continuar assistindo/Em dia continua baseada somente em sessão/evento recente pendente; backlog antigo não muda a Home.
- F1/UFC/WWE PPV: abertura do card chama diretamente o owner de tela r520 e deixa de depender da rota reportada pelo bridge legado.
- Home: Séries/Filmes e busca voltam a ficar **travados na mesma linha**, reaplicando apenas a geometria visual da r521; os owners funcionais r520/r521 continuam aposentados.
- Histórico escondido acima, Watchlist Filmes r514 2:3, Pra Você/Top 10 r523, Perfil, Esportes, Raw/SmackDown e Android permanecem inalterados.

## 0.3.50 — r523 (2026-10-14)

### Escopo estrito: Home + Descobrir
- Home > Séries: Histórico volta a ficar fisicamente acima de **Continuar assistindo**. A entrada usa a âncora finita aprovada na r509 e libera imediatamente ao primeiro gesto de navegação do usuário.
- Home > Filmes: Filmes vistos fica fisicamente acima da Watchlist e a entrada ancora em **Assistir a seguir / Watchlist**.
- Home > Filmes: Watchlist volta ao rail horizontal único aprovado da r514, com cards 176×264 no desktop e 154×231 no mobile, sempre 2:3 e sem quebra para segunda linha.
- Descobrir > Pra Você: todos os candidatos de **100% Novos** passam por uma auditoria final v517 antes do paint. Vistos, Watchlist e aliases como título traduzido/original são removidos antes de entrar no estado visível.
- Descobrir > Top 10: falha transitória no filtro pessoal não transforma o lote inteiro em bloqueado. O filtro é repetido de forma delimitada e a tela só pinta quando possui exatamente 10 Séries + 10 Filmes elegíveis; cache completo 10/10 pode ser usado em falha transitória.
- F1, UFC, WWE Pay-Per-View, Raw, SmackDown, Perfil, Esportes, histórico diário e Android 1.0.20 / 10062 permanecem intactos.

## 0.3.49 — r522 (2026-10-14)

### Home restaurada + abertura F1/UFC/WWE
- Remove o owner de Home introduzido por r520/r521: sem captura própria de Séries/Filmes e sem position:fixed novo para busca/abas.
- Home volta aos owners estabilizados antes da r520, preservando Histórico oculto acima, Watchlist Filmes v405 em 2:3 e as ações existentes.
- F1, UFC e WWE Pay-Per-View mantêm os catálogos completos da r521, mas a abertura recebe um owner final dedicado em pointerup, clique e teclado antes do media-card genérico.
- O gate Chromium agora abre e fecha F1, UFC e WWE PPV individualmente; o r520 verificava somente UFC.
- Drill-down esportivo do r520 é preservado, sem autoridade sobre a Home.

### Preservado
- Descobrir, Perfil, Raw/SmackDown, F1 Hub e Android 1.0.20 / 10062 permanecem inalterados.
- Sem reload global, router.refresh(), loop infinito, interval ou observer persistente.

## 0.3.48 — r521 (2026-10-14)

- F1 mescla sessões mapeadas com todos os GPs Jolpica da temporada; catálogo parcial não perde corridas.
- UFC e WWE Pay-Per-View mantêm catálogos externos completos; totais globais autoritativos não regridem para o subconjunto local.
- Séries, Filmes e busca ficam na mesma primeira linha fixa; clique de Filmes é capturado antes dos cards.
- Drill-down de time/liga e writer de Visto do r520 são preservados sem reescrita.
- Perfil, Descobrir, F1 Hub, Raw/SmackDown e Android permanecem fora do escopo.

## 0.3.47 — r520 (2026-10-13)

### F1 + UFC + WWE PPV / Home fixa / Esportes navegável
- Corrige a regressão conceitual da r519: **Fórmula 1, UFC e WWE Pay-Per-View coexistem como três séries especiais**.
- Totais históricos deixam de depender do catálogo local parcial: Fórmula 1 usa o catálogo histórico Jolpica, UFC usa UFCStats e WWE usa a lista histórica de PPV/PLE. O progresso da temporada continua separado do total histórico.
- UFC volta a ter temporadas 1993-atual com eventos numerados, Fight Nights e UFC on ESPN/ABC/Fox; WWE mantém temporadas 1985-atual com PPV/PLE; F1 mantém 1950-atual e o writer canônico r462 para temporadas mapeadas.
- **Home:** barra de busca global permanece fixa; botões Séries/Filmes permanecem fixos logo abaixo. A intenção de Filmes é aplicada no pointerdown antes de qualquer card, impedindo abertura acidental de série.
- **Esportes:** clicar no escudo/nome do time abre os últimos 5 jogos. Clicar no nome da liga abre os jogos da rodada mais recente. Assistido/Desmarcar usa exclusivamente `cinetracker_sport_mark_watched_v1`, preservando tempo e estatísticas.
- Raw/SmackDown, Descobrir, Perfil, F1 Hub e Android 1.0.20 / 10062 permanecem preservados.
- Sem full-page reload, `router.refresh()`, loop infinito, `setInterval` ou observer persistente.

## 0.3.46 — r519 (2026-10-13)

### WWE Pay-Per-View como série
- Corrigido o escopo: **UFC deixa de ser a série especial ativa**. A série solicitada é **WWE Pay-Per-View**.
- Cada PPV/Premium Live Event da WWE passa a ser um episódio da temporada correspondente ao ano, de 1985 até a temporada atual.
- Filmes WWE já marcados como vistos são reconhecidos automaticamente como episódios assistidos, sem perder o histórico existente.
- Ao abrir uma temporada, o CineTracker complementa lacunas históricas pelo TMDB e aplica o mesmo estado pessoal antes de pintar os eventos.
- Kickoff, Countdown, pós-show, Raw, SmackDown, Saturday/Sunday Night Main Event e conteúdos não-PPV ficam fora da série.
- A regra da Home segue Raw/SmackDown: somente PPV recente liberado e não visto mantém **WWE Pay-Per-View** em Continuar assistindo; backlog antigo não força o card.
- Validação no banco atual: T2026 possui **7 PPVs/PLEs conhecidos e 7 já vistos**; o total histórico conhecido possui **50 assistidos**.
- O owner r512 passa a controlar apenas **F1 + WWE Pay-Per-View**; a UI especial de UFC é aposentada e seus caches antigos são invalidados.

### Preservado
- Fórmula 1 e writer r462, Raw/SmackDown, Home Filmes, Descobrir/Top 10/Pra Você, Perfil, Esportes e Android 1.0.20 / 10062 permanecem fora do escopo.
- Sem full-page reload, `router.refresh()`, loop infinito, interval ou observer novo.

## 0.3.45 — r518 (2026-10-13)

### Contadores F1/UFC + Relacionados + detalhe diário
- **Fórmula 1:** removido o denominador histórico externo incorreto. O card passa a mostrar apenas o total realmente assistido na série e o progresso canônico da temporada: atualmente **87 sessões assistidas no total · T2026 · 85/115 sessões**.
- **UFC:** criada a chave canônica v518 que deduplica o mesmo Fight Night vindo com e sem número do evento. A temporada 2026 passa de 52 linhas infladas para **41 eventos canônicos**, com **14 assistidos**, 34 realizados e 2 pendências recentes no estado atual.
- **UFC como série:** Home e tela da série usam exclusivamente `cinetracker_ufc_series_v518`; o cliente deixa de reintroduzir duplicatas ao misturar novamente TMDB depois da autoridade do banco.
- **F1/UFC global:** o resumo externo deixa de fornecer denominador. `cinetracker_special_series_progress_v518` informa o total realmente assistido; a UI não apresenta um catálogo histórico incompleto como se fosse denominador oficial.
- **Títulos Relacionados:** cards passam a 176 px no desktop / 154 px no mobile, com colunas de ação proporcionais; `＋ Watchlist` e `✓ Visto` cabem integralmente.
- **Perfil > Assistido por dia:** o detalhe diário agora usa `cinetracker_activity_items_by_day_v518`, incluindo `watch_play_events_v0994`. O filme contado no gráfico também aparece ao abrir o dia e continua usando o Desmarcar canônico existente.
- Validação real do banco: **WWE Money in the Bank 2026** é retornado no detalhe de 13/10 como filme.

### Preservado
- Home Séries/Filmes, Descobrir/Top 10/Pra Você, Raw/SmackDown, Esportes genérico, writer F1 r462, Perfil 12 cards e Android 1.0.20 / 10062 não foram alterados fora destes pontos.
- Sem full-page reload, `router.refresh()`, loop infinito, interval ou observer novo.

## 0.3.44 — r517 (2026-10-13)

### Correções do vídeo — escopo preservado
- **Perfil:** Assistido por dia passa a contar filmes pela trilha atual `watch_play_events_v0994`, além de episódios e esportes; barra e detalhe diário voltam a concordar.
- **Recomendações:** filtro pessoal v517 bloqueia títulos já vistos, Watchlist e Não interessado por TMDB e aliases de título original/traduzido + ano. Isso cobre duplicidades como **“A Odisseia” ↔ “The Odyssey”**, mesmo quando chegam com TMDB IDs distintos. O mesmo filtro é usado em Descobrir e nos relacionados/semelhantes.
- **Detalhes:** filme/série pinta assim que o detalhe TMDB chega; estado pessoal e relacionados carregam depois, sem segurar a tela inteira.
- **Home Séries:** primeiro lote maior e expansão até a biblioteca completa; ao ultrapassar o lote compacto, a autoridade completa v452 assume sem reload.
- **Home Filmes:** o clique em Filmes usa diretamente o owner r388/v405, reaproveita cache/single-flight e mantém a Watchlist 2:3.
- **Busca/Home:** abas Séries/Filmes deixam de ficar fixas por cima da barra de busca.
- **Top 10:** ranking 10+10 da r514 permanece; alteração somente visual nas logos de streaming com `contain/center/no-repeat`.
- **UFC:** sincronização de temporada combina ESPN e UFCStats histórico para Fight Nights e PPVs.
- **F1/UFC:** progresso aparece em uma única linha, separando série inteira da temporada atual; caches parciais antigos de temporada são invalidados.

### Preservado
- Rota genérica de Esportes, writer F1 r462, Raw/SmackDown, Perfil 12 cards, histórico/Desmarcar e Android 1.0.20 / 10062 não foram alterados.
- Sem `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou novo `MutationObserver`.

## 0.3.43 — r516 (2026-10-13)\n\n### Watchlist Filmes + progresso global F1/UFC\n- **Home > Filmes:** corrigida a causa real do estado vazio: r505 ainda sobrescrevia o loader v405 depois da r515. r516 mantém r388/v405 como owner final e deixa r505 apenas como helper visual.\n- Todo clique explícito em **Filmes** dispara a autoridade final v405; primeira página = 60 itens e total atual da biblioteca é preservado. O fallback v376 só entra se v405 realmente vier vazia.\n- Cards de Filmes permanecem no trilho r514 **176×264 / 2:3** (154×231 mobile), sem regressão para linhas/quadrados.\n- **F1/UFC:** o card da Home deixa de apresentar a temporada atual como se fosse o total da série. Passa a mostrar progresso **global** da série e, separadamente, o progresso da temporada atual.\n- A tela de temporada mantém o contador daquela temporada e adiciona uma segunda linha Série com o progresso global.\n- F1 combina catálogo histórico de GPs com sessões detalhadas das temporadas mapeadas; UFC usa o catálogo histórico de eventos completos, com fallback seguro para o catálogo já conhecido no CineTracker.\n- O contador global assistido nunca pode ficar abaixo do contador da temporada atualmente carregada.\n- **Preservado:** Home Séries, Top 10 r514, Pra Você, Perfil, Raw/SmackDown, Esportes, writer F1 r462 e Android 1.0.20 / 10062.\n\n## 0.3.42 — r515 (2026-10-13)

### Watchlist Filmes + retorno UFC/F1
- **Home > Filmes:** removido o preload de Filmes enquanto a aba Séries está ativa. Esse preload podia deixar uma Promise antiga pendente e fazer o clique em Filmes aguardar indefinidamente.
- Ao abrir **Filmes** sem cards renderizados, a leitura v405 é forçada de forma nova; a geração nova invalida a tarefa anterior e impede que resposta velha sobrescreva a Watchlist.
- `cinetracker_home_movies_v405` foi validada no banco atual com **60 filmes na primeira página** e mais de 1.300 no total; portanto o estado vazio era frontend.
- A Watchlist mantém o layout r514: trilho horizontal de cards **176×264 / 2:3** no desktop e **154×231 / 2:3** no mobile.
- **UFC/F1:** a tela de Série passa a ter `← Voltar para Home` fixo e sempre visível. Fechar restaura a aba anterior da Home, posição e foco sem reload.
- UFC continua tratado como série recorrente por temporada/ano, com **Fight Nights + PPVs** e Visto/Desmarcar sincronizado com Esportes. F1 mantém o writer canônico r462.
- **Top 10:** lógica r514 de 10 Séries + 10 Filmes é preservada sem alteração.
- **Fora do escopo:** Perfil, Pra Você, Raw/SmackDown, Esportes genérico e Android não foram alterados.

## 0.3.41 — r514 (2026-10-13)

### Correção final de escopo
- **Home > Séries:** preservada sem alteração funcional.
- **Home > Filmes:** mantém Filmes vistos fisicamente acima da Watchlist e restaura a Watchlist ao padrão solicitado: um único trilho horizontal de pôsteres **176×264 / 2:3** no desktop e **154×231 / 2:3** no mobile. A regressão r513 para linhas foi removida.
- **Descobrir > Top 10:** reposição tolera falha de páginas individuais, expande dentro do mesmo streaming por modalidades de disponibilidade e só pinta quando possui **10 Séries + 10 Filmes** já validados contra Visto/Watchlist.
- A chamada legada `cinetracker_discovery_exclusions_v0994`, observada em produção estourando ~10 s/500, sai do caminho antigo do Descobrir.
- **UFC/F1:** corrigida a bridge real que não expunha `edge`/`tmdb`. Temporadas históricas usam ESPN/TMDB/Jolpica; falha externa degrada para cache/estado vazio sem tela vermelha. Escritas canônicas permanecem.
- **Preservado:** Perfil, Raw/SmackDown, Esportes genérico, F1 Hub/writer r462 e Android 1.0.20 / 10062.

## 0.3.40 — r513 (2026-10-13)

### Home Filmes + UFC/F1 como séries
- Home > Filmes: renderer determinístico em linhas canônicas para a primeira página v405; sem cards quadrados/poster-grid.
- Fórmula 1: progresso usa todas as sessões da temporada. Em 2026: 85 assistidas de 115 sessões totais.
- UFC: temporadas 1993-atual, Fight Nights + PPVs, deduplicando Sports e histórico legado.
- UFC/F1 abrem em tela de Série em página cheia, com temporada, episódios/eventos e Visto/Desmarcar otimista; o modal r512 deixa de ser o caminho dos cards.
- Escopo preservado: Perfil, Descobrir, WWE/Raw/SmackDown, rota genérica de Esportes e Android não foram alterados.

## 0.3.39 — r512 (2026-10-13)

### Home Filmes + UFC/F1 históricos e estáveis
- **Home > Filmes / Watchlist:** remove o trilho de pôsteres 176×264 introduzido nas r499–r511 e restaura o padrão canônico de linhas do CineTracker, igual às listas de Séries/Histórico. Paginação v405, ordenação, abertura de detalhe, Visto e Histórico oculto acima permanecem preservados.
- **UFC:** substitui o owner r510 por um único owner r512. Temporadas de 1993 até o ano atual; UFC numerados já existentes na biblioteca (incluindo UFC 1/2/3) são reconhecidos como episódios vistos sem apagar o histórico legado. Fight Nights/PPVs atuais continuam ligados ao estado de Esportes.
- **Fórmula 1:** substitui o owner r511 por um único owner r512. Temporadas de 1950 até o ano atual. Temporadas já mapeadas (2015/2025/2026) mantêm sessões completas e o writer canônico r462; anos históricos sem mapa carregam os GPs sob demanda via Jolpica, sem contaminar a classificação atual da Home.
- UFC e F1 são remontados de forma idempotente sempre que a lista de Séries é repintada ou quando o usuário volta da aba Filmes, eliminando o desaparecimento ao trocar abas.
- Backlog antigo de UFC/F1 **não** força Continuar assistindo: apenas evento/sessão recente pendente da temporada atual decide Continuar versus Em dia.
- r510/r511 ficam inertes no bundle final; não há dois owners disputando os mesmos cards.

### Escopo preservado
- Descobrir, Top 10, Pra Você, Perfil, Raw/SmackDown, Esportes genérico, histórico diário e Android permanecem inalterados.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver`.

## 0.3.38 — r511 (2026-10-13)

### Fórmula 1 como série especial
- Fórmula 1 passa a usar o mesmo modelo visual/funcional criado para UFC dentro da Home > Séries.
- Temporada = ano. Cada sessão mapeada do F1 Hub vira episódio: Treino Livre 1/2/3, Classificação, Classificação Sprint, Sprint e Corrida.
- Apenas sessões recentes não assistidas (janela de 21 dias) mantêm F1 em **Continuar assistindo**; sem pendência recente, fica em **Em dia**, sem exigir backlog histórico.
- O card sintético substitui a linha F1 legada na Home, impedindo duplicação.
- O detalhe da série mostra todas as sessões da temporada e permite Assistido/Desmarcar com Optimistic UI.
- A escrita usa exclusivamente `cinetracker_f1_watch_sync_v462`: Série, Esportes e F1 Hub continuam sincronizados pelo writer canônico já existente, preservando a contabilização de tempo atual.
- Validação real em 13/10/2026: temporada 2026 com 115 sessões mapeadas, 85 liberadas e 85 assistidas; estado atual **Em dia** e próximo episódio = TL1 do GP dos Estados Unidos em 23/10.

### Escopo preservado
- UFC r510, Raw/SmackDown, Home Filmes, Descobrir, Top 10, Perfil, Esportes genérico e Android permanecem inalterados.
- Android continua 1.0.20 / 10062.
- Sem full-page reload, `router.refresh()`, loop infinito, interval ou observer persistente.

## 0.3.37 — r510 (2026-10-11)

### UFC como série especial
- UFC passa a aparecer na Home > Séries como série recorrente, alimentada pelo domínio de Esportes.
- Temporada = ano; Fight Night, UFC on ESPN/ABC/Fox e PPVs numerados viram episódios em ordem cronológica.
- Dana White's Contender Series, Road to UFC e demais eventos de MMA ficam fora da série UFC.
- Apenas eventos recentes não vistos (21 dias) mantêm UFC em Continuar assistindo; ao zerar os pendentes recentes, migra para Em dia.
- O detalhe UFC mostra eventos da temporada e permite Assistido/Desmarcar com Optimistic UI.
- A gravação usa somente cinetracker_sport_mark_watched_v1. Série e Esportes compartilham o mesmo estado, sem criar histórico de episódio duplicado e sem dupla contagem.
- Raw/SmackDown e F1 permanecem intactos.

### Escopo preservado
- Home Filmes r509, Descobrir, Top 10, Perfil, Esportes genérico e Android permanecem inalterados.
- Android continua 1.0.20 / 10062.

## 0.3.36 — r509 (2026-10-09)

### Home — correção do estado real reportado
- **Séries:** Histórico recente continua fisicamente acima, mas a entrada é ancorada de forma determinística em **Continuar assistindo**; o Histórico fica fora da viewport e aparece somente ao rolar para cima.
- **Filmes:** Filmes vistos segue a mesma regra e a entrada é ancorada em **Assistir a seguir / Watchlist**.
- **Filmes / Watchlist vazia:** corrigida a corrida em que uma requisição herdada/in-flight terminava vazia e fazia `loadMovies(false)` retornar sem disparar uma nova v405.
- A troca para Filmes não chama mais `renderMoviesAll()` com `hMovies=[]`, portanto o loader/trilho não é apagado antes dos dados.
- v405 validada no banco real: **60 itens na primeira página / 1.391 no total**. A r509 faz no máximo uma repetição v405 e mantém v376 apenas como fallback delimitado.
- Primeira página de Filmes é pré-carregada enquanto Séries está ativa, sem pintar a aba oculta.
- O lock de posição é finito, vale para Séries e Filmes e é cancelado imediatamente quando o usuário rola/interage.

### Escopo preservado
- Layout 176×264 (2:3) da Watchlist, Descobrir/Pra Você, Top 10, Perfil, F1, Esportes e Android permanecem inalterados.
- Sem full-page reload, `router.refresh()`, loop infinito, interval ou observer persistente.

## 0.3.35 — r508 (2026-10-09)

### Home > Filmes — correção do erro ainda visível no print real
- Corrige o falso positivo da r507: o teste antigo verificava somente a ordem DOM entre **Filmes vistos** e **Assistir a seguir / Watchlist**. A r508 exige que **Filmes vistos esteja realmente fora da viewport**, acima das abas sticky.
- A âncora de Filmes usa um lock finito por `requestAnimationFrame` e é reaplicada após os paints reais de Histórico e Watchlist. Qualquer wheel/touch do usuário cancela imediatamente o lock.
- **Assistir a seguir / Watchlist** deixa de ocupar várias linhas: passa a ser um único trilho horizontal compacto.
- Cards ficam no padrão aprovado **176×264 (2:3) no desktop** e **154×231 (2:3) no mobile**.
- v405, paginação, Visto e ordenação da Watchlist permanecem preservados.

### Escopo preservado
- Home Séries, Descobrir/Pra Você, Top 10, Perfil, F1, Esportes e Android não foram alterados.
- Sem full-page reload, `router.refresh()`, loop infinito, interval ou observer persistente.

## 0.3.34 — r507 (2026-10-09)

### Home — histórico oculto acima e Watchlist restaurada
- Séries: **Histórico recente** permanece fisicamente acima de **Continuar assistindo**; a entrada agora ancora somente depois dos paints reais de Histórico e seção principal, deixando o Histórico fora da viewport e acessível ao rolar para cima.
- Filmes: **Filmes vistos** segue a mesma regra, acima de **Assistir a seguir / Watchlist**, e a troca para Filmes arma uma nova âncora real.
- A âncora foi ligada diretamente ao `renderHome388()` efetivamente ativo desde r495; o scheduler legado que já não era chamado deixou de ser dependência.
- Filmes: v405 usa single-flight/cache-first e v376 somente como fallback delimitado. A autoridade real foi validada com **60 filmes na primeira página e 1.391 no total**.
- Cards da Watchlist permanecem no padrão aprovado **176×264 / 2:3**.
- Wheel/touch libera qualquer âncora pendente, preservando o controle manual do scroll após a entrada.
- Regressão Chromium valida ordem física, posição no viewport, Watchlist não vazia no primeiro v405 e geometria 2:3.

### Escopo preservado
- Descobrir, Perfil, F1, Esportes e Android não foram alterados.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou observer persistente.

## 0.3.33 — r506 (2026-10-09)

### Home — correção estritamente limitada
- Séries: o Histórico permanece fisicamente acima de **Continuar assistindo**, mas a entrada da Home ancora diretamente em **Continuar assistindo**; o Histórico só aparece ao rolar para cima.
- Filmes: o Histórico permanece fisicamente acima de **Assistir a seguir / Watchlist**, e a troca para Filmes ancora diretamente na Watchlist.
- Filmes: removido o `window.scrollTo(0)` da troca Séries/Filmes que anulava a âncora e expunha o Histórico.
- Filmes: `cinetracker_home_movies_v405` é consumida diretamente pelo owner r388 com normalização robusta do JSON e apenas uma repetição delimitada quando a primeira resposta vier vazia. O banco foi validado com 1.391 filmes elegíveis na Watchlist.
- Cards de Filmes permanecem no padrão aprovado de 176×264 / 2:3.

### Escopo preservado
- Nenhuma alteração em Descobrir, Perfil, F1, Esportes ou Android.
- Sem reload de página, `router.refresh()`, loop infinito, interval ou observer persistente.

## 0.3.32 — r505 (2026-10-09)

### Escopo exclusivo: Home > Filmes + abas Séries/Filmes
- Corrige a Watchlist vazia sem alterar Séries, Descobrir, Perfil, F1, Esportes ou Android.
- A RPC v405 foi validada com dados reais: primeira página possui 60 filmes e total atual 1.391; portanto o vazio era corrida de frontend, não falta de dados.
- Se uma carga herdada terminar vazia, r505 repete uma única vez com leitura fresca v405 e repinta a Watchlist.
- Ao selecionar Filmes, a recuperação usa o mesmo owner r504 e não recarrega a página.
- Enquanto a primeira página chega, a Watchlist mostra skeleton de pôster 2:3.
- Cards aprovados 176x264 / 2:3 permanecem intactos.
- Botões Séries / Filmes ficam sticky no topo da Home durante o scroll.

### Preservado
- Home Séries, Pra Você v498, Top 10 r500, Perfil, F1, Esportes e Android permanecem funcionalmente inalterados.
- Sem full-page reload, router.refresh(), while(true) ou setInterval.
## 0.3.31 — r504 (2026-10-09)

### Escopo exclusivo: Home > Filmes não abria por clique real
- Corrige a regressão da r503 sem alterar Séries, Descobrir, Perfil, F1, Esportes ou Android.
- A troca Séries/Filmes passa a ter **um único owner de ponteiro** registrado antes dos handlers legados. O clique torna a view Filmes visível de forma síncrona, antes de qualquer RPC.
- Os writers de aba duplicados do core antigo, r266 e r495/r502 deixam de decidir a aba Home; continuam preservadas apenas as funções não relacionadas (Visto, navegação e demais ações).
- O estado canônico da aba passa a ser `__ctR504UserTab`; r371, r388, r495 e a compatibilidade r266 apenas obedecem esse mesmo estado.
- Mantidos integralmente o carregamento v405/repaint in-flight da r503 e os cards aprovados 176×264 / 2:3 da r502.
- O gate Chromium não usa mais apenas `.click()`: valida `elementFromPoint` e sequência real pointer/mouse, troca Filmes → Séries → Filmes e exige que repaints tardios não revertam a seleção.

### Preservado
- Home Séries, Pra Você v498, Top 10 r500, Perfil, F1, Esportes e Android permanecem inalterados.
- Sem full-page reload, `router.refresh()`, `while(true)` ou `setInterval`.

## 0.3.30 — r503 (2026-10-09)

### Escopo exclusivo: Home > Filmes
- Remove do caminho ativo o segundo setter legado `ct266ApplyHomeTab` que ainda podia sobrescrever a seleção do usuário depois do lock r502.
- `activeKind`, r388 e r495 passam a consultar o mesmo estado canônico de aba; callbacks atrasados de Séries deixam de poder esconder Filmes.
- Se a primeira página v405 já estiver em andamento quando Filmes é selecionado, a aba permanece visível e a Watchlist é repintada obrigatoriamente quando a mesma Promise termina.
- Cache válido de Filmes pinta imediatamente antes da atualização de rede, evitando Watchlist vazia durante a troca.
- Layout r502 de 176×264 / 2:3 é preservado sem alterações.

### Preservado
- Home Séries, Pra Você, Top 10, Perfil, F1, Esportes e Android permanecem sem alteração funcional.
- Sem full-page reload, `router.refresh()`, `while(true)` ou `setInterval`.

## 0.3.29 — r502 (2026-10-09)

### Escopo exclusivo: Home > Filmes
- Corrige a causa do retorno automático para Séries: o owner r371 volta a registrar de fato `userSelected` e `tabRef`. Depois que o usuário escolhe Filmes, repaints tardios de Séries não podem mais trocar a aba.
- r374, r388 e r495 passam a obedecer o mesmo lock canônico `ct502HomeKind`; não há mais quatro fontes independentes decidindo a aba visível.
- Repaints de Séries só podem agendar a âncora de Séries quando Séries está ativa; o mesmo vale para Filmes.
- Watchlist passa ao padrão visual aprovado de **176×264 px no desktop**, com pôster integral 2:3; no mobile permanece responsiva em 2 colunas e 2:3.
- Chromium espera o carregamento tardio, força um repaint legado de Séries e exige que Filmes continue ativo e visível.

### Preservado
- Home Séries r500/r501, Pra Você v498, Top 10 adaptativo r500, Perfil, F1, Esportes e Android permanecem sem alteração funcional.
- Sem full-page reload, `router.refresh()`, `while(true)` ou `setInterval`.

## 0.3.28 — r501 (2026-10-09)

### Escopo exclusivo: Home > Filmes
- Mantém integralmente a r500 em Séries, Top 10, Pra Você e demais telas.
- Corrige a entrada da aba Filmes: o Histórico continua fisicamente acima da Watchlist, mas a ancoragem passa a usar `scrollIntoView` no alvo real e uma correção exata pelo scroll root ativo.
- Desativa `overflow-anchor` somente dentro da Home Filmes para impedir o navegador de puxar a viewport de volta ao Histórico depois da hidratação.
- Watchlist r500 e seus cards 150×225 / 2:3 são preservados sem alteração.
- Gate Chromium deixa de aceitar Watchlist a 320 px do topo: exige Watchlist abaixo de 90 px e fim do Histórico acima de 55 px.

## 0.3.27 — r500 (2026-10-09)

### Escopo estrito: Home Séries/Filmes + Top 10
- Home Séries: Histórico preenchido é forçado como irmão anterior de Continuar assistindo e a ancoragem usa o scroll container real, não apenas window.
- Home Filmes: Filmes vistos segue fisicamente acima da Watchlist com a mesma ancoragem real.
- Home Filmes: Watchlist deixa de herdar a classe global .card; card próprio r500 é 150×225 no desktop e 2:3 responsivo no mobile.
- Top 10: busca adaptativa em lotes de 5 páginas, até a página 50 apenas enquanto faltarem títulos elegíveis.
- Chromium agora valida Histórico preenchido e bloqueia os primeiros 200 candidatos do Top 10 para exigir 10 Séries + 10 Filmes além da página 10.
- Pra Você v498 e demais áreas não foram alterados.

## 0.3.26 — r499 (2026-10-08)

### Escopo estrito: Home Séries/Filmes + Top 10
- Home Séries: Histórico permanece fisicamente acima de Continuar assistindo no DOM e a entrada fica ancorada em Continuar assistindo. Quando o Histórico hidrata depois, a posição visível é compensada para não pular de volta para o Histórico.
- Home Filmes: Filmes vistos permanece acima de Assistir a seguir / Watchlist e a entrada fica ancorada na Watchlist.
- Home Filmes: removida a reutilização visual da linha ct274-media-card para a Watchlist. Cada filme passa a usar card nativo de pôster inteiro 2:3, mantendo paginação v405, ordenação, abertura de detalhe e ação Visto.
- Home: removida a escada de realinhamento de 40/140/360/760/1400 ms; o anchor usa somente microtask + dois frames e respeita movimento do usuário.
- Top 10: páginas 1–5 formam o pool primário. Se, após excluir vistos/Watchlist, ainda houver menos de 10 elegíveis, páginas 6–10 são usadas como top-up delimitado antes do paint final.
- Pra Você: cinetracker_foryou_payload_v498 foi preservado; validação real confirma que A Odisseia/The Odyssey já vista não aparece em 100% Novos.
- Perfil, F1, Esportes, histórico diário, Configurações e Android não foram alterados.

## 0.3.25 — r498 (2026-10-08)

### Escopo estrito: Home + Descobrir/Pra Você + Top 10
- Home Séries mantém IDs especiais/negativos: Fórmula 1 deixa de ser descartada e o bucket v492 é respeitado; o falso “Carregar mais · 4 de 5” deixa de aparecer.
- Home Filmes mantém paginação v405 e recebe somente a geometria estática do card nativo: card inteiro 2:3, pôster cover, texto em overlay e ação Visto no card.
- Pra Você usa cinetracker_foryou_payload_v498. O caso real A Odisseia / The Odyssey foi validado e deixa de entrar em 100% Novos quando já existe como visto sob outro TMDB ID.
- Top 10 busca páginas 1 e 2 em paralelo, filtra e pinta uma única vez; logos de streaming ficam contidos.
- Perfil, F1 writers, Esportes, histórico diário, Configurações e Android não foram alterados.

## 0.3.24 — r497 (2026-10-08)

### Recuperação segura após a tela preta da r496
- A r497 parte diretamente da r495, última build com Chromium e produção verdes, e **não** herda o bootstrap/owners adicionados pela r496.
- Produção permaneceu na r495 durante a validação da r497; nenhuma build quebrada é usada como base funcional.
- A tentativa de podar fisicamente IIFEs aposentadas foi rejeitada pelo próprio gate porque alterou o paint de Filmes. A r497 preserva a base funcional r495 e remove somente fontes/releases quebrados; qualquer correção adicional é feita diretamente na autoridade vigente e coberta pelo navegador completo.
- Os fontes de release quebrados e não necessários r493, r494 e r496 são removidos do repositório. r495 continua sendo a base funcional e r492 permanece por ser dependência real do build.
- O writer esportivo r240, que atribuía `sportsPayload` fora do escopo e podia derrubar o boot, é removido fisicamente do bundle. A rota de Esportes permanece na autoridade profissional v479 e passa a ser aberta pelo gate Chromium.
- O HTML inicial recebe somente um placeholder moderno azul/escuro e o bundle atual; nenhum bootstrap dourado/amarelo, `auth-page`, `cloud-bar` ou aplicação inline antiga volta a existir.
- Home Séries/Filmes mantêm a base r495 validada: carregamento progressivo e Filmes 2:3. Sobre essa base foram aplicadas somente duas correções isoladas capturadas pelo gate: Pra Você agora possui um único controle `active` e pinta os 7 slots após v490; Perfil delega exclusivamente ao renderer atual/v495 e não executa mais o payload legado v0997.
- O novo gate Chromium marca `prelude` antes do bundle e falha explicitamente se o JavaScript bloquear antes do primeiro paint, evitando repetir o falso “READY” da r496.

### Preservado
- F1, Esportes, Top 10, histórico diário/Desmarcar e Android 1.0.20 / versionCode 10062 permanecem intactos.
- Sem full-page reload, `router.refresh()` ou loops infinitos.

## 0.3.23 — r496 (2026-10-08)

### Fluidez e regressões do vídeo corrigidas
- Corrigida a regressão estrutural da r495 que voltou a renderizar a Watchlist de Filmes com `ct274Row` legado. Filmes volta a usar cards próprios compactos, com pôster real 2:3, altura automática e paginação v405 preservada.
- Home Séries mantém snapshot válido visível e atualiza em segundo plano. v492 continua primária; se exceder o limite, v452 — a mesma autoridade funcional de episódios/F1 — entra como fallback delimitado, sem mudar regras de bucket.
- A ordem visual da Home volta a nascer com **Continuar assistindo** antes do Histórico e **Watchlist** antes de Filmes vistos, sem esperar Histórico para mostrar o conteúdo principal.
- Perfil deixa de chamar `cinetracker_profile_screen_v495` no caminho de navegação. Resumo, estatísticas rápidas, estatísticas-base, Esportes/Estádio e atividade são chamadas independentes com deadlines curtos; falha de uma parte não derruba a tela inteira.
- Perfil reutiliza snapshot válido por até 5 minutos e atualiza em background; continuam exatamente 12 cards nas cinco listas e **Ver mais** apenas no cabeçalho.
- Pra Você mantém o último snapshot válido enquanto atualiza. v490 segue primária e o fallback por pools é paralelo e delimitado; a tela não é apagada para um loading longo quando já há recomendações válidas.
- Visual moderno azul/escuro da r495/r494 é preservado explicitamente. Nenhum bootstrap dourado/amarelo é reintroduzido.

### Preservado
- F1, Esportes, Top 10, histórico diário/Desmarcar e Android 1.0.20 / versionCode 10062 permanecem funcionais.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou novo `MutationObserver`.
- Gate Chromium reproduz Home com Histórico lento, troca imediata para Filmes, geometria do card, Pra Você e Perfil sem RPC monolítica.

## 0.3.21 — r494 (2026-10-07)

### Bootstrap legado removido
- Removido fisicamente de `apps/web/index.html` o aplicativo inline antigo dourado/amarelo que reaparecia antes do bundle atual.
- O entrypoint de produção agora é mínimo: somente `#app`, `app-v494.css` e `app-v494.js`; nenhum CSS/JS de aplicação fica inline.
- O build falha se o HTML final voltar a conter `--gold:#d6b55b`, `MENU DIÁRIO`, `.auth-page`, `cloud-bar` ou o bootstrap antigo.
- A paleta final é explicitamente azul/escura; o token visual legado dourado fica neutralizado.
- As autoridades funcionais r493 de Home progressiva, Filmes v405, Perfil dividido, Top 10 e Pra Você permanecem preservadas.
- Regressão Chromium r493 continua obrigatória e passou nesta release.

### Preservado
- F1, Esportes, histórico diário/Desmarcar e Android 1.0.20 / versionCode 10062.
- Sem full-page reload, `router.refresh()`, `while(true)` ou `setInterval`.

## 0.3.20 — r493 (2026-10-07)

### Estabilidade real medida pelo vídeo
- Home > Séries deixa de depender do ciclo completo do r388/r371. O shell nasce imediatamente, `cinetracker_home_series_v492` e Histórico v391 rodam em paralelo e Séries pinta assim que seu payload compacto chega, sem esperar Histórico, sem scroll automático tardio e sem cascata de timers.
- Home > Filmes troca de aba de forma síncrona e só então busca a primeira página v405. O primeiro paint mantém cards nativos estritamente 2:3 e paginação explícita; a aba nunca espera os 1.387 filmes.
- Perfil remove `cinetracker_profile_screen_v491` do caminho crítico. As cinco listas v489 (~0,33 s), estatísticas, esportes/estádio e atividade são lidas em paralelo por RPCs menores; o payload legado v0997 de ~3,8 s deixa de bloquear a abertura da tela.
- Perfil mantém exatamente 12 cards em Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos; o único **Ver mais** continua no cabeçalho.
- Descobrir > Top 10 não espera mais a lista de streamings para iniciar o ranking. Página 1 de filmes/séries pinta primeiro; página 2 só completa em segundo plano se o filtro pessoal deixar menos de 10.
- Descobrir > Pra Você passa a reutilizar snapshot válido da sessão/local imediatamente, v490 segue como autoridade primária e os pools v421 entram apenas como fallback delimitado. Um refresh não apaga cards válidos enquanto busca novos.
- Teste Chromium r493 simula o cenário do vídeo: Histórico lento não bloqueia Séries, clique em Filmes troca imediatamente, primeira página aparece isoladamente e Perfil abre sem chamar `profile_screen_v491`.

### Preservado
- F1 r462/r477, rota de Esportes, histórico diário/Desmarcar e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Sem full-page reload, `router.refresh()`, `while(true)` ou `setInterval`.

## 0.3.19 — r492 (2026-10-07)

### Estabilidade e carregamento corrigidos na causa
- O vídeo de 07/10 confirmou que r491 ainda sofria com múltiplos owners históricos ativos. r492 torna inertes, antes da execução, os runtimes visuais obsoletos r380–r412 selecionados, r414, r427/r429–r434, r445/r449, r456–r461, r467–r470, r481/r482/r484/r488/r489. Eles deixam de registrar timers, listeners, loaders e repaints concorrentes.
- Home > Séries: a biblioteca real possui 813 séries (5 Continuar, 21 Poeira, 48 Em dia, 583 Não iniciadas e 156 Concluídas). O novo RPC `cinetracker_home_series_v492` retorna 24 por categoria + totais: primeiro payload cai de ~384 KB / 813 itens para ~53 KB / 98 itens. **Carregar mais** aumenta o limite localmente sem reload.
- Home > Séries: refresh de catálogo/TV é adiado para idle e limitado a uma execução por 10 minutos; após o refresh a tela continua usando o payload compacto v492, sem reintroduzir os 813 itens no DOM.
- Home > Filmes: a Watchlist real possui 1.387 filmes. O primeiro paint passa a buscar somente 60 cards v405; páginas seguintes entram apenas por **Carregar mais filmes**, adicionadas ao grid existente sem `replaceChildren` de toda a coleção.
- Home > Filmes: entrada na aba não aguarda a paginação completa; cards permanecem nativos 2:3 e o contador mostra carregados/total.
- Perfil: r455 deixa de aplicar a antiga regra de 13 cards e os owners r457–r461/r467–r470/r482/r484/r488/r489 deixam de tocar a tela. O dispatcher r491 + `cinetracker_profile_screen_v491` permanece como único painter, com exatamente 12 cards por lista e **Ver mais** apenas no cabeçalho.
- Descobrir > Pra Você: r464/v490 permanece como único owner; as gerações antigas que também carregavam/repaintavam recomendações ficam inertes.
- Top 10: geometria 2:3/`object-fit: cover` da r491 permanece preservada.

### Preservado
- r462 e o writer F1 da r477 permanecem ativos; histórico diário/Desmarcar v426/r455 é preservado.
- Rota de Esportes e Android 1.0.20 / versionCode 10062 não foram alterados.
- Sem full-page reload, `router.refresh()`, `while(true)`, `setInterval` ou novo `MutationObserver`.

## 0.3.18 — r491 (2026-10-07)

### Corrigido e finalizado na autoridade real
- A r490 foi descartada como release: seus deployments de produção falharam e ela nunca chegou ao domínio público. A r491 volta à base r489 conhecida e aplica as correções na fronteira real do `render()`, em vez de tentar sobrescrever funções lexicais por uma IIFE externa.
- Home > Séries: o dispatcher principal mostra skeleton imediatamente e entrega a tela diretamente ao owner r388/v452. Os writers tardios r237/r399/r413/r415/r417/r418/r424/r425/r471/r472/r476/r477/r481 deixam de repintar a Home.
- Home > Filmes: preservado o renderer nativo r489/v405 e travada a geometria 2:3 dos cards; writers de Home que devolviam linhas/formatos antigos foram aposentados.
- Descobrir > Pra Você: r464 passa a consumir somente o payload compacto v490 em uma chamada. Owners antigos de recomendação são aposentados e a entrada da aba usa somente uma ativação no próximo frame, sem escada de timers.
- Descobrir > Top 10: imagem do pôster recebe 2:3 e `object-fit: cover` diretamente no elemento real.
- Perfil: criada `cinetracker_profile_screen_v491`, que retorna em um payload estatísticas, atividade, cinco resumos e Esportes/Estádio. O `render()` principal aguarda esse payload e faz um único paint final.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos exibem exatamente 12 cards; totais completos permanecem 249 / 962 / 17 / 45 / 21 e apenas o botão minimalista de cabeçalho **Ver mais** permanece.
- Perfil > Esportes: valores atuais validados em 172 eventos assistidos e 1 jogo no estádio; writers antigos que causavam 0/81/valor final foram aposentados.
- O gate r491 inclui teste Chromium de comportamento/DOM para Home, Filmes 2:3, sete slots do Pra Você, Top 10 2:3 e cinco listas de 12 cards do Perfil.

### Preservado
- F1, rota de Esportes, histórico diário/Desmarcar e Android 1.0.20 / versionCode 10062 permanecem preservados.
- Sem `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou novo `MutationObserver` na r491.

## 0.3.17 — r490 (2026-10-06)

### Corrigido a partir do segundo vídeo real
- O vídeo comprovou que r489 estava executando, mas era sobrescrito depois por writers antigos. Foram neutralizados especificamente os writers visuais de Home/Descobrir/Perfil em r399, r413, r415, r416, r417, r418, r420, r421, r424, r425, r426, r427, r429, r467, r468, r469, r471, r472, r476, r477 e r481. Rotinas de F1 e histórico diário foram preservadas.
- Home > Séries: r388 passa a ser o único renderer visível. Gates e alinhamentos tardios que escondiam/reposicionavam a Home foram retirados do caminho ativo.
- Home > Filmes: permanece somente o grid nativo v405/r489 de cards 2:3; writers antigos que primeiro pintavam linhas e depois trocavam para grid deixam de executar.
- Descobrir > Pra Você: novo `cinetracker_foryou_payload_v490` reduz o payload real de 628.157 bytes para 49.346 bytes, mantendo Watchlist 30/30/30 e Novos 31/23/32. O timeout mobile passa a ser finito de 9 s e não há mais cadeia concorrente de activators legados.
- Perfil: a tela passa a ter um único paint coordenado por r490: base v380 + resumo v489 + esportes v421 + estádio v296. O banco foi validado com 249 séries, 962 filmes, 17 séries favoritas, 45 filmes favoritos e 21 atores; a visão resumida exibe exatamente 12 por seção.
- Perfil > Esportes: writers que causavam 171 → 81 → 171 e Estádio 0 foram retirados. Autoridades verificadas: 171 eventos assistidos, 17.670 minutos e 1 jogo no estádio.
- Perfil > Ver mais: permanece como botão minimalista no cabeçalho e usa a tela completa separada já existente.
- Top 10: geometria 2:3 reforçada no renderer final, sem altura fixa achatada.
- Service Worker: deixa de interceptar HTML/JS/CSS. O shell passa a ser de rede; somente imagens TMDB usam cache. Caches legados são removidos na ativação.
- Rodapé: versão/revisão passam a refletir diretamente `0.3.17 / r490-official-0.3.17`, eliminando o r425 antigo exibido no vídeo.

### Preservado
- F1, rota de Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 permanecem sem alteração funcional.
- Sem `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver` no runtime r490.

## 0.3.16 — r489 (2026-10-06)

### Correção baseada no vídeo real
- Home > Séries: removida a dependência de reposicionamentos tardios. Continuar assistindo nasce estruturalmente antes do Histórico, com skeleton visível no primeiro frame. r388 passa a ser o único painter de dados da Home; r399/r476/r477/r481 apenas delegam para ele.
- Home > Séries: cinetracker_home_series_v452 foi medido em produção em aproximadamente 1,5 s e Histórico v391 em aproximadamente 0,14 s; a espera de ~12 s do vídeo era concorrência de frontend, não lentidão do banco. O refresh pós-TMDB também deixa de reintroduzir a autoridade de Séries v391.
- Home > Filmes: a Watchlist deixa de tentar transformar media-row em card via CSS. r489 gera markup próprio de card, pagina v405 e usa pôster 2:3 real, título truncado e ação de Visto em overlay.
- Descobrir > Pra Você: criado cinetracker_foryou_payload_v489, uma única RPC para os seis pools. Validado no perfil real com Watchlist 30/30/30 e Novos 31/23/32; execução medida em ~1,18 s. A escada de três rodadas/atrasos foi removida.
- Perfil: criado cinetracker_profile_summary_v489, que devolve exatamente 12 itens por cada uma das cinco listas e os totais completos em ~0,30 s. O payload completo v485 fica adiado até Ver mais, eliminando o paint legado 25/11/10 observado no vídeo.
- Perfil > Esportes: neutralizadas as repinturas de Perfil r296/r298. A autoridade r477 esconde os contadores enquanto consulta v296 e só revela o valor final, evitando 0 → 81 → 171.
- Perfil: as cinco listas resumidas usam grid sem rolagem horizontal e nunca exibem mais de 12 cards.
- Top 10: preservado r321 com geometria final 2:3 e object-fit: cover.

### Preservado
- F1 writer/sincronização, tela de Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 não foram alterados.
- O runtime r489 não introduz window.location.reload(), router.refresh(), while(true), setInterval ou MutationObserver.
## 0.3.15 — r488 (2026-10-06)

### Corrigido com autoridade única
- Home > Séries: removida a disputa entre os carregadores r388/r399 e as camadas de reassert r485/r486/r487. r388 e r399 passam a compartilhar uma única chamada single-flight de `cinetracker_home_series_v452`, reduzindo consultas redundantes ao Supabase.
- Home > Séries: o skeleton `animate-pulse` agora faz parte do próprio primeiro frame do Home e é reaplicado imediatamente após a montagem; a tela preta deixa de depender de timers posteriores para ser substituída.
- Home > Filmes: mantida a paginação v405, com uma única regra visual final para cards compactos e uniformes, pôster estritamente 2:3, `object-fit: cover` e título truncado.
- Descobrir > Top 10: a geometria do renderer r321 é travada em 2:3 no container do pôster e `object-fit: cover` na imagem interna, inclusive no grid desktop de 10 itens.
- Descobrir > Pra Você: r464 volta a ser o único owner visível. O pool usa v485 como fonte primária, v421 como fallback delimitado e inicia o fallback TMDB de forma especulativa; candidatos TMDB só entram após filtro estrito v322/v320 de vistos/Watchlist e bloqueios de WWE/NXT, YouTube, reality, stand-up e filmes abaixo de 40 minutos.
- Perfil: r476 permanece como único owner das cinco listas, com `LIMIT=12` e `slice(0, LIMIT)`. Camadas r485/r486/r487 que reaplicavam a tela são neutralizadas no início dos respectivos IIFEs e deixam de executar; cards legados de Ver mais são podados e permanece somente o botão minimalista do cabeçalho.

### Validação / preservado
- Bundle r488 falha o build se os markers ativos r485/r486/r487 continuarem presentes; as camadas antigas ficam inertes e não registram listeners/CSS.
- Sem `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver` no runtime r488.
- F1, Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 0.3.14 — r487 (2026-10-06)

### Corrigido
- Home > Séries: skeletons `animate-pulse` passam a aparecer imediatamente antes do frame/data load; r388/v452/v391 continuam como autoridades e o carregamento permanece delimitado, sem tela preta nem reload de página.
- Home > Filmes: a Watchlist v405 volta ao padrão solicitado de cards compactos e uniformes, com pôster estritamente 2:3, título truncado e grid responsivo.
- Descobrir > Pra Você: v485 permanece como fonte primária; v421 entra apenas como fallback delimitado. Se os dois retornarem vazios, o cliente consulta TMDB, enriquece um conjunto limitado, remove WWE/NXT, YouTube, reality, stand-up e filmes abaixo de 40 minutos e aplica `cinetracker_discover_filter_v320` para bloquear itens vistos/Watchlist antes de renderizar.
- Descobrir > Top 10: card/pôster permanecem travados em 2:3 e imagens usam `object-fit: cover`, eliminando achatamento.
- Perfil: Filmes, Séries, Filmes Favoritos, Séries Favoritas e Atores Favoritos ficam com exatamente 12 cards visíveis na visão resumida. Cards grandes de **Ver mais** são removidos; permanece somente o botão minimalista do cabeçalho para abrir a lista completa.

### Versão e preservação
- A solicitação citava v0.3.9, porém a `main` já estava em 0.3.13; a publicação foi incrementada monotonicamente para **0.3.14**, sem downgrade.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.
- F1, Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 0.3.13 — r486 (2026-10-06)

### Corrigido
- Home > Séries: o frame do Home passa a ser pintado imediatamente por r388 com trava single-flight. O usuário vê snapshot/skeleton de Séries e Histórico antes de v452/v391 concluir, eliminando a tela preta de ~10 s.
- Home > Filmes: a Watchlist v405 volta ao layout compacto de linhas em toda repintura. O CSS não depende mais da classe transitória `ct485-movie-rows`, então nenhum repaint tardio retorna ao grid de cards da r481.
- Descobrir > Pra Você: preservados os RPCs diretos `cinetracker_discover_fresh_v485` e `cinetracker_discover_watch_smart_v485`. Os RPCs foram validados no banco com 48 candidatos fresh para Filme, Série e Anime.
- Descobrir > Top 10: preservados 10 itens por linha em desktop, mas pôster e card passam a respeitar geometria vertical real 2:3, sem altura fixa achatada.
- Perfil: `cinetracker_profile_lists_v485` permanece como autoridade direta e Filmes, Séries, Filmes Favoritos, Séries Favoritas e Atores Favoritos ficam limitados a exatamente 12 cards visíveis na visão resumida; **Ver mais** continua separado no cabeçalho.

### Diagnóstico de publicação
- Os commits r482–r485 não chegaram à produção porque o check do Vercel foi bloqueado por `build-rate-limit`; por isso o vídeo ainda executava a r481 e chamava v480, apesar das correções posteriores já estarem na `main`.
- O r486 consolida as correções sobre r485 e gera novos assets versionados, sem alterar F1, Esportes, histórico diário ou Android.

### Preservado
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.
- F1, Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 0.3.12 — r485 (2026-10-06)

### Corrigido
- Home > Séries: restaurado o último snapshot válido por apenas 15 minutos para o primeiro paint, enquanto `cinetracker_home_series_v452` e `cinetracker_home_history_v391` continuam atualizando em segundo plano. Sem snapshot, o shell/skeleton é montado imediatamente, eliminando a tela preta durante a espera do banco.
- Home > Filmes: mantida a paginação `cinetracker_home_movies_v405`, mas a Watchlist volta ao formato compacto de linha do Home, com poster 44x66 em 2:3, título truncado, metadados visíveis e ação à direita.
- Descobrir > Pra Você: removida a cadeia pesada v421 → v476 → v480/v484 que estava estourando o statement timeout no Supabase. Os novos RPCs v485 consultam diretamente mídia/estados/histórico e alimentam os 7 slots sem retornar “Sem indicação elegível agora” por timeout.
- Descobrir: v485 mantém exclusão de vistos, Watchlist e favoritos nos blocos novos; “Da sua Watchlist” parte somente da Watchlist ainda não vista. Também preserva os bloqueios de WWE/NXT, reality, stand-up, produções originárias do YouTube e filmes com menos de 40 minutos.
- Perfil: `cinetracker_profile_lists_v485` lê diretamente histórico, favoritos e atores usando as tabelas indexadas, sem depender dos dashboards legados que estavam atingindo timeout.
- Perfil: Filmes, Séries, Filmes Favoritos, Séries Favoritas e Atores Favoritos ficam limitados a exatamente 12 cards na visão resumida quando há 12 ou mais itens. O **Ver mais** permanece somente no cabeçalho e abre a tela completa separada.

### Preservado / validação
- Nenhuma alteração em F1, Esportes, histórico diário/Desmarcar visto ou Android.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no runtime r485.
- RPCs diretos v485 foram aplicados no Supabase de produção e validados com 48 candidatos em Filme, Série e Anime no caminho fresh.

## 0.3.11 — r484 (2026-10-06)

### Corrigido
- Home > Séries: removido o gate legado r459 que ainda escondia a view por até 4,2 s. Owners r457/r459/r460 agora convergem para r477/r399, mantendo v452 como autoridade e skeleton visível desde o primeiro paint.
- Home > Séries/Histórico: removido o bootstrap visual de cache com até 6 h que podia exibir dados antigos antes da resposta viva; v452/v391 passam a substituir diretamente o skeleton.
- Descobrir > Pra Você: owners legados r457/r459/r460 deixam de repintar pools v421 e passam a delegar ao r464. O r464 usa v484 primário e v476 estrito como fallback, sem reutilizar o cache local de candidatos r481.
- Descobrir: v484 preserva os bloqueios de vistos, Watchlist, favoritos, aliases equivalentes e WWE/NXT do v476, prioriza itens não mostrados nos últimos 7 dias e embaralha candidatos a cada abertura. Interstellar/Interestelar, Casino Royale/Cassino Royale e Harry Potter ficam cobertos pela equivalência de títulos/estados já existente.
- Perfil: r476/v484 passa a ser a autoridade única das cinco listas. Séries e Filmes usam somente histórico real; Séries Favoritas, Filmes Favoritos e Atores usam exclusivamente suas respectivas fontes.
- Perfil: exatamente 12 cards na visão resumida; controles legados r455/r457/r459/r460 não podem mais adicionar cards/Ver mais concorrentes.
- Perfil > Ver mais: permanece no cabeçalho e abre a lista completa em tela separada. Em Filmes, a tela abre em Histórico e permite alternar no topo entre Histórico e Watchlist.

### Preservado / validação
- F1, Esportes, histórico diário/Desmarcar visto e Android 1.0.20 / versionCode 10062 permanecem preservados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no runtime r484.

## 0.3.10 — r483 (2026-10-06)

### Finalização da especificação v0.3.8
- Home > Séries mantém skeleton imediato e bootstrap do último estado válido, com atualização viva por `cinetracker_home_series_v452` e Histórico v391 sem reposicionamentos atrasados.
- Home > Fórmula 1 mantém o check assíncrono pelo writer canônico `cinetracker_f1_watch_sync_v462`, com trava contra clique concorrente, Optimistic UI e atualização sem reload.
- Home > Filmes restaura a Watchlist v405 em cards compactos padronizados 2:3, com largura fixa e título truncado, removendo a regressão de linhas da r482.
- Descobrir > Pra Você mantém v480 como fonte estrita e usa somente v476 como fallback delimitado. Nenhum fallback pode ignorar exclusões de vistos, Watchlist, favoritos ou WWE/NXT.
- Descobrir > Trocar preserva a rotação ponderada/randomizada pelos candidatos ranqueados e o cache local curto, sem iteração sequencial engessada.
- Perfil preserva a fonte pura v480: Séries/Filmes somente por histórico real; Séries Favoritas, Filmes Favoritos e Atores Favoritos somente pelas respectivas categorias.
- Perfil exibe no máximo 12 cards por seção. O card grande **Ver mais** foi removido novamente; somente o botão minimalista do cabeçalho permanece quando há conteúdo adicional.
- Perfil > Ver mais força nova consulta completa ao banco antes da tela integral. Filmes mantém o alternador **Histórico / Watchlist** e a Watchlist paginada v405.
- Perfil > Esportes preserva o último valor válido de TV/Estádio durante refresh v296, sem piscar para zero.

### Validação / preservado
- A especificação solicitada como v0.3.8 já havia sido versionada na r481; como a `main` já estava em 0.3.9, a finalização é publicada monotonicamente como 0.3.10, sem downgrade.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no patch r483.
- Histórico diário/desmarcação v426, F1 Hub, Esportes e Android 1.0.20 / versionCode 10062 permanecem preservados.

## 0.3.9 — r482 (2026-10-06)

### Corrigido
- Home > Séries: removidos os reposicionamentos automáticos atrasados que executavam após cada repaint de Histórico/Séries e faziam a página piscar e subir/descer. Séries v452 e Histórico v391 permanecem como fontes existentes; a troca de semi-aba continua resetando o scroll uma única vez.
- Home > Filmes: removido o grid de cards grandes introduzido na r481. A Watchlist v405 volta ao layout compacto em linhas, com miniatura 2:3 pequena e título truncado; o estado de carregamento usa linhas compactas.
- Descobrir > Pra Você: v480 continua sendo a fonte estrita primária. Quando v480 excede o tempo de resposta, o cliente usa fallback delimitado v421 para preencher Indicação do Dia e os demais slots, evitando a tela inteira em “Sem indicação elegível agora”.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos exibem exatamente 12 cards e, quando existem mais itens, um único 13º card **Ver mais**.
- Perfil > Ver mais: o 13º card reutiliza a tela completa separada já existente; não expande a lista na mesma linha. O botão duplicado de cabeçalho fica oculto.

### Preservado
- Histórico diário, Esportes, Fórmula 1 e Android permanecem sem alterações.
- Nenhum `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` foi introduzido.

## 0.3.8 — r481 (2026-10-06)

### Home
- Primeiro paint da aba Séries passa a ter skeletons instantâneos e reutiliza o último snapshot válido enquanto v452/v391 atualizam em segundo plano; removido o caminho visual de tela preta.
- Adicionados índices seguros para os hot paths de `media_overrides`, `watch_history`, `episode_progress`, recomendações exibidas e atores favoritos.
- O check da Fórmula 1 no **Assistir a seguir** permanece no writer canônico `cinetracker_f1_watch_sync_v462`, com trava contra clique concorrente, atualização otimista e sem reload.
- Home > Filmes > Watchlist foi padronizado em cards compactos com pôster 2:3, largura fixa e título truncado; paginação v405 preservada.

### Descobrir > Pra Você
- **Indicação do Dia** e **100% Novos** continuam estritamente excluindo mídias vistas, em Watchlist ou favoritadas, inclusive por aliases de título/TMDB.
- WWE/NXT permanece bloqueado globalmente pelos filtros v476/v480.
- O botão **Trocar** passa a sortear entre os melhores candidatos já ordenados por afinidade, sem iteração sequencial e sem laço ilimitado.
- Pools de recomendação passam a usar cache local de 15 minutos como fallback instantâneo, com refresh assíncrono de 2,5 s e invalidação imediata após qualquer mutação do usuário.

### Perfil
- Séries e Filmes são somente histórico real; Séries Favoritas, Filmes Favoritos e Atores Favoritos continuam isolados em suas próprias fontes.
- Todas as cinco listas resumidas ficam limitadas a 12 cards; cards grandes **Ver mais** permanecem removidos.
- Mantido apenas o botão minimalista **Ver mais** no cabeçalho.
- Ao abrir **Ver mais**, o Perfil força nova consulta completa ao banco antes de montar a tela integral.
- Filmes > Ver mais mantém o alternador **Histórico / Watchlist**, com Watchlist completa paginada em v405.
- Estatísticas de esportes passam a conservar e repintar imediatamente o último valor válido de TV/Estádio; a consulta v296 atualiza em segundo plano sem ocultar ou zerar os contadores.

### Preservado
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.
- F1 Hub, sincronização de esportes e Android 1.0.20 / versionCode 10062 preservados.

## 1.0.270 — r480 (2026-10-06)

### Corrigido
- Home: Séries v452 e Histórico v391 passam a reaproveitar por até 6 horas o último snapshot válido apenas para o primeiro paint. O conteúdo aparece imediatamente e é atualizado em segundo plano pela autoridade atual; qualquer mutação invalida esse bootstrap para não exibir estado antigo.
- Descobrir > Pra Você: os pools passam explicitamente pelos contratos v480, mantendo as exclusões estritas de vistos, favoritos e Watchlist herdadas de v476/v479.
- Descobrir > Pra Você: além da memória no banco, adicionada memória local de exposição por 7 dias. Os pools e a Indicação do Dia priorizam itens ainda não exibidos antes de reutilizar um candidato recente.
- Descobrir > Pra Você: Trocar, Marcar como visto e adicionar à Watchlist continuam atualizando o card localmente e a nova recomendação exibida também entra na memória, sem reload.
- Perfil: a fonte final passa a ser `cinetracker_profile_lists_v480`, mantendo Séries e Filmes exclusivamente por histórico real; Séries Favoritas, Filmes Favoritos e Atores Favoritos permanecem categorias independentes.
- Perfil: cada uma das cinco listas resumidas continua limitada a exatamente 12 cards quando houver pelo menos 12 itens.
- Perfil > Filmes > Ver mais: preservada a tela completa separada, abrindo em **Histórico** e com seletor **Histórico / Watchlist** no topo.

### Preservado / validação
- Esportes não foi alterado pela r480.
- F1, histórico diário/desmarcação v426 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Nenhum `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver` foi introduzido.

## 1.0.269 — r479 (2026-10-05)

### Corrigido
- Home: adicionada renderização visual imediata enquanto a sessão é restaurada, eliminando o intervalo de tela preta sem criar gate que esconda os dados reais. O owner r478/r399 continua responsável por Séries v452, Histórico e Watchlist v405.
- Descobrir > Pra Você: os pools v479 preservam a exclusão estrita v476 por TMDB ID, aliases traduzidos/originais, histórico real, favoritos e Watchlist. Interstellar/Interestelar, Casino Royale e Harry Potter foram usados como regressão de identidade duplicada e ficaram fora dos pools elegíveis.
- Descobrir > Pra Você: cada conjunto efetivamente exibido é persistido em `shown_recommendations`; itens vistos nos últimos 7 dias são rebaixados e a próxima abertura prioriza itens ainda não mostrados. Trocar e ações também registram a nova exposição.
- Perfil > Séries e Filmes: passam a usar somente atividade real de visualização, ordenada pelo último item assistido. Estados de favorito/Watchlist deixam de qualificar essas duas listas como histórico.
- Perfil > Séries Favoritas, Filmes Favoritos e Atores Favoritos: permanecem fontes independentes e puras.
- Perfil: todas as cinco listas mantêm exatamente 12 cards na visão resumida quando há conteúdo suficiente; **Ver mais** continua abrindo a tela completa separada.
- Perfil > Filmes > Ver mais: abre em **Histórico** e mantém o seletor superior **Histórico / Watchlist**, carregando a Watchlist completa via v405 somente quando necessário.
- Esportes: Web passa a usar os RPCs v479, que excluem competições/equipes com categoria U/Sub/Under de 14 a 23 anos. O filtro não usa a palavra “Juniors”, portanto clubes profissionais como Argentinos Juniors não são removidos.
- Backend v479 aplicado em produção e validado: 0 ocorrências dos exemplos bloqueados nos pools de filmes e 0 eventos de base nas respostas esportivas filtradas.

### Preservado / validação
- Nenhum `window.location.reload()`, `router.refresh()`, `while(true)`, `setInterval` ou `MutationObserver` foi introduzido pela r479.
- Histórico diário/desmarcar v426 e F1 permanecem inalterados.
- Android permanece 1.0.20 / versionCode 10062 e continua usando os contratos esportivos anteriores.

## 1.0.268 — r478 (2026-10-05)

### Corrigido
- Home > Séries: removida a disputa do primeiro carregamento entre o renderer r388/v391 e o owner atual r399/v452. O r388 mantém somente frame/Histórico e não substitui mais um shell já visível, eliminando o flash preto/repaint antes dos dados corretos.
- Home > Filmes: removida a disputa do loader legado v393 com a Watchlist canônica v405; o r399 continua como autoridade dos filmes.
- Descobrir > Pra Você: restaurados os pools estritos v476. Indicação do Dia e 100% Novos excluem vistos, favoritos, Watchlist e aliases já conhecidos; Da sua Watchlist exclui itens já vistos. Os seis slots não-diários avançam de posição entre carregamentos em vez de sempre voltar ao primeiro candidato.
- Perfil > Séries: a seção passa a mostrar exclusivamente séries com histórico real de episódios assistidos, ordenadas pelo histórico recente.
- Perfil > Filmes: a seção passa a mostrar exclusivamente filmes com histórico real e data de visualização.
- Perfil > Séries Favoritas, Filmes Favoritos e Atores Favoritos permanecem alimentados somente pelas respectivas categorias.
- Todas as cinco listas resumidas continuam limitadas a exatamente 12 cards visíveis.
- Perfil > Ver mais > Filmes: a tela completa abre em **Histórico** e adiciona a alternância **Histórico / Watchlist** no topo. A Watchlist é carregada de forma paginada pelo RPC v405 somente quando necessária.

### Preservado
- Botões e ações de Descobrir permanecem no renderer r464.
- Esportes e Jogos no Estádio permanecem na autoridade r477/v296.
- F1 permanece na sincronização r462/r477.
- Histórico diário e Desmarcar visto permanecem na autoridade v426.
- Android 1.0.20 / versionCode 10062 permanece inalterado.
- Nenhum `window.location.reload()`, `router.refresh()`, loop infinito, `MutationObserver` ou `setInterval` foi adicionado.

## 1.0.267 — r477 (2026-10-05)

### Corrigido
- Home > Séries: removido o gate r415 que mantinha a entrada visualmente presa por até ~9 segundos. O shell/frame passa a ficar visível imediatamente, enquanto r399/v452 continua carregando os dados.
- Home > Fórmula 1: o check compacto da linha do Home passa a usar diretamente o writer canônico `cinetracker_f1_watch_sync_v462`, com Optimistic UI, trava contra clique concorrente e atualização local sem reload. O runtime r462 também volta a enxergar o RPC real da closure.
- Home > Filmes: a Watchlist v405 volta ao mesmo padrão compacto/rico das linhas de Séries, removendo os cards gigantes introduzidos pela r476.
- Descobrir > Pra Você: restaurados os pools estáveis `cinetracker_discover_watch_unseen_v421` e `cinetracker_discover_fresh_v421`, com retry finito mais curto e filtro defensivo WWE mantido.
- Perfil > Esportes assistidos: removidas as repinturas concorrentes r415/r424. `Eventos assistidos` e `Jogos no Estádio` passam a ser reconciliados por uma única autoridade v296, evitando alternância/pisca entre versões.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos ficam limitados a exatamente 12 cards na visão resumida. O card grande de **Ver mais** continua removido; somente o botão compacto no cabeçalho abre a tela completa da categoria.
- Perfil: o owner final r476 é reaplicado após repaints legados e há trava visual para impedir um 13º card residual.

### Preservado / validação
- Histórico diário e **↶ Desmarcar visto** v426 preservados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no runtime r477.
- Android 1.0.20 / versionCode 10062 permanece inalterado.

## 1.0.266 — r476 (2026-10-05)

### Corrigido
- Home > Séries: removido o gate legado r424 que escondia a view durante o carregamento e causava entrada preta. A Home passa a pintar shell/frame visível imediatamente e mantém r399/v452 como autoridade de Séries.
- Home > Filmes: Histórico permanece no topo, mas a entrada em Filmes ancora em **Assistir a seguir / Watchlist**. A Watchlist v405 volta ao padrão visual de cards 2:3, com renderização progressiva para a lista completa.
- Descobrir > Pra Você: Indicação do Dia e 100% Novos passam ao filtro v476, que bloqueia mídias já assistidas, em andamento, concluídas, em dia, na Watchlist ou favoritas por TMDB ID e aliases normalizados; também inclui play-events na evidência de vistos.
- Descobrir > Pra Você: filtro WWE ampliado para WWE, NXT, Raw, SmackDown, WrestleMania, Royal Rumble, SummerSlam, Survivor Series e eventos relacionados.
- Descobrir > Da sua Watchlist: passa ao pool inteligente v476, ordenado por afinidade de gêneros com o consumo recente e nota, mantendo variação ponderada no **Trocar** em vez de percorrer a lista em ordem.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos usam a autoridade completa `cinetracker_profile_lists_v476`, incluindo histórico por play-events e todos os atores favoritos.
- Perfil: removido o card grande de **Ver mais**. Cada quadro mantém exatamente 12 cards do mesmo tamanho e somente o botão compacto de **Ver mais** no cabeçalho.
- Perfil > Ver mais: o botão compacto abre uma tela separada com todos os itens da categoria correta, renderizados progressivamente em lotes para não travar a main thread.
- Perfil > Assistido por dia e **↶ Desmarcar visto** preservados sem alteração.

### Preservado / validação
- Esportes, Fórmula 1 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Nenhum `window.location.reload()`, `router.refresh()`, `setInterval` ou `while(true)` foi introduzido pela r476.

## 1.0.265 — r475 (2026-10-05)

### Corrigido
- Home > Séries: a ocultação visual legada deixa de poder manter a view ativa preta; o Home recupera também frames incompletos, não apenas a ausência total do container, e mantém Séries em `cinetracker_home_series_v452`.
- Home > Séries e Histórico: r388/r399 voltam a gerar as linhas ricas pelo renderer lexical ct274, via ponte mínima da closure, eliminando o fallback de texto simples e preservando Histórico v391.
- Home > Filmes: a Watchlist completa continua paginada por `cinetracker_home_movies_v405`, mas volta ao visual rico com poster/metadados/ação. Após repaint tardio do Histórico, a semi-aba Filmes termina ancorada em **Assistir a seguir / Watchlist**, sem ser empurrada para Filmes vistos.
- Home: os resets absolutos legados deixam de sobrescrever o âncora semântico. O owner r399/r374 mantém Séries em **Assistir a seguir** e Filmes em **Assistir a seguir / Watchlist** mesmo após repaints tardios.
- Descobrir > Pra Você: preservado o owner r464 e a exceção **Da sua Watchlist** em v421. **Indicação do Dia** e **100% Novos** passam a usar `cinetracker_discover_fresh_v475`, que exclui mídia conhecida tanto pelo TMDB real quanto por aliases/localizado/original, cobrindo duplicatas legadas como os filmes de Harry Potter já vistos.
- Perfil: as quatro listas de mídia passam a usar o RPC leve e completo `cinetracker_profile_lists_v475`, evitando o dashboard pesado que falhava/estourava tempo e fazia **Filmes Favoritos** ficar parcial.
- Perfil: permanecem **12 cards + 13º Ver mais**. Todos os controles legados de cabeçalho são ocultados e o card **Ver mais** passa sempre pela tela completa independente do r472; isso corrige inclusive Atores Favoritos.
- Banco: adicionados `cinetracker_profile_lists_v475`, `cinetracker_discovery_exclusions_v475` e `cinetracker_discover_fresh_v475`.

### Preservado / validação
- **Da sua Watchlist** não recebe o filtro de watchlist aplicado aos slots novos.
- Histórico diário/desmarcação, Esportes, Fórmula 1 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` nos owners alterados.

## 1.0.264 — r474 (2026-10-05)

### Corrigido
- Home > Séries: o frame do Home passa a ser montado imediatamente quando a rota entra em `home`, sem aguardar as recuperações tardias. O owner r399 continua usando `cinetracker_home_series_v452`.
- Home > Histórico: quando o histórico v391 termina depois das listas, o Home reaplica o âncora da semi-aba ativa. Isso impede o Histórico de empurrar **Continuar Assistindo** ou a Watchlist para fora da área visível.
- Home > Filmes: a Watchlist v405 permanece como seção ativa após o repaint tardio do histórico.
- Descobrir > Pra Você: r464 passa a renderizar no container de Discover realmente visível e usa somente um carregamento v421 em andamento por vez, eliminando os carregamentos que se cancelavam mutuamente.
- Perfil: r472 passa a ser o único owner das listas resumidas. Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos mostram exatamente **12 cards + 13º Ver mais** quando houver conteúdo adicional.
- Perfil: controles nativos **Ver mais** do cabeçalho também são reconhecidos quando são links ou elementos com `role=button`, evitando duplicidade com o 13º card.
- Perfil: a visão resumida é pintada imediatamente a partir do cache já disponível e depois hidratada pelos RPCs canônicos, sem aguardar a estatística de estádio.
- Perfil: o limiter legado r455 foi aposentado somente para as listas; o vínculo do histórico diário/desmarcação permanece preservado.

### Preservado / validação
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` nos owners corrigidos.
- Fórmula 1 e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 1.0.263 — r473 (2026-10-05)

### Corrigido
- Home > Séries: r388 e r399 deixam de depender dos hooks removidos da r469 e passam a usar diretamente a ponte viva `__ctCoreR471` para rota e RPC. Isso restaura o frame, Histórico, Continuar Assistindo e demais seções, com Séries em `cinetracker_home_series_v452` e histórico em `cinetracker_home_history_v391`.
- Home > Filmes: o paginador `cinetracker_home_movies_v405` do r399 usa a mesma ponte viva, restaurando Assistir a seguir / Watchlist.
- Descobrir > Pra Você: o r464 continua como owner único, mas deixa de bloquear os pools v421 em um `authReady` obsoleto e chama o RPC real pela ponte da closure.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos passam a exibir exatamente 12 cards e, quando houver mais conteúdo, um único 13º card **Ver mais**.
- Perfil > Ver mais: preservada a abertura em tela completa separada; não há expansão inline.

### Preservado / validação
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no patch r473.
- F1 e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 1.0.262 — r472 (2026-10-05)

### Corrigido
- Home > Séries: aposentado o owner r461 de navegação que ainda podia ocultar a view fora da closure sem conseguir carregar os dados. O frame e o Histórico permanecem no r388, enquanto o owner r399 dentro da closure reafirma `cinetracker_home_series_v452` com recuperação delimitada.
- Home > Filmes: a semi-aba Filmes reafirma o paginador `cinetracker_home_movies_v405` do r399 e preserva o frame/Histórico do r388, eliminando o estado permanente de “Carregando Watchlist…”.
- Descobrir > Pra Você: removida a concorrência visível do r461; o r464 volta a ser o renderer efetivo dos seis pools v421 e recebe recuperação delimitada após navegação/clique.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores Favoritos exibem no máximo 13 cards na visão resumida e um único 14º card **Ver mais** quando existe conteúdo adicional.
- Perfil > Ver mais: o 14º card aciona a tela completa já existente da lista; quando esse fluxo nativo não está disponível, abre uma tela completa separada de fallback. A expansão inline foi removida.
- Perfil > Jogos no Estádio: o valor passa a ser pintado pela autoridade `cinetracker_sports_stadium_summary_v296`, com fallback pelo histórico esportivo v296 e sem substituir um valor válido quando o RPC falha. A produção foi validada com 171 eventos assistidos e 1 evento presencial.
- Perfil > gráfico diário e **↶ Desmarcar visto** permanecem na autoridade r471/v426, sem alteração da persistência otimista.

### Preservado / validação
- Nenhum `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` foi introduzido no runtime r472.
- Fórmula 1 r462 e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 1.0.261 — r471 (2026-10-04)

### Corrigido
- Corrigida a causa estrutural comum a Home, Descobrir, Perfil e Histórico: `session`, `rpc`, `route` e o estado do Perfil vivem na closure original, enquanto alguns runtimes recentes eram anexados depois do fechamento dessa closure e portanto não conseguiam executar os loaders reais.
- Introduzida uma ponte interna mínima `__ctCoreR471` dentro da closure original. Ela expõe somente operações necessárias aos owners externos, sem expor token e sem substituir `window.rpc`, `window.route` ou `window.session`.
- Home > Séries: removido o gate visual r461 que podia manter toda a view invisível; o owner r399, que executa dentro da closure, volta a carregar `cinetracker_home_series_v452` na entrada e ao retornar à semi-aba.
- Home > Filmes: o mesmo owner r399 continua responsável pela Watchlist paginada via `cinetracker_home_movies_v405`.
- Descobrir > Pra Você: o renderer r464 é reconectado à rota/autenticação/RPC reais e permanece como owner visível dos seis pools v421; as três reentradas r399 para Pra Você são neutralizadas para impedir repaint concorrente.
- Perfil: Séries, Filmes, Séries Favoritas e Filmes Favoritos usam o dashboard completo `cinetracker_profile_media_dashboard_v0991`; Atores usa `cinetracker_profile_actors_v465`. A visão resumida renderiza exatamente 13 cards e, somente quando o total excede 13, um único 14º card **Ver mais**.
- Perfil > gráfico diário: o callback lexical de clique é religado ao loader r471 e passa a consultar `cinetracker_activity_items_by_day_v426`.
- Histórico diário: cada item recebe um botão mínimo **↶** na mesma linha. A remoção é otimista, possui trava contra cliques concorrentes e rollback em erro; filmes/episódios usam `cinetracker_unmark_history_item_v426` e esportes usam `cinetracker_unmark_sport_history_v426`.

### Preservado / validação
- Cards do Perfil mantêm proporção 2:3 e título truncado.
- Nenhum `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` foi introduzido nos runtimes r471/r464 publicados.
- Fórmula 1 r462 e Android 1.0.20 / versionCode 10062 permanecem inalterados.

## 1.0.260 — r470 (2026-10-04)

### Corrigido
- Removidas da publicação as pontes r468/r469 que sobrescreviam `rpc`, `route` e `session` e estavam interrompendo Home, Descobrir, Perfil e Histórico no navegador real.
- Home > Séries volta à base funcional r464/r399 e ao RPC `cinetracker_home_series_v452`, incluindo entrada inicial e retorno à semi-aba.
- Home > Filmes > Assistir a seguir volta à paginação `cinetracker_home_movies_v405`.
- Descobrir > Pra Você volta ao owner r464 com os seis pools v421 e os 7 slots existentes.
- Perfil: r461 não transforma falha/timeout de estatísticas em valores zerados; o último valor válido permanece visível até uma resposta válida substituir o estado.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos, Watchlists aplicáveis e Atores usam 13 cards na visão resumida e um único 14º controle **Ver mais** quando o total excede 13.
- Atores Favoritos hidrata pelo `cinetracker_profile_actors_v465`, usando o total real e até 50 registros para que o 14º **Ver mais** exista quando aplicável.
- Histórico diário volta a usar diretamente os RPCs v426; cada item possui botão mínimo **↶** na mesma linha, com remoção otimista e rollback em falha.

### Preservado / validação
- Fórmula 1 r462 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no runtime r470.

## 1.0.259 — r469 (2026-10-04)

### Corrigido
- Home > Séries: r399 passa a consultar `ctSession`/`sbRpc` por hooks diretos r469 e volta a executar `cinetracker_home_series_v452` no carregamento inicial e ao retornar à aba.
- Home > Filmes > Assistir a seguir: paginação `cinetracker_home_movies_v405` usa o mesmo caminho direto, sem reload.
- Descobrir > Pra Você: owner r464 usa o runtime atual diretamente e volta a carregar os seis pools v421, mantendo os 7 slots e ações existentes.
- Perfil: limite de 13 cards é reaplicado com um único 14º **Ver mais**; botões legados duplicados são removidos e o controle nativo do cabeçalho fica oculto. Atores Favoritos carrega por `cinetracker_profile_actors_v465`.
- Histórico diário: abrir o dia e desmarcar item usam os RPCs v426 pelo caminho direto. O **↶** permanece minimalista e na mesma linha; remoção otimista e rollback continuam sem reload.

### Preservado
- Fórmula 1 r462 e Android 1.0.20 / versionCode 10062.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)` no runtime r469.

## 1.0.258 — r468 (2026-10-04)

### Corrigido
- Corrigida a causa comum que impedia os owners r399/r464/r467 de executarem: a base atual autentica em `ctSession` e chama o banco por `sbRpc`, enquanto esses runtimes aguardavam os aliases `session` e `rpc`. A r468 cria uma ponte dinâmica para os nomes canônicos e uma rota compatível baseada no DOM atual.
- Home > Séries volta a disparar `cinetracker_home_series_v452` após a sessão autenticada ficar disponível, incluindo o carregamento inicial e a volta para a semi-aba Séries.
- Home > Filmes > Assistir a seguir / Watchlist volta a disparar o paginador `cinetracker_home_movies_v405` sem reload.
- Descobrir > Pra Você volta a disparar os seis pools v421 somente quando a aba Pra Você está ativa.
- Perfil volta a aplicar o limite de exatamente 13 cards e o 14º item `Ver mais`; Atores Favoritos volta a hidratar por `cinetracker_profile_actors_v465`. Controles `Ver mais` do cabeçalho são ocultados nas listas governadas para evitar duplicidade.
- Perfil > Histórico diário volta a alcançar `cinetracker_activity_items_by_day_v426`; o botão mínimo ↶ permanece na mesma linha de cada item e a desmarcação continua otimista com rollback por `cinetracker_unmark_history_item_v426` / `cinetracker_unmark_sport_history_v426`.

### Diagnóstico / validação
- No intervalo do vídeo de 04/10/2026, o Supabase registrou chamadas autenticadas do navegador, porém nenhuma chamada aos RPCs v405/v421/v426/v452/v465, confirmando que o bloqueio ocorria no cliente antes do banco.
- Os RPCs v405/v421/v426/v452/v465 foram confirmados no banco de produção com as assinaturas esperadas; nenhuma migration nova foi necessária.
- F1 r462 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Runtime r468 não usa `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.

## 1.0.257 — r467 (2026-10-03)

### Corrigido
- Home Séries volta ao owner r399/r463 que aguarda autenticação e carrega `cinetracker_home_series_v452`; a sobreposição r465/r466 que deixava a tela vazia foi removida do bundle.
- Home Filmes volta ao paginador estável `cinetracker_home_movies_v405`; removido o conflito r465/r466 que chamava o loader r461 sem colocar o estado interno em Filmes e deixava “Assistir a seguir / Watchlist” vazio.
- Descobrir > Pra Você volta à base r464/r399 com pools `cinetracker_discover_watch_unseen_v421` e `cinetracker_discover_fresh_v421`; os overrides r465/r466 não são mais publicados.
- Perfil limita cada lista aplicável a exatamente 13 cards e usa o 14º elemento como botão compacto **Ver mais**. Atores Favoritos usa `cinetracker_profile_actors_v465`, eliminando o teto legado de 10.
- Histórico diário coloca um botão mínimo ↶ na mesma linha de cada item. A desmarcação volta a enviar `media_id` numérico, conforme a assinatura real `bigint` de `cinetracker_unmark_history_item_v426`, com remoção otimista e rollback em falha.

### Preservado / validação
- Fórmula 1 r462 e Android 1.0.20 / versionCode 10062 permanecem inalterados.
- Runtime r467 não usa `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.

## 1.0.256 — r466 (2026-10-02)

### Corrigido
- Build r465 quebrava antes de publicar por exigir um owner r399 já removido do bundle final; r466 torna esses cortes compatíveis com a base real e exige apenas os owners ainda ativos.
- Histórico: `media_id` de filmes/episódios deixa de passar por `Number()`; UUID é enviado integralmente para `cinetracker_unmark_history_item_v426`.
- Home: owner r461 de abas é neutralizado antes do runtime autenticado, preservando o carregamento inicial de Séries e a Watchlist v405 de Filmes.
- Descobrir > Pra Você: reentradas r399/r461/r464 são neutralizadas quando presentes; owner visível v421 preserva os 7 slots e botões `Trocar`.
- Perfil: 13 cards + 14º `Ver mais` preservados, inclusive Atores via RPC v465.

### Validação
- Gate r466 exige bundle, assets, RPCs atuais, Trocar delimitado, Perfil 13+Ver mais e desmarcação UUID sem coerção numérica.
- Android preservado em 1.0.20 / versionCode 10062.

## 1.0.255 — r465 (2026-10-02)

### Corrigido
- Home Séries: owners ainda vivos convergem para r465; após autenticação, o renderer r388 (já promovido para `cinetracker_home_series_v452`) recarrega e repinta a lista.
- Home Filmes: r456/r457/r460/r461 convergem para r465; após autenticação, r465 chama diretamente o paginador r461 sobre `cinetracker_home_movies_v405`.
- Descobrir > Pra Você: loaders/painters r456/r457/r458/r460/r461/r464 convergem para r465; o renderer escolhe o container realmente visível e carrega Filme/Série/Anime de Watchlist e 100% Novos pelos pools v421.
- Pra Você: todos os 7 slots têm linha de ações completa; Indicação do Dia e 100% Novos têm Watchlist/Visto/Trocar, e Da sua Watchlist tem Visto/Trocar. Troca por slot é delimitada e protegida contra cliques concorrentes.
- Perfil: exatamente 13 cards na visão resumida e o 14º elemento é Ver mais quando há conteúdo adicional.
- Atores Favoritos: removida a dependência do limite legado de 10; novo RPC `cinetracker_profile_actors_v465` retorna até 14 linhas e o total real para montar 13 + Ver mais.
- Histórico diário: `Desmarcar visto` virou controle mínimo na mesma linha de cada item. Esportes usam `cinetracker_unmark_sport_history_v426`; filmes/episódios usam `cinetracker_unmark_history_item_v426` com todos os argumentos nomeados.
- Desmarcação é otimista e recoloca a linha se a persistência falhar, sem recarregar a página.

### Banco / validação
- Migration `20261002212000_r465_profile_actors_summary.sql` registrada; a função já foi aplicada no Supabase de produção e validada com 21 atores totais / 14 retornados para a visão resumida.
- Runtime r465 não introduz `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou `while(true)`.
- Android preservado em 1.0.20 / versionCode 10062.

## 1.0.254 — r464 (2026-10-02)

### Descobrir > Pra Você
- Escopo exclusivo no Pra Você.
- Neutraliza os três pontos de reentrada do owner r399 para Pra Você: clique da aba, settle automático da rota e repaint por `cinetracker:data-changed`.
- Introduz owner visível r464, que usa exclusivamente os pools v421 e encerra o carregamento em tempo finito.
- Renderiza os 7 slots esperados e mantém os botões ativos: **Watchlist**, **Visto** e **Trocar**, conforme o tipo de slot.
- `Trocar` altera somente o slot clicado e usa trava síncrona por slot para evitar race condition em cliques rápidos.
- Ações Visto/Watchlist atualizam a UI imediatamente e delegam a persistência existente, sem recarregar a página.
- Sem full-page reload, observer permanente, intervalo permanente, recursão sem trava ou `while(true)`.
- Home, Perfil, Esportes, Fórmula 1 e Android não foram alterados.

### Build / validação
- Web: **1.0.254 / r464-official-1.0.254**.
- Build: `apps/web/build-r464.mjs`.
- Regressão: `apps/web/test-r464.mjs`.
- Android preservado em **1.0.20 / versionCode 10062**.

## 1.0.252 / r462 — sincronização canônica Fórmula 1 — 2026-10-02

## 1.0.253 — r463 (2026-10-02)

### Corrigido
- Home Séries deixa de depender do r399/v391 e usa v452 após recuperação finita da sessão.
- Home Filmes carrega a Watchlist v405 paginada no primeiro owner de clique, encerrando o loading infinito.
- Pra Você usa os pools v421 no owner r399, com ações completas e sete botões Trocar.
- Perfil mantém 13 cards + 14º Ver mais; r461 não força mais os cards ocultos a reaparecer.
- Histórico diário mantém Desmarcar visto por item sem recarregar a página.

### Preservado
- F1 r462, incluindo o hotfix de sincronização mais recente, e Android 1.0.20 / 10062.


- Cria `cinetracker_f1_watch_sync_v462` como writer canônico de uma sessão F1 para Série (mídia 865), Esportes e F1 Hub.
- Corrige a causa que ainda deixava Esportes fora da Série: o overload real `cinetracker_sport_mark_watched_v1(event_id,...)` agora detecta Fórmula 1, resolve o episódio no mapa e delega ao writer v462.
- Série → Esportes/F1 Hub e F1 Hub → Série/Esportes ficam protegidos por triggers canônicos; metadado de ownership impede recursão entre triggers.
- A escrita evita criar novo play de Série quando o episódio já está visto, impedindo duplicação de tempo por reconciliação.
- O histórico esportivo é deduplicado por sessão mapeada no momento da escrita e conserva duração canônica da sessão.
- Runtime r462 amplia a captura do botão real da Série, aplica Optimistic UI e reamarra os handlers finais do r423 ao writer v462.
- Progresso visível continua vindo de `cinetracker_f1_progress_v426`; nenhuma reconciliação periódica é adicionada.
- Migration `20261002193000_r462_f1_true_three_way_sync.sql` aplicada no Supabase de produção e registrada no repositório.
- Hotfix `20261002194500_r462_f1_hub_delete_guard_fix.sql` aplicado: desmarcação direta no F1 Hub propaga para Série/Esportes sem reentrância dos writes canônicos.
- Validação transacional no Supabase confirmou: writer canônico marca/desmarca os três domínios; Esportes por `event_id` propaga para Série/F1 Hub; F1 Hub direto propaga para Série/Esportes. Os testes foram executados com `ROLLBACK`, sem alterar o histórico do usuário.
- Android permanece 1.0.20 / 10062, sem alteração nesta release Web.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado no runtime r462.

## 1.0.251 / r461 — owner efetivo das telas ainda reproduzidas — 2026-10-02

- Home Séries recebe preboot real: a view fica invisível antes do primeiro paint e só é revelada após localizar e ancorar em **Continuar assistindo**; o Histórico deixa de aparecer primeiro.
- Home Filmes deixa de depender do owner legado para a Watchlist: r461 pagina diretamente `cinetracker_home_movies_v405`, pinta os primeiros 120 itens e continua o restante em lotes delimitados.
- Descobrir > Pra Você recebe renderer próprio r461 sobre os seis pools v421; os sete slots têm linha de ações fora do card e **↻ Trocar** visível/funcional.
- Perfil volta a pintar os tempos pelos RPCs canônicos `cinetracker_profile_stats` e `cinetracker_sport_stats_v421`; listas deixam de ocultar/cortar cards e removem os limitadores sintéticos das releases anteriores.
- Fórmula 1: os cliques reais de episódio da Série e F1Hub são capturados diretamente pelo writer r423; o owner esportivo r422 é religado no final do bundle; progresso usa `cinetracker_f1_progress_v426`.
- Estado de produção validado antes da release: temporada F1 atual = 77 sessões liberadas, 75 assistidas no estado de Série; Watchlist e filtros v421 permanecem as autoridades atuais.
- Android permanece 1.0.20 / 10062.
- Runtime r461 não introduz reload global, observer contínuo, intervalo contínuo ou loop ilimitado.

## 1.0.250 / r460 — correção final Web dos cinco pontos reportados — 2026-10-02

- Home > Filmes: o clique em **Filmes** passa a ser a autoridade final depois dos handlers legados; a aba não retorna sozinha para Séries.
- Home > Filmes: a Watchlist v405 aguarda autenticação/owner e faz recuperação delimitada em até três tentativas, sem reload e sem congelar a main thread.
- Descobrir > Pra Você: recuperação finita do owner r457/v421, com até três tentativas delimitadas e validação explícita dos **7 botões Trocar**.
- Perfil: Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores ficam com exatamente **13 cards**; o 14º elemento é um botão **Ver mais** de meia largura dentro do próprio rail.
- Perfil > Histórico diário: clique no dia do gráfico abre diretamente o renderer r426, mantendo **↶ Desmarcar visto** em cada filme, episódio e evento esportivo.
- Fórmula 1: o progresso visível passa a ler somente `cinetracker_f1_progress_v426`; removida da entrada a reconciliação automática r423 que não deve ser necessária para apenas pintar o contador. Os writers r423 continuam sincronizando Série ↔ Esportes ↔ F1Hub e os dois tempos.
- Produção validada no banco antes do patch: temporada 2026 possui **77 sessões liberadas e 75 assistidas**; episódios 76 e 77 estão não assistidos.
- r460 parte da r458 para eliminar o listener de captura r459 que podia bloquear owners posteriores de Home/Pra Você.
- Android permanece 1.0.20 / 10062.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado no runtime r460.

## 1.0.249 / r459 — correção dura orientada pelo vídeo — 2026-10-02

- Home Séries recebe proteção de preboot: a view só é revelada quando **Continuar assistindo** existe e a posição é corrigida, eliminando a abertura no fim do Histórico.
- Home Filmes passa a ter owner de clique em captura: permanece em **Filmes**, zera o scroll e carrega a Watchlist por `cinetracker_home_movies_v405`, com uma única recuperação delimitada.
- Descobrir > Pra Você converge para o owner r457/v421, com um único retry delimitado e exigência de **7 botões Trocar** nos sete slots.
- Perfil limita exatamente **13 cards** em Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores; o 14º elemento é um **Ver mais** clicável com metade da largura do card.
- Histórico diário do Perfil reafirma o renderer r426 e o botão **↶ Desmarcar visto** em cada filme, episódio e evento esportivo.
- Fórmula 1 reconcilia o mapa/sincronização r423 antes de pintar o progresso autenticado r426; Série, Esportes e F1Hub continuam escrevendo o mesmo estado e contabilizando tempo nos dois domínios.
- Android permanece 1.0.20 / 10062.
- Sem full-page reload, `router.refresh()`, MutationObserver, setInterval ou loop ilimitado.

## 1.0.248 / r458 — finalização orientada pelo vídeo — 2026-10-02

- Corrige o ciclo recursivo de timers da aba Filmes introduzido na r457; a aba permanece em Filmes e chama a Watchlist v405 somente por verificações finitas.
- Home Séries zera a posição antiga imediatamente e converge para **Continuar assistindo** assim que o painel existe, sem restaurar o fim do Histórico.
- Descobrir > Pra Você reafirma de forma finita o owner r457 e exige **Trocar** visível nos 7 slots.
- Perfil mantém exatamente 13 cards + meio-card **Ver mais** nas cinco listas pedidas e preserva **Desmarcar visto** no histórico diário.
- Fórmula 1 repinta o progresso autenticado por `cinetracker_f1_progress_v426` e agenda a correção também ao abrir a série; sincronização Série ↔ Esportes ↔ F1Hub permanece preservada.
- Sem reload global, MutationObserver, setInterval ou loop ilimitado.

## 1.0.247 / r457 — estabilidade final de Home Filmes, Pra Você, Perfil e F1 — 2026-10-02

- Home > Filmes passa a manter a seleção de Filmes após os handlers legados e dispara a Watchlist v405 sem retornar sozinho para Séries.
- Descobrir > Pra Você passa a ter owner único r457 sobre os seis pools filtrados v421, com timeout ampliado e os sete slots sempre renderizando **Trocar** junto às ações corretas.
- Perfil reafirma exatamente 13 cards em Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores; o 14º elemento é o botão **Ver mais** de meia largura. O desfazer do histórico diário r426 é preservado.
- Fórmula 1 passa a pintar o progresso visível por `cinetracker_f1_progress_v426`, usando somente sessões efetivamente liberadas e assistidas; a sincronização Série ↔ Esportes ↔ F1Hub r423/r452 permanece intacta.
- Validação de produção confirmou no banco 77 sessões F1 liberadas em 2026 e 75 assistidas no estado atual, eliminando o 77/77 stale.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.246 / r456 — Watchlist, Pra Você e progresso F1 — 2026-10-02

- Home > Filmes usa diretamente `cinetracker_home_movies_v405`: primeira página de 120 itens aparece imediatamente e as demais páginas entram em lotes assíncronos delimitados, sem congelar a main thread.
- Descobrir > Pra Você usa os pools filtrados `cinetracker_discover_watch_unseen_v421` e `cinetracker_discover_fresh_v421` em paralelo; os sete slots exibem **Trocar** de forma estável.
- Mantidos os filtros rígidos já consolidados no v421 (curtas, YouTube/web, novelas, reality, stand-up, WWE e exclusões pessoais conforme o bloco).
- Fórmula 1 passa a repintar o progresso da temporada atual pela verdade canônica de `cinetracker_home_series_v452`, eliminando o 77/77 stale quando ainda existem sessões não vistas.
- Perfil r455 preservado: 13 cards por lista + meio-card **Ver mais** e **↶ Desmarcar visto** no histórico diário.
- Sem full-page reload, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.245 / r455 — Perfil: 13 cards, Ver mais e desfazer histórico — 2026-10-02

- Séries, Filmes, Séries Favoritas, Filmes Favoritos e Atores exibem exatamente 13 cards na visão resumida do Perfil.
- Quando existem mais itens, o 14º elemento visual é um botão **Ver mais** com metade da largura padrão do card (75 px sobre o card-base de 150 px) e a mesma altura visual do rail.
- O novo botão delega ao **Ver mais** nativo de cada seção; não expande dados por um caminho paralelo.
- O histórico diário aberto pelo gráfico reafirma o renderer r426, exibindo **↶ Desmarcar visto** em cada filme, episódio e evento esportivo.
- Desmarcar remove somente o item exato e dispara atualização local por `cinetracker:data-changed`, sem full-page reload.
- Home, Descobrir, Esportes, Fórmula 1 e Android permanecem inalterados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado no runtime r455.

## 1.0.244 / r454 — Recuperação da tela preta no boot — 2026-10-02

- Corrigida a tela preta introduzida pela r453.
- A r454 volta a montar diretamente sobre a r452 estável e remove somente os disparos automáticos do verificador de release, sem apagar blocos inteiros do runtime.
- `checkRelease161`, `globalSearch` e todo o restante do código entre essas rotinas permanecem intactos; o patch destrutivo da r453 foi eliminado.
- `location.replace(...ct_refresh...)` foi substituído por atualização de URL via History API, sem recarregar a página.
- Fórmula 1 r452, Home, Descobrir, Perfil e Esportes permanecem funcionalmente inalterados.
- Adicionado gate para impedir remoção destrutiva de runtime e smoke real de produção com Chromium verificando conteúdo visível e erros fatais de JavaScript.
- Android permanece 1.0.20 / 10062.

## 1.0.243 / r453 — Correção exclusiva do refresh/pisca automático — 2026-10-02

- Corrigida somente a causa do recarregamento/pisca cíclico da página.
- O verificador legado `checkRelease161` não executa mais `location.replace(...ct_refresh...)` após o boot.
- Removidos exclusivamente os gatilhos automáticos desse verificador em foco, visibilidade, navegação e timer de boot.
- Nenhuma regra de Home, Descobrir, Perfil, Fórmula 1, Esportes, recomendações ou Android foi alterada.
- Mantidas as proibições de `window.location.reload()` e `router.refresh()`.

## 1.0.242 / r452 — Fórmula 1 como Série + Esporte — 2026-10-02

- Removida a regra incorreta de 1.280 episódios liberados da Fórmula 1 na Home.
- A Home passa a usar somente o mapa canônico da temporada atual em `f1_episode_map_v423`: total da temporada, sessões já exibidas, assistidas e próxima sessão disponível.
- Fórmula 1 entra em `Continuar assistindo` somente quando existe sessão atual já exibida e ainda não vista; sem sessão pendente, fica em `Em dia`.
- Toda marcação de episódio F1 em Séries passa a espelhar no histórico esportivo por trigger de banco, preservando a contagem de tempo em Séries e Esportes.
- Backfill executado para reparar divergências históricas entre `episode_progress` e `user_sport_watch_history`.
- Escopo restrito à Fórmula 1 Web; Descobrir, Perfil, demais séries/esportes e Android preservados.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou loop ilimitado.

## 1.0.241 / r451 — URL canônica sem ct_refresh — 2026-10-02

- Removido `ct_refresh` da URL antes do boot da aplicação com `history.replaceState`, sem recarregar a página.
- `history.pushState` e `history.replaceState` passam a eliminar somente `ct_refresh` de futuras navegações internas, preservando qualquer outro parâmetro e hash.
- Corrigida a regressão da r450, que partiu da base r444 e deixou de carregar a proteção já existente na r445.
- Removido o workflow temporário `activate-web-r450.yml`, que poderia reativar a r450 em pushes posteriores.
- Nenhum `window.location.reload()`, `router.refresh()`, polling, `setInterval` ou `MutationObserver` adicionado.

## 1.0.240 / r450 — Descobrir > Pra Você — 2026-10-02

- Escopo exclusivo em Descobrir > Pra Você.

- Build parte da base limpa r444 e aplica somente o owner RPC-first novo.

- Diário e 100% Novos: Watchlist + Visto + Trocar.

- Da sua Watchlist: Visto + Trocar, sem botão Watchlist cinza.

- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.

## 1.0.239 / r448 — Bloqueio do refresh automático periódico — 2026-10-02

- Desativados exclusivamente os schedulers automáticos legados de Pra Você em r420, r421 e r426, que reentravam na tela em aproximadamente 1,5–1,8 s.
- Mantidos os disparos manuais, ações dos cards, RPCs, renderer, Watchlist, Visto e Trocar.
- Nenhuma alteração em Home, Perfil, Esportes, F1, Android ou regras de recomendação.
- Build: apps/web/build-r448.mjs; regressão: apps/web/test-r448.mjs.

## 1.0.238 / r447 — Bloqueio do refresh automático — 2026-10-02

- Bloqueadas somente as rotinas automáticas legadas de reentrada de Pra Você em r426/r427/r428.
- Mantida a remoção da renderização automática causada pelo evento `online`.
- Nenhuma ação manual, renderer, botão, RPC, Home, Perfil, Esportes, F1 ou Android foi alterado.
- Build: `apps/web/build-r447.mjs`; regressão: `apps/web/test-r447.mjs`.

## 1.0.237 / r446 — Bloqueio de refresh automático — 2026-10-02

- Removida exclusivamente a chamada automática de `render()` disparada pelo evento `online`.
- Isso impede que eventos repetidos de conectividade reinicializem a tela durante o uso/teste.
- Nenhuma lógica de Descobrir > Pra Você, Home, Perfil, Esportes, F1, Supabase ou Android foi alterada.
- Mantidos os bloqueios existentes de `window.location.reload()`, `router.refresh()`, `setInterval` e loops infinitos.
- Build: `apps/web/build-r446.mjs`; regressão: `apps/web/test-r446.mjs`.

## 1.0.236 / r445 — Descobrir > Pra Você — 2026-10-02

- Eliminada a reentrada concorrente do loader de Pra Você: somente uma execução de buildForYou pode estar ativa por vez.
- Chamadas automáticas repetidas durante a mesma montagem são coalescidas; nova montagem automática fica bloqueada por 15 segundos.
- O estado e o DOM de Pra Você deixam de ser reconstruídos por chamadas concorrentes.
- O parâmetro externo ct_refresh é removido com history.replaceState, sem recarregar a página.
- Trocar, Watchlist e Visto permanecem sob a autoridade r309.
- Escopo exclusivo em Descobrir > Pra Você; Home, Perfil, Esportes, F1 e Android preservados.

Build: apps/web/build-r445.mjs; gate: apps/web/build-r445-official.mjs; regressão: apps/web/test-r445.mjs.

## 1.0.235 / r444 — Descobrir > Pra Você — 2026-10-02

- Criado build r444 limpo, partindo diretamente do r437 e usando versões explícitas.
- Removidos owners legados r395–r403 e r406–r410 do bundle final.
- Desativados os reparos automáticos de Pra Você dos r412–r415, r417 e r418.
- r309/r432 permanece como único renderer ativo de Pra Você, incluindo Trocar, Watchlist e Visto.
- Nenhuma alteração funcional em Home, Perfil, Esportes, F1 ou Android.

Build: apps/web/build-r444.mjs; gate: apps/web/build-r444-official.mjs; regressão: apps/web/test-r444.mjs.

## 1.0.234 / r443 — Descobrir > Pra Você — 2026-10-02

- Removidos os patches de `isFY` de r416/r426; ambos dependiam do owner r411, que já não existe no bundle final.
- Mantidos os cortes efetivos dos owners r395–r403 e r406–r410 e as barreiras r412–r415/r417/r418.
- r309/r432 continua como único renderer ativo de Pra Você, com Trocar, Watchlist e Visto.

Build: apps/web/build-r443.mjs; gate: apps/web/build-r443-official.mjs; regressão: apps/web/test-r443.mjs.

## 1.0.233 / r442 — Descobrir > Pra Você — 2026-10-02

- Tornada robusta a identificação dos runtimes r412–r418/r426 durante a montagem do bundle.
- O corte dos owners legados permanece exclusivo de Pra Você.
- r309/r432 continua como único renderer ativo, incluindo Trocar, Watchlist e Visto.

Build: apps/web/build-r442.mjs; gate: apps/web/build-r442-official.mjs; regressão: apps/web/test-r442.mjs.

## 1.0.232 / r441 — Descobrir > Pra Você — 2026-10-02

- Removido o patch textual frágil do click handler r404; ele não era necessário porque a autoridade local isForYou=false já impede qualquer carregamento legado.
- r309/r432 permanece como único renderer ativo de Pra Você.
- Trocar, Watchlist e Visto permanecem no owner r309.
- Escopo exclusivo em Pra Você; demais áreas preservadas.

Build: apps/web/build-r441.mjs; gate: apps/web/build-r441-official.mjs; regressão: apps/web/test-r441.mjs.

## 1.0.231 / r440 — Descobrir > Pra Você — 2026-10-02

- Corrigidos os identificadores reais dos runtimes r412–r418 na montagem do bundle.
- O corte dos owners r395–r403 e r406–r410 permanece.
- As rotinas de reparo automático r412–r418/r426 continuam impedidas de reconstruir Pra Você.
- r309/r432 permanece como único renderer ativo, incluindo **Trocar**, Watchlist e Visto.
- Nenhuma alteração funcional em Home, Perfil, Esportes, F1 ou Android.

Build: apps/web/build-r440.mjs; gate: apps/web/build-r440-official.mjs; regressão: apps/web/test-r440.mjs.

## 1.0.230 / r439 — Descobrir > Pra Você — 2026-10-02

- Corrigida a montagem da correção r438: o bundle base já não continha o marcador r411, então a faixa de remoção agora termina corretamente em r412.
- Mantido o corte dos owners legados r395–r403 e r406–r410.
- Mantidas as barreiras contra repaint automático dos runtimes r412–r418 e r426.
- r309/r432 permanece como único renderer ativo de Pra Você.
- **Trocar**, Watchlist e Visto permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**.

Build: apps/web/build-r439.mjs; gate: apps/web/build-r439-official.mjs; regressão: apps/web/test-r439.mjs.

## 1.0.229 / r438 — Descobrir > Pra Você — 2026-10-02

- Corrigido o ciclo de repintura/recarregamento visual que fazia a tela de **Pra Você** reiniciar aproximadamente a cada 2 segundos.
- Removidos do bundle final os owners legados r395–r403 e r406–r410, que continuavam reentrando no carregamento/renderização do Pra Você.
- Desativadas as rotinas automáticas de reparo de Pra Você dos runtimes r412–r418 e r426; elas não alteram mais o DOM dessa aba.
- r404/r405 permanecem somente como autoridades de Home; o bridge de Pra Você delega diretamente ao r309.
- r309/r432 permanece como único renderer/owner ativo de Pra Você.
- **Trocar**, **+ Watchlist** e **✓ Visto** continuam no renderer r309.
- Escopo exclusivo: **Descobrir > Pra Você**; Home, Perfil, Esportes, F1 e Android preservados.

Build: apps/web/build-r438.mjs; gate: apps/web/build-r438-official.mjs; regressão: apps/web/test-r438.mjs.

## 1.0.228 / r437 — Descobrir > Pra Você — 2026-10-02

- Corrigido o **pisca/recarregamento visual** durante a montagem de Pra Você.
- `paintForYou()` agora é idempotente: se as sete recomendações não mudaram, o DOM não é recriado.
- O placeholder de carregamento não é reinserido por chamadas concorrentes antigas.
- O token de geração existente continua cancelando respostas obsoletas, sem adicionar loop ou observer.
- **↻ Trocar**, **+ Watchlist** e **✓ Visto** permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.

Build: apps/web/build-r437.mjs; gate: apps/web/build-r437-official.mjs; regressão: apps/web/test-r437.mjs.

## 1.0.227 / r436 — Descobrir > Pra Você — 2026-10-02

- Corrigido o efeito de **piscando/recarregando** ao abrir **Pra Você**.
- A montagem das recomendações agora usa **single-flight**: chamadas simultâneas compartilham a mesma execução e não recriam a tela várias vezes.
- paintForYou deixa de substituir o DOM quando o conteúdo não mudou, preservando cards, botões e estado visual.
- **↻ Trocar**, **+ Watchlist** e **✓ Visto** permanecem no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.
- Sem full-page reload, router.refresh(), MutationObserver, setInterval ou loop infinito.

Build: apps/web/build-r436.mjs; gate: apps/web/build-r436-official.mjs; regressão: apps/web/test-r436.mjs.

## 1.0.226 / r435 — Descobrir > Pra Você — 2026-10-02

- Corrigida a tela preta do **Pra Você** causada pelo proxy que tratava `__ctR288R263.discover263` como uma propriedade literal com ponto no nome.
- O renderer r309 agora recebe e altera o objeto real `window.__ctR288R263.discover263`.
- Exposto um bridge estável `window.__ctR309Api` para o owner do Pra Você durante o boot, evitando dependência de estado intermediário do marcador r309.
- Cards, filtros, Watchlist, Visto e **↻ Trocar** continuam no renderer r309; nenhuma regra de recomendação foi alterada.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.
- Sem full-page reload, `router.refresh()`, `MutationObserver`, `setInterval` ou loop infinito.

Build: `apps/web/build-r435.mjs`; gate: `apps/web/build-r435-official.mjs`; regressão: `apps/web/test-r435.mjs`.

## 1.0.225 / r434 — Descobrir > Pra Você — 2026-10-02

- Corrigido exclusivamente o primeiro clique em Pra Você, que ainda podia cair no owner legado antes de discover263.tab ser definido.
- O runtime r434 intercepta a entrada da aba no capture phase, define discover.tab = 'foryou' e discover.type = 'all' antes de chamar o renderer r309.
- O mesmo owner r309 continua responsável pelos cards e pelas ações Watchlist, Visto e ↻ Trocar.
- Incluídas variantes de seletor da aba para cobrir o DOM real servido no Web sem alterar as demais abas.
- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.
- Escopo exclusivo: Descobrir > Pra Você. Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem inalterados.

Build: apps/web/build-r434.mjs; gate: apps/web/build-r434-official.mjs; regressão: apps/web/test-r434.mjs.

## 1.0.224 / r433 — Descobrir > Pra Você — 2026-10-01

- Corrigida a tela preta introduzida no r432.
- Causa: o renderer r309 capturava `discover263` antes do boot, quando o objeto ainda não existia, e permanecia com esse estado vazio durante toda a sessão.
- r433 passa a resolver `discover263`, os hooks de RPC e os owners auxiliares dinamicamente após o boot, preservando o mesmo renderer e as mesmas ações.
- **Trocar**, **Watchlist** e **Visto** continuam exclusivamente no owner r309.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.
- Sem full-page reload, router.refresh, MutationObserver, setInterval ou loop infinito.

Build: `apps/web/build-r433.mjs`; gate: `apps/web/build-r433-official.mjs`; regressão: `apps/web/test-r433.mjs`.

## 1.0.223 / r432 — Descobrir > Pra Você — 2026-10-01

- Corrigido o ciclo que fazia Pra Você reconstruir os cards repetidamente.
- Removido do bundle o runtime r386 obsoleto que podia reiniciar a aplicação.
- Removidos os owners legados r395/r396.
- Runtimes r397/r403/r404/r406/r407/r408 deixam de disputar o renderer do Pra Você.
- Eventos `cinetracker:data-changed` e `online` são bloqueados durante Pra Você para impedir repaints automáticos.
- **r309 é o único renderer efetivo:** cards, Watchlist, Visto e **↻ Trocar** permanecem no mesmo owner.
- Escopo exclusivo: **Descobrir > Pra Você**; demais áreas preservadas.
- Android permanece inalterado.

Build: `apps/web/build-r432.mjs`; gate: `apps/web/build-r432-official.mjs`; regressão: `apps/web/test-r432.mjs`.

## 1.0.222 / r431 — Descobrir > Pra Você — 2026-10-01

- Corrigido o carregamento preso em **“Montando recomendações…” / “Buscando indicação…”**: a montagem não espera mais `loadRecent296`.
- Removidos gatilhos automáticos de `cinetracker:data-changed` e `online` que reconstruíam o Pra Você sem ação do usuário.
- O clique da aba Pra Você interrompe owners legados posteriores antes que repintem o bloco.
- **Trocar** continua no renderer único r309 e altera somente o slot selecionado.
- Sem full-page reload, `router.refresh()`, `setInterval`, `MutationObserver` ou loop de recuperação.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.
- Android permanece **1.0.20 / versionCode 10062**.

Build: `apps/web/build-r431.mjs`; gate: `apps/web/build-r431-official.mjs`; regressão: `apps/web/test-r431.mjs`.

## 1.0.221 / r430 — Descobrir > Pra Você — 2026-10-01

- **Descobrir > Pra Você** passa a ter um único renderer real: r309.
- r411 deixa de participar do bundle final; ele não pode mais sobrescrever os cards, ações ou estado do Pra Você.
- r427/r428/r429 deixam de participar do bundle final como recovery owners.
- **Trocar**, **Visto** e **Watchlist** voltam a ser renderizados pelo mesmo renderer que carrega os dados, eliminando cards com ações cinzas ou sem Trocar.
- O carregamento usa as três categorias reais de Pra Você — Filme, Série e Anime — e preserva os blocos Indicação do Dia, Da sua Watchlist e 100% novos.
- Removida a cadeia de recuperação periódica responsável pelas repinturas repetidas.
- Não há reload de página, router.refresh, setInterval, MutationObserver ou loop de recuperação no novo owner.
- Escopo exclusivo: **Descobrir > Pra Você**. Home, Perfil, Esportes, Top 10, Configurações e Android permanecem inalterados.

## 1.0.220 / r429 — Descobrir > Pra Você — 2026-10-01

- r411 passa a ser o único owner ativo do Pra Você.
- Removidos do build os recovery owners r427/r428 que provocavam repaints/reinicializações sucessivas.
- Eliminado o ciclo que fazia a URL avançar em `?ct_refresh=` e reiniciava a tela.
- Mantidas as ações nativas Watchlist, Visto e Trocar do renderer r411.
- Home, Perfil, Esportes e Android permanecem inalterados.

## 1.0.219 — r428 (2026-10-01)

### Fixed
- **Descobrir > Pra Você:** o r428 passa a ser dono da composição visível do bloco, em vez de apenas reativar botões que já existiam.
- Quando o renderer legado recria um slot, o r428 recompõe a linha de ações correspondente: **Watchlist + Visto + Trocar** nos blocos novos e **Visto + Trocar** na Watchlist.
- **Trocar** usa os atributos nativos data-ct388-action/data-ct388-slot e delega ao handler r388 existente, mantendo a troca somente no slot clicado.
- Cards ausentes acionam o loader/renderizador r388 do próprio Pra Você antes da normalização das ações.
- Botões cinza/desabilitados são reativados no DOM visível sem reload de página, MutationObserver, setInterval ou loop ilimitado.

- Vercel: o commit final r428 recebeu status **success** para o deploy Web.

### Scope
- Web: exclusivamente **Descobrir > Pra Você**.
- Home, Perfil, Esportes, Top 10, Configurações, Supabase e Android permanecem fora do escopo.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.218 — r427 (2026-10-01)

### Fixed
- **Descobrir > Pra Você:** corrigida a causa do renderer errado continuar vencendo no aparelho.
- O r427 reconhece explicitamente o DOM real do renderer **r388**, além dos owners r411/r336/r288.
- Quando o r388 é o owner visível, seu loader `__ctR388LoadForYou` é recuperado para repintar os cards reais de Pra Você.
- Os botões nativos `data-ct388-action="swap"` são reconhecidos e reativados sem substituir o handler nativo de **↻ Trocar**.
- **Trocar** deixa de ficar cinza/desabilitado: remove `disabled`, `hidden` e `inert`, forçando visibilidade e interação apenas no escopo de Pra Você.
- A correção usa apenas tentativas temporizadas e delimitadas; não cria MutationObserver, setInterval, loop infinito, reload de página ou router.refresh.

### Scope
- Web: exclusivamente **Descobrir > Pra Você**.
- Home, Perfil, Esportes, Top 10, Configurações, backend e Android permanecem fora do escopo.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.217 — r426 (2026-10-01)

### Fixed
- Perfil > Histórico diário usa uma RPC direta e oferece **↶ Desmarcar visto** por filme, episódio e evento esportivo.
- Descobrir > Pra Você passa a ter um único owner de clique para **Trocar**, reaplicado em passagens finitas após paints e navegação.
- Perfil deixa de aceitar repaints concorrentes das estatísticas esportivas no evento de sincronização; r424 fica como autoridade canônica.
- Fórmula 1 passa a exibir **vistos / episódios já exibidos** da temporada corrente; o denominador não é derivado da quantidade de vistos/importados.

### Banco
- `cinetracker_activity_items_by_day_v426`
- `cinetracker_unmark_history_item_v426`
- `cinetracker_unmark_sport_history_v426`
- `cinetracker_f1_progress_v426`

### Scope
- Web: Perfil, Histórico diário, Descobrir > Pra Você e Fórmula 1.
- Android permanece **1.0.20 / versionCode 10062**.

## 1.0.216 — r425 (2026-10-01)

### Fixed
- Home > Séries deixa de ocultar a tela inteira enquanto aguarda os dados.
- Fórmula 1 (media_id=865) passa a usar 1.280 sessões importadas de 2015-2026; os 77 vistos deixam 1.203 restantes.
- Descobrir > Pra Você deixa de disparar repaint global ao marcar Visto ou Watchlist; somente o slot acionado é removido e substituído.
- Aliases legados de estatísticas esportivas no Perfil convergem para cinetracker_sport_stats_v421.
- Sem full-page reload, MutationObserver, setInterval ou loop ilimitado.

### Scope
- Home, F1, Pra Você e Perfil Web.
- Android permanece **1.0.20 / 10062**.

## 1.0.215 — r424 (2026-10-01)

### Fixed
- Home > Séries deixa de iniciar visualmente no fim do Histórico: a entrada da aba segura a primeira pintura antiga, busca a autoridade atual e revela a tela já posicionada em Assistir a seguir.
- Fórmula 1 (media_id=865) passa a obedecer a semântica de série na Home; quando existe próximo episódio não visto, entra em **Assistir a seguir**. Raw e SmackDown recorrentes recebem a mesma correção.
- Perfil passa a repintar os tempos a partir de cinetracker_profile_stats e os tempos esportivos a partir de cinetracker_sport_stats_v421 após entrada e alterações de dados. O tempo das sessões F1 já persistido nos dois domínios volta a aparecer nos dois contabilizadores.
- Listas de Séries e Filmes no Perfil deixam de usar arraste horizontal: os cards quebram em múltiplas linhas, permanecem inteiros e listas longas exibem **Ver mais**.
- Sem full-page reload, MutationObserver, setInterval ou loop ilimitado.

### Scope
- Android permanece **1.0.20 / 10062**.
- Descobrir, Top 10, Esportes fora da sincronização F1 e demais áreas visuais não tiveram alterações nesta r424.

## 1.0.214 — r423 (2026-10-01)

### Fixed
- Corrigida a causa real da Fórmula 1 não sincronizar: os handlers lexicais efetivamente usados pela Série, Esportes e F1 Hub agora delegam diretamente para r423, sem depender de reatribuições tardias de funções.
- Marcar/desmarcar uma sessão F1 em qualquer uma das três superfícies persiste o mesmo episódio da série media_id=865 e o mesmo evento no histórico esportivo.
- O fluxo real de Esportes r255 deixa de passar por um RPC legado inexistente para F1 e sincroniza pelo writer canônico.
- O mapa f1_episode_map_v423 mantém temporada, rodada, tipo de sessão e número de episódio alinhados; a reconciliação da temporada atual repara estados antigos divergentes sem duplicar play events já existentes.
- Optimistic UI/rollback preservados; sem reload global, observer contínuo, intervalo agressivo ou loop ilimitado.

### Accounting
- Cada sessão F1 assistida contabiliza o runtime em **Séries** e também em **Esportes**, conforme solicitado.

### Scope
- Perfil, Descobrir, Home fora da invalidação de dados F1, demais esportes e Android não tiveram regra visual ou funcional alterada.
- Android permanece **1.0.20 / 10062**.
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

## Web 1.0.208 / r417 — 2026-10-01

### Corrigido
- **Home > Séries:** o canvas fica oculto até a geometria final de **Assistir a seguir** e a altura total da Home permanecerem estáveis; o alinhamento é reaplicado de forma finita após a revelação, eliminando a abertura no fim do Histórico e o salto tardio.
- **Descobrir > Pra Você:** a correção atua na linha de ações realmente visível, independentemente do painter legado que venceu. Os sete slots populados recebem **↻ Trocar** funcional; Diário/100% Novos mantêm **+ Watchlist + ✓ Visto + ↻ Trocar** e Da sua Watchlist mantém **✓ Visto + ↻ Trocar**.
- **Perfil:** sem alteração visual. **Tempo assistido** e **Eventos assistidos** de Esportes passam a ser repostos pela autoridade `cinetracker_sport_stats_v1`; produção possui 86 registros / 11.490 minutos e não pode mais ser sobrescrita por payload legado zerado.
- **Fórmula 1:** `media_id=865` é reafirmada como série. Marcar uma sessão atualiza o card e o contador imediatamente, persiste por `cinetracker_mark_watch_v0994` como episódio e só depois faz o espelho opcional da sessão F1.
- Mantidos Optimistic UI, rollback em falha, timers finitos e ausência de `MutationObserver` novo, `setInterval`, loop ilimitado ou full-page reload.
- Android preservado em **1.0.20 / 10062**.

## Web 1.0.207 / r416 — 2026-10-01

### Corrigido
- **Perfil:** preservado o renderer visual aprovado; um snapshot persistente por usuário é pintado imediatamente e `cinetracker_profile_v380` atualiza os dados em segundo plano, reduzindo o loading longo sem mudar layout, cards ou ordem.
- **Descobrir > Pra Você:** a r411 volta a ser a autoridade final do DOM visível. Os sete slots populados usam os botões nativos da r411, incluindo **↻ Trocar**; painters legados deixam de ser a última pintura da aba.
- **Fórmula 1 como série:** a marcação de sessão/episódio passa a ser otimista e imediata, persiste em `cinetracker_mark_watch_v0994` como episódio da série importada `media_id=865`, envia a quantidade de episódios já exibidos para o estado Em dia/Em progresso e espelha a sessão em `cinetracker_f1_session_watch_set_v314`.
- A marcação da F1 invalida Home/Perfil por evento local e reconcilia o estado em segundo plano, sem full-page reload.
- Sem novo `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()`.

## Web 1.0.206 / r415 — 2026-09-30

### Corrigido
- **Home > Séries:** a tela permanece visualmente bloqueada enquanto o Histórico e a seção **Assistir a seguir** estabilizam; só então alinha e revela a Home, eliminando o primeiro paint no fim do Histórico e o salto posterior.
- **Descobrir > Pra Você:** o reparo deixa de depender de wrappers/slots específicos e atua na linha de ações realmente visível. Os sete slots populados recebem **↻ Trocar**: Diário e 100% Novos ficam com **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist fica com **✓ Visto + ↻ Trocar**.
- **Perfil:** o visual aprovado permanece intacto, mas o carregamento passa a ter owner único, cache-first e uma única chamada principal a `cinetracker_profile_v380`; os RPCs legados pesados `cinetracker_profile_payload_v0997`, `cinetracker_profile_media_dashboard_v0991` e `cinetracker_profile_quick_stats_v1` não fazem parte do novo caminho de entrada.
- Enriquecimento esportivo do Perfil é assíncrono e delimitado, sem bloquear o primeiro paint.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver` novo, `setInterval` ou loop ilimitado.

## Web 1.0.205 / r414 — 2026-09-30

### Corrigido
- Corrigido exclusivamente o desaparecimento do botão **↻ Trocar** em `Descobrir > Pra Você`.
- O runtime identifica os sete slots visíveis mesmo quando um painter legado recria o DOM sem o terceiro/segundo botão.
- Indicação do Dia e 100% Novos recebem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist recebe **✓ Visto + ↻ Trocar**.
- O botão é reativado de forma finita após paints conhecidos e delega a troca ao owner r411, sem `MutationObserver`, `setInterval`, loop ilimitado ou full-page reload.
- Nenhuma regra de Home, recomendações, filtros, Reality, Perfil, Esportes, Top 10, backend ou Android foi alterada.

## [1.0.204] - 2026-09-30

### Added
- Bloqueio global de **Reality / Reality TV (TMDB 10764)** em recomendações e descoberta, preservando os filtros r412 de curta-metragem abaixo de 40 min, YouTube/web originals, novelas/Soap, WWE, vistos e Watchlist.
- Novas autoridades Supabase `cinetracker_recommendation_eligible_v413`, `cinetracker_discover_fresh_v413`, `cinetracker_discover_watch_unseen_v413` e `cinetracker_home_series_v413`.

### Fixed
- Home Séries não exibe mais o fim do Histórico antes de saltar para **Assistir a seguir**: o canvas da Home fica oculto somente durante o alinhamento inicial e é revelado já na posição correta.
- `Descobrir > Pra Você` reafirma r411 como owner final e recompõe de forma delimitada os botões **↻ Trocar** ausentes; Diário/100% Novos = **+ Watchlist / ✓ Visto / ↻ Trocar** e Da sua Watchlist = **✓ Visto / ↻ Trocar**.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados passam pela elegibilidade r413 com substituição ordenada do candidato bloqueado.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou laços ilimitados.

## [1.0.203] - 2026-09-30

### Added
- Regra global de elegibilidade r412 para recomendações e descoberta: filmes, animações em formato de filme e especiais com runtime conhecido inferior a **40 minutos** são descartados antes do paint.
- Bloqueio de produções vinculadas a **YouTube, YouTube Originals, YouTube Premium/Red**, web series, web videos e vlogs por network, produtora, homepage e keywords.
- Bloqueio de **novelas / telenovelas / Soap** por gênero TMDB 10766, gênero textual e media kind.
- Novas autoridades Supabase `cinetracker_recommendation_eligible_v412`, `cinetracker_discover_fresh_v412`, `cinetracker_discover_watch_unseen_v412` e `cinetracker_home_series_v412`.
- Substituição dinâmica e delimitada: candidatos inválidos são pulados e o próximo candidato elegível é escolhido sem recursão ou loop infinito.

### Fixed
- `Descobrir > Pra Você` usa os pools estritos v412 e mantém os **7 botões ↻ Trocar** visíveis/ativos: Diário, 3 slots da Watchlist e 3 slots de 100% Novos.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados passam pela mesma elegibilidade antes do paint, preservando exclusões de vistos/Watchlist/WWE já existentes.
- Home Séries passa pela autoridade v412 sem remover Raw/SmackDown do acompanhamento de episódios.
- Sem `window.location.reload()`, `router.refresh()`, `MutationObserver`, `setInterval` ou laços ilimitados.

## [1.0.202] - 2026-09-30

### Fixed
- Escopo exclusivo em **Descobrir > Pra Você**.
- Removido do caminho ativo o RPC composto `cinetracker_discover_foryou_v396`, que no aparelho real estava retornando HTTP 500 por `statement timeout`.
- Os seis pools de Filme/Série/Anime passam a carregar diretamente e em paralelo por `cinetracker_discover_watch_unseen_v396` e `cinetracker_discover_fresh_v387`.
- Timeout do cliente passa de 4,5 s para 12 s por pool; o paint é progressivo e aceita respostas parciais sem deixar a tela em "Recomendações indisponíveis".
- Loaders legados r396-r410 delegam antes de executar seus próprios caminhos, impedindo repaints/erros antigos de retomarem a tela.
- Indicação do Dia e 100% Novos exibem **+ Watchlist / ✓ Visto / ↻ Trocar**; Da sua Watchlist exibe **✓ Visto / ↻ Trocar**.
- `Trocar` permanece local, delimitado e sem recursão; Visto/Watchlist continuam otimistas e sem full-page reload.
- Home, Séries, Perfil, Esportes, Top 10, Configurações, backend e Android não foram alterados.

## [1.0.201] - 2026-09-29

### Fixed
- Escopo exclusivo em **Descobrir > Pra Você**.
- Corrigido o owner real r319: `loadForYou319` e o caminho `loadDiscover319('foryou')` delegam antes de chamar o builder legado r309.
- `buildForYou` e painter r309 deixam de poder sobrescrever o renderer atual depois que os cards aparecem; o painter r288 já não existe no bundle final.
- Os 7 slots usam ações completas e ativas: **+ Watchlist / ✓ Visto / ↻ Trocar** no Diário/100% Novos e **✓ Visto / ↻ Trocar** na Watchlist.
- Botões deixam de herdar apresentação cinza/inativa: passam a usar `chip ct410-action`, sem `disabled`, `inert` ou bloqueio de pointer.
- Mantido o payload canônico v396 e fallback v396/v387; nenhuma mudança de banco foi necessária.
- Nenhuma alteração em Home, Séries, Perfil, Esportes, Top 10, Configurações ou Android.
- Sem `window.location.reload()`, `router.refresh()`, observer novo, `setInterval` ou loop ilimitado.

## [1.0.200] - 2026-09-29

### Fixed
- Home não abre mais no fim do Histórico; Séries e Filmes alinham na seção principal somente após o paint real.
- Marcação de episódio como assistido atualiza imediatamente Histórico, contador, bucket e próximo episódio antes da confirmação do servidor.
- Reconciliação pós-persistência usa as autoridades existentes da Home sem full-page reload e restaura o estado local em caso de falha.
- Descobrir > Pra Você ganhou owner único r409, fallback paralelo delimitado e proteção contra painters legados sobrescreverem os cards.
- Botões completos restaurados: **+ Watchlist / Visto / Trocar** nos slots diário e 100% novos; **Visto / Trocar** nos slots da Watchlist.
- Mantidas as autoridades r406 para Séries e r405 para paginação da Watchlist de Filmes.
- Sem MutationObserver global, setInterval agressivo, recursão não delimitada ou reload de página.

## Web 1.0.199 / r408 — 2026-09-29

### Home
- Entrada e retorno alinham uma única vez o bloco real **Assistir a seguir** depois que ele existe no DOM; o Histórico permanece acima e deixa de ocupar a viewport.
- O alinhamento é absoluto, finito e cancelado por interação manual, eliminando a disputa que devolvia a Home ao fim do Histórico.
- Filmes chama diretamente o loader r406/v405 após ativar a semi-aba, garantindo o primeiro paint da Watchlist sem depender de estado legado.

### Descobrir / Pra Você
- Owner final sobre `cinetracker_discover_foryou_v396`. Indicação do Dia e 100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Verificação finita recupera o renderer final caso um painter legado tardio tente remover **Trocar**.
- Ações seguem otimistas e com trava por slot, sem reload.

### Estabilidade
- Sem MutationObserver global, setInterval, loop ilimitado, window.location.reload() ou router.refresh().
- Perfil, Esportes, Top 10, Configurações, regras de Séries e Android não foram alterados.

## Web 1.0.198 / r407 — 2026-09-29

### Home
- Corrige a entrada e a reentrada que ficavam no final do Histórico: a restauração automática de scroll do navegador fica em modo manual e os owners r374/r393/r404 delegam para uma única âncora semântica em **Assistir a seguir**.
- O clique capturado de Séries/Filmes na r374 agora entrega a navegação ao owner vivo depois de trocar a aba. Em **Filmes**, o loader r406/v405 é disparado imediatamente, eliminando a Watchlist vazia até repaint tardio.
- Regras e dados de Séries da r406 são preservados; esta release não muda classificação nem cálculo de episódios.

### Descobrir / Pra Você
- `cinetracker_discover_foryou_v396` passa a ser consumido por um único owner final, com prefetch em segundo plano depois da Home estabilizar.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + ✓ Visto + ↻ Trocar**; Da sua Watchlist exibe **✓ Visto + ↻ Trocar**.
- Closures tardios r404/r406 delegam ao r407 e deixam de apagar o botão **Trocar** depois que os cards aparecem.
- Ações usam estado local otimista e trava por slot, sem recarregar a página.

### Estabilidade
- Removidos bursts tardios de ownership de até 46 segundos; permanecem somente timers curtos e delimitados.
- Sem `MutationObserver` global, `setInterval`, loop infinito, `window.location.reload()` ou `router.refresh()`.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

## 1.0.197 — r406

### Corrigido
- Contagem de episódios disponíveis restaurada para a autoridade de episódios recentes; removida a sobrescrita r404 que transformava backlog histórico de Raw/SmackDown em `available_episodes`.
- Raw e SmackDown com episódio recente liberado e não visto passam para **Assistir a seguir**.
- Home > Filmes deixa de esvaziar a Watchlist quando o estado legado da aba diverge da view visível.
- Descobrir > Pra Você completa os botões ausentes em todos os sete slots.
- Renderização continua em lotes via `requestAnimationFrame` e timers são finitos; sem full page reload.

## Web 1.0.196 / r405 — 2026-09-29

### Home / Filmes
- O vídeo real da r404 confirmou que **Assistir a seguir / Watchlist** permanecia em `Carregando Watchlist…`.
- Os logs de produção mostraram o clique real executando `cinetracker_home_movies_v393` com HTTP 200, sem chegar ao loader paginado r404.
- A causa foi localizada no closure legado r388: `media_id` é UUID, mas o renderer aplicava `Number(media_id)`; o resultado virava zero e todos os filmes válidos eram descartados.
- O closure real `loadMovies` da r388 agora delega imediatamente para r405, eliminando esse filtro inválido e a disputa de autoridade.
- `cinetracker_home_movies_v405` implementa paginação SQL real com `LIMIT/OFFSET`, sem materializar primeiro o JSON completo da v402.
- Produção validada com **1.381 filmes**; primeira página = **120**, segunda página = **120**.
- O índice existente `idx_media_overrides_profile_state_updated_r274` é reutilizado; nenhum índice redundante foi criado.

### Descobrir / Pra Você
- O vídeo real confirmou cards visíveis sem o botão **Trocar**.
- Os logs mostraram o caminho legado ainda ativo (`shown_recommendations_v296`, `watchlist_full_v119`, `discover_filter_v333`) ao mesmo tempo em que a autoridade nova também carregava.
- Os closures que realmente venciam a navegação em produção — `loadForYou321`, `paintForYou336` e `switchDiscover336` — passam a delegar diretamente para r405 quando a aba é `foryou`.
- Os closures locais `loadForYou` e `renderForYou` da r388 também delegam para r405, impedindo repaint tardio do renderer antigo.
- O caminho crítico deixa a chamada composta de ~8 s e carrega em paralelo os seis pools de Filme/Série/Anime por `cinetracker_discover_watch_unseen_v396` e `cinetracker_discover_fresh_v387`.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**.
- `Trocar` continua com trava local por slot e não executa reload de página.

### Estabilidade / escopo
- Nenhum `window.location.reload()`, `router.refresh()`, `setInterval`, `MutationObserver` permanente ou loop infinito foi adicionado.
- Raw/SmackDown permanecem exatamente na regra já aprovada da r404.
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Web **1.0.196 / r405**; Android preservado em **1.0.20 / 10062**.
- Migration: `20260929235900_r405_home_movies_true_paging.sql`.

## Web 1.0.195 / r404 — 2026-09-29

### Home / Filmes
- A Watchlist deixa de depender de uma resposta única com 1.381 itens: `cinetracker_home_movies_v404` pagina a fonte em blocos de 120, mantém o total exato e libera o primeiro paint sem esperar a lista completa.
- As páginas restantes são carregadas em sequência delimitada e pintadas em lotes ociosos; falha de rede encerra em estado explícito em vez de manter `Carregando Watchlist…` indefinidamente.
- A semi-aba ativa passa a reconhecer também o botão visível por rótulo Séries/Filmes, impedindo estado legado stale de bloquear o paint de Filmes.

### Descobrir / Pra Você
- O owner r404 escolhe o container realmente visível do Descobrir e ignora roots antigos ocultos, corrigindo o caso do vídeo em que os cards apareciam pelo renderer legado sem o botão Trocar.
- Indicação do Dia e 100% Novos exibem **+ Watchlist + Visto + Trocar**; Da sua Watchlist exibe **Visto + Trocar**.
- A posse do renderer é recuperada por uma sequência finita de verificações até 45 s, sem observer contínuo, e cada Trocar altera somente o slot clicado.
- Ações continuam locais/otimistas e sem full-page reload.

### Raw / SmackDown
- `cinetracker_home_series_v404` separa **backlog total não visto** de **episódio recente pendente**.
- Produção validada: Raw = **1.499 episódios restantes totais / 1 recente pendente**; SmackDown = **1.187 totais / 1 recente pendente**.
- Enquanto existir o episódio recente pendente, Raw/SmackDown ficam em **Continuar assistindo**. Depois que esse episódio for marcado como visto, passam para **Em dia**, mesmo que o backlog histórico continue alto.

### Estabilidade / release
- Sem `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()` no runtime r404.
- Web 1.0.195 / r404; Android preservado em 1.0.20 / 10062.
- Migration: `20260929223000_r404_home_movies_paged_recurring_backlog.sql`.

## Web 1.0.194 / r403 — 2026-09-29

### Home / Séries
- `cinetracker_home_series_v403` mantém a autoridade da r402 e corrige Raw/SmackDown: episódio recente lançado e não visto passa a classificar a série em **Assistir a seguir / Continuar assistindo**, não mais em **Em dia**.
- Contagem `available_episodes` e próximo episódio continuam vindo da autoridade server-side, sem backlog histórico de WWE.

### Home / Filmes
- `cinetracker_home_movies_v402` permanece como payload leve e foi validado com 1.381 filmes.
- O frontend passa a aceitar todas as formas reais do payload (objeto com `rows`, envelope `data`, array direto e array unitário), aumenta o timeout do RPC e possui owner finito para recuperar a seção caso um renderer legado a apague.
- Paint de filmes e séries é interrompido quando a semi-aba deixa de estar ativa, evitando trabalho escondido na main thread e reduzindo congelamentos.
- A semi-aba ativa passa a ser lida primeiro do DOM visível, evitando estado legado stale selecionar Séries enquanto Filmes está aberto.

### Descobrir / Pra Você
- Diário e 100% Novos mantêm **+ Watchlist + Visto + Trocar**; Da sua Watchlist mantém **Visto + Trocar**.
- CSS r403 força grid de 3/2 ações dentro da largura do card, impedindo o botão **Trocar** de ficar cortado.
- `cinetracker_discover_foryou_v396` continua como payload canônico e as ações permanecem locais/otimistas, sem reload.

### Estabilidade / release
- Runtime r402 é aposentado no bundle final para eliminar disputa de loaders entre r402 e r403.
- Sem `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` ou `router.refresh()`.
- Web 1.0.194 / r403; Android preservado.

## Web 1.0.193 / r402 — 2026-09-29

### Home / Séries
- Cria `cinetracker_home_series_v402` para corrigir a contagem de episódios disponíveis.
- Séries normais deixam de considerar episódios do catálogo sem `air_date` como já liberados.
- Quando o metadata TMDB possui contagem liberada válida, ela tem precedência sobre a quantidade bruta do catálogo; histórico assistido continua sendo o piso para metadata atrasado.
- O frontend exibe `available_episodes` diretamente, eliminando divergência com a função legada de texto.
- Raw e SmackDown mantêm a janela recorrente de 21 dias e exigem data real do episódio, sem reintroduzir backlog histórico.

### Home / Filmes
- Cria `cinetracker_home_movies_v402`, mantendo o payload leve da r401.
- Normaliza a resposta RPC antes de ler `rows`, cobrindo objeto direto, array unitário e envelope `data`.
- **Assistir a seguir / Watchlist** continua com carregamento fatiado e sem bloquear a main thread.

### Descobrir / Pra Você
- O owner r402 assume os dois entrypoints vivos herdados da r288: `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`.
- Somente a aba `foryou` é redirecionada; demais abas do Descobrir continuam delegadas ao loader original.
- `cinetracker_discover_foryou_v396` permanece como payload canônico e a posse do renderer é reafirmada por sequência finita de timers.
- Visto, Watchlist e Trocar continuam locais/otimistas e sem reload de página.

### Estabilidade / validação
- Mantido paint em lotes pequenos via `requestIdleCallback`/frame.
- Proibidos no runtime r402: `MutationObserver`, `setInterval`, `while(true)`, `window.location.reload()` e `router.refresh()`.
- Testes r402 cobrem owner vivo r288, fim do skeleton, Watchlist de filmes e resposta RPC envelopada.
- Web 1.0.193 / r402; Android permanece sem alteração.

## Web 1.0.192 / r401 — 2026-09-29

### Home / Séries
- `cinetracker_home_series_v401` deixa de usar a cobertura parcial de `episode_catalog_v336` como contagem total de episódios liberados.
- Para séries normais, episódios disponíveis passam a ser calculados pelos episódios efetivamente lançados no metadata TMDB menos episódios assistidos; o catálogo local fica responsável pelos metadados do próximo episódio.
- O próximo episódio normal é derivado pela primeira lacuna real da temporada liberada, evitando saltos como S03E07 → S09E38 quando o catálogo local ainda está incompleto.
- Raw e SmackDown mantêm semântica recorrente: backlog histórico é ignorado, mas o episódio recente não visto aparece em **Em dia**.
- `ct-refresh-tv-state-user` v5 só considera uma temporada normal em cache quando todos os episódios já lançados daquela temporada estão presentes.

### Home / Filmes
- `cinetracker_home_movies_v401` substitui na Home o payload de 2,5 MB da Watchlist antiga por um payload enxuto sem `raw_tmdb`; para a conta validada, 1.381 filmes caíram para cerca de 407 KB.
- Séries e filmes são pintados em lotes de 10 itens com `requestIdleCallback`/fallback por frame, evitando monopolizar a main thread.
- **Assistir a seguir / Watchlist** usa a nova autoridade enxuta e não depende mais do RPC pesado v376.

### Descobrir / Pra Você
- O owner r401 reconhece a aba ativa pelo DOM e também cobre o container base `data-discover-content`, sem depender exclusivamente do estado legado `discover263`.
- O renderer legado r388 é redirecionado para o renderer r401; loaders antigos não conseguem mais restaurar skeletons de **Buscando indicação…** depois que o payload v396 chega.
- A posse da aba é reafirmada por uma sequência finita de timers, sem `MutationObserver`, `setInterval` ou loop permanente.
- Indicação do Dia, Da sua Watchlist e 100% Novos continuam usando `cinetracker_discover_foryou_v396` e ações locais Visto/Watchlist/Trocar.

### Estabilidade / build
- Web 1.0.192 / r401 deriva da base segura r396; r397-r400 não são encadeadas no bundle.
- O build r401 valida sintaxe do runtime, padrões proibidos e os nomes finais `app-v401.js`/cache r401 antes de concluir o deploy.
- Nenhuma mutação usa `window.location.reload()` ou `router.refresh()`.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

## Web 1.0.191 / r400 — 2026-09-29

### Home
- Corrige a race condition de boot que disparava `cinetracker_home_series_v391` e `cinetracker_watchlist_full_v376` antes da sessão autenticada existir e consolidava listas vazias.
- Séries e filmes passam a carregar somente após sessão + DOM da rota estarem prontos.
- Renderização de listas extensas é fatiada com `requestAnimationFrame`; Histórico continua acima e a entrada é ancorada no bloco principal.
- Raw e SmackDown recebem refresh autenticado da temporada corrente em segundo plano e nova leitura da autoridade v391.

### Descobrir / Pra Você
- Corrige o mesmo race de autenticação que transformava a falha inicial do RPC v396 em `Buscando indicação…`/estado vazio permanente.
- O owner r400 consome o payload canônico `cinetracker_discover_foryou_v396` depois do boot e pinta os 7 slots com 18 ações.
- Visto, Watchlist e Trocar permanecem locais/otimistas, com trava síncrona e sem full-page reload.

### TV recorrente
- `ct-refresh-tv-state-user` deixa de considerar cache recente suficiente para séries esportivas recorrentes.
- Temporada atual de Raw/SmackDown é sempre consultada quando o refresh roda; episódios esportivos já lançados são aceitos pela data real da temporada, sem depender do `last_episode_to_air` atrasado do detalhe da série.

### Estabilidade / build
- r400 volta a derivar de r396 para retirar completamente do bundle o observer global introduzido em r397.
- Web 1.0.191 / r400; Android permanece sem alteração.

# Changelog

## 1.0.190 — 2026-09-29 — Web r399

### Travamento inicial
- Corrige a regressão da r398 que instalou um `MutationObserver` global em `document.documentElement` e chamava novamente o owner da Home a cada mutação do DOM.
- O ciclo removido era: render da Home → mutação → observer → nova entrada da Home → novo render/timers → nova mutação.
- O runtime r399 não possui observer global e usa somente um probe de boot finito e idempotente.

### Home
- Séries continuam usando `cinetracker_home_series_v391` como autoridade.
- Raw/SmackDown continuam recebendo refresh da temporada atual, mas o refresh é adiado para depois do primeiro paint, possui uma única task em voo e TTL de 5 minutos.
- Filmes mantêm o fallback `cinetracker_watchlist_full_v376`.
- A Watchlist de filmes é pintada em blocos pequenos via `requestAnimationFrame`, sem `setInterval` de alta frequência e sem bloquear a main thread.
- A âncora inicial permanece em Assistir a seguir / Watchlist, com apenas alinhamentos delimitados.

### Descobrir / Pra Você
- O owner r399 usa listener em `window` na fase de captura para vencer o handler legado r397 que interceptava a aba Pra Você antes da correção r398.
- `cinetracker_discover_foryou_v396` continua como payload canônico; fallback continua limitado.
- Visto, Watchlist e Trocar permanecem otimistas e protegidos por trava por slot.
- Nenhum full-page reload foi adicionado.

### Validação
- Novo gate estático falha se `MutationObserver`, `setInterval`, `window.location.reload()` ou `router.refresh()` reaparecerem no runtime r399.
- Novo gate Chromium mede reentrada da Home e falha se a RPC de Séries entrar em loop; também exige 7 cards e 18 ações em Pra Você.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.190 / r399-official-1.0.190.
- Build: `apps/web/build-r399.mjs`.
- Gate: `apps/web/build-r399-official.mjs`.

## 1.0.189 — 2026-09-29 — Web r398

### Home
- Corrige definitivamente a entrada: a Home aguarda o bloco principal existir e ancora em **Assistir a seguir** / **Assistir a seguir / Watchlist**, mantendo o Histórico acima para acesso por rolagem.
- Filmes passa a ter fallback direto em `cinetracker_watchlist_full_v376`; a lista não depende mais de o cache/loader r388 já estar preenchido para renderizar os 1.381 itens.
- A Watchlist de Filmes continua em paint delimitado por lotes, sem bloquear a main thread e sem full-page reload.
- Séries usa `cinetracker_home_series_v391` diretamente antes e depois do refresh de TV.
- Raw e SmackDown forçam `ct-refresh-tv-state-user` e reaplicam o payload v391, exibindo o episódio recente não visto no card de **Em dia**, sem caminhar por backlog histórico.

### Descobrir / Pra Você
- r398 assume renderer, estado e entrypoint do Pra Você sem depender do conjunto `validated` do r388, eliminando o deadlock que deixava os sete slots em **Buscando indicação…**.
- `cinetracker_discover_foryou_v396` continua como payload canônico; em falha, existe somente um fallback limitado às seis RPCs server-side.
- Indicação do Dia, Da sua Watchlist e 100% Novos são pintados no mesmo estado local.
- Botões: Diário/Fresh = Watchlist + Visto + Trocar; Watchlist = Visto + Trocar.
- Visto/Watchlist/Trocar são locais/otimistas, com trava síncrona por slot e sem reload.

### Escopo
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.189 / r398-official-1.0.189.
- Commit/push: main.

# Changelog

## 1.0.188 — 2026-09-29 — Web r397

### Home
- Corrige a entrada da Home: o Histórico continua escondido acima, mas a posição inicial só é alinhada depois do bloco principal existir, evitando abrir no final do Histórico.
- Corrige Filmes > Assistir a seguir / Watchlist: os 1.381 itens já devolvidos pelo RPC v393 deixam de desaparecer quando um renderer legado falha; o paint passa a ser defensivo e em lotes delimitados.
- Mantém as seis ordenações da Watchlist de filmes sem full-page reload.
- Raw, SmackDown e outras séries recorrentes continuam classificadas em Em dia, mas exibem o próximo episódio lançado não visto e a ação de marcar como assistido.
- ct-refresh-tv-state-user v3 prioriza séries recorrentes, consulta a temporada atual e atualiza o catálogo recente em vez de caminhar pelas temporadas históricas antigas.

### Descobrir / Pra Você
- r397 assume também o entrypoint real após r395/r396 e rebinda os owners antigos que ainda podiam vencer depois do boot.
- cinetracker_discover_foryou_v396 continua como payload canônico; fallback é limitado às seis RPCs server-side já existentes.
- Um recovery delimitado observa apenas o estado preso sem cards e dispara o loader canônico; não existe loop ilimitado.
- Indicação do Dia, Da sua Watchlist e 100% Novos voltam a produzir cards com Visto, Watchlist e Trocar pelo renderer r388/Optimistic UI.
- Nenhum window.location.reload() ou router.refresh() foi introduzido.

### Backend / produção
- Edge Function ct-refresh-tv-state-user publicada como versão 3 no Supabase ativo.
- Escopo da r397 permanece Home + Descobrir/Pra Você; Perfil, Esportes, Top 10, Configurações e Android permanecem preservados.

### Validação
- Gate estático cobre identidade r397, renderer defensivo de Filmes, episódios recorrentes e ausência de reload/loop ilimitado.
- Gate Chromium reproduz a falha do renderer de Filmes, valida a âncora da Home, valida Raw com próximo episódio e exige sete cards + ações no Pra Você.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.188 / r397-official-1.0.188.
- Commit/push: main.

## 1.0.187 — 2026-09-29 — Web r396

### Descobrir / Pra Você
- Remove do caminho crítico a sequência de RPCs + auditorias cliente que deixava os sete slots presos em `Buscando indicação…`.
- Adiciona `cinetracker_discover_foryou_v396`, que devolve em uma única chamada os três pools de Watchlist e os três pools de 100% Novos.
- Adiciona `cinetracker_discover_watch_unseen_v396`, filtrando no banco Watchlist já assistida, progresso de episódios e estados AlreadySeen/Completed/InProgress/UpToDate.
- `100% Novos` usa diretamente `cinetracker_discover_fresh_v387`, cuja própria SQL já elimina vistos e Watchlist; a auditoria redundante v391 deixa de bloquear o paint.
- `Indicação do Dia` é selecionada somente do Fresh já validado.
- r396 substitui apenas o loader do owner r388/r395; renderer, botões e Optimistic UI aprovados permanecem intactos.
- Timeout de 5 s termina em estado explícito de falha/vazio; não existe spinner infinito.
- Nenhum `window.location.reload()`, `router.refresh()`, loop ilimitado ou recursão foi introduzido.

### Backend / produção
- Migration `r396_discover_foryou_single_payload` aplicada no projeto Supabase ativo.
- Escopo SQL é `SECURITY INVOKER` padrão e mantém `auth.uid()` como autoridade do usuário.

### Validação
- Gate estático exige RPC único v396, barreira de Watchlist não vista, ausência de auditoria cliente no runtime r396 e identidade 1.0.187/r396.
- Gate Chromium exige exatamente uma chamada ao payload v396 e sete cards pintados, além de confirmar que o loader legado não executa.
- Gate r395 continua executado para preservar o owner de navegação; r394 continua preservado pela cadeia anterior.
- Android permanece 1.0.20 / versionCode 10062.

### Release
- Web: 1.0.187 / r396-official-1.0.187.
- Commit/push: main.


## 1.0.186 — 2026-09-29 — Web r395

### Escopo exclusivo: Descobrir / Pra Você
- Corrige os placeholders permanentes de Indicação do Dia, Da sua Watchlist e 100% novos.
- A navegação real de Pra Você passa a ter um único owner: r388.
- r321/r336 e os aliases legados de loader são reencaminhados antes de cada entrada no Descobrir, sem alterar as outras abas.
- Da sua Watchlist usa a autoridade `cinetracker_discover_watch_v391`.
- 100% novos usa `cinetracker_discover_fresh_v387` e auditoria estrita `cinetracker_discover_filter_v391`.
- Mantém filtros de vistos/watchlist, ações otimistas e ausência de full-page reload.
- Adiciona retry único e delimitado; se não existir candidato elegível, o skeleton termina em estado vazio explícito em vez de permanecer carregando.

### Evidência
- Logs reais da sessão de 2026-09-29 mostraram chamadas a `cinetracker_watchlist_full_v119`, `cinetracker_shown_recommendations_recent_v296`, `cinetracker_shown_recommendations_record_v296` e `cinetracker_discover_filter_v333`.
- No mesmo fluxo não houve chamadas às autoridades r388 esperadas (`discover_watch_v391`, `discover_fresh_v387`, `discover_filter_v391`), confirmando que o entrypoint legado ainda vencia em produção.

### Validação
- Gate estático valida owner r395, fontes v391/v387, ausência de v333 no novo runtime, ausência de reload e ausência de loop ilimitado.
- Gate Chromium exercita os entrypoints r321/r336/render real e falha se o loader legado de Pra Você for chamado.
- O gate r394 da Home continua no release oficial para garantir que a correção de Descobrir não regrida a Home.

### Não alterado
- Home, Perfil, Esportes, Top 10, Configurações e Android.

### Release
- Web: 1.0.186 / r395-official-1.0.186.
- Android: 1.0.20 / versionCode 10062 preservado.


## 1.0.185 — 2026-09-29 — Web r394

### Escopo exclusivo: Home + Descobrir / Pra Você
- Corrige a regressão reproduzida no vídeo em que a Home abria no topo do Histórico e, após o Histórico assíncrono crescer, `Assistir a seguir` era empurrado várias telas para baixo.
- A âncora da Home agora é reaplicada depois da conclusão do carregamento crítico de Séries + Histórico, preservando o Histórico acima da posição inicial e o acesso por scroll para cima.
- Reaproveita o cache válido da sessão no primeiro paint da Home e continua reconciliando com as autoridades atuais em background, sem reload.
- Corrige a dupla autoridade do Pra Você: a navegação real ainda passava por `__ctR382LoadForYou`/r321, enquanto o renderer já era r388. Isso deixava os placeholders permanentes porque loader e renderer escreviam estados diferentes.
- Todos os entrypoints legados de Pra Você passam a apontar para o loader r388. A tela real volta a chamar `cinetracker_discover_watch_v391`, `cinetracker_discover_fresh_v387` e `cinetracker_discover_filter_v391`.
- Mantida a exclusão estrita de Vistos/Watchlist em 100% Novos e as ações otimistas sem full-page reload.

### Evidência da regressão
- Nos logs da gravação r393, o fluxo quebrado chamou `cinetracker_discover_filter_v333` e não chamou as RPCs v391/v387 esperadas pelo owner atual.
- O novo gate Chromium valida o entrypoint r321/r382 real, não apenas a chamada direta de `window.__ctR388.loadForYou`, e reproduz Histórico alto antes do bloco principal.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.185 / r394-official-1.0.185.
- Android: 1.0.20 / versionCode 10062 preservado.


## 1.0.184 — 2026-09-28 — Web r393

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home volta a iniciar no primeiro bloco principal, mantendo o Histórico renderizado acima da posição inicial e acessível ao rolar para cima.
- A âncora da Home é reaplicada durante os repaints assíncronos do Histórico e no alternar Séries/Filmes; interação manual de scroll cancela reposicionamentos posteriores.
- A Watchlist de Filmes deixa de baixar o payload completo de filmes+séries do v376 como caminho principal. O novo `cinetracker_home_movies_v393` retorna somente filmes e os campos necessários para a Home.
- No estado atual validado, o payload da Watchlist caiu de aproximadamente 2,87 MB / 1.961 registros para aproximadamente 399 KB / 1.381 filmes, preservando a contagem atual da Home.
- Filmes passam a ser pré-carregados em segundo plano depois do carregamento crítico de Séries/Histórico; v376 permanece somente como fallback compatível.
- Pra Você volta a preencher 100% Novos pelo `cinetracker_discover_fresh_v387` antes do fallback TMDB, com auditoria `cinetracker_discover_filter_v391` e limites de tempo maiores para rede móvel.
- A auditoria inicial de cache foi reduzida aos cards correntes; pools grandes deixam de bloquear a tela inteira antes do primeiro paint útil.
- Da sua Watchlist e 100% Novos carregam em paralelo por tipo e os slots são atualizados progressivamente.
- Mantidas as ações sem full-page reload, os locks de interação e a exclusão estrita de vistos/Watchlist.

### Banco
- Migration `20260929002751_home_movies_v393_lightweight` aplicada e registrada no Supabase.
- RPC novo usa `security invoker`, `auth.uid()` e retorna somente a Watchlist de filmes do usuário autenticado.

### Validação
- Gate estático exige âncora r393, RPC leve de Filmes, Pra Você DB-first e ausência de `window.location.reload()` / `router.refresh()`.
- Gate Chromium preserva regressões r392, exige o caminho `cinetracker_home_movies_v393`, valida 1.382 itens mockados no cenário de regressão, confirma Histórico acima da viewport e Pra Você preenchido pelo caminho DB-first.
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.184 / r393-official-1.0.184.
- Android: 1.0.20 / versionCode 10062 preservado.

## 1.0.183 — 2026-09-28 — Web r392

### Escopo exclusivo: Home + Descobrir / Pra Você
- Remove da Home a combinação entre cinetracker_home_active_v380 e a autoridade v391. Duplicatas antigas não conseguem mais preencher next_episode_* nulo de uma série já atualizada e ressuscitar um card em Continuar.
- O renderer de séries deixa de chamar ct276EpisodeCard; os metadados autoritativos do episódio são renderizados diretamente no mesmo paint, eliminando Atualizando episódios... / Sincronizando estado atual persistentes.
- Ações de episódio/filme assistido ganham owner r392 com UI otimista, lock síncrono por item e persistência cinetracker_mark_watch_v0994, sem reload global.
- cinetracker:data-changed invalida memória e caches da Home em qualquer rota. Marcar no detalhe e voltar para a Home força uma leitura nova; resultados de requests antigos são descartados por geração.
- Stuart/TMDB 287620 foi validado no banco após o vídeo: T1E10 existe em episode_progress/watch_history, e a autoridade v391 retorna up_to_date, 10/10 e zero episódios disponíveis.
- Histórico de episódios e filmes sobe para 100 itens recentes por bloco e deixa de concorrer, no primeiro paint de Séries, com o fetch completo da Watchlist de Filmes.
- A Watchlist de Filmes só é carregada ao abrir a semi-aba Filmes; mantém lista completa e ordenações existentes.
- Pra Você audita pools persistidos em um único lote antes de exibir cards e reutiliza itens já validados; Fresh continua com TMDB bounded e auditoria pessoal fail-closed.
- Nenhum window.location.reload(), router.refresh() ou loop infinito foi adicionado.
- O build de hospedagem usa `build-r392.mjs`; o gate Chromium continua obrigatório no GitHub Actions via `build-r392-official.mjs`, evitando falha de deploy por ausência de browser no builder da Vercel.

### Validação
- Gate Chromium reproduz mutação feita fora da Home: invalida cache, refaz a Home, exige Stuart fora de Continuar, presente em Em dia e T1E10 no Histórico.
- Gate injeta um renderer legado que só devolve loading e exige que ele não seja usado pela Home r392.
- Gate preserva 1.382 filmes, seis sorts, exclusão de Harry/Azkaban visto e ações 3/2/3 do Pra Você.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: 1.0.183 / r392-official-1.0.183.
- Android: 1.0.20 / versionCode 10062 preservado.
## 1.0.182 — 2026-09-28 — Web r391

### Escopo exclusivo: Home + Descobrir / Pra Você
- Remove o enriquecimento TMDB bloqueante do primeiro paint da Home. A lista ativa v380 aparece imediatamente e a autoridade completa v391 (~415 ms no conjunto real) corrige/completa o estado sem esperar chamadas por card.
- Corrige a fusão que fazia o bucket rápido `continue` sobrescrever `dust`. No conjunto real, a autoridade v391 retorna 2 em Continuar e 20 em Juntando poeira, em vez de concentrar tudo no mesmo bloco.
- Stuart/TMDB 287620 já sai no payload local como T1E10, com título, data e nota; o catálogo recebeu o episódio atual e o refresh TMDB fica apenas em background.
- Histórico v391 foi reescrito para trabalhar somente sobre eventos recentes já indexados e caiu de ~8 s para ~125 ms no banco real.
- Filmes preservam a Watchlist completa v376 e as seis ordenações existentes.
- Pra Você deixa de consultar qualquer RPC de Fresh que varra a biblioteca. Filme/Série/Anime vêm de lotes TMDB limitados e passam pela auditoria pessoal v391.
- A auditoria v391 une TMDB exato e aliases importados do mesmo título/ano. Harry Potter/Azkaban (movie:673) é bloqueado mesmo quando o registro visto está em um ID importado diferente.
- Botões permanecem: Indicação/Fresh = Watchlist + Visto + Trocar; Da sua Watchlist = Visto + Trocar. Coração continua contido na capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android permanecem fora do escopo.

### Release
- Web: `1.0.182 / r391-official-1.0.182`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.181 — 2026-09-28 — Web r390

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home Séries passa a usar `cinetracker_home_active_v380` como primeiro fetch (medido em ~0,17 s no banco), deduplica títulos pelo TMDB e combina linhas duplicadas antes do primeiro paint.
- Séries ativas são enriquecidas em paralelo com timeout curto antes de aparecerem; a RPC completa `cinetracker_home_series_v389` fica em background e não deve alterar tardiamente a composição de Continuar assistindo.
- Stuart duplicado em português/inglês é consolidado no mesmo item lógico, preservando o título localizado e o ponteiro/metadados de episódio mais completo.
- Filmes preservam a Watchlist completa v376. O gate usa 1.382 registros e testa as seis ordenações.
- Pra Você mantém o caminho rápido `fresh_v387 + filter_v389` (medido em ~0,76 s para 24 filmes). A RPC `fresh_v389` de ~26 s fica fora do runtime.
- Auditoria r389 cruza TMDB + título localizado/original + ano. Harry Potter/Azkaban TMDB 673 retorna em `seen_keys`/`blocked_keys` e é caso obrigatório do gate.
- Botões permanecem 3/2/3 e o coração precisa ficar integralmente dentro da capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android não foram modificados.

### Release
- Web: `1.0.181 / r390-official-1.0.181`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.179 — 2026-09-28 — Web r388

### Escopo exclusivo: Home + Descobrir / Pra Você
- Home Séries passa a combinar o estado autoritativo v385 com o conjunto ativo v380 antes do primeiro paint estável.
- Próximos episódios visíveis/ativos são enriquecidos em paralelo pelo TMDB com timeout curto; isso evita nomes/datas/notas chegando dezenas de segundos depois e permite que séries ativas como Stuart entrem no primeiro conjunto quando existe episódio novo.
- Home Filmes usa a Watchlist completa v376 e monta todos os registros de uma vez. O total atual autoritativo é 1.381 e as seis ordenações atuam sobre todos os nós.
- Pra Você deixa de depender das action rows/observers antigos. O r388 renderiza Indicação do Dia, Da sua Watchlist e 100% novos diretamente.
- 100% novos é auditado pelo filtro pessoal v385 antes do render e antes de cada troca; Vistos/Watchlist não aparecem.
- Botões: Diário e 100% Novos = Watchlist + Visto + Trocar; Da sua Watchlist = Visto + Trocar. Botões só existem quando existe card real.
- Coração/favorito fica contido dentro da capa.

### Não alterado
- Perfil, Esportes, Top 10, Configurações e Android não foram modificados.

### Release
- Web: `1.0.179 / r388-official-1.0.179`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.178 — 2026-09-28 — Web r387

### Home — somente correções solicitadas
- Séries e Filmes voltam a abrir no primeiro bloco principal: `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Histórico continua fisicamente acima da posição inicial e só aparece ao rolar para cima.
- O alinhamento é reafirmado durante os repaints iniciais, mas é cancelado assim que o usuário começa a rolar manualmente.
- Novo `cinetracker_home_history_v387` remove o teto de 50/100 itens e consolida o histórico completo por mídia lógica.
- A Watchlist de Filmes, filtros e demais regras da Home r385/r386 são preservados.

### Descobrir / Pra Você — somente correções solicitadas
- Antes de montar a linha final, qualquer action-row legado direto do slot é removido; fica uma única `.ct385-actions`.
- A linha usa Flexbox nowrap e sincroniza sua largura com a largura real da capa.
- Novo `cinetracker_discover_fresh_v387` fornece fallback local estrito já excluindo Vistos/Watchlist; TMDB continua como fallback bounded adicional.
- O carregamento tenta novamente Fresh de forma limitada antes de aceitar estado parcial.
- Nenhum outro bloco do Descobrir foi alterado.

### Validação
- Browser gate exige Histórico de Filmes com 130 itens completos e item posterior ao Pokémon presente.
- Séries e Filmes precisam iniciar no bloco principal com o histórico acima do viewport.
- Fresh começa vazio e precisa preencher Filme/Série/Anime pelo fallback.
- O teste injeta action-rows legados e mede os botões: apenas uma linha pode sobreviver, sem sobreposição e sem exceder a largura da capa.

### Escopo congelado
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.
- Web: `1.0.178 / r387-official-1.0.178`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.177 — 2026-09-28 — Web r386

### Home + Descobrir / Pra Você
- Mantém integralmente o owner r385 já validado para Home e Pra Você; nenhuma outra área funcional é alterada.
- Corrige o cenário comprovado no vídeo em que o navegador permanecia em Web 1.0.174 / r383 mesmo após a produção estar em r385.
- `/`, `/home`, `/discover` e `/index.html` passam a responder com `no-cache, no-store, must-revalidate`.
- Ao entrar em Home ou Descobrir, o cliente consulta `release.json` sem cache e solicita atualização do Service Worker.
- Depois que r386 estiver carregada uma vez, futuras divergências de versão nessas duas áreas acionam reload único para evitar continuar executando bundle antigo.

### Validação
- O gate completo da r385 é executado novamente sem mudanças: Stuart/metadata da Home, 1.382 filmes + seis filtros, remoção do filtro duplicado no Pra Você, três ações corretas e exclusão do Harry Potter visto.
- Profile, Esportes, Top 10, Settings e Android permanecem fora do escopo.

## 1.0.176 — 2026-09-28 — Web r385

### Home — correção isolada
- Remove a autoridade r384 da Home. Séries, Histórico e Filmes passam a carregar em paralelo e atualizar somente o próprio bloco.
- Novo `cinetracker_home_series_v385` consolida duplicatas por TMDB, cruza todo o histórico/progresso do título e devolve bucket + próximo episódio + nome + nota + data + disponíveis na primeira resposta.
- Séries esportivas de longa duração (Raw/SmackDown/F1/UFC) só entram em Continuar se houver episódio recente não visto; backlog antigo não volta a inflar Assistir a seguir.
- Cache r384 não é reutilizado. O novo cache r385 é curto e sempre recebe refresh de rede.
- Novo `cinetracker_home_history_v385` carrega Histórico em paralelo, sem depender do payload monolítico.
- Filmes usam diretamente a Watchlist completa v376 desde a entrada na Home, sem depender do clique em Filmes. O único contador é o total real e os seis sorts continuam locais.

### Descobrir / Pra Você — correção isolada
- Novo filtro `cinetracker_discover_filter_v385` cruza TMDB + títulos localizado/original + histórico/progresso/overrides.
- Auditoria Fresh é fail-closed: se a validação falhar, o card não é liberado como 100% novo.
- `100% Novos` exige nota >= 7,5, ano > 1990, pôster, categoria correta e ausência em Visto/Watchlist.
- Harry Potter/Azkaban marcado em registro legado é caso de regressão obrigatório.
- Linha final de ações usa somente `.ct385-actions`: Diário/Fresh = Watchlist, Visto, Trocar; Watchlist = Visto, Trocar.
- Filtro duplicado dentro de Pra Você é removido; filtro global externo é preservado; coração fica dentro da capa.

### Escopo congelado
- Nenhuma alteração em Perfil, Esportes, Top 10, Configurações ou Android.
- Web: `1.0.176 / r385-official-1.0.176`.
- Android preservado em `1.0.20 / versionCode 10062`.

## 1.0.175 — 2026-09-27 — Web r384

### Home
- A abertura de Séries deixa de disparar simultaneamente Séries, payload completo e Watchlist de filmes.
- Primeiro paint usa apenas `cinetracker_home_series_v383` e `cinetracker_home_active_v380` com live patch limitado, evitando o congestionamento observado no celular.
- O cache de Séries passa a persistir entre reloads; quando existe, a Home pinta imediatamente.
- Stuart e metadados do próximo episódio entram no mesmo ciclo inicial de até poucos segundos, não por um repaint tardio de dezenas de segundos.
- A Watchlist completa de Filmes (1.382 no cenário atual) só é carregada ao entrar em Filmes; o contador legado de 240 é removido e o filtro nativo de seis opções permanece sob o owner r376.

### Descobrir / Pra Você
- O filtro duplicado dentro de Pra Você é removido; o filtro global ao lado da busca é preservado.
- Todo card de `100% Novos` é validado individualmente por `cinetracker_media_state_v1` antes de ser exibido.
- Visto, Watchlist e Favorito são exclusões obrigatórias no Fresh; aliases/títulos alternativos como o caso Harry Potter são bloqueados.
- Indicação do Dia e 100% Novos recebem fallback limitado quando o pool está vazio.
- Botões ficam fixos em 3/2/3 (Diário/Watchlist/Fresh), exatamente na largura do card; coração fica totalmente dentro da capa.
- Trocar usa lock por slot e valida o próximo Fresh antes de renderizar.

### Escopo
- Somente Home e Descobrir/Pra Você.
- Perfil, Esportes, Top 10, Configurações e Android não foram alterados.

## 1.0.174 — 2026-09-26 — Web r383

### Home — somente Home
- Novo primeiro paint `cinetracker_home_series_v383`: busca apenas as séries relevantes e já devolve episódio, nome, nota, data, contagens e bucket antes de pintar.
- Stuart e outras séries ativas entram na mesma resposta inicial; o payload completo v382 roda apenas em background e é salvo para a próxima navegação, sem repintar a tela atual dezenas de segundos depois.
- Reconciliadores tardios r332 ficam desativados enquanto a r383 é a autoridade da Home.
- Filmes continua usando a Watchlist completa v376; o contador legado 240 é removido antes da hidratação e a lista completa é reaplicada ao entrar em Filmes.
- A ordenação da Watchlist continua no owner v376 sobre os nós completos.

### Descobrir / Pra Você — somente Descobrir
- Remove o filtro duplicado que r328 inseria abaixo da aba Pra você.
- A faixa final de ações deixa de reutilizar `.ct336-actions`; usa `.ct383-actions`, fora do alcance dos writers antigos.
- Contrato fixo: Indicação do Dia = Watchlist/Visto/Trocar; Da sua Watchlist = Visto/Trocar; 100% Novos = Watchlist/Visto/Trocar.
- Cada Fresh passa pela auditoria v381 e por uma validação final `cinetracker_media_state_v1` antes de aparecer. Item visto, em Watchlist ou favorito é rejeitado.
- Fresh Filme/Série/Anime é preenchido em paralelo com fallback TMDB limitado e sem loop bloqueante.
- Coração fica integralmente dentro da capa.

### Escopo preservado
- Perfil, Configurações, animações e Esportes não são alterados.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.173 — 2026-09-26 — Web r382

### Rollback estrutural
- A build volta a partir da r376 para retirar completamente os renderers substitutos r380/r381 de Home e Perfil.
- Perfil volta ao renderer aprovado r313/r316; apenas a fonte de dados muda para `cinetracker_profile_v380`, com cache-first, sem mudar seções, ordem ou estatísticas.

### Home
- O renderer original volta a ser a única autoridade de composição: Histórico, Continuar assistindo, Assistir a seguir, Em dia e demais buckets não são remontados por runtime novo.
- Novo `cinetracker_home_payload_v382` parte do v359 e injeta apenas metadados ativos no primeiro payload (episódio, nota, data, contagens), preservando `home_bucket` do v359.
- Séries ativas ausentes no v359 podem ser acrescentadas com o bucket derivado da própria autoridade ativa, evitando aparição tardia.
- Filmes mantém a Watchlist completa v376; o contador legado de 240 é removido do header, deixando apenas o total real.

### Descobrir / Pra Você
- `100% Novos` é auditado obrigatoriamente por `cinetracker_discover_filter_v381`, incluindo aliases/título original; itens vistos ou em Watchlist são removidos antes do paint.
- Ações finais são exatamente 3/2/3: Diário e 100% Novos = Watchlist, Visto, Trocar; Da sua Watchlist = Visto, Trocar.
- O botão Trocar usa pool finito, lock por slot e refill sem loop bloqueante; o evento é interceptado antes do clique do card.
- Coração fica integralmente dentro da capa.

### Release
- Web: `1.0.173 / r382-official-1.0.173`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.172 — 2026-09-25 — Web r381

### Home restaurada
- Remove `home_active_v380` como autoridade parcial do primeiro paint. A composição, buckets e históricos voltam a vir do payload completo `cinetracker_home_payload_v359`.
- Snapshots parciais r380 são ignorados; o cache r381 aceita somente Home completa.
- No primeiro carregamento de rede, v359 e uma atualização curta dos episódios ativos rodam em paralelo. Séries com catálogo local atrasado, como Stuart, recebem o episódio liberado antes do primeiro paint quando o TMDB responde dentro do orçamento.
- Histórico de séries e filmes volta a fazer parte do payload inicial e permanece acima do ponto semântico da Home.
- Repaints/reconciliações tardios r332 são cancelados; a composição não deve ganhar séries dezenas de segundos depois.

### Perfil
- Mantém o RPC rápido `cinetracker_profile_v380`, medido abaixo de 1 s na biblioteca atual.
- Remove o HTML próprio das r379/r380 e restaura a estrutura original: Estatísticas, Séries, Filmes, Séries Favoritas, Filmes Favoritos, Atores Favoritos, Episódios por dia e Biblioteca.
- O produtor r238 volta a controlar o grid expandível de Estatísticas. A Watchlist completa v376 continua sincronizando os números, incluindo 1.382 filmes.

### Descobrir / Pra Você
- Novo filtro `cinetracker_discover_filter_v381` bloqueia candidatos somente por evidência do usuário, mas cruza TMDB, título localizado e título original. Harry Potter 673 é bloqueado pelo histórico legado em inglês.
- Auditoria é obrigatória: erro de auditoria não libera Fresh sem validação.
- A linha final de botões usa classe isolada `ct381-actions`; writers antigos não conseguem remover `Trocar`.
- Contrato obrigatório e visível em mobile: Daily 3 botões, Watchlist 2, Fresh 3, todos dentro da largura do card.
- Coração fica inteiramente dentro da capa.

### Release
- Web: `1.0.172 / r381-official-1.0.172`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.171 — 2026-09-25 — Web r380

### Home / Séries
- Primeiro paint deixa de aguardar o payload monolítico: usa snapshot existente e o RPC enxuto `cinetracker_home_active_v380` para atualizar imediatamente séries `InProgress/UpToDate`.
- Séries ativas ausentes do snapshot, como Stuart, entram no mesmo ciclo inicial; não existe recomposição de bucket dezenas de segundos depois.
- Metadados visíveis continuam hidratados em paralelo com orçamento curto, sem bloquear a Home.
- A aba selecionada e o ponto semântico da r375 continuam preservados.

### Home / Filmes
- A Watchlist completa da r376 é reaplicada depois de cada paint da Home.
- Remove o contador-base truncado `240`; o cabeçalho mantém apenas o total completo (1.382 no estado atual).
- O `select` de ordenação é religado ao owner da Watchlist e reorganiza os mesmos nós DOM.

### Descobrir / Pra Você
- Remove definitivamente o filtro duplicado abaixo da aba `Pra você`.
- Daily/Fresh = `Watchlist + Visto + Trocar`; Watchlist = `Visto + Trocar`, sempre dentro da largura do card.
- Novo `cinetracker_discover_filter_v380` cruza TMDB ID, título localizado e título original. Isso bloqueia o caso comprovado de Harry Potter/Azkaban salvo no histórico em inglês e recebido pelo TMDB em português.
- Fresh é auditado antes do render e o fallback TMDB também passa pela auditoria v380.

### Perfil
- O Perfil deixa de chamar o dashboard monolítico e usa um único `cinetracker_profile_v380` direto sobre tabelas indexadas.
- Na medição com a biblioteca atual, o RPC retornou o total de 1.382 filmes em Watchlist sem o timeout que derrubava a página.
- Cache local continua disponível como primeiro paint/fallback.

### Desempenho / Top 10 e favoritos
- Corações usam `cinetracker_favorites_v380`, sem montar o dashboard do Perfil.
- Lista de streamings fica em cache local por 24 h; Top 10 por provedor fica em cache por 15 min e os primeiros provedores são pré-carregados em segundo plano.
- Coração fica inteiramente dentro do card/pôster também no Top 10.

### Release
- Web: `1.0.171 / r380-official-1.0.171`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.170 — 2026-09-25 — Web r379

### Home / Séries
- r379 assume a autoridade da Home e desativa os reparos automáticos tardios da r332; a composição exibida não recebe novas séries dezenas de segundos depois.
- O refresh em background é salvo como snapshot para a próxima navegação, sem repintar a tela atual.
- O snapshot da Home é persistido em sessionStorage para retorno instantâneo.
- Metadados dos episódios visíveis são hidratados imediatamente com limite de 3,5 s, sem aguardar o antigo ciclo tardio.

### Descobrir / Pra Você
- O filtro pessoal passa a usar `cinetracker_discover_filter_v322` (indexado).
- Nenhum card de 100% Novos é renderizado antes da auditoria pessoal.
- Regressão obrigatória: `movie:673` (Harry Potter e o Prisioneiro de Azkaban) marcado como visto deve ser removido do Fresh antes do render.

### Perfil
- Novo RPC `cinetracker_profile_fast_v379`: materializa o dashboard uma única vez e deriva estatísticas, estados e contagens sem recalcular o dashboard em funções aninhadas.
- Perfil usa cache de sessão no primeiro paint e atualiza pelo RPC rápido; falha de atualização não derruba uma tela já válida.
- Fonte da Watchlist do Perfil passa para `cinetracker_watchlist_full_v376`.

### Release
- Web: `1.0.170 / r379-official-1.0.170`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.170 — 2026-09-25 — Web r379

### Home Séries
- Persiste o payload v359 (~167 KB) em armazenamento local e usa snapshot no primeiro paint, evitando skeleton longo nas aberturas seguintes.
- Desativa os repaints tardios r325/r332 que alteravam buckets e faziam séries como Stuart aparecerem depois.
- O payload v359 vira a autoridade de composição da lista; enriquecimento TMDB posterior só completa nome/nota/data do episódio, sem mover a série entre seções.
- O alinhamento semântico Séries/Filmes da r375 continua obrigatório após cada paint.

### Descobrir / Pra Você
- Novo filtro `cinetracker_discover_filter_v379`: `100% Novos` bloqueia qualquer mídia já conhecida pela biblioteca pessoal, inclusive `Liked`, além de Visto e Watchlist.
- Todo lote de fallback TMDB é validado no servidor antes de entrar no pool.
- Filme/Série/Anime Fresh são reabastecidos em paralelo com nota mínima 7.5 e filtros de ano/WWE.
- Contrato visual reimposto depois de cada render/troca: Daily/Fresh = Watchlist + Visto + Trocar; Watchlist = Visto + Trocar.
- Troca continua local por slot e usa apenas candidatos Fresh previamente validados.

### Perfil
- Primeiro paint usa `cinetracker_profile_quick_stats_v1` (~150 ms na medição atual).
- Biblioteca/favoritos/atividade entram depois pelo novo `cinetracker_profile_landing_v379` (~1,9 s medido), sem poder substituir o Perfil por erro vermelho.
- Snapshot do Perfil é persistido para reaberturas instantâneas.

### Detalhe
- Remove falso positivo que tratava o texto “Marcar como visto” como evidência de item assistido; estado de Visto passa a exigir estado explícito.

### Release
- Web: `1.0.170 / r379-official-1.0.170`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.169 — 2026-09-25 — Web r378

### Rollback de regressões da r377
- Restaura `cinetracker_home_payload_v359`, removendo a troca regressiva para v334.
- A Home mantém um snapshot em memória entre rotas: ao voltar de Descobrir/Esportes/Detalhe, pinta imediatamente o conteúdo anterior e atualiza em background, sem ficar presa no loader.
- Após qualquer repaint, reaplica a aba escolhida pelo usuário e o início semântico da r375: `Assistir a seguir` em Séries e `Assistir a seguir / Watchlist` em Filmes, com Histórico preservado acima.

### Descobrir / Pra Você
- Remove a autoridade interativa da r377.
- O r321 delega diretamente ao owner r378; o startup r376 não disputa mais o mesmo DOM.
- O r378 usa classes e handlers próprios (`ct378-*`), fora do alcance dos writers antigos `ct336-actions`.
- Slots vazios exibem placeholder sem botões; botões só existem quando há card real.
- `100% novos` preenche Filme/Série/Anime em paralelo com filtro pessoal e fallback TMDB limitado.
- Visto/Watchlist são otimistas e locais; Trocar altera somente o slot clicado e usa lock por slot, sem loop bloqueante.

### Validação
- Gate exige retorno da Home por snapshot em menos de 500 ms, sem loader e com alinhamento semântico.
- Gate rejeita qualquer `.ct336-actions` dentro do novo Pra Você.
- Fresh precisa ter três cards reais e três botões por card; Watchlist precisa ter exatamente dois.
- Oito trocas seguidas na mesma recomendação não podem navegar para o card nem quebrar os botões.

### Release
- Web: `1.0.169 / r378-official-1.0.169`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.168 — 2026-09-25 — Web r377

### Home / Watchlist
- O filtro customizado é substituído por um `select` nativo compacto sobre o ícone ⇅; pointer/click não atravessa mais para os cards.
- Os 1.382 registros continuam presentes por `media_id`, mas os cards voltam ao renderer rico `ct274Row/ct274MovieMeta`: ano, duração, gêneros e nota.
- Cards sem metadados completos são enriquecidos sob demanda quando entram perto do viewport, com cache por TMDB.
- Ordenar muda apenas a propriedade `order` dos mesmos nós DOM; não recria nem redimensiona os cards.
- O retorno para a Home deixa de usar `cinetracker_profile_home_payload_v0997_r6` e usa `cinetracker_home_payload_v334`; se o refresh falhar, a Home em cache é mantida em vez de ser substituída por erro vermelho.

### Descobrir / Pra Você
- Um `Pra Você` válido permanece visível enquanto atualiza; o loader não apaga mais os cards existentes.
- Os três pools de `100% Novos` são preenchidos em paralelo.
- Ações têm área física de 34 px e captura de pointer/click antes da navegação do card.
- A r377 assume a abertura da aba Pra Você: pinta estado disponível imediatamente e atualiza/refaz Fresh em background.

### Validação
- Browser gate usa 1.382 linhas e exige metadados ricos, seis ordens sem navegação/rebuild e altura preservada.
- Um listener hostil de navegação é instalado no teste: tocar no filtro e nos botões do Pra Você não pode alcançá-lo.
- Os três slots 100% Novos precisam ficar preenchidos e três trocas sucessivas não podem quebrar botões nem mudar de rota.

### Release
- Web: `1.0.168 / r377-official-1.0.168`.
- Android: `1.0.20 / versionCode 10062` preservado.

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.166 — 2026-09-25 — Web r375

### Home / início correto após trocar Séries ↔ Filmes
- Corrige a regressão visual mostrada em vídeo: `scrollTop = 0` revelava o Histórico que fica propositalmente acima da tela inicial.
- A troca de aba agora procura semanticamente o primeiro bloco não histórico: `Assistir a seguir` em Séries e `Assistir a seguir / Watchlist` em Filmes.
- O bloco principal é alinhado logo abaixo do toggle Séries/Filmes, tanto para scroll da janela quanto para container interno.
- `Histórico recente` e `Filmes vistos` continuam acima do viewport inicial e permanecem acessíveis rolando para cima.
- Os anchors legados continuam bloqueados durante a troca para não disputar a posição.

### Validação
- Browser gate parte do rodapé, alterna Séries → Filmes e Filmes → Séries, confirmando que o bloco principal fica alinhado e que o Histórico permanece fora da tela acima.
- O teste também exige `scrollTop > 500`, garantindo explicitamente que a implementação não voltou ao zero absoluto.

### Release
- Web: `1.0.166 / r375-official-1.0.166`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.165 — 2026-09-25 — Web r374

### Home / troca Séries ↔ Filmes
- A troca de semi-aba agora zera imediatamente a rolagem da janela e de qualquer ancestral/container interno scrollável da Home.
- O clique é capturado antes dos antigos handlers de anchor (`r327/r328/r331/r332/r335`), impedindo que eles restaurem uma posição antiga ou mantenham a tela no fundo.
- A seleção da aba continua delegada ao owner r371; a r374 assume somente o comportamento de scroll.
- O reset é reafirmado de forma limitada durante a estabilização do layout e é cancelado assim que o usuário inicia uma nova rolagem manual.

### Validação
- Browser gate começa no fundo da aba Séries, troca para Filmes e confirma `window.scrollY = 0` e `scrollTop = 0` no container interno.
- Repete do fundo de Filmes para Séries e confirma o mesmo resultado.
- Um listener legado propositalmente hostil é instalado no teste e confirmado como bloqueado pelo novo owner.

### Release
- Web: `1.0.165 / r374-official-1.0.165`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.164 — 2026-09-25 — Web r373

### Home / Assistir a seguir / Watchlist
- A Home deixa de depender do subconjunto limitado do payload de Home para a Watchlist de filmes e passa a usar `cinetracker_watchlist_full_v119`, cuja consulta não aplica `LIMIT` aos títulos.
- O contador no cabeçalho usa a coleção completa carregada e exibe o total real, inclusive acima de 120.
- O DOM renderiza 80 itens por vez e oferece `Mostrar mais`, mantendo a busca/contagem completas sem montar centenas de nós de uma vez.

### Mini-filtro de ordenação
- Adiciona um botão compacto `⇅` imediatamente ao lado do contador, com popover local e seis opções:
  - Por último adicionado (`added_at` desc, padrão)
  - Primeiro adicionado (`added_at` asc)
  - Último lançado (`release_date`/`first_air_date` desc)
  - Primeiro lançado (`release_date`/`first_air_date` asc)
  - A-Z
  - Z-A
- A ordenação acontece instantaneamente em memória, sem reload, navegação ou nova consulta ao banco.

### Validação
- Browser gate usa 155 itens, confirma contador `155`, paginação DOM inicial de 80, as seis ordenações e URL inalterada.

### Release
- Web: `1.0.164 / r373-official-1.0.164`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.163 — 2026-09-25 — Web r372

### Descobrir / Pra você — layout
- O rodapé de ações passa a ter uma única geometria final em Flexbox (`row`, `nowrap`, `gap: 8px`) com altura fixa de 32 px.
- Botões de ação não encolhem, não quebram linha e não podem ficar ocultos após re-render do card.
- Coração/favorito e controle flutuante do pôster ficam absolutos, 36×36, `z-index: 10` e fundo translúcido com blur.
- O writer geométrico legado da r348 é retirado da build final para não voltar a sobrepor/recolher botões.

### 100% Novos — filtro pessoal estrito
- Antes de renderizar cada `fresh:*`, cruza o pool com a autoridade pessoal canônica da r319.
- Qualquer ID presente em `seen` ou `watch` é removido do estado antes do card ficar visível.
- Se um tipo ficar sem candidato elegível, busca um único novo lote TMDB e filtra novamente antes do render.
- Marcar Visto/Watchlist atualiza imediatamente a autoridade local, impedindo que o mesmo item reapareça no próximo card.

### Validação
- Browser gate injeta itens Vistos e Watchlist nos três pools `fresh:*` e confirma que nenhum sobrevive.
- Executa 15 re-renders dos cards e valida três botões visíveis, Flexbox nowrap e controles flutuantes 36×36/z10 em todas as passagens.

### Release
- Web: `1.0.163 / r372-official-1.0.163`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.162 — 2026-09-25 — Web r371

### Home / Séries e Filmes
- A aba ativa passa a ter uma autoridade própria (`tabRef`) e só muda por clique explícito do usuário.
- `paintHome`, `ct275PaintHome`, `ct274PaintHome` e `renderHome` podem atualizar dados, mas a seleção do usuário é reaplicada imediatamente após cada repaint.
- Clicar em Séries/Filmes aborta o ciclo anterior com `AbortController`, incrementa uma geração lógica e invalida o `episodeRun` assíncrono da r332.
- Respostas tardias de reconciliação de episódios não podem mais devolver a Home para Séries depois que o usuário escolheu Filmes.
- O estado visual do botão, `aria-selected`, `hidden` e classe `hidden` são sincronizados pela mesma autoridade.

### Validação
- Browser gate seleciona Filmes, executa 10 repaints forçados que recriam o DOM com Séries como padrão e valida que Filmes continua ativo.
- Em seguida conclui um `renderHome()` assíncrono tardio e confirma novamente que a aba permanece em Filmes.

### Release
- Web: `1.0.162 / r371-official-1.0.162`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.161 — 2026-09-25 — Web r370

### Descobrir / Pra você
- Substitui o algoritmo de troca por **pré-filtro único em memória**: `candidatePool.filter(...)` seguido de `Math.floor(Math.random() * eligibleItems.length)`.
- Remove qualquer `while`, `do...while` e recursão da autoridade final `handleSwap`.
- Se o array elegível estiver vazio, faz **uma única** busca assíncrona de lote e filtra novamente uma vez; não existe retry recursivo.
- Adota trava síncrona física `swapLockRef.current`, equivalente a `useRef`, antes do primeiro `await`.
- Mantém `AbortController` e timeout máximo de 3 segundos para a consulta TMDB.
- Continua respeitando sessão excluída, Vistos/Watchlist através da autoridade pessoal, WWE, nota mínima e ano.
- Pool final limitado a 80 itens por slot.

### Validação de estresse
- Browser gate executa **35 trocas consecutivas**, exigindo item diferente a cada troca, lock sempre liberado e heartbeat da main thread ativo.
- Em seguida dispara **40 cliques rápidos** e confirma que o lock síncrono aceita no máximo uma troca concorrente e rejeita as demais sem bloquear a UI.

### Release
- Web: `1.0.161 / r370-official-1.0.161`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.160 — 2026-09-25 — Web r369

### Esportes / F1
- Neutraliza todos os caminhos de marcação assistida ativos (r255, r263, r296, r299 e r301).
- Remove dos fluxos de clique qualquer `loadSports255(true)`, `paintSports255()`, `render()`, recarga de histórico F1 e `cinetracker:data-changed`.
- Todos os botões envolvidos usam `type="button"`; handlers chamam `preventDefault()`, `stopPropagation()` e, nos owners legados, `stopImmediatePropagation()`.
- A UI muda de forma otimista no card/botão local; Supabase persiste em background e falhas fazem rollback local.

### Descobrir / Pra você
- r369 vira o owner final do `Trocar`, sem `MutationObserver`.
- Desativa o observer de refill da r363 e o observer global da r367 na build final.
- Remove o `while` do sorteio de páginas e limita a varredura a 240 itens / 100 ms.
- Usa `AbortController` real no TMDB, com timeout estrito de 3 segundos e cancelamento de requisição anterior.
- Pool por slot é limitado a 60 itens; quando não há item inédito, usa fallback limitado no pool existente sem bloquear a main thread.

### Validação
- Teste de navegador executa 20 trocas sequenciais, verifica heartbeat da main thread e botão sempre liberado.
- Teste de formulário executa 5 marcações esportivas e confirma zero submits e URL inalterada.

### Release
- Web: `1.0.160 / r369-official-1.0.160`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.159 — 2026-09-25 — Web r368

### Descobrir / Pra você
- Adiciona lock `isSwapping` durante cada troca e libera obrigatoriamente o botão em `finally`.
- Mantém `session_excluded_ids` em `sessionStorage` para impedir repetição de mídias já exibidas na sessão.
- Amplia o pool com páginas aleatórias do TMDB e escolhe a próxima mídia com `Math.random()`.
- Preserva filtros de Vistos, Watchlist quando aplicável, WWE, nota, ano e auditoria pessoal.

### Esportes / F1
- Marcar/desmarcar assistido passa a ser otimista e persiste no Supabase em segundo plano.
- Remove do toggle `loadSports255(true)`, `paintSports255()`, `enhanceF1Watch263(true)` e `cinetracker:data-changed`.
- Sem reload, repaint global ou refetch global; falha reverte somente o card afetado.
- Perfil recebe atualização local pelo evento `cinetracker:sports-watched-changed`.

### Release
- Web: `1.0.159 / r368-official-1.0.159`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.143 — 2026-09-23 — Web r352

### Descobrir / ações de card
- Elimina qualquer repaint global do `Pra você` ao clicar em `Trocar`, `✓ Visto` ou `+ Watchlist`.
- `Trocar` altera apenas o slot clicado, de forma imediata e sem chamada ao backend.
- `✓ Visto` e `+ Watchlist` usam estado otimista: o card clicado é substituído imediatamente e a persistência ocorre em segundo plano.
- Em falha de rede, somente o slot afetado é revertido e um toast discreto é exibido.
- Os handlers chamam `preventDefault`, `stopPropagation` e `stopImmediatePropagation`, evitando navegação/submissão acidental.
- Não há `window.location.reload()`, `router.refresh()`, `router.push()`, `renderDiscover()`, `loadForYou()` nem `paintForYou336()` no fluxo de clique r352.
- Em Top 10/Populares e demais listas públicas, `+ Watchlist` muda imediatamente para `✓ Salvo` e persiste em segundo plano sem trocar o card.
- A transição local usa `transition-opacity duration-300 ease-in-out`.

### Release
- Web: `1.0.143 / r352-official-1.0.143`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.127 — 2026-09-22 — Web r336

### Busca
- Amplia a busca global para filmes, séries, atores/pessoas e nomes de episódios.
- Adiciona `cinetracker_episode_search_v336` para títulos de episódios presentes no histórico/cache do usuário.
- Adiciona `cinetracker_episode_search_targets_v336` para selecionar séries acompanhadas que podem precisar de consulta episódica ao TMDB.
- Faz busca ao vivo na temporada corrente para episódios ainda não persistidos localmente e aceita pequenas diferenças ortográficas, como `Unraveling` / `Unravelling`.

### Home
- Preserva o histórico de Séries e Filmes no fluxo normal acima da seção de entrada, sem botão.
- Ao clicar em Séries ou Filmes, um único listener prioritário troca a aba e alinha diretamente em `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Remove a interferência de listeners legados concorrentes durante a troca de abas.

### Descobrir / Pra você
- Restaura `Todos / Filmes / Séries / Animes` como filtro interno do próprio `Pra você`.
- `Da sua Watchlist`: somente `Visto + Trocar`.
- `100% novos` e `Indicação do Dia`: `Watchlist + Visto + Trocar`.
- Todas as ações ficam em uma única linha compacta no tamanho do card.
- Qualquer ação troca o card imediatamente; Watchlist/Visto persistem em seguida.
- Mantém `cinetracker_discover_filter_v333` como auditoria final de vistos, progresso, Watchlist e Não interessado.

### Release
- Web: `1.0.127 / r336-official-1.0.127`.
- Android: `1.0.20 / versionCode 10062` preservado.
- F1 Hub, Esportes e contagens do Perfil não são alterados.

## 1.0.126 — 2026-09-22 — Web r335

### Home
- Mantém o histórico de Séries e Filmes carregado no fluxo normal, sem botão e sem scroll interno.
- Mantém a ordem cronológica ascendente no DOM: mais antigos acima e mais recentes imediatamente antes do conteúdo atual.
- Faz um único alinhamento em `Assistir a seguir` / `Assistir a seguir / Watchlist`.
- Adiciona trava curta de aba para impedir que um repaint antigo troque Filmes de volta para Séries.
- Aposenta os últimos loops automáticos de posicionamento da r332/r334.

### Descobrir
- Remove a faixa temporária `Todos / Filmes / Séries / Animes` do topo e zera seu espaço de layout.
- Reseta o filtro interno para `all`, evitando filtro invisível.
- Mantém r329 como renderer final do `Pra você` após a auditoria v333.
- Garante três ações por card — Watchlist, Visto e Trocar — em uma única linha compacta.
- Mantém `cinetracker_discover_filter_v333` como autoridade para vistos/progresso/Watchlist/Não interessado.
- Mantém Top 10 progressivo até 10 elegíveis após a auditoria.

### Estabilidade
- A r335 não adiciona MutationObserver.
- Teste de navegador cobre Home Filmes sem retorno automático a Séries, remoção dos filtros superiores, recuperação do Trocar, auditoria do Pra você, troca rápida de abas e refill do Top 10.

### Release
- Web: `1.0.126 / r335-official-1.0.126`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.125 — 2026-09-22 — Web r334

### Home / navegação
- Adiciona `cinetracker_home_series_watch_state_v4` e `cinetracker_home_payload_v334`.
- Remove o principal gargalo do estado consolidado de séries, reduzindo o benchmark de ~5,7 s para ~0,27 s.
- Remove a segunda atualização de histórico da r331, já redundante porque o payload atual traz o histórico canônico.
- Mantém o histórico no fluxo da página, sem botão e sem scroll interno.
- Mantém apenas r332 como autoridade de posicionamento inicial da Home.
- Desativa observers concorrentes de r327/r328/r329/r331/r333 que podiam repintar a interface durante navegação.

### Descobrir
- Mantém `cinetracker_discover_filter_v333` como autoridade, incluindo `watch_play_events` e aliases de título/ano.
- Filtros do Pra você passam a ser diretos e idempotentes.
- Watchlist, Visto e Trocar ficam em uma linha compacta em todos os renderers conhecidos.
- Top 10 continua progressivo até 10 elegíveis por rail.

### Performance
- Sports não faz warmup em segundo plano durante Home/Descobrir.
- Remove prefetch/normalização redundantes que competiam durante trocas de abas.

### Release
- Web: `1.0.125 / r334-official-1.0.125`.
- Android: `1.0.20 / versionCode 10062` preservado.

## 1.0.124 — 2026-09-22 — Web r333

### Home
- Adiciona `cinetracker_home_payload_v333`.
- Consolida duplicatas de séries antes do primeiro paint; Citadel/Stuart deixam de anunciar episódios já assistidos ou não lançados.
- Filmes da Watchlist da Home passam a exigir: estar na Watchlist atual, já ter sido lançado e ainda não ter sido visto.
- Histórico continua no fluxo da página acima do ponto inicial, sem botão e sem scroll interno.
- Reduz reposicionamentos automáticos e remove o observer de scroll/repaint da r332.

### Descobrir
- Adiciona `cinetracker_discover_filter_v333`, incluindo eventos de reprodução na autoridade de vistos.
- Remove setas laterais e botão de filtro antigo; filtros ficam inline.
- Pra você mantém Todos / Filmes / Séries / Animes e força Watchlist + Visto + Trocar em três colunas compactas.
- Remove prefetch agressivo ao entrar no Descobrir.
- Top 10 busca páginas progressivamente até 10 elegíveis por rail e faz auditoria final v333.
- Remove a faixa vazia superior do Top 10.

### Esportes
- Abertura do site aquece o payload de Esportes e dispara sincronização de provedores em segundo plano.
- Após a sincronização, o payload é recarregado para a aba abrir com dados recentes sempre que possível.

### Escopo
- Web: `1.0.124 / r333-official-1.0.124`.
- Perfil/Watchlist permanece na autoridade r324.
- F1 Hub preservado.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.123 — 2026-09-22 — Web r332

### Home
- Remove qualquer dependência de botão para revelar o histórico; histórico de Séries e Filmes permanece no fluxo normal acima do conteúdo atual.
- Corrige o ponto inicial para não deixar uma faixa do histórico aparente após repaints assíncronos.
- Cancela o reposicionamento automático quando o usuário inicia scroll.
- Reaplica o estado lógico consolidado das séries antes de exibir o próximo episódio.
- Impede ponteiro de próximo episódio anterior ou igual ao último episódio já assistido.
- Refresh de metadados episódicos volta a ser tentável após falha e recebe uma tentativa forçada em segundo plano por sessão.

### Descobrir
- Pra você deixa de aceitar o r309 como renderer final.
- Faz auditoria final com `cinetracker_discover_filter_v326` e pinta apenas com o r329.
- Mantém `Da sua Watchlist` restrita a Watchlist não vista e `100% novos`/Indicação sem vistos, progresso, Em dia, concluídos, Watchlist e Não interessado.
- Restaura de forma determinística os filtros Todos / Filmes / Séries / Animes.
- Watchlist, Visto e Trocar ficam em uma única linha compacta.
- Preserva cache de fontes TMDB quando muda apenas o estado pessoal, deduplica requests concorrentes e pré-carrega abas públicas em segundo plano.
- Top 10 mantém refill progressivo 10 Séries + 10 Filmes e auditoria final v326.

### Escopo
- Web: `1.0.123 / r332-official-1.0.123`.
- Android permanece `1.0.20 / versionCode 10062`.
- Perfil/Watchlist, Esportes e F1 Hub preservados.

## 1.0.121 — 2026-09-22 — Web r330

### Home · desempenho / navegação
- Remove o contrato r285 de aguardar reconciliação completa de até dezenas de séries antes do primeiro paint.
- A Home pinta primeiro o payload do banco e reconcilia episódios em segundo plano.
- Reconciliação antiga é impedida de repintar após mudança de rota.
- O refresh remoto de TV é adiado para depois da primeira tela e só inicia se a Home continuar ativa.
- Mantém o histórico r328 acima da área inicial, sem botão e sem scroll interno.

### Descobrir · Pra você
- Watchlist + Visto + Trocar passam a usar grid final de três colunas iguais.
- Botões têm altura fixa, `nowrap` e o Trocar não pode cair para outra linha.

### Descobrir · Top 10
- Remove o cabeçalho `Top 10` redundante dentro da área e o segundo texto com o nome do streaming.
- Reduz o espaço vertical entre tabs, streamings e listas.
- Mantém refill até dez elegíveis e adiciona auditoria v326 imediatamente antes do paint.
- Harry Potter foi usado como regressão de dados: os oito filmes informados como vistos retornam bloqueados pela autoridade atual.

### Escopo
- Web: `1.0.121 / r330-official-1.0.121`.
- Perfil, Esportes e F1 Hub sem mudanças funcionais.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.120 — 2026-09-21 — Web r329

### Descobrir · layout
- Corrige a regressão visual em que cards do Pra você eram comprimidos para três colunas e o botão Trocar caía para baixo/encostava no bloco seguinte.
- Restaura cards de 154 px no mobile e 176 px no desktop, proporção 2:3.
- Filme / Série / Anime passam a rolar horizontalmente dentro de cada seção, sem scrollbar horizontal no documento.
- Watchlist + Visto + Trocar ficam em uma linha única, com altura fixa e classes exclusivas da r329.
- Slots vazios não ocupam um card fantasma.
- Abas públicas e Top 10 recebem a mesma geometria padrão e ações sem quebra.

### Regras preservadas
- Mantém `cinetracker_discover_filter_v326` como autoridade estrita antes do HTML.
- Mantém refill do Top 10 até dez elegíveis e cancelamento de refill ao trocar de aba.
- Preserva filtros Todos / Filmes / Séries / Animes.

### Escopo
- Web: `1.0.120 / r329-official-1.0.120`.
- Home, Perfil, episódios, Esportes e F1 sem alterações.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.119 — 2026-09-21 — Web r328

### Home
- Restaura o contrato r276: histórico renderizado acima da área inicial, sem botão e sem scroller interno.
- Séries abre em `Assistir a seguir`; Filmes abre em `Assistir a seguir / Watchlist`.
- Trocar Séries/Filmes redefine a posição da página para o início correto da respectiva aba.
- O item mais recente do histórico permanece imediatamente acima da área normal; itens mais antigos ficam progressivamente mais acima.

### Descobrir
- `Pra você` passa a usar markup final próprio para eliminar a quebra de linha herdada da r309.
- Watchlist + Visto + Trocar ficam na mesma linha, com três colunas compactas e cards 2:3 de largura uniforme.
- Filtros `Todos / Filmes / Séries / Animes` ficam sempre visíveis no Pra você e atuam sem recarregar.
- As abas públicas continuam sendo filtradas por `cinetracker_discover_filter_v326` antes do HTML.
- Top 10 mantém a mesma autoridade, preenche até dez elegíveis e interrompe páginas extras quando o usuário muda de aba.

### Preservado
- r324: contagens/ordenação das Watchlists.
- r325: consolidação de episódios e atualização de série.
- Esportes e F1 Hub sem alterações.
- Android `1.0.20 / versionCode 10062`.
- Web `1.0.119 / r328-official-1.0.119`.

## 1.0.118 — 2026-09-21 — Web r327

### Home
- Histórico de Séries e Filmes deixa de ser um scroll interno e deixa de usar botão.
- Histórico permanece carregado acima do conteúdo normal; troca Série ↔ Filme reposiciona a página no início normal de cada aba.
- Rolar para cima revela primeiro os registros mais recentes e, continuando, os mais antigos.
- Mantida a autoridade de histórico da r325/r323.

### Descobrir · Pra você
- Watchlist, Visto e Trocar ficam em uma única linha flexível e minimalista sem alterar o tamanho dos cards.
- Filtros Todos / Filmes / Séries / Animes reaplicados diretamente após cada repaint.
- Remove refill sequencial de até cinco rodadas; refill adicional é único e paralelo.

### Descobrir · Top 10
- Remove Mubi e Looke da seleção de streamings.
- Mantém `cinetracker_discover_filter_v326` como autoridade autenticada para Visto/Watchlist/Progresso.
- Top 10 busca páginas em lotes paralelos e completa até 10 elegíveis.
- Exibe 10 cards integralmente no grid; fallback 5×2 em telas estreitas.

### Preservação
- Sincronização de episódios r325 preservada.
- Watchlist do Perfil r324 preservada.
- F1 Hub e Esportes não alterados.
- Web: `1.0.118 / r327-official-1.0.118`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.117 — 2026-09-21 — Web r326

### Home / Histórico
- Restaura o comportamento pré-r275 dos históricos de Séries e Filmes.
- Remove da interface os controles `Ver histórico / Ocultar histórico`.
- Mantém o conteúdo carregado e rolável, com ordenação cronológica ascendente dentro do container e posicionamento automático no fundo, deixando o registro mais recente imediatamente acessível e os antigos acima.

### Descobrir
- Adiciona `cinetracker_discover_filter_v326`.
- O filtro cruza candidatos com todas as mídias do usuário por TMDB ou aliases de título original/localizado + ano, inclusive quando a duplicata histórica já tem outro TMDB efetivo.
- `Pra você` passa a recompor os pools depois da validação exata e busca candidatos adicionais quando a filtragem esvazia Filme/Série/Anime ou Indicação do Dia.
- Durante a validação, o draft antigo fica oculto para evitar flash de conteúdo proibido.
- Força Watchlist + Visto + Trocar na mesma linha compacta e sem quebra no `Pra você`.
- Mantém Watchlist + Visto lado a lado nas demais abas.
- Top 10 preserva o preenchimento até 10 elegíveis e usa a autoridade v326.

### Preservações
- Sincronização de episódios novos da r325 preservada.
- Contadores/ordenação das Watchlists do Perfil preservados.
- F1 e Esportes inalterados.
- Web: `1.0.117 / r326-official-1.0.117`.
- Android: `1.0.20 / versionCode 10062`.

## 1.0.116 — 2026-09-20 — Web r325

### Home / Histórico
- Adiciona `cinetracker_home_history_v324` como autoridade para pré-carregar histórico de episódios e filmes antes do paint.
- Mantém os dois históricos recolhidos na abertura, sem depender de lazy-load quando o usuário expande.

### Home / Séries e episódios novos
- Adiciona `cinetracker_home_series_watch_state_v2`.
- Consolida progresso de fichas duplicadas pelo TMDB efetivo, incluindo contagem assistida, chaves S/E, último S/E e último horário assistido.
- Corrige combinações inconsistentes de contagem e episódio atual causadas por progresso dividido entre mídia legada e mídia canônica.
- Ativa `ct-refresh-tv-state-user` a partir do Home para atualizar metadata episódica quando a data do próximo episódio já passou ou a ficha está velha.
- Após atualização, o Home reconcilia o TMDB atual e calcula novamente episódios lançados, episódio seguinte não visto e quantidade disponível.
- Episódio recente lançado e ainda não visto recebe marca `NOVO`.

### Preservações
- Mantém a r324 para botões compactos do Descobrir, filtro Top 10 contra vistos legados, Watchlists completas/contadores corretos e ordenação.
- Web: `1.0.116 / r325-official-1.0.116`.
- Android permanece `1.0.20 / versionCode 10062`.
- Esportes e F1 não foram alterados.

## 1.0.115 — 2026-09-20 — Web r324

### Home
- Séries e Filmes passam a iniciar com o histórico já carregado porém recolhido.
- Adiciona controle independente `Ver histórico / Ocultar histórico` para cada aba, sem lazy-load do conteúdo.

### Descobrir
- Compacta as ações do `Pra você` em uma única linha: Watchlist, Visto e Trocar.
- Mantém Watchlist + Visto em uma única linha nas abas públicas e Top 10, inclusive em viewport estreita.
- Adiciona `cinetracker_discover_filter_v324`: aliases de título original + ano são unidos ao match TMDB direto, em vez de serem ignorados quando existe uma ficha positiva.
- Corrige títulos vistos importados que reapareciam no Top 10, incluindo a duplicidade legado/atual da franquia Harry Potter.

### Perfil / Watchlist
- O modal deixa de usar a lista r316 que descartava `tmdb_id <= 0`.
- Passa a renderizar todas as linhas de `cinetracker_watchlist_full_v119`.
- O cabeçalho usa os contadores do RPC, preservando os totais completos de Séries e Filmes.
- Registros legados sem TMDB positivo permanecem visíveis na lista, sem tentar abrir uma rota TMDB inválida.

### Release
- Web: `1.0.115 / r324-official-1.0.115`.
- Android permanece `1.0.20 / versionCode 10062`.
- Esportes e F1 não foram alterados.

## 1.0.114 — 2026-09-20 — Web r323

### Home
- Corrige `Filmes vistos` para incorporar reproduções de `watch_play_events_v0994` e manter fallback do `watch_history` legado.
- O histórico passa a refletir filmes recentes mesmo quando o registro canônico antigo não foi atualizado.

### Descobrir
- Adiciona `cinetracker_discover_filter_v323` com reconciliação por TMDB e, para registros legados sem TMDB válido, por título original/localizado + ano.
- `Pra você` mantém `Da sua Watchlist` apenas para Watchlist ainda não vista e `100% novos`/Indicação somente para itens desbloqueados.
- Top 10 busca páginas adicionais até obter 10 séries e 10 filmes elegíveis por streaming, limitado a cinco páginas.

### Perfil / Watchlist
- Adiciona seletor de ordenação visível em Filmes Watchlist e Séries Watchlist.
- Opções: Último adicionado, Primeiro adicionado, A–Z, Z–A, Ano mais recente e Ano mais antigo.

### Release
- Web: `1.0.114 / r323-official-1.0.114`.
- Android permanece `1.0.20 / versionCode 10062`.
- F1 Hub e Esportes não foram alterados.

## 1.0.113 — 2026-09-20 — Web r322

### Descobrir
- Corrige o travamento observado no vídeo em `Carregando...` / `Montando Top 10...`.
- Adiciona `cinetracker_discover_filter_v322`, usando a chave lógica TMDB indexada para cruzar candidatos com Watchlist, histórico e progresso do usuário.
- Mantém a exclusão antes da renderização para vistos, progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado.
- Top 10 volta a usar a autoridade/cache `ct171TopRows` e aplica o mesmo filtro antes de montar as duas listas.
- Pra você mantém as regras e filtros já aprovados.
- Calendário mantém a exceção de Watchlist.

### Escopo
- Alteração somente em Descobrir.
- Perfil/Histórico, Esportes e F1 Hub permanecem inalterados.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.113 / r322-official-1.0.113`.

## 1.0.112 — 2026-09-20 — Web r321

### Descobrir
- Reverte o mecanismo da r320 que ocultava cards enquanto aguardava validação e podia deixar `Pra você` e outras abas em branco.
- A validação pessoal agora ocorre dentro do carregamento da aba e antes do renderer.
- Mantém `cinetracker_discover_filter_v320` como autoridade exata para Visto, progresso, Em dia, Concluído, Watchlist, Assistir depois e Não interessado.
- `Pra você`, Top 10 e as seis abas públicas voltam a carregar normalmente sem depender de MutationObserver para liberar conteúdo.

### Perfil / Histórico
- Mantém o histórico diário baseado em `watch_history`, a mesma fonte de mídia usada pela Home.
- Mantém temporada/episódio, nome do episódio, nota, data, episódios restantes e reproduções no detalhe diário.

### Escopo
- Web: `1.0.112 / r321-official-1.0.112`.
- Android permanece `1.0.20 / versionCode 10062`.
- Nenhuma alteração em F1 Hub.

## 1.0.111 — 2026-09-20 — Web r320

### Descobrir
- Adiciona `cinetracker_discover_filter_v320`, que valida cada candidato diretamente contra Watchlist, histórico, progresso e estados do usuário.
- A validação usa TMDB ID e fallback por título/ano para cobrir registros legados.
- Cards públicos ficam ocultos até serem validados; itens vistos, em progresso, em dia, concluídos, na Watchlist ou não interessados são removidos antes de ficarem visíveis.
- O mesmo cruzamento é aplicado ao Top 10.
- No `Pra você`, `Da sua Watchlist` exige Watchlist + não visto; `100% novos` e Indicação do Dia exigem item totalmente desbloqueado.

### Perfil / Histórico
- Substitui a fonte divergente de atividade por `cinetracker_activity_by_day_v320` e `cinetracker_activity_items_by_day_v320`.
- Episódios e filmes passam a vir do mesmo `watch_history` usado pela Home.
- O detalhe diário preserva temporada/episódio, título do episódio, nota, data, episódios restantes e reproduções.
- Eventos esportivos continuam aparecendo no Perfil sem alterar a autoridade de mídia da Home.

### Escopo
- Web: `1.0.111 / r320-official-1.0.111`.
- Android permanece `1.0.20 / versionCode 10062`.
- Nenhuma alteração em F1 Hub.

## 1.0.110 — 2026-09-19 — Web r319

### Descobrir
- Corrige a barreira pessoal que permitia títulos já vistos ou já salvos reaparecerem em abas públicas.
- Adiciona o RPC autenticado `cinetracker_discover_blocked_v319`, baseado em TMDB efetivo e no dashboard canônico do usuário.
- Expõe separadamente `blocked_keys`, `seen_keys` e `watch_keys`, além de aliases de título/ano.
- Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Top 10 consultam a autoridade pessoal novamente antes de cada render.
- Se a autoridade pessoal falhar, a tela não renderiza catálogo sem filtro: comportamento fail-closed.
- Mantém `Pra você` e Calendário com as exceções previamente autorizadas.

### Escopo
- Nenhuma alteração em Perfil, Esportes ou F1 Hub.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.110 / r319-official-1.0.110`.

## 1.0.109 — 2026-09-19 — Web r318

### Descobrir
- Adiciona filtro funcional no `Pra você`: Todos, Filmes, Séries e Animes.
- Preserva as regras canônicas do `Pra você`, incluindo pools independentes, `Trocar`, ações Watchlist/Visto e exclusões de frescor/qualidade já aprovadas.
- Aplica exclusão estrita antes da renderização em Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados.
- Títulos já vistos ou na Watchlist não entram no HTML dessas áreas; progresso, Em dia e aliases visuais também permanecem excluídos.
- Top 10 mantém todos os streamings disponíveis e duas listas por provedor: Séries e Filmes.
- Corrige janelas de Novidades (-30d), Lançamentos (-7d/+30d) e Mais Aguardados (a partir de amanhã).
- Mantém Calendário como exceção autorizada de Watchlist.
- Mantém cache de 5 minutos e prefetch.

### Escopo
- Nenhuma alteração em Perfil, Esportes ou F1 Hub.
- Android permanece `1.0.20 / versionCode 10062`.
- Web: `1.0.109 / r318-official-1.0.109`.

## 1.0.108 — 2026-09-19 — Web r317

### Perfil
- Corrige definitivamente `Filmes Watchlist`: o card passa a abrir a lista completa pelo rótulo no primeiro capture listener, antes dos bloqueadores legados.
- Mantém `Séries Watchlist` com o mesmo contrato.
- Corrige o alias singular `Tempo de filme em Watchlist` para preservar a ordem exata das dez estatísticas.

### Build / validação
- Web: `1.0.108 / r317-official-1.0.108`.
- Android permanece `1.0.20 / versionCode 10062`.
- Adiciona teste Chromium que remove propositalmente os datasets do card de filmes e valida que o clique ainda abre a Watchlist apenas pelo rótulo.

## 1.0.107 — 2026-09-19 — Web r316

### Perfil
- Restaura a ordem visual aprovada do r237 para as dez estatísticas.
- Restaura os cards Séries Watchlist e Filmes Watchlist como botões funcionais, abrindo a lista completa.
- Mantém a fonte esportiva canônica e o recolher conjunto de Estatísticas + Esportes assistidos.

### F1 Hub
- Mantém apenas Visão geral, Calendário, Classificações e Circuitos.
- Continua removendo o painel legado de registro da Fórmula 1.
- Remove a mensagem falsa `Temporada encerrada` quando a agenda está incompleta e passa a sinalizar `Agenda ainda não sincronizada`.

### Build / validação
- Web: `1.0.107 / r316-official-1.0.107`.
- Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressão Chromium para ordem física, abertura das duas Watchlists e verdade do F1 Hub.

## 1.0.106 — 2026-09-18 — Web r315

### Descobrir
- Restaura o `Pra você` aprovado da r309, com Watchlist, Visto e Trocar nos slots corretos.
- Restaura o Top 10 por streaming da r288, com duas listas independentes para cada provedor: `Top 10 Séries` e `Top 10 Filmes`.
- Reaplica antes do HTML a exclusão estrita de vistos e Watchlist em Em alta, Populares, Novidades, Lançamentos, Mais Aguardados e Mais bem avaliados.
- Remove o contrato de ação única da r314 e recupera Watchlist + Visto nas seis abas públicas.
- Mantém cache de 5 minutos e prefetch em segundo plano para troca rápida entre abas.

### F1 Hub
- Remove o painel legado `Seu registro / Fórmula 1 assistida`, inclusive contra reinserções tardias do runtime r263.
- Preserva detalhes do GP, qualificação, resultado, Δ, DNF, volta mais rápida e marcação individual de sessões.

### Perfil
- Restaura a ordem física de estatísticas da r238.
- Volta a buscar `cinetracker_sport_stats_v1` em paralelo ao payload do Perfil; o tempo esportivo deixa de ser zerado por ausência de `sports_stats` em `cinetracker_profile_payload_v0997`.
- Restaura as ações de histórico em Eventos assistidos e Jogos no Estádio.
- O controle Recolher/Expandir volta a controlar em conjunto Estatísticas e Esportes assistidos.
- Séries Watchlist e Filmes Watchlist permanecem estáticas, sem chevron/modal.
- Mantém Atores Favoritos com geometria uniforme e overflow horizontal somente no rail.

### Build / validação
- Web atualizada para `1.0.106 / r315-official-1.0.106`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões estática e Chromium específicas para os contratos restaurados.

## 1.0.105 — 2026-09-18 — Web r314

### Perfil
- Elimina o fallback de cache antigo do paint final: estatísticas gerais e esportivas passam a refletir o payload atual do Supabase e permanecem estabilizadas no topo do Perfil.
- Transforma `Séries Watchlist` e `Filmes Watchlist` em contadores estritamente estáticos, removendo chevrons, links, `data-watchlist-kind`, cursor de ação e qualquer gatilho de modal.
- Padroniza os cards/fotos de Atores Favoritos e restringe `overflow-x:auto` exclusivamente ao rail real dos atores.

### Descobrir
- Restaura `Lançamentos` e volta a nove sub-abas canônicas.
- Aplica exclusão estrita de vistos + Watchlist + aliases antes do HTML em `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados` e `Mais bem avaliados`.
- Reutiliza o `+` minimalista de Watchlist em todos os cards públicos.
- Introduz cache stale-while-revalidate de 5 minutos, revalidação em segundo plano e prefetch das fontes públicas.
- Compacta `Da sua Watchlist` e `100% novos` em três slots Filme/Série/Anime com proporção 2:3.

### F1 Hub
- Calendário e GPs anteriores da Visão Geral passam a abrir um drawer dedicado do GP.
- O drawer consulta classificação e resultado da etapa selecionada, exibindo Grid de Largada, Q1/Q2/Q3, resultado final, Δ de posições, DNF e volta mais rápida.
- Sessões individuais usam persistência própria por usuário com IDs `f1:temporada:etapa:sessão`.

### Backend / segurança
- Adiciona `user_f1_session_watch` com RLS por `profile_id` e RPCs `cinetracker_f1_session_watch_history_v314` / `cinetracker_f1_session_watch_set_v314` como `SECURITY INVOKER`.
- Remove o writer F1 `SECURITY DEFINER` da tentativa anterior e reconcilia o histórico de migrations já aplicado em produção.

### Build / validação
- Web atualizada para `1.0.105 / r314-official-1.0.105`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões estática e Chromium para nove abas, exclusão estrita, `+` minimalista, Perfil estático/atores, detalhes da F1 e persistência de sessões.

## 1.0.104 — 2026-09-18 — Web r313

### Descobrir
- Reverte o renderer visual próprio da r312 e restaura o card aprovado `ct288Card`; nenhum `ct312-card`/banner é permitido no bundle final.
- `Todos / Filmes / Séries` volta a ficar oculto por padrão e é aberto somente pelo botão compacto `☷`.
- Mantém as oito abas visíveis durante loading, scroll horizontal nativo e título/metadados sem corte.
- As cinco abas públicas aplicam visto + Watchlist + identidade visual antes da montagem do HTML e mantêm `+ Watchlist` + `✓ Visto`.
- `Pra Você` reutiliza a autoridade exata r309 com acabamento compacto.

### Esportes
- Move a responsabilidade do filtro para o produtor real `paintSports255`.
- `Próximos` e `Anteriores` recebem, dentro do próprio `panel-head`, `Todos` mais todos os esportes retornados em `payload.sports`.
- Remove o produtor global antigo `.ct255-sport-filters`; `Assistidos` e demais abas não recebem o filtro inline.

### Perfil
- Substitui a cadeia herdada final por `renderProfile313`, com um único estado de carregamento e um único paint canônico.
- Garante `Jogos no Estádio` e unifica o visual de `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist`, preservando os contratos de clique.
- Mantém histórico esportivo canônico e atualização de atores favoritos da r312.

### Preservações
- JWT expirado continua renovando sessão e repetindo uma vez.
- F1 r311 permanece clicável, com detalhe completo e marcação por sessão.
- Android permanece `1.0.20 / versionCode 10062`.

## 1.0.103 — 2026-09-18 — Web r312

### Descobrir
- Adota um shell único com oito abas persistentes; trocar de aba ou carregar títulos não pode mais apagar/recriar a navegação.
- Nas cinco abas públicas, cruza Watchlist completa, dashboard pessoal e exclusões canônicas antes do HTML, removendo itens vistos ou já salvos.
- Substitui cards herdados por cards r312 próprios, com metadados sem truncamento e `+ Watchlist` + `✓ Visto` em faixa estável abaixo do pôster.
- Mantém scroll horizontal nativo no rail e alinha os controles pela altura final dos cards.
- `Pra Você` reutiliza os pools exatos 1+3+3 da r309, mas com layout compacto e controles pequenos/estáveis.

### Sessão / autenticação
- Se uma chamada protegida retornar JWT expirado/401, renova a sessão com o `refresh_token`, persiste a nova sessão e repete a operação uma vez.
- O fluxo cobre API/RPC, Edge Functions e TMDB proxy protegido, eliminando `Falha ao carregar Esportes: JWT expired` quando a sessão ainda pode ser renovada.

### Perfil
- Garante `Jogos no Estádio` mesmo quando o payload inicial não produzir o card, clonando o contrato visual/clicável de `Eventos assistidos`.
- Lê Atores Favoritos diretamente da tabela `favorite_actors` e invalida/atualiza o Perfil imediatamente após gravações, cobrindo novos favoritos adicionados durante a sessão.

### Esportes
- Remove o filtro global antigo.
- Insere em `Próximos` e `Anteriores`, ao lado do título, um filtro horizontal com `Todos` e todos os esportes disponíveis em `payload.sports`.
- O filtro é dinâmico: novos esportes suportados pelo payload aparecem sem alteração de código.

### F1 / preservação
- Mantém a autoridade r311: Calendário clicável, fim de semana completo, Grid de Largada, Resultado de Chegada e marcação por sessão.

### Build / validação
- Web atualizada para `1.0.103 / r312-official-1.0.103`; Android permanece `1.0.20 / versionCode 10062`.
- Chromium cobre shell durante loading, barreira vistos+Watchlist, cards/scroll, Pra Você compacto, estádio, atualização de ator favorito e filtros esportivos inline.

## 1.0.102 — 2026-09-18 — Web r311

### Perfil / Estatísticas
- Unifica `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist` pela mesma classe/contrato visual final, usando `Eventos assistidos` como referência.
- Neutraliza as autoridades visuais tardias r300/r301, impedindo que os cards troquem de versão após o primeiro paint.
- Preserva os contratos de clique já existentes para histórico esportivo, estádio e Watchlists.

### F1 Hub
- O Calendário passa a renderizar cada GP como botão clicável `Abrir corrida`, em vez de artigos sem ação.
- O modal de corrida reúne fim de semana, Grid de Largada e Resultado de Chegada.
- Sessões já iniciadas podem ser marcadas/desmarcadas individualmente como assistidas usando IDs estáveis `f1:temporada:etapa:sessão` e `cinetracker_sports_watch_set_v296`.
- O objeto completo de cada GP permanece estável entre repaints do calendário, evitando botão visível sem dados ao clicar.

### Descobrir
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` têm um único renderer final.
- A exclusão de vistos e Watchlist ocorre antes da montagem do HTML.
- Remove o `+` legado sobreposto ao card; `+ Watchlist` e `✓ Visto` ficam em uma faixa estável abaixo do card e fora do elemento de mídia.

### Build / validação
- Web atualizada para `1.0.102 / r311-official-1.0.102`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium exige igualdade visual dos quatro controles do Perfil, clique real do GP, persistência da sessão de F1 e ações estáveis/exclusões do Descobrir.

## 1.0.101 — 2026-09-18 — Web r310

### Descobrir / autoridades tardias
- Aposenta o injetor r252 que ainda podia acrescentar `Top 10` e `Lançamentos` depois que a interface canônica já estava pronta.
- Neutraliza o recovery r300 de 2,2 s e o repaint atrasado r293, impedindo que renderers antigos substituam cards/actions depois da r310.
- Usa `cinetracker_watchlist_full_v119` como fonte canônica adicional antes do paint das abas públicas; títulos já salvos deixam de reaparecer com `+ Watchlist`.
- Os cards mantêm dois controles coerentes com o estado real: Watchlist e `✓ Visto`.

### Perfil / Esportes
- O primeiro paint do Perfil usa `cinetracker_sports_watch_history_v296` para o total de eventos assistidos; o RPC legado de stats fica somente como fallback para demais métricas.
- Evita divergências como 59 eventos no Perfil contra 68 na aba Esportes.
- Atores Favoritos passa a ter somente uma barra horizontal, criada explicitamente abaixo do rail dos cards.

### Esportes / acabamento
- Eventos antigos ainda marcados como `live` pelo provider são normalizados para encerrados após oito horas, evitando partidas de dias anteriores exibidas como `AO VIVO`.
- Corrige o rodapé Web congelado em `v1.0.57`; a identidade visível passa a `v1.0.101 / r310-official-1.0.101`.

### Build / validação
- Web atualizada para `1.0.101 / r310-official-1.0.101`; Android permanece `1.0.20 / versionCode 10062`.
- Chromium reproduz o novo vídeo: título já salvo na Watchlist, tabs tardias, takeover das ações, 68 vs 59, scrollbar dos atores e versão antiga no rodapé.

## 1.0.100 — 2026-09-18 — Web r309

### Descobrir
- Usa os dois vídeos de validação de 18/09 como regressão: remove a aba `Lançamentos` de todos os produtores privados ainda embarcados e impede rails duplicados de recriarem `Top 10`/abas antigas.
- Paraleliza autoridade pessoal e busca do catálogo nas abas públicas, eliminando a espera sequencial r308 que prolongava `Carregando títulos…`.
- Deduplica o resultado final por TMDB e também por tipo+título+ano, cobrindo títulos visualmente duplicados como `Next Time`.
- Reconstrói `Pra Você` combinando a autoridade r295 com `cinetracker_watchlist_full_v119`; hidrata a Watchlist por categoria e mantém Filme + Série + Anime em `Da sua Watchlist` e `100% novos`.
- Garante dois controles visíveis por card — `+ Watchlist`/estado da Watchlist e `✓ Visto` — usando `chip` do sistema; `↻ Trocar` fica em uma linha própria.

### F1 Hub
- Remove `Pilotos` e `Equipes` da fonte r257 antes do primeiro paint.
- Neutraliza os repaints r257 agendados em 0/180/700/1800 ms e a reparação do observer que podiam sobrescrever o Hub atual e recriar seis abas.
- Mantém somente `Visão geral`, `Calendário`, `Classificações` e `Circuitos`; pilotos e equipes permanecem dentro de `Classificações`.

### Perfil
- Substitui o fluxo r168 de cache → quick stats → full payload por um único paint canônico. Cache e quick ficam somente como fallback caso o payload completo não responda no limite definido.
- Estatísticas esportivas e resumo de `Jogos no Estádio` começam em paralelo com o payload do Perfil e entram antes de revelar a tela.
- Neutraliza a reescrita tardia r255 e remove o chevron da Watchlist no próprio produtor, evitando aparecer e sumir.
- O scroll de `Atores Favoritos` passa a pertencer somente ao pai real dos cards, mantendo a scrollbar abaixo do carrossel.

### Build / validação
- Web atualizada para `1.0.100 / r309-official-1.0.100`; Android permanece `1.0.20 / versionCode 10062`.
- Novas regressões estáticas e Chromium cobrem 1+3+3, duplicação visual, rail de abas, dois controles por card, primeiro paint F1 e geometria do scroll de atores.

## 1.0.99 — 2026-09-17 — Web r308

### Descobrir / Pra Você
- Substitui a composição permissiva da r301 por pools separados de Filme, Série e Anime, garantindo a estrutura `Indicação do Dia + 3 Watchlist + 3 100% novos` sem usar uma categoria para preencher outra.
- A Indicação do Dia passa a manter um pool próprio e recebe `↻ Trocar`; cada slot da Watchlist e dos 100% novos também troca somente dentro da própria categoria.
- Inicia autoridade pessoal, memória de recomendações e primeira página dos três catálogos TMDB em paralelo; hidrata somente a parcela necessária da Watchlist e reutiliza a composição recente por três minutos.
- Remove o refresh atrasado/observer da r293 e o observer de rota da r301 que podiam repintar o Pra Você depois de a tela já estar pronta.
- Padroniza Watchlist/Visto com controles `chip` do próprio sistema, sem paleta exclusiva do Descobrir.

### Descobrir / exclusões pessoais
- Aplica novamente, na última etapa antes do renderer, a exclusão de qualquer mídia já assistida ou existente na Watchlist em `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados`.
- Mantém `Calendário`, `Pra Você` e `Top 10` explicitamente fora dessa exclusão geral.

### F1 Hub
- Remove `Pilotos` e `Equipes` do modelo ativo que chega à produção. O Hub fica com `Visão geral`, `Calendário`, `Classificações` e `Circuitos`, e a r308 também saneia qualquer botão redundante que ainda seja emitido por uma autoridade herdada.
- Corrige a autoridade de clique do Calendário para ler `data-event-id`; IDs como `2026-16` resolvem temporada/rodada corretamente antes de abrir `Grid de Largada` e `Resultado de Chegada`.

### Perfil
- Consolida o acabamento final do Perfil no renderer vivo da r308, por rótulo semântico, sem depender da posição física dos cards; autoridades históricas já removidas em releases anteriores não são reintroduzidas.
- Identifica `Séries Watchlist` e `Filmes Watchlist` semanticamente pelo rótulo, remove `Abrir`/setas/pseudo-ícones e preserva a área clicável sem indicador visual.

### Build / validação
- Web atualizada para `1.0.99 / r308-official-1.0.99`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium monta a estrutura 1+3+3, verifica as cinco exclusões pessoais e três exceções, remove Pilotos/Equipes, clica uma corrida `2026-16` e valida o Perfil por rótulo.

## 1.0.98 — 2026-09-17 — Web r307

### Home / Raw e SmackDown
- Impede a captura genérica r306 de transformar `Marcar episódio como assistido` em `markSeen` da série inteira.
- Usa a fronteira assistida das séries recorrentes antigas para calcular somente episódios realmente novos; backlog histórico anterior não vira pendência.
- Preserva o bucket `Juntando poeira` quando ainda existe episódio novo e força `Em dia` somente quando a fronteira alcança o último episódio lançado.
- A reparação de dados do Raw em 17/09 removeu os registros em massa criados pelo clique defeituoso e preservou o episódio correto.

### Build / validação
- Web atualizada para `1.0.98 / r307-official-1.0.98`; Android permanece `1.0.20 / versionCode 10062`.
- Regressão Chromium reproduz o botão real do episódio e falha se houver qualquer chamada de marcação da série inteira.

## 1.0.97 — 2026-09-17 — Web r306

### Detalhes de filmes e séries
- Corrige a autoridade de clique dos títulos semelhantes/recomendados e dos cards de atores, usando o TMDB/person ID do próprio card antes dos handlers legados.
- `+ Watchlist` e `✓ Visto` passam pela ação assíncrona canônica tanto nos cards relacionados quanto no detalhe principal, com estado de busy e atualização visual imediata.
- Remove do bundle final a autoridade r305 que dependia de hit-test/handlers incompatíveis com o lifecycle real.

### Descobrir / Top 10
- Compacta header, margens e paddings superiores do Top 10 para elevar o ranking na viewport e reduzir a necessidade de scroll vertical.
- Preserva o bloqueio de overflow horizontal global e mantém o scroll somente nos trilhos que precisam dele.

### F1 Hub
- Remove definitivamente a aba `Pilotos` do modelo e do DOM; a r306 falha em teste se ela reaparecer.
- Corridas passadas do Calendário abrem modal próprio com `Grid de Largada` e `Resultado de Chegada`.
- O detalhe usa resultados já disponíveis no evento e fallback Jolpica por temporada/round quando necessário.

### Esportes
- Força a ordem `Próximos`, `Anteriores`, `Favoritos`, `Assistidos` e mantém esse submenu estritamente abaixo do F1 Hub.
- Move `↻ Rebuscar / Sincronizar` para o header da página, fora do submenu, e a ação força `ct-sports-sync`/reload dos providers e dados esportivos.

### Perfil
- Elimina reconciliações temporizadas do r299 e mantém as autoridades tardias r300/r301 neutralizadas, impedindo troca involuntária de versão/layout das estatísticas após a primeira pintura.
- Remove `Abrir`, `>` e `›` dos cards `Séries Watchlist` e `Filmes Watchlist`.
- Padroniza os cards de atores em 132x178 e os avatares em 112x112, com o scroll horizontal retido somente no trilho dos atores.

### Build / validação
- Web atualizada para `1.0.97 / r306-official-1.0.97`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressões estática e Chromium cobrindo interações de relacionados/atores/Watchlist/Visto, Top 10, remoção de Pilotos, Grid/Resultado da F1, ordem/refresh de Esportes e geometria/scroll do Perfil.
- O runtime r306 opera por autoridade pré-boot e hooks de renderer, sem `MutationObserver`, `setInterval` ou `setTimeout` de reconciliação visual.

## 1.0.91 — 2026-09-16 — Web r300

### Perfil / Watchlist
- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual clicável aplicado aos cards esportivos de estatísticas, preservando as ações já existentes desses contadores.

### Esportes
- Remove a aba `Ao vivo` do DOM efetivamente renderizado pela autoridade r255, em vez de tentar alterar constantes privadas fora do escopo do renderer.
- A navegação fica exatamente na ordem `Próximos`, `Anteriores`, `Assistidos`, `Favoritos`.
- Sessões antigas que ainda estejam em `live` retornam para `Próximos`; uma barreira CSS impede que controles `Ao vivo` legados reapareçam durante repaints.
- Corrige a divergência mostrada no vídeo de 16/09, em que a aba `Ao vivo` ainda exibia partidas de 12/09.

### Descobrir
- Adiciona recuperação finita para `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` quando o fluxo herdado permanece preso em `Carregando títulos…`.
- O fallback usa TMDB, respeita o filtro Filme/Série e a autoridade pessoal existente, e pinta pelo renderer real r288 sem observer ou `setInterval` perpétuo.
- `Pra Você` 1+3+3 e `Top 10` permanecem sob as autoridades específicas das releases anteriores.

### Build / validação
- Web atualizada para `1.0.91 / r300-official-1.0.91`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium reproduzindo os pontos do vídeo: Watchlist com estilo clicável, cinco abas esportivas legadas reduzidas para quatro na ordem aprovada e detecção do loading persistente do Descobrir.

## 1.0.90 — 2026-09-16 — Web r299

### Perfil / histórico esportivo
- `Eventos assistidos` passa a ser clicável e abre o histórico esportivo do usuário.
- `Jogos no Estádio` passa a ser clicável e abre somente os eventos marcados presencialmente.
- As listas exibem evento, competição e data quando disponíveis, sem mostrar nome do estádio.

### Presença no estádio
- O fluxo real de Esportes mantém somente `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`.
- A opção presencial salva `attended_in_person = true` com `stadium_name = null`; o campo legado para digitar o estádio deixa de participar da interface.
- Badges presenciais mostram apenas `🏟️ No Estádio`.

### Build / validação
- Web atualizada para `1.0.90 / r299-official-1.0.90`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona testes estáticos e Chromium para os dois históricos clicáveis e para o fluxo presencial sem captura de nome do estádio.

## 1.0.89 — 2026-09-15 — Web r298

### Esportes / presença presencial
- Intercepta o botão esportivo real `data-ct255-watch` antes do handler legado e disponibiliza a escolha TV/Tela ou Estádio.
- Registros presenciais usam o RPC canônico de histórico esportivo e recebem badge `🏟️ No Estádio`.

### Perfil
- `Jogos no Estádio` deixa de ser inserido em uma grade genérica próxima de Séries e passa a existir somente no painel semântico `Esportes assistidos`.

### Descobrir / Pra Você
- Introduz pipeline finito que aguarda autoridade pessoal, memória de recomendações e pools TMDB antes da pintura.
- A composição fica em `Indicação do Dia` com 1 Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem duplicações.
- Falta real de candidato passa a produzir estado explícito em vez de spinner infinito.

### Build / validação
- Web atualizada para `1.0.89 / r298-official-1.0.89`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões Chromium para o botão esportivo real, posição da métrica no Perfil e composição 1+3+3 do `Pra Você`.

## 1.0.88 — 2026-09-15 — Web r297

### Boot / tela preta
- Corrige a tela preta/vazia pública introduzida no bundle da r296: `runtime-r295-browse-actions-self-scope-fix.js` podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`, interrompendo a aplicação com `#app` vazio.
- A proteção r295 deixa de derrubar o bundle durante a inicialização legítima e mantém fallback compatível com as regressões históricas.

### Descobrir / donos reais de execução
- A validação do bundle final identificou a causa arquitetural complementar: desde a r288 os renderers/carregador vivos do Descobrir são `window.__ctR288PaintBrowse`, `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`; r295/r296 ainda interceptavam nomes legados que não eram os donos efetivos em produção.
- Adiciona `runtime-r297-live-discover-owner-bridge.js`, conectando a autoridade pessoal da r295 e as regras rígidas da r296 diretamente aos três donos reais r288.
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam pela exclusão canônica de vistos/Watchlist no renderer efetivamente usado pela página e recebem as ações r295 no mesmo caminho.
- `Pra Você` executa sanitização pessoal + composição rígida r296 antes da pintura real, preservando nota >= 7,5, ano > 1990, exclusões de Drama/Documentário-only e WWE, zero duplicatas e anti-repetição de 7 dias.
- O carregador vivo passa a aguardar a autoridade pessoal nos fluxos públicos/Calendário/Pra Você sem reconstruir a página inteira.

### Build / validação
- Web atualizada para `1.0.88 / r297-official-1.0.88`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium específica com os mesmos nomes `window.__ctR288...` do bundle oficial, cobrindo exclusão de vistos/Watchlist, ações, `Pra Você` rígido e chamada ao carregador autorizado.
- Adiciona regressão Chromium do bundle final completo `app-v297.js`, exigindo `boot()` real, `#app` preenchido, ausência de page error e os três hooks r297 conectados.
- O `production_smoke` valida identidade r297, assets públicos e DOM renderizado antes de considerar a release concluída.
- Todo o escopo funcional da r296 permanece preservado: quatro abas de Esportes, presença no estádio, métrica do Perfil e polimento Web.

## 1.0.87 — 2026-09-15 — Web r296

### Pra Você / autoridade rígida
- Endurece a elegibilidade global para TMDB >= 7,5 e ano > 1990, excluindo títulos compostos exclusivamente por Drama/Documentário e ampliando a barreira absoluta contra WWE, incluindo Raw, SmackDown, NXT, WrestleMania, Royal Rumble, SummerSlam, Survivor Series, Money in the Bank e Elimination Chamber.
- A memória de recomendação passa a usar explicitamente `shown_recommendations` com janela móvel de 7 dias por usuário, mantendo fallback local equivalente para evitar repetição mesmo em indisponibilidade temporária do backend.
- A composição visível fica rigidamente separada em `Indicação do Dia` com um Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem repetir a mesma mídia na mesma tela.
- O refresh/troca continua local ao bloco do Descobrir, sem recarregar a página inteira, e a r296 preserva as exclusões canônicas de vistos/Watchlist e os filtros combináveis do Calendário introduzidos na r295.

### Esportes / histórico presencial
- A navegação de Esportes é reduzida para exatamente quatro abas: `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; `Ao vivo` deixa de ser uma quinta aba independente.
- `Próximos` aceita somente eventos do dia corrente em `America/Sao_Paulo`; `Anteriores` limita o histórico operacional às últimas 72 horas; `Favoritos` mantém somente eventos de entidades favoritas e `Assistidos` usa o histórico persistido do usuário.
- `user_sport_watch_history` recebe `attended_in_person boolean default false` e `stadium_name text`, preservando compatibilidade com registros anteriores.
- `Marcar como assistido` abre um popover compacto com `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`; no segundo caso o nome do estádio é opcional.
- Eventos presenciais recebem o badge âmbar `🏟️ No Estádio` em Assistidos e o Perfil passa a incluir a métrica `Jogos no Estádio`.

### Polimento Web
- `Assistir a Seguir` recebe padding/gap mais compacto, hierarquia tipográfica mais limpa e botão canônico de visto em 40x40, arredondado e com tratamento esmeralda.
- Métricas e pôsteres do Perfil ganham superfície translúcida, borda suave, raio consistente e hover discreto.
- Formulários de Configurações passam a compartilhar tratamento translúcido, borda/foco ciano e botões arredondados.
- Sidebar/containers laterais recebem glassmorphism sutil com fundo preto translúcido, borda branca de 10% e blur, preservando o bloqueio de overflow horizontal global.

### Build / validação
- Web atualizada para `1.0.87 / r296-official-1.0.87`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r296 adiciona testes estáticos e Chromium para composição sem duplicatas, filtros WWE/Drama/Documentário/nota/ano, quatro janelas de Esportes, métrica de estádio e identidade final do bundle.

## 1.0.86 — 2026-09-15 — Web r295

### Descobrir / autoridade pessoal
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam por uma autoridade unificada de histórico + Watchlist antes da pintura.
- A autoridade une `cinetracker_recommendation_state_v108`, `cinetracker_profile_media_dashboard_v0997_fast` e `cinetracker_list_snapshot_v247`, reduzindo vazamentos quando uma fonte individual estiver atrasada ou incompleta.
- Cards dessas cinco áreas preservam `+ Playlist` e recebem `✓ Visto`; após qualquer uma das ações, o título é retirado imediatamente da seleção atual e do estado local elegível.

### Calendário
- Adiciona filtros `Todos / Filmes / Séries` como eixo exclusivo e `Watchlist` como toggle independente.
- Permite combinações reais, inclusive `Séries + Watchlist` e `Filmes + Watchlist`.
- A coleta do Calendário deixa de depender da exclusão geral que removia a Watchlist antes da interface; itens futuros da Watchlist são mesclados e, quando necessário, hidratados pelo TMDB antes da filtragem.

### Pra Você / Indicação do Dia
- `100% Novos` recebe uma segunda barreira canônica contra títulos assistidos e títulos da Watchlist antes de toda pintura, mantendo as regras da r293 (TMDB >= 7,5, ano > 1990, sem WWE/Raw/SmackDown e sem repetição semanal).
- `Indicação do Dia` deixa de reutilizar picks antigos/Watchlist e passa a escolher somente um título válido do pool `100% Novos`, com seleção determinística por dia.
- Remove filtros `blur`/`backdrop-filter` herdados do bloco da indicação e solicita pôster de resolução maior quando a ponte de imagem está disponível.

### Build / validação
- Web atualizada para `1.0.86 / r295-official-1.0.86`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r295 adiciona validação estática e Chromium cobrindo união de estados pessoais, exclusão de vistos/Watchlist, ações Playlist/Visto, combinação `Séries + Watchlist`, `100% Novos` e Indicação do Dia sem blur.

## 1.0.85 — 2026-09-15 — Web r294

### Descobrir / densidade visual
- Corrige a composição mostrada no vídeo de validação: texto, ações e barra horizontal deixam de ficar excessivamente afastados e passam a formar um bloco vertical compacto.
- Cards Web desktop passam de 176x264 para 158x237; mobile Web preserva 154x231.
- O bloco de texto cai de 80px para 52px no desktop, mantendo título e metadados em uma linha com reticências.
- Gap horizontal dos trilhos cai de 16px para 8px e a reserva inferior do scroll de 16px para 6px.

### Top 10
- A geometria desktop passa a permitir 10 cards completos em uma linha na referência de 1920px usada no vídeo, em vez de exibir apenas 9 antes do scroll.
- O trilho continua com scroll horizontal local para viewports menores, sem reintroduzir overflow horizontal no documento.

### Ações / barra de rolagem
- Rodapé de Playlist/Trocar passa a fazer parte da altura efetiva do card/slot; os botões ficam acima da barra horizontal em vez de vazarem para a área inferior do scroller.
- Altura dos controles cai para 28px, com gap de 4px e margem superior de 2px.
- A faixa de ações de Títulos Relacionados/Semelhantes recebe a mesma compactação, preservando a autoridade de clique/ID da r286/r292/r293.

### Build / validação
- Web atualizada para `1.0.85 / r294-official-1.0.85`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r294 adiciona teste Chromium em viewport 1920x1032 para validar 10 cards no Top 10, 158x237, texto de 52px, footer contido no card e ordem conteúdo -> ações -> scrollbar.

## 1.0.84 — 2026-09-15 — Web r293

### Descobrir / navegação
- Remove a aba `Lançamentos`, introduzida sem autorização na r288, da fonte `DTABS263`, do mapa de labels e do DOM; qualquer reconstrução antiga que tente recriá-la é saneada novamente.
- Caso uma sessão antiga esteja parada em `releases`, a navegação volta para `Novidades` sem criar outra aba substituta.

### Pra Você
- `100% Novos` volta a significar novo para o usuário, e não lançamento recente: mantém TMDB >= 7,5, ano > 1990, exclusão de WWE/Raw/SmackDown, histórico/assistidos, Watchlist e repetição semanal, mas elimina o limite inferior de data dos últimos 30 dias.
- O catálogo candidato pode usar qualquer título já lançado até hoje, preservando pools independentes de Filme, Série e Anime.
- `Da sua Watchlist` continua baseado no estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e descartando mídias sem identidade/pôster válidos.
- Slots sem candidato real deixam de produzir card cinza/`Indisponível`; somente categorias com item válido são renderizadas.
- `↻ Trocar` em `100% Novos` remove o item atual do pool da sessão, registra a exibição na semana e pinta o próximo candidato válido, evitando retorno ao mesmo item durante a semana.
- A r293 detecta repaints herdados da r292 e reaplica sua autoridade quando o pool antigo tentar sobrescrever o estado corrigido.

### Botões / relacionados
- Ações de Watchlist/Visto dos títulos relacionados/semelhantes são agrupadas em uma faixa própria dentro do card, sem sobrepor pôster/título e sem escapar para outras áreas da tela.
- A autoridade de clique/ID da r286/r292 é preservada: pôster/título abre a mídia correta e Watchlist/Visto continuam usando tipo + TMDB do próprio card.
- Nos três slots do Pra Você, Playlist permanece à esquerda e `↻ Trocar` à direita em footer estável.

### Build / validação
- Web atualizada para `1.0.84 / r293-official-1.0.84`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r293 adiciona validação estática e Chromium para remoção de `Lançamentos`, catálogo sem limite de 30 dias, exclusões canônicas, três categorias válidas, ausência de placeholders, troca semanal e posição das ações.

## 1.0.83 — 2026-09-15 — Web r292

### Títulos Relacionados / Semelhantes
- Clique no pôster ou título mantém autoridade própria e abre imediatamente a rota correta de filme/série pelo TMDB da mídia clicada.
- Watchlist usa o ID/tipo do próprio card, executa de forma assíncrona e atualiza o controle sem fechar o modal; a autoridade r286 permanece preservada e a r292 cobre também estruturas genéricas de relacionados/semelhantes.

### Descobrir / Pra Você
- `Da sua Watchlist` passa a reconstruir os candidatos a partir do estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e hidratando Filme, Série e Anime separadamente.
- `100% Novos` ganha pools independentes de Filme, Série e Anime, com TMDB >= 7.5, ano > 1990, exclusão de WWE/Raw/SmackDown, exclusão da Watchlist e do conjunto semanal `fresh_excluded`.
- `Trocar` opera somente sobre pools válidos por categoria; os índices são normalizados após cada atualização para não cair em posição inexistente.

### Cards / layout
- Título e metadados ficam rigidamente em uma linha com `line-clamp-1`, `white-space: nowrap` e reticências.
- Botões de Watchlist e `Trocar` ficam compactos em 30px, preservando o coração sobreposto no pôster e a geometria 154x231 mobile / 176x264 desktop herdada da r290/r291.
- A janela continua sem scroll horizontal; os trilhos permanecem locais.

### Build / validação
- Web atualizada para `1.0.83 / r292-official-1.0.83`; Android permanece `1.0.20 / versionCode 10062`.
- CI da r292 valida sintaxe, build oficial, regressões herdadas, Chromium para clique/Watchlist dos relacionados, pools Filme/Série/Anime do Pra Você, filtros de elegibilidade, bundle final exato e `production_smoke`.

## 1.0.82 — 2026-09-15 — Web r291

### Descobrir / ações
- `+ Playlist` / `✓ Salvo` deixam a área de título e metadados e passam para o footer ao lado de `↻ Trocar`, em layout horizontal sem sobreposição.
- Títulos e metadados ficam isolados dos controles, com uma linha, `line-clamp-1` e truncamento por reticências.

### Favoritos
- Cada card de mídia do Descobrir recebe um coração minimalista sobre o pôster, com estado otimista instantâneo e persistência `media_overrides.state = 'Liked'`.

### Carrosséis
- Trilhos do Descobrir, Top 10 e Pra Você mantêm scroll horizontal local com snap, `pan-x` e arraste por ponteiro; a janela permanece sem overflow horizontal.

## Histórico anterior
O histórico completo da Web 1.0.0 até a 1.0.81/r290 permanece preservado integralmente em `docs/releases/CHANGELOG-through-1.0.81.md` e no histórico Git.
