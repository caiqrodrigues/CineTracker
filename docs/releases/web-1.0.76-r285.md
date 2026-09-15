# Web 1.0.76 / r285

Correção baseada no vídeo real posterior à r284.

- Home passa a publicar a lista de séries de forma atômica: o payload é reconciliado por completo em memória e só então substitui a visão anterior. Não existe mais o paint intermediário com uma série/episódio e um segundo paint trocando por outro estado.
- Formula 1 e NFL Super Bowl deixam de usar a arte sintética da r284 e passam a usar fotografias reais da Wikimedia Commons.
- Formula 1 usa foto de Valtteri Bottas no Singapore GP 2024, autor Henrikkoh333, CC BY 4.0: https://commons.wikimedia.org/wiki/File:Valtteri_Bottas_on_track,_Singapore_Grand_Prix_2024.jpg
- Super Bowl usa foto do campo do Super Bowl LI, Voice of America, domínio público: https://commons.wikimedia.org/wiki/File:Super_Bowl_LI_post-game.jpg
- O listener legado da r284 continua sendo o primeiro dono do clique do card na Home; a r285 substitui `ct284Open` pelo novo renderer para que esse clique abra os controles r285 em vez dos controles antigos.
- Os novos botões de temporada e de marcar assistido usam atributos próprios `data-ct285-*`, portanto não são interceptados pelo handler antigo `data-ct284-*`.
- Troca de temporada da F1 dá feedback imediato, usa token de geração e não permite que resposta atrasada de um ano anterior sobrescreva a última temporada escolhida.
- Marcar episódio assistido da F1/Super Bowl usa o writer canônico `cinetracker_mark_watch_v0994`, media_id 865/837, com ativação por `pointerup` e `click` deduplicado.
- Stuart mantém poster real via TMDB 287620.
- Android permanece 1.0.20 / versionCode 10062.
