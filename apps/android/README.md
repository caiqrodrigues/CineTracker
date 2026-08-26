# CineTracker Android — 0.0.99

App Android nativo leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.99`;
- `versionCode`: `997`;
- bundle alvo: `v0.0.99-profile-lru-v95-core-inline-authoritative`.

## Perfil

Android usa a mesma implementação Web 0.0.99 embarcada no APK. Abaixo das estatísticas do Perfil são exibidos quatro carrosséis:

1. Séries;
2. Séries favoritas;
3. Filmes;
4. Filmes favoritos.

Cards usam pôster 2:3, título, progresso, badge de favorito e última atividade. A ordenação segue `last_watched_at DESC`.

Cabeçalhos abrem as visões completas:

- Séries: Em andamento, Não iniciadas, Assistir mais tarde / Watchlist, Em dia e Concluídas;
- Filmes: Assistir a seguir / Watchlist e Já vistos;
- Favoritos: grids completos responsivos de 2/3 colunas.

O estado é reconsultado após alterações de histórico/progresso/favoritos e ao retornar ao app.

## Navegação e recursos preservados

A barra nativa continua com Home, Descobrir, Perfil e Configurações; Histórico não é aba independente. Descobrir, backup ZIP/CSV, picker nativo, Limpar Cache, Atualizar Metadados e importação Bingers permanecem preservados da 0.0.98.

## Runtime local

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web para os assets Android, transforma scripts em inline e exige a presença final de `patch-v091-v099-profile-lru.js` e `CineTracker • v0.0.99`.

## Build e publicação

Pipeline dedicado: `.github/workflows/build-android-v099.yml`.

Saídas alvo:

- `cinetracker-android-0.0.99-debug.apk`;
- artifact `cinetracker-android-0.0.99-debug`;
- Release/tag `android-v0.0.99`;
- validação `aapt` de package/versionName/versionCode;
- `apksigner`;
- SHA-256 ao lado do APK.

Build/publicação e teste em aparelho real são estados distintos. O estado executado fica em `docs/validation/0.0.99.md`.

## Rodapé

**`CineTracker • v0.0.99`**.

Release: `docs/releases/0.0.99.md`.  
Validação: `docs/validation/0.0.99.md`.
