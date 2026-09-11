# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, histórico/progresso, Perfil, Descobrir, configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.38** | `r247-official-1.0.38` | produção validada por CI, boot do bundle final e smoke em Chrome contra a URL pública |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r247 |
| Backend | produção compartilhada | Supabase | produção |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.38 / r247

A r247 corrige a tela preta introduzida pela r246 e torna obrigatório validar o boot do bundle final completo antes da publicação.

- causa da tela preta identificada e reproduzida: a r246 injetava a antiga autoridade esportiva r240, que executava `sportsTabs = ...` em modo estrito mesmo quando `sportsTabs` já não existia no baseline atual; o `ReferenceError` acontecia antes de `boot()` e deixava `#app` vazio;
- a r247 volta a compor a release sobre a r245 estável e não injeta mais `runtime-r240-sports-four-tabs.js`;
- Esportes mantém `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`, mas agora a integração usa somente hooks que existam realmente no bundle (`sportsPayload`/`sportsFiltered`) e a camada DOM própria, sem depender de identificadores removidos;
- `Próximos` continua restrito ao restante do dia atual; `Anteriores`, aos três dias anteriores; `Favoritos`, aos favoritos; `Assistidos`, ao feed canônico legado;
- a ação `Eventos/Agenda` continua removida e o botão `Assistido` mantém animação de confirmação;
- Home preserva a autoridade canônica da r245, com 6 workers, lote prioritário de 24 séries e fallback secundário de filmes em 500 ms; a regressão Chromium continua cobrindo Lioness, Stuart e séries iniciadas genéricas;
- Descobrir preserva as exclusões pessoais e a troca atômica da r240 sem reintroduzir a autoridade esportiva incompatível;
- F1 Hub preserva as seis abas e o estado minimizar/expandir; Perfil mantém um único grupo `Estatísticas`; scroll vertical global e barras horizontais locais continuam preservados;
- o pipeline agora executa `scripts/test-r247-exact-bundle-browser.mjs`, que carrega o `app-v247.js` final inteiro em Chromium, captura `error`/`unhandledrejection` e falha se `#app` permanecer vazio;
- o smoke do `main` abre a URL pública em Chrome headless e exige DOM renderizado; a produção `1.0.38 / r247` passou essa validação, além dos checks de `release.json`, JS e CSS.

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

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
