# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.84 — 2026-09-15 — Web r293

### Descobrir / navegação
- Remove a aba `Lançamentos`, introduzida sem autorização na r288, da fonte `DTABS263`, do mapa de labels e do DOM; qualquer reconstrução antiga que tente recriá-la é saneada novamente.
- Caso uma sessão antiga esteja parada em `releases`, a navegação volta para `Novidades` sem criar outra aba substituta.

### Pra Você
- `100% Novos` volta a significar novo para o usuário, e não lançamento recente: mantém TMDB >= 7,5, ano > 1990, exclusão de WWE/Raw/SmackDown, histórico/assistidos, Watchlist e repetição semanal, mas elimina o limite inferior de data dos últimos 30 dias.
- O catálogo candidato pode usar qualquer título já lançado até hoje, preservando pools independentes de Filme, Série e Anime.
- `Da sua Watchlist` continua baseado no estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e descartando mídias sem identidade/pôster válidos.
- Slots sem candidato real deixam de produzir card cinza/`Indisponível`; somente categorias com item válido são renderizadas.
- `↻ Trocar` em `100% Novos` remove o item atual do pool da sessão, registra a exibição na semana e pinta o próximo candidato válido, evitando retorno ao mesmo item durante a semana.
- A r293 detecta repaints herdados da r292 e reaplica sua autoridade quando o pool antigo tentar sobrescrever o estado corrigido.

### Botões / relacionados
- Ações de Watchlist/Visto dos títulos relacionados/semelhantes são agrupadas em uma faixa própria dentro do card, sem sobrepor pôster/título e sem escapar para outras áreas da tela.
- A autoridade de clique/ID da r286/r292 é preservada: pôster/título abre a mídia correta e Watchlist/Visto continuam usando tipo + TMDB do próprio card.
- Nos três slots do Pra Você, Playlist permanece à esquerda e `↻ Trocar` à direita em footer estável.

### Build / validação
- Web atualizada para `1.0.84 / r293-official-1.0.84`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r293 adiciona validação estática e Chromium para remoção de `Lançamentos`, catálogo sem limite de 30 dias, exclusões canônicas, três categorias válidas, ausência de placeholders, troca semanal e posição das ações.

## 1.0.83 — 2026-09-15 — Web r292

### Títulos Relacionados / Semelhantes
- Clique no pôster ou título mantém autoridade própria e abre imediatamente a rota correta de filme/série pelo TMDB da mídia clicada.
- Watchlist usa o ID/tipo do próprio card, executa de forma assíncrona e atualiza o controle sem fechar o modal; a autoridade r286 permanece preservada e a r292 cobre também estruturas genéricas de relacionados/semelhantes.

### Descobrir / Pra Você
- `Da sua Watchlist` passa a reconstruir os candidatos a partir do estado canônico `cinetracker_recommendation_state_v108`, removendo itens já vistos e hidratando Filme, Série e Anime separadamente.
- `100% Novos` ganha pools independentes de Filme, Série e Anime, com TMDB >= 7.5, ano > 1990, exclusão de WWE/Raw/SmackDown, exclusão da Watchlist e do conjunto semanal `fresh_excluded`.
- `Trocar` opera somente sobre pools válidos por categoria; os índices são normalizados após cada atualização para não cair em posição inexistente.

### Cards / layout
- Título e metadados ficam rigidamente em uma linha com `line-clamp-1`, `white-space: nowrap` e reticências.
- Botões de Watchlist e `Trocar` ficam compactos em 30px, preservando o coração sobreposto no pôster e a geometria 154x231 mobile / 176x264 desktop herdada da r290/r291.
- A janela continua sem scroll horizontal; os trilhos permanecem locais.

### Build / validação
- Web atualizada para `1.0.83 / r292-official-1.0.83`; Android permanece `1.0.20 / versionCode 10062`.
- CI da r292 valida sintaxe, build oficial, regressões herdadas, Chromium para clique/Watchlist dos relacionados, pools Filme/Série/Anime do Pra Você, filtros de elegibilidade, bundle final exato e `production_smoke`.

## 1.0.82 — 2026-09-15 — Web r291

### Descobrir / ações
- `+ Playlist` / `✓ Salvo` deixam a área de título e metadados e passam para o footer ao lado de `↻ Trocar`, em layout horizontal sem sobreposição.
- Títulos e metadados ficam isolados dos controles, com uma linha, `line-clamp-1` e truncamento por reticências.

### Favoritos
- Cada card de mídia do Descobrir recebe um coração minimalista sobre o pôster, com estado otimista instantâneo e persistência `media_overrides.state = 'Liked'`.

### Carrosséis
- Trilhos do Descobrir, Top 10 e Pra Você mantêm scroll horizontal local com snap, `pan-x` e arraste por ponteiro; a janela permanece sem overflow horizontal.

## Histórico anterior
O histórico completo da Web 1.0.0 até a 1.0.81/r290 permanece preservado integralmente em `docs/releases/CHANGELOG-through-1.0.81.md` e no histórico Git.
