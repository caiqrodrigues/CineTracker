# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.64** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.64

A 0.0.64 corrige problemas observados na validação visual da 0.0.63.

- elimina repetição de notas nos cards;
- compacta cards de acompanhamento/continuidade;
- `Assistido` fica neutro por padrão e verde apenas quando visto/clicado;
- séries em andamento mostram `Acompanhando` em vez de Watchlist contraditória;
- remove `Carregando perfil...` residual quando o Perfil já está disponível;
- unifica a apresentação de notas no detalhe de mídia;
- preserva Descobrir estrito e deduplicação de streaming;
- Configurações exibe a build `0.0.64`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
