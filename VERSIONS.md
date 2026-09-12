# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.47** | revision `r256-official-1.0.47`, package `1.0.47` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r256 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.47 / r256

A r256 é a correção Web orientada pelo vídeo posterior à r255. Ela preserva a autoridade de dados da r255 e corrige as divergências ainda comprovadas no uso real:

- séries normais com pendência real não permanecem em `Em dia` apenas porque o payload também trouxe `is_caught_up=true`; Lioness/Stuart voltam para `Assistir a seguir` quando a fronteira liberada/pendente supera a assistida;
- Raw, SmackDown, Fórmula 1 e Super Bowl continuam usando a fronteira atual e ignorando backlog histórico; `next_episode_to_air` não é lançamento;
- retorno para Home, Descobrir, Esportes e Perfil reutiliza snapshots recentes e evita telas de loading/reconsultas desnecessárias; a Home faz stale-while-revalidate e não repete o RPC enquanto o estado ainda está fresco;
- episódios de temporada, temporadas, gráficos, relacionados/semelhantes e atores/elenco recebem scroll horizontal local por observer persistente de `childList`, inclusive quando renderizados vários segundos depois;
- o Descobrir mantém as nove abas e os dados r255, mas força geometria completa dos cards com poster, título, ano, gêneros e nota; o Chromium mede dimensões reais do card/poster/metadados;
- o F1 Hub passa a ser o primeiro bloco de Esportes; abaixo dele ficam os cinco filtros globais, os filtros por modalidade e o feed;
- `Recolher/Expandir` em `Estatísticas` controla também o painel `Esportes assistidos`, funcionando como uma única seção lógica;
- a suíte Chromium reproduz diretamente os quadros e interações do vídeo, incluindo retorno imediato da série para Home sem segundo RPC.

Assets oficiais: `app-v256.js` / `app-v256.css`; build: `apps/web/build-r256-official.mjs`; runtime: `apps/web/runtime-r256-video-ground-truth-scroll-cache.js`.

## Android 1.0.20

A r256 não altera Android. A identidade preservada é:

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
