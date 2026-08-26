# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, descoberta, configurações e backup por meio do Supabase.

## Versão atual

| Sistema | Versão | Identidade técnica |
|---|---:|---|
| Web | **0.0.98** | package `0.0.98`, cache `ct-web-0.0.98` |
| Android | **0.0.98** | `versionName 0.0.98`, `versionCode 996` |
| Backend lógico | **0.0.98** | Supabase + RPCs + Edge Functions versionadas separadamente |
| Windows | — | não lançado |

A release 0.0.98 substitui a linha `0.0.97 HOTFIX 18` como versão lógica atual.

## Navegação 0.0.98

A navegação principal passa a ter quatro destinos visíveis e autoritativos:

1. Home;
2. Descobrir;
3. Perfil;
4. Configurações.

A aba dedicada **Histórico foi removida**. Links/rotas legadas que ainda tentarem abrir `history` são redirecionados para Perfil. A camada `patch-v088-v098-nav-pre.js` captura a navegação antes dos handlers legados; `patch-v089-v098.js` fornece a UI 0.0.98; `patch-v090-v098-compat.js` redireciona a ponte legada/Android para `ct98Navigate`.

## Perfil 0.0.98

O Perfil foi reorganizado na seguinte sequência:

1. estatísticas principais compactas;
2. gráfico de atividade moderno em SVG;
3. estatísticas extras;
4. Histórico integrado.

O Histórico integrado contém dois carrosséis separados:

- **Séries assistidas** na parte superior;
- **Filmes assistidos** na parte inferior.

As estatísticas continuam server-side. Além de `cinetracker_profile_stats`, `cinetracker_series_state_stats` e `cinetracker_consumption_daily`, a 0.0.98 adiciona `cinetracker_profile_history_media(p_limit_per_type)`, que agrega mídias assistidas e `plays` por usuário sem depender da paginação do cliente.

## Descobrir 0.0.98

Ordem oficial:

1. **Pra você** — inicial;
2. **Em alta**;
3. **Mais aguardados**;
4. **Mais bem avaliados**;
5. **Calendário**.

`Em alta`, `Mais aguardados`, `Mais bem avaliados` e `Calendário` possuem filtros estritos **Todos / Filmes / Séries**. `Mais bem avaliados` é sempre reordenado por `vote_average` em ordem decrescente, usando `vote_count` como desempate.

A nova camada evita requests diretos ao TMDB para IDs substitutos `<= 0` nos caminhos 0.0.98. A arquitetura ainda registra o débito de separar definitivamente surrogate ID de TMDB ID no modelo legado.

## Configurações e backup 0.0.98

A área de backup foi consolidada visualmente em somente duas ações:

- **Exportar**;
- **Importar**.

### Exportar

Gera `cinetracker-backup-0.0.98.zip`, contendo CSVs sincronizados:

- `manifest.csv`;
- `profile.csv`;
- `imports.csv`;
- `media.csv`;
- `media_overrides.csv`;
- `watch_history.csv`;
- `episode_progress.csv`.

### Importar

Lê o ZIP/CSVs, valida o manifesto e restaura os dados do usuário autenticado. A restauração é feita pela Edge Function `ct-backup-user`, que autentica o bearer token no servidor, remapeia IDs de mídia/importação e restringe exclusões/restauração ao perfil autenticado.

### Manutenção

- **Limpar Cache**: limpa caches de sessão temporária/metadados, Cache Storage e caches em memória sem apagar a sessão autenticada nem o histórico persistente.
- **Atualizar Metadados**: consulta TMDB somente para IDs oficiais positivos e persiste título, ano, capa, duração, temporadas/episódios, gêneros e `raw_tmdb` atualizados.

## Android 0.0.98

Android continua usando `Activity + WebView` com runtime Web embarcado/inline e sem fallback remoto para o bundle principal.

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.98`;
- `versionCode`: `996`;
- bundle: `v0.0.98-profile-history-backup-discover-v95-core-inline-authoritative`.

A barra nativa mostra Home, Descobrir, Perfil e Configurações; Histórico não é uma aba visível. O bridge existente continua sendo usado para seleção de arquivo e gravação do ZIP exportado no Android.

## Backend 0.0.98

### Migration

`supabase/migrations/20260826230500_v098_profile_history_media.sql` adiciona `cinetracker_profile_history_media(integer)` como `SECURITY INVOKER`, filtrando por `auth.uid()`.

### Edge Function de backup

`supabase/functions/ct-backup-user/index.ts` implementa snapshot/restauração autenticados. Deploy Supabase inicial da função: **v1**.

A função usa `verify_jwt=false` no gateway porque o próprio corpo valida o bearer token contra `/auth/v1/user`. A service role permanece apenas no ambiente server-side.

### Bingers preservado

A 0.0.98 não remove o pipeline Bingers resiliente. `ct-import-bingers-user` continua preservando autenticação, `client_run_id`, cursor/replay, dedupe, precedência manual e verificação exata de conclusão.

O conjunto reconciliado de referência permanece:

- 3.078 itens de biblioteca;
- 12.696 registros de histórico;
- 16.216 reproduções;
- 14.904 reproduções de episódios;
- 1.312 reproduções de filmes;
- 227 séries com histórico.

## Build, CI e publicação

- `npm run build` executa verificações estáticas, build Web, remoção do overlay v97 e injeção da pilha 0.0.98.
- `.github/workflows/verify.yml` valida Web e runtime Android 0.0.98.
- `.github/workflows/build-android-v098.yml` compila, verifica identidade/assinatura, gera artifact e publica `android-v0.0.98` quando acionado pelo trigger oficial.

Build, deploy, APK e teste físico são estados de validação separados. Evidências executadas ficam em `docs/validation/0.0.98.md`.

## Segurança e precedência de dados

Estados manuais (`AlreadySeen`, `Completed`, `UpToDate`, `InProgress`, `NotInterested`, `Liked`, `Disliked`, `WatchLater`, `AddedToWatchlist`) continuam tendo prioridade sobre inferência/importação.

Débitos de segurança não relacionados diretamente à 0.0.98 continuam documentados em `docs/SECURITY.md`, incluindo revisão de RLS/staging, funções privilegiadas legadas e proteção de senha vazada.

## Documentação canônica

- `PROJECT_STATE.md` — estado técnico atual;
- `VERSIONS.md` — matriz de versões;
- `CHANGELOG.md` — histórico de releases;
- `docs/DEVELOPMENT_RULES.md` — regra obrigatória de versão/registro;
- `docs/ARCHITECTURE.md` — arquitetura;
- `docs/SECURITY.md` — controles e débitos de segurança;
- `docs/releases/0.0.98.md` — release atual;
- `docs/validation/0.0.98.md` — evidências da release.

Toda mudança futura deve receber nova versão e atualizar o GitHub conforme `docs/DEVELOPMENT_RULES.md`.
