# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.45** | `r254-official-1.0.45` | correção guiada pelo vídeo: Home, Descobrir, Esportes/F1 e scroll local |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r254 |
| Backend | produção compartilhada | Supabase | produção; histórico e estatísticas canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.45 / r254

A r254 parte diretamente da r252, último baseline visual alinhado ao layout aprovado, em vez de importar a composição r253 que o vídeo de produção mostrou estar quebrada. O vídeo do usuário é a regressão principal desta release.

- **Home / fronteira de episódios:** o payload canônico é pintado imediatamente. Séries normais já iniciadas recebem em segundo plano uma checagem TMDB atual de `last_episode_to_air`; se existir episódio realmente exibido depois da fronteira assistida, a série vai para `Assistir a seguir`. `next_episode_to_air` nunca é tratado como episódio já lançado. Isso permite reconhecer episódios novos de Lioness/Stuart mesmo quando o metadata persistido no banco está atrasado.
- **Raw / SmackDown / séries legadas:** backlog histórico continua não visto, mas não força `Assistir a seguir`. Para WWE Raw, WWE SmackDown, Fórmula 1 e Super Bowl a comparação usa somente a fronteira realmente exibida; uma ocorrência futura em `next_episode_to_air` não conta. Uma decisão canônica `Em dia` também não é anulada por milhares de episódios antigos.
- **Descobrir:** as nove abas permanecem, mas a lista de estados pessoais/exclusões é carregada uma vez e reutilizada. Ao trocar de aba, o conteúdo atual permanece visível até o novo resultado ficar pronto; a troca do DOM é atômica, com geração para impedir resposta antiga de sobrescrever a aba atual e limites de tempo nas consultas.
- **Esportes / F1:** existe somente `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, usando `cinetracker_sports_payload_v1`. O F1 Hub r248 é relocado para dentro do conteúdo de Esportes imediatamente após ser criado; ele não pode mais virar um filho direto do grid `.app` antes da sidebar, causa exata da tela esmagada mostrada no vídeo.
- **Perfil:** o layout aprovado é preservado. Apenas os dados são atualizados por `cinetracker_profile_payload_v0997_r2` e `cinetracker_sport_stats_v1`, inclusive a contagem canônica de eventos assistidos.
- **Scroll horizontal local:** temporadas, relacionados, semelhantes, gráficos de episódios, trilhos de Descobrir e F1 são marcados dinamicamente depois de cada render assíncrono. A página continua sem scroll horizontal global; somente o componente largo recebe `overflow-x: auto`, touch nativo e scrollbar local.
- **Autoridades antigas:** os observers permanentes r239 e r247 e o classificador por idade da r252 são retirados do bundle final. A r254 mantém apenas um observer estreito de `childList` para aplicar scroll local e garantir a posição interna do F1 Hub; ele não reexecuta renderizadores.
- **Validação:** testes estáticos, algoritmos, Chromium guiado pelos quadros do vídeo e boot do bundle final verificam Lioness/Stuart, Raw/SmackDown, quatro abas esportivas, F1 dentro da coluna correta, 48 assistidos simulados, nove abas do Descobrir sem tela vazia durante a troca, Perfil com contagem atual e rails de temporada/gráfico adicionados depois da navegação.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x`…;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações e elenco;
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

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
