# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.68`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Regras de domínio

Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve mostrar apenas conteúdo realmente fora do universo do usuário. Qualquer título já visto, concluído, em progresso, acompanhado, em Watchlist/Watch Later ou com outro estado persistente deve ser excluído de todos os filtros e destaques.

## 3. Estado Android 0.0.68

### Runtime

A Activity carrega `ct41.js`, `ct47.js`, `ct48.js`, `ct49.js`, `ct50.js`, `ct51.js`, `ct52.js`, `ct53.js`, `ct54.js`, `ct55.js`, `ct56.js` e `ct57.js`.

### Correções desta versão

- notificações nativas passam a deduplicar por impressão digital estável de título + mensagem por 7 dias, além de `event_key`;
- o worker imediato de notificações passa a ser único, reduzindo disparos duplicados ao salvar a sessão repetidamente;
- marcação de próximo episódio recebe atualização visual imediata e otimista, com reversão em caso de falha;
- progresso/faltantes do card são atualizados imediatamente ao marcar um episódio;
- repetição crescente de notas em Home/Assistir é reduzida para uma única nota;
- `Carregando perfil...` é removido quando o gráfico/conteúdo já está disponível;
- loaders residuais em Histórico/Descobrir são removidos quando a tela já possui dados;
- Descobrir estrito, deduplicação de streaming, estados de acompanhamento e cálculo de faltantes são preservados.

### Configurações

- build exibida: `0.0.68`.

## 4. Build e publicação

- `applicationId`: `com.cinetracker.app`;
- `versionCode`: `68`;
- `versionName`: `0.0.68`;
- artefato esperado: `cinetracker-android-0.0.68-debug.apk`;
- tag/release esperada: `android-v0.0.68`;
- workflow valida `ct41.js` até `ct57.js` antes da compilação.

## 5. Validação

Implementado/compilado não significa validado. A 0.0.68 precisa ser instalada e testada em aparelho real.

Pendências específicas:
- confirmar que as mesmas três notificações não reaparecem;
- confirmar resposta visual imediata ao marcar Chaves/próximo episódio;
- confirmar uma única nota por card;
- confirmar Perfil sem `Carregando perfil...` abaixo do gráfico;
- reconfirmar Assistir, Descobrir, Histórico, Watchlist e streaming;
- confirmar build `0.0.68` em Configurações.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.
