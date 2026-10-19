# CineTracker Android — 1.0.45

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

## Android 1.0.42 / r284

- Histórico de filmes completo com paginação autenticada v542 e conciliação de eventos anteriores.
- Pra Você: seis grupos elegíveis v421 auditados v525; sete posições e Watchlist real.
- APK de teste paralelo: `com.cinetracker.app.teste42`.
- Web r541 congelada, shell nativo preservado.

## Android 1.0.43 / r285

- Indicação do Dia compacta em 2:3; Trocar usa pools reais v421 auditados v525; ações locais não reinicializam as outras recomendações.
- Perfil com estatísticas, biblioteca e histórico de atividade carregados progressivamente, sem reinicialização de tela.
- APK TESTE43: `com.cinetracker.app.teste43`; Web r541 intocada.

## Android 1.0.44 / r286

- Pra Você: Trocar em todos os slots reais auditados pelo Supabase v525, rotação de itens mostrados e ausência de validação TMDB no clique.
- Home: UFC, WWE e Fórmula 1 ordenados após as séries comuns e com botão de marcar o próximo evento liberado.
- APK TESTE44 tem package separado `com.cinetracker.app.teste44`. Web r541 permanece congelada.

## Android 1.0.45 / r287

Corrigida a tela preta causada pela inicialização fora do escopo privado do módulo r263. Login preservado por isolamento de falhas e teste comparativo headless. Sem alterações na Web r541.
