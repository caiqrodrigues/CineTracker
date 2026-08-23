# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.62** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.62

A 0.0.62 acrescenta `ct52.js` à camada Android.

- Perfil: o gráfico diário passa a ser restaurado automaticamente se um rerender remover o componente.
- `Assistido`: botões ficam neutros/apagados por padrão e mudam para verde quando o item/episódio está efetivamente marcado como visto.
- Continuidade/Home: metadados quebrados ou repetidos nos cards são normalizados para uma linha estável.
- Carregamentos residuais fora de contexto são removidos para evitar telas presas em `Carregando detalhes...`/`Carregando histórico...`.
- Descobrir estrito e deduplicação de streaming da 0.0.61 são preservados.
- Configurações exibe a build `0.0.62`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
