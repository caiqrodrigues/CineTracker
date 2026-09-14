# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-14

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.74** | revision `r283-official-1.0.74`, package `1.0.74` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, preservado pela r283 |
| Backend / Supabase | produção compartilhada | payload Home r6 + `cinetracker_home_series_watch_state_v1` + writers canônicos | produção |
| Windows | — | — | não lançado |

## Web 1.0.74 / r283

A r283 corrige duas regressões visíveis no vídeo posterior à r282: `Reassistir`/`Desfazer visto` executavam a ação mas também abriam a mídia, e a reconciliação fresca encontrava novos episódios sem recalcular a quantidade total disponível.

- `↻ Reassistir` e `↶ Desfazer visto` passam a ter ownership em `window` capture phase, antes do clique genérico do card; nenhuma das duas ações navega para detalhes;
- episódios disponíveis passam a ser recalculados a partir da fronteira fresca de lançamento do TMDB menos as chaves canônicas assistidas;
- temporadas liberadas em lote, como Magnatas do Crime, deixam de ficar presas em `1 episódio disponível`;
- Lioness usa a mesma conta fresca e mostra todos os episódios já liberados depois do progresso atual;
- Raw e SmackDown mantêm o backlog histórico não assistido na contagem disponível, mas o “próximo episódio” usa somente a sequência posterior à maior fronteira realmente assistida, bloqueando o retorno a S01;
- o Histórico reutiliza a mesma contagem fresca dos cards da Home;
- ordem de recência r282, `✓` isolado r281, Histórico acima da viewport, deduplicação, Reassistir, Descobrir, detalhes e Sports/F1 permanecem preservados;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v283.js` / `app-v283.css`; build: `apps/web/build-r283-official.mjs`; runtime: `apps/web/runtime-r283-history-actions-availability.js`.

## Android 1.0.20

A r283 não altera Android. A identidade preservada é:

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
