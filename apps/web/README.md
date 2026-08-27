# CineTracker Web — 0.99.3

**Package:** `0.99.3`  
**Cache:** `ct-web-0.99.3`  
**Pre-gate:** `patch-v097-v0993-nav-pre.js`  
**Patch final:** `patch-v098-v0993-web.js`

## Runtime final

A pilha preserva core v95, 0.98, 0.99, 0.99.1, Home 0.99.2 e o anti-freeze FIX2. A ordem relevante termina em:

1. `patch-v092-v0991.js` — Perfil, Pra Você e filtros;
2. `patch-v093-v0992.js` — Home Séries/Filmes;
3. `patch-v094-v0992-compat.js` — compatibilidade;
4. `patch-v097-v0993-nav-pre.js` — gate Web desktop anterior ao listener capture legado;
5. `patch-v095-v0992-fix.js` — hardening legado de navegação/escritas/perfil;
6. `patch-v096-v0992-unfreeze.js` — anti-freeze FIX2;
7. `patch-v098-v0993-web.js` — Sidebar/Descobrir/rodapé Web 0.99.3.

## Navegação 0.99.3

A causa do clique quebrado no desktop era a precedência de listeners: `patch-v095-v0992-fix.js` registra `window.addEventListener('click', ..., true)` e usa `stopImmediatePropagation`. Uma camada posterior podia nunca receber o evento.

`patch-v097-v0993-nav-pre.js` é injetado antes desse gate e controla explicitamente:

- Home;
- Descobrir;
- Perfil;
- Configurações;
- tabs do Descobrir;
- filtros Geral/Séries/Filmes.

Pedidos legados de `history` redirecionam ao Perfil.

## Sidebar e Descobrir

`patch-v098-v0993-web.js` garante:

- exatamente quatro destinos na Sidebar e mobile-nav;
- remoção defensiva de Histórico/History;
- `pointer-events:auto`, hit-area e z-index para pílulas do Descobrir;
- fallback orientado do Pra Você quando não existem títulos elegíveis;
- rodapé `CineTracker • v0.99.3`;
- reconciliação idempotente para evitar novo churn de `MutationObserver`.

Diagnóstico: `window.__ct0993Diagnostics`.

## Funcionalidades preservadas

- Perfil 0.99.1 com timeline e expansões;
- Home Séries/Filmes 0.99.2;
- Pull-to-Reveal;
- quick mark e LRU;
- sincronização de novos episódios;
- episódios ricos e confirmação inteligente;
- cinegrafia;
- Bingers;
- backup;
- hardening de `profile_id` e `media_kind`;
- anti-freeze FIX2.

## Backend

Sem alteração na 0.99.3:

- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS;
- migration `20260827004500_v0992_home_series_movies.sql`.

## Plataforma

Esta release é Web-only. Android permanece `0.99.2.3`, `versionCode 9923` e não é reconstruído pela 0.99.3.

## Validação

`npm run build` executa `scripts/test-web-v0993.mjs` após montar o runtime. CI/Vercel não substituem smoke real no navegador PC.

Release: `docs/releases/0.99.3.md`.  
Validação: `docs/validation/0.99.3.md`.
