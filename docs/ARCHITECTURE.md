# CineTracker — Arquitetura atual

**Release lógica em correção:** `0.99.2 FIX2`  
**Atualizado em:** 2026-08-27

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:
- Web: runtime HTML/JavaScript em `apps/web`;
- Android: `Activity + WebView` com runtime Web embarcado e inline;
- Supabase: Auth, PostgreSQL, RPCs e Edge Functions;
- TMDB: metadados/calendário externos;
- GitHub: fonte de verdade do source, migrations, documentação e CI/CD.

## 2. Histórico do FIX e causa do FIX2

Vídeo/prints reais provaram que presença de patches no build não garantia a interface final: produção antiga, handlers legados, sidebar duplicada, Home antiga e Perfil com `days is not defined` já haviam motivado `patch-v095-v0992-fix.js`.

Depois da primeira publicação desse FIX, nova evidência real mostrou **Web e APK completamente travados**. A revisão encontrou churn recursivo de DOM:
- `patch-v093-v0992.js` possui `MutationObserver` que chama `footer()`;
- `patch-v095-v0992-fix.js` possui outro observer que chama `canonicalFooter()`/`decorateProfileHeaders()`;
- esses helpers podiam reatribuir o mesmo `textContent`;
- a escrita substituía o text node e produzia novo `childList MutationRecord`;
- o observer era acionado novamente, saturando a main thread no browser e na WebView.

O FIX2 mantém a release lógica 0.99.2 e adiciona uma camada final idempotente para interromper esse ciclo.

## 3. Ordem autoritativa do runtime

A base v95 e recuperações estáveis continuam presentes. O final da pilha é:
1. `patch-v088-v098-nav-pre.js` — gate inicial;
2. HOTFIX15/16 e core v95 preservado;
3. `patch-v089-v098.js` / `patch-v090-v098-compat.js`;
4. `patch-v091-v099-profile-lru.js`;
5. `patch-v092-v0991.js` — Perfil/Pra Você/filtros/favoritos;
6. `patch-v093-v0992.js` — Home vertical Séries/Filmes;
7. `patch-v094-v0992-compat.js` — detalhe local/recomendação;
8. `patch-v095-v0992-fix.js` — navegação/escritas/perfil;
9. **`patch-v096-v0992-unfreeze.js` — camada final anti-freeze FIX2.**

`patch-v068-v097.js` permanece desativado.

## 4. Anti-freeze FIX2

`patch-v096-v0992-unfreeze.js` é carregado antes dos observers atrasados de 250/500 ms começarem a observar `#app`. Ele obtém o descriptor original de `Node.prototype.textContent` e transforma apenas atribuições cujo valor já é exatamente igual ao conteúdo atual em no-op. Escritas que realmente alteram conteúdo continuam delegando ao setter nativo.

Markers: `__ct0992UnfreezeLoaded`, `__ctTextContentIdempotent992` e `fix2-idempotent-dom-mutation-guard`.

O refresh inicial é coalescido por `requestAnimationFrame`. O cache Web foi rotacionado para `ct-web-0.99.2-fix2`.

## 5. Navegação final

A camada FIX registra o gate em `window` no capture phase, antes dos listeners antigos de `document`, inclusive os que usam `stopImmediatePropagation`. Ela rebindeia `ct0992Navigate`, `ct991Navigate` e `ct98Navigate` para uma única rota.

Sidebar/mobile-nav devem conter somente:
- Home;
- Descobrir;
- Perfil;
- Configurações.

Histórico redireciona ao Perfil e não volta como destino visual.

## 6. Hardening das escritas do cliente

O wrapper final de `sbApi` corrige contratos legados antes da chamada REST:
- POST em `watch_history`, `episode_progress` e `media_overrides` recebe `profile_id` do usuário autenticado quando ausente;
- POST em `media` recebe `media_kind` quando ausente: `movie`, `series` ou `anime` inferido.

Valores explícitos são preservados e nenhuma credencial privilegiada é introduzida.

## 7. Perfil consolidado 0.99.1

A camada 0.99.1 continua responsável por estatísticas compactas, Tempo Total duplo, timeline com Hoje centralizado e detalhe por dia, Séries/Séries favoritas/Filmes/Filmes favoritos, filtros de status/layout, favoritos, quatro métricas extras, Pra Você com 7 slots, Calendário por último, episódios ricos, marcação inteligente, ator e Importar Dados.

O FIX preserva o binding global que elimina `days is not defined` e recupera cabeçalhos expansíveis.

## 8. Home 0.99.2 — Séries

Viewport vertical com histórico recente acima do ponto inicial para Pull-to-Reveal. Classificação:
- Assistir a seguir: pendência lançada + atividade <=30 dias, ou novo episódio;
- Juntando poeira: pendência + atividade >30 dias;
- Em dia: zero pendências lançadas, iniciada e não concluída;
- Não Iniciadas / Watchlist: zero episódios vistos;
- Concluídas: `Completed`.

Cards em linha usam pôster 2:3, próximo S/E, assistidos/lançados, faltantes, nome/nota e ✓. Quick mark grava histórico/progresso, atualiza `last_watched_at`, avança episódio e reordena LRU.

## 9. Sincronização de lançamentos

`syncReleaseStates()` executa no primeiro uso do dia, retorno de visibilidade e Calendário. Para séries com TMDB oficial positivo, calcula episódios lançados. Novo episódio move UpToDate -> InProgress/Assistir a seguir; zerar pendências retorna UpToDate.

Não há cron server-side nesta versão. IDs TMDB <=0 não são enviados ao proxy.

## 10. Home 0.99.2 — Filmes

- Vistos oculto por Pull-to-Reveal;
- Escolha para Hoje com nota >=8,0, nunca visto e sem repetição;
- Assistir a seguir / Watchlist;
- quick mark grava `watch_history` + `AlreadySeen`.

A seleção diária usa `daily_movie_recommendations_v0992`.

## 11. Backend

Migration: `20260827004500_v0992_home_series_movies.sql`.

`cinetracker_profile_home_dashboard_v0992()` é `SECURITY INVOKER`, usa `auth.uid()` e consolida mídia, histórico, progresso, estados, LRU e último S/E.

`daily_movie_recommendations_v0992` tem RLS, escopo `profile_id = auth.uid()`, PK perfil/data e unique perfil/TMDB.

## 12. Android FIX2

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: **9913**;
- bundle: `v0.99.2-fix2-unfreeze-991-992-authoritative`;
- workflow: `.github/workflows/build-android-v0992-fix2.yml`.

O APK 9912 anterior foi invalidado pelo travamento. O preparo Android exige v096 por último e o smoke inline compila todos os scripts embutidos. O run `33032044592` validou build, identidade, marker FIX2, assinatura, artifact e substituição da Release.

## 13. Reatividade

Home revalida ao abrir, alternar Séries/Filmes, receber `cinetracker:data-changed`, voltar à visibilidade e detectar importação concluída. Reconciliações que escrevem DOM devem ser idempotentes para não produzir MutationRecords sem mudança semântica.

## 14. Débito legado

Surrogate negativo ainda existe em `media.tmdb_id` para parte da importação. Caminhos recentes evitam chamadas TMDB com IDs <=0; separar ID interno de TMDB oficial continua recomendado.

## 15. Versionamento e validação

Toda alteração segue `docs/DEVELOPMENT_RULES.md`. Source, CI, deploy, APK publicado e smoke real são estados independentes. A 0.99.2 FIX2 só será funcionalmente encerrada depois de smoke real provar responsividade da Web e do APK 9913.
