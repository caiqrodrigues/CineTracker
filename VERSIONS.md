# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.2.8** |
| Android | **0.0.4** |
| Windows | **—** |

## Regra

- Mudança somente no Web → incrementa apenas Web.
- Mudança somente no Android → incrementa apenas Android.
- Mudança compartilhada que afete Web e Android → cada plataforma afetada recebe seu próprio incremento.
- Windows inicia sua linha de versão quando a implementação começar.

## Linha Web

- **0.1.x** — protótipos funcionais, refinamento visual, TMDB, capas, atores, streaming e recomendações.
- **0.2.0** — início da linha oficial com autenticação e persistência Supabase, importação JSON/ZIP e arquitetura de sincronização.
- **0.2.1** — identidade Black/Blue, favicon CineTracker, configurações de conta e correção da área de perfil.
- **0.2.2** — aplicação principal servida diretamente, configurações persistidas no perfil Supabase e recuperação resiliente do banco.
- **0.2.3** — login deixa de depender de TMDB/recomendações para entrar na aplicação.
- **0.2.4** — consolidação dos patches e correção da tela em branco.
- **0.2.5** — sidebar reenquadrada, Importar movido para Configurações, exportação JSON/ZIP e preferência de notificações sincronizada.
- **0.2.6** — CineTracker clicável para Home, Descobrir com Em Alta/Lançamentos/Mais Aguardados/Populares, calendário por data e abas Séries/Filmes, cache de descoberta para reduzir travamentos.
- **0.2.7** — `Lançamentos` renomeado para `Calendário` e movido para o fim, filtro `Somente meus` para séries acompanhadas/Watchlist e filmes da Watchlist, e nova aba `Mais bem avaliados` com separação entre Filmes e Séries.
- **0.2.8** — cards de Descobrir/Calendário clicáveis, tela completa de detalhes, sinopse, ano, elenco clicável, filmografia, streaming por assinatura/cinema, capas verticais oficiais e integração com a ficha IMDb.

## Linha Android

- **0.0.1** — shell Android leve apontando para a Web oficial, sessão via WebView/DOM storage, importação por seletor nativo, navegação externa no navegador e mesma conta/dados Supabase do Web.
- **0.0.2** — sincroniza a experiência Descobrir/Calendário da Web e incrementa versionCode mantendo o shell WebView leve.
- **0.0.3** — sincroniza filtro pessoal do Calendário e ranking Mais bem avaliados, mantendo o shell Android leve.
- **0.0.4** — sincroniza as novas telas de detalhes, elenco/filmografia e capas originais via mesma WebView de produção.

O histórico consolidado fica em `CHANGELOG.md`.
