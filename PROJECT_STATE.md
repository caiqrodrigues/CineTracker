# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.61`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.61

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js` e `ct51.js`.

### Descobrir

- `ct51.js` reforça o bloqueio por `tmdb_id` e também por título normalizado;
- isso cobre cards que não carregam `data-media-id` diretamente;
- o filtro é reaplicado após mutações, troca de filtros e rerenders;
- a fonte dos itens conhecidos combina `cinetracker_continue_items_v2` e todos os `media_overrides` persistidos da conta.

### Onde assistir

- a seção única criada na 0.0.60 é preservada;
- provedores são deduplicados por família do serviço, não por combinação provedor/categoria;
- múltiplas variantes do Paramount+ são reduzidas a uma única entrada;
- o mesmo princípio é aplicado a Prime Video, Apple TV, Disney+, Max/HBO, Globoplay, Netflix, Crunchyroll, MUBI, Telecine e Starz quando houver variantes de canal/plano.

### Configurações

- build exibida: `0.0.61`.

## 4. Validação

Implementado/compilado não significa validado. A 0.0.61 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar Destaque e todos os filtros sem itens conhecidos;
- confirmar que resultados desconhecidos continuam aparecendo normalmente;
- confirmar um único card por serviço de streaming;
- confirmar ausência de múltiplas variantes do Paramount+;
- confirmar build `0.0.61` em Configurações;
- confirmar atualização por sobreposição.

## 5. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
