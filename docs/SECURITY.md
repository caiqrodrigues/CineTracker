# CineTracker — Segurança

**Release lógica em preparação:** `0.99.2`  
**Atualizado em:** 2026-08-26

Este documento registra controles existentes e débitos abertos. Aviso de linter não é tratado como corrigido sem alteração segura e validação correspondente.

## 1. Autenticação e isolamento

CineTracker usa Supabase Auth. Web e Android compartilham a mesma conta. Toda leitura/escrita de estado pessoal deve ser escopada por `auth.uid()` / `profile_id` autenticado ou equivalente validado no backend.

Estados manuais têm prioridade sobre importação/inferência: `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`.

## 2. RPC Home 0.99.2

`cinetracker_profile_home_dashboard_v0992()` foi criada por `20260827004500_v0992_home_series_movies.sql` com:

- `SECURITY INVOKER`;
- `set search_path = public`;
- filtros explícitos por `auth.uid()` em `watch_history`, `episode_progress` e `media_overrides`;
- grant somente para `authenticated`.

A RPC não recebe `profile_id` fornecido pelo cliente e não permite consultar arbitrariamente outro perfil.

## 3. Recomendação diária de filmes

`daily_movie_recommendations_v0992` possui RLS habilitado. As policies de select/insert exigem `profile_id = auth.uid()`.

A chave primária `(profile_id, recommendation_date)` garante no máximo uma escolha persistida por dia e a restrição `unique(profile_id, tmdb_id)` impede repetir o mesmo filme para o mesmo perfil. A seleção TMDB ocorre no cliente autenticado, mas somente a linha do próprio perfil pode ser persistida/lida pelas policies.

## 4. Transições automáticas de séries

A reconciliação de novos episódios usa apenas IDs TMDB oficiais positivos. Ela pode criar estados `origin='system'` (`InProgress`/`UpToDate`) e remove somente estados automáticos/importados equivalentes. Decisões `origin='manual'` não são apagadas por essa rotina.

A categoria visual da Home também considera pendências efetivamente lançadas, evitando depender exclusivamente de um override persistido possivelmente antigo.

## 5. Quick mark

Marcação rápida de episódios e filmes usa as mesmas APIs autenticadas do cliente:
- episódios: `watch_history` + `episode_progress` com `origin='manual'`;
- filmes: `watch_history` + `AlreadySeen` manual.

Nenhuma credencial privilegiada é adicionada ao navegador ou WebView. Estatísticas são recalculadas por nova leitura das RPCs já autorizadas.

## 6. IDs TMDB substitutos

Surrogate IDs negativos continuam existindo no modelo legado. Caminhos 0.99.x não encaminham IDs `<=0` à TMDB. A Home 0.99.2 usa fallback local quando não há TMDB oficial.

A separação definitiva entre surrogate interno e `tmdb_id` oficial continua recomendada.

## 7. Perfil 0.99.1 preservado

`cinetracker_profile_media_dashboard_v0991()` continua `SECURITY INVOKER`, escopada por `auth.uid()` e sem `profile_id` arbitrário do cliente. A 0.99.2 não substitui nem amplia privilégios dessa RPC.

## 8. Backup

`ct-backup-user` usa `verify_jwt=false` no gateway, mas valida explicitamente o bearer token em `/auth/v1/user` dentro da função. Service role fica apenas no ambiente server-side. Snapshot/restauração são escopados ao usuário autenticado.

## 9. Importação Bingers

`ct-import-bingers-user` v8 mantém autenticação server-side, `client_run_id`, cursor/replay seguro, validação/dedupe, limpeza escopada e precedência manual. Finalização depende de contagens exatas.

## 10. RLS e staging

Estruturas históricas de staging devem ser avaliadas antes de mudanças de RLS. `public.ct_import_staging` já foi identificado historicamente com RLS desabilitado. Não habilitar RLS cegamente sem policies compatíveis; se a estrutura estiver obsoleta, preferir deprecação/remoção controlada.

## 11. Advisories ainda abertos

Continuam pendentes de tratamento individual:

- funções legadas `SECURITY DEFINER` expostas a papéis amplos;
- revisão de RPCs privilegiadas de episódios;
- Supabase Auth leaked-password protection desativada;
- revisão de staging/RLS/policies históricas.

Não fazer revogações/alterações em massa sem mapear consumidores e regressão.

## 12. Segredos

- service role nunca deve ser commitada nem exposta ao cliente;
- cliente usa apenas credenciais públicas apropriadas;
- GitHub Actions usa tokens/secrets do runner;
- keystore Android não é versionado no repositório.

## 13. Web / Android

Service Worker não cacheia o shell HTML. Android usa runtime principal local/inline. Links/IDs externos são validados antes de chamadas a serviços terceiros.

## 14. Processo obrigatório

Toda mudança de autenticação, autorização, RLS, policy, `SECURITY DEFINER`, upload/importação, RPC pública ou segredo deve:

1. receber versão;
2. possuir source/migration no GitHub;
3. atualizar este documento;
4. registrar validação;
5. não ser declarada segura/validada sem evidência.

Consulte `docs/DEVELOPMENT_RULES.md`.
