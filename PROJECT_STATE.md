# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web atual:** **1.0.103 / `r312-official-1.0.103`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web

A r312 é a baseline Web atual. Ela herda a r311 e corrige os problemas reproduzidos no vídeo mais recente:

- **Autenticação:** refresh proativo do JWT e retry único após 401/JWT expirado, evitando que Esportes e autoridade pessoal do Descobrir caiam em sessão expirada.
- **Descobrir:** as cinco abas públicas usam card próprio, não cortam título/metadados/ações, excluem vistos + Watchlist antes do HTML e mantêm cache/prefetch para troca de aba.
- **Pra Você:** slots compactos em trilho horizontal, sem colunas gigantes.
- **Perfil:** cache antigo não é pintado antes da consulta canônica; Jogos no Estádio nasce como botão no primeiro paint e favoritos de atores vêm do payload atualizado.
- **Esportes:** filtros de todas as modalidades do payload ficam junto de Próximos/Anteriores.

A r311 permanece como base do F1 Hub clicável e assistível.


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

O gate Chromium deve validar comportamento, não apenas presença de strings: card público completo sem corte, exclusão de vistos/Watchlist, retorno de aba em cache, Pra Você compacto, botão de estádio, filtro de todas as modalidades e preservação das regressões F1 da r311.

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
