# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web atual:** **1.0.103 / `r312-official-1.0.103`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web

A r312 é a baseline Web atual. Ela herda a r311 e corrige as divergências demonstradas no vídeo real de 18/09/2026:

- **Descobrir:** as cinco abas públicas usam cards r312 com altura natural, identidade pessoal canônica, cache/prewarm e ações estáveis; `Pra Você` mantém 1+3+3 em um painel compacto.
- **Autenticação:** `JWT expired` renova a sessão uma única vez e repete a chamada original.
- **Perfil:** os quatro cards de estatística preservam uma versão visual; `Jogos no Estádio` é clicável e favorito de ator invalida o cache persistente.
- **Esportes:** `Próximos`/`Anteriores` recebem filtro inline de todos os esportes efetivamente existentes no payload.
- **F1 Hub:** a autoridade r311 de GP clicável, fim de semana completo, Grid/Resultado e watch por sessão permanece preservada.

Produção Web: `https://mycinetracker.vercel.app`.

## 2. Regras funcionais que devem permanecer

- Raw, SmackDown e séries recorrentes antigas usam fronteira assistida; backlog histórico anterior não vira pendência.
- O botão de episódio marca somente o episódio exato; nunca pode cair em `markSeen` da série inteira.
- `Pra Você` mantém Indicação do Dia + Filme/Série/Anime da Watchlist + Filme/Série/Anime 100% novos.
- F1 mantém quatro abas: `Visão geral`, `Calendário`, `Classificações`, `Circuitos`.
- `Classificações` concentra pilotos e equipes; não recriar abas redundantes.
- Atores Favoritos mantém uma única scrollbar horizontal abaixo dos cards.
- Perfil usa histórico esportivo canônico para o total de eventos assistidos.
- Android não deve ser alterado por releases Web sem solicitação explícita.

## 3. Android congelado

- `applicationId`: `com.cinetracker.app`
- `versionName`: `1.0.20`
- `versionCode`: `10062`

A r312 é Web-only e deve preservar essa baseline.

## 4. Artefatos e validação da r312

- Build oficial: `apps/web/build-r312-official.mjs`
- Runtime final: `apps/web/runtime-r312-video-truth.js`
- Gate estático: `apps/web/test-r312.mjs`
- Chromium: `apps/web/test-r312-browser.mjs`
- Workflow: `.github/workflows/verify.yml`
- Assets finais: `app-v312.js` / `app-v312.css`

O gate Chromium deve validar comportamento, não apenas presença de strings: refresh/retry de JWT, exclusão canônica de vistos/Watchlist, cards sem clipping, aba cacheada sem spinner, Pra Você compacto, clique de estádio, invalidação do cache de ator favorito e filtro esportivo construído do payload real. As regressões r311 de F1 continuam na cadeia.

## 5. Regra de evidência

Estados separados:

1. source/documentação;
2. CI/testes;
3. merge em `main`;
4. deploy Web;
5. smoke real Web;
6. Android físico quando houver release Android.

Nenhum item deve ser declarado entregue em produção apenas porque o CI de branch ficou verde. A produção só é confirmada após `production_smoke` em `main`.

## 6. Documentos canônicos

- `README.md`
- `VERSIONS.md`
- `CHANGELOG.md`
- `PROJECT_STATE.md`
- `docs/ARCHITECTURE.md`
- `docs/DEVELOPMENT_RULES.md`
- `docs/SECURITY.md`
