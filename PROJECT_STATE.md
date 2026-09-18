# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web candidata:** **1.0.104 / `r313-official-1.0.104`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web r313

A r313 parte da r312 em produção e corrige as regressões do vídeo mais recente:

- **Descobrir:** oito abas persistentes; `Todos / Filmes / Séries` oculto por padrão atrás do botão compacto `☷`; cards visuais usam `ct288Card`, sem `ct312-card`/banner; cinco abas públicas excluem vistos + Watchlist + alias antes do HTML.
- **Pra Você:** preserva a composição exata r309 com Filme/Série/Anime e acabamento compacto.
- **Esportes:** o filtro de `Próximos` e `Anteriores` nasce diretamente em `paintSports255`, ao lado do título, com `Todos` + todos os esportes em `payload.sports`.
- **Perfil:** `renderProfile313` é o único renderer final. Um loading precede um único paint canônico; `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist` ficam no mesmo contrato visual/clicável.
- **Sessão:** JWT expirado continua renovando a sessão e repetindo uma vez.
- **F1:** preserva r311: quatro abas, GP clicável, detalhe do fim de semana, Grid/Resultado e marcação individual das sessões.

Produção atual antes da promoção r313: `1.0.103 / r312-official-1.0.103` em `https://mycinetracker.vercel.app`.

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

## 4. Artefatos r313

- Build: `apps/web/build-r313.mjs`
- Build oficial: `apps/web/build-r313-official.mjs`
- Runtime: `apps/web/runtime-r313-discover-sports-profile.js`
- Gate estático: `apps/web/test-r313.mjs`
- Chromium: `apps/web/test-r313-browser.mjs`
- Assets finais: `app-v313.js` / `app-v313.css`

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

A r313 só vira release oficial após o `production_smoke` da `main`.

## 6. Documentos canônicos

- `README.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `PROJECT_STATE.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/SECURITY.md`
