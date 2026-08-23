# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.59`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens e metadados oficiais.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico, sincronização e RPCs autenticadas.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.
- Android WorkManager: notificações periódicas em segundo plano exclusivamente no Android.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

## 4. Assinatura e atualização Android

- `applicationId`: `com.cinetracker.app`;
- `versionCode` sempre crescente;
- a build 0.0.48 estabeleceu o baseline permanente de assinatura após a perda da chave anterior;
- da 0.0.49 em diante as APKs devem atualizar por sobreposição normalmente e manter o mesmo certificado.

## 5. Estado Android 0.0.59

### Runtime

A Activity carrega:

1. `ct41.js` — gráfico diário interativo;
2. `ct47.js` — Assistir e detalhes de série/temporada/episódio;
3. `ct48.js` — baseline móvel consolidado;
4. `ct49.js` — correções de consistência de séries, Descobrir, Perfil e versão da build.

### Correções 0.0.59

- botões que marcam o próximo episódio passam a exibir `Assistido`;
- cards de séries exibem `Faltam X episódios` junto ao progresso quando há total conhecido;
- Descobrir oculta filmes/séries já vistos/concluídos, em progresso/acompanhamento e presentes na Watchlist/Watch Later;
- gráfico principal do Perfil volta a permanecer visível;
- Configurações exibe `CineTracker Android • build 0.0.59`;
- `versionCode` 59 e `versionName` `0.0.59`.

### Notificações

Infraestrutura nativa com WorkManager preservada.

## 6. Estado Web 0.4.8

A Web mantém a base compartilhada do produto, sem notificações nativas.

### Perfil / Tempo de Tela

- timeline diária em dark mode;
- navegação por dias e detalhe do que foi assistido.

### Assistir

- Carrossel inicial e persistente;
- Grade e Lista;
- seções `Em dia`, `Acompanhando`, `Juntando poeira`, `Não iniciadas`;
- série → temporada → episódio;
- marcação/desmarcação de episódios persistida no Supabase.

### Descobrir / Metadados

- três colunas nos grids principais;
- TMDB para metadados, posters e detalhes.

### Configurações

- alteração de e-mail e senha;
- importação e exportação de backup;
- versão Web permanece `0.4.8`.

## 7. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## 8. Regra de validação

Implementado/compilado não significa validado. Android exige instalação e teste real. Web exige build/deploy real e teste das telas no ambiente publicado.

## 9. Regra de documentação e publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release, `CHANGELOG.md` quando aplicável e pipeline correspondente. Android também exige Release + APK.

## 10. Pendências de validação Android 0.0.59

- confirmar instalação por sobreposição sobre a 0.0.58;
- confirmar `Assistido` nos botões de avanço de episódio;
- confirmar `Faltam X episódios` nas áreas de séries;
- confirmar que Descobrir não mostra títulos já conhecidos do usuário;
- confirmar que o gráfico do Perfil permanece visível;
- confirmar build `0.0.59` no rodapé de Configurações;
- confirmar continuidade das notificações.

## 11. Continuidade

Antes de alterações importantes: ler este arquivo, conferir a Release/commit atual e preservar as decisões arquiteturais e regras de validação.
