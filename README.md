# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.63** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.63

A 0.0.63 é a build de publicação das correções implementadas na 0.0.62, com versionamento novo e marcador de build próprio (`ct53.js`).

- Perfil: restauração automática do gráfico diário quando um rerender o remove.
- `Assistido`: botão neutro/apagado por padrão e verde somente quando o item/episódio está efetivamente marcado como visto.
- Continuidade/Home: metadados dos cards normalizados para evitar concatenações repetidas/corrompidas.
- Carregamentos residuais fora de contexto são removidos.
- Descobrir estrito e deduplicação de streaming da 0.0.61 são preservados.
- Configurações exibe a build `0.0.63`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
