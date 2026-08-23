# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.67** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.67

A 0.0.67 consolida as correções recentes e corrige o desalinhamento que havia ficado entre Gradle e MainActivity.

- `versionCode 67` / `versionName 0.0.67`;
- MainActivity usa `APP_VERSION 0.0.67`, `apk=67` e carrega `ct56.js`;
- loaders presos recebem recuperação controlada;
- Perfil/Histórico/Descobrir/Assistir deixam de depender de rerenders extras;
- `Assistido` preserva o estado visual após marcação;
- metadados/notas duplicados são limpos;
- Configurações exibe a build `0.0.67`;
- Descobrir estrito e streaming deduplicado permanecem ativos.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
