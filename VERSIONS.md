# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.48** | revision `r257-official-1.0.48`, package `1.0.48` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r257 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.48 / r257

A r257 corrige as divergências comprovadas pelo vídeo posterior à r256 sem mudar a geometria visual já aprovada:

- o próximo episódio da Home passa a ser calculado a partir do conjunto exato de episódios assistidos retornado por `cinetracker_series_episode_state_v1`; buracos antigos anteriores à fronteira recente deixam de aparecer como próximo episódio e não são marcados artificialmente como vistos;
- SmackDown/Raw e demais séries longas usam o primeiro episódio já exibido depois da sequência recente acompanhada; `Faltam` conta somente pendências posteriores à fronteira. Lioness e Stuart seguem a mesma lógica para episódios realmente pendentes;
- o Descobrir valida estados vistos/concluídos, em andamento, em dia, Watchlist e `NotInterested` antes de pintar recomendações; `Pra você` mantém suas regras estritas e as abas públicas aplicam apenas exclusões pessoais;
- abas públicas do Descobrir consultam múltiplas páginas do TMDB, deduplicam e preservam um conjunto amplo de resultados após as exclusões, em vez de herdar os cortes de nota/ano do recomendador;
- abas/cards do Descobrir, temporadas/episódios, gráficos, relacionados/semelhantes, atores/elenco e F1 usam scroll horizontal local com fallback real de arrasto por ponteiro, sem criar overflow horizontal no documento;
- `Visão geral` do F1 Hub exibe sessões do próximo fim de semana, grid de largada quando a classificação estiver disponível e o GP anterior com posição de largada → posição final, status e tempo/pontos;
- não existe migration de schema na r257; o backend atual já oferece os RPCs necessários;
- a suíte Chromium reproduz o caso SmackDown com backlog de 1999 + sequência atual, exclusões pessoais do Descobrir, trilhos horizontais do vídeo e os grids seguinte/anterior da F1.

Assets oficiais: `app-v257.js` / `app-v257.css`; build: `apps/web/build-r257-official.mjs`; runtime: `apps/web/runtime-r257-sequence-scroll-discover-f1-grid.js`.

## Android 1.0.20

A r257 não altera Android. A identidade preservada é:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.20`;
- `versionCode`: `10062`.

## Regra de versionamento

- correção compatível: `1.0.x`;
- funcionalidade compatível: `1.x.0`;
- quebra deliberada de contrato/arquitetura: próxima major;
- `versionCode` Android sempre aumenta quando houver nova release Android, independentemente do `versionName`.

## Regra de validação

CI verde não substitui teste real. O fluxo oficial da Web exige testes de comportamento em Chromium, boot do bundle final exato e `production_smoke` do domínio público após o merge em `main`. Quando vídeo/aparelho divergir do teste sintético, o vídeo/aparelho é o ground truth para a próxima correção.
