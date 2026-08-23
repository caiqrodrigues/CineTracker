# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.67`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.67

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js`, `ct53.js`, `ct54.js`, `ct55.js` e `ct56.js`.

A 0.0.67 corrige o desalinhamento deixado pela tentativa 0.0.66: Gradle, Activity, query `apk=`, build footer, workflow e documentação agora apontam para a mesma versão.

### Correções desta versão

- navegação nativa tenta primeiro `ct67Navigate`, reduzindo disputa com os navegadores antigos;
- `ct56.js` faz recuperação controlada de loaders presos em Assistir, Descobrir, Histórico e Perfil;
- loaders que não se resolvem deixam de ficar infinitos e oferecem tentativa manual;
- Perfil remove `Carregando perfil...` residual quando já há conteúdo útil;
- detalhes removem rating bars duplicadas e mensagens residuais de temporadas;
- botões de próximo episódio preservam o destaque verde após marcação;
- metadados duplicados são consolidados;
- Descobrir estrito, streaming deduplicado e cálculo de faltantes permanecem preservados.

### Configurações

- build exibida: `0.0.67`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `67`;
- `versionName`: `0.0.67`;
- artefato esperado: `cinetracker-android-0.0.67-debug.apk`;
- tag/release esperada: `android-v0.0.67`;
- workflow valida `ct41.js` até `ct56.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.67 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar Assistir sem `Failed to fetch`/loading infinito;
- confirmar Descobrir carregando títulos normalmente e mantendo o filtro estrito;
- confirmar Histórico carregando normalmente;
- confirmar Perfil sem voltar para `Carregando perfil...`;
- confirmar temporadas sem loaders residuais;
- confirmar `Assistido` verde após marcação;
- confirmar footer `0.0.67` em Configurações;
- reconfirmar Watchlist, notas, faltantes e streaming.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
