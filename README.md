# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.37** | `r246-official-1.0.37` | candidata à produção até o pipeline/smoke do `main` concluir |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r246 |
| Backend | produção compartilhada | Supabase | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.37 / r246

A r246 consolida numa autoridade final os comportamentos que estavam sendo disputados por patches anteriores, sem alterar o Android.

- Home força nova auditoria canônica de séries acompanhadas ao entrar/retomar a tela, usa 6 workers para episódios e reduz para 500 ms o fallback de metadados secundários de filmes;
- séries/eventos acompanhados em estado caught-up ou manualmente em andamento entram na mesma regra genérica de episódio liberado e não assistido, sem hardcode de títulos;
- Descobrir mantém as exclusões pessoais canônicas da r240 e as três seções reais de `Pra você` da r239, com geometria estável para evitar cards tremendo/pulando;
- Esportes expõe somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, remove a ação `Eventos/Agenda` e anima o botão `Assistido` ao clique;
- `Próximos` mostra somente o restante do dia atual; `Anteriores`, os três dias anteriores; `Favoritos`, apenas favoritos; `Assistidos`, o feed canônico de vistos;
- F1 Hub mantém seis abas (`Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores`, `Último GP`) e persiste o estado minimizar/expandir entre repaints;
- Perfil passa a manter estatísticas de mídia e esporte em um único grupo `Estatísticas`, preservando a ordem principal 4+4+2;
- a página continua com scroll vertical e sem overflow horizontal global; temporadas, relacionados/semelhantes, gráficos e demais trilhos largos ganham scrollbar horizontal local visível;
- build oficial: `apps/web/build-r246.mjs`; invariantes: `apps/web/test-r246.mjs`; teste Chromium: `scripts/test-r246-complete-ui-browser.mjs`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento ou na Watchlist;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, elenco e pessoas;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. Teste real no navegador/aparelho prevalece sobre asserts de CI quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
