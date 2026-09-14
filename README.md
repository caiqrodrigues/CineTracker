# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.64** | `r273-official-1.0.64` | Histórico da Home restaurado diretamente do payload r5 e cards com layout horizontal estrito |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r273 |
| Backend | produção compartilhada | Supabase | `cinetracker_profile_home_payload_v0997_r5` é a autoridade da Home |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.64 / r273

A r273 remove a dependência da cadeia de reparos pós-render para o Histórico da Home e torna a consulta canônica do Supabase parte explícita do renderer final.

- **Histórico real da Home:** `renderHome` consulta diretamente `cinetracker_profile_home_payload_v0997_r5(p_today)`, valida `series`, `movie_watchlist`, `history_episodes` e `history_movies` antes do paint e só considera o Histórico autoritativo depois dessa resposta. Um payload incompleto não pode mais virar falso estado vazio.
- **Histórico primeiro:** `Histórico recente` é a primeira seção de Séries e `Filmes vistos` é a primeira seção de Filmes. O estado de carregamento usa `Carregando histórico…`; somente uma resposta canônica válida e realmente vazia pode mostrar `Nenhum episódio no histórico` ou `Nenhum filme no histórico`.
- **Desfazer visto:** cada item do Histórico recebe uma ação própria. Episódios usam `cinetracker_unmark_episode_v1`; filmes usam `cinetracker_unmark_media_seen_v1`. Após a alteração, a Home recarrega o payload r5 e repinta a partir do estado real do banco.
- **Cards horizontais estritos:** cards da Home usam `display:flex`, `flex-direction:row`, `flex-wrap:nowrap`, conteúdo esquerdo com `min-width:0; flex:1` e ação fixa de 40×40 px à extrema direita. O botão `✓` usa posicionamento estático no flex e não pode cair para uma linha inferior em mobile ou desktop.
- **Escopo preservado:** Descobrir, detalhes/scroll, Sports/F1 e Android continuam na autoridade anterior e não são reconstruídos pela r273.
- **Validação:** Chromium cobre 420 px e 1200 px, Histórico real nas duas abas, ausência de falso vazio, desfazer episódio/filme, geometria do `✓`, `flex-wrap:nowrap`, mutações de DOM e responsividade. O bundle final também é inicializado integralmente antes da promoção.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes com opção de desfazer marcação de visto;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r273 implementa no runtime final a mesma regra estrutural solicitada para um componente React/Tailwind: linha flex horizontal sem wrap, conteúdo esquerdo flexível e ação fixa à direita.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
