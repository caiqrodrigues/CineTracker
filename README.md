# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.69** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.69

- notificações antigas/repetidas deixam de ser reenviadas; o backlog atual é absorvido como baseline da nova deduplicação;
- o worker de notificação não é mais disparado a cada restauração de sessão, ficando apenas o worker periódico único;
- temporadas recebem carregamento resiliente com timeout e retentativas;
- episódios passam a carregar novamente mesmo quando a chamada inicial fica presa;
- cada episódio mostra sua nota TMDB individual quando disponível;
- estado Assistido do episódio é preservado;
- Configurações exibe a build `0.0.69`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
