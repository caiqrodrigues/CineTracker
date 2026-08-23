# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.4.9 publicada / 0.5.0 em código** |
| Android | **0.0.50 publicada** |
| Windows | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.
- `applicationId` Android permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- A 0.0.50 é a nova base de assinatura estabilizada pelo CI.
- Baseline SHA-256 atual: `651e737a4e1de5d5db89773116528cd3ab3b0764a736dbd12dd8894fcc55bae7`.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — código pronto: marcação inteligente de episódios anteriores, ordenação por atividade recente, atualização imediata de progresso/estatísticas, disponibilidade de streaming e reforço final de Descobrir em três colunas. Deploy do último commit ainda depende da janela do Vercel.

## Android

- **0.0.49** — transição de assinatura e Home/Acompanhando sincronizados.
- **0.0.50** — publicada: marcação inteligente de episódio com confirmação dos anteriores, Home rolável/clicável, botão Voltar integrado à navegação interna, Acompanhando ordenado pelo último episódio visto, atualização imediata de estatísticas, disponibilidade de streaming/cinema e três cards por linha em Descobrir.

## Documentação por release

- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`
- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.
