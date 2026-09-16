# Changelog

Mudanças relevantes do CineTracker. A partir da 1.0.0, esta é a baseline oficial; detalhes históricos completos da linha 0.x permanecem preservados no histórico Git e nos documentos de `docs/releases/`.

## 1.0.91 — 2026-09-16 — Web r300

### Perfil / Watchlist
- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual clicável aplicado aos cards esportivos de estatísticas, preservando as ações já existentes desses contadores.

### Esportes
- Remove a aba `Ao vivo` do DOM efetivamente renderizado pela autoridade r255, em vez de tentar alterar constantes privadas fora do escopo do renderer.
- A navegação fica exatamente na ordem `Próximos`, `Anteriores`, `Assistidos`, `Favoritos`.
- Sessões antigas que ainda estejam em `live` retornam para `Próximos`; uma barreira CSS impede que controles `Ao vivo` legados reapareçam durante repaints.
- Corrige a divergência mostrada no vídeo de 16/09, em que a aba `Ao vivo` ainda exibia partidas de 12/09.

### Descobrir
- Adiciona recuperação finita para `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário` quando o fluxo herdado permanece preso em `Carregando títulos…`.
- O fallback usa TMDB, respeita o filtro Filme/Série e a autoridade pessoal existente, e pinta pelo renderer real r288 sem observer ou `setInterval` perpétuo.
- `Pra Você` 1+3+3 e `Top 10` permanecem sob as autoridades específicas das releases anteriores.

### Build / validação
- Web atualizada para `1.0.91 / r300-official-1.0.91`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium reproduzindo os pontos do vídeo: Watchlist com estilo clicável, cinco abas esportivas legadas reduzidas para quatro na ordem aprovada e detecção do loading persistente do Descobrir.

## 1.0.90 — 2026-09-16 — Web r299

### Perfil / histórico esportivo
- `Eventos assistidos` passa a ser clicável e abre o histórico esportivo do usuário.
- `Jogos no Estádio` passa a ser clicável e abre somente os eventos marcados presencialmente.
- As listas exibem evento, competição e data quando disponíveis, sem mostrar nome do estádio.

### Presença no estádio
- O fluxo real de Esportes mantém somente `📺 Assistido na TV / Tela` e `🏟️ Fui ao Estádio`.
- A opção presencial salva `attended_in_person = true` com `stadium_name = null`; o campo legado para digitar o estádio deixa de participar da interface.
- Badges presenciais mostram apenas `🏟️ No Estádio`.

### Build / validação
- Web atualizada para `1.0.90 / r299-official-1.0.90`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona testes estáticos e Chromium para os dois históricos clicáveis e para o fluxo presencial sem captura de nome do estádio.

## 1.0.89 — 2026-09-15 — Web r298

### Esportes / presença presencial
- Intercepta o botão esportivo real `data-ct255-watch` antes do handler legado e disponibiliza a escolha TV/Tela ou Estádio.
- Registros presenciais usam o RPC canônico de histórico esportivo e recebem badge `🏟️ No Estádio`.

### Perfil
- `Jogos no Estádio` deixa de ser inserido em uma grade genérica próxima de Séries e passa a existir somente no painel semântico `Esportes assistidos`.

### Descobrir / Pra Você
- Introduz pipeline finito que aguarda autoridade pessoal, memória de recomendações e pools TMDB antes da pintura.
- A composição fica em `Indicação do Dia` com 1 Filme, `Da sua Watchlist` com Filme + Série + Anime e `100% Novos` com Filme + Série + Anime, sem duplicações.
- Falta real de candidato passa a produzir estado explícito em vez de spinner infinito.

### Build / validação
- Web atualizada para `1.0.89 / r298-official-1.0.89`; Android permanece `1.0.20 / versionCode 10062`.
- Adiciona regressões Chromium para o botão esportivo real, posição da métrica no Perfil e composição 1+3+3 do `Pra Você`.

## 1.0.88 — 2026-09-15 — Web r297

### Boot / tela preta
- Corrige a tela preta/vazia pública introduzida no bundle da r296: `runtime-r295-browse-actions-self-scope-fix.js` podia lançar `r295 browse self-scope fix missing r295 authority` antes de `boot()`, interrompendo a aplicação com `#app` vazio.
- A proteção r295 deixa de derrubar o bundle durante a inicialização legítima e mantém fallback compatível com as regressões históricas.

### Descobrir / donos reais de execução
- A validação do bundle final identificou a causa arquitetural complementar: desde a r288 os renderers/carregador vivos do Descobrir são `window.__ctR288PaintBrowse`, `window.__ctR288PaintForYou` e `window.__ctR288LoadDiscover`; r295/r296 ainda interceptavam nomes legados que não eram os donos efetivos em produção.
- Adiciona `runtime-r297-live-discover-owner-bridge.js`, conectando a autoridade pessoal da r295 e as regras rígidas da r296 diretamente aos três donos reais r288.
- `Em alta`, `Populares`, `Novidades`, `Mais Aguardados` e `Mais bem avaliados` passam pela exclusão canônica de vistos/Watchlist no renderer efetivamente usado pela página e recebem as ações r295 no mesmo caminho.
- `Pra Você` executa sanitização pessoal + composição rígida r296 antes da pintura real, preservando nota >= 7,5, ano > 1990, exclusões de Drama/Documentário-only e WWE, zero duplicatas e anti-repetição de 7 dias.
- O carregador vivo passa a aguardar a autoridade pessoal nos fluxos públicos/Calendário/Pra Você sem reconstruir a página inteira.

### Build / validação
- Web atualizada para `1.0.88 / r297-official-1.0.88`; Android permanece `1.0.20 / versionCode 10062` sem alteração.
- Adiciona regressão Chromium específica com os mesmos nomes `window.__ctR288...` do bundle oficial, cobrindo exclusão de vistos/Watchlist, ações, `Pra Você` rígido e chamada ao carregador autorizado.
- Adiciona regressão Chromium do bundle final completo `app-v297.js`, exigindo `boot()` real, `#app` preenchido, ausência de page error e os três hooks r297 conectados.
- O `production_smoke` valida identidade r297, assets públicos e DOM renderizado antes de considerar a release concluída.
- Todo o escopo funcional da r296 permanece preservado: quatro abas de Esportes, presença no estádio, métrica do Perfil e polimento Web.

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