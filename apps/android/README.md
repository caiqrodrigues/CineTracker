# CineTracker Android — 0.99.2 FIX

App Android nativo leve baseado em `Activity + WebView`, com o mesmo runtime CineTracker Web embarcado e inlined no APK.

## Identidade

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.2`;
- `versionCode`: `9912`;
- bundle obrigatório: `v0.99.2-fix-991-992-authoritative`;
- patch final obrigatório: `patch-v095-v0992-fix.js`;
- release alvo: `android-v0.99.2`.

A primeira tentativa da 0.99.2 não é tratada como release válida. O APK só pode ser publicado se o runtime interno contiver `__ct0992FixLoaded` e o marker autoritativo acima.

## Consolidação 0.99.1 + 0.99.2

O runtime embarcado preserva Perfil/Pra Você/filtros/favoritos da 0.99.1 e a Home vertical da 0.99.2. A camada final corrige conflitos de navegação legados, `days is not defined`, inserts pessoais sem `profile_id`, inserts de mídia sem `media_kind`, menu duplicado/Histórico legado e expansão das seções do Perfil.

## Home — Séries

- histórico de episódios oculto acima do ponto inicial e revelado por Pull-to-Reveal;
- Assistir a seguir: pendências com atividade em até 30 dias ou novo episódio recém-lançado;
- Juntando poeira: pendências com mais de 30 dias;
- Em dia;
- Não Iniciadas / Watchlist;
- Concluídas;
- cards em linha com pôster 2:3, próximo S/E, progresso, faltantes, nome/nota do episódio e ✓;
- quick mark grava histórico + `episode_progress`, atualiza LRU e migra para Em dia quando necessário.

## Home — Filmes

- Vistos oculto por Pull-to-Reveal;
- Escolha para Hoje com nota >=8,0, nunca visto, uma seleção por perfil/data e sem repetição;
- Assistir a seguir / Watchlist;
- quick mark grava histórico + `AlreadySeen`.

## Sincronização / reatividade

Abertura, retorno de visibilidade, atualização do Calendário e `cinetracker:data-changed` reconciliam a Home. Novo episódio já lançado move Em dia -> Assistir a seguir. A conclusão de importação invalida os dados locais da Home para refletir o Supabase sem refresh manual.

## Runtime local e pipeline

`scripts/prepare-android-hotfix2-web.mjs` copia o build Web, converte scripts em inline e exige `patch-v095-v0992-fix.js` por último. `scripts/test-android-inline-hotfix6.mjs` compila todos os scripts inline e valida o marker FIX.

Workflow: `.github/workflows/build-android-v0992.yml`.

Na `main`, o pipeline deve validar:
- Web 0.99.2 FIX;
- bundle `v0.99.2-fix-991-992-authoritative`;
- `gradle assembleDebug`;
- `aapt`: package `com.cinetracker.app`, versionName `0.99.2`, versionCode `9912`;
- `apksigner`;
- artifact `cinetracker-android-0.99.2-debug`;
- Release `android-v0.99.2` + APK + `v0992-sha256.txt`.

Nenhuma dessas etapas é declarada concluída antes da evidência no workflow.

## Rodapé

**`CineTracker • v0.99.2`**.

Release: `docs/releases/0.99.2.md`.  
Validação: `docs/validation/0.99.2.md`.
