# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes. Web e Android compartilham conta, biblioteca, Watchlist, histórico, progresso, Perfil, Descobrir, configurações e backup via Supabase.

## Versão atual

| Sistema | Versão | Identidade |
|---|---:|---|
| Web | **0.99.2 FIX2** | package `0.99.2`, cache `ct-web-0.99.2-fix2`, patch final `patch-v096-v0992-unfreeze.js` |
| Android | **0.99.2 FIX2** | `versionName 0.99.2`, `versionCode 9913`, bundle `v0.99.2-fix2-unfreeze-991-992-authoritative` |
| Backend | **0.99.2** | RPC/tabela Home no Supabase |
| Windows | — | não lançado |

A primeira publicação do 0.99.2 FIX foi invalidada por evidência real de travamento completo na Web e no APK. A causa foi um ciclo `MutationObserver -> textContent -> MutationObserver`: helpers de rodapé/cabeçalhos reatribuíam o mesmo `textContent`, geravam novo `childList MutationRecord` e saturavam a main thread no navegador e na WebView.

O **FIX2** adiciona `apps/web/patch-v096-v0992-unfreeze.js` por último. A camada torna atribuições idênticas de `Node.textContent` um no-op antes de os observers atrasados começarem a observar `#app`. O cache Web foi rotacionado para `ct-web-0.99.2-fix2`.

O APK defeituoso `versionCode 9912` foi invalidado. O FIX2 usa `versionCode 9913`; a Release `android-v0.99.2` foi substituída pelo APK corrigido após build, identidade e assinatura aprovados. O rodapé continua **`CineTracker • v0.99.2`**.

## Conteúdo consolidado 0.99.1 + 0.99.2

- navegação final: Home, Descobrir, Perfil e Configurações; Histórico integrado ao Perfil;
- Perfil com estatísticas compactas, Tempo Total duplo, timeline, filtros/layouts, favoritos e quatro métricas extras;
- Pra Você com 7 posições, ano > 1990 e nota >= 7,8;
- Calendário por último com Geral/Séries/Filmes;
- episódios ricos, marcação inteligente dos anteriores e cinegrafia separada em Filmes/Séries;
- Bingers dentro de Importar Dados;
- Home Séries em lista vertical com Pull-to-Reveal, Assistir a seguir, Juntando poeira, Em dia, Não Iniciadas/Watchlist e Concluídas;
- cards de linha 2:3, próximo episódio, progresso, faltantes, nota, quick mark e LRU por `last_watched_at`;
- sincronização de novos episódios e badge Novo Episódio;
- Home Filmes com Vistos Pull-to-Reveal, Escolha para Hoje >= 8,0 e Watchlist;
- backend `cinetracker_profile_home_dashboard_v0992()` + `daily_movie_recommendations_v0992` com escopo autenticado/RLS.

## Estado de validação

Build/CI, Vercel e publicação do APK FIX2 possuem evidência no GitHub. **A release ainda não é considerada funcionalmente encerrada até smoke real confirmar que Web desktop/Web Android e APK 9913 permanecem responsivos e que as quatro abas funcionam repetidamente.**

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/DEVELOPMENT_RULES.md`, `docs/ARCHITECTURE.md`, `docs/SECURITY.md`, `docs/releases/0.99.2.md` e `docs/validation/0.99.2.md`.
