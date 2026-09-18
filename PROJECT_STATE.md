# CineTracker — Project State

> Documento canônico de continuidade. Print, vídeo e teste real prevalecem sobre asserts estáticos quando houver divergência.

**Última atualização:** 2026-09-18  
**Branch de produção:** `main`  
**Release Web atual:** **1.0.103 / `r312-official-1.0.103`**  
**Android atual:** **1.0.20 / versionCode `10062`**  
**Backend:** Supabase production compartilhado Web/Android  
**Windows:** não lançado

## 1. Estado Web

A r312 é a baseline Web candidata atual. Ela herda a r311 e corrige os problemas reproduzidos no vídeo mais recente:

- **Descobrir:** shell r312 único/persistente; cinco abas públicas excluem vistos + Watchlist antes do HTML; Pra Você é compacto 1+3+3.
- **Sessão:** JWT é renovado e a chamada é repetida uma única vez após expiração.
- **Perfil:** Jogos no Estádio é garantido como botão; Atores Favoritos usa a tabela viva `favorite_actors`.
- **Esportes:** filtros de Próximos/Anteriores vêm de `payload.sports` e ficam no cabeçalho da própria seção.
- **F1 Hub:** Calendário real r255 abre o detalhe completo/assistível r311.

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

## 4. Artefatos e validação da r311

- Build oficial: `apps/web/build-r312-official.mjs`
- Runtime final: `apps/web/runtime-r312-single-owner.js`
- Gate estático: `apps/web/test-r312.mjs`
- Chromium: `apps/web/test-r312-browser.mjs`
- Workflow: `.github/workflows/verify.yml`
- Assets finais: `app-v311.js` / `app-v311.css`

O gate Chromium deve validar comportamento, não apenas presença de strings: igualdade dos controles do Perfil após a janela de repaints legados, clique do GP abrindo detalhe, persistência da sessão de F1 e exclusão/ações das cinco abas públicas do Descobrir.

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
