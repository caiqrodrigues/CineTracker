# CineTracker — Arquitetura atual

**Release lógica:** `0.0.97 HOTFIX 18`  
**Atualizado em:** 2026-08-26

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:

- **Web:** runtime HTML/JavaScript construído a partir de `apps/web`;
- **Android:** `Activity + WebView` nativos, usando runtime Web embarcado e inlined no APK;
- **Supabase:** autenticação, PostgreSQL, RPCs e Edge Functions;
- **TMDB:** metadados externos, imagens e status de mídia;
- **GitHub:** fonte de verdade do source, migrations, documentação e pipelines.

A release lógica atual é HOTFIX18. Edge Functions mantêm números de deploy próprios e independentes.

## 2. Web runtime

A base estável preservada é a linha v95. O pipeline atual executa:

1. `scripts/verify.mjs`;
2. `scripts/build-web.mjs`;
3. `scripts/apply-hotfix9-stability.mjs` para remover o overlay v97 instável;
4. `scripts/apply-hotfix10-selective.mjs` para injetar a pilha ativa em ordem controlada;
5. smoke test de startup.

Camadas relevantes preservadas:

- `patch-v085-hotfix15-import-transport.js` — navegação/transport de importação;
- HOTFIX10/11/12 — bridges, ações, sync e picker guard ativos;
- `patch-v083-hotfix13-bingers-semantics.js` — semântica Bingers;
- `patch-v087-hotfix16-import-resilience.js` — retry/auth/cursor resiliente;
- `patch-v074-hotfix1-version.js` — camada final de versão e Perfil, atualmente exibindo HOTFIX18 e preservando a funcionalidade de classificação criada no HOTFIX17.

`service-worker.js` usa namespace `ct-web-0.0.97-hotfix18-documentation-governance` e cacheia mídia/metadados, não o shell HTML de navegação.

## 3. Android runtime

Android usa `com.cinetracker.app`, `minSdk 26`, `targetSdk 34` e `compileSdk 35`.

HOTFIX18:

- `versionName`: `0.0.97 HOTFIX 18`;
- `versionCode`: `995`;
- bundle: `hotfix18-documentation-governance-v95-core-inline-authoritative`.

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web para `apps/android/app/src/main/assets/hotfix5`, transforma scripts referenciados em scripts inline e grava o marcador do bundle. A Activity carrega esse runtime local; não deve depender de fallback Vercel para o bundle principal.

O bridge nativo mantém seleção/persistência temporária dos arquivos de importação, restauração após recriação da Activity, navegação e recursos de notificação Android.

## 4. Modelo persistente principal

Entidades centrais:

- `profiles` — conta/configurações e resumo de importação;
- `media` — filmes/séries conhecidos pelo perfil/sistema;
- `media_overrides` — decisões persistentes do usuário e estados importados;
- `episode_progress` — progresso por episódio;
- `watch_history` — histórico normalizado e plays;
- `imports` — auditoria/estado das importações;
- estruturas de staging históricas — não devem ser tratadas como caminho principal sem revisão de RLS/policies.

Estados de domínio relevantes incluem `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater` e `AddedToWatchlist`.

**Precedência:** estado `origin='manual'` tem prioridade sobre inferência/importação. Importações futuras não podem apagar decisões manuais.

## 5. Importação Bingers

### Entrada

Somente `library.csv` e `watches.csv` são fontes de domínio. Ratings, avaliações, comentários e listas são ignorados.

### Normalização

- biblioteca é normalizada em filmes/séries;
- histórico é normalizado em filme/episódio;
- plays repetidos ficam em `external_ids.plays`;
- nenhuma data de watch é inventada;
- bulk payloads devem usar objetos com o mesmo conjunto de chaves.

A correção HOTFIX15 tornou linhas de filme de `watch_history` homogêneas adicionando `season_number=null` e `episode_number=null`.

### Edge Function HOTFIX16

`ct-import-bingers-user` deploy v8 implementa:

1. autenticação bearer server-side;
2. begin idempotente por `client_run_id`;
3. limpeza de importações Bingers anteriores, escopada ao perfil/origem;
4. batches de library/watches com validação e dedupe;
5. contrato de `processing_cursor` e replay seguro;
6. precedência de overrides manuais;
7. finalização somente após validação de cursor, total e contagem exata de histórico;
8. erro permanente encerra o import como `failed`.

A importação direta reconciliada foi registrada como import ID 6 e contém 3.078 itens de biblioteca + 12.696 watch records.

## 6. Classificação de séries

Histórico e estado atual são conceitos separados.

- `history_series`: séries com pelo menos um episódio realmente registrado no histórico;
- `Completed`: usuário em dia e série encerrada/cancelada;
- `UpToDate`: usuário em dia e série ainda ativa/aguardando conteúdo futuro;
- `InProgress`: usuário iniciou e ainda possui conteúdo pendente;
- `AddedToWatchlist` sem histórico: Não iniciadas.

Estado reconciliado atual do conjunto Bingers:

- 155 Completed;
- 47 UpToDate;
- 25 InProgress;
- 533 não iniciadas;
- 227 com histórico.

O erro Bingers de série `InProgress` com zero episódios é combatido por `ct_guard_bingers_import_inprogress()` e `ct_cleanup_bingers_zero_history_inprogress()`.

## 7. Estatísticas do Perfil

Contagens críticas são feitas no PostgreSQL, não carregando toda a tabela no cliente.

RPCs principais:

- `cinetracker_profile_stats()` — filmes, episódios, tempo etc.;
- `cinetracker_series_state_stats()` — completed/up-to-date/in-progress/not-started/history;
- `cinetracker_consumption_daily(p_limit_days)` — agregação diária por `watched_at`, somando `external_ids.plays`.

Isso evita erro causado por limites de paginação do REST e mantém Web/Android consistentes.

## 8. Identidade externa TMDB

Quando a origem não contém TMDB real, o importador pode gerar surrogate negativo para manter unicidade interna. **Surrogate negativo não é um TMDB válido.**

Débito arquitetural aberto: impedir requests `tmdb-proxy` para `tmdb_id <= 0` ou separar explicitamente surrogate ID do campo `tmdb_id`. Já foram observados 404 em requests com IDs negativos.

## 9. Segurança e autorização

- cliente opera com sessão Supabase do usuário;
- Edge Function Bingers valida bearer token no backend;
- serviço nunca deve permitir que importação de um usuário altere dados de outro;
- funções privilegiadas e RLS/policies são detalhadas em `docs/SECURITY.md`;
- não ativar RLS sem políticas compatíveis apenas para satisfazer linter.

## 10. Migrations da linha atual

- `20260826130000_hotfix13_profile_stats_plays.sql`;
- `20260826211500_bingers_authoritative_profile_stats.sql`;
- `20260826212500_profile_consumption_daily_rpc.sql`;
- `20260826213500_bingers_series_state_hardening.sql`;
- `20260826214500_profile_active_series_metric.sql`;
- `20260826215500_bingers_completion_requires_metadata.sql`.

## 11. Versionamento e continuidade

Toda nova unidade lógica de mudança deve receber versão nova e atualizar GitHub, documentação, source markers, migrations/workflows e validação aplicáveis. A regra normativa está em `docs/DEVELOPMENT_RULES.md`.

Source, build validado, deploy publicado e teste em dispositivo real são estados diferentes e devem ser reportados separadamente.
