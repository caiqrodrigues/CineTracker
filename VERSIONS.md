# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.50 publicada / 0.0.51 em build** |
| Windows | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.
- `applicationId` Android permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- A 0.0.50 é a base de assinatura atual.
- Baseline SHA-256 atual: `651e737a4e1de5d5db89773116528cd3ab3b0764a736dbd12dd8894fcc55bae7`.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — código com marcação inteligente, ordenação por atividade recente, atualização imediata de progresso/estatísticas e disponibilidade de streaming.

## Android

- **0.0.50** — publicada, porém validação em aparelho mostrou conflito entre runtimes locais acumulados.
- **0.0.51** — consolidação: a Activity injeta somente `ct51.js`. Corrige Home/Continuar assistindo rolável e clicável diretamente, Assistir próprio, série → temporada → episódio, check do próximo episódio, Voltar interno, marcação inteligente, ordenação recente, disponibilidade e 3 colunas em Descobrir.

## Documentação por release

- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`
- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`
- `docs/releases/0.0.51.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.
