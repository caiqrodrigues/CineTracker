# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.72`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.72

### Runtime

A Activity carrega `ct41`, `ct47`, `ct48`, `ct49`, `ct50`, `ct51`, `ct58`, `ct59`, `ct60` e `ct61`. O `ct52` deixa de ser carregado para eliminar disputa entre duas rotinas diferentes de restauração/posicionamento do gráfico.

### Correções desta versão

- o gráfico do Perfil é mantido imediatamente acima da seção `Histórico`;
- Descobrir monta um conjunto bloqueado por TMDB ID e por título normalizado usando acompanhamento + todos os estados persistentes do usuário;
- qualquer card já conhecido é ocultado em todos os filtros/destaques de Descobrir;
- Home e Assistir têm metadados normalizados para impedir repetição crescente de progresso/notas;
- a aba Assistir recebe recuperação controlada quando permanecer em `Carregando...`;
- nome do próximo episódio continua maior e o botão `Assistido` centralizado;
- animações/transições concorrentes dos cards e gráficos são desativadas para reduzir tremor visual;
- filtro de exibição Carrossel/Grade/Lista continua recolhido.

### Configurações

- build exibida: `0.0.72`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `72`;
- `versionName`: `0.0.72`;
- artefato esperado: `cinetracker-android-0.0.72-debug.apk`;
- tag/release esperada: `android-v0.0.72`;
- workflow valida somente os módulos efetivamente carregados pela Activity.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.72 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar gráfico sempre acima de Histórico e sem desaparecer ao navegar;
- confirmar Descobrir sem nenhum título da Watchlist, acompanhado ou já visto;
- confirmar Home sem metadados repetidos/tremor;
- confirmar Assistir carregando e sem metadados corrompidos;
- reconfirmar temporadas, notas individuais, notificações e streaming.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
