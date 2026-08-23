# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.70`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.70

### Runtime

A Activity carrega `ct41.js` até `ct59.js`. O `ct59.js` estabiliza especificamente Home e Assistir para conteúdo em andamento/próximo episódio.

### Correções desta versão

- Home consulta `cinetracker_continue_items_v2` com timeout e retentativas para evitar `Continuar assistindo` vazio enquanto há séries em andamento;
- os cards básicos aparecem antes de terminar o enriquecimento TMDB do próximo episódio;
- a aba Assistir tenta recuperar automaticamente uma lista que permaneça em `Carregando...`;
- cards de séries em Home e Assistir mostram o nome do próximo episódio quando disponível;
- nome do episódio usa fonte maior e quebra de linha normal;
- botão `Assistido` fica centralizado abaixo do episódio;
- marcação usa feedback otimista e persiste em segundo plano;
- após marcar, o próximo episódio do card é recalculado;
- correções de temporadas, notas individuais, notificações e streaming das versões anteriores permanecem.

### Configurações

- build exibida: `0.0.70`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `70`;
- `versionName`: `0.0.70`;
- artefato esperado: `cinetracker-android-0.0.70-debug.apk`;
- tag/release esperada: `android-v0.0.70`;
- workflow valida `ct41.js` até `ct59.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.70 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar Home preenchendo `Continuar assistindo` sem demora excessiva;
- confirmar Assistir saindo de `Carregando...`;
- confirmar nome do próximo episódio em Home e Assistir;
- confirmar botão `Assistido` centralizado e resposta imediata;
- confirmar atualização para o próximo episódio após marcação;
- reconfirmar temporadas/notas/notificações/streaming;
- confirmar build `0.0.70` em Configurações.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
