# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-22  
**Branch principal:** `main`  
**Android em desenvolvimento:** `0.0.48`

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
- se a chave não existir, a build falha;
- desde a 0.0.48, o CI baixa o APK publicado da 0.0.46 e compara certificado SHA-256 e package id antes de publicar uma nova Release.

## 5. Estado Android 0.0.48

### Notificações

A infraestrutura da 0.0.46 foi preservada e já foi validada em aparelho real: notificações para novo episódio e filme elegível da Watchlist funcionam.

### Runtime Android consolidado

A Activity não carrega mais a pilha antiga `ct33/34/35/37/38/39/46`. A sequência passa a ser apenas:

1. `ct41.js` — gráfico diário interativo;
2. `ct47.js` — Assistir e detalhes de série/temporada/episódio;
3. `ct48.js` — correções finais de Perfil, Descobrir, Configurações e navegação.

### Perfil / Tempo de Tela

- gráfico antigo de atividade por horário removido/ocultado;
- card `Horário de pico` removido;
- gráfico diário permanece em dark mode;
- toque em um dia abre o que foi assistido.

### Descobrir

- três cards por linha em todas as categorias/filtros;
- posters compactos 2:3;
- metadados reduzidos para layout móvel.

### Assistir

- Carrossel como padrão;
- Grade e Lista disponíveis;
- ordem física: `Em dia` → `Acompanhando` → `Juntando poeira` → `Não iniciadas`;
- abertura posicionada em `Acompanhando`;
- cards clicáveis;
- série → temporadas → episódios → tela do episódio;
- marcação/desmarcação persistente de episódio assistido.

### Configurações

- build deve aparecer uma única vez como `0.0.48`;
- valores antigos `0.0.37` são substituídos no runtime Android.

## 6. Backend relevante

- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_due_notifications`

## 7. Regra de validação

Implementado/compilado não significa validado. Cada item visual/funcional só é validado após instalação e teste real no aparelho.

## 8. Regra de documentação e publicação

Toda versão deve atualizar código, Gradle, workflow, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, `docs/releases/<versão>.md`, `CHANGELOG.md` quando aplicável, Release GitHub e APK.

## 9. Pendências de validação 0.0.48

- confirmar instalação por cima da 0.0.46;
- confirmar versão única 0.0.48 em Configurações;
- confirmar remoção total do gráfico de horário;
- confirmar três cards por linha em Descobrir;
- confirmar ordem e posição inicial de Assistir;
- confirmar Carrossel/Grade/Lista;
- confirmar série → temporada → episódio e marcação persistente;
- confirmar continuidade das notificações.

## 10. Continuidade

Antes de alterações importantes: ler este arquivo, conferir a Release/commit atual e preservar as decisões arquiteturais e regras de validação.
