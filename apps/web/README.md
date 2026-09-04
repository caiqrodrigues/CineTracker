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
