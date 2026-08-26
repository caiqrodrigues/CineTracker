# CineTracker — Arquitetura atual

**Release lógica:** `0.0.98`  
**Atualizado em:** 2026-08-26

## 1. Visão geral

CineTracker compartilha o mesmo domínio entre Web e Android:

- **Web:** HTML/JavaScript construído a partir de `apps/web`;
- **Android:** `Activity + WebView` nativos com runtime Web embarcado/inline;
- **Supabase:** autenticação, PostgreSQL, RPCs e Edge Functions;
- **TMDB:** metadados externos e imagens;
- **GitHub:** fonte de verdade de código, migrations, documentação e CI/CD.

## 2. Pipeline Web e ordem de runtime

O núcleo estável continua sendo a linha v95. O build executa:

1. `scripts/verify.mjs`;
2. `scripts/build-web.mjs`;
3. `scripts/apply-hotfix9-stability.mjs`, removendo o overlay v97 instável;
4. `scripts/apply-hotfix10-selective.mjs`, que injeta a pilha final;
5. smoke de startup.

Ordem relevante 0.0.98:

1. `patch-v088-v098-nav-pre.js` — gate autoritativo de navegação em captura;
2. `patch-v085-hotfix15-import-transport.js` e camadas HOTFIX10/11/12 preservadas;
3. `patch-v083-hotfix13-bingers-semantics.js`;
4. `patch-v087-hotfix16-import-resilience.js`;
5. camada legada de Perfil/versão preservada para compatibilidade;
6. `patch-v089-v098.js` — UI/fluxos 0.0.98;
7. `patch-v090-v098-compat.js` — bridge final para `ct98Navigate`.

Camadas obsoletas `patch-v081-hotfix12-nav-pre.js`, `patch-v084-hotfix14-real-device.js`, `patch-v086-hotfix15-import-retry.js` e o overlay `patch-v068-v097.js` não fazem parte do runtime final.

Service Worker: `ct-web-0.0.98`; não cacheia o shell HTML.

## 3. Navegação

Destinos oficiais: Home, Descobrir, Perfil e Configurações.

`patch-v088-v098-nav-pre.js` roda antes dos handlers legados e intercepta cliques de navegação. `history` é normalizado para `profile`. A camada final `ct98Navigate` possui renderizadores explícitos para Descobrir/Perfil e delega Home/Configurações às bases estáveis quando apropriado, reaplicando a normalização 0.0.98.

No Android, a barra nativa também tem quatro destinos visíveis. Chamadas existentes a `ct15Navigate` são encaminhadas por `patch-v090-v098-compat.js` para `ct98Navigate`.

## 4. Perfil e Histórico

Histórico deixa de ser tela/aba independente e passa a fazer parte do Perfil.

Ordem do Perfil:

1. estatísticas principais compactas;
2. gráfico de atividade SVG;
3. estatísticas extras;
4. Histórico integrado.

Histórico integrado:

- séries no carrossel superior;
- filmes no carrossel inferior.

RPCs:

- `cinetracker_profile_stats()`;
- `cinetracker_series_state_stats()`;
- `cinetracker_consumption_daily(p_limit_days)`;
- `cinetracker_profile_history_media(p_limit_per_type)`.

A RPC nova agrega por mídia, calcula `max(watched_at)` e soma `external_ids.plays`; usa `SECURITY INVOKER` + `auth.uid()` e rankeia separadamente filmes/séries.

## 5. Descobrir

A UI 0.0.98 controla diretamente a sequência:

`Pra você → Em alta → Mais aguardados → Mais bem avaliados → Calendário`.

`Pra você` usa o histórico recente como sementes para recomendações; se necessário, complementa com tendências. Itens já conhecidos são excluídos a partir de histórico/estados persistentes.

Nas outras quatro seções, `Todos`, `Filmes` e `Séries` alteram as fontes consultadas ou filtram estritamente o resultado. Mais bem avaliados aplica sort final descendente por nota.

