# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-27  
**Branch principal:** `main`  
**Web:** `0.99.2 FIX2`, cache `ct-web-0.99.2-fix2`, anti-freeze final `patch-v096-v0992-unfreeze.js`  
**Android publicado:** `0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative`  
**Backend lógico:** `0.99.2`  
**Windows:** não lançado

## 1. Falha que originou o FIX2

Web e APK 0.99.2 chegaram a ficar completamente travados. A causa raiz foi um ciclo recursivo de DOM: observers históricos reatribuíam `textContent` mesmo sem alteração, a escrita criava novo `MutationRecord` e o observer era acionado novamente, saturando a thread principal.

A correção final é `patch-v096-v0992-unfreeze.js`, que transforma atribuições idênticas de `Node.textContent` em no-op antes dos observers atrasados iniciarem.

Markers obrigatórios:
- `__ct0992UnfreezeLoaded`;
- `fix2-idempotent-dom-mutation-guard`.

## 2. Runtime compartilhado

A pilha termina em:
1. base v95 + recuperações estáveis;
2. navegação/config/backup 0.98;
3. Perfil LRU 0.99;
4. `patch-v092-v0991.js`;
5. `patch-v093-v0992.js`;
6. `patch-v094-v0992-compat.js`;
7. `patch-v095-v0992-fix.js`;
8. `patch-v096-v0992-unfreeze.js`.

A Web permanece em `0.99.2 FIX2`. O APK Android publicado usa identidade `0.99.2.3` e embarca esse mesmo runtime corrigido.

## 3. Recursos preservados

- Home / Descobrir / Perfil / Configurações;
- Histórico integrado ao Perfil;
- Perfil 0.99.1, timeline, favoritos, filtros e Pra Você;
- Home Séries/Filmes 0.99.2;
- Pull-to-Reveal, quick mark, LRU e sincronização de lançamentos;
- Bingers em Importar Dados;
- hardening de `profile_id` e `media_kind`;
- bloqueio de TMDB externo para surrogate IDs `<= 0` nos caminhos recentes.

## 4. Backend

Migration aplicada: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.

- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS, PK perfil/data e unique perfil/TMDB.

## 5. Identidade Web

- package `0.99.2`;
- cache `ct-web-0.99.2-fix2`;
- rodapé `CineTracker • v0.99.2`;
- Vercel/Verify FIX2 já tiveram evidência de success;
- smoke real continua separado.

## 6. Android 0.99.2.3 publicado

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2.3`;
- `versionCode`: `9923`;
- bundle: `v0.99.2.3-fix2-unfreeze-authoritative`;
- workflow: `.github/workflows/build-android-v09923.yml`;
- Verify run `33063626171`: `success`;
- Build/Release run `33063626179`: `success`;
- release: `android-v0.99.2.3`;
- APK: `cinetracker-android-0.99.2.3-debug.apk`;
- SHA-256: `a7fe3bdc069ff418197305bdf3a3d5fd0f06a7928963f62dea5dc20faa4a2853`;
- checksum file: `v09923-sha256.txt`.

O pipeline confirmou build Web compartilhado, runtime Android inline, smoke JavaScript, Gradle, identidade via `aapt`, assinatura via `apksigner`, artifact e publicação da GitHub Release.

Histórico imediato:
- `9912`: defeituoso e invalidado por congelamento;
- `9913`: FIX2 publicado tecnicamente;
- `9923`: versão Android `0.99.2.3` publicada com a correção solicitada.

## 7. Validação restante

A publicação técnica de Android 0.99.2.3 está concluída. Ainda faltam evidências de aparelho real:
- instalação/upgrade;
- responsividade por pelo menos 60 segundos;
- Home / Descobrir / Perfil / Configurações em múltiplas alternâncias;
- Perfil sem congelamento;
- Home Séries/Filmes respondendo com dados reais.

Ver `docs/validation/0.99.2.3.md`.

## 8. Débitos conhecidos

- surrogate negativo em `media.tmdb_id` permanece como débito legado;
- advisories Supabase históricos continuam documentados;
- AGP 8.5.2 vs compileSdk 35 pode emitir warning;
- o monkey-patch idempotente de `Node.textContent` é correção transitória de compatibilidade.

## 9. Documentos canônicos

`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `apps/web/README.md`, `apps/android/README.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.2.3.md`, `docs/validation/0.99.2.3.md`.
