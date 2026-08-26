# CineTracker Android — 0.0.99

App Android nativo leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.0.99`;
- `versionCode`: `997`;
- bundle: `v0.0.99-profile-lru-v95-core-inline-authoritative`.

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

## Build e publicação — concluídos

Pipeline dedicado: `.github/workflows/build-android-v099.yml`.  
Run: `33021058734` — **success**.

Comprovado no pipeline:

- build Web 0.0.99: success;
- runtime Android preparado e smoke inline aprovado;
- `gradle assembleDebug`: BUILD SUCCESSFUL;
- `aapt`: `com.cinetracker.app`, `0.0.99`, `versionCode 997`;
- assinatura verificada via `apksigner`;
- APK: `cinetracker-android-0.0.99-debug.apk`;
- artifact: `cinetracker-android-0.0.99-debug`, ID `9626549788`;
- GitHub Release: `android-v0.0.99`, ID `377463898`;
- checksum: `v099-sha256.txt`;
- SHA-256 do APK: `c39c08cd51470050f3eac2c444c4d468dcfcb4072230cf9e082def9ab176cf57`.

O status GitHub `Android 0.0.99` ficou `success — 0.0.99 build and release published`.

## Validação real ainda pendente

O APK foi compilado, assinado e publicado, mas ainda não está marcado como instalado/testado em aparelho real. Também permanecem pendentes os testes manuais visuais dos carrosséis, LRU e favoritos.

## Rodapé

**`CineTracker • v0.0.99`**.

Release: `docs/releases/0.0.99.md`.  
Validação: `docs/validation/0.0.99.md`.
