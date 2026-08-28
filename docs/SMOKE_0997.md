# CineTracker 0.99.7 - smoke real

Status: pre-visualizacao; ainda nao aprovado para producao.

O video de smoke real da 0.99.7 reproduziu: navegacao duplicada, busca duplicada na Home, capas ausentes, detalhes abrindo correspondencias incorretas do TMDB, Descobrir bloqueado/errado e convivencia de UI legada com a nova UI do Perfil.

A branch `fix/0997-real-smoke-hotfix` agora possui tres camadas finais:
- v118: autoridade funcional da 0.99.7;
- v119: correcoes do primeiro smoke real;
- v120: autoridade estrutural final, emitida por ultimo para impedir que handlers/DOM legados reassumam Perfil e Descobrir.

Contrato do Perfil na v120, em ordem estrita e sem outros graficos/historicos independentes:
1. Estatisticas Basicas
2. Series
3. Filmes
4. Series Favoritas
5. Filmes Favoritos
6. Atores Favoritos
7. Episodios por Dia
8. Estatisticas Extras

O historico permanece incorporado ao scroll/revelacao das secoes de Series e Filmes; nao existe bloco extra de Historico, grafico secundario ou timeline adicional no Perfil.

O Descobrir v120 possui Pra Voce, Em alta, Mais aguardados, Populares, Mais bem avaliados e Calendario; filtros Todos/Series/Filmes e visualizacoes Lista/Carrossel/Grade. Falha na RPC de exclusoes nao derruba a tela: o fallback e reconstruido pelo dashboard do usuario.

Resolucao de filmes/series locais: titulo normalizado precisa corresponder exatamente a title/name/original_title/original_name, e o ano precisa ser exato quando informado. Match por `includes`, aproximacao de titulo e tolerancia de ano nao sao aceitos pela v120. Quando nao houver correspondencia segura, nenhum outro titulo sera aberto.

Capas e nomes visiveis sao reidratados progressivamente no runtime sem persistir correspondencias inseguras no banco.

Nao publicar a Edge Function, nao mergear o PR e nao gerar nova release Android antes do smoke real da preview.
