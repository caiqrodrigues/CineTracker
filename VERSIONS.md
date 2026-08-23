# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.51 publicada** |
| Windows | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.
- `applicationId` Android permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- A 0.0.51 passa a ser a base permanente de assinatura `v5`.
- Baseline SHA-256 atual: `d4954df3952a7bd63519db79e7369ff55e5fe3d330aa4d5630287621cc79fd43`.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — código com marcação inteligente, ordenação por atividade recente, atualização imediata de progresso/estatísticas e disponibilidade de streaming.

## Android

- **0.0.50** — substituída após validação em aparelho revelar conflito entre runtimes locais acumulados.
- **0.0.51** — publicada: runtime único `ct51.js`; Home/Continuar assistindo rolável e clicável diretamente; Assistir próprio; série → temporada → episódio; check do próximo episódio; Voltar interno; marcação inteligente; ordenação recente; disponibilidade; Configurações 0.0.51; Descobrir em três colunas.

## Documentação por release

- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`
- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`
- `docs/releases/0.0.51.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.
