# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.5.0** | Código publicado / deploy Vercel |
| Android | **0.0.78** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Atualização Web 0.5.0 / Android 0.0.78

- toda versão Web e Android atualiza a versão exibida no rodapé de Configurações;
- séries usam globalmente o padrão `Temporada X • Episódio Y • vistos/total • Faltam N episódios`;
- Android Home/Assistir deixa de re-renderizar continuamente a mesma linha de progresso e elimina duplicações de metadados;
- Web mantém uma única entrada de Configurações e reativa a navegação das abas;
- Web Home remove o calendário de lançamentos;
- renderização de progresso passa a ser idempotente para evitar loops por MutationObserver;
- pré-carregamento e cache continuam ativos sem navegação serial entre abas.

A validação visual/funcional final depende de teste real no navegador e no aparelho Android.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
