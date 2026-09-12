# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-11

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.46** | revision `r255-official-1.0.46`, package `1.0.46` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r255 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.46 / r255

A r255 é a correção Web orientada pelo vídeo posterior à r254, com prioridade máxima para restaurar o Descobrir e preservar as regras de Home, Esportes/F1 e Perfil.

- Descobrir mantém nove abas e renderiza cards completos com poster, título, ano, gêneros e nota; `Da sua Watchlist` usa `cinetracker_watchlist_full_v119`, trabalhando com a Watchlist integral;
- troca de aba no Descobrir mantém o conteúdo anterior até o novo resultado ficar pronto, descarta respostas atrasadas e não aplica a janela de `shown_recommendations` às abas públicas;
- Home mantém `Em dia` separado de `Continue assistindo`; somente um `last_episode_to_air` realmente posterior à fronteira vista pode reabrir uma série acompanhada;
- Raw, SmackDown, Fórmula 1 e Super Bowl ignoram backlog histórico e `next_episode_to_air` para decidir a pendência atual;
- filmes da Home exibem poster, nome, ano, gêneros, nota e duração, hidratando metadata ausente de forma assíncrona;
- Esportes possui cinco filtros públicos — `Próximos`, `Ao vivo`, `Anteriores`, `Favoritos`, `Assistidos` — com visual escuro/azulado e histórico canônico;
- F1 Hub permanece abaixo dos filtros esportivos com `Visão geral`, `Calendário`, `Classificações`, `Pilotos`, `Equipes` e `Circuitos`;
- Perfil preserva o layout aprovado e atualiza estatísticas esportivas pela fonte canônica, atualmente 48 eventos e 6.300 minutos (105h00);
- overflow horizontal global continua bloqueado; temporadas, gráficos, relacionados, Descobrir e F1 usam somente scroll horizontal local.

Assets oficiais: `app-v255.js` / `app-v255.css`; build: `apps/web/build-r255-official.mjs`; runtime: `apps/web/runtime-r255-discover-cards-home-sports-profile.js`.

## Android 1.0.20

A r255 não altera Android. A identidade preservada é:

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
