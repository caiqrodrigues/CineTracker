# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Android em desenvolvimento:** `0.0.46`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações de lançamentos.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens e metadados oficiais.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico, sincronização e RPCs autenticadas.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.
- Android WorkManager: verificações periódicas em segundo plano para notificações.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

## 4. Regra permanente de atualização Android

Toda versão Android deve instalar por cima da anterior, sem exigir desinstalação.

Requisitos obrigatórios:

- `applicationId` permanece `com.cinetracker.app`;
- `versionCode` sempre crescente;
- mesma chave de assinatura em todas as versões;
- workflow usa cache persistente `cinetracker-debug-signing-v1`;
- se a chave não existir, a build deve falhar em vez de gerar uma nova e quebrar a atualização instalada.

## 5. Estado Android 0.0.46

### Interface

Mantém o runtime móvel final carregado após os módulos estáveis, incluindo as correções combinadas de Assistir, Descobrir e Tempo de Tela. O módulo final desta versão é `ct46.js`.

### Notificações

Implementada infraestrutura nativa para avisar quando:

- um filme em `AddedToWatchlist` ou `WatchLater` estreia no dia atual;
- o próximo episódio de uma série `InProgress` é exibido no dia atual.

Arquitetura:

1. WebView autenticada sincroniza `access_token` com a camada nativa através de `CineTrackerNative.saveSession()`;
2. token fica em SharedPreferences privadas do app;
3. WorkManager executa `NotificationWorker` de hora em hora e também uma verificação imediata após sincronizar a sessão;
4. Worker chama a RPC autenticada `cinetracker_due_notifications()`;
5. eventos já notificados são deduplicados localmente por `event_key`;
6. Android 13+ solicita `POST_NOTIFICATIONS`;
7. canal nativo: `Lançamentos e episódios`.

### Banco

Migration `cinetracker_due_notifications_v046` cria a RPC autenticada `cinetracker_due_notifications()`.

## 6. Estatísticas obrigatórias

- filmes assistidos;
- séries com histórico/concluídas/em andamento;
- episódios assistidos;
- tempo de filmes, séries e total;
- Tempo de Tela diário com interação por data.

## 7. Regra de validação

Implementado/compilado não significa validado. Android, instalação, atualização, GitHub Actions, notificações e comportamento visual só são considerados validados após teste real correspondente.

## 8. Regra de documentação e publicação

Toda nova versão deve atualizar o projeto no GitHub, não apenas anexar o APK. O pacote mínimo de release é:

1. código-fonte;
2. versão Gradle;
3. workflow de build;
4. `README.md` quando arquitetura/recursos mudarem;
5. `VERSIONS.md`;
6. `PROJECT_STATE.md`;
7. `docs/releases/<versão>.md`;
8. `CHANGELOG.md` quando aplicável;
9. Release GitHub + APK;
10. status `Android Build` concluído.

## 9. Pendências que exigem teste real

- instalar 0.0.46 diretamente sobre a versão anterior;
- conceder permissão de notificações;
- confirmar notificação real para filme/episódio elegível;
- confirmar visualmente as correções combinadas de Assistir, Descobrir e Tempo de Tela;
- continuar validando nomes e capas em todas as telas.

## 10. Continuidade

Antes de alterações importantes: ler este arquivo, conferir commits/builds atuais, preservar decisões arquiteturais e registrar separadamente implementação, compilação e validação real.
