# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-08-27

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.2** | package `0.99.2`, cache `ct-web-0.99.2`, patch final `patch-v095-v0992-fix.js` | FIX no PR #21; aguardando merge/deploy final |
| Android | **0.99.2** | `versionName 0.99.2`, `versionCode 9912`, bundle `v0.99.2-fix-991-992-authoritative` | FIX no PR #21; aguardando build/release final |
| Backend / Supabase | **0.99.2** | RPC `cinetracker_profile_home_dashboard_v0992`, tabela `daily_movie_recommendations_v0992` | migration aplicada em produção |
| Windows | — | — | não lançado |

## Por que existe “0.99.2 FIX” sem nova versão

A 0.99.2 anterior ainda não havia sido mergeada/publicada. Evidência visual mostrou que a produção continuava em 0.99.1 e que recursos 0.99.1/0.99.2 estavam quebrados ou não autoritativos. Portanto o trabalho permanece dentro da mesma unidade de release 0.99.2 até o lançamento real.

## Identidade Web 0.99.2
- package: `0.99.2`;
- Service Worker: `ct-web-0.99.2`;
- camada 0.99.1: `patch-v092-v0991.js`;
- Home 0.99.2: `patch-v093-v0992.js`;
- compatibilidade 0.99.2: `patch-v094-v0992-compat.js`;
- **camada final obrigatória:** `patch-v095-v0992-fix.js`;
- rodapé: `CineTracker • v0.99.2`.

A camada final corrige navegação desktop/mobile, remove duplicações/Histórico legado, corrige o crash `days is not defined`, endurece escritas pessoais com `profile_id`, corrige `media_kind` e recupera expansão completa das seções do Perfil.

## Identidade Android 0.99.2
- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle: `v0.99.2-fix-991-992-authoritative`;
- workflow: `.github/workflows/build-android-v0992.yml`;
- release alvo: `android-v0.99.2`;
- APK alvo: `cinetracker-android-0.99.2-debug.apk`.

## Backend 0.99.2
Migration: `20260827004500_v0992_home_series_movies.sql`.

`cinetracker_profile_home_dashboard_v0992()` é `SECURITY INVOKER`, usa `auth.uid()` e entrega dados da Home incluindo último S/E assistido, LRU, plays, estados e `raw_tmdb`.

`daily_movie_recommendations_v0992` possui RLS, uma escolha por perfil/data e `unique(profile_id, tmdb_id)` para evitar repetição por usuário.

## Conteúdo consolidado 0.99.1 + 0.99.2

### Perfil / 0.99.1 recuperado
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
- **0.99.2 FIX** — consolidação real de 0.99.1 + Home 0.99.2 + correção dos conflitos de runtime observados em vídeo/prints.

## Regra obrigatória
Source, CI, deploy Web, publicação APK e teste em aparelho real são estados separados. A versão só é chamada de publicada após evidência correspondente.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
