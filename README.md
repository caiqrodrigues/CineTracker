# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.71** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.71

- reduz tremor/re-render recorrente retirando patches intermediários redundantes do runtime carregado;
- Home e Assistir deixam de atualizar em loop contínuo;
- gráfico do Perfil recebe restauração estável quando desaparecer;
- Carrossel, Grade e Lista passam para um filtro de exibição recolhido;
- mantém nome do próximo episódio maior e botão `Assistido` centralizado;
- mantém carregamento resiliente de episódios, notas individuais, Descobrir estrito e streaming deduplicado;
- Configurações/build Android apontam para `0.0.71`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
