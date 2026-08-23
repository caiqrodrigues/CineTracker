# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.52 publicada** |
| Windows | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.
- `applicationId` Android permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- A 0.0.52 estabelece a base de assinatura persistente `v6`.
- Baseline SHA-256 atual: `231fab65f7af070000c37788e18ba7b1eaec3b40f87dd4772955ff241e8b57b7`.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — código com marcação inteligente, ordenação por atividade recente, atualização imediata de progresso/estatísticas e disponibilidade de streaming.

## Android

- **0.0.50** — última base funcional antes da tentativa de consolidação total.
- **0.0.51** — reprovada em aparelho; runtime único causou regressão geral e não deve ser usada como referência funcional.
- **0.0.52** — restaura a pilha funcional `ct41 + ct47 + ct48 + ct49 + ct50` e adiciona apenas `ct52` para corrigir Home rolável/clicável diretamente, navegação interna, detalhes de série/episódio, marcação inteligente, Descobrir em três colunas e identificação correta da build.

## Documentação por release

- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`
- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`
- `docs/releases/0.0.51.md`
- `docs/releases/0.0.52.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.
