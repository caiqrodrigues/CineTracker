# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.75** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.75

Esta etapa altera somente o carregamento inicial do aplicativo.

- Home, Assistir, Descobrir, Histórico, Perfil e Configurações são aquecidos em segundo plano na abertura;
- o WebView só é exibido depois desse pré-carregamento inicial;
- leituras Supabase/TMDB usadas nesse processo recebem cache temporário para reduzir `Carregando...` na primeira visita às abas;
- ao terminar, o aplicativo volta para Home e libera a interface;
- há fallback nativo para nunca deixar a tela invisível indefinidamente;
- versionCode `75` / versionName `0.0.75`.

Esta versão não inclui outras correções funcionais; elas serão tratadas uma por vez após validar este comportamento.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
