# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.51** | `r260-official-1.0.51` | cards padronizados no Descobrir, Home com first-page cache/skeleton e scroll horizontal isolado em detalhes |
| Android | **1.0.20** | `versionCode 10062` | produção, sem alteração na r260 |
| Backend | produção compartilhada | Supabase | histórico, Watchlist, progresso e estado de recomendação canônicos |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.51 / r260

A r260 corrige regressões visuais e de interação confirmadas no vídeo real posterior à r259, sem alterar Esportes, Perfil, Configurações ou F1.

- **Descobrir:** cards de filmes, séries e animes voltam ao footprint aprovado, com 176 px no desktop e 154 px no mobile, poster sempre em `aspect-ratio: 2/3`, sem encolhimento herdado.
- **Home:** um primeiro lote paginado e compacto por bucket é persistido em `sessionStorage` (sobrevive a reloads da aba sem misturar cache entre sessões do navegador) e restaurado antes da chamada canônica, fazendo `Assistir a seguir` reaparecer imediatamente em retornos/reloads. A resposta `r5` continua canônica e atualiza o cache em segundo plano.
- **Cold start:** quando ainda não existe first-page cache, a tela mostra skeletons leves em vez de painel vazio/congelado.
- **TMDB:** metadados de detalhe/temporada usados pela reconciliação da Home possuem cache de 6 h e a auditoria semanal de Raw/SmackDown é adiada para fora do primeiro paint.
- **Scroll de detalhes:** Temporadas, gráficos de temporada/episódio, elenco/atores e títulos relacionados/semelhantes recebem trilho local com `flex overflow-x-auto scrollbar-thin whitespace-nowrap touch-pan-x flex-nowrap`.
- **Touch/mouse:** toque usa scroll nativo; mouse/caneta usam drag delegado por `scrollLeft`, sem `MutationObserver` permanente.
- **Isolamento:** `html/body/#app` continuam sem overflow horizontal global. Somente o container local pode rolar lateralmente.
- **Validação:** Chromium roda em viewport mobile e desktop e mede proporção/tamanho dos cards, skeleton/cache da Home, overflow local, ausência de overflow global e drag real por mouse.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira e estados de biblioteca;
- Descobrir/Pra Você, Top 10, tendências, novidades, lançamentos, aguardados, mais bem avaliados e calendário;
- exclusões pessoais para não recomendar itens vistos, em andamento, em dia, na Watchlist ou marcados como não interessados;
- Watchlist completa com ordenação e navegação para detalhes;
- reassistir filmes e episódios com contador persistente `2x`, `3x`, `4x...`;
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
