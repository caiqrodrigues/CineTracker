# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.81** | `r290-official-1.0.81` | cards de mídia padronizados pela geometria da Indicação do Dia |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r290 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.81 / r290

A r290 transforma o card da **Indicação do Dia** na referência dimensional única para cards de filmes, séries e animes na Web.

- **Geometria única:** pôster 2:3 travado em **176×264 px no desktop** e **154×231 px no mobile**, igual à Indicação do Dia.
- **Container imutável:** card e área clicável usam altura fixa derivada da mesma referência; texto longo não aumenta, comprime ou estica o card.
- **Texto previsível:** título limitado a duas linhas; ano, gêneros, tipo e nota ficam em uma linha truncada; o bloco de texto possui altura fixa de **80 px no desktop** e **75 px no mobile**.
- **Descobrir inteiro:** `Da sua Watchlist`, `100% Novos`, `Top 10`, `Em alta`, `Populares`, `Novidades`, `Lançamentos`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` usam exclusivamente cards verticais uniformes.
- **Top 10 sem banner legado:** o fallback de faixa larga é substituído pelo mesmo card vertical padronizado.
- **Restante da Web:** cards de mídia poster-based são normalizados pela classe compartilhada `ct-media-card-lock`, inclusive conteúdo criado depois do primeiro paint.
- **Layout local:** grids e carrosséis preservam a largura fixa dos cards; quando não há espaço, o overflow fica no componente, nunca expandindo o card ou a página.
- **Android preservado:** continua em `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v290.js` / `app-v290.css`; build: `apps/web/build-r290-official.mjs`; runtime compartilhado: `apps/web/runtime-r290-universal-media-card-lock.js`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto com consolidação por TMDB efetivo e exceção de fronteira atual para séries recorrentes antigas;
- contagem fresca de todos os episódios já lançados ainda disponíveis para ver;
- próximo episódio anunciado para séries em dia;
- metadados ricos de episódios e filmes;
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

A Web atual é uma aplicação JavaScript/PWA construída por uma cadeia incremental de build. A r290 herda integralmente a r289 e acrescenta uma autoridade compartilhada de geometria de cards, sem alterar a baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
