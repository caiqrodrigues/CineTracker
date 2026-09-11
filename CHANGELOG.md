# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x e das releases intermediárias permanecem preservados no histórico Git e em `docs/releases/`.

## 1.0.39 — 2026-09-11 — Web r248

### Home / episódios
- Auditoria canônica ampliada para 8 workers e lote prioritário de 40 séries, com liberação de metadados secundários em 250 ms.
- A regra de acompanhamento passa a separar **episódio novo à frente do ponto atual** de buracos históricos não assistidos: episódios antigos continuam não vistos, mas não removem uma série realmente em dia do estado correto.
- Em cenários mistos, com backlog histórico e episódio novo ao mesmo tempo, qualquer episódio liberado depois da fronteira acompanhada tem prioridade e força `Assistir a seguir`.
- Raw, SmackDown e demais séries longas podem ficar `Em dia` sem marcar automaticamente episódios antigos que o usuário pretende assistir posteriormente.
- Lioness, Stuart e demais séries iniciadas continuam usando a mesma regra genérica de episódio liberado/não visto, sem hardcode por título.
- F1 e Super Bowl ganham ponte seriada baseada somente em eventos esportivos reais: evento liberado/não visto aparece como novo; próximo evento real mantém o acompanhamento atual sem inventar histórico ou resultado.

### Descobrir
- Removida a restauração de snapshots antigos de HTML que podia recolocar conteúdo de uma aba anterior e provocar tremor/pulo visual.
- Mantidas as exclusões pessoais canônicas do `Pra você` e demais faixas, evitando títulos já vistos, em andamento, na Watchlist e marcados `NotInterested`.
- Cards e trilhos recebem estabilização pós-render sem reconstrução concorrente do shell.
- `Novidades` preserva a regra estrita de lançamentos dos últimos 30 dias.

### Esportes
- A navegação final fica restrita a `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`.
- `Próximos`: somente eventos futuros do dia atual.
- `Anteriores`: somente D-1, D-2 e D-3.
- `Favoritos`: somente jogos ligados aos favoritos.
- `Assistidos`: somente jogos vistos pelo usuário.
- Controles `Eventos/Agenda` são removidos da interface.
- O botão `Assistido` mantém feedback por animação no clique e o binding final usa o estado atual de Esportes sem reintroduzir APIs removidas.

### F1 Hub
- Hub consolidado com dados Jolpica da temporada atual.
- Seis áreas: `Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores` e `Último GP`.
- Horários formatados para `America/Sao_Paulo`, contagem regressiva do próximo GP, calendário, classificações, resultado da última corrida e grid/qualificação.
- Estado minimizar/expandir persistente em `localStorage`, sem expansão automática causada por reconciliação antiga.

### Perfil
- `Estatísticas de esporte` é incorporado ao grupo único `Estatísticas`.
- Ordem e composição permanecem estáveis entre repaints; não existem dois grupos concorrentes.

### Rolagem / layout
- `html`, `body` e shell mantêm overflow horizontal global bloqueado e rolagem vertical preservada.
- Temporadas, relacionados/semelhantes, gráficos, trilhos de Descobrir/F1 e demais áreas largas recebem scrollbar horizontal local visível.
- O gesto local preserva pan horizontal sem impedir o movimento vertical da página.

### Build / validação
- Web atualizada para `1.0.39 / r248-official-1.0.39`.
- Android permanece `1.0.20 / versionCode 10062`, sem alteração nesta release.
- Build oficial: `apps/web/build-r248-official.mjs`.
- Runtime final: `apps/web/runtime-r248-current-following-ui.js` + `runtime-r248-state-binding.js` + `runtime-r248-following-sports-series.js`.
- Invariantes: `apps/web/test-r248.mjs`.
- Chromium completo: `scripts/test-r248-complete-ui-browser.mjs`, incluindo backlog histórico, episódio novo posterior, cenário misto, F1/Super Bowl seriados, quatro abas esportivas, F1 persistente, Perfil único e trilhos locais.
- Boot exato do bundle: `scripts/test-r248-exact-bundle-browser.mjs`.
- Pipeline preserva regressões r239→r247, valida r248 e exige smoke público após promoção ao `main`.

## 1.0.38 — 2026-09-11 — Web r247

- Corrigida a tela preta causada pela antiga autoridade esportiva r240 atribuindo `sportsTabs` antes de `boot()`.
- Release recomposta sobre a r245 estável, removendo a injeção incompatível.
- Mantidos Home canônico, Descobrir com exclusões pessoais, quatro abas esportivas, F1 Hub persistente, Perfil unificado e barras horizontais locais.
- Adicionado teste obrigatório de boot do bundle final completo em Chromium e smoke público com DOM renderizado.

## 1.0.37 — 2026-09-10 — Web r246

- Home: 6 auditorias concorrentes, lote prioritário de 24 séries, fallback secundário em 500 ms e revalidação forçada em retorno à tela.
- Descobrir: exclusões canônicas e geometria estável durante hidratação.
- Esportes: quatro abas (`Próximos`, `Anteriores`, `Favoritos`, `Assistidos`), remoção de `Eventos/Agenda` e animação no `Assistido`.
- F1 Hub: seis áreas e persistência de minimizar/expandir.
- Perfil: estatísticas esportivas incorporadas ao grupo único.
- Layout: rolagem vertical global preservada, overflow horizontal global bloqueado e trilhos locais roláveis.

## 1.0.26 — 2026-09-09 — Web r234

- Home passa a aplicar estado conhecido imediatamente e revalidar episódios em background.
- Descobrir retorna ao baseline visual aprovado e limita pós-processamento às seções necessárias.
- Esportes volta ao layout canônico em vez de reconstruir zonas concorrentes.
- Watchlist e Perfil passam a usar o mesmo universo lógico de contagem/modal.
- Enriquecimento de séries passa a tentar TVDB → TMDB antes do fallback por título.

## 1.0.25 — 2026-09-09 — Web r233

- Eliminados polls/observers concorrentes que reescreviam Descobrir, Esportes e Watchlist depois do paint final.
- Home ganha revalidação ao vivo de séries em dia contra o TMDB.
- Watchlist mantém entradas sem TMDB no mesmo universo de contagem e modal.
- Build e `verify.yml` passam a validar a baseline 1.0.25/r233.

## 1.0.0 — 2026-09-04 — OFICIAL

- Web e Android passam a compartilhar a identidade pública 1.0.0.
- Web: `r204-official-1.0.0`; Android: `versionName 1.0.0`, `versionCode 10042`.
- Preservados Home, Descobrir/Pra Você, Watchlist, detalhes ricos, Perfil, Sports, importação/sincronização, reassistir e regras pessoais consolidadas da linha 0.99.7.
- A 0.99.7.71 permanece como última pré-release funcional antes da promoção 1.0.0.

## Histórico anterior

As releases 0.0.x, 0.99.1–0.99.7 e hotfixes permanecem disponíveis no histórico Git e em `docs/releases/`. Elas são históricas e não devem ser usadas como baseline para novas alterações depois da 1.0.0.