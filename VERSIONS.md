# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-12

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.49** | revision `r258-official-1.0.49`, package `1.0.49` | release Web atual |
| Android | **1.0.20** | `versionName 1.0.20`, `versionCode 10062` | produção, inalterado pela r258 |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | produção |
| Windows | — | — | não lançado |

## Web 1.0.49 / r258

A r258 corrige somente as áreas que o vídeo posterior à r257 ainda comprovou como erradas. Esportes, Perfil e Configurações permanecem congelados na implementação aprovada.

- Stuart/Lioness deixam `Em dia` antes do primeiro paint quando o próprio payload já comprova `released_episodes > watched_episodes`, sem depender da fila remota de auditoria;
- Raw/SmackDown usam auditoria prioritária separada: a maior posição efetivamente assistida é a fronteira e o próximo episódio é o primeiro **já exibido** depois dela; buracos S01 históricos continuam não vistos no banco, mas não entram em `Faltam` nem podem virar próximo episódio;
- os antigos auditores gerais r256/r257 deixam de ser disparados na release final para não disputar a Home nem fazer Raw/Stuart aguardarem dezenas de consultas de outras séries;
- `Pra você` isola falhas de hidratação: um item com `TMDB 404` é descartado individualmente em vez de rejeitar o `Promise.all` e derrubar a aba;
- as exclusões pessoais combinam dashboard, Watchlist integral e `NotInterested`; vistos/concluídos, em andamento, em dia e Watchlist não aparecem fora do bloco próprio;
- Descobrir mantém os nove filtros e pools públicos amplos, com cache curto por aba;
- o scroll horizontal no toque passa a ser nativo (`pan-x pan-y` + `overflow-x:auto`); a captura manual da r257 não intercepta mais `pointerType=touch`, enquanto mouse/pen mantêm drag de fallback;
- o observer local continua cobrindo temporadas, episódios, gráficos, relacionados/semelhantes e atores/elenco criados assincronamente;
- não existe migration de schema na r258; os RPCs existentes já contêm os dados necessários.

Assets oficiais: `app-v258.js` / `app-v258.css`; build: `apps/web/build-r258-official.mjs`; runtime: `apps/web/runtime-r258-account-ground-truth.js`.

## Android 1.0.20

A r258 não altera Android. A identidade preservada é:

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
