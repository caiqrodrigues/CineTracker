# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-01

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | revision **`r173-detail-left-window`**, commit `9157d436bab8619a2cfbd492d35052176654c3ff` | **FROZEN**; baseline visual/funcional canônica; não alterar durante o porte Android |
| Android | **0.99.7.4** | `versionName 0.99.7.4`, `versionCode 9974`, bundle `android-v0.99.7.4-r173-parity` | porte da r173 para APK; build/release automatizados após merge |
| Backend / Supabase | **0.99.7** | contratos usados pela r173 e pelo APK | production compartilhado Web/Android |
| Windows | — | — | não lançado |

## Web r173 — baseline congelada

A Web r173 é a referência atual. Não deve ser modificada durante o trabalho Android.

Documento canônico:

`docs/WEB_R173_FROZEN_BASELINE.md`

Principais áreas já consolidadas:

- Home com séries, filmes, progresso e metadados de episódio;
- Descobrir com Pra Você, Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Calendário;
- Esportes com busca global, favoritos, calendário, eventos e assistidos;
- Perfil com 10 estatísticas canônicas, coleções e `Assistido por dia` clicável;
- detalhes ricos de filme/série com painel hero enjanelado à esquerda;
- Watchlist, Visto/Reassistido e Favorito;
- Onde Assistir e país de produção;
- temporadas em drawer e gráficos por temporada;
- atores, biografia, filmografia e favoritos;
- Títulos Relacionados mistos;
- busca global e Voltar.

## Android 0.99.7.4

Objetivo: paridade funcional total com a Web r173, sem alterar as regras da Web.

Arquivos principais:

- `scripts/prepare-android-v09974.mjs`
- `scripts/test-android-v09974.mjs`
- `apps/android/app/build.gradle`
- `apps/android/app/src/main/res/layout/activity_main.xml`
- `.github/workflows/build-android-v09974.yml`
- `ci-status/android-v09974-trigger.txt`

Documento completo:

`docs/ANDROID_09974_R173_PARITY.md`

### Estratégia

O Android 0.99.7.4 executa `apps/web/build-r173.mjs`, embute `app-v173.js` e `app-v173.css` no APK e acrescenta apenas uma camada mobile para WebView. Assim Home, Descobrir, Top 10, Esportes, Perfil, Configurações, detalhes, temporadas, gráficos, atores, relacionados, streamings e regras de estado continuam usando a mesma autoridade r173.

### Navegação Android

A barra nativa antiga permanece escondida por compatibilidade. O APK usa a navegação mobile gerada pela própria r173:

- Home
- Descobrir
- Esportes
- Perfil
- Configurações

O botão físico Voltar usa a bridge `window.ct48Back`.

### Streamings canônicos

Top 10 e Onde Assistir exibem somente:

1. HBO Max
2. Amazon Prime Video
3. Netflix
4. Globoplay
5. Disney+
6. Apple TV+
7. Paramount+
8. Looke
9. Mubi
10. Crunchyroll

## Fluxo de publicação Android 0.99.7.4

1. PR/CI valida identidade e scripts;
2. merge em `main` altera `ci-status/android-v09974-trigger.txt`;
3. workflow `.github/workflows/build-android-v09974.yml` prepara o runtime r173 embutido;
4. Gradle gera APK debug assinado com a chave CineTracker existente;
5. workflow valida package/versionCode/versionName e markers de paridade;
6. SHA-256 é gerado;
7. artifact é publicado no GitHub Actions;
8. release `android-v0.99.7.4` é criada/atualizada com APK e SHA-256;
9. smoke real no aparelho permanece etapa obrigatória.

## Regra obrigatória

Source, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.
