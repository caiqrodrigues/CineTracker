# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.9** | Código publicado / deploy Vercel |
| Android | **0.0.77** | Código + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Atualização Web 0.4.9 / Android 0.0.77

- pré-carregamento de informações e imagens com cache e deduplicação de requisições;
- séries passam a exibir globalmente: `Temporada X • Episódio Y • vistos/total • Faltam N episódios`;
- Web Home preserva o trio da Watchlist: 1 filme, 1 série e 1 anime;
- Web Biblioteca recebe correção adicional de posters/imagens;
- Web Descobrir filtra títulos já vistos, acompanhados ou em Watchlist, alinhando o comportamento ao Android;
- Web Perfil mantém gráfico de atividade acima do Histórico e remove Horário de pico/analytics duplicados;
- Importar deixa de aparecer como aba própria na Web, permanecendo dentro de Configurações;
- Android adiciona `ct62.js` para progresso global de séries e aquecimento de imagens.

A validação visual/funcional final depende de teste real no navegador e no aparelho Android.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
