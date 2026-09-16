# CineTracker Web 1.0.91 / r300

Correções baseadas no vídeo real de 16/09/2026.

## Perfil

- `Séries Watchlist` e `Filmes Watchlist` recebem o mesmo tratamento visual dos cards clicáveis de `Eventos assistidos` / `Jogos no Estádio`.
- A funcionalidade já existente desses cards é preservada; a r300 padroniza o feedback visual e o cursor sem reconstruir o Perfil.

## Esportes

- Remove a aba `Ao vivo` do renderer efetivamente visível da r255, em vez de tentar alterar a constante privada `SPORT_TABS255` fora do escopo dela.
- A ordem fica exatamente: `Próximos`, `Anteriores`, `Assistidos`, `Favoritos`.
- Se uma sessão antiga estiver parada em `live`, a interface volta para `Próximos` e repinta o feed.
- CSS de segurança também oculta qualquer controle legado `live` que reapareça durante um repaint.
- O problema do vídeo em que 16/09 exibia eventos de 12/09 como `Ao vivo` deixa de ficar acessível porque essa quinta aba é removida da autoridade visual real.

## Descobrir

- Adiciona watchdog finito para `Em alta`, `Populares`, `Novidades`, `Mais Aguardados`, `Mais bem avaliados` e `Calendário`.
- Se o renderer herdado ficar preso em `Carregando títulos…`, a r300 monta um fallback TMDB por aba, respeita o filtro Filme/Série e a autoridade pessoal da r295 e pinta pelo renderer real r288.
- Não usa `setInterval` nem observer perpétuo; as tentativas são limitadas e somente na rota/aba atual.
- `Pra Você` 1+3+3 e `Top 10` permanecem sob suas autoridades específicas herdadas.

## Plataforma

- Web: `1.0.91 / r300-official-1.0.91`.
- Android preservado em `1.0.20 / versionCode 10062`.
