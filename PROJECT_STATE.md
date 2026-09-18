# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web atual:** **1.0.103 / `r312-official-1.0.103`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web

A r312 é a baseline Web candidata atual. Ela herda as correções r307–r311 e responde ao vídeo mais recente:

- **Perfil:** `Eventos assistidos`, `Jogos no Estádio`, `Séries Watchlist` e `Filmes Watchlist` usam uma única versão visual final. Os contratos de clique são preservados e autoridades visuais r300/r301 ficam inertes.
- **F1 Hub:** o Calendário renderiza GPs clicáveis. O detalhe exibe o fim de semana completo, Grid de Largada e Resultado de Chegada; sessões iniciadas podem ser marcadas/desmarcadas como assistidas.
- **Descobrir:** shell/abas permanecem estáveis durante loading; as cinco abas públicas excluem vistos e Watchlist antes do HTML; cards e ações são do renderer r312; `Pra Você` usa os pools exatos com layout compacto.
- **Sessão:** JWT expirado tenta renovação por refresh token e uma única repetição.
- **Perfil:** `Jogos no Estádio` é garantido; atores favoritos vêm da tabela viva e atualizam após gravação.
- **Esportes:** Próximos/Anteriores recebem filtros inline dinâmicos a partir de `payload.sports`.

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
- Runtime final: `apps/web/runtime-r312-video-truth.js.gz.b64` (decodificado no build)
- Gate estático: `apps/web/test-r312.mjs`
- Chromium: `apps/web/test-r312-browser.mjs`
- Workflow: `.github/workflows/verify.yml`
- Assets finais: `app-v312.js` / `app-v312.css`

O gate Chromium deve validar comportamento, não apenas presença de strings: shell persistente do Descobrir, exclusão pessoal, cards sem corte, Pra Você compacto, estádio clicável, ator favorito vivo, filtros esportivos inline e preservação dos testes F1 r311.

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
