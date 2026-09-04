# CineTracker Android — 1.0.0

App Android leve baseado em `Activity + WebView`, com runtime CineTracker embarcado no APK e backend Supabase compartilhado com a Web.

## Identidade oficial

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `1.0.0`;
- `versionCode`: `10042`;
- base funcional: **0.99.7.71 / r243**;
- preparação: `scripts/prepare-android-v1000.mjs`;
- teste: `scripts/test-android-v1000.mjs`;
- pipeline: `.github/workflows/release-v1.yml`;
- artifact: `cinetracker-android-1.0.0`;
- APK: `CineTracker-1.0.0.apk`.

## Baseline funcional

A 1.0.0 é uma promoção de release da 0.99.7.71 validada no aparelho. Nenhuma nova autoridade de toque é criada.

O contrato congelado é:

- `r237` permanece a única autoridade do botão Trocar;
- em Da sua Watchlist, `pool237()` usa exatamente o `wmPool/wsPool/waPool` retornado pelo renderer ativo `ct186`;
- Filme/Série/Anime trocam somente o próprio slot;
- 100% novos permanece independente;
- Top 10/streamings usa scroll horizontal nativo, sem controlador manual de `touchmove`;
- rewatch persistente `2x/3x/4x...` e demais recursos da linha 0.99.7 permanecem presentes.

## Versão exibida

Além de `versionName`, a preparação 1.0.0 atualiza o número mostrado dentro do runtime:

- `window.__ctWebBuild = '1.0.0'`;
- `window.__ctOfficialVersion = '1.0.0'`;
- `window.__ctAndroidOfficialVersion = '1.0.0'`;
- rodapé `CineTracker • v1.0.0`;
- snapshot exportado `version: 1.0.0`.

Markers históricos de revisões anteriores permanecem no bundle apenas como identidade interna de camadas; eles não são a versão oficial exibida.

## Validação oficial

O pipeline 1.0.0 repete o teste que finalmente capturou o bug real da Watchlist: um `PointerEvent('pointerup')` atravessa o handler real e precisa produzir `Watchlist 11 → 14` sem alterar `100% novos 21 → 21`.

Depois disso são validados Gradle, `aapt`, assinatura e conteúdo interno do APK.

Documentação: `docs/releases/1.0.0.md` e `docs/validation/1.0.0.md`.
