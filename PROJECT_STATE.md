# CineTracker — Project State

> Documento persistente de continuidade. O estado real do projeto deve ser entendido por este arquivo e pelos documentos canônicos referenciados abaixo, sem depender do histórico de conversa.

**Última atualização:** 2026-09-01  
**Branch de produção:** `main`  
**Web:** `0.99.7` / revision **`r173-detail-left-window` — FROZEN**  
**Android atual:** **`0.99.7.5` / versionCode `9975`**  
**Backend:** Supabase production compartilhado por Web/Android  
**Windows:** não lançado

## 1. Regra principal a partir da r173

A Web r173 está **congelada**. O trabalho Android deve portar/adaptar a r173 sem alterar seus arquivos funcionais ou regras de negócio.

Commit canônico da Web congelada:

`9157d436bab8619a2cfbd492d35052176654c3ff`

Revision exibida no rodapé:

`r173-detail-left-window`

Documento completo:

`docs/WEB_R173_FROZEN_BASELINE.md`

## 2. Estado funcional da Web r173

A baseline r173 inclui Home de Séries/Filmes com progresso e metadados de episódio; Descobrir com Pra Você, Top 10, Em alta, Populares, Novidades, Lançamentos, Mais Aguardados, Mais bem avaliados e Calendário; Esportes com busca global/favoritos/calendário/assistidos; Perfil com estatísticas e `Assistido por dia` clicável; detalhes ricos de filme/série; Watchlist, Visto/Reassistido e Favorito; país de produção; Onde Assistir com 10 streamings canônicos; temporadas em drawer; gráficos modernos por temporada; atores/biografia/filmografia/favoritos; títulos relacionados mistos; busca global e Voltar.

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

## 4. Android 0.99.7.4 — INVÁLIDO

A versão `0.99.7.4` foi compilada e assinada, mas o smoke real no aparelho mostrou **tela preta antes do login**.

Causa confirmada extraindo `assets/hotfix5/index.html` do APK publicado: o builder embutia `app-v173.js` usando o segundo argumento textual de `String.replace`. Nesse modo, `$$` é uma sequência especial de replacement e foi transformada em `$`. O helper original `const $$=...querySelectorAll...` virou uma segunda declaração `const $`, produzindo:

`SyntaxError: Identifier '$' has already been declared`

O JavaScript abortava antes de `boot()`, portanto nem o login era renderizado.

A 0.99.7.4 não deve ser usada nem considerada validada funcionalmente.

## 5. Android 0.99.7.5 — ATUAL

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7.5`;
- `versionCode`: `9975`;
- bundle: `android-v0.99.7.5-r173-parity-bootfix`;
- baseline: `r173-detail-left-window`;
- builder: `scripts/prepare-android-v09975.mjs`;
- test: `scripts/test-android-v09975.mjs`;
- workflow: `.github/workflows/build-android-v09975.yml`;
- release: `android-v0.99.7.5`.

Correção do boot:

- o JS/CSS r173 é embutido com callback de replacement, preservando literalmente `$`, `$$` e demais sequências do runtime;
- o builder exige `const $$` intacto e apenas uma declaração `const $`;
- o JavaScript é extraído do HTML Android final e validado com `node --check`;
- após compilar, o workflow abre o próprio APK, extrai novamente o JavaScript de `assets/hotfix5/index.html` e executa `node --check` antes de publicar;
- package, versionCode, versionName, assinatura e markers de paridade também são validados.

A paridade funcional continua sendo a mesma da Web r173; somente o empacotamento Android foi corrigido.

## 6. Validação da 0.99.7.5

Comprovado tecnicamente:

- [x] PR #116 mergeada;
- [x] Verify Web r173 permanece verde e congelada;
- [x] Android identity 0.99.7.5 success;
- [x] preparação do runtime Android success;
- [x] JavaScript embutido no HTML passa `node --check`;
- [x] Gradle APK build success;
- [x] JavaScript extraído do APK compilado passa `node --check`;
- [x] assinatura validada;
- [x] artifact publicado;
- [x] Release `android-v0.99.7.5` publicada;
- [ ] smoke real 0.99.7.5 no aparelho.

CI verde não equivale a UX validada. Print/vídeo real prevalece se houver divergência.

## 7. Documentos canônicos

- `PROJECT_STATE.md`
- `VERSIONS.md`
- `docs/WEB_R173_FROZEN_BASELINE.md`
- `docs/ANDROID_09974_R173_PARITY.md` (histórico do primeiro porte; 0.99.7.4 inválida)
- `CHANGELOG.md`
- `docs/ARCHITECTURE.md`
- `docs/SECURITY.md`
