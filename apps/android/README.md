# CineTracker Android — 0.99.2 FIX2

App Android nativo leve em `Activity + WebView`, usando o runtime Web embarcado e inline.

## Identidade atual
- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: **9913**;
- bundle: `v0.99.2-fix2-unfreeze-991-992-authoritative`;
- patch final: `patch-v096-v0992-unfreeze.js`;
- workflow: `.github/workflows/build-android-v0992-fix2.yml`;
- Release: `android-v0.99.2`.

O APK anterior `versionCode 9912` foi publicado com o runtime congelado e está invalidado. Como um `versionCode` publicado não deve ser reutilizado para upgrade, o FIX2 usa 9913 mantendo a release lógica/visível 0.99.2.

## Travamento corrigido
A primeira publicação do FIX entrou em ciclo recursivo de `MutationObserver`: helpers reatribuíam o mesmo `textContent`, a escrita gerava outro `childList MutationRecord` e o observer rodava novamente. Isso saturava a main thread da WebView.

`patch-v096-v0992-unfreeze.js` entra por último e torna escrita idêntica em `Node.textContent` um no-op antes dos observers atrasados iniciarem. Markers: `__ct0992UnfreezeLoaded` e `fix2-idempotent-dom-mutation-guard`.

## Conteúdo preservado
O runtime 9913 contém a consolidação 0.99.1 + 0.99.2: Perfil/timeline/favoritos/filtros, Pra Você, Calendário, episódios ricos, marcação inteligente, cinegrafia, Bingers, Home Séries vertical/Pull-to-Reveal/LRU/quick mark/sync de lançamentos e Home Filmes com recomendação diária/Watchlist.

## Pipeline FIX2
O run `33032044592` concluiu com sucesso:
- build e verificação da Web FIX2;
- preparação do runtime inline;
- build Gradle;
- validação do package, `versionName 0.99.2`, `versionCode 9913`, marker FIX2 e assinatura;
- artifact;
- substituição do asset na Release `android-v0.99.2`.

APK atual: `cinetracker-android-0.99.2-debug.apk`.  
SHA-256: `8564bacca16bf153ebdb05f64a89337b998d23c02c8edb9a137e2a104725f9d2`.

O pipeline aprovado não substitui teste físico. Instalação/upgrade e responsividade por pelo menos 60 s permanecem pendentes até evidência real.

Rodapé: **`CineTracker • v0.99.2`**.  
Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
