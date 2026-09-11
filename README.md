# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.39** | `r248-official-1.0.39` | release validada por CI e Chromium; promoção ao `main` exige smoke público |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r248 |
| Backend | produção compartilhada | Supabase | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.39 / r248

A r248 consolida a correção completa de Home, Descobrir, Esportes, F1 Hub, Perfil e rolagem, eliminando autoridades antigas que voltavam a alterar o DOM depois do paint correto.

- **Home:** a auditoria canônica passa a 8 workers, lote prioritário de 40 séries e fallback secundário em 250 ms. O estado de acompanhamento usa a **fronteira do último episódio efetivamente acompanhado**: buracos antigos continuam não vistos e disponíveis para depois, mas não tiram Raw, SmackDown ou outra série longa de `Em dia`. Se existir simultaneamente um episódio lançado depois dessa fronteira, o episódio novo sempre vence o backlog histórico e leva a série para `Assistir a seguir`. Lioness, Stuart e demais séries iniciadas seguem a mesma regra genérica, sem hardcode de título.
- **F1 e Super Bowl na Home:** são tratados como acompanhamentos seriados a partir de **eventos esportivos reais**. Um evento liberado e não assistido entra como novo episódio/evento; quando só existe o próximo evento real, o acompanhamento permanece em dia com indicação do próximo. Eventos já vistos não são reapresentados como novos.
- **Descobrir:** snapshots antigos de HTML deixam de ser restaurados entre abas. As exclusões pessoais canônicas permanecem ativas em `Pra você` e demais faixas de recomendação/ranking, impedindo recomendação de itens vistos, em andamento, Watchlist e `NotInterested`. Cards e trilhos deixam de disputar geometria durante hidratação; `Novidades` preserva a janela estrita de 30 dias.
- **Esportes:** ficam somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`. `Próximos` mostra apenas jogos futuros do dia atual; `Anteriores`, D-1 a D-3; `Favoritos`, somente jogos ligados aos favoritos; `Assistidos`, os vistos. Controles `Eventos/Agenda` são removidos e `Assistido` mantém animação de confirmação.
- **F1 Hub:** usa Jolpica para a temporada atual com `Visão geral`, `Calendário`, `Próximo GP`, `Pilotos`, `Construtores` e `Último GP`; mostra horário de Brasília, contagem regressiva, resultado da corrida e grid/qualificação. Minimizar/expandir persiste em `localStorage` e não volta a abrir por reconciliação antiga.
- **Perfil:** `Estatísticas de esporte` é incorporado ao único grupo `Estatísticas`, com posição estável entre repaints.
- **Rolagem:** a página mantém rolagem vertical e bloqueia overflow horizontal global. Temporadas, relacionados/semelhantes, gráficos, trilhos do Descobrir/F1 e outros conteúdos largos recebem scrollbar horizontal local visível.
- **Validação:** o pipeline cobre regressões r239→r247, build/invariantes r248, casos Chromium de backlog histórico + episódio novo, F1/Super Bowl seriados, quatro abas esportivas, F1 persistente, Perfil unificado, scroll local e boot do bundle final. Android permanece explicitamente na baseline 1.0.20/10062.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para evitar recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
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

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.