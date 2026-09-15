# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.87 — 2026-09-15 — Web r296

### Pra Você / autoridade rígida
- Endurece a elegibilidade global para TMDB >= 7,5 e ano > 1990, excluindo títulos compostos exclusivamente por Drama/Documentário e ampliando a barreira absoluta contra WWE, incluindo Raw, SmackDown, NXT, WrestleMania, Royal Rumble, SummerSlam, Survivor Series, Money in the Bank e Elimination Chamber.
- A memória de recomendação passa a usar explicitamente `shown_recommendations` com janela móvel de 7 dias por usuário, mantendo fallback local equivalente para evitar repetição mesmo em indisponibilidade temporária do backend.
- A composição visível fica rigidamente separada em `Indicação do Dia` com um Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem repetir a mesma mídia na mesma tela.
- O refresh/troca continua local ao bloco do Descobrir, sem recarregar a página inteira, e a r296 preserva as exclusões canônicas de vistos/Watchlist e os filtros combináveis do Calendário introduzidos na r295.

### Esportes / histórico presencial
- A navegação de Esportes é reduzida para exatamente quatro abas: `Próximos`, `Anteriores`, `Favoritos` e `Assistidos`; `Ao vivo` deixa de ser uma quinta aba independente.
- `Próximos` aceita somente eventos do dia corrente em `America/Sao_Paulo`; `Anteriores` limita o histórico operacional às últimas 72 horas; `Favoritos` mantém somente eventos de entidades favoritas e `Assistidos` usa o histórico persistido do usuário.
- `user_sport_watch_history` recebe `attended_in_person boolean default false` e `stadium_name text`, preservando compatibilidade com registros anteriores.
- `Marcar como assistido` abre um popover compacto com `📺 Assistido na TV / Tela` ou `🏟️ Fui ao Estádio (In Loco)`; no segundo caso o nome do estádio é opcional.
- Eventos presenciais recebem o badge âmbar `🏟️ No Estádio` em Assistidos e o Perfil passa a incluir a métrica `Jogos no Estádio`.

### Polimento Web
- `Assistir a Seguir` recebe padding/gap mais compacto, hierarquia tipográfica mais limpa e botão canônico de visto em 40x40, arredondado e com tratamento esmeralda.
- Métricas e pôsteres do Perfil ganham superfície translúcida, borda suave, raio consistente e hover discreto.
- Formulários de Configurações passam a compartilhar tratamento translúcido, borda/foco ciano e botões arredondados.
- Sidebar/containers laterais recebem glassmorphism sutil com fundo preto translúcido, borda branca de 10% e blur, preservando o bloqueio de overflow horizontal global.

### Build / validação
- Web atualizada para `1.0.87 / r296-official-1.0.87`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r296 adiciona testes estáticos e Chromium para composição sem duplicatas, filtros WWE/Drama/Documentário/nota/ano, quatro janelas de Esportes, métrica de estádio e identidade final do bundle.

## 1.0.86 — 2026-09-15 — Web r295

### Descobrir / autoridade pessoal
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam por uma autoridade unificada de histórico + Watchlist antes da pintura.
- A autoridade une `cinetracker_recommendation_state_v108`, `cinetracker_profile_media_dashboard_v0997_fast` e `cinetracker_list_snapshot_v247`, reduzindo vazamentos quando uma fonte individual estiver atrasada ou incompleta.
- Cards dessas cinco áreas preservam `+ Playlist` e recebem `✓ Visto`; após qualquer uma das ações, o título é retirado imediatamente da seleção atual e do estado local elegível.

### Calendário
- Adiciona filtros `Todos / Filmes / Séries` como eixo exclusivo e `Watchlist` como toggle independente.
- Permite combinações reais, inclusive `Séries + Watchlist` e `Filmes + Watchlist`.
- A coleta do Calendário deixa de depender da exclusão geral que removia a Watchlist antes da interface; itens futuros da Watchlist são mesclados e, quando necessário, hidratados pelo TMDB antes da filtragem.

### Pra Você / Indicação do Dia
- `100% Novos` recebe uma segunda barreira canônica contra títulos assistidos e títulos da Watchlist antes de toda pintura, mantendo as regras da r293 (TMDB >= 7,5, ano > 1990, sem WWE/Raw/SmackDown e sem repetição semanal).
- `Indicação do Dia` deixa de reutilizar picks antigos/Watchlist e passa a escolher somente um título válido do pool `100% Novos`, com seleção determinística por dia.
- Remove filtros `blur`/`backdrop-filter` herdados do bloco da indicação e solicita pôster de resolução maior quando a ponte de imagem está disponível.

### Build / validação
- Web atualizada para `1.0.86 / r295-official-1.0.86`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r295 adiciona validação estática e Chromium cobrindo união de estados pessoais, exclusão de vistos/Watchlist, ações Playlist/Visto, combinação `Séries + Watchlist`, `100% Novos` e Indicação do Dia sem blur.

## 1.0.85 — 2026-09-15 — Web r294

### Descobrir / densidade visual
- Corrige a composição mostrada no vídeo de validação: texto, ações e barra horizontal deixam de ficar excessivamente afastados e passam a formar um bloco vertical compacto.
- Cards Web desktop passam de 176x264 para 158x237; mobile Web preserva 154x231.
- O bloco de texto cai de 80px para 52px no desktop, mantendo título e metadados em uma linha com reticências.
- Gap horizontal dos trilhos cai de 16px para 8px e a reserva inferior do scroll de 16px para 6px.

### Top 10
- A geometria desktop passa a permitir 10 cards completos em uma linha na referência de 1920px usada no vídeo, em vez de exibir apenas 9 antes do scroll.
- O trilho continua com scroll horizontal local para viewports menores, sem reintroduzir overflow horizontal no documento.

### Ações / barra de rolagem
- Rodapé de Playlist/Trocar passa a fazer parte da altura efetiva do card/slot; os botões ficam acima da barra horizontal em vez de vazarem para a área inferior do scroller.
- Altura dos controles cai para 28px, com gap de 4px e margem superior de 2px.
- A faixa de ações de Títulos Relacionados/Semelhantes recebe a mesma compactação, preservando a autoridade de clique/ID da r286/r292/r293.

### Build / validação
- Web atualizada para `1.0.85 / r294-official-1.0.85`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- A r294 adiciona teste Chromium em viewport 1920x1032 para validar 10 cards no Top 10, 158x237, texto de 52px, footer contido no card e ordem conteúdo -> ações -> scrollbar.

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
