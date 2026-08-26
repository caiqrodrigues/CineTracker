# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-26  
**Branch principal:** `main`  
**Release lógica atual:** `0.0.97 HOTFIX 18`  
**Web source:** `0.0.97 HOTFIX 18`  
**Android source:** `0.0.97 HOTFIX 18` (`versionCode 995`)  
**Backend lógico:** `0.0.97 HOTFIX 18`  
**Windows:** não lançado

## 1. Regra de governança

Toda nova unidade lógica de atualização/mudança deve possuir versão nova e registro no GitHub. Código, documentação, versionamento, migrations, release note e validação devem permanecer sincronizados. Regra completa em `docs/DEVELOPMENT_RULES.md`.

## 2. Objetivo e arquitetura

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta compartilhada Web/Android. Supabase armazena estado persistente, histórico, progresso, overrides e imports. TMDB fornece metadados externos. Android executa uma Activity/WebView com runtime Web embarcado; Web usa o mesmo domínio funcional.

Estados manuais (`AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) têm prioridade sobre inferências/importações e não podem ser apagados por nova importação.

## 3. Importação Bingers — estado consolidado

### Semântica

- fonte válida: `library.csv` + `watches.csv`;
- ratings, avaliações, comentários e listas: ignorados;
- plays repetidos preservados em `external_ids.plays`;
- datas ausentes não são inventadas;
- dados manuais prevalecem.

### Import reconciliado

Import ID 6 concluído e verificado:

- biblioteca: 3.078;
- filmes: 2.318;
- séries: 760;
- watch records: 12.696;
- movie watch records: 949;
- episode watch records: 11.747;
- movie plays: 1.312;
- episode plays: 14.904;
- total plays: 16.216;
- filmes na Watchlist: 1.309;
- séries não iniciadas: 533;
- séries com histórico: 227;
- eventos sem correspondência: 0.

Import ID 5 é histórico legado encerrado como `failed` / `LEGACY_PIPELINE_STALLED` e não deve ser interpretado como import em andamento.

### Backend HOTFIX16

`ct-import-bingers-user` está ativo em deploy Supabase v8 e possui autenticação server-side, erros tipados, begin idempotente por `client_run_id`, cursor/replay seguro, validação, dedupe, limpeza escopada, precedência manual e verificação exata antes de concluir.

A falha PostgREST `All object keys must match` foi corrigida mantendo shape uniforme de `watch_history`: filmes incluem `season_number=null` e `episode_number=null`.

## 4. Perfil e classificação de séries

Agregados do Perfil são calculados no servidor para evitar limite/paginação do cliente. RPCs principais:

- `cinetracker_profile_stats()`;
- `cinetracker_series_state_stats()`;
- `cinetracker_consumption_daily(p_limit_days)`.

Estado reconciliado das séries:

- 155 `Completed` / Concluídas;
- 47 `UpToDate` / Em dia;
- 25 `InProgress` / Em andamento;
- 533 Não iniciadas;
- 227 séries com histórico.

O usuário confirmou a regra: séries do conjunto revisado que estão encerradas/canceladas e em dia são Concluídas; as demais que aguardam episódio/temporada permanecem Em dia.

Erro Bingers de séries iniciadas com zero episódios vistos foi corrigido. `InProgress` importado exige histórico real, salvo decisão manual. A última verificação encontrou 0 séries `InProgress` sem histórico.

Proteções de banco:

- `ct_guard_bingers_import_inprogress()`;
- `ct_cleanup_bingers_zero_history_inprogress()`.

## 5. Estatísticas reconciliadas

- episódios assistidos: 14.904;
- reproduções de filmes: 1.312;
- tempo em filmes: 3 meses 20 dias 13 horas;
- tempo total: 16 meses 19 dias 5 horas.

O gráfico diário usa `cinetracker_consumption_daily` e soma `plays`.

## 6. Web HOTFIX18

Identidade atual de source:

- display: `0.0.97 HOTFIX 18`;
- package: `0.0.97-hotfix18-documentation-governance`;
- cache: `ct-web-0.0.97-hotfix18-documentation-governance`.

Runtime preservado:

- núcleo estável v95;
- recuperação de auth/sessão;
- HOTFIX15 transporte/picker;
- HOTFIX16 import resilience;
- HOTFIX17 Perfil/classificação;
- camada HOTFIX18 final para identidade/versionamento.

Deploy Web de produção deve ser confirmado separadamente; código em `main` não significa deploy concluído.

## 7. Android HOTFIX18

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.97 HOTFIX 18`;
- `versionCode`: `995`;
- runtime bundle: `hotfix18-documentation-governance-v95-core-inline-authoritative`;
- arquitetura: Activity + WebView, bundle local inline;
- mantém picker/importação nativa e stack Web validado antes do empacotamento.

Estado de build/publicação deve ser consultado no workflow HOTFIX18; não presumir APK/Release até confirmação.

## 8. Migrations recentes

- `20260826130000_hotfix13_profile_stats_plays.sql`;
- `20260826211500_bingers_authoritative_profile_stats.sql`;
- `20260826212500_profile_consumption_daily_rpc.sql`;
- `20260826213500_bingers_series_state_hardening.sql`;
- `20260826214500_profile_active_series_metric.sql`;
- `20260826215500_bingers_completion_requires_metadata.sql`.

## 9. Edge Functions relevantes

- `ct-import-bingers-user`: v8;
- `tmdb-proxy`: v3;
- `cinetracker-web`: v3;
- `tmdb-image`: v2.

Esses números são versões de deploy das funções e não substituem a release lógica `0.0.97 HOTFIX 18`.

## 10. Débitos conhecidos

### Identificação TMDB

Mídias sem TMDB real podem possuir surrogate IDs negativos. O `tmdb-proxy` não deve receber esses IDs; já foram observados 404 em requests negativos. Corrigir guard no cliente ou separar surrogate ID do campo TMDB.

### Segurança Supabase

Há advisories abertos para algumas funções `SECURITY DEFINER` executáveis por papéis amplos, além de leaked-password protection desativada. Estruturas de staging históricas devem ser revisadas quanto a RLS/policies sem habilitação cega.

## 11. Documentos canônicos

- `README.md`;
- `VERSIONS.md`;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY.md`;
- `docs/releases/0.0.97-HOTFIX18.md`;
- `docs/validation/0.0.97-HOTFIX18.md`;
- `docs/notes/2026-08-26-bingers-import-reconciliation.md`.

## 12. Critério de conclusão

Web: source + verify/build + deploy confirmado.  
Android: source + verify/build + identidade do APK + assinatura + artifact/Release; teste em aparelho somente quando realmente executado.  
Backend: migration/function source versionados + aplicação/estado ativo verificados.
