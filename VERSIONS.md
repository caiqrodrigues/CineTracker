# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma, com paridade funcional sempre que a função não for exclusivamente nativa.

| Plataforma | Versão publicada | Próxima versão em implementação |
|---|---:|---:|
| Web | **0.4.9** | **0.5.0** |
| Android | **0.0.49** | **0.0.50** |
| Windows | — | — |

## Regras

- Uma versão Android só é concluída quando código, documentação, workflow, Release e APK estão publicados.
- Compilado não significa validado; Android exige teste em aparelho e Web exige deploy/teste real.
- `applicationId` Android permanece `com.cinetracker.app` e `versionCode` sempre cresce.
- A 0.0.49 tornou-se a nova base definitiva de assinatura após reinstalação única autorizada pelo usuário.
- Baseline atual de assinatura: `277a81b60c689c801ea9d45a311de29c2e5ed97fdc5bea0f4705f8531153e1ed`.
- 0.0.50+ só podem ser publicados se o CI confirmar exatamente esse certificado.

## Web

- **0.4.9** — Home/Continuar assistindo sincronizado com Acompanhando, check do próximo episódio e Descobrir reforçado em três colunas.
- **0.5.0** — marcação inteligente de episódios anteriores, ordenação por atividade recente, atualização imediata de progresso/estatísticas, disponibilidade de streaming e reforço final de Descobrir em três colunas.

## Android

- **0.0.49** — nova base estável de assinatura; Home/Acompanhando sincronizados, check do próximo episódio e Descobrir compacto.
- **0.0.50** — marcação inteligente de episódio com confirmação dos anteriores, Home rolável/clicável, botão Voltar integrado à navegação interna, Acompanhando ordenado pelo último episódio visto, atualização imediata de estatísticas, disponibilidade de streaming/cinema e três cards reais por linha em Descobrir.

## Documentação por release

- `docs/releases/web-0.4.9.md`
- `docs/releases/web-0.5.0.md`
- `docs/releases/0.0.49.md`
- `docs/releases/0.0.50.md`

O histórico detalhado permanece em `CHANGELOG.md`, `PROJECT_STATE.md` e no histórico do GitHub.
