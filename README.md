# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.26** | `r234-real-regressions-baseline-preserving-authority` | produção |
| Android | **1.0.20** | `versionCode 10062` | produção |
| Backend | produção compartilhada | Supabase / `ct-enrich-media-user` v7 | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.26 / r234

A 1.0.26 corrige regressões reais observadas após a 1.0.25. Em vez de empilhar outra autoridade sobre a r233, a r234 volta ao último baseline visual comprovado para cada área e limita cada correção ao escopo necessário.

- Home aplica imediatamente o estado conhecido de episódios antes do paint e faz revalidação TMDB em background, sem bloquear a tela;
- o hidratador antigo que fazia a cascata temporada → série é neutralizado para eliminar a demora de dezenas de segundos no carregamento de episódios;
- séries com episódio já lançado e ainda não assistido deixam de permanecer incorretamente como `Em dia` e retornam para `Assistir a seguir`;
- Descobrir reutiliza o baseline r232 e atua somente em `Indicação do dia`, `Da sua Watchlist` e `100% novos`; Top 10 fica explicitamente fora do alcance da r234;
- Esportes volta a usar o layout canônico r123, preservando posição e composição visual dos botões;
- Watchlist do Perfil e modal passam a consumir o mesmo universo lógico completo, mantendo inclusive registros importados ainda sem TMDB resolvido;
- registros locais sem capa mantêm geometria estável e recebem enriquecimento progressivo apenas quando visíveis;
- séries importadas podem ser resolvidas por TVDB → TMDB antes do fallback por título através da Edge Function `ct-enrich-media-user` v7;
- o build oficial passa a ser `apps/web/build-r234.mjs`, com `test-r234.mjs` como regressão obrigatória da Web 1.0.26.

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
