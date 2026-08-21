# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.2.5** |
| Android | **0.0.1** |
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

## Linha Android

- **0.0.1** — shell Android leve apontando para a Web oficial, sessão via WebView/DOM storage, importação por seletor nativo, navegação externa no navegador e mesma conta/dados Supabase do Web.

O histórico consolidado fica em `CHANGELOG.md`.
