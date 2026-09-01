# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-01

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | revision **`r173-detail-left-window`**, commit `9157d436bab8619a2cfbd492d35052176654c3ff` | **FROZEN**; baseline visual/funcional canônica; não alterar durante o porte Android |
| Android | **0.99.7.6** | `versionName 0.99.7.6`, `versionCode 9976`, bundle `android-v0.99.7.6-r173-mobile-frame` | release publicada; enquadramento mobile/carrosséis implementados; smoke real desta revisão pendente |
| Backend / Supabase | **0.99.7** | contratos usados pela r173 e pelo APK | production compartilhado Web/Android |
| Windows | — | — | não lançado |

## Web r173 — baseline congelada

A Web r173 continua sendo a referência funcional e permanece intocada. Documento canônico: `docs/WEB_R173_FROZEN_BASELINE.md`.

## Android 0.99.7.4 — não usar

Primeiro porte integral da r173. O APK tinha tela preta antes do login por corrupção de `$$` durante o empacotamento do JavaScript.

## Android 0.99.7.5 — bootfix

Corrigiu o empacotamento e passou a validar o JavaScript extraído do próprio APK. Smoke real confirmou boot/login e presença das funcionalidades, mas evidenciou proporções de desktop e falta de carrosséis mobile consistentes em várias áreas.

## Android 0.99.7.6 — mobile frame atual

Arquivos principais:

- `scripts/prepare-android-v09976.mjs`
- `scripts/test-android-v09976.mjs`
- `apps/android/app/build.gradle`
- `.github/workflows/build-android-v09976.yml`
- `ci-status/android-v09976-trigger.txt`

Estratégia:

- mantém exatamente a Web r173 como autoridade funcional;
- preserva o bootfix da 0.99.7.5;
- enquadra o conteúdo na largura real do telefone;
- bloqueia overflow horizontal da página;
- usa overflow horizontal apenas dentro de carrosséis e gráficos;
- adiciona swipe/scroll + scroll-snap em Descobrir, Top 10, atores, relacionados, temporadas, provedores e gráficos;
- reduz cards para dimensões mobile;
- adapta hero/detalhes, drawer, Perfil, Esportes e Configurações para telefone;
- mantém a navegação inferior e safe-area Android;
- valida o JavaScript extraído do APK compilado com `node --check`;
- valida package/version/assinatura antes da publicação.

### Streamings canônicos preservados

Top 10 e Onde Assistir exibem somente HBO Max, Amazon Prime Video, Netflix, Globoplay, Disney+, Apple TV+, Paramount+, Looke, Mubi e Crunchyroll.

## Estado de publicação 0.99.7.6

- PR #117: **mergeada**;
- Web r173 CI: **success / congelada**;
- Android identity: **success**;
- mobile runtime test: **success**;
- Gradle build: **success**;
- APK embedded JS syntax: **success**;
- assinatura: **success**;
- GitHub Release `android-v0.99.7.6`: **publicada**;
- smoke real da 0.99.7.6 em aparelho: **pendente**.

## Regra obrigatória

Source, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.
