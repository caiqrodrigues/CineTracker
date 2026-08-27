# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, Descobrir, configurações e backup por meio do Supabase.

## Versão atual em preparação

| Sistema | Versão | Estado |
|---|---:|---|
| Web | **0.99.2 FIX** | package `0.99.2`, cache `ct-web-0.99.2`; PR #21 aguardando merge/deploy final |
| Android | **0.99.2 FIX** | `versionName 0.99.2`, `versionCode 9912`; aguardando pipeline/release final |
| Backend lógico | **0.99.2** | migration/RPC Home aplicadas no Supabase |
| Windows | — | não lançado |

A primeira tentativa da 0.99.2 foi bloqueada por evidência real de interface: produção ainda em 0.99.1, navegação duplicada/legada, Home antiga e Perfil com `days is not defined`. Por isso a release não foi considerada concluída e recebeu um FIX dentro da própria 0.99.2.

## Runtime final 0.99.2 FIX

A camada final obrigatória é `apps/web/patch-v095-v0992-fix.js`, carregada depois de 0.99.1, Home 0.99.2 e compatibilidade 0.99.2.

Ela:
- intercepta navegação em `window` capture, antes dos handlers legados de `document`;
- rebindeia `ct0992Navigate`, `ct991Navigate` e `ct98Navigate` para uma rota única;
- mantém exatamente Home, Descobrir, Perfil e Configurações no menu;
- impede o retorno visual da aba Histórico e remove duplicações;
- corrige o crash `days is not defined` do Perfil;
- endurece inserts pessoais adicionando o `profile_id` autenticado quando patches antigos o omitem;
- infere `media_kind` em inserts legados de `media`;
- recupera cabeçalhos expansíveis de Séries/Filmes/Favoritos;
- força o rodapé `CineTracker • v0.99.2`.

## Perfil consolidado 0.99.1

A 0.99.2 FIX preserva e torna utilizáveis as melhorias da 0.99.1:
- estatísticas compactas e Tempo Total duplo;
- timeline temporal com Hoje centralizado e detalhe por dia;
- Séries, Séries favoritas, Filmes e Filmes favoritos;
- filtros de status e layout Carrossel/Grade/Lista;
- Não Iniciadas unificada à Watchlist sem progresso;
- visões completas ao clicar nos cabeçalhos;
- favorito no detalhe;
- quatro métricas extras solicitadas;
- Pra Você com 7 slots, ano >1990 e nota >=7,8;
- Calendário por último com Geral/Séries/Filmes;
- cards ricos de episódio e marcação inteligente de episódios anteriores;
- cinegrafia de ator em Filmes/Séries;
- Bingers dentro de Importar Dados.

## Home 0.99.2 — Séries

Lista vertical contínua com histórico oculto acima do ponto inicial e revelado via Pull-to-Reveal.

Ordem:
1. **Assistir a seguir** — séries iniciadas, pendentes e assistidas há <=30 dias, além de novas pendências liberadas pelo calendário;
2. **Juntando poeira** — pendências com mais de 30 dias sem reprodução;
3. **Em dia** — todos os episódios lançados já vistos;
4. **Não Iniciadas / Watchlist** — progresso zero;
5. **Concluídas** — estado `Completed`.

Cards em linha usam pôster 2:3, próximo `Sxx Exx`, assistidos/lançados, faltantes, nome/nota do próximo episódio e ✓. Quick mark grava `watch_history` + `episode_progress`, atualiza `last_watched_at`, avança o episódio e reordena LRU.

### Novos episódios

`syncReleaseStates()` concilia séries UpToDate/InProgress com a TMDB em abertura/retorno e atualização do Calendário. Novo episódio com `air_date <= hoje` move **Em dia -> Assistir a seguir**, aplica badge **Novo Episódio** e atualiza o ponteiro do próximo episódio. IDs TMDB substitutos <=0 são bloqueados.

## Home 0.99.2 — Filmes

- histórico **Vistos** oculto por Pull-to-Reveal;
- **Escolha para Hoje**: nota >=8,0, nunca visto, uma recomendação por perfil/data e sem repetição;
- **Assistir a seguir / Watchlist** com pôster, ano, duração, sinopse e ✓;
- quick mark grava `watch_history` + `AlreadySeen`.

## Reatividade pós-importação

A Home refaz leitura ao abrir, alternar Séries/Filmes, receber `cinetracker:data-changed`, recuperar visibilidade e detectar importação concluída. Atualizar Calendário também força a checagem de lançamentos.

## Backend 0.99.2

- migration `supabase/migrations/20260827004500_v0992_home_series_movies.sql`;
- RPC `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, escopo `auth.uid()`;
- tabela `daily_movie_recommendations_v0992` — RLS, uma recomendação por perfil/data e `unique(profile_id, tmdb_id)`.

## Versionamento

- Web/package: `0.99.2`
- Service Worker: `ct-web-0.99.2`
- Android: `versionName 0.99.2`, `versionCode 9912`
- Rodapé: `CineTracker • v0.99.2`
- Runtime final: `patch-v095-v0992-fix.js`
- Android bundle marker: `v0.99.2-fix-991-992-authoritative`

## Documentação canônica

- `PROJECT_STATE.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
- `docs/releases/0.99.2.md`
- `docs/validation/0.99.2.md`

**Regra permanente:** source, CI, deploy, publicação e teste real são estados distintos. Uma release não é chamada de concluída somente porque o código/marker existe.
