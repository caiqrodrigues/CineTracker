# CineTracker — Project State

> Documento persistente de continuidade. O estado real do projeto deve ser entendido por este arquivo e pelos documentos canônicos, sem depender do histórico de conversa.

**Última atualização:** 2026-09-01  
**Branch de produção:** `main`  
**Web:** `0.99.7` / revision **`r173-detail-left-window` — FROZEN**  
**Android atual:** **`0.99.7.7` / versionCode `9977`**  
**Backend:** Supabase production compartilhado por Web/Android  
**Windows:** não lançado

## 1. Regra principal

A Web r173 está **congelada** e é a baseline canônica. O trabalho Android pode adaptar viewport, navegação e composição para telefone, mas não deve alterar arquivos funcionais nem regras da Web sem pedido explícito.

Commit canônico Web: `9157d436bab8619a2cfbd492d35052176654c3ff`  
Revision: `r173-detail-left-window`

Documento: `docs/WEB_R173_FROZEN_BASELINE.md`

## 2. Baseline funcional r173

A baseline inclui Home de Séries/Filmes com progresso e metadados de episódio; Descobrir com Pra Você, Top 10 e demais abas; Esportes; Perfil com `Assistido por dia`; detalhes ricos; Watchlist/Visto/Reassistido/Favorito; país de produção; Onde Assistir com 10 streamings canônicos; temporadas em drawer; gráficos por temporada; atores/biografia/filmografia/favoritos; relacionados; busca global e Voltar.

## 3. Histórico Android

### 0.99.7.4 — inválida

Tela preta antes do login por corrupção do `$$` durante empacotamento do JavaScript.

### 0.99.7.5 — bootfix

Corrigiu o empacotamento, passou a validar o JavaScript extraído do próprio APK e o smoke real confirmou boot/login e funcionalidades r173.

### 0.99.7.6 — enquadramento inicial

Bloqueou overflow global de página e introduziu carrosséis locais, mas o smoke real em vídeo mostrou que alguns componentes ainda pareciam desktop miniaturizado, principalmente hero de detalhes, Onde Assistir e proporções de cards.

### 0.99.7.7 — ATUAL

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7.7`;
- `versionCode`: `9977`;
- bundle: `android-v0.99.7.7-r173-mobile-composition`;
- baseline: Web `r173-detail-left-window` congelada;
- builder: `scripts/prepare-android-v09977.mjs`;
- test: `scripts/test-android-v09977.mjs`;
- workflow: `.github/workflows/build-android-v09977.yml`;
- release: `android-v0.99.7.7`.

## 4. Composição mobile 0.99.7.7

Baseada diretamente no vídeo real da 0.99.7.6:

- hero de filme/série deixa de esmagar texto ao lado do poster e passa a composição empilhada no telefone;
- título, metadados, sinopse e ações usam a largura integral;
- Onde Assistir usa cards maiores e legíveis em carrossel;
- relacionados e cards gerais mostram aproximadamente 2–2,5 itens por viewport;
- elenco, temporadas e Top 10 usam proporções mobile mais legíveis;
- drawer de episódios usa still e tipografia maiores sem sair do viewport;
- Home recebe linhas e ações proporcionais ao telefone;
- Perfil continua em duas colunas, com cards maiores;
- Esportes/Configurações refinam inputs e painéis para toque;
- gráficos mantêm scroll horizontal local;
- toda a paridade funcional r173 e o bootfix são preservados.

## 5. Validação 0.99.7.7

- [x] PR #118 mergeada;
- [x] Web r173 continua `SUCCESS` e congelada;
- [x] Android identity 0.99.7.7 `SUCCESS`;
- [x] preparação do runtime `SUCCESS`;
- [x] JavaScript embutido passa `node --check`;
- [x] Gradle APK build `SUCCESS`;
- [x] validação do APK compilado `SUCCESS`;
- [x] assinatura validada;
- [x] artifact publicado;
- [x] Release `android-v0.99.7.7` publicada;
- [ ] smoke real da 0.99.7.7 no aparelho.

CI verde não equivale a UX validada. Print/vídeo real prevalece quando houver divergência.

## 6. Streamings canônicos

Top 10 e Onde Assistir usam somente HBO Max, Amazon Prime Video, Netflix, Globoplay, Disney+, Apple TV+, Paramount+, Looke, Mubi e Crunchyroll. Planos/variantes e canais duplicados são consolidados ou ignorados.
