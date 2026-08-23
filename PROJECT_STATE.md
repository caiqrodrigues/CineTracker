# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.63`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.63

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js` e `ct53.js`.

A 0.0.63 é a build de publicação das correções da 0.0.62. O `ct53.js` garante que Configurações apresente a versão correta da build.

### Perfil

- recuperação automática do gráfico diário se um rerender remover o componente;
- preservação do gráfico `ct41` quando presente;
- fallback de reconstrução via `cinetracker_watch_daily_timeline`.

### Botões Assistido

- estado padrão visual neutro/apagado;
- verde apenas quando o filme/série/episódio está efetivamente marcado como assistido;
- episódios respeitam a classe persistente `on`;
- detalhes de filme/série consultam `AlreadySeen`/`Completed`.

### Correções preservadas

- metadados de `Continuar assistindo` normalizados para evitar concatenação/corrupção;
- limpeza de carregamentos residuais fora da tela correspondente;
- deduplicação de streaming preservada;
- filtro estrito de Descobrir preservado.

### Configurações

- build exibida: `0.0.63`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `63`;
- `versionName`: `0.0.63`;
- artefato esperado: `cinetracker-android-0.0.63-debug.apk`;
- tag/release esperada: `android-v0.0.63`;
- workflow valida `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js` e `ct53.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.63 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar que o gráfico do Perfil não desaparece após navegar entre abas;
- confirmar botão `Assistido` neutro antes da marcação e verde depois;
- confirmar estados já vistos abrindo verdes corretamente;
- confirmar metadados de `Continuar assistindo` sem repetição/corrupção;
- confirmar ausência de carregamentos presos;
- reconfirmar Descobrir e streaming;
- confirmar build `0.0.63` em Configurações;
- confirmar atualização por sobreposição.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
