# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-14

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.73** | revision `r282-official-1.0.73`, package `1.0.73` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r282 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `cinetracker_home_series_watch_state_v1` + writers canônicos | produção |
| Windows | — | — | não lançado |

## Web 1.0.73 / r282

A r282 corrige o ground truth do vídeo posterior à r281: quando uma série continua pendente após marcar o episódio atual, a série assistida mais recentemente precisa ocupar a primeira posição do bucket final.

- cada seção de séries é ordenada por `last_watched_at DESC` no momento final de renderização;
- a ordenação acontece depois da reconciliação fresca do TMDB, então uma série que mudou de `Em dia` para `Assistir a seguir` não mantém a posição antiga do array;
- se a marcação deixa a série `Em dia` ou `Concluída`, o bucket final continua soberano e a mídia é ordenada somente dentro dele;
- séries sem data de última visualização mantêm ordem estável entre si;
- o clique isolado do `✓`, writer canônico, recarga única r6, check minimalista, abas fixas, sidebar, Histórico, metadados, deduplicação, Reassistir, Descobrir, detalhes e Sports/F1 permanecem preservados;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v282.js` / `app-v282.css`; build: `apps/web/build-r282-official.mjs`; runtime: `apps/web/runtime-r282-series-recency-order.js`.

## Android 1.0.20

A r282 não altera Android. A identidade preservada é:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.20`;
- `versionCode`: `10062`.

## Regra de versionamento

- correção compatível: `1.0.x`;
- funcionalidade compatível: `1.x.0`;
- quebra deliberada de contrato/arquitetura: próxima major;
- `versionCode` Android sempre aumenta quando houver nova release Android, independentemente do `versionName`.

## Regra de validação

CI verde não substitui teste real. O fluxo oficial da Web exige testes de comportamento em Chromium, boot do bundle final exato e `production_smoke` do domínio público após a promoção ao `main`. Quando vídeo/aparelho divergir do teste sintético, o vídeo/aparelho é o ground truth para a próxima correção.
