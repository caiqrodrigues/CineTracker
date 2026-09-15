# 🎬 CineTracker

CineTracker é um companion pessoal multiplataforma para filmes, séries, animes e esportes. Web e Android compartilham conta, biblioteca, Watchlist, Histórico/progresso, Perfil, Descobrir, Configurações, importação/backup e sincronização pelo Supabase.

## Versões atuais

| Plataforma | Versão | Identidade técnica | Estado |
|---|---:|---|---|
| Web | **1.0.84** | `r293-official-1.0.84` | Descobrir autorizado, Pra Você novo para o usuário e ações relacionadas estabilizadas |
| Android | **1.0.20** | `versionCode 10062` | produção, preservado sem alterações na r293 |
| Backend | produção compartilhada | Supabase | estado canônico por TMDB efetivo e writers de progresso preservados |
| Windows | — | — | não lançado |

Produção Web: `https://mycinetracker.vercel.app`

## Web 1.0.84 / r293

A r293 corrige regressões da r292 em **Descobrir > Pra Você** e nos **Títulos Relacionados/Semelhantes**, sem alterar a baseline Android.

- **Navegação autorizada:** remove a aba `Lançamentos` introduzida indevidamente e impede que reconciliadores antigos a recriem; sessões antigas nessa aba retornam para `Novidades`.
- **Da sua Watchlist:** usa o estado canônico do usuário, exclui itens já vistos e só renderiza mídia válida com identidade e pôster.
- **100% Novos:** significa novo para o usuário, não lançamento recente. Usa qualquer título já lançado até hoje com TMDB >= 7,5, ano > 1990, sem WWE/Raw/SmackDown, fora da Watchlist, fora de vistos/histórico e sem repetição semanal.
- **Filme, Série e Anime:** pools independentes por categoria; slots sem candidato real ficam ocultos, sem card cinza `Indisponível`.
- **Trocar seguro:** remove o item atual do pool da sessão, registra a exibição da semana e avança apenas para outro candidato válido.
- **Relacionados/semelhantes:** pôster/título mantêm a abertura da mídia correta; Watchlist/Visto usam o tipo + TMDB do próprio card e ficam numa faixa de ações própria, sem sobreposição ou vazamento para outras áreas.
- **Ações do Pra Você:** Playlist fica à esquerda e `↻ Trocar` à direita em footer estável.
- **Cards compactos:** geometria, truncamento em uma linha, coração sobreposto e scroll horizontal somente nos trilhos permanecem preservados.
- **Android preservado:** `1.0.20 / versionCode 10062`.

Assets oficiais: `app-v293.js` / `app-v293.css`; build: `apps/web/build-r293-official.mjs`; runtime: `apps/web/runtime-r293-discover-foryou-actions-authority.js`.

## Funcionalidades consolidadas

- Home de séries e filmes com progresso, Assistir a seguir, Em dia, Juntando Poeira, Histórico recente e estados de biblioteca;
- Histórico de episódios e filmes cronológico, com Reassistir e desfazer marcação de visto sem navegar para detalhes;
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

A Web é uma aplicação JavaScript/PWA construída por uma cadeia incremental. A r293 herda a geometria e ações consolidadas até r292 e assume autoridade final sobre a navegação autorizada do Descobrir, os pools do Pra Você e o posicionamento das ações relacionadas, mantendo a baseline Android.

## Regra de validação

Build, CI, deploy, APK, assinatura e teste real são evidências separadas. O bundle final e a produção precisam renderizar conteúdo em navegador real; teste no navegador/aparelho prevalece sobre asserts estáticos quando houver divergência.

Documentação canônica: `PROJECT_STATE.md`, `VERSIONS.md`, `CHANGELOG.md`, `docs/ARCHITECTURE.md`, `docs/DEVELOPMENT_RULES.md` e `docs/SECURITY.md`.
