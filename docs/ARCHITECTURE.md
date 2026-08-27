# CineTracker — Arquitetura atual

**Release Web atual:** `0.99.3`  
**Android publicado:** `0.99.2.3`  
**Backend lógico:** `0.99.2`  
**Atualizado em:** 2026-08-27

## 1. Visão geral

CineTracker possui:

- Web: runtime HTML/JavaScript em `apps/web`;
- Android: `Activity + WebView` com runtime Web embarcado próprio;
- Supabase: Auth, PostgreSQL, RPCs e Edge Functions;
- TMDB: metadados/calendário externos;
- GitHub: fonte de verdade de source, migrations, documentação e CI/CD.

A Web 0.99.3 é uma unidade exclusiva do navegador desktop. O Android permanece publicado em 0.99.2.3 e não é reconstruído por esta release.

## 2. Histórico do runtime

A pilha atual preserva as correções 0.99.1/0.99.2, inclusive:

- Perfil completo e Pra Você;
- Home Séries/Filmes;
- hardening de escritas `profile_id`/`media_kind`;
- anti-freeze `patch-v096-v0992-unfreeze.js`.

A causa do travamento 0.99.2 foi churn recursivo de `MutationObserver`; o FIX2 transforma escrita idêntica de `Node.textContent` em no-op. Essa compatibilidade permanece ativa na Web 0.99.3.

## 3. Causa da falha de navegação Web desktop

`patch-v095-v0992-fix.js` possui listener de clique registrado em `window` no capture phase e usa `stopImmediatePropagation`. Como listeners capture do mesmo alvo respeitam ordem de registro, uma correção carregada depois dessa camada pode nunca receber o evento.

A 0.99.3 resolve a precedência pela ordem de carregamento, sem remover imediatamente o legado:

- `patch-v097-v0993-nav-pre.js` é inserido **antes** de `patch-v095-v0992-fix.js`;
- `patch-v098-v0993-web.js` é inserido **depois** de `patch-v096-v0992-unfreeze.js`.

## 4. Ordem autoritativa relevante — Web 0.99.3

1. `patch-v088-v098-nav-pre.js`;
2. core v95 / HOTFIX15/16;
3. `patch-v089-v098.js` / `patch-v090-v098-compat.js`;
4. `patch-v091-v099-profile-lru.js`;
5. `patch-v092-v0991.js`;
6. `patch-v093-v0992.js`;
7. `patch-v094-v0992-compat.js`;
8. **`patch-v097-v0993-nav-pre.js`**;
9. `patch-v095-v0992-fix.js`;
10. `patch-v096-v0992-unfreeze.js`;
11. **`patch-v098-v0993-web.js`**.

O script `scripts/apply-web-v0993.mjs` impõe essa ordem no `dist` e falha o build se o pre-gate ficar depois do FIX ou se a camada final ficar antes do anti-freeze.

## 5. Navegação final

A camada pré-gate 0.99.3 recebe primeiro os cliques e normaliza a rota `history` para `profile`.

Destinos canônicos:

- Home;
- Descobrir;
- Perfil;
- Configurações.

`patch-v098-v0993-web.js` remove defensivamente qualquer item Histórico/History recriado por camada antiga e reconcilia desktop/mobile-nav de forma idempotente.

## 6. Descobrir

`patch-v092-v0991.js` continua sendo a implementação funcional de Descobrir. A 0.99.3 não cria uma tela paralela; ela corrige a entrega de eventos para os controles reais.

Tabs:

- Pra Você;
- Em Alta;
- Mais Aguardados;
- Mais bem avaliados;
- Calendário.

Filtros aplicáveis:

- Geral;
- Séries;
- Filmes.

O pre-gate executa explicitamente o `onclick` já vinculado pela camada 0.99.1. Caso o DOM tenha acabado de ser reconstruído, há retries curtos em 0/60/180 ms.

A camada final protege hit-area com `pointer-events:auto`/z-index local. Quando Pra Você retorna somente o estado rígido “Nenhum título elegível”, a UI mostra fallback para atualizar recomendações ou importar/sincronizar dados.

## 7. Diagnóstico Web

A 0.99.3 registra:

- cliques de navegação;
- cliques de tabs/filtros;
- `window.error`;
- `unhandledrejection`.

Os últimos eventos ficam em `window.__ct0993Diagnostics`. O diagnóstico não envia telemetria externa e serve apenas para inspeção local do navegador.

## 8. Anti-freeze e observers

`patch-v096-v0992-unfreeze.js` continua ativo. A nova reconciliação 0.99.3 também evita escritas quando o estado desejado já está presente:

- nav só é reconstruída quando assinatura/estrutura diverge;
- rodapé só recebe `textContent` se o valor for diferente;
- fallback só substitui a área quando todos os slots estão realmente no estado vazio elegível;
- observer usa debounce.

## 9. Perfil e Home preservados

Perfil 0.99.1 continua responsável por estatísticas, timeline, seções de séries/filmes e expansões. Home 0.99.2 continua responsável por Pull-to-Reveal, Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas/Watchlist, Concluídas, Escolha para Hoje, quick mark, LRU e sincronização de lançamentos.

## 10. Escritas do cliente

`patch-v095-v0992-fix.js` continua fazendo hardening de POSTs legados:

- `watch_history`, `episode_progress`, `media_overrides`: injeta `profile_id` autenticado quando ausente;
- `media`: injeta `media_kind` quando ausente.

Nenhuma alteração de Auth/RLS/schema foi introduzida na 0.99.3.

## 11. Backend

Sem mudança na 0.99.3.

Migration atual: `20260827004500_v0992_home_series_movies.sql`.

- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS por `profile_id = auth.uid()`.

## 12. Android

Android permanece exatamente na publicação:

- `versionName 0.99.2.3`;
- `versionCode 9923`;
- bundle `v0.99.2.3-fix2-unfreeze-authoritative`.

A workflow geral da Web 0.99.3 apenas verifica estaticamente que essa identidade não mudou; não prepara nem republica APK.

## 13. Reatividade e validação

Source, build, Verify, deploy e smoke real são estados separados. `scripts/test-web-v0993.mjs` testa ordem das camadas e execução dos handlers em ambiente JavaScript simulado. O fechamento funcional exige navegação real no browser desktop e responsividade por pelo menos 60 segundos.

## 14. Débitos

- arquitetura em patches permanece complexa e deve ser consolidada futuramente;
- monkey-patch global de `Node.textContent` continua transitório;
- surrogate TMDB negativo permanece débito legado;
- advisories Supabase históricos permanecem documentados em `docs/SECURITY.md`.
