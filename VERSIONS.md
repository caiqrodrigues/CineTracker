# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.51** | revision `r260-official-1.0.51`, package `1.0.51` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r260 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.51 / r260

A r260 é uma correção orientada pelo vídeo real posterior à r259 e limita o escopo a Descobrir, carregamento inicial da Home e rolagem horizontal em detalhes/modais.

- Descobrir restaura cards padrão 2:3 com largura 176 px desktop / 154 px mobile;
- Home restaura um first-page cache paginado por bucket em `sessionStorage` antes da revalidação canônica, com skeleton em cold start e expansão progressiva por `IntersectionObserver`;
- metadados TMDB de série/temporada usados pela Home têm cache de 6 h;
- auditoria semanal de Raw/SmackDown é diferida para fora do primeiro paint;
- temporadas, gráficos, elenco/atores e relacionados recebem scroll horizontal local isolado;
- toque usa pan-x nativo e mouse/caneta usam drag delegado;
- nenhum `MutationObserver` permanente é introduzido;
- Esportes, Perfil, Configurações e F1 permanecem congelados na implementação aprovada;
- Android permanece `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v260.js` / `app-v260.css`; build: `apps/web/build-r260-official.mjs`; runtime: `apps/web/runtime-r260-ux-recovery.js`.

## Android 1.0.20

A r260 não altera Android. A identidade preservada é:

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
