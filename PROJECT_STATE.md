# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.66`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.66

### Runtime

A Activity continua carregando `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js`, `ct53.js`, `ct54.js` e `ct55.js`. As correções da 0.0.66 foram consolidadas no `ct55.js` para evitar mais uma camada duplicada de observer.

### Correções desta versão

- navegação entre Assistir, Descobrir, Histórico e Perfil deixa de forçar rerenders desnecessários;
- loaders presos são detectados, recebem tentativa automática de recuperação e, se persistirem, viram ação manual de nova tentativa;
- Perfil deixa de sofrer o refresh/rerender extra que podia apagar o conteúdo já carregado;
- footer antigo de Web/Android em Configurações é normalizado para a versão atual;
- notas/metadados duplicados são limpos;
- temporadas deixam de exibir `Carregando episódios...` indefinidamente quando ainda não foram abertas;
- botões de próximo episódio permanecem verdes após uma marcação bem-sucedida;
- cálculo de faltantes continua baseado em `total - assistidos`;
- Descobrir estrito e provedores de streaming deduplicados permanecem preservados.

### Configurações

- build exibida: `0.0.66`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `66`;
- `versionName`: `0.0.66`;
- artefato esperado: `cinetracker-android-0.0.66-debug.apk`;
- tag/release esperada: `android-v0.0.66`;
- workflow valida `ct41.js` até `ct55.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.66 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar Assistir sem `Failed to fetch`/loading infinito;
- confirmar Descobrir carregando títulos normalmente e mantendo o filtro estrito;
- confirmar Histórico carregando normalmente;
- confirmar Perfil sem voltar para `Carregando perfil...`;
- confirmar temporadas sem loaders residuais;
- confirmar `Assistido` verde após marcação;
- confirmar footer `0.0.66` em Configurações;
- reconfirmar Watchlist, notas, faltantes e streaming.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
