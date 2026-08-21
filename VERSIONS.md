# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.2.9** |
| Android | **0.0.5** |
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
- **0.2.6** — CineTracker clicável para Home, Descobrir com calendário e cache.
- **0.2.7** — Calendário pessoal, filtro Somente meus e Mais bem avaliados.
- **0.2.8** — detalhes clicáveis em Descobrir, elenco/filmografia, streaming/cinema e capas verticais.
- **0.2.9** — experiência de detalhes aplicada ao sistema inteiro (Home, Biblioteca, Descobrir e cards principais), capas originais também no legado, temporadas/episódios, status e duração de séries/filmes, relacionados filtrados fora da Watchlist e filmografia do mais recente para o mais antigo.

## Linha Android

- **0.0.1** — shell Android leve em WebView sincronizado com Web/Supabase.
- **0.0.2** — calendário e Descobrir sincronizados.
- **0.0.3** — calendário pessoal e Mais bem avaliados.
- **0.0.4** — detalhes, elenco/filmografia e capas originais.
- **0.0.5** — sincroniza a experiência global de mídia 0.2.9, incluindo temporadas/episódios e relacionados filtrados, mantendo o shell leve.

O histórico consolidado fica em `CHANGELOG.md`.
