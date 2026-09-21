# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.124** | `r333-official-1.0.124` | Perfil estável e canônico, Descobrir com 9 abas/filtro estrito/cache e F1 com detalhes por GP |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r313 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.124 / r333

A r333 aplica o contrato visual do Descobrir mostrado nos prints de 21/09.

- **Pra você:** cards voltam ao tamanho padrão histórico do CineTracker — 176 px no desktop e 154 px em telas menores — e ficam lado a lado. Os três botões `Watchlist / Visto / Trocar` ficam na mesma linha e exatamente dentro da largura do card.
- **Filtros do Pra você:** `Todos / Filmes / Séries / Animes` ficam visíveis dentro da própria área, sem depender do botão lateral de filtro.
- **Demais abas do Descobrir:** os dois botões de ação ficam em uma única linha e nunca ultrapassam a largura do poster/card.
- **Top 10:** remove a linha duplicada com o nome do streaming selecionado, reduz o espaço em branco acima do título e compacta os painéis para liberar altura útil.
- **Barra de abas:** remove os dois controles à direita do `Calendário` (seta seguinte e filtro global), conforme solicitado.
- **Regras pessoais:** preserva `cinetracker_discover_filter_v327`; a autoridade foi conferida no banco com a saga Harry Potter e bloqueou 8/8 filmes já assistidos.
- Home, Perfil, Esportes, F1 Hub e Android não são alterados nesta versão.

Build oficial: `apps/web/build-r333-official.mjs`; runtime: `apps/web/runtime-r333-discover-layout-final.js`.

## Web 1.0.123 / r332

A r332 volta para a última base verde (r326) e corrige os pontos mostrados nos prints de 21/09 sem reaproveitar a r331 que falhou no navegador.

- Home / Filmes: `cinetracker_home_payload_v332` usa a mesma `cinetracker_watchlist_full_v119` do Perfil e ordena por `added_at desc`. O primeiro item da Home e do Perfil passa a ser o mesmo.
- Histórico da Home: continua carregado como conteúdo natural acima do ponto inicial da página, sem botão e sem scroll interno; o ponto inicial fica logo depois do histórico, então ao subir aparece primeiro o mais recente.
- Pra você: usa a Watchlist canônica, valida tudo com `cinetracker_discover_filter_v327`, mantém os filtros Todos/Filmes/Séries/Animes sempre visíveis e força Watchlist/Visto/Trocar na mesma linha, limitados à largura do card.
- Top 10: Looke e Mubi são removidos. O desktop usa 10 colunas, sem trilho horizontal; a busca continua preenchendo até dez itens elegíveis e aborta imediatamente se o usuário troca de aba.
- Navegação: os observers amplos da r324/r326 são neutralizados e os loops de refill são limitados pela rota/aba.
- Sincronização de episódios da r325 é preservada.
- Android permanece `1.0.20 / versionCode 10062`.

## Web 1.0.122 / r331

A r331 parte diretamente da **r326, última release verde**, e não herda os experimentos r327–r330 que falharam no CI.

