# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.3.1** |
| Android | **0.0.7** |
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
- **0.2.9** — experiência de detalhes aplicada ao sistema inteiro, temporadas/episódios, status, duração, relacionados filtrados e filmografia cronológica.
- **0.3.0** — Home renomeada, Biblioteca em cards com capas oficiais e Histórico por data.
- **0.3.1** — Perfil completo com estatísticas, favoritos e histórico; calendário exclusivo das séries em acompanhamento; histórico Trakt consolidado com datas reais; filmografia com identificação Filme/Série.

## Linha Android

- **0.0.1** — shell Android leve em WebView sincronizado com Web/Supabase.
- **0.0.2** — calendário e Descobrir sincronizados.
- **0.0.3** — calendário pessoal e Mais bem avaliados.
- **0.0.4** — detalhes, elenco/filmografia e capas originais.
- **0.0.5** — experiência global de mídia 0.2.9.
- **0.0.6** — sincroniza Home/Biblioteca/Histórico da Web 0.3.0.
- **0.0.7** — sincroniza Perfil, estatísticas, favoritos e calendário de acompanhamento da Web 0.3.1.

O histórico consolidado fica em `CHANGELOG.md`.
