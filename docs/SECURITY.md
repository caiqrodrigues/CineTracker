# CineTracker — Segurança

**Release lógica:** `0.0.98`  
**Atualizado em:** 2026-08-26

Este documento separa controles aplicados de débitos conhecidos. Aviso de linter não é considerado corrigido sem alteração segura e validação correspondente.

## 1. Autenticação

Web e Android compartilham Supabase Auth.

### `ct-import-bingers-user`

A função Bingers continua com `verify_jwt=false` no gateway e valida o bearer token explicitamente consultando `/auth/v1/user`. HOTFIX16 mantém erros tipados, refresh/retry, cursor e precedência manual.

### `ct-backup-user` — 0.0.98

A nova função de backup usa o mesmo padrão de autenticação explícita:

1. exige `Authorization: Bearer ...`;
2. valida o token em `/auth/v1/user` usando `apikey` server-side;
3. obtém o `user.id` validado;
4. somente então acessa o REST interno com service role.

`verify_jwt=false` não torna a operação anônima; a verificação é executada no corpo da função para controle explícito de erro/sessão.

## 2. Isolamento de dados no backup

Snapshot pagina `imports`, `media_overrides`, `watch_history` e `episode_progress` com `profile_id` igual ao usuário autenticado. A tabela global `media` é lida somente pelos IDs referenciados no snapshot do usuário.

Restore:

- só deleta `episode_progress`, `watch_history`, `media_overrides` e `imports` do usuário autenticado;
- remapeia mídia por `(tmdb_id, media_type)`;
- remapeia `source_import_id` usando imports recriados;
- grava `profile_id` a partir do usuário autenticado, não do CSV fornecido;
- limita tamanhos máximos de arrays antes da restauração.

O arquivo importado não pode escolher outro `profile_id` operacional.

## 3. Backup em arquivo

O ZIP exportado contém dados pessoais sincronizados em CSV. Ele é entregue ao usuário pelo download do navegador ou pelo seletor nativo de criação de documento no Android. O CineTracker não envia o ZIP para terceiros durante a exportação.

Arquivos:

- `manifest.csv`;
- `profile.csv`;
- `imports.csv`;
- `media.csv`;
- `media_overrides.csv`;
- `watch_history.csv`;
- `episode_progress.csv`.

O import exige manifesto `cinetracker-csv-backup` antes de chamar o restore.

## 4. RPC de Histórico do Perfil

`cinetracker_profile_history_media(integer)` foi criada como `SECURITY INVOKER` e filtra `watch_history.profile_id = auth.uid()`. Não usa `SECURITY DEFINER` e não recebe ID arbitrário de usuário como argumento.

## 5. Metadados/TMDB

A ação Atualizar Metadados 0.0.98:

- enumera somente mídias relacionadas ao estado do usuário autenticado;
- consulta TMDB somente quando `tmdb_id > 0`;
- evita encaminhar surrogate IDs negativos nos caminhos novos;
- persiste metadados via sessão autenticada do usuário.

O débito arquitetural de separar surrogate IDs do campo `tmdb_id` continua aberto para código legado.

## 6. Limpar Cache

Limpar Cache atua somente no armazenamento temporário/local:

- `sessionStorage`;
- caches específicos de metadados;
- Cache Storage CineTracker;
- caches em memória da UI;
- atualização de Service Worker.

A ação não deleta dados persistidos no Supabase e não remove intencionalmente `cinetracker_session`.

## 7. Dados manuais e Bingers

Estados manuais têm precedência sobre inferências/importação: `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater` e `AddedToWatchlist`.

O importador Bingers preserva esse princípio e limpa somente dados de origem Bingers/import pertinentes ao perfil.

## 8. RLS e staging — débito legado

`public.ct_import_staging` já foi identificado com RLS desabilitado em auditoria anterior. O fluxo principal HOTFIX16/0.0.98 não deve depender de exposição insegura dessa tabela.

Não habilitar RLS cegamente sem policies compatíveis. Se a tabela for necessária, definir políticas mínimas; se não for mais necessária, remover/deprecar de forma controlada.

## 9. Advisories ainda abertos

Permanecem para revisão separada, sem serem mascarados como resolvidos pela 0.0.98:

- `_cinetracker_build_payload`: RLS habilitado sem policy;
- `ct_import_trakt_chunk_v2(...)`: `SECURITY DEFINER` com execução ampla;
- `ct_import_trakt_v1(...)`: `SECURITY DEFINER` com execução ampla;
- `ct_replace_bingers_temp(...)`: `SECURITY DEFINER` com execução ampla;
- `cinetracker_due_notifications()`: `SECURITY DEFINER` para authenticated;
- RPCs legadas de episódios com `SECURITY DEFINER`: revisar escopo por `auth.uid()`;
- Supabase Auth leaked-password protection desativada.

Cada função deve ser revisada individualmente para decidir entre revogar `EXECUTE`, migrar para `SECURITY INVOKER`, mover de schema ou manter com justificativa.

## 10. Segredos

- service role nunca deve ser commitada nem enviada ao cliente;
- `ct-backup-user` e `ct-import-bingers-user` obtêm service role por variável de ambiente Supabase;
- cliente recebe apenas chaves públicas apropriadas;
- GitHub Actions não deve imprimir secrets;
- keystore Android permanece fora do repositório e é restaurado pelo CI.

## 11. Edge Functions relevantes

- `ct-backup-user`: v1;
- `ct-import-bingers-user`: v8;
- TMDB functions: versões de deploy próprias e independentes da release lógica.

## 12. Android

Android usa runtime local inline. O ZIP de backup é salvo pelo `ACTION_CREATE_DOCUMENT`; importações usam o FileChooser do WebView. O app não precisa conceder acesso externo permanente aos arquivos do seu cache privado.

## 13. Processo obrigatório

Toda mudança de autenticação, autorização, RLS, policy, função privilegiada, segredo, upload/importação ou superfície pública deve:

1. receber versão;
2. possuir source no GitHub;
3. atualizar este documento;
4. possuir migration quando houver mudança de banco;
5. registrar validação em `docs/validation/`;
6. não ser declarada segura/validada sem evidência.
