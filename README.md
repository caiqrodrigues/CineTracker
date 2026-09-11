# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.40** | `r249-official-1.0.40` | release com autoridade única de UI; promoção ao `main` exige CI, Chromium e smoke público |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r249 |
| Backend | produção compartilhada | Supabase | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.40 / r249

A r249 transforma a correção visual da r248 em uma **single authority** real: os reconciliadores finais deixam de depender de `MutationObserver` perpétuo e passam a reagir aos eventos de navegação/dados/render com reconciliação limitada. Isso impede renderizadores herdados de retomarem o DOM depois que a tela correta já foi pintada.

- **Home:** mantém a fronteira do último episódio efetivamente acompanhado. Buracos históricos continuam não assistidos, mas não empurram Raw, SmackDown ou outras séries longas para `Assistir a seguir`; quando existe episódio realmente novo depois da fronteira, ele sempre vence. A regra permanece genérica para Lioness, Stuart e demais séries iniciadas.
- **Descobrir:** cada consulta recebe geração, aba e tipo. Só a requisição mais recente ainda dona da aba/tipo pode pintar; uma resposta atrasada é descartada antes de tocar no conteúdo. Continuam valendo as exclusões de visto, em andamento, Watchlist e `NotInterested`, a geometria estável dos cards e a janela estrita de 30 dias de `Novidades`.
- **Esportes:** uma única autoridade mantém exatamente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`. `Próximos` é futuro do dia atual; `Anteriores`, D-1 a D-3; `Favoritos`, apenas favoritos; `Assistidos`, apenas vistos. `Eventos/Agenda` não volta a aparecer.
- **RPC esportivo removido:** a chamada inexistente `cinetracker_sports_events_v0997` foi eliminada do bundle final. F1/Super Bowl na Home reutilizam o payload/estado esportivo canônico já carregado pela aplicação, sem disparar RPC legado paralelo.
- **F1 Hub:** as seis áreas da r248 permanecem e minimizar/expandir continua sendo decisão persistente do usuário; reconciliação antiga não pode reabrir o Hub.
- **Perfil:** permanece um único grupo `Estatísticas`; containers esportivos separados que reapareçam após navegação são descartados pela autoridade atual.
- **Rolagem:** a página continua com rolagem vertical normal e sem overflow horizontal global. Temporadas, gráficos, relacionados/semelhantes, Descobrir, F1 e outros conteúdos largos recebem rolagem horizontal apenas local.
- **Validação:** além de toda a regressão r239→r248, a r249 testa corrida assíncrona de Descobrir e reintrodução atrasada de `Agenda`, estatísticas esportivas duplicadas e expansão indevida do F1 Hub. O bundle exato também é iniciado em Chromium antes da promoção.

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
