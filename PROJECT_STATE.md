# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.71`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.71

### Runtime

A Activity passa a carregar somente `ct41`, `ct47`, `ct48`, `ct49`, `ct50`, `ct51`, `ct52`, `ct58`, `ct59` e `ct60`. Os patches intermediários `ct53`–`ct57` deixam de ser carregados para reduzir observers concorrentes e reescritas repetidas do DOM.

### Correções desta versão

- Home e Assistir deixam de usar observer + intervalo contínuos em `ct59`; atualização passa a ocorrer por navegação e eventos relevantes;
- gráfico do Perfil é restaurado se desaparecer após rerender/navegação;
- Carrossel, Grade e Lista ficam escondidos e acessíveis por um filtro `Exibição` recolhido;
- animações/transições dos cards principais são desativadas para reduzir tremor visual;
- nome do próximo episódio maior e botão `Assistido` centralizado permanecem;
- carregamento resiliente de episódios e nota TMDB individual continuam ativos;
- Descobrir estrito e streaming deduplicado permanecem preservados.

### Configurações

- build exibida: `0.0.71`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `71`;
- `versionName`: `0.0.71`;
- artefato esperado: `cinetracker-android-0.0.71-debug.apk`;
- tag/release esperada: `android-v0.0.71`;
- workflow valida somente os módulos efetivamente carregados pela Activity.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.71 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar que o aplicativo não apresenta mais tremor/re-render perceptível;
- confirmar gráfico do Perfil após entrar/sair da aba repetidamente;
- confirmar filtro Exibição recolhido em Assistir;
- confirmar Home/Assistir carregando normalmente;
- reconfirmar próximo episódio, episódios por temporada, notas, notificações e streaming.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