## 6. Backup CSV/ZIP

### Cliente

`patch-v089-v098.js` gera/lê ZIP e CSVs. O pacote contém:

- `manifest.csv`;
- `profile.csv`;
- `imports.csv`;
- `media.csv`;
- `media_overrides.csv`;
- `watch_history.csv`;
- `episode_progress.csv`.

O ZIP de exportação usa entries armazenadas; a importação aceita entries armazenadas e, quando `DecompressionStream` está disponível, `deflate-raw`.

### Servidor

A Edge Function `ct-backup-user` autentica o bearer token via `/auth/v1/user` antes de usar service role. As ações são:

- `snapshot`: pagina tabelas por `profile_id`, identifica IDs de mídia referenciados e retorna um snapshot normalizado;
- `restore`: valida formato/limites, upserta/remapeia mídia, remove apenas o estado restaurável do perfil autenticado e recria imports/overrides/histórico/progresso.

`source_import_id` é remapeado após recriação dos registros em `imports`.

## 7. Manutenção

### Limpar Cache

Limpa:

- `sessionStorage`;
- chaves locais específicas de cache/metadados;
- Cache Storage CineTracker;
- caches em memória 0.0.98;
- solicita atualização de Service Worker.

Não apaga o banco nem a sessão autenticada.

### Atualizar Metadados

As mídias relacionadas a histórico/overrides/progresso são coletadas, enriquecidas em lotes via TMDB e persistidas em `media`. O caminho 0.0.98 só consulta TMDB para `tmdb_id > 0`.

## 8. Android

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.98`;
- `versionCode`: `996`;
- bundle: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`.

`scripts/prepare-android-hotfix2-web.mjs` copia o build para `assets/hotfix5`, inline os scripts e valida markers/ordem. O bridge nativo existente fornece:

- navegação;
- FileChooser para importação;
- `exportBackup` + `ACTION_CREATE_DOCUMENT` para salvar o ZIP;
- persistência temporária dos arquivos Bingers onde necessária.

## 9. Modelo persistente

Entidades centrais:

- `profiles`;
- `media`;
- `media_overrides`;
- `episode_progress`;
- `watch_history`;
- `imports`.

Estados manuais continuam prioritários em relação a importação/inferência.

## 10. Bingers preservado

O pipeline Bingers usa somente `library.csv` e `watches.csv`, preserva plays, não inventa datas e mantém precedência manual. `ct-import-bingers-user` v8 continua com begin idempotente, cursor/replay, validação, dedupe e finalização verificável.

A falha histórica `PGRST102 / All object keys must match` permanece corrigida pelo shape homogêneo de `watch_history`.

## 11. TMDB e surrogate IDs

IDs substitutos negativos não são IDs TMDB. Os caminhos novos de Descobrir/Atualizar Metadados bloqueiam requests externos quando o ID é `<= 0`.

O débito estrutural de separar definitivamente surrogate ID do campo `tmdb_id` permanece registrado porque código legado fora da camada 0.0.98 ainda pode conhecer esses IDs.

## 12. Migrations e funções da release

- `20260826230500_v098_profile_history_media.sql`;
- `supabase/functions/ct-backup-user/index.ts` — deploy v1.

Migrations da linha Bingers/HOTFIX17 permanecem parte do histórico e não foram removidas.

## 13. Segurança

- RPC nova: `SECURITY INVOKER` e `auth.uid()`;
- backup server-side: bearer obrigatório e validação explícita antes da service role;
- operações pessoais escopadas ao usuário autenticado;
- segredos permanecem fora do cliente/repositório.

Débitos legados são acompanhados em `docs/SECURITY.md`.

## 14. CI/CD

- `Verify`: build/semântica/runtime 0.0.98;
- `build-android-v098.yml`: APK, identidade, assinatura, artifact, SHA e Release.

Resultados executados são fonteados em `docs/validation/0.0.98.md`.
