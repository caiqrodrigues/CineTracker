# CineTracker Web 0.4.8

A Web é a implementação de navegador do CineTracker e compartilha conta, biblioteca, histórico, progresso, Watchlist e metadados com o Android através do Supabase e TMDB.

## Recursos atuais

- autenticação e sessão Supabase;
- Home com Watchlist e recomendações;
- Assistir com Filmes/Séries e modos Carrossel, Grade e Lista;
- séries separadas em Em dia, Acompanhando, Juntando poeira e Não iniciadas;
- série → temporada → episódio, com marcação persistente de episódios vistos;
- Descobrir com capas, nomes, busca, filtros e grade compacta;
- Histórico e favoritos;
- Perfil com estatísticas e Tempo de Tela diário interativo;
- clique no dia para consultar o que foi assistido;
- alteração de e-mail e senha;
- importação e exportação de backup;
- resolvedor global de nomes/capas com cache.

Notificações de lançamentos e episódios são intencionalmente exclusivas do Android.

A camada final de paridade com Android 0.0.48 está em `patch-v046.js`. Ela é carregada por último pelo `scripts/build-web.mjs` para evitar que comportamentos legados sobrescrevam as telas atuais.

Detalhes: `docs/releases/web-0.4.8.md`.
