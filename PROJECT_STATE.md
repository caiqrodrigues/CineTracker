# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender do histórico de conversa.

**Última atualização:** 2026-08-26  
**Branch principal:** `main`  
**Release lógica atual:** `0.0.98`  
**Web atual:** `0.0.98`  
**Android atual:** `0.0.98` (`versionCode 996`)  
**Backend lógico:** `0.0.98`  
**Windows:** não lançado

## 1. Regra de governança

Toda nova unidade lógica de atualização/mudança deve possuir versão nova e registro no GitHub. Código, documentação, versionamento, migrations, release note e validação devem permanecer sincronizados. Regra normativa: `docs/DEVELOPMENT_RULES.md`.

## 2. Arquitetura

CineTracker é um companion Web/Android para filmes, séries e animes. Supabase centraliza autenticação e estado persistente; TMDB fornece metadados externos; Android usa `Activity + WebView` com runtime Web embarcado/inline; GitHub `main` é fonte de verdade do source, migrations, documentação e CI/CD.

Estados manuais (`AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) continuam com prioridade sobre inferências/importações.

## 3. Navegação 0.0.98

Destinos visíveis:

- Home;
- Descobrir;
- Perfil;
- Configurações.

A aba dedicada **Histórico foi removida**. A nova arquitetura instala `patch-v088-v098-nav-pre.js` antes dos handlers legados para capturar cliques e usa `patch-v090-v098-compat.js` para redirecionar chamadas `ct15Navigate`/`history` para `ct98Navigate`/Perfil. `patch-v089-v098.js` é a camada funcional autoritativa da release.

O Android também remove Histórico da barra visível; seu runtime utiliza a mesma navegação final 0.0.98.

## 4. Perfil 0.0.98

Sequência de cima para baixo:

1. estatísticas principais compactas;
2. gráfico de atividade moderno/tecnológico em SVG;
3. estatísticas extras;
4. Histórico integrado.

Histórico integrado:

- carrossel superior: Séries assistidas;
- carrossel inferior: Filmes assistidos.

RPCs do Perfil:

- `cinetracker_profile_stats()`;
- `cinetracker_series_state_stats()`;
- `cinetracker_consumption_daily(p_limit_days)`;
- `cinetracker_profile_history_media(p_limit_per_type)` — adicionada na 0.0.98.

A nova RPC é `SECURITY INVOKER`, usa `auth.uid()` e agrega `plays` por mídia sem depender de paginação do cliente.

## 5. Descobrir 0.0.98

Ordem oficial:

1. Pra você;
2. Em alta;
3. Mais aguardados;
4. Mais bem avaliados;
5. Calendário.

`Em alta`, `Mais aguardados`, `Mais bem avaliados` e `Calendário` têm subfiltros estritos Todos/Filmes/Séries. O carregamento usa endpoints por tipo quando necessário. Mais bem avaliados sempre recebe sort final decrescente por `vote_average`, com `vote_count` como desempate.

Pra você usa recomendações a partir do histórico recente com fallback de tendências e exclui mídias já pertencentes ao universo conhecido do usuário.

## 6. Configurações 0.0.98

### Backup & Restauração

A interface mostra somente duas ações:

- **Exportar**;
- **Importar**.

Exportar produz `cinetracker-backup-0.0.98.zip` com:

- `manifest.csv`;
- `profile.csv`;
- `imports.csv`;
- `media.csv`;
- `media_overrides.csv`;
- `watch_history.csv`;
- `episode_progress.csv`.

Importar lê o ZIP/CSVs e envia o snapshot normalizado para a Edge Function `ct-backup-user`.

### Edge Function `ct-backup-user`

Deploy inicial ativo: **v1**.

Fluxo:

1. valida bearer token contra Supabase Auth `/auth/v1/user`;
2. snapshot pagina tabelas por usuário e retorna somente mídias referenciadas;
3. restore upserta/remapeia mídia;
4. limpa somente dados restauráveis do perfil autenticado;
5. recria imports e remapeia `source_import_id`;
6. restaura overrides, watch history e episode progress em lotes;
7. restaura `display_name/settings` do perfil.

`verify_jwt=false` no gateway é intencional porque a validação do JWT é feita no corpo da função, seguindo o mesmo padrão já utilizado pelo importador Bingers.

### Limpar Cache

A implementação 0.0.98 limpa `sessionStorage`, Cache Storage CineTracker, caches de metadados e caches em memória, e solicita atualização do Service Worker. O estado persistente no Supabase e a sessão autenticada não são apagados.

### Atualizar Metadados

A ação enumera mídias relacionadas ao histórico/overrides/progresso do usuário, consulta o TMDB com concorrência controlada e persiste título, título original, ano, poster, duração, temporadas, episódios, gêneros e `raw_tmdb`. Mídias com `tmdb_id <= 0` são ignoradas no caminho novo e não são enviadas ao TMDB.

## 7. Android 0.0.98

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.98`;
- `versionCode`: `996`;
- bundle: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`.

Runtime local continua em `apps/android/app/src/main/assets/hotfix5`. O bridge nativo existente salva exportações pelo `ACTION_CREATE_DOCUMENT` e fornece o seletor de arquivos ao WebView, permitindo que o mesmo fluxo ZIP/CSV funcione no APK.

Pipeline dedicado: `.github/workflows/build-android-v098.yml`.

## 8. Web 0.0.98

Identidade:

- package: `0.0.98`;
- cache: `ct-web-0.0.98`;
- rodapé autoritativo: `CineTracker • v0.0.98`.

O build preserva o núcleo v95 e camadas Bingers necessárias, remove overlays/capturas obsoletas v97/v081/v084/v086 e injeta a pilha 0.0.98 em ordem verificada.

## 9. Bingers preservado

A release 0.0.98 não altera a semântica reconciliada do Bingers:

- fonte válida: `library.csv` + `watches.csv`;
- ratings/comentários/listas ignorados;
- plays preservados em `external_ids.plays`;
- datas ausentes não inventadas;
- estados manuais prevalecem.

`ct-import-bingers-user` continua no deploy v8 e mantém autenticação server-side, `client_run_id`, cursor/replay, validação, dedupe e confirmação exata antes de concluir.

Conjunto reconciliado de referência:

- biblioteca: 3.078;
- watch records: 12.696;
- reproduções: 16.216;
- episódios: 14.904 reproduções;
- filmes: 1.312 reproduções;
- séries com histórico: 227.

## 10. Backend/migrations da 0.0.98

- `supabase/migrations/20260826230500_v098_profile_history_media.sql` — aplicada em produção e versionada no GitHub;
- `supabase/functions/ct-backup-user/index.ts` — deploy v1 ativo e source versionado.

## 11. CI/CD 0.0.98

- `.github/workflows/verify.yml` — job `v098_stability` para build Web, semântica Bingers, runtime Android inline e invariantes 0.0.98;
- `.github/workflows/build-android-v098.yml` — build APK, `aapt`, `apksigner`, artifact, SHA-256 e Release `android-v0.0.98`.

Resultados executados devem ser registrados em `docs/validation/0.0.98.md` após cada pipeline; não se presume sucesso a partir do source.

## 12. Segurança

A nova RPC de histórico usa `SECURITY INVOKER`. A Edge Function de backup autentica o usuário no servidor antes de acessar dados com service role e escopa todas as operações pessoais pelo ID autenticado.

Débitos legados de RLS/funções privilegiadas e leaked-password protection permanecem descritos em `docs/SECURITY.md` e não são mascarados como resolvidos pela 0.0.98.

## 13. Documentos canônicos

- `README.md`;
- `VERSIONS.md`;
- `CHANGELOG.md`;
- `PROJECT_STATE.md`;
- `docs/DEVELOPMENT_RULES.md`;
- `docs/ARCHITECTURE.md`;
- `docs/SECURITY.md`;
- `docs/releases/0.0.98.md`;
- `docs/validation/0.0.98.md`.
