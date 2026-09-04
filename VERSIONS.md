# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-04

## Matriz oficial

| Sistema | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.0** | revision `r204-official-1.0.0`, package `1.0.0`, base r203 | oficial |
| Android | **1.0.0** | `versionName 1.0.0`, `versionCode 10042`, base 0.99.7.71 / r243 | oficial |
| Backend / Supabase | produção compartilhada | RPCs/migrations atuais | oficial |
| Windows | — | — | não lançado |

## Web 1.0.0

A Web 1.0.0 é uma promoção de identidade da r203 já consolidada. O build `build-r204.mjs` preserva o comportamento r203 e altera somente a identidade oficial de release:

- `package.json`: `1.0.0`;
- revision: `r204-official-1.0.0`;
- asset final: `app-v204.js` / `app-v204.css`;
- `window.__ctWebBuild = '1.0.0'`;
- rodapé visível: `CineTracker • v1.0.0`;
- snapshot exportado: `version: 1.0.0`;
- `release.json`: `version: 1.0.0`, `status: official`.

## Android 1.0.0

A identidade oficial é:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.0`;
- `versionCode`: `10042`;
- preparação: `scripts/prepare-android-v1000.mjs`;
- teste: `scripts/test-android-v1000.mjs`;
- pipeline: `.github/workflows/release-v1.yml`;
- APK alvo: `CineTracker-1.0.0.apk`.

O runtime é deliberadamente o mesmo da **0.99.7.71/r243**, que foi validado no aparelho pelo usuário. A promoção para 1.0.0 não altera a cadeia funcional do Trocar nem o scroll do Top 10.

### Comportamentos congelados na baseline

- Watchlist Trocar usa o pool exato selecionado pelo renderer ativo (`wmPool/wsPool/waPool`);
- Watchlist Filme/Série/Anime troca somente seu próprio slot;
- 100% novos permanece independente;
- Top 10 e streamings usam scroll horizontal nativo;
- rewatch `2x/3x/4x...` permanece persistente;
- demais funcionalidades da linha 0.99.7 permanecem incorporadas.

## Regra de versionamento após 1.0.0

- correção compatível: `1.0.x`;
- funcionalidade compatível: `1.x.0`;
- quebra deliberada de contrato/arquitetura: próxima major;
- `versionCode` Android sempre aumenta, independentemente do `versionName`.

## Regra de validação

CI verde não substitui teste real. Web production, APK gerado, assinatura e smoke físico são estados registrados separadamente em `docs/validation/1.0.0.md`.
