## Web 0.3.70 / r543 — correção da chamada autenticada dos novos episódios da WWE

- **Causa raiz confirmada:** a rotina Web r542 de Raw/SmackDown chamava `window.__ctCoreR471.edge()`, mas a ponte de funções r471 exportava apenas `route` e `rpc`, não `edge`. Logo, a sincronização automática não podia ser iniciada pelo browser.
- **Correção estrita:** expor o `edge()` autenticado já existente na ponte de funções, preservando a sessão e sem introduzir chaves ou chamadas não autenticadas. Raw/SmackDown continuam atualizando somente seus cards da Home com o último episódio exibido, sem recarregar a página inteira.
- **Banco compartilhado:** episódios confirmados SmackDown T28E42 (16/10/2026) e Raw T34E42 (19/10/2026) já estão no catálogo e no campo `last_episode_to_air`. O patch faz a Home conseguir solicitar a atualização na Edge Function `ct-wwe-tv-refresh` e aplicar a novidade localmente.
- **Android:** r294 / 1.0.52 mantém dono exclusivo dos sete slots autenticados de Descobrir > Pra Você; Watchlist otimista escreve apenas o item selecionado, sem refetch global. Atualização WWE via a mesma Edge Function.
- **Escopo:** Web r541 continua congelada visualmente; somente a ponte autenticada da rotina Raw/SmackDown é alterada. Não mexer em F1, UFC, Perfil, Descobrir Web nem outras séries.
- **Validação:** teste executa a chamada do `edge` exportado e verifica os metadados r543, a ausência de reload, versão e preservação do marcador r541.

## Web 1.0.252 / r462
- F1 usa `cinetracker_f1_watch_sync_v462` como writer único entre Série, Esportes e F1 Hub.
- O overload esportivo por `event_id` agora sincroniza a Série e o F1 Hub; Série e F1 Hub sincronizam Esportes.
- Cada sessão F1 mantém tempo em Séries e em Esportes, sem full-page reload.

## Web 1.0.251 / r461
- Home Séries: preboot + âncora em Continuar assistindo antes de revelar a view.
- Home Filmes: Watchlist direta por cinetracker_home_movies_v405.
- Pra Você: renderer r461 com 7 slots e Trocar sempre visível.
- Perfil: tempos canônicos e listas sem corte/ocultação.
- F1: Série/F1Hub em r423, Esportes em r422, progresso em v426.

## Web 1.0.250 / r460
- Home Filmes permanece selecionado e carrega Watchlist v405 com recuperação delimitada.
- Pra Você exige sete ações Trocar.
- Perfil limita cinco rails a 13 cards + meio-card Ver mais e mantém desfazer no histórico diário.
- F1 usa progresso atual v426 sem reconciliação automática de boot; sincronização Série/Esportes/F1Hub r423 preservada.

# CineTracker Web — 1.0.0

**Package:** `1.0.0`  
**Revision:** `r204-official-1.0.0`  
**Base funcional:** `r203-discover-filter-search-right`  
**Produção:** `https://mycinetracker.vercel.app`

## Contrato da release

A Web 1.0.0 não reescreve a r203. `build-r204.mjs` executa a r203 completa e depois promove somente a identidade oficial:

- `window.__ctWebBuild = '1.0.0'`;
- `window.__ctOfficialVersion = '1.0.0'`;
- rodapé `CineTracker • v1.0.0`;
- snapshot de backup com `version: 1.0.0`;
- `release.json` com `version: 1.0.0`, revision `r204-official-1.0.0` e `status: official`;
- assets finais `app-v204.js` e `app-v204.css`.

## Funcionalidade preservada

A 1.0.0 mantém os comportamentos já presentes na r203, incluindo Descobrir/filtro à direita da busca, rewatch persistente `2x/3x/4x...`, Ver mais para filmes/séries/pessoas, limpeza do filtro duplicado de Sports, Home, Perfil, busca, detalhes, sincronização e importação.

## Build

```text
npm run build
```

Executa `build-r204.mjs` e `test-r204.mjs`.

O teste falha se a identidade visível continuar em 0.99.7, se `release.json` não declarar 1.0.0 ou se markers funcionais da r203 desaparecerem.

Documentação da release: `docs/releases/1.0.0.md`.
