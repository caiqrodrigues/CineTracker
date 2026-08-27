# CineTracker — Segurança

**Release lógica em preparação:** `0.99.2 FIX`  
**Atualizado em:** 2026-08-27

Este documento registra controles existentes e débitos abertos. Não considerar um item validado somente porque há código ou marker no build.

## 1. Autenticação e isolamento

CineTracker usa Supabase Auth. Toda leitura/escrita de estado pessoal deve permanecer escopada ao usuário autenticado (`auth.uid()` / `profile_id`). Estados manuais continuam prioritários sobre importação/inferência.

## 2. Hardening de escritas no FIX

A inspeção do schema confirmou que `watch_history`, `episode_progress` e `media_overrides` exigem `profile_id` e suas policies RLS exigem o usuário autenticado. Patches legados possuíam POSTs sem esse campo.

`patch-v095-v0992-fix.js` envolve `sbApi` e, somente em POSTs pessoais sem `profile_id`, adiciona o ID do usuário autenticado atual. O cliente não escolhe um perfil diferente e nenhuma service role é exposta.

O mesmo wrapper garante `media_kind` em inserts legados de `media` quando ausente (`movie`, `series` ou `anime`), evitando falhas de constraint. Valores explicitamente fornecidos não são sobrescritos.

## 3. RPC Home 0.99.2

`cinetracker_profile_home_dashboard_v0992()` foi criada pela migration `20260827004500_v0992_home_series_movies.sql` com:
- `SECURITY INVOKER`;
- `set search_path = public`;
- filtros por `auth.uid()`;
- uso apenas do contexto autenticado.

Ela não recebe `profile_id` arbitrário do cliente.

## 4. Recomendação diária

`daily_movie_recommendations_v0992` possui RLS. Policies de leitura/inserção limitam as linhas ao `profile_id = auth.uid()`.

A PK `(profile_id, recommendation_date)` limita uma escolha por dia e `unique(profile_id, tmdb_id)` impede repetir o mesmo filme para o perfil.

## 5. Transições automáticas de séries

Reconciliação de lançamentos consulta apenas TMDB IDs positivos. Estados automáticos usam `origin='system'`; a rotina não deve apagar decisões `origin='manual'`. A classificação visual também considera episódios efetivamente lançados para não depender apenas de override possivelmente antigo.

## 6. Quick mark

- episódio: `watch_history` + `episode_progress`, origem manual;
- filme: `watch_history` + `AlreadySeen`, origem manual.

O FIX garante o `profile_id` necessário antes do REST. Estatísticas e LRU são recalculados por novas leituras autorizadas.

## 7. Navegação e superfície Web

O gate final roda em `window` capture para resolver conflitos de listeners legados de `document`. Isso é controle de interface, não de autorização; todos os acessos ao banco continuam submetidos ao bearer token e RLS.

## 8. IDs TMDB substitutos

Surrogate IDs negativos continuam no modelo legado. Caminhos 0.99.x bloqueiam IDs <=0 para chamadas TMDB e oferecem detalhe local quando necessário. Separar o identificador interno do `tmdb_id` oficial continua recomendado.

## 9. Perfil 0.99.1 preservado

`cinetracker_profile_media_dashboard_v0991()` permanece `SECURITY INVOKER` e escopada por `auth.uid()`. O FIX não amplia privilégios dessa RPC.

## 10. Backup

`ct-backup-user` usa `verify_jwt=false` no gateway, mas valida explicitamente o bearer token em `/auth/v1/user` na função. Service role permanece server-side. Snapshot/restauração são escopados ao usuário autenticado.

## 11. Importação Bingers

`ct-import-bingers-user` v8 mantém autenticação server-side, `client_run_id`, cursor/replay, validação/dedupe, limpeza escopada e precedência manual.

## 12. RLS e staging

`public.ct_import_staging` foi identificado historicamente com RLS desabilitado. Não habilitar RLS cegamente sem mapear consumidores/policies; se obsoleto, remover/deprecar de forma controlada.

## 13. Advisories ainda abertos

- funções legadas `SECURITY DEFINER` com grants amplos;
- revisão de RPCs privilegiadas de episódios;
- leaked-password protection do Supabase Auth;
- staging/RLS/policies históricas.

Não fazer revogação em massa sem teste de regressão.

## 14. Segredos

- service role nunca no cliente/repositório;
- cliente usa credencial pública apropriada;
- GitHub Actions usa secrets/tokens do runner;
- keystore Android não é versionado.

## 15. Processo obrigatório

Mudanças em Auth, RLS, policies, RPCs, importação ou credenciais precisam de source/migration, documentação e validação. Source, build, deploy e teste real são estados separados.

Consulte `docs/DEVELOPMENT_RULES.md`.
