# CineTracker — Segurança

**Release lógica:** `0.0.99`  
**Atualizado em:** 2026-08-26

Este documento registra controles existentes e débitos abertos. Aviso de linter não é tratado como corrigido sem alteração segura e validação correspondente.

## 1. Autenticação e isolamento

CineTracker usa Supabase Auth. Web e Android compartilham a mesma conta. Toda leitura/escrita de estado pessoal deve ser escopada por `auth.uid()` / `profile_id` autenticado ou equivalente validado no backend.

Estados manuais têm prioridade sobre importação/inferência: `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`.

## 2. RPC do Perfil 0.0.99

`cinetracker_profile_media_dashboard()` foi criada por `20260826234500_v099_profile_media_lru_dashboard.sql` com:

- `SECURITY INVOKER`;
- `set search_path = public`;
- filtros explícitos por `auth.uid()` em `watch_history`, `episode_progress` e `media_overrides`;
- grant somente para `authenticated`.

A RPC não recebe `profile_id` do cliente e, portanto, não permite ao chamador selecionar arbitrariamente outro perfil.

## 3. Sincronização reativa

A camada 0.0.99 reage a escritas já autorizadas pelo cliente e volta a consultar a RPC. Ela não introduz credenciais privilegiadas no navegador/Android. A ordenação por `last_watched_at` é derivada de timestamps persistidos no banco.

## 4. IDs TMDB substitutos

Surrogate IDs negativos continuam existindo no modelo legado. Os caminhos 0.0.98/0.0.99 não encaminham IDs `<= 0` à TMDB. No Perfil 0.0.99, esses cards abrem uma visualização local em vez de chamar `tmdb-proxy`.

A separação definitiva entre surrogate interno e `tmdb_id` oficial continua recomendada.

## 5. Backup

`ct-backup-user` usa `verify_jwt=false` no gateway, mas valida explicitamente o bearer token em `/auth/v1/user` dentro da função. Service role fica apenas no ambiente server-side. Snapshot/restauração são escopados ao usuário autenticado.

## 6. Importação Bingers

`ct-import-bingers-user` v8 mantém autenticação server-side, `client_run_id`, cursor/replay seguro, validação/dedupe, limpeza escopada e precedência manual. Finalização depende de contagens exatas.

## 7. RLS e staging

Estruturas históricas de staging devem ser avaliadas antes de mudanças de RLS. `public.ct_import_staging` já foi identificado historicamente com RLS desabilitado. Não habilitar RLS cegamente sem policies compatíveis; se a estrutura estiver obsoleta, preferir deprecação/remoção controlada.

## 8. Advisories ainda abertos

Continuam pendentes de tratamento individual:

- funções legadas `SECURITY DEFINER` expostas a papéis amplos;
- revisão de RPCs privilegiadas de episódios;
- Supabase Auth leaked-password protection desativada;
- revisão de staging/RLS/policies históricas.

Não fazer revogações/alterações em massa sem mapear consumidores e regressão.

## 9. Segredos

- service role nunca deve ser commitada nem exposta ao cliente;
- cliente usa apenas credenciais públicas apropriadas;
- GitHub Actions usa tokens/secrets do runner;
- keystore Android não é versionado no repositório.

## 10. Web / Android

Service Worker não cacheia o shell HTML. Android usa runtime principal local/inline. Links/IDs externos devem ser validados antes de chamadas a serviços terceiros.

## 11. Processo obrigatório

Toda mudança de autenticação, autorização, RLS, policy, `SECURITY DEFINER`, upload/importação, RPC pública ou segredo deve:

1. receber versão;
2. possuir source/migration no GitHub;
3. atualizar este documento;
4. registrar validação;
5. não ser declarada segura/validada sem evidência.

Consulte `docs/DEVELOPMENT_RULES.md`.
