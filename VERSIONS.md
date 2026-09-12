# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.50** | revision `r259-official-1.0.50`, package `1.0.50` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r259 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.50 / r259

A r259 responde diretamente ao vídeo posterior à r258, que mostrou Home quebrada/lenta, Descobrir ainda mais quebrado e navegação geral mais pesada. Ela não usa a r258 como base: compõe da r257, desativa as autoridades contínuas que causavam trabalho de DOM e substitui somente Home e Descobrir.

- Home usa `cinetracker_profile_home_payload_v0997_r5`, normaliza o payload em memória e não move cards pelo DOM;
- Raw/SmackDown nunca exibem backlog S01 como próximo episódio no primeiro paint; apenas essas duas séries recebem auditoria assíncrona prioritária pela fronteira realmente assistida;
- Lioness/Stuart e séries normais usam a pendência já conhecida no payload, sem chamada TMDB individual por série;
- o Descobrir usa `cinetracker_recommendation_state_v108` para exclusões e candidatos da Watchlist, removendo `cinetracker_profile_media_dashboard_v0991` e `cinetracker_watchlist_full_v119` do caminho crítico r259;
- o novo RPC v108 foi medido em aproximadamente 33 ms no banco durante o diagnóstico e tem acesso restrito a `authenticated`/`service_role`;
- `Pra você` exibe seus três blocos imediatamente e carrega estado pessoal + primeira página TMDB em paralelo; falha externa fica contida no bloco, sem transformar a tela inteira em erro;
- os observers permanentes r256/r257 são desativados no bundle r259; scroll horizontal passa a depender de CSS nativo (`overflow-x:auto` + `pan-x pan-y`) e o drag JS herdado ignora toque;
- Esportes, Perfil, Configurações e F1 continuam congelados na implementação aprovada da r257;
- migration da release: `20260912111000_r259_recommendation_state_v108.sql`.

Assets oficiais: `app-v259.js` / `app-v259.css`; build: `apps/web/build-r259-official.mjs`; runtime: `apps/web/runtime-r259-fast-home-discover.js`.

## Android 1.0.20

A r259 não altera Android. A identidade preservada é:

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
