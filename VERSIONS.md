# CineTracker — Versionamento por plataforma

As versões do CineTracker são independentes por plataforma.

| Plataforma | Versão oficial atual |
|---|---:|
| Web | **0.2.1** |
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

## Linha Android

- **0.0.1** — estrutura inicial para reaproveitar o Web responsivo e compartilhar conta/dados via Supabase.

O histórico consolidado fica em `CHANGELOG.md`.
