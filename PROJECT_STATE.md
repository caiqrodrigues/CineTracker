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

Esta 0.0.72 foi criada diretamente da base oficial 0.0.71. As antigas linhas 0.0.72/0.0.73 descartadas não são base desta versão.

### Runtime

A Activity carrega `ct41`, `ct47`, `ct48`, `ct49`, `ct50`, `ct51`, `ct58`, `ct59` e `ct60`. `ct52` foi retirado do runtime ativo porque disputava o gráfico do Perfil com `ct60`.

### Correções desta versão

- gráfico do Perfil usa uma única camada e é inserido imediatamente acima de Histórico;
- gráfico antigo/duplicado é removido antes da renderização do gráfico atual;
- Descobrir filtra por TMDB ID e título normalizado tudo que já esteja acompanhado, visto, concluído, em progresso, Watchlist/Watch Later ou com estado persistido;
- Home/Continuar assistindo carrega séries `following` e `dusty` com timeout/retentativa e sem observer permanente;
- Assistir mantém Carrossel/Grade/Lista dentro de `Exibição` e recebe próximo episódio + botão Assistido sem reprocessamento contínuo do DOM;
- nome do próximo episódio foi aumentado e o botão Assistido permanece centralizado;
- `ct60` não usa mais MutationObserver permanente, reduzindo tremor e rerenders concorrentes;
- carregamento resiliente de episódios e notas individuais permanece ativo via `ct58`.

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
- confirmar gráfico acima de Histórico após entrar/sair do Perfil repetidamente;
- confirmar Descobrir exibindo somente conteúdo 100% novo;
- confirmar Home e Assistir carregando sem travas;
- confirmar ausência de tremor/re-render perceptível;
- reconfirmar próximo episódio, episódios por temporada, notas, notificações e streaming.

## 6. Publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release e pipeline correspondente. Android também exige Release + APK.