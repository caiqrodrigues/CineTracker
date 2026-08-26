# CineTracker — Segurança

**Release lógica:** `0.0.97 HOTFIX 18`  
**Atualizado em:** 2026-08-26

Este documento registra controles existentes e débitos abertos. Aviso de linter não é tratado como corrigido sem alteração segura e validação correspondente.

## 1. Autenticação

CineTracker usa Supabase Auth. Web e Android compartilham a mesma conta.

A importação Bingers server-side (`ct-import-bingers-user`) exige bearer token do usuário. A Edge Function está configurada com `verify_jwt=false` no gateway porque o próprio corpo da função valida o token consultando `/auth/v1/user`; isso não significa operação anônima.

HOTFIX16 diferencia erros de autenticação expirados/ausentes, falhas transientes e rejeições permanentes.

## 2. Isolamento por usuário

Toda leitura/escrita de estado pessoal deve ser escopada por `profile_id = auth.uid()` ou equivalente validado no backend.

A importação Bingers:

- limpa somente dados Bingers/import-origin do próprio perfil;
- preserva overrides manuais;
- não deve apagar estado manual por nova importação;
- só conclui depois de validar contagens/cursor.

## 3. Dados manuais têm precedência

Estados manuais são decisões do usuário e não podem ser sobrescritos por importação/inferência. Incluem `AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater` e `AddedToWatchlist`.

## 4. Importação de arquivos

O importador Bingers aceita somente a semântica de `library.csv` + `watches.csv`. Dados são validados, normalizados e enviados em batches.

Regras de integridade:

- nenhuma data ausente é inventada;
- source history IDs devem ser únicos por lote;
- TMDB/surrogate e tipo de mídia são validados;
- payload bulk de `watch_history` deve usar shape homogêneo;
- finalização é condicionada a total/cursor/histórico exatos.

## 5. RLS e staging

Estruturas históricas de staging de importação precisam ser avaliadas individualmente antes de qualquer alteração de RLS. Em auditoria anterior, `public.ct_import_staging` foi identificado com RLS desabilitado. O fluxo HOTFIX16 principal não deve depender de exposição insegura dessa tabela.

**Regra:** não executar `ALTER TABLE ... ENABLE ROW LEVEL SECURITY` apenas para silenciar advisory sem definir e testar policies compatíveis; isso pode interromper o aplicativo. Se a tabela não for mais necessária, preferir deprecação/remoção controlada; se for necessária, definir policies mínimas por usuário/serviço.

`ct_import_staging_chunks` já foi observado com RLS habilitado; continuar verificando policies efetivas antes de declarar seguro.

## 6. Advisories Supabase ainda abertos

Última revisão registrou advisories que precisam de tratamento explícito:

- `_cinetracker_build_payload`: RLS habilitado sem policy (INFO); revisar se a tabela precisa ser acessível por cliente;
- `ct_import_trakt_chunk_v2(...)`: função `SECURITY DEFINER` executável por `anon` e `authenticated` (WARN);
- `ct_import_trakt_v1(...)`: função `SECURITY DEFINER` executável por `anon` e `authenticated` (WARN);
- `ct_replace_bingers_temp(...)`: função `SECURITY DEFINER` executável por `anon` e `authenticated` (WARN);
- `cinetracker_due_notifications()`: `SECURITY DEFINER` executável por `authenticated` (WARN);
- RPCs de episódios `cinetracker_episode_state`, `cinetracker_mark_episode_through` e `cinetracker_set_episode_watched`: `SECURITY DEFINER` executáveis por `authenticated`; revisar se isso é intencional e se o corpo escopa por `auth.uid()`;
- Supabase Auth leaked-password protection desativada (WARN).

A correção recomendada para funções privilegiadas deve ser escolhida caso a caso: revogar `EXECUTE` de papéis que não precisam, usar `SECURITY INVOKER` quando possível ou mover função para schema não exposto. Não fazer alteração massiva sem teste de regressão.

## 7. Edge Functions ativas relevantes

Versões de deploy observadas:

- `ct-import-bingers-user`: v8;
- `tmdb-proxy`: v3;
- `cinetracker-web`: v3;
- `tmdb-image`: v2.

Existem funções antigas/testes ainda ativas no projeto Supabase. Elas devem ser inventariadas e desativadas/removidas quando comprovadamente sem uso para reduzir superfície de ataque. Não remover função sem mapear consumidores.

## 8. Segredos

- Chaves privadas/service role não devem ser commitadas.
- Cliente Web/Android pode possuir somente identificadores/chaves públicas apropriadas ao Supabase.
- Funções server-side usam secrets do ambiente Supabase.
- GitHub Actions usa secrets/tokens do runner; logs não devem imprimir secrets.
- Keystore Android é restaurado por mecanismo protegido do CI e não deve ser versionado no repositório.

## 9. TMDB e surrogate IDs

HOTFIX16 pode gerar surrogate IDs negativos para mídias sem TMDB real. O risco principal aqui é integridade/abuso de endpoint, não autenticação: IDs negativos não devem ser encaminhados ao TMDB como se fossem IDs oficiais.

Já foram observados 404 em `tmdb-proxy` para IDs negativos. Débito: adicionar guard `tmdb_id > 0` antes de chamadas externas ou separar surrogate ID do campo TMDB.

## 10. Web / Service Worker

O Service Worker não cacheia shell HTML de navegação; cache é limitado a imagens/metadados TMDB. Isso reduz risco de shell antigo persistir após hotfix e ajuda a evitar execução involuntária de uma versão obsoleta.

HOTFIX18 usa namespace `ct-web-0.0.97-hotfix18-documentation-governance`.

## 11. Android

Android usa WebView local com scripts inline e sem fallback remoto para o runtime principal. Navegação externa deve abrir no navegador/sistema conforme regras do app. Arquivos de importação nativos ficam em área privada/cache do app e devem ser limpos depois do fluxo.

## 12. Processo obrigatório

Toda mudança de autenticação, autorização, RLS, policy, função `SECURITY DEFINER`, segredo, upload/importação ou superfície pública deve:

1. receber nova versão da unidade lógica;
2. possuir alteração versionada no GitHub;
3. atualizar este documento;
4. usar migration quando houver mudança de banco;
5. registrar validação em `docs/validation/`;
6. não ser declarada corrigida sem evidência.

Consulte `docs/DEVELOPMENT_RULES.md`.
