# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.69`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.69

### Runtime

A Activity carrega `ct41.js` até `ct58.js`. O novo `ct58.js` é responsável pela recuperação do carregamento de episódios e exibição da nota individual TMDB de cada episódio.

### Correções desta versão

- notificações usam esquema de deduplicação v3 persistente;
- o backlog existente é absorvido como baseline na primeira execução da 0.0.69 para impedir que as mesmas notificações antigas reapareçam;
- não existe mais worker imediato disparado a cada `saveSession`; permanece apenas o worker periódico único;
- temporadas que ficam presas em `Carregando episódios...` recebem timeout, até 3 tentativas e botão manual de nova tentativa;
- episódios carregados exibem data, estado `Assistido` e nota TMDB individual quando disponível;
- as correções anteriores de Descobrir estrito, streaming deduplicado, progresso e feedback otimista permanecem.

### Configurações

- build exibida: `0.0.69`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `69`;
- `versionName`: `0.0.69`;
- artefato esperado: `cinetracker-android-0.0.69-debug.apk`;
- tag/release esperada: `android-v0.0.69`;
- workflow valida `ct41.js` até `ct58.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.69 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar que as três notificações antigas não reaparecem;
- confirmar que novas notificações reais continuam chegando apenas uma vez;
- confirmar abertura de todas as temporadas e carregamento de episódios;
- confirmar nota individual por episódio;
- reconfirmar estados Assistido e progresso após marcação;
- confirmar build `0.0.69` em Configurações.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
