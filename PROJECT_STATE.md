# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web candidata:** **1.0.105 / `r314-official-1.0.105`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web r314

A r314 parte da r314 em produção e corrige as regressões do vídeo mais recente:

- **Descobrir:** r314 é dona das cinco abas públicas, do Calendário e do Pra Você. Vistos/Watchlist são excluídos antes do HTML; Calendário usa cards de largura fixa por data; Pra Você mantém 1+3+3 em painel compacto.
- **F1:** o resumo transitório `Seu registro / Fórmula 1 assistida` é removido no build e não pertence ao Hub. Corridas clicáveis e marcação por sessão permanecem.
- **Perfil:** quatro estatísticas clicáveis usam um único padrão; `Esportes assistidos` tem `Recolher / Expandir`; Atores Favoritos continuam vindo da fonte viva.
- **Esportes:** filtros dinâmicos Próximos/Anteriores são preservados; RPCs renovam sessão expirada e repetem uma vez.

Produção anterior à promoção r314: `1.0.105 / r314-official-1.0.105` em `https://mycinetracker.vercel.app`.

## 2. Regras funcionais preservadas

- Raw/SmackDown usam fronteira assistida; backlog histórico anterior não vira pendência.
- Clique de episódio marca somente o episódio exato.
- `Pra Você`: Indicação do Dia + Filme/Série/Anime da Watchlist + Filme/Série/Anime 100% novos.
- F1: `Visão geral`, `Calendário`, `Classificações`, `Circuitos`; pilotos/equipes permanecem dentro de Classificações.
- Atores Favoritos continuam vindos da fonte viva da r312.
- Android não muda em releases Web sem solicitação explícita.

## 3. Android congelado

- `applicationId`: `com.cinetracker.app`
- `versionName`: `1.0.20`
- `versionCode`: `10062`

## 4. Artefatos r314

- Build: `apps/web/build-r314.mjs`
- Build oficial: `apps/web/build-r314-official.mjs`
- Runtime: `apps/web/runtime-r314-discover-sports-profile.js`
- Gate estático: `apps/web/test-r314.mjs`
- Chromium: `apps/web/test-r314-browser.mjs`
- Assets finais: `app-v314.js` / `app-v314.css`

O Chromium deve provar: filtro do Descobrir fechado por padrão e abrindo pelo `☷`; ausência de `ct312-card`; card r288 sem corte; bloqueio vistos/Watchlist; filtro esportivo no primeiro paint de Próximos/Anteriores; ausência do filtro em Assistidos; Perfil sem troca de classe/layout após a janela dos timers antigos; JWT/F1 preservados.

## 5. Regra de evidência

Estados separados:

1. source/documentação;
2. CI/testes;
3. PR;
4. merge em `main`;
5. deploy Web;
6. `production_smoke`;
7. Android físico quando houver release Android.

A r314 só vira release oficial após o `production_smoke` da `main`.

## 6. Documentos canônicos

- `README.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `PROJECT_STATE.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/SECURITY.md`
