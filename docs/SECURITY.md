# CineTracker — Segurança

**Release lógica em correção:** `0.99.2 FIX2`  
**Atualizado em:** 2026-08-27

Este documento registra controles existentes e débitos abertos. Não considerar um item validado somente porque há código ou marker no build.

## 1. Autenticação e isolamento

CineTracker usa Supabase Auth. Toda leitura/escrita de estado pessoal deve permanecer escopada ao usuário autenticado (`auth.uid()` / `profile_id`). Estados manuais continuam prioritários sobre importação/inferência.

## 2. Hardening de escritas no FIX

A inspeção do schema confirmou que `watch_history`, `episode_progress` e `media_overrides` exigem `profile_id` e suas policies RLS exigem o usuário autenticado. Patches legados possuíam POSTs sem esse campo.

`patch-v095-v0992-fix.js` envolve `sbApi` e, somente em POSTs pessoais sem `profile_id`, adiciona o ID do usuário autenticado atual. O cliente não escolhe um perfil diferente e nenhuma service role é exposta.

O mesmo wrapper garante `media_kind` em inserts legados de `media` quando ausente (`movie`, `series` ou `anime`), evitando falhas de constraint. Valores explicitamente fornecidos não são sobrescritos.

## 3. FIX2 anti-freeze e impacto de segurança

`patch-v096-v0992-unfreeze.js` corrige um problema de disponibilidade, não de autorização. A camada torna atribuições idênticas em `Node.textContent` um no-op para impedir ciclos de `MutationObserver` que saturavam a main thread.

O FIX2:
- não lê nem altera tokens, sessão ou credenciais;
- não amplia grants/RLS;
- não introduz service role no cliente;
- não altera payloads de rede;
- delega ao setter nativo quando o conteúdo realmente muda;
- é carregado antes dos observers atrasados iniciarem.

A superfície adicional é limitada ao override idempotente e configurável do setter `Node.prototype.textContent`. Essa decisão deve ser removida quando os observers legados forem refatorados para reconciliação idempotente local sem monkey-patch global.

## 4. RPC Home 0.99.2

`cinetracker_profile_home_dashboard_v0992()` foi criada pela migration `20260827004500_v0992_home_series_movies.sql` com:
- `SECURITY INVOKER`;
- `set search_path = public`;
- filtros por `auth.uid()`;
- uso apenas do contexto autenticado.

Ela não recebe `profile_id` arbitrário do cliente.

## 5. Recomendação diária

`daily_movie_recommendations_v0992` possui RLS. Policies de leitura/inserção limitam as linhas ao `profile_id = auth.uid()`.

A PK `(profile_id, recommendation_date)` limita uma escolha por dia e `unique(profile_id, tmdb_id)` impede repetir o mesmo filme para o perfil.

## 6. Transições automáticas de séries

Reconciliação de lançamentos consulta apenas TMDB IDs positivos. Estados automáticos usam `origin='system'`; a rotina não deve apagar decisões `origin='manual'`. A classificação visual também considera episódios efetivamente lançados para não depender apenas de override possivelmente antigo.

## 7. Quick mark

- episódio: `watch_history` + `episode_progress`, origem manual;
- filme: `watch_history` + `AlreadySeen`, origem manual.

O FIX garante o `profile_id` necessário antes do REST. Estatísticas e LRU são recalculados por novas leituras autorizadas.

## 8. Navegação e superfície Web

O gate final roda em `window` capture para resolver conflitos de listeners legados de `document`. Isso é controle de interface, não de autorização; todos os acessos ao banco continuam submetidos ao bearer token e RLS.

## 9. IDs TMDB substitutos

Surrogate IDs negativos continuam no modelo legado. Caminhos 0.99.x bloqueiam IDs <=0 para chamadas TMDB e oferecem detalhe local quando necessário. Separar o identificador interno do `tmdb_id` oficial continua recomendado.

## 10. Perfil 0.99.1 preservado

`cinetracker_profile_media_dashboard_v0991()` permanece `SECURITY INVOKER` e escopada por `auth.uid()`. O FIX2 não amplia privilégios dessa RPC.

## 11. Backup

`ct-backup-user` usa `verify_jwt=false` no gateway, mas valida explicitamente o bearer token em `/auth/v1/user` na função. Service role permanece server-side. Snapshot/restauração são escopados ao usuário autenticado.

## 12. Importação Bingers

`ct-import-bingers-user` v8 mantém autenticação server-side, `client_run_id`, cursor/replay, validação/dedupe, limpeza escopada e precedência manual.

## 13. RLS e staging

`public.ct_import_staging` foi identificado historicamente com RLS desabilitado. Não habilitar RLS cegamente sem mapear consumidores/policies; se obsoleto, remover/deprecar de forma controlada.

## 14. Advisories ainda abertos

- funções legadas `SECURITY DEFINER` com grants amplos;
- revisão de RPCs privilegiadas de episódios;
- leaked-password protection do Supabase Auth;
- staging/RLS/policies históricas.

Não fazer revogação em massa sem teste de regressão.

## 15. Segredos

- service role nunca no cliente/repositório;
- cliente usa credencial pública apropriada;
- GitHub Actions usa secrets/tokens do runner;
- keystore Android não é versionado.

## 16. Processo obrigatório

Mudanças em Auth, RLS, policies, RPCs, importação ou credenciais precisam de source/migration, documentação e validação. Mudanças de runtime/DOM que possam afetar disponibilidade também precisam de teste de responsividade real. Source, build, deploy e teste real são estados separados.

Consulte `docs/DEVELOPMENT_RULES.md`.
