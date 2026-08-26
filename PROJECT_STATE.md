# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-26  
**Branch principal:** `main`  
**Release lógica atual:** `0.0.99`  
**Web atual:** `0.0.99` — package/cache/source em `main`  
**Android atual:** `0.0.99` (`versionCode 997`) — source e pipeline dedicado em `main`  
**Backend lógico:** `0.0.99` — RPC LRU aplicada no Supabase  
**Windows:** não lançado

## 1. Regra de governança

Toda nova unidade lógica de atualização/mudança deve possuir versão nova e registro no GitHub. Código, documentação, versionamento, migrations, release note e validação devem permanecer sincronizados. Source, build, deploy, APK publicado e teste em aparelho real são estados diferentes.

## 2. Arquitetura atual

- Web: runtime HTML/JavaScript em `apps/web`.
- Android: Activity + WebView com runtime Web local/inline.
- Supabase: Auth, PostgreSQL, RPCs e Edge Functions.
- TMDB: metadados/imagens externos.
- GitHub `main`: fonte de verdade do source, migrations, documentação e CI/CD.

Estados manuais continuam tendo precedência sobre importação/inferência: `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`.

## 3. Perfil 0.0.99

A camada final é `apps/web/patch-v091-v099-profile-lru.js`, carregada depois da UI/compatibilidade 0.0.98.

Abaixo das estatísticas principais, o Perfil exibe quatro carrosséis horizontais:

1. Séries;
2. Séries favoritas;
3. Filmes;
4. Filmes favoritos.

Cards usam pôster 2:3, título, progresso, badge de favorito, última atividade e clique para detalhes. IDs TMDB oficiais abrem o detalhe existente; surrogate IDs negativos usam detalhe local e não são enviados à TMDB.

### LRU

Ordenação: `last_watched_at DESC`, com desempate por `media_id DESC`.

`last_watched_at` considera:
- `watch_history.watched_at`;
- `episode_progress.watched_at` para episódios assistidos;
- `media_overrides.watched_at` no estado `AlreadySeen` para filmes.

A camada reage a `cinetracker:data-changed`, envolve escritas via `sbApi` em `watch_history`, `episode_progress` e `media_overrides`, refaz a leitura central ao voltar para a aba/janela e possui reconciliação periódica enquanto o Perfil está visível.

### Subtelas

**Séries:** Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia e Concluídas.  
**Filmes:** Assistir a seguir / Watchlist e Já vistos.  
**Favoritos:** grids completos responsivos de 3 colunas em desktop/tablet e 2 em telas pequenas.

## 4. RPC do Perfil

Migration versionada/aplicada: `supabase/migrations/20260826234500_v099_profile_media_lru_dashboard.sql`.

RPC: `cinetracker_profile_media_dashboard()`.

Características:
- `SECURITY INVOKER`;
- escopo por `auth.uid()`;
- agrega histórico, episode progress e overrides;
- expõe `watched_episodes`, `total_episodes`, `last_watched_at`, `plays`;
- resolve flags de favorito, watchlist, WatchLater, InProgress, UpToDate, Completed, não iniciada e já vista.

## 5. Recursos 0.0.98 preservados

- navegação visível: Home, Descobrir, Perfil e Configurações;
- rota legada Histórico redirecionada para Perfil;
- Descobrir na ordem Pra você → Em alta → Mais aguardados → Mais bem avaliados → Calendário;
- filtros Todos/Filmes/Séries nas áreas aplicáveis e ranking decrescente;
- Backup & Restauração com Exportar/Importar e ZIP de CSVs;
- `ct-backup-user` v1;
- Limpar Cache e Atualizar Metadados;
- guard contra TMDB IDs `<= 0` nos caminhos novos.

## 6. Bingers consolidado

Import ID 6 concluído/verificado permanece referência:
- 3.078 itens de biblioteca;
- 12.696 watch records;
- 16.216 reproduções;
- 1.312 reproduções de filmes;
- 14.904 reproduções de episódios;
- 227 séries com histórico;
- 0 eventos sem correspondência.

`ct-import-bingers-user` permanece no deploy v8 com auth server-side, `client_run_id`, cursor/replay, validação, dedupe, precedência manual e finalização verificável.

## 7. Classificação atual das séries

Estado reconciliado do conjunto Bingers:
- 155 `Completed`;
- 47 `UpToDate`;
- 25 `InProgress`;
- 533 não iniciadas;
- 227 com histórico.

Séries com zero episódios não podem permanecer `InProgress` por importação.

## 8. Versionamento 0.0.99

Web:
- package `0.0.99`;
- cache `ct-web-0.0.99`;
- rodapé `CineTracker • v0.0.99`.

Android:
- `applicationId com.cinetracker.app`;
- `versionName 0.0.99`;
- `versionCode 997`;
- bundle alvo `v0.0.99-profile-lru-v95-core-inline-authoritative`;
- release alvo `android-v0.0.99`.

## 9. Validação/publicação

O workflow geral `Verify` está configurado para a pilha 0.0.99. O pipeline dedicado Android é `.github/workflows/build-android-v099.yml`.

Nunca considerar Web publicada apenas por existir em `main`, nem Android publicado apenas por existir o source. Evidências executadas ficam em `docs/validation/0.0.99.md`.

## 10. Débitos conhecidos

- modelo legado ainda pode armazenar surrogate negativo em `media.tmdb_id`; caminhos 0.0.98/0.0.99 evitam enviar esses IDs à TMDB, mas a separação arquitetural definitiva continua desejável;
- advisories Supabase históricos de RLS/`SECURITY DEFINER` e leaked-password protection continuam documentados;
- smoke autenticado Web e teste Android em dispositivo real devem ser registrados somente após execução real.

## 11. Documentos canônicos

- `README.md`;
- `VERSIONS.md`;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY.md`;
- `docs/releases/0.0.99.md`;
- `docs/validation/0.0.99.md`.
