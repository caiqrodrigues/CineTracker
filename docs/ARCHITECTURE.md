# CineTracker — Arquitetura atual

**Release lógica:** `0.0.99`  
**Atualizado em:** 2026-08-26

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:

- Web: runtime HTML/JavaScript construído a partir de `apps/web`;
- Android: `Activity + WebView`, usando runtime Web embarcado e inline;
- Supabase: autenticação, PostgreSQL, RPCs e Edge Functions;
- TMDB: metadados externos;
- GitHub: fonte de verdade do source, migrations, documentação e pipelines.

## 2. Runtime Web 0.0.99

A base estável v95 continua preservada. A pilha final relevante é:

1. `patch-v088-v098-nav-pre.js` — gate autoritativo de navegação;
2. HOTFIX15/16 e demais camadas estáveis preservadas;
3. `patch-v089-v098.js` — Descobrir, Configurações, backup e UI 0.0.98;
4. `patch-v090-v098-compat.js` — compatibilidade do bridge/navegação;
5. `patch-v091-v099-profile-lru.js` — Perfil 0.0.99 e versão final.

`service-worker.js` usa namespace `ct-web-0.0.99` e não cacheia o shell HTML.

## 3. Android 0.0.99

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.99`;
- `versionCode`: `997`;
- bundle alvo: `v0.0.99-profile-lru-v95-core-inline-authoritative`.

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web para assets locais, converte scripts para inline e valida presença/ordem da camada 0.0.99. O runtime principal não depende de fallback remoto.

## 4. Modelo persistente principal

- `profiles` — conta/configurações;
- `media` — filmes/séries e metadados;
- `media_overrides` — estados/decisões do usuário;
- `episode_progress` — progresso por episódio;
- `watch_history` — histórico normalizado e plays;
- `imports` — auditoria de importações.

Estados relevantes incluem `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater` e `AddedToWatchlist`. Origem manual tem precedência sobre inferência/importação.

## 5. Perfil 0.0.99

A UI do Perfil lê dados agregados do servidor e não tenta reconstruir todo o estado por paginação REST no cliente.

Quatro carrosséis principais:

- Séries;
- Séries favoritas;
- Filmes;
- Filmes favoritos.

Todos usam cards 2:3 e ordenação LRU por `last_watched_at DESC`.

### Subtelas

Séries: Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia, Concluídas.  
Filmes: Assistir a seguir / Watchlist, Já vistos.  
Favoritos: grid completo 2/3 colunas.

## 6. RPC `cinetracker_profile_media_dashboard`

Migration: `20260826234500_v099_profile_media_lru_dashboard.sql`.

A função é `SECURITY INVOKER`, escopada por `auth.uid()` e consolida três fontes:

1. `watch_history` — `last_watched_at`, plays e histórico;
2. `episode_progress` — episódios assistidos e timestamp de progresso;
3. `media_overrides` — favorito (`Liked`), watchlist, WatchLater, InProgress, UpToDate, Completed e `AlreadySeen`.

`last_watched_at` é o maior timestamp aplicável entre histórico, progresso e `AlreadySeen` de filmes. `watched_episodes` usa o maior valor coerente entre histórico e progresso para evitar regressão visual durante reconciliações.

## 7. Atualização reativa

`patch-v091-v099-profile-lru.js` escuta `cinetracker:data-changed` e refaz a leitura server-side. A camada também observa escritas feitas por `sbApi` em `watch_history`, `episode_progress` e `media_overrides`, e revalida ao recuperar foco/visibilidade. Existe reconciliação periódica somente enquanto o Perfil/subtela está visível para refletir mudanças externas.

Esse desenho faz a ordenação depender do timestamp persistente no banco, e não de ordem local de clique.

## 8. Detalhes e IDs TMDB substitutos

TMDB IDs positivos abrem a tela global de detalhes. Surrogate IDs negativos não são enviados à TMDB; o Perfil oferece detalhe local para esses cards. A separação definitiva entre surrogate interno e campo `tmdb_id` continua como débito arquitetural legado.

## 9. Recursos preservados da 0.0.98

- Home / Descobrir / Perfil / Configurações;
- Histórico integrado ao Perfil, sem aba principal;
- Descobrir com filtros por tipo e ranking decrescente;
- backup CSV/ZIP por `ct-backup-user`;
- Limpar Cache e Atualizar Metadados;
- importação Bingers resiliente v8.

## 10. Segurança

RPCs voltadas ao cliente devem operar com `SECURITY INVOKER` quando possível e filtrar por `auth.uid()`. Edge Functions privilegiadas mantêm service role somente no ambiente server-side. Detalhes e débitos ficam em `docs/SECURITY.md`.

## 11. Versionamento

Toda nova unidade lógica deve receber nova versão e atualizar source, migrations, documentação, CI e artefatos aplicáveis conforme `docs/DEVELOPMENT_RULES.md`.
