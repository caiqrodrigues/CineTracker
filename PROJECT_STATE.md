# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.62`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.62

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js` e `ct52.js`.

### Perfil

- `ct52.js` garante recuperação do gráfico diário caso um rerender remova o componente principal;
- se o gráfico `ct41` existir, ele é preservado e forçado visível;
- se ele desaparecer, é reconstruído a partir de `cinetracker_watch_daily_timeline`.

### Botões Assistido

- estado padrão visual é neutro/apagado;
- verde é usado somente quando o filme/série/episódio está efetivamente marcado como assistido;
- episódios respeitam a classe persistente `on`;
- detalhes de filme/série consultam os estados persistidos da conta para refletir `AlreadySeen`/`Completed`.

### Correções observadas no vídeo da 0.0.61

- normalização da linha de metadados dos cards de `Continuar assistindo`, evitando concatenações repetidas e texto corrompido;
- limpeza de indicadores de carregamento residuais fora da tela correspondente;
- deduplicação de streaming da 0.0.61 é preservada;
- filtro estrito de Descobrir da 0.0.61 é preservado.

### Configurações

- build exibida: `0.0.62`.

## 4. Validação

Implementado/compilado não significa validado. A 0.0.62 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar que o gráfico do Perfil não desaparece após navegar entre abas;
- confirmar botão `Assistido` neutro antes da marcação e verde depois;
- confirmar estados já vistos abrindo verdes corretamente;
- confirmar metadados de `Continuar assistindo` sem repetição/corrupção;
- confirmar ausência de carregamentos presos;
- reconfirmar Descobrir e streaming da 0.0.61;
- confirmar build `0.0.62` em Configurações;
- confirmar atualização por sobreposição.

## 5. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
