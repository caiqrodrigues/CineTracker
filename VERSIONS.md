# CineTracker — Versionamento por sistema

**Atualizado em:** 2026-09-01

## Matriz atual

| Sistema | Versão | Identidade técnica | Estado atual |
|---|---:|---|---|
| Web | **0.99.7** | revision **`r175-bingers-next-episode`**, merge funcional `6c9106a842a9545fadf7e9f41a8da2bf46e17fd9` | produção; UX otimista + handoff instantâneo do próximo episódio |
| Android | **0.99.7.9** | `versionName 0.99.7.9`, `versionCode 9979`, bundle `android-v0.99.7.9-r175-bingers-handoff` | release publicada; embute Web r175 e preserva composição mobile 0.99.7.7 |
| Backend / Supabase | **0.99.7** | r175 + `cinetracker_unmark_episode_v1` | production compartilhado Web/Android |
| Windows | — | — | não lançado |

## Web r175 — atual

A antiga r173 permanece documentada como baseline visual histórica. A Web voltou a evoluir por pedido explícito do usuário.

A r175 mantém toda a funcionalidade anterior e adiciona:

- atualização otimista: UI reage antes da persistência;
- reordenação animada de séries na Home;
- histórico/progresso/bucket atualizados imediatamente;
- rollback visual caso a persistência falhe;
- próximo episódio real pré-carregado;
- sucessor também pré-carregado;
- ao marcar um episódio, **número, nome, nota e data** trocam imediatamente para o próximo;
- episódio assistido pode ser desmarcado;
- `Reassistido` continua separado.

Revision:

`r175-bingers-next-episode`

## Android 0.99.7.9 — atual

Arquivos principais:

- `scripts/prepare-android-v09979.mjs`
- `scripts/test-android-v09979.mjs`
- `apps/android/app/build.gradle`
- `.github/workflows/build-android-v09979.yml`

O APK embute exatamente a experiência r175 e mantém a composição mobile refinada anteriormente: hero empilhado, carrosséis horizontais, drawer de episódios, Perfil/Esportes/Configurações adaptados e safe-area Android.

Release:

`android-v0.99.7.9`

APK:

`cinetracker-android-0.99.7.9-r175-bingers-handoff-debug.apk`

## Backend r175

RPC novo:

`cinetracker_unmark_episode_v1`

Permite desfazer uma marcação incorreta de episódio, limpando histórico/progresso/eventos lógicos da mesma série TMDB e ajustando o estado da série.

Migration:

`supabase/migrations/202609010140_r174_episode_unwatch.sql`

## Histórico Android

- **0.99.7.4:** inválida — tela preta por corrupção de `$$`.
- **0.99.7.5:** bootfix.
- **0.99.7.6:** enquadramento inicial e carrosséis.
- **0.99.7.7:** composição mobile real baseada em vídeo.
- **0.99.7.8:** r174, primeira UX otimista + desmarcar episódio.
- **0.99.7.9:** r175, handoff instantâneo próximo episódio + sucessor.

## Validação

- Web r175 build/syntax/asserts: **SUCCESS**;
- Vercel production: **SUCCESS**;
- Production domain serves r175: **SUCCESS**;
- Android 0.99.7.9 identity: **SUCCESS**;
- Gradle APK: **SUCCESS**;
- JS embutido no APK: **SUCCESS**;
- assinatura: **SUCCESS**;
- Release Android 0.99.7.9: **publicada**;
- smoke real em aparelho: **pendente**.

## Regra obrigatória

Source, CI, deploy Web, build APK, assinatura, release e smoke real são estados separados. Vídeo/print real prevalece sobre CI quando houver divergência.
