# CineTracker Android — 0.99.2.3

App Android nativo leve baseado em `Activity + WebView`, com o mesmo runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2.3`;
- `versionCode`: `9923`;
- bundle obrigatório: `v0.99.2.3-fix2-unfreeze-authoritative`;
- runtime Web embarcado: CineTracker `0.99.2 FIX2`;
- patch anti-freeze obrigatório: `patch-v096-v0992-unfreeze.js`;
- release: `android-v0.99.2.3`;
- APK: `cinetracker-android-0.99.2.3-debug.apk`.

A identidade Android `0.99.2.3` republica a correção FIX2 sob um número explícito de APK. O runtime compartilhado permanece 0.99.2 FIX2; a Web não é renumerada por esta publicação Android.

## Correção de congelamento

A primeira publicação 0.99.2 apresentou travamento completo devido a churn recursivo entre `MutationObserver` e reatribuições idênticas de `textContent`. A camada final `patch-v096-v0992-unfreeze.js` torna essas atribuições idempotentes e interrompe o ciclo que saturava a thread principal da WebView.

## Consolidação preservada

O APK mantém:
- navegação Home / Descobrir / Perfil / Configurações;
- Histórico integrado ao Perfil;
- Perfil/timeline/favoritos/Pra Você da 0.99.1;
- Home vertical Séries/Filmes da 0.99.2;
- Pull-to-Reveal, quick mark, LRU e sincronização de lançamentos;
- Bingers em Importar Dados;
- hardening de `profile_id` e `media_kind`;
- proteção contra chamadas TMDB com IDs substitutos `<= 0` nos caminhos recentes.

## Runtime local e pipeline

`scripts/prepare-android-hotfix2-web.mjs` gera o runtime inline e injeta:
- `window.__ctAndroidBundle = 'v0.99.2.3-fix2-unfreeze-authoritative'`;
- `window.__ctAndroidBuild = '0.99.2.3'`.

`scripts/test-android-inline-hotfix6.mjs` compila todos os scripts inline e valida o marker FIX2.

Workflow: `.github/workflows/build-android-v09923.yml`.

O pipeline valida:
- build Web compartilhado 0.99.2 FIX2;
- runtime Android inline 0.99.2.3;
- `gradle assembleDebug`;
- `aapt`: package `com.cinetracker.app`, versionName `0.99.2.3`, versionCode `9923`;
- `apksigner`;
- artifact `cinetracker-android-0.99.2.3-debug`;
- Release `android-v0.99.2.3` + APK + `v09923-sha256.txt`.

Publicação técnica e teste funcional real continuam sendo estados separados.

Release: `docs/releases/0.99.2.3.md`.  
Validação: `docs/validation/0.99.2.3.md`.
