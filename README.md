# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.99** | `r308-official-1.0.99` | Descobrir 1+3+3, filtros pessoais, F1 Calendário e Perfil estabilizados no renderer real |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r308 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.97 / r306

A r306 substitui a autoridade final da r305 nos pontos que continuavam falhando em produção e elimina os repaints tardios responsáveis por mudanças visuais no Perfil.

- **Detalhes de filmes e séries:** títulos semelhantes/recomendados e atores voltam a abrir pelo identificador correto; `+ Watchlist` e `✓ Visto` usam a ação assíncrona canônica tanto nos relacionados quanto no detalhe principal.
- **Top 10:** header, margens e paddings superiores são compactados para manter o ranking mais alto na viewport, sem reintroduzir overflow horizontal global.
- **F1 Hub:** a aba `Pilotos` é removida; corridas passadas do Calendário abrem detalhes com `Grid de Largada` e `Resultado de Chegada`, usando os resultados da corrida e fallback Jolpica quando necessário.
- **Esportes:** `Próximos`, `Anteriores`, `Favoritos` e `Assistidos` ficam abaixo do F1 Hub; `↻ Rebuscar / Sincronizar` fica no header da página e força nova sincronização pelos providers/backend.
- **Perfil:** estatísticas deixam de receber reconciliações temporizadas; sinais `Abrir`/setas da Watchlist são removidos; cards de atores têm geometria fixa e o scroll horizontal fica somente no trilho dos cards.
- **Estabilidade:** a r305 é retirada do bundle final e a r306 opera antes do `boot()` por handlers/renderers canônicos, sem `MutationObserver`, `setInterval` ou `setTimeout` de reconciliação visual.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Build oficial: `apps/web/build-r306-official.mjs`; runtime: `apps/web/runtime-r306-final.js`; regressões: `apps/web/test-r306.mjs` e `apps/web/test-r306-browser.mjs`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
- detecção do primeiro episódio lançado não visto e tratamento específico para séries recorrentes antigas;
- Descobrir/Pra Você, Top 10, tendências, novidades, mais aguardados, mais bem avaliados e calendário;
- favoritos de filmes e séries sincronizados por estado `Liked`, com ação direta pelo coração no Descobrir;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- detalhes ricos de filmes, séries, temporadas, episódios, avaliações, elenco e títulos relacionados;
- Formula 1 e NFL Super Bowl importados tratados como séries, sem perder a área esportiva/F1 Hub;
- Perfil com estatísticas, favoritos, atividade e tempos;
- busca, importação, sincronização, manutenção e backup;
- Supabase como estado compartilhado entre Web e Android.

## Arquitetura

- `apps/web` — Web/PWA e cadeia de build de produção;
- `apps/android` — Activity + WebView e assets embarcados;
- `supabase` — migrations/RPCs, Edge Functions e estado compartilhado;
- `scripts` — preparação e validação dos bundles;
- `.github/workflows/verify.yml` — verificação da Web atual e baseline Android;
- `CHANGELOG.md` — histórico das versões.

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r308 herda a r307, aposenta as autoridades atrasadas que ainda brigavam pelo DOM e conecta uma autoridade final aos renderers vivos de Descobrir, F1 e Perfil, mantendo o Android intacto.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
