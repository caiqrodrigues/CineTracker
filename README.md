# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.72** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.72

- gráfico do Perfil é mantido acima da seção `Histórico`;
- Descobrir filtra por ID e título e exibe somente conteúdo 100% novo, fora de Watchlist, acompanhamento e estados já vistos;
- Home e Assistir recebem limpeza de metadados repetidos e estabilização dos cards;
- carregamento preso da aba Assistir recebe recuperação controlada;
- nome do próximo episódio permanece maior e o botão `Assistido` centralizado;
- `ct52` deixa de ser carregado para evitar disputa com a camada atual do gráfico;
- transições/animações concorrentes dos cards são desativadas para reduzir tremor;
- Configurações/build Android apontam para `0.0.72`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
