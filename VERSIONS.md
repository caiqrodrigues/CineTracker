# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-27

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.2 FIX2** | package `0.99.2`, cache `ct-web-0.99.2-fix2`, camada final `patch-v096-v0992-unfreeze.js` | `main`, Verify/Vercel success; smoke real ainda separado |
| Android | **0.99.2.3** | `versionName 0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative` | build/assinatura/artifact/Release publicados; smoke físico separado |
| Backend / Supabase | **0.99.2** | RPC `cinetracker_profile_home_dashboard_v0992`, tabela `daily_movie_recommendations_v0992` | migration aplicada |
| Windows | — | — | não lançado |

## Web 0.99.2 FIX2

A Web permanece em `0.99.2`. O anti-freeze final `patch-v096-v0992-unfreeze.js` impede o ciclo recursivo `MutationObserver -> textContent -> MutationObserver` que havia saturado a thread principal. O rodapé continua `CineTracker • v0.99.2`.

## Android 0.99.2.3

A pedido do usuário, a mesma correção FIX2 foi republicada com identidade Android explícita `0.99.2.3`.

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2.3`;
- `versionCode`: `9923`;
- bundle: `v0.99.2.3-fix2-unfreeze-authoritative`;
- workflow: `.github/workflows/build-android-v09923.yml`;
- Verify run: `33063626171` — `success`;
- Build/Release run: `33063626179` — `success`;
- release: `android-v0.99.2.3`;
- APK: `cinetracker-android-0.99.2.3-debug.apk`;
- SHA-256: `a7fe3bdc069ff418197305bdf3a3d5fd0f06a7928963f62dea5dc20faa4a2853`;
- checksum: `v09923-sha256.txt`.

O runtime embarcado continua sendo o runtime Web `0.99.2 FIX2`, com Perfil 0.99.1, Home 0.99.2, navegação autoritativa, hardening de escritas e a camada anti-freeze.

## Histórico imediato

- `0.99.2 / versionCode 9912`: publicação defeituosa, invalidada por congelamento.
- `0.99.2 FIX2 / versionCode 9913`: correção técnica publicada e validada em CI, sem smoke físico encerrado.
- `0.99.2.3 / versionCode 9923`: APK corrigido publicado sob a nova identidade solicitada.

## Regra obrigatória

Source, CI, deploy Web, publicação APK e teste em aparelho real são estados separados. Uma release técnica só é chamada de funcionalmente encerrada após evidência real de uso.

Release Android atual: `docs/releases/0.99.2.3.md`.  
Validação: `docs/validation/0.99.2.3.md`.
