# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-01

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | revision **`r173-detail-left-window`**, commit `9157d436bab8619a2cfbd492d35052176654c3ff` | **FROZEN**; baseline visual/funcional canônica; não alterar durante o porte Android |
| Android | **0.99.7.5** | `versionName 0.99.7.5`, `versionCode 9975`, bundle `android-v0.99.7.5-r173-parity-bootfix` | release publicada; bootfix técnico validado; smoke real no aparelho pendente |
| Backend / Supabase | **0.99.7** | contratos usados pela r173 e pelo APK | production compartilhado Web/Android |
| Windows | — | — | não lançado |

## Web r173 — baseline congelada

A Web r173 é a referência atual e permanece intocada. Documento canônico: `docs/WEB_R173_FROZEN_BASELINE.md`.

Ela contém Home com progresso/metadados de episódio; Descobrir com Pra Você, Top 10 e demais abas; Esportes; Perfil com `Assistido por dia`; detalhes ricos; Watchlist/Visto/Reassistido/Favorito; Onde Assistir; país de produção; temporadas/drawer; gráficos; atores; relacionados; busca global e Voltar.

## Android 0.99.7.4 — não usar

A `0.99.7.4` foi o primeiro porte integral da r173 para o APK. O smoke real mostrou tela preta antes do login.

Causa: o builder embutia o JavaScript por replacement textual de `String.replace`. A sequência `$$` do helper `const $$` foi interpretada como escape de replacement e virou `$`, criando duas declarações `const $` e causando `SyntaxError` antes de `boot()`.

A versão 0.99.7.4 é historicamente registrada, mas **inválida para uso**.

## Android 0.99.7.5 — bootfix atual

Arquivos principais:

- `scripts/prepare-android-v09975.mjs`
- `scripts/test-android-v09975.mjs`
- `apps/android/app/build.gradle`
- `.github/workflows/build-android-v09975.yml`
- `ci-status/android-v09975-trigger.txt`

Estratégia:

- continua usando exatamente a Web r173 congelada como autoridade funcional;
- embute JS/CSS por callbacks de replacement, sem transformar `$`/`$$`;
- exige `const $$` preservado e somente um `const $`;
- valida o JS extraído do HTML Android com `node --check`;
- compila o APK;
- abre o APK já compilado, extrai `assets/hotfix5/index.html`, extrai novamente o JavaScript e executa `node --check`;
- valida `com.cinetracker.app`, `versionName 0.99.7.5`, `versionCode 9975`, assinatura e markers de paridade;
- publica APK e SHA-256 na Release `android-v0.99.7.5`.

### Streamings canônicos preservados

Top 10 e Onde Assistir exibem somente HBO Max, Amazon Prime Video, Netflix, Globoplay, Disney+, Apple TV+, Paramount+, Looke, Mubi e Crunchyroll.

## Estado de publicação 0.99.7.5

- PR #116: **mergeada**;
- Web r173 CI: **success / congelada**;
- Android identity: **success**;
- embedded JS syntax: **success**;
- Gradle build: **success**;
- APK embedded JS syntax: **success**;
- assinatura: **success**;
- GitHub Release `android-v0.99.7.5`: **publicada**;
- smoke real em aparelho: **pendente**.

## Regra obrigatória

Source, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.
