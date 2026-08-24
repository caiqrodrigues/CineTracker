# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.74** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.74

Esta versão segue a linha corrigida derivada da base oficial 0.0.71 e usa 0.0.74 para evitar conflito com as antigas 0.0.72/0.0.73 descartadas.

- gráfico do Perfil controlado por uma única camada e imediatamente acima de Histórico;
- Descobrir exclui tudo que já esteja visto, acompanhado, em progresso, concluído ou em Watchlist/Watch Later;
- Home/Continuar assistindo estabilizado sem observer permanente;
- Assistir mantém Carrossel/Grade/Lista dentro do filtro `Exibição`;
- nome do próximo episódio maior e botão `Assistido` centralizado;
- carregamento resiliente de episódios, notas individuais e streaming deduplicado preservados;
- Configurações/build Android apontam para `0.0.74`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.