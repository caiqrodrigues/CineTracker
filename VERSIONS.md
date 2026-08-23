# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.53 em publicação** |
| Windows | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste real em aparelho.
- `applicationId` permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- Assinatura estável atual usa o keystore v6 criado na 0.0.52 e o baseline registrado em `ci-status/android-signing-baseline.sha256`.

## Android

- **0.0.49** — última base confirmada pelo usuário como funcional.
- **0.0.50–0.0.52** — não usar como base funcional; introduziram regressões em runtime/navegação.
- **0.0.53** — restaura a arquitetura da 0.0.49 (`ct41 + ct47 + ct48 + ct49`) e acrescenta somente `ct53.js` para: marcação inteligente de episódios anteriores, Home rolável/clicável, Voltar interno, Descobrir em três colunas, ordenação de Acompanhando por atividade recente, atualização imediata após progresso e disponibilidade de streaming/cinema.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — código com marcação inteligente, ordenação por atividade recente, atualização imediata e disponibilidade.

## Documentação por release

- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`
- `docs/releases/0.0.51.md`
- `docs/releases/0.0.52.md`
- `docs/releases/0.0.53.md`
- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`

O histórico detalhado permanece em `CHANGELOG.md` e `PROJECT_STATE.md`.
