# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.48** | `r257-official-1.0.48` | sequência real de episódios, Descobrir pessoal, scroll por arrasto e F1 completo |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r257 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist e progresso canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.48 / r257

A r257 usa o vídeo posterior à r256 como ground truth. A geometria aprovada permanece e as correções se concentram na semântica da sequência assistida, nas exclusões pessoais do Descobrir, no gesto horizontal real e nas informações de fim de semana da Fórmula 1.

- **Home / próximo episódio real:** a fronteira passa a vir do conjunto exato de episódios assistidos de `cinetracker_series_episode_state_v1`. Buracos históricos anteriores à fronteira permanecem não vistos, mas nunca voltam a ser escolhidos como “próximo episódio”. Em séries longas como SmackDown, o próximo é o primeiro episódio já exibido depois da sequência recente acompanhada, e `Faltam` passa a contar somente pendências posteriores a essa fronteira. A mesma regra mantém Lioness e Stuart em `Continue assistindo` quando existe lançamento realmente pendente.
- **Descobrir / regras pessoais:** `Pra você` e as abas públicas validam dashboard pessoal + Watchlist completa antes de pintar. Vistos, concluídos, em andamento, em dia, Watchlist e `NotInterested` ficam fora das recomendações; o bloco `Da sua Watchlist` continua mostrando somente itens elegíveis da própria Watchlist. Se o estado pessoal não puder ser validado, a tela falha fechada em vez de recomendar títulos proibidos.
- **Descobrir / conteúdo completo:** as abas públicas consultam múltiplas páginas do TMDB, deduplicam e só então aplicam as exclusões pessoais. Elas não herdam os limites de nota/ano do `Pra você`, evitando trilhos com apenas um ou poucos cards depois da filtragem.
- **Scroll horizontal por arrasto:** abas e cards do Descobrir, temporadas/episódios, gráficos, relacionados/semelhantes, atores/elenco e trilhos do F1/Esportes recebem overflow local e fallback de `pointer-drag`. O gesto só é capturado quando o deslocamento horizontal domina o vertical, preservando a rolagem normal da página no celular.
- **F1 Hub:** mantém as seis áreas aprovadas e amplia `Visão geral` com todas as sessões disponíveis do próximo fim de semana em horário de São Paulo, grid de largada do próximo GP quando a classificação estiver disponível e o GP anterior com posição de largada → posição de chegada, status e tempo/pontos.
- **Validação:** o Chromium reproduz SmackDown com S01 histórico não visto e sequência S28 atual, exige que o próximo nunca volte para 1999, valida Lioness/Stuart, bloqueia Breaking Bad/Duna/título acompanhado no Descobrir, exige pelo menos 20 cards em `Em alta`, arrasta horizontalmente abas/cards e trilhos tardios de detalhes e valida 20 posições no grid seguinte e 20 no grid anterior.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
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
