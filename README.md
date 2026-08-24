# 🎬 CineTracker

CineTracker é um companion multiplataforma para filmes, séries e animes, com conta única, biblioteca sincronizada, Watchlist, histórico, progresso de episódios, recomendações, descoberta TMDB, importação e backup. Notificações de lançamentos são nativas do Android.

## Versões atuais

| Plataforma | Versão | Status |
|---|---:|---|
| Web | **0.4.8** | Código publicado / deploy Vercel |
| Android | **0.0.73** | Runtime consolidado + pipeline de Release GitHub |
| Windows | — | Planejado |

## Produção

**Web:** https://mycinetracker.vercel.app

## Android 0.0.73

A 0.0.73 substitui a pilha de patches Android concorrentes por um único runtime `ct62.js`.

- Home monta `Continuar assistindo` diretamente do estado real;
- Assistir é controlado por uma única camada, com filtro de Exibição recolhido;
- Descobrir exclui qualquer título já conhecido por TMDB ID ou título;
- gráfico do Perfil é criado por uma única fonte e fica imediatamente acima de `Histórico`;
- detalhes, temporadas, episódios, nota individual e botão `Assistido` são tratados pelo mesmo runtime;
- módulos antigos continuam no repositório apenas como histórico e não são carregados pela Activity;
- build Android `0.0.73` / `versionCode 73`.

A validação visual/funcional final depende de instalação e teste real no aparelho.

## Arquitetura

Web e Android usam a mesma autenticação e o mesmo backend Supabase. Watchlist, histórico, progresso, favoritos e decisões manuais pertencem à conta, não ao dispositivo.

## Regra de publicação

Uma versão nova não é considerada concluída somente com binário/deploy. Código-fonte, documentação, versionamento e pipeline correspondente devem permanecer sincronizados. Android também exige Release + APK.
