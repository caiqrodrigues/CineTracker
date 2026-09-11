# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-11

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.45** | revision `r254-official-1.0.45`, package `1.0.45` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r254 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.45 / r254

A r254 é uma correção Web baseada no vídeo de produção posterior à r253. A cadeia volta a partir da r252 como baseline visual e injeta uma autoridade final específica para os problemas observados:

- Home usa `cinetracker_home_live_v0997_r3` no paint inicial e checa `last_episode_to_air` vivo para séries normais iniciadas; `next_episode_to_air` nunca conta como episódio já exibido;
- Raw, SmackDown, Fórmula 1 e Super Bowl usam a fronteira realmente exibida e ignoram backlog histórico para decidir `Em dia`/`Assistir a seguir`;
- Descobrir mantém as nove abas, reutiliza as exclusões pessoais carregadas uma vez e troca conteúdo de forma atômica sem apagar os cards enquanto a nova aba carrega;
- Esportes mantém quatro abas e histórico canônico; o F1 Hub é contido dentro do conteúdo esportivo e não pode ocupar uma coluna do grid externo antes da sidebar;
- Perfil preserva o layout e recebe estatísticas atuais, incluindo `cinetracker_sport_stats_v1`;
- temporadas, gráficos, relacionados e trilhos largos recuperam scroll horizontal local dinâmico, enquanto o documento continua sem scroll lateral global;
- observers legados r239/r247 e o classificador Home por idade da r252 são neutralizados no bundle final.

Assets oficiais: `app-v254.js` / `app-v254.css`; build: `apps/web/build-r254-official.mjs`; runtime: `apps/web/runtime-r254-video-ground-truth.js`.

## Android 1.0.20

A r254 não altera Android. A identidade preservada é:

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
