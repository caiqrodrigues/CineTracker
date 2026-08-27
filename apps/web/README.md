# CineTracker Web — 0.99.2 FIX2

**Package:** `0.99.2`  
**Cache:** `ct-web-0.99.2-fix2`  
**Patch final:** `patch-v096-v0992-unfreeze.js`

## Runtime final
A pilha preserva core v95, 0.98, 0.99, 0.99.1 e Home 0.99.2. O final é:
- `patch-v092-v0991.js` — Perfil, Pra Você, filtros e favoritos;
- `patch-v093-v0992.js` — Home vertical Séries/Filmes;
- `patch-v094-v0992-compat.js` — compatibilidade;
- `patch-v095-v0992-fix.js` — navegação/escritas/perfil;
- `patch-v096-v0992-unfreeze.js` — anti-freeze final FIX2.

## Travamento corrigido no FIX2
A primeira publicação do FIX congelava Web e WebView Android. `MutationObserver` das camadas 0.99.2/FIX chamava helpers que reatribuíam o mesmo `textContent`. Essa reatribuição criava novo `childList MutationRecord`, acionando novamente o observer e formando um ciclo infinito que saturava a main thread.

O FIX2 instala uma guarda idempotente para `Node.prototype.textContent`: se o valor novo já é igual ao atual, a escrita vira no-op. A guarda carrega antes dos observers atrasados começarem a observar `#app`. Marker: `__ct0992UnfreezeLoaded` / `fix2-idempotent-dom-mutation-guard`.

## Funcionalidades consolidadas
- navegação Home / Descobrir / Perfil / Configurações; Histórico fora do menu;
- Perfil 0.99.1 com timeline, filtros/layouts, favoritos, quatro métricas extras e expansões completas;
- Pra Você 7 slots, Calendário, episódios ricos, marcação inteligente, cinegrafia e Bingers;
- Home Séries 0.99.2 com Pull-to-Reveal, Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas/Watchlist, Concluídas, cards 2:3, quick mark e LRU;
- Home Filmes com Vistos Pull-to-Reveal, Escolha para Hoje >=8,0 e Watchlist;
- sincronização de novos episódios;
- `profile_id` autenticado e `media_kind` corrigidos em caminhos legados.

## Backend
- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS e não repetição;
- migration `20260827004500_v0992_home_series_movies.sql`.

## Publicação e validação
A Web FIX2 está em `main` e houve deploy Vercel/Verify com sucesso. Isso não substitui smoke real: a release só será considerada funcionalmente encerrada após Web desktop e Web Android permanecerem responsivos e navegáveis no uso real.

Rodapé: **`CineTracker • v0.99.2`**.  
Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
