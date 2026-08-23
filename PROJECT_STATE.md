# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.9`  
**Android atual:** `0.0.49`

## 1. Objetivo

Companion multiplataforma para filmes, séries e animes, com conta única, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta e notificações nativas no Android.

## 2. Regras permanentes

- Não criar tabela separada `CompletedSeries`; conclusão é derivada de progresso + TMDB + decisões manuais.
- Estados manuais do usuário têm prioridade e não podem ser apagados por importação.
- Web e Android devem manter paridade funcional, exceto recursos explicitamente nativos como notificações.
- Implementado/compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.

## 3. Assinatura Android

- `applicationId`: `com.cinetracker.app`.
- `versionCode` sempre crescente.
- A 0.0.48 estabeleceu o keystore dedicado permanente.
- Baseline SHA-256: `fe69519cd5669429446e4701cd5d0ad78c5a936b3130f27e478a05c0591353d3`.
- Da 0.0.49 em diante o CI falha se assinatura ou package id divergirem.

## 4. Android 0.0.49

Runtime: `ct41.js` + `ct47.js` + `ct48.js` + `ct49.js`.

### Home / Assistir

- `Home > Continuar assistindo` usa exatamente os itens com status `following`, a mesma origem de `Assistir > Acompanhando`.
- As duas áreas exibem botão de check para marcar o próximo episódio como visto.
- O próximo episódio é determinado pelo estado real retornado por `cinetracker_episode_state`, não apenas pela contagem total assistida.
- A marcação persiste via `cinetracker_set_episode_watched` e força nova leitura do progresso.

### Descobrir

- a camada final identifica os contêineres reais cujos filhos são cards e força `repeat(3, minmax(0, 1fr))`;
- poster 2:3 e metadados compactos permanecem preservados.

### Configurações

- build exibida como `0.0.49`.

### Notificações

- infraestrutura WorkManager/Supabase preservada sem alteração funcional nesta versão.

## 5. Web 0.4.9

- mesma sincronização Home/Continuar assistindo ↔ Assistir/Acompanhando;
- check do próximo episódio nas duas áreas;
- Descobrir reforçado em três colunas;
- `patch-v047.js` carregado por último;
- notificações continuam exclusivas do Android.

## 6. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications` — Android apenas

## 7. Pendências de validação

### Android 0.0.49

- confirmar atualização por cima da 0.0.48;
- confirmar Home e Acompanhando com exatamente os mesmos itens;
- confirmar check do próximo episódio nas duas áreas e atualização imediata do progresso;
- confirmar Descobrir com três cards por linha em todas as categorias/filtros;
- confirmar versão 0.0.49 e continuidade das notificações.

### Web 0.4.9

- confirmar deploy real;
- confirmar os mesmos três pontos de paridade da versão Android.

## 8. Continuidade

Antes de alterações importantes: ler este arquivo, conferir Release/commit atual e preservar as regras de domínio, assinatura e validação.
