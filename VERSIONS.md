# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-27

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.2 FIX2** | package `0.99.2`, cache `ct-web-0.99.2-fix2`, camada final `patch-v096-v0992-unfreeze.js` | em `main`; Verify e Vercel `success`; smoke real ainda pendente |
| Android | **0.99.2 FIX2** | `versionName 0.99.2`, `versionCode 9913`, bundle `v0.99.2-fix2-unfreeze-991-992-authoritative` | build/identidade/assinatura/artifact/Release concluídos; smoke físico pendente |
| Backend / Supabase | **0.99.2** | RPC `cinetracker_profile_home_dashboard_v0992`, tabela `daily_movie_recommendations_v0992` | migration aplicada em produção |
| Windows | — | — | não lançado |

## Por que continua 0.99.2
A 0.99.2 ainda não foi funcionalmente encerrada. A primeira tentativa e o primeiro FIX foram invalidados por evidência real de interface quebrada/travada. Portanto a mesma unidade lógica permanece em 0.99.2 até passar smoke funcional. O Android precisou aumentar o `versionCode` porque o APK defeituoso 9912 chegou a ser publicado e não pode ser reutilizado como atualização.

## Identidade Web 0.99.2 FIX2
- package: `0.99.2`;
- Service Worker: `ct-web-0.99.2-fix2`;
- camada 0.99.1: `patch-v092-v0991.js`;
- Home 0.99.2: `patch-v093-v0992.js`;
- compatibilidade: `patch-v094-v0992-compat.js`;
- navegação/escritas: `patch-v095-v0992-fix.js`;
- **anti-freeze final:** `patch-v096-v0992-unfreeze.js`;
- rodapé visível: `CineTracker • v0.99.2`.

### Causa do travamento corrigida no FIX2
`MutationObserver` de 0.99.2 e do FIX anterior chamava helpers que reatribuíam `textContent` mesmo sem mudança. A própria atribuição criava novo `childList MutationRecord`, gerando ciclo observer → DOM → observer e saturando a main thread na Web e WebView. O FIX2 transforma atribuições de `textContent` idênticas em no-op antes de os observers atrasados começarem a observar `#app`.

### Evidência Web
- Verify FIX2 da `main`: success.
- Vercel do source FIX2: success.
- Smoke autenticado desktop/mobile continua separado e pendente até teste real.

## Identidade Android 0.99.2 FIX2
- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9913`;
- bundle: `v0.99.2-fix2-unfreeze-991-992-authoritative`;
- workflow: `.github/workflows/build-android-v0992-fix2.yml`;
- release: `android-v0.99.2`;
- APK: `cinetracker-android-0.99.2-debug.apk`;
- SHA-256: `8564bacca16bf153ebdb05f64a89337b998d23c02c8edb9a137e2a104725f9d2`.

Run `33032044592` concluiu build, validação de identidade/runtime/assinatura, artifact e substituição da Release. O `versionCode 9912` anterior permanece registrado como **defeituoso/invalidado**.

## Backend 0.99.2
Migration: `20260827004500_v0992_home_series_movies.sql`.

`cinetracker_profile_home_dashboard_v0992()` é `SECURITY INVOKER`, usa `auth.uid()` e entrega dados da Home incluindo último S/E assistido, LRU, plays, estados e `raw_tmdb`.

`daily_movie_recommendations_v0992` possui RLS, uma escolha por perfil/data e `unique(profile_id, tmdb_id)` para evitar repetição por usuário.

## Conteúdo consolidado 0.99.1 + 0.99.2

### Perfil / 0.99.1
- estatísticas compactas e Tempo Total duplo;
- timeline temporal com Hoje centralizado e detalhe por data;
- Séries, Séries favoritas, Filmes e Filmes favoritos;
- filtros de status/layout;
- cabeçalhos expansíveis e grids completos;
- somente quatro estatísticas extras solicitadas;
- favoritos em detalhes;
- Pra Você com 7 slots, ano > 1990 e nota >=7,8;
- Calendário por último;
- episódios ricos + marcação inteligente;
- cinegrafia de ator separada Filmes/Séries;
- Bingers dentro de Importar Dados.

### Home / 0.99.2
- Séries em lista vertical com Pull-to-Reveal;
- Assistir a seguir <=30 dias;
- Juntando poeira >30 dias;
- Em dia;
- Não Iniciadas / Watchlist;
- Concluídas;
- cards em linha 2:3 com próximo episódio, nota, progresso e faltantes;
- quick mark com histórico/progresso/LRU;
- sincronização de lançamentos e badge Novo Episódio;
- Filmes com Vistos Pull-to-Reveal, Escolha para Hoje >=8,0 e Watchlist;
- reatividade pós-importação.

## Linha recente
- **0.0.98** — navegação, Histórico absorvido pelo Perfil, backup CSV/ZIP e Descobrir reformulado;
- **0.0.99** — biblioteca pessoal do Perfil com favoritos e LRU;
- **0.99.1** — Perfil/timeline/Pra Você/favoritos/filtros e recuperação de recursos v95;
- **0.99.2 FIX** — consolidação 0.99.1 + Home 0.99.2;
- **0.99.2 FIX2** — correção do congelamento completo por ciclo recursivo de MutationObserver, mantendo a mesma versão lógica e elevando Android para `versionCode 9913`.

## Regra obrigatória
Source, CI, deploy Web, publicação APK e teste em aparelho real são estados separados. A versão só é chamada de funcionalmente concluída após evidência de smoke real.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
