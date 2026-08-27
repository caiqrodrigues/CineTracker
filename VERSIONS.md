# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-27

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.3** | package `0.99.3`, cache `ct-web-0.99.3`, pre-gate `patch-v097-v0993-nav-pre.js`, final `patch-v098-v0993-web.js` | `main`; Verify `33080026311` success; Vercel success; smoke real pendente |
| Android | **0.99.2.3** | `versionName 0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative` | publicado; não alterado pela Web 0.99.3 |
| Backend / Supabase | **0.99.2** | RPC `cinetracker_profile_home_dashboard_v0992`, tabela `daily_movie_recommendations_v0992` | migration aplicada; sem mudança na 0.99.3 |
| Windows | — | — | não lançado |

## Web 0.99.3

Release exclusiva do navegador Web desktop para recuperar navegação e reatividade do Descobrir sem substituir o runtime funcional acumulado.

- `patch-v097-v0993-nav-pre.js` carrega antes do gate capture 0.99.2 e recebe primeiro os cliques de navegação/tabs/filtros;
- `patch-v098-v0993-web.js` carrega depois do FIX2 e reconcilia Sidebar, pointer-events, fallback do Pra Você e rodapé;
- Sidebar canônica: Home / Descobrir / Perfil / Configurações;
- Histórico permanece integrado ao Perfil e é removido defensivamente do menu;
- cache `ct-web-0.99.3`;
- rodapé `CineTracker • v0.99.3`;
- diagnóstico disponível em `window.__ct0993Diagnostics`.

A 0.99.3 preserva `patch-v096-v0992-unfreeze.js` e todos os recursos 0.99.1/0.99.2 necessários.

### Publicação técnica

- commit de publicação validado: `192da4a72c64abe3e8d92df8cd23ebc93b0b675b`;
- Verify run `33080026311` / #1252: `success`;
- build/test Web 0.99.3: `success`;
- Vercel: `success`;
- smoke real no navegador PC: pendente.

## Divergência Web / Android

A divergência é deliberada e documentada. O usuário solicitou foco exclusivo no navegador Web. Portanto a Web avança para `0.99.3`, enquanto o Android permanece exatamente na publicação `0.99.2.3` / `versionCode 9923`.

Nenhum novo APK, `versionCode`, bundle Android ou GitHub Release Android é criado nesta unidade.

## Android 0.99.2.3

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2.3`;
- `versionCode`: `9923`;
- bundle: `v0.99.2.3-fix2-unfreeze-authoritative`;
- workflow: `.github/workflows/build-android-v09923.yml`;
- release: `android-v0.99.2.3`;
- APK: `cinetracker-android-0.99.2.3-debug.apk`;
- SHA-256: `a7fe3bdc069ff418197305bdf3a3d5fd0f06a7928963f62dea5dc20faa4a2853`.

## Regra obrigatória

Source, CI, deploy Web, publicação APK e teste em ambiente real são estados separados. CI/Vercel verde não substitui smoke funcional no navegador.

Release Web atual: `docs/releases/0.99.3.md`.  
Validação Web: `docs/validation/0.99.3.md`.  
Release Android publicada: `docs/releases/0.99.2.3.md`.
