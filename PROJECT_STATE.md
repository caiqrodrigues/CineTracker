# CineTracker — Project State

> Documento persistente de continuidade. Deve refletir o estado real do projeto sem depender de histórico de conversa.

**Última atualização:** 2026-08-27  
**Branch principal:** `main`  
**Web publicada tecnicamente:** `0.99.3`, cache `ct-web-0.99.3`, pre-gate `patch-v097-v0993-nav-pre.js`, final `patch-v098-v0993-web.js`  
**Android publicado:** `0.99.2.3`, `versionCode 9923`, bundle `v0.99.2.3-fix2-unfreeze-authoritative`  
**Backend lógico:** `0.99.2`  
**Windows:** não lançado

## 1. Unidade atual — Web 0.99.3

A 0.99.3 é uma correção exclusiva do navegador Web desktop. O objetivo é recuperar navegação e Descobrir sem desmontar Perfil, Configurações e Home acumulados nas camadas 0.99.1/0.99.2.

A evidência visual mostrou que previews simplificadas não representavam a aplicação real; essas mocks não são fonte de verdade. A release usa apenas o runtime real versionado em `apps/web`.

## 2. Causa técnica de navegação

`patch-v095-v0992-fix.js` registra um listener em `window` no capture phase e chama `stopImmediatePropagation`. Qualquer correção de clique carregada depois dele pode nunca receber o evento.

A 0.99.3 resolve isso com duas posições deliberadas na pilha:

1. `patch-v097-v0993-nav-pre.js` — carregado **antes** de `patch-v095-v0992-fix.js`;
2. `patch-v098-v0993-web.js` — carregado **depois** de `patch-v096-v0992-unfreeze.js`.

O pre-gate controla Home / Descobrir / Perfil / Configurações e executa explicitamente os handlers das tabs/filtros do Descobrir. A camada final reconcilia Sidebar, pointer-events, fallback e identidade Web 0.99.3.

## 3. Navegação e Descobrir 0.99.3

- Sidebar canônica: Home / Descobrir / Perfil / Configurações;
- Histórico removido defensivamente do menu e rota legada redirecionada ao Perfil;
- tabs Descobrir: Pra Você, Em Alta, Mais Aguardados, Mais bem avaliados e Calendário;
- filtros Geral / Séries / Filmes recebem captura explícita;
- `Pra Você` vazio ganha fallback com Atualizar recomendações e Importar/sincronizar dados;
- hit-area protegida contra overlays via `pointer-events:auto` e z-index local;
- cliques/exceções ficam em `window.__ct0993Diagnostics` e no Console.

## 4. Runtime preservado

A 0.99.3 não remove as camadas estáveis anteriores. Ordem relevante final:

1. base v95 + recuperações;
2. 0.98;
3. Perfil LRU 0.99;
4. `patch-v092-v0991.js`;
5. `patch-v093-v0992.js`;
6. `patch-v094-v0992-compat.js`;
7. `patch-v097-v0993-nav-pre.js`;
8. `patch-v095-v0992-fix.js`;
9. `patch-v096-v0992-unfreeze.js`;
10. `patch-v098-v0993-web.js`.

O anti-freeze FIX2 permanece ativo e o monkey-patch idempotente de `Node.textContent` continua transitório.

## 5. Recursos preservados

- Home Séries/Filmes 0.99.2;
- Pull-to-Reveal;
- Assistir a seguir / Juntando poeira / Em dia / Não Iniciadas / Concluídas;
- quick mark e LRU;
- sincronização de lançamentos;
- Perfil 0.99.1 com timeline, filtros e expansões;
- Descobrir/Pra Você/Calendário;
- Bingers em Importar Dados;
- backup;
- cinegrafia;
- hardening de `profile_id` e `media_kind`;
- bloqueio de TMDB externo para surrogate `<= 0` nos caminhos recentes.

## 6. Backend

Sem mudança na 0.99.3.

Migration atual: `supabase/migrations/20260827004500_v0992_home_series_movies.sql`.

- `cinetracker_profile_home_dashboard_v0992()` — `SECURITY INVOKER`, `auth.uid()`;
- `daily_movie_recommendations_v0992` — RLS, PK perfil/data e unique perfil/TMDB.

## 7. Publicação técnica Web 0.99.3

- package `0.99.3`;
- cache `ct-web-0.99.3`;
- rodapé `CineTracker • v0.99.3`;
- commit de publicação validado: `192da4a72c64abe3e8d92df8cd23ebc93b0b675b`;
- Verify run `33080026311` / #1252: `success`;
- job Web build/test: `success`;
- Vercel do commit: `success`;
- smoke real desktop: pendente.

O run anterior `33079874238` falhou por um check estático que apontava para um asset Android gerado e inexistente no source. O check foi corrigido sem alterar Android; o run sucessor ficou verde.

## 8. Android permanece 0.99.2.3

A unidade Web 0.99.3 não altera Android.

- `versionName`: `0.99.2.3`;
- `versionCode`: `9923`;
- bundle: `v0.99.2.3-fix2-unfreeze-authoritative`;
- release: `android-v0.99.2.3`;
- APK SHA-256: `a7fe3bdc069ff418197305bdf3a3d5fd0f06a7928963f62dea5dc20faa4a2853`.

## 9. Validação restante

Ainda é necessário smoke real no navegador PC:

- Home;
- quatro itens da Sidebar;
- todas as tabs/filtros de Descobrir;
- Perfil completo;
- Configurações completas;
- ausência de Histórico no menu após múltiplas navegações;
- responsividade por pelo menos 60 segundos.

## 10. Débitos conhecidos

- surrogate negativo em `media.tmdb_id` permanece legado;
- advisories Supabase históricos permanecem;
- monkey-patch de `Node.textContent` permanece compatibilidade transitória;
- a arquitetura em patches ainda exige consolidação futura.

## 11. Documentos canônicos

`README.md`, `VERSIONS.md`, `CHANGELOG.md`, `PROJECT_STATE.md`, `apps/web/README.md`, `apps/android/README.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.3.md`, `docs/validation/0.99.3.md`.
