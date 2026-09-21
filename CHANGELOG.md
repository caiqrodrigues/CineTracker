# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.121 — 2026-09-21 — Web r330

### Home / histórico
- Restaura o histórico de Séries e Filmes no viewport interno r274/r326, sem botão de abrir/fechar.
- Mantém os registros carregados, mais antigo no topo e mais recente no fundo, com posicionamento inicial no fundo.
- Neutraliza os normalizadores r327/r328 que convertiam o histórico em altura natural e movimentavam a página inteira.
- Preserva cache-first da r328 e reconciliação episódica r325.

### Descobrir / desempenho
- Desliga o prefetch automático das seis abas públicas durante a navegação.
- Mantém cache visual para retorno a abas já carregadas.
- Remove `loadRecent296` do caminho crítico do `Pra você`.
- Top 10 passa a buscar em duas ondas concorrentes (1–3 e, se necessário, 4–5), com no máximo duas chamadas ao filtro pessoal.

### Pra você
- Impede o r310 de apagar `.ct309-actions`.
- Reconstrói Watchlist + Visto + Trocar caso um card/cache chegue sem a linha de ações.
- Força os três botões na mesma linha, compactos e sem quebra.
- Mantém Todos / Filmes / Séries / Animes visíveis e locais.

### Regras e preservações
- Mantém `cinetracker_discover_filter_v324` para excluir vistos/Watchlist/progresso, inclusive duplicatas legadas.
- Preserva Watchlists completas/contagens r324, episódios novos r325, F1 e Esportes.
- Web `1.0.121 / r330-official-1.0.121`.
- Android `1.0.20 / versionCode 10062`.

## 1.0.120 — 2026-09-21 — Web r329

### Descobrir / desempenho
- Troca de abas passa a usar cache visual de 5 minutos para retorno instantâneo.
- Adiciona prefetch em idle das fontes das abas públicas.
- Remove a varredura contínua do MutationObserver r327 no Descobrir.

### Pra você
- Aproxima os cards: três colunas fixas de 158 px alinhadas à esquerda.
- Reagrupa Watchlist, Visto e Trocar no mesmo container e força uma única linha compacta.
- Todos / Filmes / Séries / Animes passam a ser filtro local, sem requisição de rede.

### Preservado
- Home r328.
- Sincronização de episódios r325.
- Contagens/modal da Watchlist r324.
- F1 Hub e Esportes.
- Android `1.0.20 / versionCode 10062`.
- Web `1.0.120 / r329-official-1.0.120`.

## 1.0.119 — 2026-09-21 — Web r328

### Home / desempenho
- Corrige o congelamento observado no vídeo ao entrar ou voltar para a Home.
- Adiciona `cinetracker_home_payload_v328`, reunindo o payload principal e os históricos canônicos em um único RPC.
- Remove a espera por chamadas redundantes de histórico no fluxo de entrada.
- Retorno à Home passa a usar cache canônico imediatamente e faz refresh em segundo plano após 60 s.
- Primeira carga recebe limite de 5 s no cliente para não deixar skeleton indefinidamente.

### Home / histórico
- Neutraliza definitivamente o scroll interno herdado das regras r274/r275/r326: seção, shell e stack ficam com altura natural e `overflow: visible`.
- Remove controles legados de abrir/fechar histórico.
- Mantém o histórico acima da área inicial com o mais antigo no topo e o mais recente no final.
- Corrige a data dos episódios do histórico para `watched_at`; metadata do TMDB pode atualizar nome/nota, mas não substituir a data assistida pela data de exibição original.
- Filmes também exibem explicitamente a data em que foram vistos.

### Preservado
- Descobrir r327 sem alterações.
- Sincronização episódica r325 preservada.
- Watchlists/contagens do Perfil r324 preservadas.
- F1 Hub e Esportes sem alterações.
- Android `1.0.20 / versionCode 10062`.
- Web `1.0.119 / r328-official-1.0.119`.

## 1.0.118 — 2026-09-21 — Web r327

### Home
- Restaura o histórico no padrão r276: conteúdo completo acima da área inicial, sem botão e sem scroll interno.
- Séries e Filmes abrem ancorados na primeira seção principal.
- O histórico continua ordenado do mais antigo no topo ao mais recente no final, permitindo revelar primeiro o mais recente ao rolar para cima.

### Descobrir
- Adiciona `cinetracker_discover_filter_v327`.
- O filtro passa a considerar também `watch_play_events_v0994`.
- Os aliases dos candidatos são expandidos no servidor pelo TMDB e cruzados com títulos locais/originais já existentes no catálogo.
- Pra você usa filtro funcional Todos / Filmes / Séries / Animes, incluindo a Indicação do Dia.
- Watchlist / Visto / Trocar ficam obrigatoriamente na mesma linha em cada card.
- Top 10 mantém o preenchimento até dez após exclusões e usa a mesma autoridade v327.

### Preservado
- Sincronização de episódios r325.
- Contagens e modal completo de Watchlist r324.
- F1 Hub e Esportes sem alterações.
- Android `1.0.20 / versionCode 10062`.
- Web `1.0.118 / r327-official-1.0.118`.

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
