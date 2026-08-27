# CineTracker — Arquitetura atual

**Release lógica em preparação:** `0.99.2`  
**Atualizado em:** 2026-08-26

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:

- Web: runtime HTML/JavaScript construído a partir de `apps/web`;
- Android: `Activity + WebView`, usando runtime Web embarcado e inline;
- Supabase: autenticação, PostgreSQL, RPCs e Edge Functions;
- TMDB: metadados externos e calendário de lançamentos;
- GitHub: fonte de verdade do source, migrations, documentação e pipelines.

## 2. Runtime Web 0.99.2

A base estável v95 continua preservada. A pilha final relevante é:

1. `patch-v088-v098-nav-pre.js` — gate autoritativo de navegação; Home delega à camada 0.99.2 quando disponível;
2. HOTFIX15/16 e demais camadas estáveis;
3. `patch-v089-v098.js` — Descobrir, Configurações, backup e UI 0.0.98;
4. `patch-v090-v098-compat.js` — compatibilidade;
5. `patch-v091-v099-profile-lru.js` — biblioteca/LRU do Perfil;
6. `patch-v092-v0991.js` — Perfil, Pra Você, Calendário e estabilidade 0.99.1;
7. `patch-v093-v0992.js` — Home vertical de Séries/Filmes, Pull-to-Reveal, quick mark e release sync.

`service-worker.js` usa namespace `ct-web-0.99.2` e não cacheia o shell HTML.

## 3. Android 0.99.2

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle alvo: `v0.99.2-home-series-movies-v95-core-inline-authoritative`.

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web para assets locais, converte scripts para inline e valida presença/ordem até a camada 0.99.2. O runtime principal não depende de fallback remoto.

## 4. Modelo persistente principal

- `profiles` — conta/configurações;
- `media` — filmes/séries e metadados;
- `media_overrides` — estados/decisões do usuário;
- `episode_progress` — progresso por episódio;
- `watch_history` — histórico normalizado e plays;
- `imports` — auditoria de importações;
- `daily_movie_recommendations_v0992` — escolha diária persistente de filmes sem repetição por perfil/TMDB.

Estados relevantes incluem `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater` e `AddedToWatchlist`. Decisões manuais continuam prioritárias. Transições automáticas 0.99.2 escrevem origem `system` e não apagam decisões manuais conflitantes.

## 5. Home 0.99.2

### Séries

A Home possui um viewport vertical próprio. O histórico de episódios recentes é renderizado acima do ponto inicial; após o render, o scroll é posicionado no início de **Assistir a seguir**. Puxar/rolar em direção ao topo revela o histórico sem transformá-lo em uma aba separada.

A classificação visual é calculada a partir do dashboard central e dos metadados lançados:
- Assistir a seguir: episódios lançados pendentes e atividade <=30 dias, ou novo episódio detectado;
- Juntando poeira: episódios lançados pendentes e atividade >30 dias;
- Em dia: zero pendências lançadas, série já iniciada e não concluída;
- Não Iniciadas / Watchlist: zero episódios vistos e estado de Watchlist;
- Concluídas: `Completed`.

O card busca o próximo episódio efetivamente lançado (`air_date <= hoje`) e exibe `Sxx Exx`, assistidos/lançados, faltantes e nota do episódio.

### Filmes

O histórico Vistos usa a mesma técnica de Pull-to-Reveal. A área inicialmente visível contém **Escolha para Hoje** e **Assistir a seguir / Watchlist**.

A escolha diária consulta TMDB com nota mínima 8.0, exclui filmes já vistos e IDs já recomendados, e persiste a seleção em `daily_movie_recommendations_v0992`.

## 6. RPC `cinetracker_profile_home_dashboard_v0992`

Migration: `20260827004500_v0992_home_series_movies.sql`.

A função é `SECURITY INVOKER`, escopada por `auth.uid()` e consolida:
1. `watch_history` — `last_watched_at`, plays e histórico;
2. `episode_progress` — contagem/timestamp assistido;
3. `media_overrides` — estados, favorito e timestamp de estado;
4. `media` — poster, runtime, total de episódios e `raw_tmdb`.

Além do LRU, a RPC retorna o último `season_number`/`episode_number` assistido para permitir que a Home descubra o próximo episódio pendente.

## 7. Quick mark e reatividade

Marcação rápida de episódio:
- grava `watch_history` manual com timestamp atual;
- cria/atualiza `episode_progress` manual;
- atualiza o botão equivalente na tela de detalhes quando montado;
- recalcula próximo episódio e categoria;
- dispara `cinetracker:data-changed` e força nova leitura.

Marcação rápida de filme grava histórico e `AlreadySeen` manual. O Perfil recebe o mesmo evento, portanto estatísticas, timeline e LRU são recalculados a partir do estado central.

Home também revalida ao ser aberta, ao alternar Séries/Filmes e ao recuperar visibilidade. Conclusão de importação invalida o cache local da Home.

## 8. Sincronização de lançamentos

`syncReleaseStates()` é a camada de reconciliação baseada em calendário/TMDB:
- roda no máximo uma vez por dia por cliente, salvo execução forçada pelo Calendário;
- considera apenas séries com TMDB oficial positivo em Em dia/Em andamento;
- atualiza `media.raw_tmdb`, runtime e totais;
- calcula episódios efetivamente lançados usando `last_episode_to_air`/temporadas;
- quando `aired > watched`, a categoria visual deixa Em dia e passa a Assistir a seguir; estados automáticos são ajustados para `InProgress`;
- ao zerar a pendência, estados automáticos voltam para `UpToDate`.

A 0.99.2 implementa essa checagem no cliente em abertura/Calendário; não existe scheduler Supabase autônomo nesta versão. A documentação não deve chamá-la de cron server-side.

## 9. Perfil/Descobrir 0.99.1 preservados

Perfil continua com single-flight, timeline de 7 dias, filtros/layouts, favoritos e métricas extras. Pra Você continua com 7 posições, ano >1990 e nota >=7.8; Calendário permanece como última sub-aba. Episódios ricos, marcação inteligente e cinegrafia do ator permanecem no core preservado.

## 10. IDs TMDB substitutos

IDs `<=0` não são enviados ao TMDB. A Home usa fallback local para metadados/progresso quando necessário. A separação definitiva entre surrogate interno e campo `tmdb_id` oficial continua como débito arquitetural legado.

## 11. Segurança

RPCs voltadas ao cliente operam com `SECURITY INVOKER` e `auth.uid()`. `daily_movie_recommendations_v0992` usa RLS por perfil. Edge Functions privilegiadas mantêm service role apenas server-side. Ver `docs/SECURITY.md`.

## 12. Versionamento

Toda nova unidade lógica recebe nova versão e atualiza source, migrations, documentação, CI e artefatos aplicáveis conforme `docs/DEVELOPMENT_RULES.md`.
