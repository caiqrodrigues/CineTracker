# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-24  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.75`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.75

Esta etapa trata somente do carregamento inicial antecipado das abas.

### Runtime

A Activity carrega `ct41`, `ct47`, `ct48`, `ct49`, `ct50`, `ct51`, `ct58`, `ct59`, `ct60` e o novo `ct61`.

### Alteração desta versão

- o WebView começa invisível para evitar mostrar estados incompletos da Home;
- `ct61` instala cache temporário apenas para leituras seguras do Supabase/TMDB;
- durante a abertura, o runtime visita internamente Home, Assistir, Descobrir, Histórico, Perfil e Configurações para aquecer dados e requisições;
- ao final do aquecimento, retorna para Home e chama a ponte nativa `appReady()`;
- a Activity então libera o WebView já preparado;
- fallback nativo em 10 segundos impede bloqueio permanente se o pré-carregamento falhar.

Nenhuma outra correção funcional foi incluída nesta etapa.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `75`;
- `versionName`: `0.0.75`;
- artefato: `cinetracker-android-0.0.75-debug.apk`;
- tag/release: `android-v0.0.75`;
- workflow `Verify` valida também `ct61.js`, compila, verifica pacote/versão e publica a Release.

## 5. Validação

A 0.0.75 deve ser validada especificamente quanto ao seguinte comportamento: abrir o aplicativo, aguardar a preparação inicial e então navegar pelas abas sem estados visíveis de carregamento tardio.

As demais correções de Home, Assistir, Descobrir e Perfil serão tratadas separadamente, uma por vez.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
