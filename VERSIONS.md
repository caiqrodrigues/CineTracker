# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.52** | revision `r261-official-1.0.52`, package `1.0.52` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r261 |
| Backend / Supabase | produção compartilhada | `cinetracker_imported_series_state_v1` + RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.52 / r261

A r261 é guiada pelos vídeos reais do CineTracker e do Binglers e corrige a divergência entre o modelo importado e a interface.

- Raw e SmackDown usam a maior fronteira realmente assistida; backlog histórico anterior não pode voltar como próximo episódio nem inflar `Faltam`;
- o estado antigo S01 é neutralizado antes do primeiro paint e a auditoria posterior considera somente episódios já exibidos depois da fronteira;
- Formula 1 e NFL Super Bowl passam a ser expostos como séries importadas de primeira classe, com temporadas, episódios e progresso, sem associação TMDB insegura;
- Formula 1 usa temporadas anuais e sessões do fim de semana como episódios; datas usam `air_date` e horário de São Paulo;
- Super Bowl preserva Temporada 1 em `60/62` e uma temporada separada para Halftime Shows;
- `cinetracker_imported_series_state_v1(p_media_id)` lê o progresso importado real por `media_id`;
- Descobrir corrige a geometria do `<button>` interno além do card, com poster 176×264 desktop e 154×231 mobile, copy visível e scroll lateral local;
- a chave de cache TMDB inclui parâmetros, impedindo uma consulta simples da Home de deixar `/series/1549` sem os dados ricos de detalhe;
- Home mantém cache visual persistente da primeira página e revalidação canônica em background;
- Esportes/F1 Hub, Perfil e Configurações permanecem sem reconstrução nesta release;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v261.js` / `app-v261.css`; build: `apps/web/build-r261-official.mjs`; runtime: `apps/web/runtime-r261-video-ground-truth-series.js`; migration: `supabase/migrations/20260912105000_r261_imported_series_state.sql`.

## Android 1.0.20

A r261 não altera Android. A identidade preservada é:

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
