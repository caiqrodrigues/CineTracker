# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.65`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.65

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js`, `ct53.js`, `ct54.js` e `ct55.js`.

### Correções desta versão

- `ct53.js` volta a ser apenas marcador de build; a duplicação acidental da lógica de `ct54.js` foi removida;
- metadados da Watchlist são normalizados para evitar texto repetido/corrompido;
- episódios restantes usam `total - assistidos`;
- notas repetidas em Home/Assistir são consolidadas;
- `Carregando perfil...` residual é ocultado quando o Perfil já renderizou;
- estados de `Assistido`, `Acompanhando`, Descobrir estrito e streaming deduplicado permanecem preservados.

### Configurações

- build exibida: `0.0.65`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `65`;
- `versionName`: `0.0.65`;
- artefato esperado: `cinetracker-android-0.0.65-debug.apk`;
- tag/release esperada: `android-v0.0.65`;
- workflow valida `ct41.js` até `ct55.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.65 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar Watchlist sem metadados repetidos;
- confirmar `33/314` resultando em `Faltam 281 episódios`;
- confirmar uma única nota por card;
- confirmar Perfil sem `Carregando perfil...` preso;
- reconfirmar Descobrir, botões e streaming;
- confirmar build `0.0.65` em Configurações.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
