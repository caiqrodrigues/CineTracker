# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-01

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | revision **`r173-detail-left-window`**, commit `9157d436bab8619a2cfbd492d35052176654c3ff` | **FROZEN**; baseline visual/funcional canônica |
| Android | **0.99.7.7** | `versionName 0.99.7.7`, `versionCode 9977`, bundle `android-v0.99.7.7-r173-mobile-composition` | release publicada; segunda revisão de composição mobile baseada em vídeo real; smoke real pendente |
| Backend / Supabase | **0.99.7** | contratos usados pela r173 e pelo APK | production compartilhado Web/Android |
| Windows | — | — | não lançado |

## Web r173 — baseline congelada

A Web r173 continua sendo a referência funcional e permanece intocada. Documento canônico: `docs/WEB_R173_FROZEN_BASELINE.md`.

## Histórico Android

- **0.99.7.4:** inválida; tela preta antes do login por corrupção de `$$` no empacotamento.
- **0.99.7.5:** bootfix; smoke real confirmou carregamento e funcionalidades r173.
- **0.99.7.6:** primeiro enquadramento mobile; removeu overflow global e criou carrosséis locais, mas vídeo real mostrou alguns componentes ainda com composição de desktop miniaturizada.
- **0.99.7.7:** revisão atual de composição mobile real.

## Android 0.99.7.7 — composição mobile atual

Arquivos principais:

- `scripts/prepare-android-v09977.mjs`
- `scripts/test-android-v09977.mjs`
- `apps/android/app/build.gradle`
- `.github/workflows/build-android-v09977.yml`
- `ci-status/android-v09977-trigger.txt`

Estratégia:

- mantém exatamente a Web r173 como autoridade funcional;
- preserva o bootfix da 0.99.7.5 e o enquadramento base da 0.99.7.6;
- hero de filme/série usa composição empilhada no telefone para evitar texto esmagado;
- título, metadados, sinopse e ações usam a largura integral do viewport;
- Onde Assistir usa cards maiores em carrossel horizontal;
- relacionados/cards gerais mostram aproximadamente 2–2,5 itens por viewport;
- elenco, temporadas e Top 10 usam proporções mobile legíveis;
- drawer de episódios usa still/tipografia maiores mantendo o viewport;
- Home, Perfil, Esportes e Configurações recebem refinamento de densidade e toque;
- gráficos continuam com overflow horizontal local;
- navegação inferior e safe-area Android são preservadas;
- JavaScript extraído do APK compilado continua validado com `node --check`;
- package/version/assinatura são validados antes da publicação.

### Streamings canônicos preservados

Top 10 e Onde Assistir exibem somente HBO Max, Amazon Prime Video, Netflix, Globoplay, Disney+, Apple TV+, Paramount+, Looke, Mubi e Crunchyroll.

## Estado de publicação 0.99.7.7

- PR #118: **mergeada**;
- Web r173 CI: **success / congelada**;
- Android identity: **success**;
- mobile composition runtime test: **success**;
- Gradle build: **success**;
- APK embedded JS syntax: **success**;
- assinatura: **success**;
- GitHub Release `android-v0.99.7.7`: **publicada**;
- smoke real da 0.99.7.7 em aparelho: **pendente**.

## Regra obrigatória

Source, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.
