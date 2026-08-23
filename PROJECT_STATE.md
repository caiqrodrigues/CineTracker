# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Android em desenvolvimento:** `0.0.47`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações de lançamentos.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens e metadados oficiais.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico, sincronização e RPCs autenticadas.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.
- Android WorkManager: notificações periódicas em segundo plano.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

## 4. Regra permanente de atualização Android

Toda versão Android deve instalar por cima da anterior, sem exigir desinstalação.

- `applicationId`: `com.cinetracker.app`;
- `versionCode` sempre crescente;
- mesma chave de assinatura em todas as versões;
- cache persistente `cinetracker-debug-signing-v1`;
- se a chave não existir, a build falha.

## 5. Estado Android 0.0.47

### Notificações

A infraestrutura da 0.0.46 foi preservada e já foi validada em aparelho real: notificações para novo episódio e filme elegível da Watchlist funcionam.

### Runtime móvel final

`ct47.js` é carregado por último e assume explicitamente o comportamento das telas que vinham sendo sobrescritas pela UI antiga.

#### Tempo de Tela

- gráfico de atividade por horário removido/ocultado;
- somente gráfico diário permanece;
- cards/barras no tema dark padrão do CineTracker;
- hoje e dias vizinhos continuam interativos.

#### Descobrir

- todos os grids da tela usam três cards por linha no Android;
- posters compactos em proporção 2:3;
- metadados secundários são reduzidos para caber em 3 colunas.

#### Assistir

- `Carrossel` é o modo inicial e persistente;
- modos `Grade` e `Lista` continuam disponíveis;
- ordem física: `Em dia` → `Acompanhando` → `Juntando poeira` → `Não iniciadas`;
- ao abrir, a tela posiciona a rolagem em `Acompanhando`, permitindo subir para `Em dia`;
- cards são clicáveis;
- série abre detalhes e temporadas;
- temporada expande episódios;
- episódio abre tela própria;
- episódios podem ser marcados/desmarcados como assistidos via Supabase.

### Home

- calendário de séries em acompanhamento é ocultado no Android, conforme decisão anterior.

## 6. Backend relevante

- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_due_notifications`

## 7. Regra de validação

Implementado/compilado não significa validado. Cada item visual/funcional só é validado após instalação e teste real no aparelho.

## 8. Regra de documentação e publicação

Toda versão deve atualizar código, Gradle, workflow, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, `docs/releases/<versão>.md`, `CHANGELOG.md` quando aplicável, Release GitHub e APK.

## 9. Pendências de validação 0.0.47

- confirmar remoção total do gráfico antigo de horário;
- confirmar três cards por linha em todas as categorias de Descobrir;
- confirmar posição inicial em Acompanhando e ordem das seções;
- confirmar Carrossel/Grade/Lista;
- confirmar série → temporada → episódio;
- confirmar marcação/desmarcação persistente de episódio;
- confirmar atualização da 0.0.47 instalada por cima da 0.0.46.

## 10. Continuidade

Antes de alterações importantes: ler este arquivo, conferir a Release/commit atual e preservar as decisões arquiteturais e regras de validação.
