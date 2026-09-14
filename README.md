# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.74** | `r283-official-1.0.74` | Reassistir/Desfazer isolados da navegação; contagem fresca de episódios disponíveis e sequência atual de Raw/SmackDown |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r283 |
| Backend | produção compartilhada | Supabase | Home no payload r6 limitado; estado canônico por TMDB efetivo e writer de Histórico preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.74 / r283

A r283 corrige o ground truth do vídeo posterior à r282: ações do Histórico não podem abrir o card da série/filme, e a quantidade de episódios disponíveis deve refletir todos os episódios já lançados ainda não vistos, mesmo quando o metadata persistido do payload r6 está atrasado.

- **Reassistir/Desfazer sem navegação:** `↻` e `↶` são capturados no `window` antes do handler genérico de `data-media`; a ação é executada no próprio Histórico e não abre `/series/...` ou `/movie/...`.
- **Disponibilidade fresca:** a reconciliação usa a fronteira `last_episode_to_air` e a estrutura de temporadas do TMDB para recalcular episódios já lançados, descontando as chaves canônicas realmente assistidas.
- **Lioness e Magnatas do Crime:** a mesma regra cobre lançamentos semanais e temporadas liberadas em lote; o contador não fica mais artificialmente travado em `1` quando existem vários episódios disponíveis.
- **Raw/SmackDown:** backlog histórico continua preservado e contado como disponível, mas não volta a ser escolhido como “próximo episódio”. O próximo card usa somente episódio lançado depois da maior fronteira realmente assistida.
- **Histórico consistente:** a quantidade exibida dentro do Histórico usa a mesma disponibilidade fresca calculada para os cards ativos.
- **Escopo preservado:** ordem por última visualização da r282, clique isolado do `✓` da r281, Histórico acima da viewport, metadados ricos, deduplicação, Descobrir, detalhes, Sports/F1 e Android permanecem preservados.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, acessível acima da viewport inicial, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto com consolidação por TMDB efetivo e exceção de fronteira atual para séries recorrentes antigas;
- contagem fresca de todos os episódios já lançados ainda disponíveis para ver;
- próximo episódio anunciado para séries em dia;
- metadados ricos de episódios e filmes nos cards da Home;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
- Formula 1 e NFL Super Bowl importados tratados como séries, sem perder a área esportiva/F1 Hub;
- Perfil com estatísticas, favoritos, atividade e tempos;
- Sports integrado ao mesmo shell do CineTracker e F1 Hub;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r283 herda integralmente a r282 e altera somente a autoridade das ações do Histórico e a reconciliação/contagem de episódios disponíveis na Home.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
