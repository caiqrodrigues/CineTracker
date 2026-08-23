# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.68** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.68

A 0.0.68 corrige problemas observados na validação em vídeo da 0.0.67.

- deduplica notificações nativas por conteúdo estável e impede execuções imediatas concorrentes;
- marcação de próximo episódio passa a responder visualmente no instante do toque e persiste em segundo plano;
- corrige repetição crescente de notas/metadados em Home e Assistir;
- remove `Carregando perfil...` quando o gráfico já existe;
- limpa loaders residuais quando Histórico/Descobrir já renderizaram;
- mantém Descobrir estrito, streaming deduplicado, progresso e estados de acompanhamento;
- Configurações exibe a build `0.0.68`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
