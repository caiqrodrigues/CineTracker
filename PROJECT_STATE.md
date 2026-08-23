# CineTracker / Showly Companion — Project State

> Documento persistente de continuidade do projeto. Deve ser atualizado a cada mudança relevante para que o desenvolvimento possa ser retomado sem depender do histórico do ChatGPT.

**Última atualização:** 2026-08-23  
**Branch principal:** `main`  
**Web atual:** `0.4.8`  
**Android atual:** `0.0.60`

## 1. Objetivo

Companion multiplataforma para acompanhar filmes, séries e animes, com experiência sincronizada Web/Android, histórico real, progresso por episódio, Watchlist, favoritos, estatísticas, descoberta de conteúdo e notificações nativas no Android.

## 2. Integrações

- TMDB: títulos, capas, elenco, imagens, notas, temporadas/episódios e provedores de disponibilidade.
- Supabase: Auth, PostgreSQL, RLS, progresso, histórico, sincronização e RPCs autenticadas.
- GitHub: código, documentação, Releases e CI/CD.
- Vercel: publicação Web.
- Android WorkManager: notificações periódicas em segundo plano exclusivamente no Android.

## 3. Regras de domínio

Não criar tabela separada `CompletedSeries`. Conclusão deve ser derivada de progresso importado/manual + metadados oficiais. Estados manuais (`AlreadySeen`, `Completed`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade e não podem ser apagados por nova importação.

Descobrir deve representar conteúdo realmente fora da biblioteca/estado do usuário. Itens com qualquer estado persistente conhecido ou presentes no fluxo de acompanhamento não devem aparecer nos grids de descoberta.

## 4. Assinatura e atualização Android

- `applicationId`: `com.cinetracker.app`;
- `versionCode` sempre crescente;
- a 0.0.48 permanece como baseline permanente de assinatura;
- versões posteriores devem atualizar por sobreposição e preservar a assinatura existente.

## 5. Estado Android 0.0.60

### Runtime

A Activity carrega, nesta ordem:

1. `ct41.js` — gráfico diário;
2. `ct47.js` — Assistir e detalhes de série/temporada/episódio;
3. `ct48.js` — correções consolidadas do baseline;
4. `ct49.js` — episódios restantes, Perfil, filtro inicial e build;
5. `ct50.js` — descoberta estrita + padrão visual de mídia e disponibilidade.

### Descobrir

- todos os cards da aba são reavaliados após filtros e rerenders;
- títulos vistos, concluídos, em progresso, acompanhados, em Watchlist/WatchLater ou com outro estado persistente da conta são ocultados;
- a intenção da aba é mostrar apenas conteúdo fora do universo já conhecido do usuário.

### Filme / Série / Episódio

- detalhe padronizado com poster, título/metadados, nota TMDB, ações, sinopse e disponibilidade;
- `Onde assistir` é único por tela; caixas legadas duplicadas ficam ocultas;
- provedores do Brasil aparecem como cards horizontais e preservam categoria `Streaming`, `Grátis`, `Com anúncios`, `Aluguel` e `Compra` quando a TMDB informa;
- episódios exibem nota TMDB quando disponível;
- ação de episódio usa texto `Assistido`;
- cards do Android recebem nota TMDB quando disponível.

### Configurações

- build exibida: `0.0.60`.

## 6. Estado Web 0.4.8

Web permanece em 0.4.8. As alterações desta rodada foram implementadas na camada Android; não marcar a Web como equivalente à 0.0.60 sem implementação/deploy/validação próprios.

## 7. Backend relevante

- `cinetracker_continue_items_v2`
- `cinetracker_episode_state`
- `cinetracker_set_episode_watched`
- `cinetracker_watch_daily_timeline`
- `cinetracker_watch_day_details`
- `cinetracker_due_notifications`

## 8. Regra de validação

Implementado/compilado não significa validado. Android exige instalação e teste real. Web exige build/deploy real e teste das telas no ambiente publicado.

## 9. Regra de documentação e publicação

Toda versão relevante deve atualizar código-fonte, versionamento, `README.md`, `VERSIONS.md`, `PROJECT_STATE.md`, documentação de release, `CHANGELOG.md` quando aplicável e pipeline correspondente. Android também exige Release + APK.

## 10. Pendências de validação Android 0.0.60

- confirmar que todos os filtros de Descobrir removem títulos conhecidos;
- confirmar que busca/filtros continuam retornando itens desconhecidos normalmente;
- confirmar que `Onde assistir` aparece exatamente uma vez;
- confirmar cards horizontais de provedores no Brasil;
- confirmar notas e ações em detalhes e episódios;
- confirmar que marcação persistente de episódios continua funcionando;
- confirmar build `0.0.60` em Configurações;
- confirmar atualização por sobreposição da versão anterior.

## 11. Continuidade

Antes de alterações importantes: ler este arquivo, conferir a Release/commit atual e preservar as decisões arquiteturais e regras de validação.