- **Home / Histórico:** Séries e Filmes mantêm o histórico carregado no DOM acima da área inicial, sem botão e sem scroll interno. Ao entrar na Home ou trocar de aba, a tela é ancorada no primeiro bloco normal; ao rolar para cima, aparecem primeiro os registros mais recentes e depois os antigos.
- **Pra você:** o filtro pessoal passa a usar `cinetracker_discover_filter_v327`, incluindo aliases legados, histórico e eventos de reprodução. Os filtros `Todos / Filmes / Séries / Animes` ficam sempre visíveis.
- **Ações do Pra você:** `Watchlist`, `Visto` e `Trocar` ficam sob um único dono, lado a lado em uma linha compacta. O runtime r310 deixa de apagar/esconder essas ações.
- **Descobrir / navegação:** os loops de reposição de recomendações e Top 10 param de iniciar novas páginas assim que o usuário troca de aba/rota, reduzindo congelamentos.
- **Top 10:** mantém o preenchimento até dez itens elegíveis, aplicando o filtro v327 antes da exibição.
- **Episódios novos:** a reconciliação prioriza séries assistidas recentemente e o selo `NOVO` considera a data do episódio mais recente lançado no TMDB.
- Perfil/Watchlist preserva as contagens exatas da r324. Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r331-official.mjs`; runtime: `apps/web/runtime-r331-home-discover-stable.js`.

## Web 1.0.121 / r330

A r330 consolida os problemas vistos no vídeo de 21/09: lentidão ao trocar abas, ações desaparecendo no `Pra você` e o histórico da Home fora do comportamento aprovado.

- **Home / histórico:** volta ao contrato r274/r326. Séries e Filmes ficam pré-carregados em um viewport interno de até 55vh/520 px, sem botão `Ver histórico`. A lista permanece do mais antigo no topo ao mais recente no fundo e abre posicionada no item mais recente; rolar para cima revela os anteriores.
- **Home / desempenho:** preserva o cache-first e o RPC único da r328, mas neutraliza os normalizadores r327/r328 que expandiam dezenas de itens na página e reposicionavam a janela.
- **Descobrir / navegação:** remove o prefetch automático das seis abas públicas durante a navegação. A troca passa a ser demand-only e continua usando o cache visual da r329 para retornos já carregados.
- **Pra você / carregamento:** `loadRecent296` sai do caminho crítico da montagem das recomendações.
- **Pra você / botões:** o r310 deixa de remover `.ct309-actions`. A r330 também reconstrói Watchlist, Visto e Trocar quando um cache/runtime anterior deixou o card sem ações, e força os três na mesma linha.
- **Pra você / filtros:** Todos, Filmes, Séries e Animes ficam visíveis e atuam localmente, sem nova requisição.
- **Top 10:** páginas 1–3 são buscadas em paralelo e filtradas em uma única onda; páginas 4–5 só são consultadas se necessário. O filtro pessoal é executado no máximo duas vezes por carregamento e a lista continua tentando completar 10 elegíveis.
- **Regras:** mantém `cinetracker_discover_filter_v327`, a autoridade mais recente do bundle, incluindo `watch_play_events` e aliases para bloquear títulos assistidos em duplicatas legadas, como Harry Potter.
- **Preservado:** contagens/ordenação das Watchlists r324, sincronização de episódios r325, F1, Esportes e Android.

Build oficial: `apps/web/build-r330-official.mjs`; runtime: `apps/web/runtime-r330-recovery.js`.

## Web 1.0.120 / r329

A r329 corrige especificamente a fluidez do Descobrir e o layout do `Pra você` mostrado no vídeo de 21/09.

- **Troca de abas:** conteúdo já carregado é restaurado do cache visual por até 5 minutos, sem voltar para skeleton/loader.
- **Pré-carregamento:** fontes das abas públicas são aquecidas em idle, sem trocar a aba visível.
- **Observer antigo:** a varredura global do Descobrir da r327 é desativada; a r329 observa apenas mudanças relevantes do container atual.
- **Pra você / cards:** Filme, Série e Anime usam colunas fixas de 158 px, alinhadas à esquerda e com 12 px de intervalo, eliminando os espaços enormes do vídeo.
- **Pra você / ações:** Watchlist, Visto e Trocar são reagrupados fisicamente no mesmo container e ficam obrigatoriamente na mesma linha, com 24 px de altura e sem quebra de texto.
- **Filtros:** Todos / Filmes / Séries / Animes são locais e imediatos; trocar o filtro do `Pra você` não dispara rede.
- **Demais áreas:** Home r328, sincronização episódica r325, Watchlists do Perfil r324, F1, Esportes e Android são preservados.

Build oficial: `apps/web/build-r329-official.mjs`; runtime: `apps/web/runtime-r329-discover-performance-layout.js`.

## Web 1.0.119 / r328

A r328 corrige a regressão de Home/histórico observada no vídeo de 21/09 e preserva integralmente o Descobrir da r327.

- **Congelamento ao trocar de abas:** o vídeo mostrou aproximadamente 13–14 s de skeleton ao entrar na Home. No banco, o payload principal foi medido em ~0,39 s e a nova autoridade única em ~0,58 s; o atraso vinha da cadeia redundante no cliente, não do SQL.
- **Uma única autoridade de Home:** `cinetracker_home_payload_v328` entrega biblioteca + histórico de Séries + histórico de Filmes em um único RPC autenticado, substituindo o encadeamento paralelo r323/r325.
- **Retorno à Home:** quando existe cache canônico, a Home pinta imediatamente e atualiza em segundo plano somente quando o cache tem mais de 60 s. A troca Séries/Filmes é local e não dispara nova carga.
- **Histórico natural:** Séries e Filmes ficam completamente renderizados acima da área inicial, sem botão, sem scrollbar interna e sem limite de altura. A página abre ancorada na primeira seção normal; ao rolar para cima, o registro mais recente é encontrado primeiro e os mais antigos ficam acima.
- **Data correta do histórico:** a data exibida nos cards passa a ser `watched_at`. A hidratação TMDB não pode mais trocar essa data pela data original de exibição do episódio (por exemplo, episódios antigos de WWE aparecendo como “1988” apesar de terem sido assistidos em 2026).
- **Ordem:** histórico permanece do mais antigo no topo ao mais recente no final, deixando o mais recente imediatamente acima do conteúdo principal.
- **Preservado:** sincronização de episódios novos da r325, Descobrir/filtros/botões da r327, Watchlists do Perfil da r324, F1, Esportes e Android.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r328-official.mjs`; runtime: `apps/web/runtime-r328-home-history-performance.js`.

## Web 1.0.118 / r327

A r327 corrige o comportamento observado no vídeo de 21/09 sem alterar F1, Esportes ou Android.

- **Home / Histórico:** restaura o contrato da r276. O histórico de Séries e Filmes permanece totalmente renderizado acima da área inicial, sem botão e sem scrollbar interna. A Home abre ancorada na primeira seção normal; ao rolar para cima, o usuário encontra primeiro o registro mais recente e continua em direção aos mais antigos.
- **Pra você / ações:** Watchlist, Visto e Trocar passam a usar uma linha flex real de três botões compactos; o botão Trocar deixa de herdar a regra antiga de ocupar uma linha inteira.
- **Pra você / filtros:** Todos, Filmes, Séries e Animes passam por um handler de captura próprio da r327. O filtro também controla corretamente a Indicação do Dia conforme a categoria atual.
- **Descobrir / regras:** todas as abas filtradas, Pra você e Top 10 passam a usar `cinetracker_discover_filter_v327`.
- **Filtro v327:** além de Watchlist, `watch_history`, progresso e estados, inclui `watch_play_events_v0994`. O servidor expande os aliases do candidato pelo TMDB do catálogo antes de cruzar com registros antigos/localizados.
- Isso cobre casos em que o Top 10 chega apenas com o título em português enquanto o histórico antigo está salvo em inglês.
- Top 10 continua buscando páginas adicionais até tentar completar 10 itens elegíveis.
- Sincronização de episódios da r325 e contagens completas de Watchlist da r324 são preservadas.
- Android permanece `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r327-official.mjs`; runtime: `apps/web/runtime-r327-home-discover-truth.js`.

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
