# CineTracker Web 1.0.75 / r284

Release corretiva baseada na Web 1.0.74/r283 e nos vídeos reais da conta.

## Home sem oscilação de episódio

Cards de séries iniciadas deixam de exibir número, título e quantidade de episódios vindos de um payload possivelmente desatualizado enquanto a reconciliação canônica ainda está em andamento. Sem snapshot fresco da própria sessão, o card mostra apenas `Atualizando episódios…`; depois de estado assistido canônico + TMDB fresco, a informação é publicada como uma unidade. Snapshots frescos podem ser reutilizados até uma mudança real de dados. Recarregamentos após marcação limpam essa autoridade para não reapresentar o episódio anterior.

## Capas

- Formula 1 e NFL: Super Bowl recebem capas próprias no card e no detalhe importado, mesmo sem identidade TMDB segura.
- Stuart Não Consegue Salvar o Universo usa o TMDB efetivo 287620 para hidratar o poster quando o registro legado escolhido pelo payload não possui `poster_path`.

## Formula 1 / Super Bowl

- Os dois detalhes importados passam a ter ação `✓` por episódio já exibido e ainda não assistido, gravando pelo writer `cinetracker_mark_watch_v0994` no `media_id` importado.
- O clique da ação é isolado no `window`, sem navegar ou abrir outro detalhe.
- Formula 1 mantém temporadas anuais desde 1950; o seletor possui geração própria e respostas atrasadas de uma temporada antiga não podem substituir a temporada escolhida mais recentemente.
- Super Bowl preserva as duas temporadas já existentes e ganha a mesma ação de visto por episódio.
- Após marcar um episódio, a temporada selecionada é mantida e o progresso é relido por `cinetracker_imported_series_state_v1`.

## Preservado

r283 (contagem fresca e fronteira Raw/SmackDown), r282 (ordem por última visualização), r281 (isolamento do check da Home), Histórico acima da viewport, sidebar/abas fixas, Descobrir, Perfil, Sports/F1 Hub e Android 1.0.20 / versionCode 10062.

## Validação

A suíte r284 exige sintaxe, build oficial, regressões estáticas, Chromium em 420px e 1200px, ausência de flash com episódio stale, capas de F1/Super Bowl/Stuart, geração de episódios F1, ação `✓`, boot do bundle final exato e identidade do release. O smoke público da produção é executado somente após merge em `main`.
