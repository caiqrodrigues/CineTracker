# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-14

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.72** | revision `r281-official-1.0.72`, package `1.0.72` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r281 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `cinetracker_home_series_watch_state_v1` + writers canônicos | produção |
| Windows | — | — | não lançado |

## Web 1.0.72 / r281

A r281 corrige o ground truth do vídeo posterior à r280: tocar no `✓` de Marcar como assistido não pode abrir o card de série/filme nem iniciar uma disputa entre renderers da Home.

- o clique do `✓` é capturado no `window` antes do handler genérico de `data-media` do `document`;
- a ação consome o evento e permanece na Home;
- episódios/filmes continuam sendo gravados pelo writer `cinetracker_mark_watch_v0994`;
- após a gravação existe uma única recarga canônica do payload r6;
- o fluxo não emite `cinetracker:data-changed`, removendo o repaint legado concorrente observado no vídeo;
- o `✓` permanece 40×40 px na direita em `.ct274-media-card` e em fallback `.media-row`, sem cair para uma segunda linha;
- controles antigos duplicados são removidos e a reconciliação é finita/idempotente;
- Séries/Filmes fixo, sidebar fixa, Histórico acima da viewport, metadados, deduplicação, Reassistir, Descobrir, detalhes e Sports/F1 são preservados;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v281.js` / `app-v281.css`; build: `apps/web/build-r281-official.mjs`; runtime: `apps/web/runtime-r281-watch-click-isolation.js`.

## Android 1.0.20

A r281 não altera Android. A identidade preservada é:

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
