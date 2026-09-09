# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.25** | `r233-official-1.0.25`, base r232 | produção |
| Android | **1.0.20** | `versionCode 10062` | produção |
| Backend | produção compartilhada | Supabase | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.25 / r233

A 1.0.25 consolida uma autoridade final orientada a eventos para Home, Descobrir, Esportes e Watchlist. O objetivo é impedir que normalizadores antigos continuem reescrevendo a interface depois que a tela já foi renderizada.

- remove o polling esportivo concorrente de `700ms` da r229;
- neutraliza MutationObservers e polls legados que ainda alteravam Descobrir, Esportes ou contagens da Watchlist;
- usa um normalizador final único na r233 para classificação de controles e ações;
- revalida séries classificadas como `Em dia` consultando o episódio mais recente efetivamente lançado no TMDB antes de manter esse estado;
- recalcula episódios liberados usando temporadas anteriores + episódio atual da temporada mais recente;
- corrige a Watchlist do Perfil para usar todas as linhas retornadas pelo RPC completo, sem descartar registros apenas por não possuírem TMDB id válido;
- mantém registros locais sem TMDB visíveis no modal da Watchlist, enquanto títulos com id continuam abrindo os detalhes normalmente;
- mantém a autoridade visual consolidada dos cards de Esportes, mas passa a executá-la somente após render/paint reais da aplicação;
- substitui observação contínua de DOM por execução vinculada aos eventos reais de renderização, atualização de dados e navegação.

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
- `supabase` — migrations/RPCs e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. Teste real no navegador/aparelho prevalece sobre asserts de CI quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
