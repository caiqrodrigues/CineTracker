# CineTracker Android — 0.99.2

App Android nativo leve baseado em `Activity + WebView`, com runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle: `v0.99.2-home-series-movies-v95-core-inline-authoritative`;
- release alvo: `android-v0.99.2`.

## Home 0.99.2

Android embarca a mesma Home Web 0.99.2:

### Séries
- histórico recente de episódios oculto acima do ponto inicial, revelado por Pull-to-Reveal/scroll;
- Assistir a seguir: pendências lançadas com última reprodução em até 30 dias ou novo episódio recém-lançado;
- Juntando poeira: pendências com mais de 30 dias;
- Em dia;
- Não Iniciadas / Watchlist;
- Concluídas.

Cards usam layout de linha com pôster 2:3, título, próximo Sxx Exx, progresso assistidos/lançados, faltantes, nome/nota do próximo episódio e botão circular ✓. O quick mark grava histórico e `episode_progress`, atualiza LRU e move a série para Em dia quando não restam episódios lançados.

### Filmes
- histórico Vistos oculto acima do ponto inicial;
- Escolha para Hoje com nota >=8.0, nunca visto, persistência por dia e sem repetição de títulos já recomendados;
- Assistir a seguir / Watchlist em cards de linha;
- quick mark grava histórico e `AlreadySeen`.

## Sincronização de lançamentos

No primeiro uso do dia, no retorno do app e na atualização do Calendário, séries Em dia/Em andamento com TMDB oficial são reconciliadas. Um novo episódio com `air_date <= hoje` move a série para Assistir a seguir e exibe badge Novo Episódio. IDs TMDB substitutos negativos não são enviados à TMDB.

## Reatividade pós-importação

Abrir Home, alternar Séries/Filmes, retornar ao app ou receber `cinetracker:data-changed` força reconciliação. A conclusão de importação também invalida o cache da Home para refletir os dados Bingers sem refresh manual.

## Runtime local

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web para assets locais, transforma scripts em inline e exige a ordem até `patch-v093-v0992.js`. O runtime principal continua independente de fallback remoto.

## Pipeline 0.99.2

Workflow dedicado: `.github/workflows/build-android-v0992.yml`.

Quando executado na `main`, ele deve:
- construir e verificar a Web 0.99.2;
- preparar e validar o runtime inline;
- executar `gradle assembleDebug`;
- validar `com.cinetracker.app`, `versionName 0.99.2` e `versionCode 9912` com `aapt`;
- verificar assinatura com `apksigner`;
- publicar artifact `cinetracker-android-0.99.2-debug`;
- publicar Release `android-v0.99.2` com `cinetracker-android-0.99.2-debug.apk` e `v0992-sha256.txt`.

Enquanto o pipeline não concluir, build/publicação permanecem explicitamente pendentes em `docs/validation/0.99.2.md`.

## Recursos preservados

Perfil 0.99.1, Pra Você, Calendário, episódios ricos, marcação inteligente, cinegrafia do ator, Backup/Importar Dados, Cache, Metadados e Bingers permanecem no runtime. Histórico continua fora da navegação principal.

## Rodapé

**`CineTracker • v0.99.2`**.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
