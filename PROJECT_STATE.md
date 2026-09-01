# CineTracker — Project State

> Documento persistente de continuidade. O estado real do projeto deve ser entendido por este arquivo e pelos documentos canônicos, sem depender do histórico de conversa.

**Última atualização:** 2026-09-01  
**Branch de produção:** `main`  
**Web:** `0.99.7` / revision **`r175-bingers-next-episode`**  
**Android atual:** **`0.99.7.9` / versionCode `9979`**  
**Backend:** Supabase production compartilhado por Web/Android  
**Windows:** não lançado

## 1. Linha de base e retomada da Web

A Web `r173-detail-left-window` permanece documentada como a antiga baseline visual quase ideal em `docs/WEB_R173_FROZEN_BASELINE.md`. Ela ficou congelada durante o primeiro porte Android.

Em 2026-09-01 o usuário pediu explicitamente uma nova evolução para **Web e Android**, inspirada na fluidez observada no Bingers. Isso autorizou a retomada da Web nas revisões r174/r175 sem apagar a baseline r173.

## 2. Web r175 — ATUAL

Revision: `r175-bingers-next-episode`.

A r175 preserva todo o conjunto funcional da r173/r172 e adiciona a arquitetura de interação instantânea iniciada na r174:

- regra central: **UI primeiro, persistência depois**;
- marcar episódio muda a tela imediatamente, sem esperar Supabase;
- Home atualiza contagem, histórico, bucket/status e posição da série imediatamente;
- reordenação usa transição FLIP, evitando reload visual da página;
- confirmação verde animada dá feedback instantâneo;
- sincronização acontece em segundo plano;
- se a persistência falhar, a alteração otimista é revertida e o usuário é avisado;
- Home pré-carrega o **próximo episódio real a assistir e também o sucessor**;
- ao marcar episódio 4, o card pode trocar imediatamente para episódio 5, incluindo **nome, nota e data**, sem esperar nova consulta;
- quando a série fica em dia/concluída, ela muda imediatamente para o bucket correspondente;
- no drawer de temporada, episódio visto pode ser alternado para **Não assistido**;
- `Reassistido` continua sendo uma ação separada.

## 3. Backend para desmarcar episódio

Produção possui o RPC autenticado:

`cinetracker_unmark_episode_v1`

Ele remove a marcação lógica do episódio em histórico/eventos/progresso para todas as linhas equivalentes da mesma série TMDB, invalida `AlreadySeen/Completed/UpToDate` quando necessário e devolve a série para `InProgress` quando ainda existem episódios vistos.

Também existe policy DELETE própria do usuário em `watch_play_events_v0994`.

Migration documentada em:

`supabase/migrations/202609010140_r174_episode_unwatch.sql`

## 4. Android atual — 0.99.7.9

Identidade:

- `applicationId`: `com.cinetracker.app`;
- `versionName`: `0.99.7.9`;
- `versionCode`: `9979`;
- bundle: `android-v0.99.7.9-r175-bingers-handoff`;
- Web embutida: `r175-bingers-next-episode`;
- composição mobile herdada/refinada da 0.99.7.7;
- builder: `scripts/prepare-android-v09979.mjs`;
- test: `scripts/test-android-v09979.mjs`;
- workflow: `.github/workflows/build-android-v09979.yml`;
- release: `android-v0.99.7.9`.

O APK usa a mesma experiência otimista da Web r175 e mantém hero empilhado, carrosséis mobile, drawer de episódios, safe-area e demais ajustes de enquadramento Android.

## 5. Histórico Android resumido

- **0.99.7.4:** inválida; tela preta antes do login por corrupção de `$$`.
- **0.99.7.5:** bootfix funcional.
- **0.99.7.6:** primeiro enquadramento mobile/carrosséis.
- **0.99.7.7:** composição mobile baseada em vídeo real.
- **0.99.7.8:** primeira versão com UX otimista r174 e toggle Assistido/Não assistido.
- **0.99.7.9:** atual; acrescenta handoff instantâneo para o próximo episódio real e seu sucessor.

## 6. Validação atual

- [x] PR #119 mergeada — r174 / Android 0.99.7.8;
- [x] PR #120 mergeada — r175 / Android 0.99.7.9;
- [x] Web r175 syntax/build/asserts `SUCCESS`;
- [x] Vercel production `SUCCESS`;
- [x] `Production domain serves r175` `SUCCESS`;
- [x] Android 0.99.7.9 identity `SUCCESS`;
- [x] Gradle APK build `SUCCESS`;
- [x] JavaScript r175 extraído do APK passa `node --check`;
- [x] assinatura validada;
- [x] Release `android-v0.99.7.9` publicada;
- [ ] smoke real da 0.99.7.9 no aparelho.

CI verde não equivale a UX validada. Print/vídeo real prevalece quando houver divergência.

## 7. Streamings canônicos

Top 10 e Onde Assistir usam somente HBO Max, Amazon Prime Video, Netflix, Globoplay, Disney+, Apple TV+, Paramount+, Looke, Mubi e Crunchyroll. Planos/variantes e canais duplicados são consolidados ou ignorados.
