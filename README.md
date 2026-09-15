# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.76** | `r285-official-1.0.76` | Home atômica; capas reais e controles próprios para Formula 1/Super Bowl |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r285 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.76 / r285

A r285 corrige o vídeo real posterior à r284: a Home não pode exibir uma versão provisória e trocar séries/episódios durante a reconciliação; Formula 1 e Super Bowl precisam de fotografias reais; e os controles de temporada/assistido da F1 precisam responder de forma confiável.

- **Home sem troca intermediária:** o payload é reconciliado integralmente em memória e apenas o snapshot completo é publicado. A visão anterior fica intacta enquanto a atualização está em andamento.
- **Formula 1 e Super Bowl com fotos reais:** as artes sintéticas da r284 foram substituídas por fotografias da Wikimedia Commons, com crédito/licença registrados em `docs/releases/web-1.0.76-r285.md`.
- **Temporadas da F1:** a seleção muda imediatamente para o ano escolhido e usa token de geração; uma resposta atrasada de outro ano não pode sobrescrever a seleção atual.
- **Marcar episódio assistido:** F1 e Super Bowl usam controles próprios r285, ativação por `pointerup`/`click` deduplicada e o writer canônico `cinetracker_mark_watch_v0994`.
- **Compatibilidade com o handler legado:** o opener da r284 é redirecionado para o renderer r285, enquanto os novos controles usam `data-ct285-*` para não serem capturados pelos handlers antigos.
- **Stuart:** mantém poster real via TMDB efetivo 287620.
- **Escopo preservado:** disponibilidade fresca da r283, ordenação da r282, isolamento de ações da r281, Histórico acima da viewport, abas/sidebar fixas, Descobrir, detalhes, Perfil, Sports/F1 Hub e Android permanecem preservados.

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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r285 herda integralmente a r284 e altera somente a publicação da Home e a apresentação/interação das séries importadas Formula 1/Super Bowl.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
