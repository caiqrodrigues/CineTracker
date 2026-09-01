# CineTracker — Project State

> Documento persistente de continuidade. O estado real do projeto deve ser entendido por este arquivo e pelos documentos canônicos referenciados abaixo, sem depender do histórico de conversa.

**Última atualização:** 2026-09-01  
**Branch de produção:** `main`  
**Web:** `0.99.7` / revision **`r173-detail-left-window` — FROZEN**  
**Android atual:** **`0.99.7.6` / versionCode `9976`**  
**Backend:** Supabase production compartilhado por Web/Android  
**Windows:** não lançado

## 1. Regra principal

A Web r173 está **congelada** e é a baseline canônica. O trabalho Android pode adaptar viewport, navegação e composição para telefone, mas não deve alterar os arquivos funcionais nem regras da Web sem pedido explícito.

Commit canônico da Web congelada:

`9157d436bab8619a2cfbd492d35052176654c3ff`

Revision Web:

`r173-detail-left-window`

Documento completo:

`docs/WEB_R173_FROZEN_BASELINE.md`

## 2. Estado funcional da Web r173

Inclui Home de Séries/Filmes com progresso e metadados de episódio; Descobrir com Pra Você, Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Calendário; Esportes; Perfil com `Assistido por dia` clicável; detalhes ricos; Watchlist/Visto/Reassistido/Favorito; país de produção; Onde Assistir com 10 streamings canônicos; temporadas em drawer; gráficos modernos por temporada; atores/biografia/filmografia/favoritos; títulos relacionados; busca global e Voltar.

## 3. Streamings canônicos

Top 10 e Onde Assistir usam somente:

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

Planos/variantes e canais duplicados são consolidados ou ignorados.

## 4. Histórico Android

### 0.99.7.4 — INVÁLIDA

Primeiro porte integral da r173. O APK publicado abria em tela preta antes do login porque o empacotamento por `String.replace` transformou `$$` em `$`, duplicando `const $` e causando SyntaxError antes de `boot()`.

Não usar.

### 0.99.7.5 — BOOTFIX FUNCIONAL

Corrigiu o empacotamento do JavaScript e passou a validar o JS extraído do próprio APK com `node --check`. Smoke real confirmou que o aplicativo carrega e as funcionalidades r173 estão presentes.

O smoke em vídeo também mostrou que vários componentes ainda mantinham proporções de desktop: hero/detalhes largos, cards comprimidos e coleções sem comportamento de carrossel mobile consistente.

### 0.99.7.6 — ATUAL

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7.6`;
- `versionCode`: `9976`;
- bundle: `android-v0.99.7.6-r173-mobile-frame`;
- baseline: Web `r173-detail-left-window` congelada;
- builder mobile: `scripts/prepare-android-v09976.mjs`;
- test: `scripts/test-android-v09976.mjs`;
- workflow: `.github/workflows/build-android-v09976.yml`;
- release: `android-v0.99.7.6`.

## 5. Adaptação mobile 0.99.7.6

A 0.99.7.6 preserva a autoridade funcional r173 e altera somente a camada Android/mobile:

- enquadramento global em 100% da largura útil do telefone;
- `box-sizing` e `min-width:0` para impedir elementos filhos de alargarem a página;
- overflow horizontal da página bloqueado; overflow horizontal permitido apenas em componentes locais que precisam de carrossel/gráfico;
- Home permanece vertical e passa a respeitar integralmente a largura do telefone;
- Descobrir e filtros/pílulas passam a usar scroll horizontal local;
- Top 10 passa a usar cards mobile e swipe/scroll horizontal;
- elenco, títulos relacionados, temporadas e provedores/streamings viram carrosséis horizontais com scroll-snap;
- hero de filme/série mantém o conceito enjanelado da r173, mas poster/título/metadados/sinopse/botões refluem dentro do telefone;
- títulos longos quebram linha em vez de extrapolar o viewport;
- drawer de temporada ocupa a largura do telefone e seus episódios refluem em grid mobile;
- gráficos continuam amplos internamente, porém rolam horizontalmente dentro do próprio componente;
- Perfil usa duas colunas compactas para estatísticas;
- Esportes e Configurações refluem controles para a largura do aparelho;
- barra inferior respeita safe-area do Android;
- carrosséis exibem barra de rolagem fina e aceitam swipe nativo do WebView.

## 6. Validação 0.99.7.6

Comprovado tecnicamente:

- [x] PR #117 mergeada;
- [x] Verify da Web r173 continua `SUCCESS` e congelada;
- [x] Android identity 0.99.7.6 `SUCCESS`;
- [x] preparação do runtime mobile `SUCCESS`;
- [x] JavaScript embutido preserva `const $$` e passa `node --check`;
- [x] Gradle APK build `SUCCESS`;
- [x] validação do APK compilado `SUCCESS`;
- [x] assinatura validada;
- [x] artifact publicado;
- [x] Release `android-v0.99.7.6` publicada;
- [ ] smoke real da 0.99.7.6 no aparelho.

CI verde não equivale a UX validada. Print/vídeo real prevalece se houver divergência.

## 7. Documentos canônicos

- `PROJECT_STATE.md`
- `VERSIONS.md`
- `docs/WEB_R173_FROZEN_BASELINE.md`
- `docs/ANDROID_09974_R173_PARITY.md` (histórico do primeiro porte)
- `CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
