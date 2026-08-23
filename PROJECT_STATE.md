# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.64`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.64

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js`, `ct53.js` e `ct54.js`.

### Correções desta versão

- notas repetidas/acumuladas nos cards são deduplicadas;
- cards de acompanhamento/continuidade ficam mais compactos;
- `Assistido` permanece neutro por padrão e recebe destaque verde apenas quando visto/clicado;
- séries em andamento exibem `Acompanhando` no detalhe em vez de uma ação contraditória de Watchlist;
- `Carregando perfil...` residual é removido quando o Perfil já possui gráfico/conteúdo;
- detalhes de mídia usam uma única área oficial de notas, evitando duas apresentações diferentes do mesmo título;
- filtro estrito de Descobrir e deduplicação de streaming permanecem ativos.

### Configurações

- build exibida: `0.0.64`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `64`;
- `versionName`: `0.0.64`;
- artefato esperado: `cinetracker-android-0.0.64-debug.apk`;
- tag/release esperada: `android-v0.0.64`;
- workflow valida `ct41.js` até `ct54.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.64 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar ausência de notas repetidas nos cards;
- confirmar cards compactos sem corte de conteúdo;
- confirmar botão `Assistido` neutro e verde no estado correto;
- confirmar `Acompanhando` em séries com progresso;
- confirmar Perfil sem `Carregando perfil...` preso;
- confirmar um único padrão de notas no detalhe;
- reconfirmar Descobrir e streaming;
- confirmar build `0.0.64` em Configurações;
- confirmar atualização por sobreposição.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
