# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.70** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.70

- Home recupera `Continuar assistindo` sem depender do carregamento tardio da interface;
- aba Assistir recebe recuperação quando a lista fica presa em `Carregando...`;
- cards de séries mostram o nome do próximo episódio;
- nome do episódio foi aumentado e pode quebrar linha;
- botão `Assistido` fica centralizado abaixo do episódio, com resposta imediata e persistência em segundo plano;
- mesmo padrão aplicado na Home e na aba Assistir;
- mantidas correções de episódios, notas, streaming e notificações das versões anteriores;
- Configurações exibe a build `0.0.70`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
